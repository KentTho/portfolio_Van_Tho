import { err, ok, type Result } from "@/shared/domain/result";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import {
  type AdminAccessError,
  AuthenticationRequiredError,
  AuthorizationDeniedError,
} from "@/modules/identity/domain/errors/authorization-error";
import type { AuthIdentity } from "@/modules/identity/application/ports/auth-port";
import type { AppUserRecord } from "@/modules/identity/application/ports/app-user-repository-port";

export interface AdminAccessInput {
  readonly identity: AuthIdentity | null;
  readonly appUser: AppUserRecord | null;
  readonly allowedEmails: readonly string[];
}

/**
 * Pure authorization decision. Deny by default. Order: authenticated → allow-list →
 * has active app_user record → sufficient role. Fully unit-testable.
 */
export function evaluateAdminAccess(input: AdminAccessInput): Result<AdminUser, AdminAccessError> {
  const { identity, appUser, allowedEmails } = input;

  if (!identity) return err(new AuthenticationRequiredError());

  const email = identity.email.trim().toLowerCase();
  if (allowedEmails.length > 0 && !allowedEmails.includes(email)) {
    return err(new AuthorizationDeniedError("Email not in admin allow-list"));
  }
  if (!appUser) return err(new AuthorizationDeniedError("No admin record"));
  if (appUser.status !== "active") {
    return err(new AuthorizationDeniedError("Admin account is not active"));
  }
  if (appUser.role !== "owner_admin" && appUser.role !== "editor") {
    return err(new AuthorizationDeniedError("Insufficient role"));
  }

  return ok(
    AdminUser.create(appUser.id, {
      email: appUser.email,
      role: appUser.role,
      status: appUser.status,
    }),
  );
}
