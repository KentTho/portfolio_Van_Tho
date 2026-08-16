import { beforeEach, describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import type { AuditEntry, AuditLogPort } from "@/shared/application/audit-log-port";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
// profile
import type { Profile } from "@/modules/profile/domain/profile";
import type { ProfileRepositoryPort } from "@/modules/profile/application/ports/profile-repository-port";
import type { ProfileUpdateInput } from "@/modules/profile/application/profile-schema";
import {
  GetProfile,
  UpdateProfile,
} from "@/modules/profile/application/use-cases/profile-use-cases";
// skills
import type { Skill } from "@/modules/skills/domain/skill";
import type { SkillRepositoryPort } from "@/modules/skills/application/ports/skill-repository-port";
import type { SkillCreateInput, SkillUpdateInput } from "@/modules/skills/application/skill-schema";
import {
  CreateSkill,
  DeleteSkill,
  ListSkills,
  UpdateSkill,
} from "@/modules/skills/application/use-cases/skill-use-cases";
// settings
import type { SiteSetting } from "@/modules/site-settings/domain/site-setting";
import type { SiteSettingRepositoryPort } from "@/modules/site-settings/application/ports/site-setting-repository-port";
import type { SettingUpsertInput } from "@/modules/site-settings/application/site-setting-schema";
import {
  ListSettings,
  UpsertSetting,
} from "@/modules/site-settings/application/use-cases/site-setting-use-cases";

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

let audit: FakeAudit;
beforeEach(() => {
  audit = new FakeAudit();
});

// ---- Profile -------------------------------------------------------------------------

class FakeProfileRepository implements ProfileRepositoryPort {
  private profile: Profile = {
    fullName: "",
    professionalTitle: "",
    location: null,
    publicEmail: null,
    availabilityStatus: "unknown",
    defaultLocale: "vi",
  };
  async get(): Promise<Profile> {
    return this.profile;
  }
  async update(patch: ProfileUpdateInput): Promise<Profile> {
    this.profile = { ...this.profile, ...patch };
    return this.profile;
  }
}

describe("Profile use-cases", () => {
  it("updates the singleton and audits", async () => {
    const repo = new FakeProfileRepository();
    const uc = new UpdateProfile({ repo, audit });
    const r = await uc.execute({ admin: owner, patch: { fullName: "Van Tho" } });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.fullName).toBe("Van Tho");
    expect(audit.entries.at(-1)?.action).toBe("profile.update");
  });

  it("rejects an invalid email and writes no audit", async () => {
    const repo = new FakeProfileRepository();
    const uc = new UpdateProfile({ repo, audit });
    const r = await uc.execute({ admin: owner, patch: { publicEmail: "not-an-email" } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("PROFILE_VALIDATION");
    expect(audit.entries).toHaveLength(0);
  });

  it("read requires authentication", async () => {
    const repo = new FakeProfileRepository();
    expect(isErr(await new GetProfile({ repo }).execute({ admin: null }))).toBe(true);
  });
});

// ---- Skills --------------------------------------------------------------------------

class FakeSkillRepository implements SkillRepositoryPort {
  private store = new Map<string, Skill>();
  private seq = 0;
  async listAdmin(): Promise<readonly Skill[]> {
    return [...this.store.values()];
  }
  async findById(id: string): Promise<Skill | null> {
    return this.store.get(id) ?? null;
  }
  async findBySlug(slug: string): Promise<{ id: string } | null> {
    for (const s of this.store.values()) if (s.slug === slug) return { id: s.id };
    return null;
  }
  async create(input: SkillCreateInput): Promise<Skill> {
    const id = `skill-${++this.seq}`;
    const skill: Skill = { id, ...input };
    this.store.set(id, skill);
    return skill;
  }
  async update(id: string, patch: SkillUpdateInput): Promise<Skill | null> {
    const cur = this.store.get(id);
    if (!cur) return null;
    const next = { ...cur, ...patch };
    this.store.set(id, next);
    return next;
  }
  async remove(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
  async listPublic(): Promise<readonly Skill[]> {
    return [...this.store.values()].filter((s) => s.isVisible);
  }
}

const skillData = { slug: "typescript", name: "TypeScript" };

describe("Skill use-cases", () => {
  it("creates, denies viewer, rejects dup slug, deletes", async () => {
    const repo = new FakeSkillRepository();
    const create = new CreateSkill({ repo, audit });

    const denied = await create.execute({ admin: viewer, data: skillData });
    expect(isErr(denied)).toBe(true);
    if (isErr(denied)) expect(denied.error.code).toBe("SKILL_FORBIDDEN");

    const ok1 = await create.execute({ admin: owner, data: skillData });
    expect(isOk(ok1)).toBe(true);

    const dup = await create.execute({ admin: owner, data: skillData });
    expect(isErr(dup)).toBe(true);
    if (isErr(dup)) expect(dup.error.code).toBe("SKILL_SLUG_CONFLICT");

    if (isOk(ok1)) {
      const del = await new DeleteSkill({ repo, audit }).execute({ admin: owner, id: ok1.value.id });
      expect(isOk(del)).toBe(true);
    }
  });

  it("update returns not found for an unknown id", async () => {
    const repo = new FakeSkillRepository();
    const uc = new UpdateSkill({ repo, audit });
    const r = await uc.execute({ admin: owner, id: "missing", patch: { name: "X" } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("SKILL_NOT_FOUND");
  });

  it("list requires authentication", async () => {
    const repo = new FakeSkillRepository();
    expect(isErr(await new ListSkills({ repo }).execute({ admin: null }))).toBe(true);
  });
});

// ---- Settings ------------------------------------------------------------------------

class FakeSettingRepository implements SiteSettingRepositoryPort {
  private store = new Map<string, SiteSetting>();
  async listAdmin(): Promise<readonly SiteSetting[]> {
    return [...this.store.values()];
  }
  async findByKey(key: string): Promise<SiteSetting | null> {
    return this.store.get(key) ?? null;
  }
  async upsert(input: SettingUpsertInput): Promise<SiteSetting> {
    const setting: SiteSetting = { key: input.key, value: input.value, isPublic: input.isPublic };
    this.store.set(input.key, setting);
    return setting;
  }
  async remove(key: string): Promise<boolean> {
    return this.store.delete(key);
  }
  async getPublic(key: string): Promise<unknown | null> {
    const s = this.store.get(key);
    return s && s.isPublic ? s.value : null;
  }
}

describe("Setting use-cases", () => {
  it("upserts a setting and audits; viewer is denied", async () => {
    const repo = new FakeSettingRepository();
    const uc = new UpsertSetting({ repo, audit });

    const denied = await uc.execute({
      admin: viewer,
      data: { key: "site.title", value: "Portfolio", isPublic: true },
    });
    expect(isErr(denied)).toBe(true);
    if (isErr(denied)) expect(denied.error.code).toBe("SETTING_FORBIDDEN");

    const r = await uc.execute({
      admin: owner,
      data: { key: "site.title", value: { vi: "Hồ sơ", en: "Portfolio" }, isPublic: true },
    });
    expect(isOk(r)).toBe(true);
    expect(audit.entries.at(-1)?.action).toBe("setting.upsert");
  });

  it("rejects an invalid key", async () => {
    const repo = new FakeSettingRepository();
    const uc = new UpsertSetting({ repo, audit });
    const r = await uc.execute({ admin: owner, data: { key: "Bad Key", value: 1 } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("SETTING_VALIDATION");
  });

  it("list requires the settings permission", async () => {
    const repo = new FakeSettingRepository();
    const r = await new ListSettings({ repo }).execute({ admin: viewer });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("SETTING_FORBIDDEN");
  });
});
