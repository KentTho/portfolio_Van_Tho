import "server-only";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import { writeAuditLog } from "@/infrastructure/logging/audit-writer";
import { DrizzleProfileRepository } from "@/modules/profile/infrastructure/drizzle-profile-repository";
import {
  GetProfile,
  UpdateProfile,
} from "@/modules/profile/application/use-cases/profile-use-cases";

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

/** Composition root for the singleton owner profile. */
export function getProfileAdminUseCases() {
  const repo = new DrizzleProfileRepository();
  return {
    get: new GetProfile({ repo }),
    update: new UpdateProfile({ repo, audit }),
  };
}
