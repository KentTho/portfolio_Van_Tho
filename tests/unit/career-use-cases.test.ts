import { beforeEach, describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import type { AuditEntry, AuditLogPort } from "@/shared/application/audit-log-port";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type {
  AdminExperienceAggregate,
  Certification,
  Education,
  Experience,
} from "@/modules/career/domain/career";
import type {
  CareerRepositoryPort,
  CareerWriteOutcome,
  PublicCertification,
  PublicEducation,
  PublicExperience,
} from "@/modules/career/application/ports/career-repository-port";
import type {
  CertificationCreateInput,
  CertificationUpdateInput,
  EducationCreateInput,
  EducationUpdateInput,
  ExperienceCreateInput,
  ExperienceUpdateInput,
} from "@/modules/career/application/career-schema";
import {
  ArchiveExperience,
  CreateCertification,
  CreateEducation,
  CreateExperience,
  GetExperience,
  ListExperiences,
  UpdateEducation,
  UpdateExperience,
} from "@/modules/career/application/use-cases/career-use-cases";

class FakeCareerRepository implements CareerRepositoryPort {
  private exp = new Map<string, AdminExperienceAggregate>();
  private edu = new Map<string, Education>();
  private cert = new Map<string, Certification>();
  private seq = 0;

  async listAdminExperiences(): Promise<readonly Experience[]> {
    return [...this.exp.values()].map((a) => a.experience);
  }
  async findExperienceById(id: string): Promise<AdminExperienceAggregate | null> {
    return this.exp.get(id) ?? null;
  }
  async createExperience(input: ExperienceCreateInput): Promise<Experience> {
    const id = `exp-${++this.seq}`;
    const experience: Experience = {
      id,
      organization: input.organization,
      employmentType: input.employmentType,
      location: input.location,
      url: input.url,
      startDate: input.startDate,
      endDate: input.endDate,
      isCurrent: input.isCurrent,
      sortOrder: input.sortOrder,
      isVisible: input.isVisible,
      rowVersion: 1,
    };
    this.exp.set(id, {
      experience,
      translations: input.translations.map((t) => ({
        locale: t.locale,
        title: t.title,
        summary: t.summary,
      })),
    });
    return experience;
  }
  async updateExperience(
    id: string,
    expectedRowVersion: number,
    patch: ExperienceUpdateInput,
  ): Promise<CareerWriteOutcome<Experience>> {
    const agg = this.exp.get(id);
    if (!agg) return { kind: "not_found" };
    if (agg.experience.rowVersion !== expectedRowVersion) return { kind: "stale" };
    const experience: Experience = {
      ...agg.experience,
      isVisible: patch.isVisible ?? agg.experience.isVisible,
      rowVersion: agg.experience.rowVersion + 1,
    };
    this.exp.set(id, { ...agg, experience });
    return { kind: "updated", entity: experience };
  }
  async softDeleteExperience(id: string): Promise<boolean> {
    return this.exp.delete(id);
  }
  async listPublicExperiences(): Promise<readonly PublicExperience[]> {
    return [];
  }

  async listAdminEducation(): Promise<readonly Education[]> {
    return [...this.edu.values()];
  }
  async findEducationById(id: string): Promise<Education | null> {
    return this.edu.get(id) ?? null;
  }
  async createEducation(input: EducationCreateInput): Promise<Education> {
    const id = `edu-${++this.seq}`;
    const entity: Education = { id, ...input, rowVersion: 1 };
    this.edu.set(id, entity);
    return entity;
  }
  async updateEducation(
    id: string,
    expectedRowVersion: number,
    patch: EducationUpdateInput,
  ): Promise<CareerWriteOutcome<Education>> {
    const cur = this.edu.get(id);
    if (!cur) return { kind: "not_found" };
    if (cur.rowVersion !== expectedRowVersion) return { kind: "stale" };
    const entity: Education = {
      ...cur,
      degree: patch.degree ?? cur.degree,
      rowVersion: cur.rowVersion + 1,
    };
    this.edu.set(id, entity);
    return { kind: "updated", entity };
  }
  async softDeleteEducation(id: string): Promise<boolean> {
    return this.edu.delete(id);
  }
  async listPublicEducation(): Promise<readonly PublicEducation[]> {
    return [];
  }

  async listAdminCertifications(): Promise<readonly Certification[]> {
    return [...this.cert.values()];
  }
  async findCertificationById(id: string): Promise<Certification | null> {
    return this.cert.get(id) ?? null;
  }
  async createCertification(input: CertificationCreateInput): Promise<Certification> {
    const id = `cert-${++this.seq}`;
    const entity: Certification = { id, ...input, rowVersion: 1 };
    this.cert.set(id, entity);
    return entity;
  }
  async updateCertification(
    id: string,
    expectedRowVersion: number,
    patch: CertificationUpdateInput,
  ): Promise<CareerWriteOutcome<Certification>> {
    const cur = this.cert.get(id);
    if (!cur) return { kind: "not_found" };
    if (cur.rowVersion !== expectedRowVersion) return { kind: "stale" };
    const entity: Certification = {
      ...cur,
      name: patch.name ?? cur.name,
      rowVersion: cur.rowVersion + 1,
    };
    this.cert.set(id, entity);
    return { kind: "updated", entity };
  }
  async softDeleteCertification(id: string): Promise<boolean> {
    return this.cert.delete(id);
  }
  async listPublicCertifications(): Promise<readonly PublicCertification[]> {
    return [];
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

const expData = {
  organization: "Acme",
  startDate: "2022-01-01",
  translations: [{ locale: "vi", title: "Kỹ sư" }],
};

let repo: FakeCareerRepository;
let audit: FakeAudit;

beforeEach(() => {
  repo = new FakeCareerRepository();
  audit = new FakeAudit();
});

describe("CreateExperience", () => {
  it("creates and audits", async () => {
    const uc = new CreateExperience({ repo, audit });
    const r = await uc.execute({ admin: owner, data: expData });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.rowVersion).toBe(1);
    expect(audit.entries.at(-1)?.action).toBe("experience.create");
  });

  it("denies a viewer, no audit", async () => {
    const uc = new CreateExperience({ repo, audit });
    const r = await uc.execute({ admin: viewer, data: expData });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("CAREER_FORBIDDEN");
    expect(audit.entries).toHaveLength(0);
  });

  it("rejects invalid input", async () => {
    const uc = new CreateExperience({ repo, audit });
    const r = await uc.execute({ admin: owner, data: { organization: "" } });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("CAREER_VALIDATION");
  });
});

describe("UpdateExperience (optimistic concurrency)", () => {
  async function seed(): Promise<Experience> {
    const create = new CreateExperience({ repo, audit });
    const r = await create.execute({ admin: owner, data: expData });
    if (!isOk(r)) throw new Error("seed failed");
    return r.value;
  }

  it("updates at the current version", async () => {
    const e = await seed();
    const uc = new UpdateExperience({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      id: e.id,
      expectedRowVersion: 1,
      patch: { isVisible: false },
    });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.rowVersion).toBe(2);
  });

  it("rejects a stale row_version", async () => {
    const e = await seed();
    const uc = new UpdateExperience({ repo, audit });
    const r = await uc.execute({
      admin: owner,
      id: e.id,
      expectedRowVersion: 99,
      patch: { isVisible: false },
    });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("CAREER_STALE_WRITE");
  });

  it("returns not found for an unknown id", async () => {
    const uc = new UpdateExperience({ repo, audit });
    const r = await uc.execute({ admin: owner, id: "missing", expectedRowVersion: 1, patch: {} });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("CAREER_NOT_FOUND");
  });
});

describe("Archive + reads + other entities", () => {
  it("archives an experience", async () => {
    const create = new CreateExperience({ repo, audit });
    const c = await create.execute({ admin: owner, data: expData });
    if (!isOk(c)) throw new Error("seed failed");
    const uc = new ArchiveExperience({ repo, audit });
    const r = await uc.execute({ admin: owner, id: c.value.id });
    expect(isOk(r)).toBe(true);
    expect(audit.entries.at(-1)?.action).toBe("experience.archive");
  });

  it("list requires authentication", async () => {
    const list = new ListExperiences({ repo });
    expect(isErr(await list.execute({ admin: null }))).toBe(true);
  });

  it("get returns not found for an unknown id", async () => {
    const get = new GetExperience({ repo });
    const r = await get.execute({ admin: owner, id: "missing" });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("CAREER_NOT_FOUND");
  });

  it("creates education and certification, updates education version", async () => {
    const edu = new CreateEducation({ repo, audit });
    const e = await edu.execute({ admin: owner, data: { institution: "MIT" } });
    expect(isOk(e)).toBe(true);
    if (!isOk(e)) return;
    const upd = new UpdateEducation({ repo, audit });
    const u = await upd.execute({
      admin: owner,
      id: e.value.id,
      expectedRowVersion: 1,
      patch: { degree: "BSc" },
    });
    expect(isOk(u)).toBe(true);
    if (isOk(u)) expect(u.value.rowVersion).toBe(2);

    const cert = new CreateCertification({ repo, audit });
    const c = await cert.execute({
      admin: owner,
      data: { name: "AWS SAA", issuer: "Amazon" },
    });
    expect(isOk(c)).toBe(true);
  });
});
