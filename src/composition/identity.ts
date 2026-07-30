import "server-only";
import { isOk } from "@/shared/domain/result";
import { adminAllowedEmails } from "@/config/env.server";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { RequireAdmin } from "@/modules/identity/application/use-cases/require-admin";
import { SupabaseAuthAdapter } from "@/modules/identity/infrastructure/supabase-auth-adapter";
import { DrizzleAppUserRepository } from "@/modules/identity/infrastructure/drizzle-app-user-repository";

/**
 * Composition root for identity: wires concrete adapters to the RequireAdmin use
 * case. Presentation imports from here, never from concrete repositories.
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const requireAdmin = new RequireAdmin({
    auth: new SupabaseAuthAdapter(),
    appUsers: new DrizzleAppUserRepository(),
    allowedEmails: adminAllowedEmails,
  });
  const result = await requireAdmin.execute();
  return isOk(result) ? result.value : null;
}
