import "server-only";
import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { DEFAULT_LOCALE, type Locale } from "@/shared/domain/locale";
import type {
  PortfolioRepositoryPort,
  PublicProjectDetail,
  PublicProjectSection,
  PublicProjectSummary,
} from "@/modules/projects/application/ports/portfolio-repository-port";
import { getDb } from "@/infrastructure/database/client";
import {
  projectLinks,
  projectMetrics,
  projectSections,
  projectSectionTranslations,
  projectTechnologies,
  projectTranslations,
  projects,
  technologies,
} from "@/infrastructure/database/schema";

/** Choose the row matching `locale`, else the default locale, else the first available. */
function pickByLocale<T extends { locale: string }>(rows: readonly T[], locale: Locale): T | null {
  return (
    rows.find((r) => r.locale === locale) ??
    rows.find((r) => r.locale === DEFAULT_LOCALE) ??
    rows[0] ??
    null
  );
}

/**
 * Public read model over Neon. Every query is constrained to published + public +
 * non-deleted rows; nothing here can surface a draft, archived, private, or deleted
 * project, and there is no SAMPLE fallback (prompt §F/§P, CLAUDE.md §11).
 */
export class DrizzlePortfolioRepository implements PortfolioRepositoryPort {
  async listPublishedProjects(locale: Locale): Promise<readonly PublicProjectSummary[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.status, "published"),
          eq(projects.visibility, "public"),
          isNull(projects.deletedAt),
        ),
      )
      .orderBy(desc(projects.featured), asc(projects.featuredOrder), desc(projects.publishedAt));

    if (rows.length === 0) return [];

    const ids = rows.map((r) => r.id);
    const translations = await db
      .select()
      .from(projectTranslations)
      .where(inArray(projectTranslations.projectId, ids));

    return rows.map((r) => {
      const tr = pickByLocale(
        translations.filter((t) => t.projectId === r.id),
        locale,
      );
      return {
        slug: r.slug,
        title: tr?.title ?? r.slug,
        tagline: tr?.tagline ?? null,
        summary: tr?.summary ?? null,
        category: r.category,
        featured: r.featured,
        publishedAt: r.publishedAt,
      };
    });
  }

  async getPublishedProject(slug: string, locale: Locale): Promise<PublicProjectDetail | null> {
    const db = getDb();
    const found = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.slug, slug),
          eq(projects.status, "published"),
          eq(projects.visibility, "public"),
          isNull(projects.deletedAt),
        ),
      )
      .limit(1);
    const project = found[0];
    if (!project) return null;
    const id = project.id;

    const [translations, links, metrics, techRows, sectionRows] = await Promise.all([
      db.select().from(projectTranslations).where(eq(projectTranslations.projectId, id)),
      db
        .select()
        .from(projectLinks)
        .where(eq(projectLinks.projectId, id))
        .orderBy(asc(projectLinks.sortOrder)),
      db
        .select()
        .from(projectMetrics)
        .where(eq(projectMetrics.projectId, id))
        .orderBy(asc(projectMetrics.sortOrder)),
      db
        .select({
          slug: technologies.slug,
          name: technologies.name,
          sortOrder: projectTechnologies.sortOrder,
        })
        .from(projectTechnologies)
        .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
        .where(and(eq(projectTechnologies.projectId, id), isNull(technologies.deletedAt)))
        .orderBy(asc(projectTechnologies.sortOrder)),
      db
        .select()
        .from(projectSections)
        .where(and(eq(projectSections.projectId, id), eq(projectSections.isVisible, true)))
        .orderBy(asc(projectSections.sortOrder)),
    ]);

    const sectionIds = sectionRows.map((s) => s.id);
    const sectionTranslations = sectionIds.length
      ? await db
          .select()
          .from(projectSectionTranslations)
          .where(inArray(projectSectionTranslations.sectionId, sectionIds))
      : [];

    const sections: PublicProjectSection[] = sectionRows.map((s) => {
      const tr = pickByLocale(
        sectionTranslations.filter((t) => t.sectionId === s.id),
        locale,
      );
      return { kind: s.kind, heading: tr?.heading ?? null, bodyMd: tr?.bodyMd ?? "" };
    });

    const tr = pickByLocale(translations, locale);
    return {
      slug: project.slug,
      title: tr?.title ?? project.slug,
      tagline: tr?.tagline ?? null,
      summary: tr?.summary ?? null,
      category: project.category,
      featured: project.featured,
      publishedAt: project.publishedAt,
      links: links.map((l) => ({ linkType: l.linkType, url: l.url, label: l.label })),
      metrics: metrics.map((m) => ({
        label: m.label,
        value: m.value,
        unit: m.unit,
        evidenceUrl: m.evidenceUrl,
      })),
      sections,
      technologies: techRows.map((t) => ({ slug: t.slug, name: t.name })),
    };
  }
}
