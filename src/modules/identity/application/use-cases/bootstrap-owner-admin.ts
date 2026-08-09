import { err, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import {
  type AdminAccessError,
  AuthenticationRequiredError,
  AuthorizationDeniedError,
} from "@/modules/identity/domain/errors/authorization-error";
import { AdminUser as AdminUserEntity } from "@/modules/identity/domain/entities/admin-user";
import type { AuthPort } from "@/modules/identity/application/ports/auth-port";
import type { AppUserRepositoryPort } from "@/modules/identity/application/ports/app-user-repository-port";

export interface BootstrapOwnerAdminDeps {
  readonly auth: AuthPort;
  readonly appUsers: AppUserRepositoryPort;
  readonly allowedEmails: readonly string[];
}

/**
 * First-login provisioning for the allow-listed owner. Deny-by-default: only an
 * authenticated Supabase identity whose email is on `ADMIN_ALLOWED_EMAILS` is provisioned
 * as owner_admin (idempotent). This is NOT a second auth authority — Supabase remains the
 * identity provider and the allow-list remains the gate; it only bridges a verified OAuth
 * identity to its Neon app_users authorization record.
 */
export class BootstrapOwnerAdmin implements UseCase<void, Result<AdminUser, AdminAccessError>> {
  constructor(private readonly deps: BootstrapOwnerAdminDeps) {}

  async execute(): Promise<Result<AdminUser, AdminAccessError>> {
    const identity = await this.deps.auth.getCurrentIdentity();
    if (!identity) return err(new AuthenticationRequiredError());

    const email = identity.email.trim().toLowerCase();
    if (this.deps.allowedEmails.length === 0 || !this.deps.allowedEmails.includes(email)) {
      return err(new AuthorizationDeniedError("Email not in admin allow-list"));
    }

    const record = await this.deps.appUsers.provisionOwner({
      supabaseUserId: identity.supabaseUserId,
      email,
    });
    if (record.status !== "active") {
      return err(new AuthorizationDeniedError("Admin account is not active"));
    }
    return ok(
      AdminUserEntity.create(record.id, {
        email: record.email,
        role: record.role,
        status: record.status,
      }),
    );
  }
}
