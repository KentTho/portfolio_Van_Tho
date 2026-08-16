import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { projectLinkType } from "./enums";
import { projects } from "./projects";

/**
 * Typed external links. Supersedes the legacy `projects.github_url/live_url/video_url`
 * columns (kept, deprecated — additive-only, no DROP this Wave). New writes use this table.
 */
export const projectLinks = pgTable(
  "project_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    linkType: projectLinkType("link_type").notNull(),
    url: text("url").notNull(),
    label: text("label"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("project_links_project_sort_idx").on(t.projectId, t.sortOrder)],
);

export type ProjectLinkRow = typeof projectLinks.$inferSelect;
export type NewProjectLinkRow = typeof projectLinks.$inferInsert;
