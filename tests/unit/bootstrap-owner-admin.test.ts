import { describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import type { AuthIdentity, AuthPort } from "@/modules/identity/application/ports/auth-port";
import type {
  AppUserRecord,
  AppUserRepositoryPort,
  ProvisionOwnerInput,
} from "@/modules/identity/application/ports/app-user-repository-port";
import { BootstrapOwnerAdmin } from "@/modules/identity/application/use-cases/bootstrap-owner-admin";

class FakeAuth implements AuthPort {
  constructor(private readonly identity: AuthIdentity | null) {}
  async getCurrentIdentity(): Promise<AuthIdentity | null> {
    return this.identity;
  }
}

class FakeAppUsers implements AppUserRepositoryPort {
  provisioned: ProvisionOwnerInput[] = [];
  constructor(private readonly status: AppUserRecord["status"] = "active") {}
  async findBySupabaseUserId(): Promise<AppUserRecord | null> {
    return null;
  }
  async provisionOwner(input: ProvisionOwnerInput): Promise<AppUserRecord> {
    this.provisioned.push(input);
    return { id: "u1", email: input.email, role: "owner_admin", status: this.status };
  }
}

const allow = ["owner@example.com"] as const;

describe("BootstrapOwnerAdmin", () => {
  it("provisions an allow-listed owner (case-insensitive) as owner_admin", async () => {
    const appUsers = new FakeAppUsers();
    const uc = new BootstrapOwnerAdmin({
      auth: new FakeAuth({ supabaseUserId: "sub-1", email: "Owner@Example.com" }),
      appUsers,
      allowedEmails: allow,
    });
    const r = await uc.execute();
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.role).toBe("owner_admin");
    expect(appUsers.provisioned).toHaveLength(1);
    expect(appUsers.provisioned[0]?.email).toBe("owner@example.com");
  });

  it("denies (and does not provision) when unauthenticated", async () => {
    const appUsers = new FakeAppUsers();
    const uc = new BootstrapOwnerAdmin({
      auth: new FakeAuth(null),
      appUsers,
      allowedEmails: allow,
    });
    const r = await uc.execute();
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("AUTHENTICATION_REQUIRED");
    expect(appUsers.provisioned).toHaveLength(0);
  });

  it("denies (and does not provision) an email not in the allow-list", async () => {
    const appUsers = new FakeAppUsers();
    const uc = new BootstrapOwnerAdmin({
      auth: new FakeAuth({ supabaseUserId: "x", email: "intruder@example.com" }),
      appUsers,
      allowedEmails: allow,
    });
    const r = await uc.execute();
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("AUTHORIZATION_DENIED");
    expect(appUsers.provisioned).toHaveLength(0);
  });

  it("denies when the allow-list is empty (fail closed)", async () => {
    const appUsers = new FakeAppUsers();
    const uc = new BootstrapOwnerAdmin({
      auth: new FakeAuth({ supabaseUserId: "sub-1", email: "owner@example.com" }),
      appUsers,
      allowedEmails: [],
    });
    const r = await uc.execute();
    expect(isErr(r)).toBe(true);
    expect(appUsers.provisioned).toHaveLength(0);
  });

  it("denies a provisioned-but-inactive account", async () => {
    const appUsers = new FakeAppUsers("suspended");
    const uc = new BootstrapOwnerAdmin({
      auth: new FakeAuth({ supabaseUserId: "sub-1", email: "owner@example.com" }),
      appUsers,
      allowedEmails: allow,
    });
    const r = await uc.execute();
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("AUTHORIZATION_DENIED");
  });
});
