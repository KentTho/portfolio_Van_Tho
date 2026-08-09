import { DomainError } from "@/shared/domain/domain-error";

export class RevisionNotFoundError extends DomainError {
  readonly code = "REVISION_NOT_FOUND";
  constructor(id: string) {
    super(`Revision not found: ${id}`);
  }
}

export class RevisionValidationError extends DomainError {
  readonly code = "REVISION_VALIDATION";
  constructor(readonly issues: readonly string[]) {
    super(`Invalid revision input: ${issues.join("; ")}`);
  }
}

export class RevisionForbiddenError extends DomainError {
  readonly code = "REVISION_FORBIDDEN";
  constructor(reason = "Revision operation is not permitted") {
    super(reason);
  }
}

export type RevisionError =
  | RevisionNotFoundError
  | RevisionValidationError
  | RevisionForbiddenError;
