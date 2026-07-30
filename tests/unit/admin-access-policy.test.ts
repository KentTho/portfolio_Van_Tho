import { describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import { evaluateAdminAccess } from "@/modules/identity/application/policies/admin-access-policy";
import type { AppUserRecord } from "@/modules/identity/application/ports/app-user-repository-port";

const identity = { supabaseUserId: "sub-1", email: "Owner@Example.com" } as const;
const allow = ["owner@example.com"] as const;
const ownerRecord: AppUserRecord = {
  id: "u1",
  email: "owner@example.com",
  role: "owner_admin",
  status: "active",
};

describe("evaluateAdminAccess", () => {
  it("denies when unauthenticated", () => {
    const r = evaluateAdminAccess({ identity: null, appUser: null, allowedEmails: allow });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("denies when email not in the allow-list", () => {
    const r = evaluateAdminAccess({
      identity: { supabaseUserId: "x", email: "intruder@example.com" },
      appUser: ownerRecord,
      allowedEmails: allow,
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("AUTHORIZATION_DENIED");
  });

  it("denies when there is no app_user record", () => {
    const r = evaluateAdminAccess({ identity, appUser: null, allowedEmails: allow });
    expect(isErr(r)).toBe(true);
  });

  it("denies a suspended account", () => {
    const r = evaluateAdminAccess({
      identity,
      appUser: { ...ownerRecord, status: "suspended" },
      allowedEmails: allow,
    });
    expect(isErr(r)).toBe(true);
  });

  it("denies a viewer role", () => {
    const r = evaluateAdminAccess({
      identity,
      appUser: { ...ownerRecord, role: "viewer" },
      allowedEmails: allow,
    });
    expect(isErr(r)).toBe(true);
  });

  it("grants an active owner_admin in the allow-list (case-insensitive email)", () => {
    const r = evaluateAdminAccess({ identity, appUser: ownerRecord, allowedEmails: allow });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.role).toBe("owner_admin");
      expect(r.value.isActive()).toBe(true);
    }
  });

  it("grants when the allow-list is empty (allow-list optional)", () => {
    const r = evaluateAdminAccess({ identity, appUser: ownerRecord, allowedEmails: [] });
    expect(isOk(r)).toBe(true);
  });
});
