import { boolean, integer, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { projectSectionKind } from "./enums";
import { projects } from "./projects";

/** Ordered case-study blocks per project. One row per (project, kind). */
export const projectSections = pgTable(
  "project_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    kind: projectSectionKind("kind").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("project_sections_project_kind_uq").on(t.projectId, t.kind)],
);

export type ProjectSectionRow = typeof projectSections.$inferSelect;
export type NewProjectSectionRow = typeof projectSections.$inferInsert;
