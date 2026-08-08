import { DomainError } from "@/shared/domain/domain-error";

export class ProjectNotFoundError extends DomainError {
  readonly code = "PROJECT_NOT_FOUND";
  constructor(idOrSlug: string) {
    super(`Project not found: ${idOrSlug}`);
  }
}

export class ProjectSlugConflictError extends DomainError {
  readonly code = "PROJECT_SLUG_CONFLICT";
  constructor(slug: string) {
    super(`Project slug already exists: ${slug}`);
  }
}

export class ProjectValidationError extends DomainError {
  readonly code = "PROJECT_VALIDATION";
  constructor(readonly issues: readonly string[]) {
    super(`Invalid project input: ${issues.join("; ")}`);
  }
}

export class ProjectForbiddenError extends DomainError {
  readonly code = "PROJECT_FORBIDDEN";
  constructor(reason = "Project operation is not permitted") {
    super(reason);
  }
}

/** Optimistic concurrency: the caller's expected row_version is stale. */
export class ProjectStaleWriteError extends DomainError {
  readonly code = "PROJECT_STALE_WRITE";
  constructor() {
    super("Project was modified by another writer (stale row_version)");
  }
}

/** An illegal status transition, e.g. unpublishing a draft. */
export class ProjectStateError extends DomainError {
  readonly code = "PROJECT_STATE_INVALID";
  constructor(reason: string) {
    super(reason);
  }
}

export type ProjectError =
  | ProjectNotFoundError
  | ProjectSlugConflictError
  | ProjectValidationError
  | ProjectForbiddenError
  | ProjectStaleWriteError
  | ProjectStateError;
