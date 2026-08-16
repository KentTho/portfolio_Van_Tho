import "server-only";
import { asc, eq } from "drizzle-orm";
import type { SiteSetting } from "@/modules/site-settings/domain/site-setting";
import type { SiteSettingRepositoryPort } from "@/modules/site-settings/application/ports/site-setting-repository-port";
import type { SettingUpsertInput } from "@/modules/site-settings/application/site-setting-schema";
import { getDb } from "@/infrastructure/database/client";
import { siteSettings, type SiteSettingRow } from "@/infrastructure/database/schema";

function toSetting(r: SiteSettingRow): SiteSetting {
  return { key: r.key, value: r.value, isPublic: r.isPublic };
}

/** Neon-backed site-settings repository (Group 4). Public reads never expose private keys. */
export class DrizzleSiteSettingRepository implements SiteSettingRepositoryPort {
  async listAdmin(): Promise<readonly SiteSetting[]> {
    const rows = await getDb().select().from(siteSettings).orderBy(asc(siteSettings.key));
    return rows.map(toSetting);
  }

  async findByKey(key: string): Promise<SiteSetting | null> {
    const rows = await getDb()
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    const row = rows[0];
    return row ? toSetting(row) : null;
  }

  async upsert(input: SettingUpsertInput, updatedBy: string): Promise<SiteSetting> {
    await getDb()
      .insert(siteSettings)
      .values({ key: input.key, value: input.value, isPublic: input.isPublic, updatedBy })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: input.value, isPublic: input.isPublic, updatedBy, updatedAt: new Date() },
      });
    return { key: input.key, value: input.value, isPublic: input.isPublic };
  }

  async remove(key: string): Promise<boolean> {
    const found = await this.findByKey(key);
    if (!found) return false;
    await getDb().delete(siteSettings).where(eq(siteSettings.key, key));
    return true;
  }

  async getPublic(key: string): Promise<unknown | null> {
    const rows = await getDb()
      .select({ value: siteSettings.value, isPublic: siteSettings.isPublic })
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    const row = rows[0];
    return row && row.isPublic ? row.value : null;
  }
}
