import type { SiteSetting } from "@/modules/site-settings/domain/site-setting";
import type { SettingUpsertInput } from "@/modules/site-settings/application/site-setting-schema";

/**
 * Site-settings repository. Admin reads see all settings; `getPublic` returns a value ONLY
 * when the setting is flagged public (private settings never leak to the public site).
 */
export interface SiteSettingRepositoryPort {
  listAdmin(): Promise<readonly SiteSetting[]>;
  findByKey(key: string): Promise<SiteSetting | null>;
  upsert(input: SettingUpsertInput, updatedBy: string): Promise<SiteSetting>;
  remove(key: string): Promise<boolean>;
  getPublic(key: string): Promise<unknown | null>;
}
