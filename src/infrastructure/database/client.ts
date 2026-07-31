import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { serverEnv } from "@/config/env.server";
import * as schema from "@/infrastructure/database/schema";

// Neon HTTP driver. The client is built on first use (lazy, memoized) so that
// `next build` never reads DATABASE_URL — the connection string is only touched
// when a query actually runs at request time. neon-http opens no socket until then.
type DrizzleClient = ReturnType<typeof buildDb>;

let cached: DrizzleClient | undefined;

function buildDb() {
  const sql = neon(serverEnv.DATABASE_URL);
  return drizzle({ client: sql, schema });
}

/** Returns the shared Drizzle client, constructing it on first call. */
export function getDb(): DrizzleClient {
  cached ??= buildDb();
  return cached;
}

export type Database = DrizzleClient;
