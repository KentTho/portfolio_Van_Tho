import { err, ok, type Result } from "@/shared/domain/result";
import { hasPermission, type Permission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { RevisionForbiddenError } from "@/modules/revisions/domain/revision-errors";

/** Deny-by-default gate for revision use-cases; admin resolved by composition (§13). */
export function authorizeRevision(
  admin: AdminUser | null,
  permission: Permission,
): Result<AdminUser, RevisionForbiddenError> {
  if (!admin || !admin.isActive()) {
    return err(new RevisionForbiddenError("Authentication required"));
  }
  if (!hasPermission(admin.role, permission)) {
    return err(new RevisionForbiddenError(`Role lacks ${permission}`));
  }
  return ok(admin);
}
