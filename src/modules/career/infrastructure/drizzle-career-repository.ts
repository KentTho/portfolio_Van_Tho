import "server-only";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { DEFAULT_LOCALE, type Locale } from "@/shared/domain/locale";
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
import { getDb } from "@/infrastructure/database/client";
import {
  certifications,
  education,
  experienceTranslations,
  experiences,
  type CertificationRow,
  type EducationRow,
  type ExperienceRow,
  type ExperienceTranslationRow,
} from "@/infrastructure/database/schema";

type Db = ReturnType<typeof getDb>;
type BatchArg = Parameters<Db["batch"]>[0];

function toExperience(r: ExperienceRow): Experience {
  return {
    id: r.id,
    organization: r.organization,
    employmentType: r.employmentType,
    location: r.location,
    url: r.url,
    startDate: r.startDate,
    endDate: r.endDate,
    isCurrent: r.isCurrent,
    sortOrder: r.sortOrder,
    isVisible: r.isVisible,
    rowVersion: r.rowVersion,
  };
}

function toEducation(r: EducationRow): Education {
  return {
    id: r.id,
    institution: r.institution,
    degree: r.degree,
    fieldOfStudy: r.fieldOfStudy,
    startDate: r.startDate,
    endDate: r.endDate,
    isCurrent: r.isCurrent,
    url: r.url,
    sortOrder: r.sortOrder,
    isVisible: r.isVisible,
    rowVersion: r.rowVersion,
  };
}

function toCertification(r: CertificationRow): Certification {
  return {
    id: r.id,
    name: r.name,
    issuer: r.issuer,
    issueDate: r.issueDate,
    expiryDate: r.expiryDate,
    credentialId: r.credentialId,
    credentialUrl: r.credentialUrl,
    sortOrder: r.sortOrder,
    isVisible: r.isVisible,
    rowVersion: r.rowVersion,
  };
}

/** Drop `undefined` keys so an UPDATE never clobbers an omitted column. */
function definedOnly<T extends Record<string, unknown>>(patch: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) out[k as keyof T] = v as T[keyof T];
  }
  return out;
}

function pickByLocale<T extends { locale: string }>(rows: readonly T[], locale: Locale): T | null {
  return (
    rows.find((r) => r.locale === locale) ??
    rows.find((r) => r.locale === DEFAULT_LOCALE) ??
    rows[0] ??
    null
  );
}

/** Neon-backed career repository (Group 4). Atomic experience writes via db.batch. */
export class DrizzleCareerRepository implements CareerRepositoryPort {
  // ---- experiences -------------------------------------------------------------------

  async listAdminExperiences(): Promise<readonly Experience[]> {
    const rows = await getDb()
      .select()
      .from(experiences)
      .where(isNull(experiences.deletedAt))
      .orderBy(asc(experiences.sortOrder));
    return rows.map(toExperience);
  }

  private async loadExperience(id: string): Promise<Experience | null> {
    const rows = await getDb()
      .select()
      .from(experiences)
      .where(and(eq(experiences.id, id), isNull(experiences.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? toExperience(row) : null;
  }

  async findExperienceById(id: string): Promise<AdminExperienceAggregate | null> {
    const experience = await this.loadExperience(id);
    if (!experience) return null;
    const translations = await getDb()
      .select()
      .from(experienceTranslations)
      .where(eq(experienceTranslations.experienceId, id));
    return {
      experience,
      translations: translations.map((t: ExperienceTranslationRow) => ({
        locale: t.locale as Locale,
        title: t.title,
        summary: t.summary,
      })),
    };
  }

  async createExperience(input: ExperienceCreateInput): Promise<Experience> {
    const db = getDb();
    const id = crypto.randomUUID();
    const queries: unknown[] = [
      db.insert(experiences).values({
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
      }),
      ...input.translations.map((t) =>
        db.insert(experienceTranslations).values({ experienceId: id, ...t }),
      ),
    ];
    await db.batch(queries as unknown as BatchArg);
    return {
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
  }

  async updateExperience(
    id: string,
    expectedRowVersion: number,
    patch: ExperienceUpdateInput,
  ): Promise<CareerWriteOutcome<Experience>> {
    const db = getDb();
    const existing = await db
      .select({ v: experiences.rowVersion })
      .from(experiences)
      .where(and(eq(experiences.id, id), isNull(experiences.deletedAt)))
      .limit(1);
    const cur = existing[0];
    if (!cur) return { kind: "not_found" };
    if (cur.v !== expectedRowVersion) return { kind: "stale" };

    const { translations, ...scalar } = patch;
    const queries: unknown[] = [
      db
        .update(experiences)
        .set({ ...definedOnly(scalar), rowVersion: expectedRowVersion + 1, updatedAt: new Date() })
        .where(and(eq(experiences.id, id), eq(experiences.rowVersion, expectedRowVersion))),
    ];
    if (translations !== undefined) {
      queries.push(
        db.delete(experienceTranslations).where(eq(experienceTranslations.experienceId, id)),
      );
      for (const t of translations) {
        queries.push(db.insert(experienceTranslations).values({ experienceId: id, ...t }));
      }
    }
    await db.batch(queries as unknown as BatchArg);
    const updated = await this.loadExperience(id);
    return updated ? { kind: "updated", entity: updated } : { kind: "not_found" };
  }

  async softDeleteExperience(id: string): Promise<boolean> {
    const found = await this.loadExperience(id);
    if (!found) return false;
    await getDb()
      .update(experiences)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(experiences.id, id));
    return true;
  }

  async listPublicExperiences(locale: Locale): Promise<readonly PublicExperience[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(experiences)
      .where(and(eq(experiences.isVisible, true), isNull(experiences.deletedAt)))
      .orderBy(asc(experiences.sortOrder));
    if (rows.length === 0) return [];
    const ids = rows.map((r) => r.id);
    const translations = await db
      .select()
      .from(experienceTranslations)
      .where(inArray(experienceTranslations.experienceId, ids));
    return rows.map((r) => {
      const tr = pickByLocale(
        translations.filter((t) => t.experienceId === r.id),
        locale,
      );
      return {
        organization: r.organization,
        employmentType: r.employmentType,
        location: r.location,
        url: r.url,
        startDate: r.startDate,
        endDate: r.endDate,
        isCurrent: r.isCurrent,
        title: tr?.title ?? r.organization,
        summary: tr?.summary ?? null,
      };
    });
  }

  // ---- education ---------------------------------------------------------------------

  async listAdminEducation(): Promise<readonly Education[]> {
    const rows = await getDb()
      .select()
      .from(education)
      .where(isNull(education.deletedAt))
      .orderBy(asc(education.sortOrder));
    return rows.map(toEducation);
  }

  async findEducationById(id: string): Promise<Education | null> {
    const rows = await getDb()
      .select()
      .from(education)
      .where(and(eq(education.id, id), isNull(education.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? toEducation(row) : null;
  }

  async createEducation(input: EducationCreateInput): Promise<Education> {
    const id = crypto.randomUUID();
    await getDb().insert(education).values({ id, ...input });
    return { id, ...input, rowVersion: 1 };
  }

  async updateEducation(
    id: string,
    expectedRowVersion: number,
    patch: EducationUpdateInput,
  ): Promise<CareerWriteOutcome<Education>> {
    const db = getDb();
    const existing = await db
      .select({ v: education.rowVersion })
      .from(education)
      .where(and(eq(education.id, id), isNull(education.deletedAt)))
      .limit(1);
    const cur = existing[0];
    if (!cur) return { kind: "not_found" };
    if (cur.v !== expectedRowVersion) return { kind: "stale" };
    await db
      .update(education)
      .set({ ...definedOnly(patch), rowVersion: expectedRowVersion + 1, updatedAt: new Date() })
      .where(and(eq(education.id, id), eq(education.rowVersion, expectedRowVersion)));
    const updated = await this.findEducationById(id);
    return updated ? { kind: "updated", entity: updated } : { kind: "not_found" };
  }

  async softDeleteEducation(id: string): Promise<boolean> {
    const found = await this.findEducationById(id);
    if (!found) return false;
    await getDb()
      .update(education)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(education.id, id));
    return true;
  }

  async listPublicEducation(): Promise<readonly PublicEducation[]> {
    const rows = await getDb()
      .select()
      .from(education)
      .where(and(eq(education.isVisible, true), isNull(education.deletedAt)))
      .orderBy(asc(education.sortOrder));
    return rows.map((r) => ({
      institution: r.institution,
      degree: r.degree,
      fieldOfStudy: r.fieldOfStudy,
      startDate: r.startDate,
      endDate: r.endDate,
      isCurrent: r.isCurrent,
      url: r.url,
    }));
  }

  // ---- certifications ----------------------------------------------------------------

  async listAdminCertifications(): Promise<readonly Certification[]> {
    const rows = await getDb()
      .select()
      .from(certifications)
      .where(isNull(certifications.deletedAt))
      .orderBy(asc(certifications.sortOrder));
    return rows.map(toCertification);
  }

  async findCertificationById(id: string): Promise<Certification | null> {
    const rows = await getDb()
      .select()
      .from(certifications)
      .where(and(eq(certifications.id, id), isNull(certifications.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? toCertification(row) : null;
  }

  async createCertification(input: CertificationCreateInput): Promise<Certification> {
    const id = crypto.randomUUID();
    await getDb().insert(certifications).values({ id, ...input });
    return { id, ...input, rowVersion: 1 };
  }

  async updateCertification(
    id: string,
    expectedRowVersion: number,
    patch: CertificationUpdateInput,
  ): Promise<CareerWriteOutcome<Certification>> {
    const db = getDb();
    const existing = await db
      .select({ v: certifications.rowVersion })
      .from(certifications)
      .where(and(eq(certifications.id, id), isNull(certifications.deletedAt)))
      .limit(1);
    const cur = existing[0];
    if (!cur) return { kind: "not_found" };
    if (cur.v !== expectedRowVersion) return { kind: "stale" };
    await db
      .update(certifications)
      .set({ ...definedOnly(patch), rowVersion: expectedRowVersion + 1, updatedAt: new Date() })
      .where(and(eq(certifications.id, id), eq(certifications.rowVersion, expectedRowVersion)));
    const updated = await this.findCertificationById(id);
    return updated ? { kind: "updated", entity: updated } : { kind: "not_found" };
  }

  async softDeleteCertification(id: string): Promise<boolean> {
    const found = await this.findCertificationById(id);
    if (!found) return false;
    await getDb()
      .update(certifications)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(certifications.id, id));
    return true;
  }

  async listPublicCertifications(): Promise<readonly PublicCertification[]> {
    const rows = await getDb()
      .select()
      .from(certifications)
      .where(and(eq(certifications.isVisible, true), isNull(certifications.deletedAt)))
      .orderBy(asc(certifications.sortOrder));
    return rows.map((r) => ({
      name: r.name,
      issuer: r.issuer,
      issueDate: r.issueDate,
      expiryDate: r.expiryDate,
      credentialId: r.credentialId,
      credentialUrl: r.credentialUrl,
    }));
  }
}
