import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { contactStatus } from "./enums";

/** Durable contact submissions (Neon is source of truth; email is best-effort). */
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    subject: text("subject"),
    message: text("message").notNull(),
    locale: text("locale").notNull().default("vi"),
    status: contactStatus("status").notNull().default("new"),
    sourcePage: text("source_page"),
    ipHash: text("ip_hash"),
    turnstileVerified: boolean("turnstile_verified").notNull().default(false),
    emailDeliveryStatus: text("email_delivery_status"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    readAt: timestamp("read_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [index("contact_status_created_idx").on(table.status, table.createdAt)],
);

export type ContactMessageRow = typeof contactMessages.$inferSelect;
export type NewContactMessageRow = typeof contactMessages.$inferInsert;
