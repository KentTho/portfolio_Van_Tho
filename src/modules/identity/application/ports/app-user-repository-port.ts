import type { AdminRole, AdminStatus } from "@/modules/identity/domain/entities/admin-user";

export interface AppUserRecord {
  readonly id: string;
  readonly email: string;
  readonly role: AdminRole;
  readonly status: AdminStatus;
}

export interface ProvisionOwnerInput {
  readonly supabaseUserId: string;
  readonly email: string;
  readonly displayName?: string | null;
}

/** Port over the app_users store (Neon). Implemented in infrastructure. */
export interface AppUserRepositoryPort {
  findBySupabaseUserId(supabaseUserId: string): Promise<AppUserRecord | null>;
  /**
   * Idempotent first-login provisioning for an allow-listed owner. Inserts an
   * owner_admin/active row on first sight; on a repeat login only refreshes email +
   * last_login_at (never re-grants a role that was later revoked administratively).
   */
  provisionOwner(input: ProvisionOwnerInput): Promise<AppUserRecord>;
}
