import "server-only";
import type { AuthIdentity, AuthPort } from "@/modules/identity/application/ports/auth-port";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export class SupabaseAuthAdapter implements AuthPort {
  async getCurrentIdentity(): Promise<AuthIdentity | null> {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;
    return { supabaseUserId: user.id, email: user.email };
  }
}
