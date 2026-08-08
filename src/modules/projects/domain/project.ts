import type { Locale } from "@/shared/domain/locale";

/**
 * Project domain — pure, framework-free read models and the SSOT tuples mirrored by the
 * Postgres enums (project_status, project_visibility, project_link_type,
 * project_section_kind). Drift guards live in tests/unit/project-domain.test.ts.
 */

export const PROJECT_STATUSES = ["draft", "review", "published", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_VISIBILITIES = ["public", "unlisted", "private"] as const;
export type ProjectVisibility = (typeof PROJECT_VISIBILITIES)[number];

export const PROJECT_LINK_TYPES = [
  "github",
  "demo",
  "video",
  "docs",
  "case_study",
  "other",
] as const;
export type ProjectLinkType = (typeof PROJECT_LINK_TYPES)[number];

export const PROJECT_SECTION_KINDS = [
  "overview",
  "problem",
  "context",
  "role",
  "architecture",
  "decisions",
  "tradeoffs",
  "results",
  "limitations",
  "next_step",
] as const;
export type ProjectSectionKind = (typeof PROJECT_SECTION_KINDS)[number];

/** Core project row (scalar fields). Localized text lives in translations. */
export interface Project {
  readonly id: string;
  readonly slug: string;
  readonly status: ProjectStatus;
  readonly visibility: ProjectVisibility;
  readonly category: string;
  readonly featured: boolean;
  readonly featuredOrder: number | null;
  readonly role: string | null;
  readonly publishedAt: Date | null;
  readonly rowVersion: number;
}

export interface ProjectTranslation {
  readonly locale: Locale;
  readonly title: string;
  readonly tagline: string | null;
  readonly summary: string | null;
}

export interface ProjectLink {
  readonly linkType: ProjectLinkType;
  readonly url: string;
  readonly label: string | null;
  readonly sortOrder: number;
}

export interface ProjectMetric {
  readonly label: string;
  readonly value: string;
  readonly unit: string | null;
  readonly evidenceUrl: string | null;
  readonly sortOrder: number;
}

export interface ProjectTechnologyRef {
  readonly technologyId: string;
  readonly sortOrder: number;
}

export interface ProjectMediaRef {
  readonly mediaId: string;
  readonly role: string;
  readonly caption: string | null;
  readonly sortOrder: number;
}

export interface ProjectSectionTranslation {
  readonly locale: Locale;
  readonly heading: string | null;
  readonly bodyMd: string;
}

export interface ProjectSection {
  readonly kind: ProjectSectionKind;
  readonly sortOrder: number;
  readonly isVisible: boolean;
  readonly translations: readonly ProjectSectionTranslation[];
}

/** Full editable aggregate returned for the Admin edit screen. */
export interface AdminProjectAggregate {
  readonly project: Project;
  readonly translations: readonly ProjectTranslation[];
  readonly technologies: readonly ProjectTechnologyRef[];
  readonly links: readonly ProjectLink[];
  readonly metrics: readonly ProjectMetric[];
  readonly media: readonly ProjectMediaRef[];
  readonly sections: readonly ProjectSection[];
}
