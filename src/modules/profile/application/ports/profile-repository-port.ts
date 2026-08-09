import type { Profile } from "@/modules/profile/domain/profile";
import type { ProfileUpdateInput } from "@/modules/profile/application/profile-schema";

/**
 * Singleton profile repository. `get` returns the current profile (defaults if the row was
 * never written); `update` upserts the single "primary" row. Public reads use the same
 * projection — the profile carries no private fields.
 */
export interface ProfileRepositoryPort {
  get(): Promise<Profile>;
  update(patch: ProfileUpdateInput): Promise<Profile>;
}
