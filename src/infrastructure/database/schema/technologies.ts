import { boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { technologyCategory } from "./enums";

/**
 * Normalized technology catalog — the DB authority for tech brand/logo metadata and
 * for tagging projects (`project_technologies`, Group 2). Distinct from `skills`, which
 * holds the owner's proficiency narrative. See docs/audit/DATABASE_SCHEMA_MATRIX.md §2.1.
 */
export const technologies = pgTable(
  "technologies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: technologyCategory("category").notNull().default("tooling"),
    // Devicon icon key (e.g. "react", "typescript"); null falls back to a monochrome tile.
    deviconKey: text("devicon_key"),
    brandColor: text("brand_color"),
    website: text("website"),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [index("technologies_category_sort_idx").on(table.category, table.sortOrder)],
);

export type TechnologyRow = typeof technologies.$inferSelect;
export type NewTechnologyRow = typeof technologies.$inferInsert;
