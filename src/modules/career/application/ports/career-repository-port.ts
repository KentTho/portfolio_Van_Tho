import type { Locale } from "@/shared/domain/locale";
import type {
  AdminExperienceAggregate,
  Certification,
  Education,
  Experience,
} from "@/modules/career/domain/career";
import type {
  CertificationCreateInput,
  CertificationUpdateInput,
  EducationCreateInput,
  EducationUpdateInput,
  ExperienceCreateInput,
  ExperienceUpdateInput,
} from "@/modules/career/application/career-schema";

export type CareerWriteOutcome<T> =
  | { readonly kind: "updated"; readonly entity: T }
  | { readonly kind: "not_found" }
  | { readonly kind: "stale" };

/** Public projection of an experience: localized title/summary + language-neutral facts. */
export interface PublicExperience {
  readonly organization: string;
  readonly employmentType: string | null;
  readonly location: string | null;
  readonly url: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly isCurrent: boolean;
  readonly title: string;
  readonly summary: string | null;
}

export interface PublicEducation {
  readonly institution: string;
  readonly degree: string | null;
  readonly fieldOfStudy: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly isCurrent: boolean;
  readonly url: string | null;
}

export interface PublicCertification {
  readonly name: string;
  readonly issuer: string;
  readonly issueDate: string | null;
  readonly expiryDate: string | null;
  readonly credentialId: string | null;
  readonly credentialUrl: string | null;
}

/**
 * Career repository. Experience writes (base + translations) are atomic via the Neon HTTP
 * batched transaction; all three entities use `row_version` optimistic concurrency and
 * soft-delete. Public reads return ONLY visible, non-deleted rows (no private/deleted leak).
 */
export interface CareerRepositoryPort {
  // experiences
  listAdminExperiences(): Promise<readonly Experience[]>;
  findExperienceById(id: string): Promise<AdminExperienceAggregate | null>;
  createExperience(input: ExperienceCreateInput): Promise<Experience>;
  updateExperience(
    id: string,
    expectedRowVersion: number,
    patch: ExperienceUpdateInput,
  ): Promise<CareerWriteOutcome<Experience>>;
  softDeleteExperience(id: string): Promise<boolean>;
  listPublicExperiences(locale: Locale): Promise<readonly PublicExperience[]>;

  // education
  listAdminEducation(): Promise<readonly Education[]>;
  findEducationById(id: string): Promise<Education | null>;
  createEducation(input: EducationCreateInput): Promise<Education>;
  updateEducation(
    id: string,
    expectedRowVersion: number,
    patch: EducationUpdateInput,
  ): Promise<CareerWriteOutcome<Education>>;
  softDeleteEducation(id: string): Promise<boolean>;
  listPublicEducation(): Promise<readonly PublicEducation[]>;

  // certifications
  listAdminCertifications(): Promise<readonly Certification[]>;
  findCertificationById(id: string): Promise<Certification | null>;
  createCertification(input: CertificationCreateInput): Promise<Certification>;
  updateCertification(
    id: string,
    expectedRowVersion: number,
    patch: CertificationUpdateInput,
  ): Promise<CareerWriteOutcome<Certification>>;
  softDeleteCertification(id: string): Promise<boolean>;
  listPublicCertifications(): Promise<readonly PublicCertification[]>;
}
