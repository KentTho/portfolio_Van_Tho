import "server-only";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import { writeAuditLog } from "@/infrastructure/logging/audit-writer";
import { DrizzleSkillRepository } from "@/modules/skills/infrastructure/drizzle-skill-repository";
import {
  CreateSkill,
  DeleteSkill,
  GetSkill,
  ListSkills,
  UpdateSkill,
} from "@/modules/skills/application/use-cases/skill-use-cases";

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

/** Composition root for the skills catalog. */
export function getSkillAdminUseCases() {
  const repo = new DrizzleSkillRepository();
  return {
    list: new ListSkills({ repo }),
    get: new GetSkill({ repo }),
    create: new CreateSkill({ repo, audit }),
    update: new UpdateSkill({ repo, audit }),
    remove: new DeleteSkill({ repo, audit }),
  };
}
