import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/config/env";
import { serverEnv } from "@/config/env.server";

export const STORAGE_BUCKETS = {
  public: "portfolio-public",
  private: "portfolio-private",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/** Server-only service client for admin storage operations (signed URLs, uploads). */
export function createSupabaseServiceClient() {
  const secret = serverEnv.SUPABASE_SECRET_KEY;
  if (!secret) {
    throw new Error("SUPABASE_SECRET_KEY is not configured");
  }
  return createClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? "", secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
