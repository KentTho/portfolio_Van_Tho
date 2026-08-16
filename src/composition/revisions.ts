import "server-only";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import { writeAuditLog } from "@/infrastructure/logging/audit-writer";
import { DrizzleRevisionRepository } from "@/modules/revisions/infrastructure/drizzle-revision-repository";
import {
  CreateRevision,
  GetRevision,
  ListRevisions,
  PreviewRestore,
} from "@/modules/revisions/application/use-cases/revision-use-cases";

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

/** Composition root for content revisions (immutable snapshots + restore preview). */
export function getRevisionUseCases() {
  const repo = new DrizzleRevisionRepository();
  return {
    create: new CreateRevision({ repo, audit }),
    list: new ListRevisions({ repo }),
    get: new GetRevision({ repo }),
    previewRestore: new PreviewRestore({ repo }),
  };
}
