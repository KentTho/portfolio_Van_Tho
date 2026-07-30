import { z } from "zod";

/**
 * Runtime environment validation foundation.
 * PUBLIC vs SERVER variables are kept separate. Wave 02 requires NO provider
 * secrets — every field is optional/defaulted so the app builds and runs
 * without a populated .env. Required provider config is introduced in Wave 03.
 *
 * Never expose SERVER variables through NEXT_PUBLIC_*. Never print values.
 */

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(["vi", "en"]).default("vi"),
});

const serverEnvSchema = z.object({
  APP_ENV: z.enum(["development", "preview", "production"]).default("development"),
  ADMIN_ALLOWED_EMAILS: z.string().default(""),
});

function parseEnv<T extends z.ZodType>(
  schema: T,
  source: Record<string, unknown>,
  scope: string,
): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    // Report offending keys only — never the values.
    const keys = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid ${scope} environment configuration. Check keys: ${keys}`);
  }
  return result.data;
}

export const publicEnv = parseEnv(
  publicEnvSchema,
  {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  },
  "public",
);

export const serverEnv = parseEnv(
  serverEnvSchema,
  {
    APP_ENV: process.env.APP_ENV,
    ADMIN_ALLOWED_EMAILS: process.env.ADMIN_ALLOWED_EMAILS,
  },
  "server",
);

export type PublicEnv = typeof publicEnv;
export type ServerEnv = typeof serverEnv;
