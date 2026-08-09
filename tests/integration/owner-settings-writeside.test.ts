// @vitest-environment node
import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/client";
import { siteSettings, skills } from "@/infrastructure/database/schema";
import { DrizzleProfileRepository } from "@/modules/profile/infrastructure/drizzle-profile-repository";
import { DrizzleSkillRepository } from "@/modules/skills/infrastructure/drizzle-skill-repository";
import { DrizzleSiteSettingRepository } from "@/modules/site-settings/infrastructure/drizzle-site-setting-repository";

/**
 * Live integration smoke against Neon DEVELOPMENT. Gated by RUN_DB_SMOKE=1. Profile is a
 * singleton, so its original value is snapshotted and RESTORED — the smoke never corrupts
 * real owner data. Skills + settings use disposable fixtures that are removed afterwards.
 */
const RUN = process.env.RUN_DB_SMOKE === "1";

const SKILL_SLUG = "smoke-skill-g4";
const SETTING_KEY = "smoke.setting.g4";

describe("owner settings write-side on Neon Development", () => {
  it("is gated behind RUN_DB_SMOKE (offline suite skips the live smoke)", () => {
    expect(typeof RUN).toBe("boolean");
  });

  it.runIf(RUN)(
    "profile upsert (snapshot/restore) + skill visibility gate + setting public/private gate",
    async () => {
      const db = getDb();
      const profileRepo = new DrizzleProfileRepository();
      const skillRepo = new DrizzleSkillRepository();
      const settingRepo = new DrizzleSiteSettingRepository();

      const cleanFixtures = async () => {
        await db.delete(skills).where(eq(skills.slug, SKILL_SLUG));
        await db.delete(siteSettings).where(eq(siteSettings.key, SETTING_KEY));
      };

      // --- profile: snapshot, mutate, assert, restore ---
      const original = await profileRepo.get();
      try {
        const updated = await profileRepo.update({ professionalTitle: "SMOKE-TITLE" });
        expect(updated.professionalTitle).toBe("SMOKE-TITLE");
        const reread = await profileRepo.get();
        expect(reread.professionalTitle).toBe("SMOKE-TITLE");
      } finally {
        await profileRepo.update({
          fullName: original.fullName,
          professionalTitle: original.professionalTitle,
          location: original.location,
          publicEmail: original.publicEmail,
          availabilityStatus: original.availabilityStatus,
          defaultLocale: original.defaultLocale,
        });
      }
      const restored = await profileRepo.get();
      expect(restored.professionalTitle).toBe(original.professionalTitle);

      // --- skills + settings ---
      await cleanFixtures();
      try {
        // hidden skill → not public
        const skill = await skillRepo.create({
          slug: SKILL_SLUG,
          name: "SmokeSkill",
          category: "general",
          proficiencyLabel: null,
          evidenceText: null,
          displayOrder: 0,
          isVisible: false,
        });
        expect((await skillRepo.listPublic()).some((s) => s.slug === SKILL_SLUG)).toBe(false);

        // make visible → public
        const shown = await skillRepo.update(skill.id, { isVisible: true });
        expect(shown?.isVisible).toBe(true);
        expect((await skillRepo.listPublic()).some((s) => s.slug === SKILL_SLUG)).toBe(true);

        // delete → gone
        expect(await skillRepo.remove(skill.id)).toBe(true);
        expect(await skillRepo.findById(skill.id)).toBeNull();

        // private setting → getPublic returns null (updatedBy is a real uuid column)
        const actorId = crypto.randomUUID();
        await settingRepo.upsert({ key: SETTING_KEY, value: { a: 1 }, isPublic: false }, actorId);
        expect(await settingRepo.getPublic(SETTING_KEY)).toBeNull();

        // flip to public → getPublic returns the value
        await settingRepo.upsert({ key: SETTING_KEY, value: { a: 2 }, isPublic: true }, actorId);
        expect(await settingRepo.getPublic(SETTING_KEY)).toEqual({ a: 2 });

        // delete → gone
        expect(await settingRepo.remove(SETTING_KEY)).toBe(true);
        expect(await settingRepo.findByKey(SETTING_KEY)).toBeNull();
      } finally {
        await cleanFixtures();
      }

      const leftSkill = await db.select({ id: skills.id }).from(skills).where(eq(skills.slug, SKILL_SLUG));
      const leftSetting = await db
        .select({ key: siteSettings.key })
        .from(siteSettings)
        .where(eq(siteSettings.key, SETTING_KEY));
      expect(leftSkill).toHaveLength(0);
      expect(leftSetting).toHaveLength(0);
    },
    60_000,
  );
});
