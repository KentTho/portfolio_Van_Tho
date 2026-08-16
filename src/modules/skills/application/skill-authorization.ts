import { err, ok, type Result } from "@/shared/domain/result";
import { hasPermission, type Permission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { SkillForbiddenError } from "@/modules/skills/domain/skill-errors";

/** Deny-by-default gate for skill use-cases; admin resolved by composition (§13). */
export function authorizeSkill(
  admin: AdminUser | null,
  permission: Permission,
): Result<AdminUser, SkillForbiddenError> {
  if (!admin || !admin.isActive()) {
    return err(new SkillForbiddenError("Authentication required"));
  }
  if (!hasPermission(admin.role, permission)) {
    return err(new SkillForbiddenError(`Role lacks ${permission}`));
  }
  return ok(admin);
}
