import type { Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { AdminAccessError } from "@/modules/identity/domain/errors/authorization-error";
import type { AuthPort } from "@/modules/identity/application/ports/auth-port";
import type { AppUserRepositoryPort } from "@/modules/identity/application/ports/app-user-repository-port";
import { evaluateAdminAccess } from "@/modules/identity/application/policies/admin-access-policy";

export interface RequireAdminDeps {
  readonly auth: AuthPort;
  readonly appUsers: AppUserRepositoryPort;
  readonly allowedEmails: readonly string[];
}

/** Resolve the current admin or an authorization error. No framework/infra imports. */
export class RequireAdmin implements UseCase<void, Result<AdminUser, AdminAccessError>> {
  constructor(private readonly deps: RequireAdminDeps) {}

  async execute(): Promise<Result<AdminUser, AdminAccessError>> {
    const identity = await this.deps.auth.getCurrentIdentity();
    const appUser = identity
      ? await this.deps.appUsers.findBySupabaseUserId(identity.supabaseUserId)
      : null;
    return evaluateAdminAccess({
      identity,
      appUser,
      allowedEmails: this.deps.allowedEmails,
    });
  }
}
