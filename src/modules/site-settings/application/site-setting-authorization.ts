import { err, ok, type Result } from "@/shared/domain/result";
import { hasPermission, type Permission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { SettingForbiddenError } from "@/modules/site-settings/domain/site-setting-errors";

/** Deny-by-default gate for site-setting use-cases; admin resolved by composition (§13). */
export function authorizeSetting(
  admin: AdminUser | null,
  permission: Permission,
): Result<AdminUser, SettingForbiddenError> {
  if (!admin || !admin.isActive()) {
    return err(new SettingForbiddenError("Authentication required"));
  }
  if (!hasPermission(admin.role, permission)) {
    return err(new SettingForbiddenError(`Role lacks ${permission}`));
  }
  return ok(admin);
}
