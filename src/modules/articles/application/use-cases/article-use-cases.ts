import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { AdminArticleAggregate, Article } from "@/modules/articles/domain/article";
import {
  ArticleNotFoundError,
  ArticleSlugConflictError,
  ArticleStaleWriteError,
  ArticleValidationError,
  type ArticleError,
} from "@/modules/articles/domain/article-errors";
import {
  assertCanArchive,
  assertCanPublish,
  assertCanUnpublish,
} from "@/modules/articles/domain/article-state";
import {
  articleCreateSchema,
  articleUpdateSchema,
} from "@/modules/articles/application/article-schema";
import { authorizeArticle } from "@/modules/articles/application/article-authorization";
import type {
  ArticleRepositoryPort,
  ArticleWriteOutcome,
} from "@/modules/articles/application/ports/article-repository-port";

export interface ReadDeps {
  readonly repo: ArticleRepositoryPort;
}
export interface WriteDeps {
  readonly repo: ArticleRepositoryPort;
  readonly audit: AuditLogPort;
}
interface AdminInput {
  readonly admin: AdminUser | null;
}
interface VersionedInput extends AdminInput {
  readonly id: string;
  readonly expectedRowVersion: number;
}

function fromOutcome(outcome: ArticleWriteOutcome, id: string): Result<Article, ArticleError> {
  switch (outcome.kind) {
    case "updated":
      return ok(outcome.article);
    case "not_found":
      return err(new ArticleNotFoundError(id));
    case "stale":
      return err(new ArticleStaleWriteError());
  }
}

export class ListAdminArticles
  implements UseCase<AdminInput, Result<readonly Article[], ArticleError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput): Promise<Result<readonly Article[], ArticleError>> {
    const auth = authorizeArticle(input.admin, "content.read");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.listAdmin());
  }
}

export class GetAdminArticle
  implements UseCase<AdminInput & { id: string }, Result<AdminArticleAggregate, ArticleError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(
    input: AdminInput & { id: string },
  ): Promise<Result<AdminArticleAggregate, ArticleError>> {
    const auth = authorizeArticle(input.admin, "content.read");
    if (isErr(auth)) return auth;
    const found = await this.deps.repo.findAdminById(input.id);
    return found ? ok(found) : err(new ArticleNotFoundError(input.id));
  }
}

export class CreateArticle
  implements UseCase<AdminInput & { data: unknown }, Result<Article, ArticleError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { data: unknown }): Promise<Result<Article, ArticleError>> {
    const auth = authorizeArticle(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = articleCreateSchema.safeParse(input.data);
    if (!parsed.success) {
      return err(new ArticleValidationError(parsed.error.issues.map((i) => i.message)));
    }
    if (await this.deps.repo.findBySlug(parsed.data.slug)) {
      return err(new ArticleSlugConflictError(parsed.data.slug));
    }
    const created = await this.deps.repo.create(parsed.data);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "article.create",
      entityType: "article",
      entityId: created.id,
      metadata: { slug: created.slug, status: created.status },
    });
    return ok(created);
  }
}

export class UpdateArticle
  implements UseCase<VersionedInput & { patch: unknown }, Result<Article, ArticleError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: VersionedInput & { patch: unknown },
  ): Promise<Result<Article, ArticleError>> {
    const auth = authorizeArticle(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = articleUpdateSchema.safeParse(input.patch);
    if (!parsed.success) {
      return err(new ArticleValidationError(parsed.error.issues.map((i) => i.message)));
    }
    if (parsed.data.slug !== undefined) {
      const clash = await this.deps.repo.findBySlug(parsed.data.slug);
      if (clash && clash.id !== input.id) return err(new ArticleSlugConflictError(parsed.data.slug));
    }
    const outcome = await this.deps.repo.update(input.id, input.expectedRowVersion, parsed.data);
    const result = fromOutcome(outcome, input.id);
    if (isErr(result)) return result;
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "article.update",
      entityType: "article",
      entityId: input.id,
      metadata: { fields: Object.keys(parsed.data) },
    });
    return result;
  }
}

async function transition(
  deps: WriteDeps,
  input: VersionedInput,
  permission: "content.publish" | "content.write",
  action: string,
  compute: (
    current: AdminArticleAggregate,
  ) => Result<{ status: Article["status"]; publishedAt: Date | null }, ArticleError>,
): Promise<Result<Article, ArticleError>> {
  const auth = authorizeArticle(input.admin, permission);
  if (isErr(auth)) return auth;
  const current = await deps.repo.findAdminById(input.id);
  if (!current) return err(new ArticleNotFoundError(input.id));
  if (current.article.rowVersion !== input.expectedRowVersion) {
    return err(new ArticleStaleWriteError());
  }
  const change = compute(current);
  if (isErr(change)) return change;
  const outcome = await deps.repo.setStatus(input.id, input.expectedRowVersion, change.value);
  const result = fromOutcome(outcome, input.id);
  if (isErr(result)) return result;
  await deps.audit.record({
    actorUserId: auth.value.id,
    action,
    entityType: "article",
    entityId: input.id,
    metadata: { status: change.value.status },
  });
  return result;
}

export class PublishArticle implements UseCase<VersionedInput, Result<Article, ArticleError>> {
  constructor(private readonly deps: WriteDeps) {}
  execute(input: VersionedInput): Promise<Result<Article, ArticleError>> {
    return transition(this.deps, input, "content.publish", "article.publish", (current) => {
      const can = assertCanPublish(current.article.status);
      if (isErr(can)) return can;
      return ok({ status: "published" as const, publishedAt: current.article.publishedAt ?? new Date() });
    });
  }
}

export class UnpublishArticle implements UseCase<VersionedInput, Result<Article, ArticleError>> {
  constructor(private readonly deps: WriteDeps) {}
  execute(input: VersionedInput): Promise<Result<Article, ArticleError>> {
    return transition(this.deps, input, "content.publish", "article.unpublish", (current) => {
      const can = assertCanUnpublish(current.article.status);
      if (isErr(can)) return can;
      return ok({ status: "draft" as const, publishedAt: null });
    });
  }
}

export class ArchiveArticle implements UseCase<VersionedInput, Result<Article, ArticleError>> {
  constructor(private readonly deps: WriteDeps) {}
  execute(input: VersionedInput): Promise<Result<Article, ArticleError>> {
    return transition(this.deps, input, "content.write", "article.archive", (current) => {
      const can = assertCanArchive(current.article.status);
      if (isErr(can)) return can;
      return ok({ status: "archived" as const, publishedAt: null });
    });
  }
}
