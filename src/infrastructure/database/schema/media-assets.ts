import { integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { mediaVisibility } from "./enums";

/** Storage object metadata. `public_url` is not authority for private objects. */
export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bucket: text("bucket").notNull(),
    objectPath: text("object_path").notNull(),
    mimeType: text("mime_type").notNull(),
    byteSize: integer("byte_size").notNull().default(0),
    altText: text("alt_text").notNull().default(""),
    visibility: mediaVisibility("visibility").notNull().default("private"),
    uploadStatus: text("upload_status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("media_bucket_path_idx").on(table.bucket, table.objectPath)],
);

export type MediaAssetRow = typeof mediaAssets.$inferSelect;
