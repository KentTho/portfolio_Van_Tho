import type { Locale } from "@/shared/domain/locale";

/**
 * Article domain — pure read models + the SSOT status tuple mirrored by the
 * `article_status` Postgres enum (drift-guarded in tests). Publication: a draft is never
 * public; `published` + not-deleted is the public signal.
 */
export const ARTICLE_STATUSES = ["draft", "published", "archived"] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export interface Article {
  readonly id: string;
  readonly slug: string;
  readonly status: ArticleStatus;
  readonly featured: boolean;
  readonly featuredOrder: number | null;
  readonly coverMediaId: string | null;
  readonly publishedAt: Date | null;
  readonly rowVersion: number;
}

export interface ArticleTranslation {
  readonly locale: Locale;
  readonly title: string;
  readonly summary: string | null;
  /** Markdown/MDX body — sanitized at render time; no trusted raw HTML is stored. */
  readonly bodyMd: string;
}

export interface ArticleTagRef {
  readonly tagId: string;
  readonly sortOrder: number;
}

/** Full editable aggregate for the Admin edit screen. */
export interface AdminArticleAggregate {
  readonly article: Article;
  readonly translations: readonly ArticleTranslation[];
  readonly tags: readonly ArticleTagRef[];
}
