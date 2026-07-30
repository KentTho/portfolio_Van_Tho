import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/config/env";

/** Supabase client for the browser (uses public publishable key only). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? "",
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  );
}
