import { DomainError } from "@/shared/domain/domain-error";

/** No visible/non-deleted technology matches the given id or slug. */
export class TechnologyNotFoundError extends DomainError {
  readonly code = "TECHNOLOGY_NOT_FOUND";
  constructor(idOrSlug: string) {
    super(`Technology not found: ${idOrSlug}`);
  }
}

/** A technology with the same slug already exists (unique constraint would reject). */
export class TechnologySlugConflictError extends DomainError {
  readonly code = "TECHNOLOGY_SLUG_CONFLICT";
  constructor(slug: string) {
    super(`Technology slug already exists: ${slug}`);
  }
}

/** Trust-boundary validation failed (Zod). Carries human-readable issue messages. */
export class TechnologyValidationError extends DomainError {
  readonly code = "TECHNOLOGY_VALIDATION";
  constructor(readonly issues: readonly string[]) {
    super(`Invalid technology input: ${issues.join("; ")}`);
  }
}

/** Caller is not an authenticated, authorized admin for this technology operation. */
export class TechnologyForbiddenError extends DomainError {
  readonly code = "TECHNOLOGY_FORBIDDEN";
  constructor(reason = "Technology operation is not permitted") {
    super(reason);
  }
}

export type TechnologyError =
  | TechnologyNotFoundError
  | TechnologySlugConflictError
  | TechnologyValidationError
  | TechnologyForbiddenError;
