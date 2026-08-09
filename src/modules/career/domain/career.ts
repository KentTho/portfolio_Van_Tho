import type { Locale } from "@/shared/domain/locale";

/**
 * Career domain — pure read models for experiences (with localized translations),
 * education, and certifications. No publish state machine: `isVisible` is the public gate
 * and `deletedAt` (soft-delete, modelled here as absence) removes a row. Dates are ISO
 * `YYYY-MM-DD` strings (Postgres `date`), never coerced to Date to avoid timezone drift.
 */

export interface Experience {
  readonly id: string;
  readonly organization: string;
  readonly employmentType: string | null;
  readonly location: string | null;
  readonly url: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly isCurrent: boolean;
  readonly sortOrder: number;
  readonly isVisible: boolean;
  readonly rowVersion: number;
}

export interface ExperienceTranslation {
  readonly locale: Locale;
  readonly title: string;
  readonly summary: string | null;
}

export interface AdminExperienceAggregate {
  readonly experience: Experience;
  readonly translations: readonly ExperienceTranslation[];
}

export interface Education {
  readonly id: string;
  readonly institution: string;
  readonly degree: string | null;
  readonly fieldOfStudy: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly isCurrent: boolean;
  readonly url: string | null;
  readonly sortOrder: number;
  readonly isVisible: boolean;
  readonly rowVersion: number;
}

export interface Certification {
  readonly id: string;
  readonly name: string;
  readonly issuer: string;
  readonly issueDate: string | null;
  readonly expiryDate: string | null;
  readonly credentialId: string | null;
  readonly credentialUrl: string | null;
  readonly sortOrder: number;
  readonly isVisible: boolean;
  readonly rowVersion: number;
}
