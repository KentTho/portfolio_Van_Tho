import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { projectSections } from "./project-sections";

/** Localized section body (vi/en). One row per (section, locale). */
export const projectSectionTranslations = pgTable(
  "project_section_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => projectSections.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    heading: text("heading"),
    bodyMd: text("body_md").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("project_section_translations_section_locale_uq").on(t.sectionId, t.locale),
    check("project_section_translations_locale_ck", sql`${t.locale} in ('vi','en')`),
  ],
);

export type ProjectSectionTranslationRow = typeof projectSectionTranslations.$inferSelect;
export type NewProjectSectionTranslationRow = typeof projectSectionTranslations.$inferInsert;
