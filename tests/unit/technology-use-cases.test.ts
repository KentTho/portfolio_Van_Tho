import { beforeEach, describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import type { AuditEntry, AuditLogPort } from "@/shared/application/audit-log-port";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { Technology } from "@/modules/technologies/domain/technology";
import type { TechnologyRepositoryPort } from "@/modules/technologies/application/ports/technology-repository-port";
import type {
  TechnologyCreateInput,
  TechnologyUpdateInput,
} from "@/modules/technologies/application/technology-schema";
import {
  ArchiveTechnology,
  CreateTechnology,
  GetTechnology,
  ListTechnologies,
  SetTechnologyVisibility,
  UpdateTechnology,
} from "@/modules/technologies/application/use-cases/technology-use-cases";

/** Deterministic in-memory repository — no DB, no framework. */
class FakeTechnologyRepository implements TechnologyRepositoryPort {
  private rows = new Map<string, Technology>();
  private seq = 0;

  async listVisible(): Promise<readonly Technology[]> {
    return [...this.rows.values()].filter((t) => t.isVisible);
  }
  async listAll(): Promise<readonly Technology[]> {
    return [...this.rows.values()];
  }
  async findBySlug(slug: string): Promise<Technology | null> {
    return [...this.rows.values()].find((t) => t.slug === slug) ?? null;
  }
  async findById(id: string): Promise<Technology | null> {
    return this.rows.get(id) ?? null;
  }
  async create(input: TechnologyCreateInput): Promise<Technology> {
    const id = `tech-${++this.seq}`;
    const row: Technology = { id, ...input };
    this.rows.set(id, row);
    return row;
  }
  async update(id: string, patch: TechnologyUpdateInput): Promise<Technology | null> {
    const existing = this.rows.get(id);
    if (!existing) return null;
    const next = { ...existing, ...definedOnly(patch) };
    this.rows.set(id, next);
    return next;
  }
  async setVisibility(id: string, isVisible: boolean): Promise<Technology | null> {
    const existing = this.rows.get(id);
    if (!existing) return null;
    const next = { ...existing, isVisible };
    this.rows.set(id, next);
    return next;
  }
  async softDelete(id: string): Promise<boolean> {
    return this.rows.delete(id);
  }
}

function definedOnly<T extends object>(patch: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
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
const suspended = AdminUser.create("owner-2", {
  email: "owner@example.com",
  role: "owner_admin",
  status: "suspended",
});

const validData = {
  slug: "next-js",
  name: "Next.js",
  category: "frontend",
  website: "https://nextjs.org",
} as const;

let repo: FakeTechnologyRepository;
let audit: FakeAudit;

beforeEach(() => {
  repo = new FakeTechnologyRepository();
  audit = new FakeAudit();
});

describe("CreateTechnology", () => {
  it("creates and audits for an active owner_admin", async () => {
    const uc = new CreateTechnology({ repo, audit });
    const r = await uc.execute({ admin: owner, data: validData });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.slug).toBe("next-js");
    expect(audit.entries).toHaveLength(1);
    expect(audit.entries[0]?.action).toBe("technology.create");
    expect(audit.entries[0]?.actorUserId).toBe("owner-1");
  });

  it("denies an unauthenticated caller (no audit)", async () => {
    const uc = new CreateTechnology({ repo, audit });
    const r = await uc.execute({ admin: null, data: validData });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TECHNOLOGY_FORBIDDEN");
    expect(audit.entries).toHaveLength(0);
  });

  it("denies a viewer (lacks content.write)", async () => {
    const uc = new CreateTechnology({ repo, audit });
    const r = await uc.execute({ admin: viewer, data: validData });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TECHNOLOGY_FORBIDDEN");
  });

  it("denies a suspended owner (fails closed)", async () => {
    const uc = new CreateTechnology({ repo, audit });
    const r = await uc.execute({ admin: suspended, data: validData });
    expect(isErr(r)).toBe(true);
  });

  it("rejects invalid input with a validation error", async () => {
    const uc = new CreateTechnology({ repo, audit });
    const r = await uc.execute({ admin: owner, data: { slug: "Bad Slug", name: "" } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TECHNOLOGY_VALIDATION");
  });

  it("rejects a duplicate slug", async () => {
    const uc = new CreateTechnology({ repo, audit });
    await uc.execute({ admin: owner, data: validData });
    const r = await uc.execute({ admin: owner, data: validData });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TECHNOLOGY_SLUG_CONFLICT");
  });
});

describe("UpdateTechnology", () => {
  it("updates a subset of fields without clobbering others", async () => {
    const create = new CreateTechnology({ repo, audit });
    const created = await create.execute({ admin: owner, data: validData });
    const id = isOk(created) ? created.value.id : "";

    const uc = new UpdateTechnology({ repo, audit });
    const r = await uc.execute({ admin: owner, id, patch: { name: "Next" } });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.name).toBe("Next");
      expect(r.value.slug).toBe("next-js");
      expect(r.value.website).toBe("https://nextjs.org");
    }
  });

  it("returns not found for an unknown id", async () => {
    const uc = new UpdateTechnology({ repo, audit });
    const r = await uc.execute({ admin: owner, id: "missing", patch: { name: "X" } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TECHNOLOGY_NOT_FOUND");
  });

  it("rejects a slug change that collides with another row", async () => {
    const create = new CreateTechnology({ repo, audit });
    await create.execute({ admin: owner, data: validData });
    const second = await create.execute({
      admin: owner,
      data: { ...validData, slug: "react", name: "React" },
    });
    const id = isOk(second) ? second.value.id : "";

    const uc = new UpdateTechnology({ repo, audit });
    const r = await uc.execute({ admin: owner, id, patch: { slug: "next-js" } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TECHNOLOGY_SLUG_CONFLICT");
  });
});

describe("ArchiveTechnology / SetTechnologyVisibility / reads", () => {
  it("archives an existing technology and audits", async () => {
    const create = new CreateTechnology({ repo, audit });
    const created = await create.execute({ admin: owner, data: validData });
    const id = isOk(created) ? created.value.id : "";

    const uc = new ArchiveTechnology({ repo, audit });
    const r = await uc.execute({ admin: owner, id });
    expect(isOk(r)).toBe(true);
    expect(audit.entries.some((e) => e.action === "technology.archive")).toBe(true);
  });

  it("toggles visibility", async () => {
    const create = new CreateTechnology({ repo, audit });
    const created = await create.execute({ admin: owner, data: validData });
    const id = isOk(created) ? created.value.id : "";

    const uc = new SetTechnologyVisibility({ repo, audit });
    const r = await uc.execute({ admin: owner, id, isVisible: false });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.isVisible).toBe(false);
  });

  it("list/get require authentication", async () => {
    const list = new ListTechnologies({ repo });
    const get = new GetTechnology({ repo });
    expect(isErr(await list.execute({ admin: null }))).toBe(true);
    expect(isErr(await get.execute({ admin: null, id: "x" }))).toBe(true);
  });

  it("get returns not found for an unknown id", async () => {
    const get = new GetTechnology({ repo });
    const r = await get.execute({ admin: owner, id: "missing" });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("TECHNOLOGY_NOT_FOUND");
  });
});
