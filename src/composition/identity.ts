import "server-only";
import { isOk, type Result } from "@/shared/domain/result";
import { getAdminAllowedEmails } from "@/config/env.server";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { AdminAccessError } from "@/modules/identity/domain/errors/authorization-error";
import { RequireAdmin } from "@/modules/identity/application/use-cases/require-admin";
import { BootstrapOwnerAdmin } from "@/modules/identity/application/use-cases/bootstrap-owner-admin";
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
    allowedEmails: getAdminAllowedEmails(),
  });
  const result = await requireAdmin.execute();
  return isOk(result) ? result.value : null;
}

/**
 * First-login owner provisioning (allow-list gated). Called from the OAuth callback after a
 * verified Supabase session so the single allow-listed owner is bridged to an app_users
 * owner_admin record without a manual seed step.
 */
export async function bootstrapOwnerAdmin(): Promise<Result<AdminUser, AdminAccessError>> {
  const bootstrap = new BootstrapOwnerAdmin({
    auth: new SupabaseAuthAdapter(),
    appUsers: new DrizzleAppUserRepository(),
    allowedEmails: getAdminAllowedEmails(),
  });
  return bootstrap.execute();
}
