import { err, ok, type Result } from "@/shared/domain/result";
import { hasPermission, type Permission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { ProfileForbiddenError } from "@/modules/profile/domain/profile-errors";

/** Deny-by-default gate for profile use-cases; admin resolved by composition (§13). */
export function authorizeProfile(
  admin: AdminUser | null,
  permission: Permission,
): Result<AdminUser, ProfileForbiddenError> {
  if (!admin || !admin.isActive()) {
    return err(new ProfileForbiddenError("Authentication required"));
  }
  if (!hasPermission(admin.role, permission)) {
    return err(new ProfileForbiddenError(`Role lacks ${permission}`));
  }
  return ok(admin);
}
