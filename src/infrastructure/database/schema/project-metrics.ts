import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";

/**
 * Verified project metrics. `value` is text (e.g. "40%", "1.2s") — never a fabricated number;
 * `evidence_url` should point at proof. No metric is rendered publicly without evidence.
 */
export const projectMetrics = pgTable(
  "project_metrics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    value: text("value").notNull(),
    unit: text("unit"),
    evidenceUrl: text("evidence_url"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("project_metrics_project_sort_idx").on(t.projectId, t.sortOrder)],
);

export type ProjectMetricRow = typeof projectMetrics.$inferSelect;
export type NewProjectMetricRow = typeof projectMetrics.$inferInsert;
