import "server-only";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import { writeAuditLog } from "@/infrastructure/logging/audit-writer";
import { DrizzleTechnologyRepository } from "@/modules/technologies/infrastructure/drizzle-technology-repository";
import {
  ArchiveTechnology,
  CreateTechnology,
  GetTechnology,
  ListTechnologies,
  SetTechnologyVisibility,
  UpdateTechnology,
} from "@/modules/technologies/application/use-cases/technology-use-cases";

/**
 * Composition root for the technologies module: binds the Neon repository and audit
 * writer to the admin use-cases. Presentation imports these factories, never the
 * concrete repository (CLAUDE.md §4).
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

export function getTechnologyUseCases() {
  const repo = new DrizzleTechnologyRepository();
  return {
    list: new ListTechnologies({ repo }),
    get: new GetTechnology({ repo }),
    create: new CreateTechnology({ repo, audit }),
    update: new UpdateTechnology({ repo, audit }),
    archive: new ArchiveTechnology({ repo, audit }),
    setVisibility: new SetTechnologyVisibility({ repo, audit }),
  };
}
