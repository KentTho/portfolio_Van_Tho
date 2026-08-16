import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";

/** Localized project text (vi/en). One row per (project, locale). */
export const projectTranslations = pgTable(
  "project_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    tagline: text("tagline"),
    summary: text("summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("project_translations_project_locale_uq").on(t.projectId, t.locale),
    check("project_translations_locale_ck", sql`${t.locale} in ('vi','en')`),
  ],
);

export type ProjectTranslationRow = typeof projectTranslations.$inferSelect;
export type NewProjectTranslationRow = typeof projectTranslations.$inferInsert;
