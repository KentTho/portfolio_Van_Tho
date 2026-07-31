import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull().default("general"),
  proficiencyLabel: text("proficiency_label"),
  evidenceText: text("evidence_text"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
});

export type SkillRow = typeof skills.$inferSelect;
