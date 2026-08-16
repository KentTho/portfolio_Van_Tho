import { err, ok, type Result } from "@/shared/domain/result";
import { hasPermission, type Permission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { ArticleForbiddenError } from "@/modules/articles/domain/article-errors";

/** Deny-by-default gate for article use-cases; admin resolved by composition (§13). */
export function authorizeArticle(
  admin: AdminUser | null,
  permission: Permission,
): Result<AdminUser, ArticleForbiddenError> {
  if (!admin || !admin.isActive()) {
    return err(new ArticleForbiddenError("Authentication required"));
  }
  if (!hasPermission(admin.role, permission)) {
    return err(new ArticleForbiddenError(`Role lacks ${permission}`));
  }
  return ok(admin);
}
