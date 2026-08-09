import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { SiteSetting } from "@/modules/site-settings/domain/site-setting";
import {
  SettingNotFoundError,
  SettingValidationError,
  type SettingError,
} from "@/modules/site-settings/domain/site-setting-errors";
import { settingUpsertSchema } from "@/modules/site-settings/application/site-setting-schema";
import { authorizeSetting } from "@/modules/site-settings/application/site-setting-authorization";
import type { SiteSettingRepositoryPort } from "@/modules/site-settings/application/ports/site-setting-repository-port";

export interface ReadDeps {
  readonly repo: SiteSettingRepositoryPort;
}
export interface WriteDeps {
  readonly repo: SiteSettingRepositoryPort;
  readonly audit: AuditLogPort;
}
interface AdminInput {
  readonly admin: AdminUser | null;
}

export class ListSettings
  implements UseCase<AdminInput, Result<readonly SiteSetting[], SettingError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput): Promise<Result<readonly SiteSetting[], SettingError>> {
    const auth = authorizeSetting(input.admin, "settings.write");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.listAdmin());
  }
}

export class GetSetting
  implements UseCase<AdminInput & { key: string }, Result<SiteSetting, SettingError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput & { key: string }): Promise<Result<SiteSetting, SettingError>> {
    const auth = authorizeSetting(input.admin, "settings.write");
    if (isErr(auth)) return auth;
    const found = await this.deps.repo.findByKey(input.key);
    return found ? ok(found) : err(new SettingNotFoundError(input.key));
  }
}

export class UpsertSetting
  implements UseCase<AdminInput & { data: unknown }, Result<SiteSetting, SettingError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { data: unknown }): Promise<Result<SiteSetting, SettingError>> {
    const auth = authorizeSetting(input.admin, "settings.write");
    if (isErr(auth)) return auth;
    const parsed = settingUpsertSchema.safeParse(input.data);
    if (!parsed.success) {
      return err(new SettingValidationError(parsed.error.issues.map((i) => i.message)));
    }
    const saved = await this.deps.repo.upsert(parsed.data, auth.value.id);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "setting.upsert",
      entityType: "site_setting",
      entityId: saved.key,
      metadata: { isPublic: saved.isPublic },
    });
    return ok(saved);
  }
}

export class DeleteSetting
  implements UseCase<AdminInput & { key: string }, Result<true, SettingError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { key: string }): Promise<Result<true, SettingError>> {
    const auth = authorizeSetting(input.admin, "settings.write");
    if (isErr(auth)) return auth;
    const removed = await this.deps.repo.remove(input.key);
    if (!removed) return err(new SettingNotFoundError(input.key));
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "setting.delete",
      entityType: "site_setting",
      entityId: input.key,
      metadata: null,
    });
    return ok(true);
  }
}
