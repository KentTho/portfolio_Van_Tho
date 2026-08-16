import { describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { AuditEntryView, AuditReadPort } from "@/modules/audit/application/ports/audit-read-port";
import { ListAuditEntries } from "@/modules/audit/application/use-cases/list-audit-entries";

class FakeAuditRepo implements AuditReadPort {
  constructor(private readonly rows: AuditEntryView[] = []) {}
  lastLimit = 0;
  async listRecent(limit: number): Promise<readonly AuditEntryView[]> {
    this.lastLimit = limit;
    return this.rows.slice(0, limit);
  }
}

const owner = AdminUser.create("o1", { email: "o@example.com", role: "owner_admin", status: "active" });
const editor = AdminUser.create("e1", { email: "e@example.com", role: "editor", status: "active" });
const viewer = AdminUser.create("v1", { email: "v@example.com", role: "viewer", status: "active" });

const entry: AuditEntryView = {
  id: "a1",
  actorUserId: "o1",
  action: "project.publish",
  entityType: "project",
  entityId: "p1",
  metadata: null,
  createdAt: new Date(0),
};

describe("ListAuditEntries", () => {
  it("returns entries for a role with audit.read (owner_admin, viewer)", async () => {
    for (const admin of [owner, viewer]) {
      const uc = new ListAuditEntries({ repo: new FakeAuditRepo([entry]) });
      const r = await uc.execute({ admin });
      expect(isOk(r)).toBe(true);
      if (isOk(r)) expect(r.value).toHaveLength(1);
    }
  });

  it("denies a role lacking audit.read (editor)", async () => {
    const uc = new ListAuditEntries({ repo: new FakeAuditRepo([entry]) });
    const r = await uc.execute({ admin: editor });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("AUDIT_FORBIDDEN");
  });

  it("denies an unauthenticated request", async () => {
    const uc = new ListAuditEntries({ repo: new FakeAuditRepo([entry]) });
    expect(isErr(await uc.execute({ admin: null }))).toBe(true);
  });

  it("clamps the limit to [1, 200]", async () => {
    const repo = new FakeAuditRepo([entry]);
    await new ListAuditEntries({ repo }).execute({ admin: owner, limit: 9999 });
    expect(repo.lastLimit).toBe(200);
  });
});
