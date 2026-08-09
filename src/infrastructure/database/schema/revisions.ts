import { index, integer, jsonb, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { appUsers } from "./app-users";

/**
 * Immutable content revision snapshots — distinct authority from `audit_logs`:
 *   audit_logs        = who / action / time (append-only activity trail)
 *   content_revisions = the full immutable content STATE at a point in time
 *
 * `content_type` + `content_id` is a polymorphic reference (projects, articles,
 * experiences, …) so there is intentionally NO single FK. Append-only by design: there is
 * no `updated_at`/`deleted_at` and no application update/delete path — a "restore" is a
 * NEW forward mutation on the live entity, never a destructive rewrite here. No Dev
 * auto-purge. `snapshot` holds the entity payload (all locales); `locale` optionally
 * scopes a partial revision.
 */
export const contentRevisions = pgTable(
  "content_revisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentType: text("content_type").notNull(),
    contentId: uuid("content_id").notNull(),
    locale: text("locale"),
    version: integer("version").notNull(),
    actorUserId: uuid("actor_user_id").references(() => appUsers.id, { onDelete: "set null" }),
    snapshot: jsonb("snapshot").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("content_revisions_entity_version_uq").on(t.contentType, t.contentId, t.version),
    index("content_revisions_entity_created_idx").on(t.contentType, t.contentId, t.createdAt),
  ],
);

export type ContentRevisionRow = typeof contentRevisions.$inferSelect;
export type NewContentRevisionRow = typeof contentRevisions.$inferInsert;
