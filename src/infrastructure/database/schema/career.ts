import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Career history — experiences, education, certifications. Owner content only; NO
 * fabricated data is seeded. `is_visible` is the explicit public gate (private rows never
 * leak); `deleted_at` soft-deletes. Language-neutral facts (organization, dates, URLs)
 * live on the base rows; localized role/description lives in `experience_translations`.
 * Reuses profiles/skills/media_assets/audit_logs — no duplicate authority.
 */
export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization: text("organization").notNull(),
    employmentType: text("employment_type"),
    location: text("location"),
    url: text("url"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    isCurrent: boolean("is_current").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (t) => [index("experiences_visible_sort_idx").on(t.isVisible, t.sortOrder)],
);

/** Localized role title + description for an experience (vi/en). One row per (exp, locale). */
export const experienceTranslations = pgTable(
  "experience_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    experienceId: uuid("experience_id")
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("experience_translations_exp_locale_uq").on(t.experienceId, t.locale),
    check("experience_translations_locale_ck", sql`${t.locale} in ('vi','en')`),
  ],
);

export const education = pgTable(
  "education",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    institution: text("institution").notNull(),
    degree: text("degree"),
    fieldOfStudy: text("field_of_study"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    isCurrent: boolean("is_current").notNull().default(false),
    url: text("url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (t) => [index("education_visible_sort_idx").on(t.isVisible, t.sortOrder)],
);

export const certifications = pgTable(
  "certifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    issuer: text("issuer").notNull(),
    issueDate: date("issue_date"),
    expiryDate: date("expiry_date"),
    credentialId: text("credential_id"),
    credentialUrl: text("credential_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (t) => [index("certifications_visible_sort_idx").on(t.isVisible, t.sortOrder)],
);

export type ExperienceRow = typeof experiences.$inferSelect;
export type ExperienceTranslationRow = typeof experienceTranslations.$inferSelect;
export type EducationRow = typeof education.$inferSelect;
export type CertificationRow = typeof certifications.$inferSelect;
