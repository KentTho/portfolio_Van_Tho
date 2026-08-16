import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { mediaAssets } from "./media-assets";
import { projects } from "./projects";

/**
 * Ordered media references for a project. RESTRICT on media (reference-aware deletion,
 * CLAUDE.md §14) — media stays the single blob authority; this table never stores file bytes.
 */
export const projectMedia = pgTable(
  "project_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "restrict" }),
    role: text("role").notNull().default("gallery"),
    caption: text("caption"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("project_media_project_sort_idx").on(t.projectId, t.sortOrder)],
);

export type ProjectMediaRow = typeof projectMedia.$inferSelect;
export type NewProjectMediaRow = typeof projectMedia.$inferInsert;
