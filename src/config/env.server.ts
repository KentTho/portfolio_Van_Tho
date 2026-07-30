import "server-only";
import { z } from "zod";

/**
 * SERVER-ONLY environment. Importing this from a Client Component fails the build
 * (via `server-only`). Values are validated but never printed.
 * Database/Supabase secrets are required from Wave 03 onward.
 */
const serverEnvSchema = z.object({
  APP_ENV: z.enum(["development", "preview", "production"]).default("development"),
  ADMIN_ALLOWED_EMAILS: z.string().default(""),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_URL_UNPOOLED: z.string().optional(),
  SUPABASE_SECRET_KEY: z.string().optional(),
});

const result = serverEnvSchema.safeParse({
  APP_ENV: process.env.APP_ENV,
  ADMIN_ALLOWED_EMAILS: process.env.ADMIN_ALLOWED_EMAILS,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
});

if (!result.success) {
  const keys = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
  throw new Error(`Invalid server environment configuration. Check keys: ${keys}`);
}

export const serverEnv = result.data;

/** Parsed admin allow-list (lowercased, trimmed). Server-only. */
export const adminAllowedEmails: readonly string[] = serverEnv.ADMIN_ALLOWED_EMAILS.split(",")
  .map((email) => email.trim().toLowerCase())
  .filter((email) => email.length > 0);

export type ServerEnv = typeof serverEnv;
