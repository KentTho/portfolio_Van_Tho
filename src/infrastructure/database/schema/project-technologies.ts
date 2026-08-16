import { integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { technologies } from "./technologies";

/** Project ↔ technology tags. RESTRICT on technology (reference-aware). */
export const projectTechnologies = pgTable(
  "project_technologies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technologyId: uuid("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [unique("project_technologies_pair_uq").on(t.projectId, t.technologyId)],
);

export type ProjectTechnologyRow = typeof projectTechnologies.$inferSelect;
export type NewProjectTechnologyRow = typeof projectTechnologies.$inferInsert;
