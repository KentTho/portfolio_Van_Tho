import { err, ok, type Result } from "@/shared/domain/result";
import { hasPermission, type Permission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { TagForbiddenError } from "@/modules/tags/domain/tag-errors";

/** Deny-by-default gate for tag use-cases; admin resolved by composition (§13). */
export function authorizeTag(
  admin: AdminUser | null,
  permission: Permission,
): Result<AdminUser, TagForbiddenError> {
  if (!admin || !admin.isActive()) {
    return err(new TagForbiddenError("Authentication required"));
  }
  if (!hasPermission(admin.role, permission)) {
    return err(new TagForbiddenError(`Role lacks ${permission}`));
  }
  return ok(admin);
}
