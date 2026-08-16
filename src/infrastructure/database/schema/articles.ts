import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { articleStatus } from "./enums";
import { mediaAssets } from "./media-assets";
import { tags } from "./tags";

/**
 * Articles (writing / case-study notes). Publication is governed by `status`: a draft is
 * never public; `published` + not-deleted is the public signal. Localized text lives in
 * `article_translations`; body is Markdown/MDX sanitized at render (no trusted raw HTML).
 * Reuses `tags` (Group 1) and `media_assets` — no duplicate authority. See
 * docs/audit/DATABASE_SCHEMA_MATRIX.md.
 */
export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    status: articleStatus("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    featuredOrder: integer("featured_order"),
    coverMediaId: uuid("cover_media_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (t) => [index("articles_status_published_idx").on(t.status, t.publishedAt)],
);

/** Localized article text (vi/en). One row per (article, locale). */
export const articleTranslations = pgTable(
  "article_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    bodyMd: text("body_md").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("article_translations_article_locale_uq").on(t.articleId, t.locale),
    check("article_translations_locale_ck", sql`${t.locale} in ('vi','en')`),
  ],
);

/** Article ↔ tag links. RESTRICT on tag (reference-aware); cascade when the article dies. */
export const articleTags = pgTable(
  "article_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [unique("article_tags_pair_uq").on(t.articleId, t.tagId)],
);

export type ArticleRow = typeof articles.$inferSelect;
export type NewArticleRow = typeof articles.$inferInsert;
export type ArticleTranslationRow = typeof articleTranslations.$inferSelect;
export type ArticleTagRow = typeof articleTags.$inferSelect;
