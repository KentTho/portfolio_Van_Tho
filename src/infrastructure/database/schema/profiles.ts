import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Singleton owner profile (enforced by unique singleton_key). */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  singletonKey: text("singleton_key").notNull().unique().default("primary"),
  fullName: text("full_name").notNull().default(""),
  professionalTitle: text("professional_title").notNull().default(""),
  location: text("location"),
  publicEmail: text("public_email"),
  availabilityStatus: text("availability_status").notNull().default("unknown"),
  defaultLocale: text("default_locale").notNull().default("vi"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProfileRow = typeof profiles.$inferSelect;
