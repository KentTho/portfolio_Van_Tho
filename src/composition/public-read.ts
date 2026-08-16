import "server-only";
import type { Locale } from "@/shared/domain/locale";
import { DrizzlePortfolioRepository } from "@/modules/projects/infrastructure/drizzle-portfolio-repository";
import { DrizzleCareerRepository } from "@/modules/career/infrastructure/drizzle-career-repository";
import { DrizzleSkillRepository } from "@/modules/skills/infrastructure/drizzle-skill-repository";
import { DrizzleSiteSettingRepository } from "@/modules/site-settings/infrastructure/drizzle-site-setting-repository";
import { DrizzleProfileRepository } from "@/modules/profile/infrastructure/drizzle-profile-repository";

/**
 * Public Neon read model for the visitor-facing site. This root exposes ONLY published /
 * visible / public / non-deleted projections across every content module — no admin write
 * method and no draft/private/archived/deleted row can be reached through it (each
 * underlying repository enforces the gate; verified by the module write-side smokes).
 * It is a thin consolidation, not a new abstraction: every method delegates to an
 * already-verified repository read.
 */
export function getPublicReadModel() {
  const portfolio = new DrizzlePortfolioRepository();
  const career = new DrizzleCareerRepository();
  const skills = new DrizzleSkillRepository();
  const settings = new DrizzleSiteSettingRepository();
  const profile = new DrizzleProfileRepository();

  return {
    // projects
    listPublishedProjects: (locale: Locale) => portfolio.listPublishedProjects(locale),
    getPublishedProject: (slug: string, locale: Locale) =>
      portfolio.getPublishedProject(slug, locale),
    // articles
    listPublishedArticles: (locale: Locale) => portfolio.listPublishedArticles(locale),
    getPublishedArticle: (slug: string, locale: Locale) =>
      portfolio.getPublishedArticle(slug, locale),
    // career
    listPublicExperiences: (locale: Locale) => career.listPublicExperiences(locale),
    listPublicEducation: () => career.listPublicEducation(),
    listPublicCertifications: () => career.listPublicCertifications(),
    // skills
    listPublicSkills: () => skills.listPublic(),
    // profile (public identity — no private fields on the row)
    getProfile: () => profile.get(),
    // settings (returns a value ONLY when the key is flagged public)
    getPublicSetting: (key: string) => settings.getPublic(key),
  };
}

export type PublicReadModel = ReturnType<typeof getPublicReadModel>;
