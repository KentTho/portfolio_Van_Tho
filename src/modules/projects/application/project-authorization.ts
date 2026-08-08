import { err, ok, type Result } from "@/shared/domain/result";
import { hasPermission, type Permission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { ProjectForbiddenError } from "@/modules/projects/domain/project-errors";

/** Deny-by-default gate for project use-cases; admin resolved by composition (§13). */
export function authorizeProject(
  admin: AdminUser | null,
  permission: Permission,
): Result<AdminUser, ProjectForbiddenError> {
  if (!admin || !admin.isActive()) {
    return err(new ProjectForbiddenError("Authentication required"));
  }
  if (!hasPermission(admin.role, permission)) {
    return err(new ProjectForbiddenError(`Role lacks ${permission}`));
  }
  return ok(admin);
}
