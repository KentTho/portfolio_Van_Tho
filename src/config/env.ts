import { z } from "zod";

/**
 * PUBLIC environment — safe to reference in the browser bundle (NEXT_PUBLIC_*).
 * Server-only secrets live in `env.server.ts` (guarded by `server-only`).
 * Never print values.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(["vi", "en"]).default("vi"),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
});

function parseEnv<T extends z.ZodType>(
  schema: T,
  source: Record<string, unknown>,
  scope: string,
): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
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
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
  "public",
);

export type PublicEnv = typeof publicEnv;
