import { beforeEach, describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import type { AuditEntry, AuditLogPort } from "@/shared/application/audit-log-port";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type {
  ContentRevision,
  RevisionContentType,
  RevisionSummary,
} from "@/modules/revisions/domain/content-revision";
import type { RevisionRepositoryPort } from "@/modules/revisions/application/ports/revision-repository-port";
import type { CreateRevisionInput } from "@/modules/revisions/application/revision-schema";
import {
  CreateRevision,
  GetRevision,
  ListRevisions,
  PreviewRestore,
} from "@/modules/revisions/application/use-cases/revision-use-cases";

class FakeRevisionRepository implements RevisionRepositoryPort {
  private store: ContentRevision[] = [];
  private seq = 0;

  async create(input: CreateRevisionInput, actorUserId: string | null): Promise<ContentRevision> {
    const version =
      this.store
        .filter((r) => r.contentType === input.contentType && r.contentId === input.contentId)
        .reduce((max, r) => Math.max(max, r.version), 0) + 1;
    const rev: ContentRevision = {
      id: `rev-${++this.seq}`,
      contentType: input.contentType,
      contentId: input.contentId,
      locale: input.locale,
      version,
      actorUserId,
      snapshot: input.snapshot,
      createdAt: new Date(0),
    };
    this.store.push(rev);
    return rev;
  }
  async listForEntity(
    contentType: RevisionContentType,
    contentId: string,
  ): Promise<readonly RevisionSummary[]> {
    return this.store
      .filter((r) => r.contentType === contentType && r.contentId === contentId)
      .sort((a, b) => b.version - a.version);
  }
  async findById(id: string): Promise<ContentRevision | null> {
    return this.store.find((r) => r.id === id) ?? null;
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

const CONTENT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

let repo: FakeRevisionRepository;
let audit: FakeAudit;
beforeEach(() => {
  repo = new FakeRevisionRepository();
  audit = new FakeAudit();
});

describe("CreateRevision", () => {
  it("assigns incrementing versions per entity and audits", async () => {
    const uc = new CreateRevision({ repo, audit });
    const r1 = await uc.execute({
      admin: owner,
      data: { contentType: "article", contentId: CONTENT_ID, snapshot: { title: "v1" } },
    });
    const r2 = await uc.execute({
      admin: owner,
      data: { contentType: "article", contentId: CONTENT_ID, snapshot: { title: "v2" } },
    });
    expect(isOk(r1) && r1.value.version).toBe(1);
    expect(isOk(r2) && r2.value.version).toBe(2);
    expect(audit.entries.at(-1)?.action).toBe("revision.create");
    // audit records who/when only — never the snapshot payload
    expect(JSON.stringify(audit.entries.at(-1)?.metadata)).not.toContain("v2");
  });

  it("denies a viewer and writes no audit", async () => {
    const uc = new CreateRevision({ repo, audit });
    const r = await uc.execute({
      admin: viewer,
      data: { contentType: "article", contentId: CONTENT_ID, snapshot: {} },
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("REVISION_FORBIDDEN");
    expect(audit.entries).toHaveLength(0);
  });

  it("rejects an unknown content type", async () => {
    const uc = new CreateRevision({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      data: { contentType: "widget", contentId: CONTENT_ID, snapshot: {} },
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("REVISION_VALIDATION");
  });
});

describe("List / Get / PreviewRestore", () => {
  async function seedTwo(): Promise<void> {
    const uc = new CreateRevision({ repo, audit });
    await uc.execute({
      admin: owner,
      data: { contentType: "article", contentId: CONTENT_ID, snapshot: { n: 1 } },
    });
    await uc.execute({
      admin: owner,
      data: { contentType: "article", contentId: CONTENT_ID, snapshot: { n: 2 } },
    });
  }

  it("lists newest version first", async () => {
    await seedTwo();
    const list = new ListRevisions({ repo });
    const r = await list.execute({
      admin: owner,
      ref: { contentType: "article", contentId: CONTENT_ID },
    });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.map((x) => x.version)).toEqual([2, 1]);
  });

  it("preview returns the snapshot without mutating", async () => {
    await seedTwo();
    const list = await new ListRevisions({ repo }).execute({
      admin: owner,
      ref: { contentType: "article", contentId: CONTENT_ID },
    });
    if (!isOk(list)) throw new Error("seed failed");
    const targetId = list.value[1]!.id; // version 1
    const preview = new PreviewRestore({ repo });
    const r = await preview.execute({ admin: owner, id: targetId });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.snapshot).toEqual({ n: 1 });

    // preview did not add or change any revision
    const after = await new ListRevisions({ repo }).execute({
      admin: owner,
      ref: { contentType: "article", contentId: CONTENT_ID },
    });
    if (isOk(after)) expect(after.value).toHaveLength(2);
  });

  it("get returns not found for an unknown id", async () => {
    const r = await new GetRevision({ repo }).execute({ admin: owner, id: "missing" });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("REVISION_NOT_FOUND");
  });

  it("list requires authentication", async () => {
    const r = await new ListRevisions({ repo }).execute({
      admin: null,
      ref: { contentType: "article", contentId: CONTENT_ID },
    });
    expect(isErr(r)).toBe(true);
  });
});
