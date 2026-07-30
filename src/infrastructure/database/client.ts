import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { serverEnv } from "@/config/env.server";
import * as schema from "@/infrastructure/database/schema";

// Neon HTTP driver — lazy: no connection is opened until a query runs.
const sql = neon(serverEnv.DATABASE_URL);

export const db = drizzle({ client: sql, schema });
export type Database = typeof db;
