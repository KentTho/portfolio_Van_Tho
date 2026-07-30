import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { appRole, userStatus } from "./enums";

/** Admin identity mapping. Bridges Supabase Auth to application authorization (no cross-DB FK). */
export const appUsers = pgTable("app_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  supabaseAuthUserId: uuid("supabase_auth_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  role: appRole("role").notNull().default("owner_admin"),
  status: userStatus("status").notNull().default("active"),
  credentialsRevokedAt: timestamp("credentials_revoked_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  rowVersion: integer("row_version").notNull().default(1),
});

export type AppUserRow = typeof appUsers.$inferSelect;
export type NewAppUserRow = typeof appUsers.$inferInsert;
