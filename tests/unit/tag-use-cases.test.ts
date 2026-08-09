import { beforeEach, describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import type { AuditEntry, AuditLogPort } from "@/shared/application/audit-log-port";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { Tag } from "@/modules/tags/domain/tag";
import type { TagRepositoryPort } from "@/modules/tags/application/ports/tag-repository-port";
import type { TagCreateInput, TagUpdateInput } from "@/modules/tags/application/tag-schema";
import {
  ArchiveTag,
  CreateTag,
  GetTag,
  ListTags,
  UpdateTag,
} from "@/modules/tags/application/use-cases/tag-use-cases";

class FakeTagRepository implements TagRepositoryPort {
  private rows = new Map<string, Tag>();
  private seq = 0;
  async listAll(): Promise<readonly Tag[]> {
    return [...this.rows.values()];
  }
  async findById(id: string): Promise<Tag | null> {
    return this.rows.get(id) ?? null;
  }
  async findBySlug(slug: string): Promise<Tag | null> {
    return [...this.rows.values()].find((t) => t.slug === slug) ?? null;
  }
  async create(input: TagCreateInput): Promise<Tag> {
    const id = `tag-${++this.seq}`;
    const row: Tag = { id, ...input };
    this.rows.set(id, row);
    return row;
  }
  async update(id: string, patch: TagUpdateInput): Promise<Tag | null> {
    const existing = this.rows.get(id);
    if (!existing) return null;
    const next = {
      ...existing,
      ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)),
    };
    this.rows.set(id, next);
    return next;
  }
  async softDelete(id: string): Promise<boolean> {
    return this.rows.delete(id);
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

let repo: FakeTagRepository;
let audit: FakeAudit;
beforeEach(() => {
  repo = new FakeTagRepository();
  audit = new FakeAudit();
});

describe("Tag use-cases", () => {
  it("creates and audits", async () => {
    const r = await new CreateTag({ repo, audit }).execute({
      admin: owner,
      data: { slug: "clean-arch", name: "Clean Architecture" },
    });
    expect(isOk(r)).toBe(true);
    expect(audit.entries[0]?.action).toBe("tag.create");
  });

  it("denies a viewer write", async () => {
    const r = await new CreateTag({ repo, audit }).execute({
      admin: viewer,
      data: { slug: "x", name: "X" },
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TAG_FORBIDDEN");
  });

  it("rejects a duplicate slug", async () => {
    const uc = new CreateTag({ repo, audit });
    await uc.execute({ admin: owner, data: { slug: "dup", name: "A" } });
    const r = await uc.execute({ admin: owner, data: { slug: "dup", name: "B" } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TAG_SLUG_CONFLICT");
  });

  it("rejects invalid input", async () => {
    const r = await new CreateTag({ repo, audit }).execute({
      admin: owner,
      data: { slug: "Bad Slug", name: "" },
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TAG_VALIDATION");
  });

  it("updates without clobbering, and blocks slug collision", async () => {
    const create = new CreateTag({ repo, audit });
    const a = await create.execute({ admin: owner, data: { slug: "a", name: "A", sortOrder: 3 } });
    await create.execute({ admin: owner, data: { slug: "b", name: "B" } });
    const id = isOk(a) ? a.value.id : "";
    const upd = await new UpdateTag({ repo, audit }).execute({
      admin: owner,
      id,
      patch: { name: "A2" },
    });
    expect(isOk(upd)).toBe(true);
    if (isOk(upd)) {
      expect(upd.value.name).toBe("A2");
      expect(upd.value.sortOrder).toBe(3);
    }
    const clash = await new UpdateTag({ repo, audit }).execute({
      admin: owner,
      id,
      patch: { slug: "b" },
    });
    expect(isErr(clash)).toBe(true);
    if (isErr(clash)) expect(clash.error.code).toBe("TAG_SLUG_CONFLICT");
  });

  it("archives and reports not-found", async () => {
    const create = await new CreateTag({ repo, audit }).execute({
      admin: owner,
      data: { slug: "z", name: "Z" },
    });
    const id = isOk(create) ? create.value.id : "";
    expect(isOk(await new ArchiveTag({ repo, audit }).execute({ admin: owner, id }))).toBe(true);
    const missing = await new ArchiveTag({ repo, audit }).execute({ admin: owner, id: "nope" });
    expect(isErr(missing)).toBe(true);
    if (isErr(missing)) expect(missing.error.code).toBe("TAG_NOT_FOUND");
  });

  it("reads require authentication", async () => {
    expect(isErr(await new ListTags({ repo }).execute({ admin: null }))).toBe(true);
    expect(isErr(await new GetTag({ repo }).execute({ admin: null, id: "x" }))).toBe(true);
  });
});
