import { err, ok, type Result } from "@/shared/domain/result";
import { hasPermission, type Permission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { CareerForbiddenError } from "@/modules/career/domain/career-errors";

/** Deny-by-default gate for career use-cases; admin resolved by composition (§13). */
export function authorizeCareer(
  admin: AdminUser | null,
  permission: Permission,
): Result<AdminUser, CareerForbiddenError> {
  if (!admin || !admin.isActive()) {
    return err(new CareerForbiddenError("Authentication required"));
  }
  if (!hasPermission(admin.role, permission)) {
    return err(new CareerForbiddenError(`Role lacks ${permission}`));
  }
  return ok(admin);
}
