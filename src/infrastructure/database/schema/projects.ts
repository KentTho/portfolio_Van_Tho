import { boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projectStatus, projectVisibility } from "./enums";
import { mediaAssets } from "./media-assets";

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    status: projectStatus("status").notNull().default("draft"),
    visibility: projectVisibility("visibility").notNull().default("private"),
    category: text("category").notNull().default("software"),
    featured: boolean("featured").notNull().default(false),
    featuredOrder: integer("featured_order"),
    role: text("role"),
    githubUrl: text("github_url"),
    liveUrl: text("live_url"),
    videoUrl: text("video_url"),
    coverMediaId: uuid("cover_media_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    rowVersion: integer("row_version").notNull().default(1),
  },
  (table) => [
    index("projects_status_published_idx").on(table.status, table.publishedAt),
    index("projects_featured_idx").on(table.featured, table.featuredOrder),
  ],
);

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
