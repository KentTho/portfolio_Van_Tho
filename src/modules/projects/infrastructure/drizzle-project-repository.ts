import "server-only";
import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import type {
  AdminProjectAggregate,
  Project,
  ProjectSection,
} from "@/modules/projects/domain/project";
import type { Locale } from "@/shared/domain/locale";
import type {
  ProjectRepositoryPort,
  StatusChange,
  WriteOutcome,
} from "@/modules/projects/application/ports/project-repository-port";
import type {
  ProjectCreateInput,
  ProjectUpdateInput,
} from "@/modules/projects/application/project-schema";
import { getDb } from "@/infrastructure/database/client";
import {
  projectLinks,
  projectMedia,
  projectMetrics,
  projectSections,
  projectSectionTranslations,
  projectTechnologies,
  projectTranslations,
  projects,
  type ProjectRow,
} from "@/infrastructure/database/schema";

type Db = ReturnType<typeof getDb>;
// drizzle's batch() is typed for fixed-length tuples; our query list is assembled
// dynamically yet every element is a valid pg batch item. Cast narrowly to the
// method's own parameter type — no `any`, no external-input assertion.
type BatchArg = Parameters<Db["batch"]>[0];

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    visibility: row.visibility,
    category: row.category,
    featured: row.featured,
    featuredOrder: row.featuredOrder,
    role: row.role,
    publishedAt: row.publishedAt,
    rowVersion: row.rowVersion,
  };
}

/** Only the scalar project columns that were actually provided in the patch. */
function scalarPatch(patch: ProjectUpdateInput) {
  const out: Partial<Pick<ProjectRow, "slug" | "category" | "visibility" | "featured" | "featuredOrder" | "role">> = {};
  if (patch.slug !== undefined) out.slug = patch.slug;
  if (patch.category !== undefined) out.category = patch.category;
  if (patch.visibility !== undefined) out.visibility = patch.visibility;
  if (patch.featured !== undefined) out.featured = patch.featured;
  if (patch.featuredOrder !== undefined) out.featuredOrder = patch.featuredOrder;
  if (patch.role !== undefined) out.role = patch.role;
  return out;
}

/**
 * Neon-backed admin project repository (Group 2b). Multi-table writes are atomic via the
 * Neon HTTP batched transaction (db.batch → client.transaction). Child ids are generated
 * up front so dependent inserts need no interactive transaction. Optimistic concurrency
 * is enforced with row_version; a stale expected version is reported, not silently applied.
 */
export class DrizzleProjectRepository implements ProjectRepositoryPort {
  constructor(private readonly newId: () => string = () => crypto.randomUUID()) {}

  async findBySlug(slug: string): Promise<{ id: string } | null> {
    const rows = await getDb()
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.slug, slug), isNull(projects.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? { id: row.id } : null;
  }

  async listAdmin(): Promise<readonly Project[]> {
    const rows = await getDb()
      .select()
      .from(projects)
      .where(isNull(projects.deletedAt))
      .orderBy(desc(projects.updatedAt));
    return rows.map(toProject);
  }

  private async loadProject(id: string): Promise<Project | null> {
    const rows = await getDb()
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? toProject(row) : null;
  }

  async findAdminById(id: string): Promise<AdminProjectAggregate | null> {
    const db = getDb();
    const project = await this.loadProject(id);
    if (!project) return null;

    const [translations, technologies, links, metrics, media, sections] = await Promise.all([
      db.select().from(projectTranslations).where(eq(projectTranslations.projectId, id)),
      db
        .select()
        .from(projectTechnologies)
        .where(eq(projectTechnologies.projectId, id))
        .orderBy(asc(projectTechnologies.sortOrder)),
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
        .select()
        .from(projectMedia)
        .where(eq(projectMedia.projectId, id))
        .orderBy(asc(projectMedia.sortOrder)),
      db
        .select()
        .from(projectSections)
        .where(eq(projectSections.projectId, id))
        .orderBy(asc(projectSections.sortOrder)),
    ]);

    const sectionIds = sections.map((s) => s.id);
    const sectionTranslations = sectionIds.length
      ? await db
          .select()
          .from(projectSectionTranslations)
          .where(inArray(projectSectionTranslations.sectionId, sectionIds))
      : [];

    const assembledSections: ProjectSection[] = sections.map((s) => ({
      kind: s.kind,
      sortOrder: s.sortOrder,
      isVisible: s.isVisible,
      translations: sectionTranslations
        .filter((t) => t.sectionId === s.id)
        .map((t) => ({ locale: t.locale as Locale, heading: t.heading, bodyMd: t.bodyMd })),
    }));

    return {
      project,
      translations: translations.map((t) => ({
        locale: t.locale as Locale,
        title: t.title,
        tagline: t.tagline,
        summary: t.summary,
      })),
      technologies: technologies.map((t) => ({
        technologyId: t.technologyId,
        sortOrder: t.sortOrder,
      })),
      links: links.map((l) => ({
        linkType: l.linkType,
        url: l.url,
        label: l.label,
        sortOrder: l.sortOrder,
      })),
      metrics: metrics.map((m) => ({
        label: m.label,
        value: m.value,
        unit: m.unit,
        evidenceUrl: m.evidenceUrl,
        sortOrder: m.sortOrder,
      })),
      media: media.map((m) => ({
        mediaId: m.mediaId,
        role: m.role,
        caption: m.caption,
        sortOrder: m.sortOrder,
      })),
      sections: assembledSections,
    };
  }

  async create(input: ProjectCreateInput): Promise<Project> {
    const db = getDb();
    const projectId = this.newId();

    const queries: unknown[] = [
      db.insert(projects).values({
        id: projectId,
        slug: input.slug,
        status: "draft",
        visibility: input.visibility,
        category: input.category,
        featured: input.featured,
        featuredOrder: input.featuredOrder,
        role: input.role,
      }),
      ...this.childInserts(db, projectId, input),
    ];

    await db.batch(queries as unknown as BatchArg);

    return {
      id: projectId,
      slug: input.slug,
      status: "draft",
      visibility: input.visibility,
      category: input.category,
      featured: input.featured,
      featuredOrder: input.featuredOrder,
      role: input.role,
      publishedAt: null,
      rowVersion: 1,
    };
  }

  /** Insert statements for every provided child collection of a project. */
  private childInserts(db: Db, projectId: string, input: ProjectCreateInput | ProjectUpdateInput) {
    const q: unknown[] = [];
    for (const t of input.translations ?? []) {
      q.push(db.insert(projectTranslations).values({ projectId, ...t }));
    }
    for (const t of input.technologies ?? []) {
      q.push(db.insert(projectTechnologies).values({ projectId, ...t }));
    }
    for (const l of input.links ?? []) {
      q.push(db.insert(projectLinks).values({ projectId, ...l }));
    }
    for (const m of input.metrics ?? []) {
      q.push(db.insert(projectMetrics).values({ projectId, ...m }));
    }
    for (const m of input.media ?? []) {
      q.push(db.insert(projectMedia).values({ projectId, ...m }));
    }
    for (const s of input.sections ?? []) {
      const sectionId = this.newId();
      q.push(
        db.insert(projectSections).values({
          id: sectionId,
          projectId,
          kind: s.kind,
          sortOrder: s.sortOrder,
          isVisible: s.isVisible,
        }),
      );
      for (const st of s.translations) {
        q.push(
          db.insert(projectSectionTranslations).values({
            sectionId,
            locale: st.locale,
            heading: st.heading,
            bodyMd: st.bodyMd,
          }),
        );
      }
    }
    return q;
  }

  async update(
    id: string,
    expectedRowVersion: number,
    patch: ProjectUpdateInput,
  ): Promise<WriteOutcome> {
    const db = getDb();
    const existing = await db
      .select({ v: projects.rowVersion })
      .from(projects)
      .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
      .limit(1);
    const cur = existing[0];
    if (!cur) return { kind: "not_found" };
    if (cur.v !== expectedRowVersion) return { kind: "stale" };

    const queries: unknown[] = [
      db
        .update(projects)
        .set({ ...scalarPatch(patch), rowVersion: expectedRowVersion + 1, updatedAt: new Date() })
        .where(and(eq(projects.id, id), eq(projects.rowVersion, expectedRowVersion))),
    ];

    // Full-replace semantics for each provided collection (delete existing → insert new).
    if (patch.translations !== undefined) {
      queries.push(db.delete(projectTranslations).where(eq(projectTranslations.projectId, id)));
    }
    if (patch.technologies !== undefined) {
      queries.push(db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, id)));
    }
    if (patch.links !== undefined) {
      queries.push(db.delete(projectLinks).where(eq(projectLinks.projectId, id)));
    }
    if (patch.metrics !== undefined) {
      queries.push(db.delete(projectMetrics).where(eq(projectMetrics.projectId, id)));
    }
    if (patch.media !== undefined) {
      queries.push(db.delete(projectMedia).where(eq(projectMedia.projectId, id)));
    }
    if (patch.sections !== undefined) {
      // FK cascade removes section translations when the parent section is deleted.
      queries.push(db.delete(projectSections).where(eq(projectSections.projectId, id)));
    }
    queries.push(...this.childInserts(db, id, patch));

    await db.batch(queries as unknown as BatchArg);

    const project = await this.loadProject(id);
    return project ? { kind: "updated", project } : { kind: "not_found" };
  }

  async setStatus(
    id: string,
    expectedRowVersion: number,
    change: StatusChange,
  ): Promise<WriteOutcome> {
    const db = getDb();
    const existing = await db
      .select({ v: projects.rowVersion })
      .from(projects)
      .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
      .limit(1);
    const cur = existing[0];
    if (!cur) return { kind: "not_found" };
    if (cur.v !== expectedRowVersion) return { kind: "stale" };

    await db
      .update(projects)
      .set({
        status: change.status,
        publishedAt: change.publishedAt,
        rowVersion: expectedRowVersion + 1,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.rowVersion, expectedRowVersion)));

    const project = await this.loadProject(id);
    return project ? { kind: "updated", project } : { kind: "not_found" };
  }
}
