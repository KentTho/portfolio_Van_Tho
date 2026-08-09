import { DomainError } from "@/shared/domain/domain-error";

export class TagNotFoundError extends DomainError {
  readonly code = "TAG_NOT_FOUND";
  constructor(idOrSlug: string) {
    super(`Tag not found: ${idOrSlug}`);
  }
}

export class TagSlugConflictError extends DomainError {
  readonly code = "TAG_SLUG_CONFLICT";
  constructor(slug: string) {
    super(`Tag slug already exists: ${slug}`);
  }
}

export class TagValidationError extends DomainError {
  readonly code = "TAG_VALIDATION";
  constructor(readonly issues: readonly string[]) {
    super(`Invalid tag input: ${issues.join("; ")}`);
  }
}

export class TagForbiddenError extends DomainError {
  readonly code = "TAG_FORBIDDEN";
  constructor(reason = "Tag operation is not permitted") {
    super(reason);
  }
}

export type TagError =
  | TagNotFoundError
  | TagSlugConflictError
  | TagValidationError
  | TagForbiddenError;
