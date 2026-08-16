import { err, ok, type Result } from "@/shared/domain/result";
import { ArticleStateError } from "@/modules/articles/domain/article-errors";
import type { ArticleStatus } from "@/modules/articles/domain/article";

/** Pure status-transition policy (mirrors projects): archived must be restored first. */
export function assertCanPublish(status: ArticleStatus): Result<true, ArticleStateError> {
  if (status === "archived") {
    return err(new ArticleStateError("Cannot publish an archived article; restore it first"));
  }
  return ok(true);
}

export function assertCanUnpublish(status: ArticleStatus): Result<true, ArticleStateError> {
  if (status !== "published") {
    return err(new ArticleStateError("Only a published article can be unpublished"));
  }
  return ok(true);
}

export function assertCanArchive(status: ArticleStatus): Result<true, ArticleStateError> {
  if (status === "archived") {
    return err(new ArticleStateError("Article is already archived"));
  }
  return ok(true);
}
