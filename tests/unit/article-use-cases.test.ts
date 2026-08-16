import { beforeEach, describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import type { AuditEntry, AuditLogPort } from "@/shared/application/audit-log-port";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { AdminArticleAggregate, Article } from "@/modules/articles/domain/article";
import type {
  ArticleRepositoryPort,
  ArticleStatusChange,
  ArticleWriteOutcome,
} from "@/modules/articles/application/ports/article-repository-port";
import type {
  ArticleCreateInput,
  ArticleUpdateInput,
} from "@/modules/articles/application/article-schema";
import {
  ArchiveArticle,
  CreateArticle,
  GetAdminArticle,
  ListAdminArticles,
  PublishArticle,
  UnpublishArticle,
  UpdateArticle,
} from "@/modules/articles/application/use-cases/article-use-cases";

class FakeArticleRepository implements ArticleRepositoryPort {
  private store = new Map<string, AdminArticleAggregate>();
  private seq = 0;

  async findBySlug(slug: string): Promise<{ id: string } | null> {
    for (const agg of this.store.values()) {
      if (agg.article.slug === slug) return { id: agg.article.id };
    }
    return null;
  }
  async findAdminById(id: string): Promise<AdminArticleAggregate | null> {
    return this.store.get(id) ?? null;
  }
  async listAdmin(): Promise<readonly Article[]> {
    return [...this.store.values()].map((a) => a.article);
  }
  async create(input: ArticleCreateInput): Promise<Article> {
    const id = `art-${++this.seq}`;
    const article: Article = {
      id,
      slug: input.slug,
      status: "draft",
      featured: input.featured,
      featuredOrder: input.featuredOrder,
      coverMediaId: input.coverMediaId,
      publishedAt: null,
      rowVersion: 1,
    };
    this.store.set(id, {
      article,
      translations: input.translations.map((t) => ({
        locale: t.locale,
        title: t.title,
        summary: t.summary,
        bodyMd: t.bodyMd,
      })),
      tags: input.tags.map((t) => ({ tagId: t.tagId, sortOrder: t.sortOrder })),
    });
    return article;
  }
  async update(
    id: string,
    expectedRowVersion: number,
    patch: ArticleUpdateInput,
  ): Promise<ArticleWriteOutcome> {
    const agg = this.store.get(id);
    if (!agg) return { kind: "not_found" };
    if (agg.article.rowVersion !== expectedRowVersion) return { kind: "stale" };
    const article: Article = {
      ...agg.article,
      slug: patch.slug ?? agg.article.slug,
      featured: patch.featured ?? agg.article.featured,
      rowVersion: agg.article.rowVersion + 1,
    };
    this.store.set(id, { ...agg, article });
    return { kind: "updated", article };
  }
  async setStatus(
    id: string,
    expectedRowVersion: number,
    change: ArticleStatusChange,
  ): Promise<ArticleWriteOutcome> {
    const agg = this.store.get(id);
    if (!agg) return { kind: "not_found" };
    if (agg.article.rowVersion !== expectedRowVersion) return { kind: "stale" };
    const article: Article = {
      ...agg.article,
      status: change.status,
      publishedAt: change.publishedAt,
      rowVersion: agg.article.rowVersion + 1,
    };
    this.store.set(id, { ...agg, article });
    return { kind: "updated", article };
  }
}

class FakeAudit implements AuditLogPort {
  readonly entries: AuditEntry[] = [];
  async record(entry: AuditEntry): Promise<void> {
    this.entries.push(entry);
  }
}

const owner = AdminUser.create("owner-1", {
  email: "owner@example.com",
  role: "owner_admin",
  status: "active",
});
const viewer = AdminUser.create("viewer-1", {
  email: "viewer@example.com",
  role: "viewer",
  status: "active",
});

const createData = {
  slug: "hello-world",
  translations: [{ locale: "vi", title: "Xin chào" }],
};

let repo: FakeArticleRepository;
let audit: FakeAudit;

beforeEach(() => {
  repo = new FakeArticleRepository();
  audit = new FakeAudit();
});

async function seedDraft(): Promise<Article> {
  const create = new CreateArticle({ repo, audit });
  const r = await create.execute({ admin: owner, data: createData });
  if (!isOk(r)) throw new Error("seed failed");
  return r.value;
}

describe("CreateArticle", () => {
  it("creates a draft and audits", async () => {
    const uc = new CreateArticle({ repo, audit });
    const r = await uc.execute({ admin: owner, data: createData });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.status).toBe("draft");
      expect(r.value.rowVersion).toBe(1);
    }
    expect(audit.entries.at(-1)?.action).toBe("article.create");
  });

  it("denies a viewer and writes no audit", async () => {
    const uc = new CreateArticle({ repo, audit });
    const r = await uc.execute({ admin: viewer, data: createData });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_FORBIDDEN");
    expect(audit.entries).toHaveLength(0);
  });

  it("rejects invalid input", async () => {
    const uc = new CreateArticle({ repo, audit });
    const r = await uc.execute({ admin: owner, data: { slug: "x-post", translations: [] } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_VALIDATION");
  });

  it("rejects a duplicate slug", async () => {
    await seedDraft();
    const uc = new CreateArticle({ repo, audit });
    const r = await uc.execute({ admin: owner, data: createData });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_SLUG_CONFLICT");
  });
});

describe("UpdateArticle (optimistic concurrency)", () => {
  it("updates with the current version", async () => {
    const a = await seedDraft();
    const uc = new UpdateArticle({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      id: a.id,
      expectedRowVersion: a.rowVersion,
      patch: { featured: true },
    });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.rowVersion).toBe(2);
  });

  it("rejects a stale row_version", async () => {
    const a = await seedDraft();
    const uc = new UpdateArticle({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      id: a.id,
      expectedRowVersion: 99,
      patch: { featured: true },
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_STALE_WRITE");
  });

  it("returns not found for an unknown id", async () => {
    const uc = new UpdateArticle({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      id: "missing",
      expectedRowVersion: 1,
      patch: {},
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_NOT_FOUND");
  });

  it("rejects a slug that collides with another article", async () => {
    const first = await seedDraft();
    const create = new CreateArticle({ repo, audit });
    const second = await create.execute({
      admin: owner,
      data: { slug: "second-post", translations: [{ locale: "vi", title: "Hai" }] },
    });
    if (!isOk(second)) throw new Error("seed failed");
    const uc = new UpdateArticle({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      id: second.value.id,
      expectedRowVersion: second.value.rowVersion,
      patch: { slug: first.slug },
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_SLUG_CONFLICT");
  });
});

describe("Publish / Unpublish / Archive transitions", () => {
  it("publishes a draft then unpublishes", async () => {
    const a = await seedDraft();
    const publish = new PublishArticle({ repo, audit });
    const pub = await publish.execute({ admin: owner, id: a.id, expectedRowVersion: 1 });
    expect(isOk(pub)).toBe(true);
    if (isOk(pub)) expect(pub.value.status).toBe("published");

    const unpublish = new UnpublishArticle({ repo, audit });
    const un = await unpublish.execute({ admin: owner, id: a.id, expectedRowVersion: 2 });
    expect(isOk(un)).toBe(true);
    if (isOk(un)) expect(un.value.status).toBe("draft");
  });

  it("cannot unpublish a draft (state error)", async () => {
    const a = await seedDraft();
    const unpublish = new UnpublishArticle({ repo, audit });
    const r = await unpublish.execute({ admin: owner, id: a.id, expectedRowVersion: 1 });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_STATE_INVALID");
  });

  it("cannot publish an archived article", async () => {
    const a = await seedDraft();
    const archive = new ArchiveArticle({ repo, audit });
    await archive.execute({ admin: owner, id: a.id, expectedRowVersion: 1 });
    const publish = new PublishArticle({ repo, audit });
    const r = await publish.execute({ admin: owner, id: a.id, expectedRowVersion: 2 });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_STATE_INVALID");
  });

  it("denies publish to a viewer", async () => {
    const a = await seedDraft();
    const publish = new PublishArticle({ repo, audit });
    const r = await publish.execute({ admin: viewer, id: a.id, expectedRowVersion: 1 });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_FORBIDDEN");
  });
});

describe("Admin reads", () => {
  it("list requires authentication", async () => {
    const list = new ListAdminArticles({ repo });
    expect(isErr(await list.execute({ admin: null }))).toBe(true);
  });

  it("get returns not found for an unknown id", async () => {
    const get = new GetAdminArticle({ repo });
    const r = await get.execute({ admin: owner, id: "missing" });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("ARTICLE_NOT_FOUND");
  });
});
