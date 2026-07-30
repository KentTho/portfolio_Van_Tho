import type { AdminRole, AdminStatus } from "@/modules/identity/domain/entities/admin-user";

export interface AppUserRecord {
  readonly id: string;
  readonly email: string;
  readonly role: AdminRole;
  readonly status: AdminStatus;
}

/** Port over the app_users store (Neon). Implemented in infrastructure. */
export interface AppUserRepositoryPort {
  findBySupabaseUserId(supabaseUserId: string): Promise<AppUserRecord | null>;
}
