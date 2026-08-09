import { DomainError } from "@/shared/domain/domain-error";

export class ArticleNotFoundError extends DomainError {
  readonly code = "ARTICLE_NOT_FOUND";
  constructor(idOrSlug: string) {
    super(`Article not found: ${idOrSlug}`);
  }
}

export class ArticleSlugConflictError extends DomainError {
  readonly code = "ARTICLE_SLUG_CONFLICT";
  constructor(slug: string) {
    super(`Article slug already exists: ${slug}`);
  }
}

export class ArticleValidationError extends DomainError {
  readonly code = "ARTICLE_VALIDATION";
  constructor(readonly issues: readonly string[]) {
    super(`Invalid article input: ${issues.join("; ")}`);
  }
}

export class ArticleForbiddenError extends DomainError {
  readonly code = "ARTICLE_FORBIDDEN";
  constructor(reason = "Article operation is not permitted") {
    super(reason);
  }
}

export class ArticleStaleWriteError extends DomainError {
  readonly code = "ARTICLE_STALE_WRITE";
  constructor() {
    super("Article was modified by another writer (stale row_version)");
  }
}

export class ArticleStateError extends DomainError {
  readonly code = "ARTICLE_STATE_INVALID";
  constructor(reason: string) {
    super(reason);
  }
}

export type ArticleError =
  | ArticleNotFoundError
  | ArticleSlugConflictError
  | ArticleValidationError
  | ArticleForbiddenError
  | ArticleStaleWriteError
  | ArticleStateError;
