import type { Localized } from "@/shared/i18n";

/**
 * Public portfolio domain types. Pure data shapes — no framework/provider imports.
 * All human-readable text is `Localized` (vi/en). `sample: true` marks content that
 * is illustrative placeholder, never presented as verified Owner fact.
 */

export type SocialKind = "github" | "linkedin" | "email" | "resume" | "source";

export interface SocialLink {
  readonly kind: SocialKind;
  readonly label: string;
  readonly href: string;
}

export interface Profile {
  readonly name: string;
  readonly role: Localized<string>;
  readonly headline: Localized<string>;
  readonly summary: Localized<string>;
  readonly location: Localized<string>;
  readonly education: Localized<string>;
  readonly focusAreas: readonly Localized<string>[];
  readonly languages: readonly Localized<string>[];
  readonly socials: readonly SocialLink[];
}

/** A capability group on the tech matrix; `techIds` reference the technology catalog. */
export interface TechGroup {
  readonly id: string;
  readonly title: Localized<string>;
  readonly caption: Localized<string>;
  readonly techIds: readonly string[];
}

export type ContentStatus = "published" | "draft";

export interface ProjectSummary {
  readonly slug: string;
  readonly title: Localized<string>;
  readonly summary: Localized<string>;
  readonly techIds: readonly string[];
  readonly status: ContentStatus;
  readonly sample: boolean;
  readonly year?: number;
  readonly repoUrl?: string;
  readonly demoUrl?: string;
  readonly coverAlt: Localized<string>;
}

/** Case-study detail — the recruiter-facing evidence structure (problem → next step). */
export interface ProjectDetail extends ProjectSummary {
  readonly problem: Localized<string>;
  readonly context: Localized<string>;
  readonly role: Localized<string>;
  readonly architecture: Localized<string>;
  readonly decisions: readonly Localized<string>[];
  readonly tradeoffs: readonly Localized<string>[];
  readonly results: Localized<string>;
  readonly limitations: Localized<string>;
  readonly nextStep: Localized<string>;
}

export interface ArticleSummary {
  readonly slug: string;
  readonly title: Localized<string>;
  readonly summary: Localized<string>;
  readonly tags: readonly string[];
  readonly publishedAt: string; // ISO date
  readonly sample: boolean;
}

export interface ArticleDetail extends ArticleSummary {
  /** Trusted, Owner-authored Markdown. Rendered with a safe renderer (no raw HTML). */
  readonly body: Localized<string>;
}

export interface ExperienceItem {
  readonly id: string;
  readonly org: Localized<string>;
  readonly role: Localized<string>;
  readonly period: string;
  readonly highlights: readonly Localized<string>[];
  readonly sample: boolean;
}

/**
 * A single verified education milestone for the Career timeline. Education rows are
 * flat (no per-locale translation table), so institution/field are plain strings.
 * Years are structured so the view can format the period per locale ("2022 — nay" /
 * "2022 — Present"). Empty `endYear` with `isCurrent` means ongoing.
 */
export interface EducationItem {
  readonly id: string;
  readonly institution: string;
  readonly field: string;
  readonly startYear: string;
  readonly endYear: string;
  readonly isCurrent: boolean;
  readonly sample: boolean;
}
