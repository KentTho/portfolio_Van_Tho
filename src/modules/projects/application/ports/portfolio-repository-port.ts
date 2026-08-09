import type { Locale } from "@/shared/domain/locale";
import type { ProjectLinkType, ProjectSectionKind } from "@/modules/projects/domain/project";

/**
 * Neutral PUBLIC read contract over the content model. The Drizzle implementation returns
 * ONLY published, public, non-deleted rows — never draft/archived/private/deleted and
 * never a SAMPLE fallback (CLAUDE.md §11, prompt §F/§P). Deterministic ordering.
 */

export interface PublicProjectSummary {
  readonly slug: string;
  readonly title: string;
  readonly tagline: string | null;
  readonly summary: string | null;
  readonly category: string;
  readonly featured: boolean;
  readonly publishedAt: Date | null;
}

export interface PublicProjectLink {
  readonly linkType: ProjectLinkType;
  readonly url: string;
  readonly label: string | null;
}

export interface PublicProjectMetric {
  readonly label: string;
  readonly value: string;
  readonly unit: string | null;
  readonly evidenceUrl: string | null;
}

export interface PublicProjectSection {
  readonly kind: ProjectSectionKind;
  readonly heading: string | null;
  readonly bodyMd: string;
}

export interface PublicProjectTechnology {
  readonly slug: string;
  readonly name: string;
}

export interface PublicProjectDetail extends PublicProjectSummary {
  readonly links: readonly PublicProjectLink[];
  readonly metrics: readonly PublicProjectMetric[];
  readonly sections: readonly PublicProjectSection[];
  readonly technologies: readonly PublicProjectTechnology[];
}

export interface PublicArticleSummary {
  readonly slug: string;
  readonly title: string;
  readonly summary: string | null;
  readonly featured: boolean;
  readonly publishedAt: Date | null;
  readonly tags: readonly string[];
}

export interface PublicArticleDetail extends PublicArticleSummary {
  readonly bodyMd: string;
}

export interface PortfolioRepositoryPort {
  listPublishedProjects(locale: Locale): Promise<readonly PublicProjectSummary[]>;
  getPublishedProject(slug: string, locale: Locale): Promise<PublicProjectDetail | null>;
  listPublishedArticles(locale: Locale): Promise<readonly PublicArticleSummary[]>;
  getPublishedArticle(slug: string, locale: Locale): Promise<PublicArticleDetail | null>;
}
