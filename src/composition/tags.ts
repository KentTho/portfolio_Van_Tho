import "server-only";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import { writeAuditLog } from "@/infrastructure/logging/audit-writer";
import { DrizzleTagRepository } from "@/modules/tags/infrastructure/drizzle-tag-repository";
import {
  ArchiveTag,
  CreateTag,
  GetTag,
  ListTags,
  UpdateTag,
} from "@/modules/tags/application/use-cases/tag-use-cases";

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

/** Composition root for the tags module (admin write-side). */
export function getTagUseCases() {
  const repo = new DrizzleTagRepository();
  return {
    list: new ListTags({ repo }),
    get: new GetTag({ repo }),
    create: new CreateTag({ repo, audit }),
    update: new UpdateTag({ repo, audit }),
    archive: new ArchiveTag({ repo, audit }),
  };
}
