import { DomainError } from "@/shared/domain/domain-error";

/** One error family for the career context; `entity` names which record kind was involved. */
export type CareerEntity = "experience" | "education" | "certification";

export class CareerNotFoundError extends DomainError {
  readonly code = "CAREER_NOT_FOUND";
  constructor(entity: CareerEntity, id: string) {
    super(`${entity} not found: ${id}`);
  }
}

export class CareerValidationError extends DomainError {
  readonly code = "CAREER_VALIDATION";
  constructor(readonly issues: readonly string[]) {
    super(`Invalid career input: ${issues.join("; ")}`);
  }
}

export class CareerForbiddenError extends DomainError {
  readonly code = "CAREER_FORBIDDEN";
  constructor(reason = "Career operation is not permitted") {
    super(reason);
  }
}

export class CareerStaleWriteError extends DomainError {
  readonly code = "CAREER_STALE_WRITE";
  constructor() {
    super("Record was modified by another writer (stale row_version)");
  }
}

export type CareerError =
  | CareerNotFoundError
  | CareerValidationError
  | CareerForbiddenError
  | CareerStaleWriteError;
