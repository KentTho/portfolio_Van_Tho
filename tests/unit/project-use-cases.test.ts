import { beforeEach, describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import type { AuditEntry, AuditLogPort } from "@/shared/application/audit-log-port";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { AdminProjectAggregate, Project } from "@/modules/projects/domain/project";
import type {
  ProjectRepositoryPort,
  StatusChange,
  WriteOutcome,
} from "@/modules/projects/application/ports/project-repository-port";
import type {
  ProjectCreateInput,
  ProjectUpdateInput,
} from "@/modules/projects/application/project-schema";
import {
  ArchiveProject,
  CreateProject,
  GetAdminProject,
  ListAdminProjects,
  PublishProject,
  UnpublishProject,
  UpdateProject,
} from "@/modules/projects/application/use-cases/project-use-cases";

class FakeProjectRepository implements ProjectRepositoryPort {
  private store = new Map<string, AdminProjectAggregate>();
  private seq = 0;

  async findBySlug(slug: string): Promise<{ id: string } | null> {
    for (const agg of this.store.values()) {
      if (agg.project.slug === slug) return { id: agg.project.id };
    }
    return null;
  }
  async findAdminById(id: string): Promise<AdminProjectAggregate | null> {
    return this.store.get(id) ?? null;
  }
  async listAdmin(): Promise<readonly Project[]> {
    return [...this.store.values()].map((a) => a.project);
  }
  async create(input: ProjectCreateInput): Promise<Project> {
    const id = `proj-${++this.seq}`;
    const project: Project = {
      id,
      slug: input.slug,
      status: "draft",
      visibility: input.visibility,
      category: input.category,
      featured: input.featured,
      featuredOrder: input.featuredOrder,
      role: input.role,
      publishedAt: null,
      rowVersion: 1,
    };
    this.store.set(id, {
      project,
      translations: input.translations.map((t) => ({
        locale: t.locale,
        title: t.title,
        tagline: t.tagline,
        summary: t.summary,
      })),
      technologies: [],
      links: [],
      metrics: [],
      media: [],
      sections: [],
    });
    return project;
  }
  async update(
    id: string,
    expectedRowVersion: number,
    patch: ProjectUpdateInput,
  ): Promise<WriteOutcome> {
    const agg = this.store.get(id);
    if (!agg) return { kind: "not_found" };
    if (agg.project.rowVersion !== expectedRowVersion) return { kind: "stale" };
    const project: Project = {
      ...agg.project,
      slug: patch.slug ?? agg.project.slug,
      role: patch.role ?? agg.project.role,
      visibility: patch.visibility ?? agg.project.visibility,
      rowVersion: agg.project.rowVersion + 1,
    };
    this.store.set(id, { ...agg, project });
    return { kind: "updated", project };
  }
  async setStatus(
    id: string,
    expectedRowVersion: number,
    change: StatusChange,
  ): Promise<WriteOutcome> {
    const agg = this.store.get(id);
    if (!agg) return { kind: "not_found" };
    if (agg.project.rowVersion !== expectedRowVersion) return { kind: "stale" };
    const project: Project = {
      ...agg.project,
      status: change.status,
      publishedAt: change.publishedAt,
      rowVersion: agg.project.rowVersion + 1,
    };
    this.store.set(id, { ...agg, project });
    return { kind: "updated", project };
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
  slug: "clean-arch",
  translations: [{ locale: "vi", title: "Portfolio" }],
};

let repo: FakeProjectRepository;
let audit: FakeAudit;

beforeEach(() => {
  repo = new FakeProjectRepository();
  audit = new FakeAudit();
});

async function seedDraft(): Promise<Project> {
  const create = new CreateProject({ repo, audit });
  const r = await create.execute({ admin: owner, data: createData });
  if (!isOk(r)) throw new Error("seed failed");
  return r.value;
}

describe("CreateProject", () => {
  it("creates a draft and audits", async () => {
    const uc = new CreateProject({ repo, audit });
    const r = await uc.execute({ admin: owner, data: createData });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.status).toBe("draft");
      expect(r.value.rowVersion).toBe(1);
    }
    expect(audit.entries.at(-1)?.action).toBe("project.create");
  });

  it("denies a viewer and writes no audit", async () => {
    const uc = new CreateProject({ repo, audit });
    const r = await uc.execute({ admin: viewer, data: createData });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROJECT_FORBIDDEN");
    expect(audit.entries).toHaveLength(0);
  });

  it("rejects invalid input", async () => {
    const uc = new CreateProject({ repo, audit });
    const r = await uc.execute({ admin: owner, data: { slug: "x", translations: [] } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROJECT_VALIDATION");
  });

  it("rejects a duplicate slug", async () => {
    await seedDraft();
    const uc = new CreateProject({ repo, audit });
    const r = await uc.execute({ admin: owner, data: createData });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROJECT_SLUG_CONFLICT");
  });
});

describe("UpdateProject (optimistic concurrency)", () => {
  it("updates with the current version", async () => {
    const p = await seedDraft();
    const uc = new UpdateProject({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      id: p.id,
      expectedRowVersion: p.rowVersion,
      patch: { role: "Lead Engineer" },
    });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.rowVersion).toBe(2);
  });

  it("rejects a stale row_version", async () => {
    const p = await seedDraft();
    const uc = new UpdateProject({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      id: p.id,
      expectedRowVersion: 99,
      patch: { role: "X" },
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROJECT_STALE_WRITE");
  });

  it("returns not found for an unknown id", async () => {
    const uc = new UpdateProject({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      id: "missing",
      expectedRowVersion: 1,
      patch: {},
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROJECT_NOT_FOUND");
  });
});

describe("Publish / Unpublish / Archive transitions", () => {
  it("publishes a draft then unpublishes", async () => {
    const p = await seedDraft();
    const publish = new PublishProject({ repo, audit });
    const pub = await publish.execute({ admin: owner, id: p.id, expectedRowVersion: 1 });
    expect(isOk(pub)).toBe(true);
    if (isOk(pub)) expect(pub.value.status).toBe("published");

    const unpublish = new UnpublishProject({ repo, audit });
    const un = await unpublish.execute({ admin: owner, id: p.id, expectedRowVersion: 2 });
    expect(isOk(un)).toBe(true);
    if (isOk(un)) expect(un.value.status).toBe("draft");
  });

  it("cannot unpublish a draft (state error)", async () => {
    const p = await seedDraft();
    const unpublish = new UnpublishProject({ repo, audit });
    const r = await unpublish.execute({ admin: owner, id: p.id, expectedRowVersion: 1 });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROJECT_STATE_INVALID");
  });

  it("cannot publish an archived project", async () => {
    const p = await seedDraft();
    const archive = new ArchiveProject({ repo, audit });
    await archive.execute({ admin: owner, id: p.id, expectedRowVersion: 1 });
    const publish = new PublishProject({ repo, audit });
    const r = await publish.execute({ admin: owner, id: p.id, expectedRowVersion: 2 });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROJECT_STATE_INVALID");
  });

  it("denies publish to a viewer", async () => {
    const p = await seedDraft();
    const publish = new PublishProject({ repo, audit });
    const r = await publish.execute({ admin: viewer, id: p.id, expectedRowVersion: 1 });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROJECT_FORBIDDEN");
  });
});

describe("Admin reads", () => {
  it("list requires authentication", async () => {
    const list = new ListAdminProjects({ repo });
    expect(isErr(await list.execute({ admin: null }))).toBe(true);
  });

  it("get returns not found for an unknown id", async () => {
    const get = new GetAdminProject({ repo });
    const r = await get.execute({ admin: owner, id: "missing" });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROJECT_NOT_FOUND");
  });
});
