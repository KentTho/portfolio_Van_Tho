import "server-only";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import { writeAuditLog } from "@/infrastructure/logging/audit-writer";
import type { PortfolioRepositoryPort } from "@/modules/projects/application/ports/portfolio-repository-port";
import { DrizzleProjectRepository } from "@/modules/projects/infrastructure/drizzle-project-repository";
import { DrizzlePortfolioRepository } from "@/modules/projects/infrastructure/drizzle-portfolio-repository";
import {
  ArchiveProject,
  CreateProject,
  GetAdminProject,
  ListAdminProjects,
  PublishProject,
  UnpublishProject,
  UpdateProject,
} from "@/modules/projects/application/use-cases/project-use-cases";

/**
 * Composition root for the projects module. Admin use-cases get the Neon write repo +
 * audit writer; the neutral public read model is exposed separately for the public site.
 */
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

export function getProjectAdminUseCases() {
  const repo = new DrizzleProjectRepository();
  return {
    list: new ListAdminProjects({ repo }),
    get: new GetAdminProject({ repo }),
    create: new CreateProject({ repo, audit }),
    update: new UpdateProject({ repo, audit }),
    publish: new PublishProject({ repo, audit }),
    unpublish: new UnpublishProject({ repo, audit }),
    archive: new ArchiveProject({ repo, audit }),
  };
}

/** Public, published-only read model — safe for the visitor-facing portfolio. */
export function getPortfolioRepository(): PortfolioRepositoryPort {
  return new DrizzlePortfolioRepository();
}
