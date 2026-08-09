import "server-only";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import { writeAuditLog } from "@/infrastructure/logging/audit-writer";
import { DrizzleSiteSettingRepository } from "@/modules/site-settings/infrastructure/drizzle-site-setting-repository";
import {
  DeleteSetting,
  GetSetting,
  ListSettings,
  UpsertSetting,
} from "@/modules/site-settings/application/use-cases/site-setting-use-cases";

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

/** Composition root for site settings (key/value config). */
export function getSiteSettingAdminUseCases() {
  const repo = new DrizzleSiteSettingRepository();
  return {
    list: new ListSettings({ repo }),
    get: new GetSetting({ repo }),
    upsert: new UpsertSetting({ repo, audit }),
    remove: new DeleteSetting({ repo, audit }),
  };
}
