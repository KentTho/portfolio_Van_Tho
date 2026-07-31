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

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/**
 * Validate + return the server env on first use (lazy, memoized). Kept OUT of
 * module scope on purpose: `next build` collects page data by importing route
 * modules, and eager validation here would make the build require real secrets.
 * Validation runs at request time instead; a missing key throws the same error
 * the moment a server path actually needs it. Values are never printed.
 */
function loadServerEnv(): ServerEnv {
  if (cached) return cached;
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
  cached = result.data;
  return cached;
}

/**
 * Server-only env accessor. Property access is lazily validated on first use, so
 * importing this module has no side effects at build time.
 */
export const serverEnv: ServerEnv = new Proxy({} as ServerEnv, {
  get(_target, prop) {
    return loadServerEnv()[prop as keyof ServerEnv];
  },
});

/** Parsed admin allow-list (lowercased, trimmed). Server-only, lazily evaluated. */
export function getAdminAllowedEmails(): readonly string[] {
  return loadServerEnv()
    .ADMIN_ALLOWED_EMAILS.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}
