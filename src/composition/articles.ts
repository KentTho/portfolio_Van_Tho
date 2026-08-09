import "server-only";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import { writeAuditLog } from "@/infrastructure/logging/audit-writer";
import { DrizzleArticleRepository } from "@/modules/articles/infrastructure/drizzle-article-repository";
import {
  ArchiveArticle,
  CreateArticle,
  GetAdminArticle,
  ListAdminArticles,
  PublishArticle,
  UnpublishArticle,
  UpdateArticle,
} from "@/modules/articles/application/use-cases/article-use-cases";

const audit: AuditLogPort = {
  record: (entry) =>
    writeAuditLog({
      actorUserId: entry.actorUserId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      metadata: entry.metadata ?? null,
    }),
};

/** Composition root for the articles module (admin write-side). Public reads use
 * getPortfolioRepository() from the projects composition (shared neutral read model). */
export function getArticleAdminUseCases() {
  const repo = new DrizzleArticleRepository();
  return {
    list: new ListAdminArticles({ repo }),
    get: new GetAdminArticle({ repo }),
    create: new CreateArticle({ repo, audit }),
    update: new UpdateArticle({ repo, audit }),
    publish: new PublishArticle({ repo, audit }),
    unpublish: new UnpublishArticle({ repo, audit }),
    archive: new ArchiveArticle({ repo, audit }),
  };
}
