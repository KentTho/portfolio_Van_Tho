import { err, ok, type Result } from "@/shared/domain/result";
import { hasPermission, type Permission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { TechnologyForbiddenError } from "@/modules/technologies/domain/technology-errors";

/**
 * Pure authorization gate for technology use-cases. The admin is resolved by the
 * composition root (never asserted by the client, CLAUDE.md §13). Deny by default:
 * an inactive or under-permissioned admin fails closed.
 */
export function authorizeTechnology(
  admin: AdminUser | null,
  permission: Permission,
): Result<AdminUser, TechnologyForbiddenError> {
  if (!admin || !admin.isActive()) {
    return err(new TechnologyForbiddenError("Authentication required"));
  }
  if (!hasPermission(admin.role, permission)) {
    return err(new TechnologyForbiddenError(`Role lacks ${permission}`));
  }
  return ok(admin);
}
