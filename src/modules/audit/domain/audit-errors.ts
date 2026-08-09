import { DomainError } from "@/shared/domain/domain-error";

export class AuditForbiddenError extends DomainError {
  readonly code = "AUDIT_FORBIDDEN";
  constructor(reason = "Audit access is not permitted") {
    super(reason);
  }
}

export type AuditError = AuditForbiddenError;
