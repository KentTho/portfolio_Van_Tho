import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/config/env";
import { serverEnv } from "@/config/env.server";
import { STORAGE_BUCKET } from "@/modules/media/domain/value-objects/upload-constraints";

/** Bucket names are owned by the media domain (single source of truth). */
export const STORAGE_BUCKETS = STORAGE_BUCKET;

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
