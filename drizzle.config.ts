import type { Config } from "drizzle-kit";

// `drizzle-kit generate` reads the schema only (offline, no DB connection).
// `migrate` uses the unpooled/direct connection and is a human-approved step
// (never run against production automatically).
export default {
  schema: "./src/infrastructure/database/schema/index.ts",
  out: "./src/infrastructure/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
