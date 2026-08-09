import { err, isErr, ok, type Result } from "@/shared/domain/result";
import { hasPermission } from "@/config/permissions";
import type { UseCase } from "@/shared/application/use-case";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { AuditForbiddenError, type AuditError } from "@/modules/audit/domain/audit-errors";
import type { AuditEntryView, AuditReadPort } from "@/modules/audit/application/ports/audit-read-port";

interface Input {
  readonly admin: AdminUser | null;
  readonly limit?: number;
}

/** Read-only recent audit trail. Requires the `audit.read` permission (deny by default). */
export class ListAuditEntries
  implements UseCase<Input, Result<readonly AuditEntryView[], AuditError>>
{
  constructor(private readonly deps: { repo: AuditReadPort }) {}
  async execute(input: Input): Promise<Result<readonly AuditEntryView[], AuditError>> {
    const auth = authorize(input.admin);
    if (isErr(auth)) return auth;
    const limit = Math.min(Math.max(input.limit ?? 100, 1), 200);
    return ok(await this.deps.repo.listRecent(limit));
  }
}

function authorize(admin: AdminUser | null): Result<AdminUser, AuditForbiddenError> {
  if (!admin || !admin.isActive()) return err(new AuditForbiddenError("Authentication required"));
  if (!hasPermission(admin.role, "audit.read")) return err(new AuditForbiddenError("Role lacks audit.read"));
  return ok(admin);
}
