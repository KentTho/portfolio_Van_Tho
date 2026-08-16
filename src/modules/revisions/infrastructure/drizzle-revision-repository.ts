import "server-only";
import { and, desc, eq } from "drizzle-orm";
import type {
  ContentRevision,
  RevisionContentType,
  RevisionSummary,
} from "@/modules/revisions/domain/content-revision";
import type { RevisionRepositoryPort } from "@/modules/revisions/application/ports/revision-repository-port";
import type { CreateRevisionInput } from "@/modules/revisions/application/revision-schema";
import { getDb } from "@/infrastructure/database/client";
import { contentRevisions, type ContentRevisionRow } from "@/infrastructure/database/schema";

function toSummary(r: ContentRevisionRow): RevisionSummary {
  return {
    id: r.id,
    contentType: r.contentType as RevisionContentType,
    contentId: r.contentId,
    locale: r.locale,
    version: r.version,
    actorUserId: r.actorUserId,
    createdAt: r.createdAt,
  };
}

function toRevision(r: ContentRevisionRow): ContentRevision {
  return { ...toSummary(r), snapshot: r.snapshot };
}

/** Neon-backed append-only revision store (Group 5). No update/delete path by design. */
export class DrizzleRevisionRepository implements RevisionRepositoryPort {
  async create(input: CreateRevisionInput, actorUserId: string | null): Promise<ContentRevision> {
    const db = getDb();
    const latest = await db
      .select({ v: contentRevisions.version })
      .from(contentRevisions)
      .where(
        and(
          eq(contentRevisions.contentType, input.contentType),
          eq(contentRevisions.contentId, input.contentId),
        ),
      )
      .orderBy(desc(contentRevisions.version))
      .limit(1);
    const version = (latest[0]?.v ?? 0) + 1;

    const id = crypto.randomUUID();
    const rows = await db
      .insert(contentRevisions)
      .values({
        id,
        contentType: input.contentType,
        contentId: input.contentId,
        locale: input.locale,
        version,
        actorUserId,
        snapshot: input.snapshot,
      })
      .returning();
    const row = rows[0];
    if (!row) throw new Error("revision insert returned no row");
    return toRevision(row);
  }

  async listForEntity(
    contentType: RevisionContentType,
    contentId: string,
  ): Promise<readonly RevisionSummary[]> {
    const rows = await getDb()
      .select()
      .from(contentRevisions)
      .where(
        and(
          eq(contentRevisions.contentType, contentType),
          eq(contentRevisions.contentId, contentId),
        ),
      )
      .orderBy(desc(contentRevisions.version));
    return rows.map(toSummary);
  }

  async findById(id: string): Promise<ContentRevision | null> {
    const rows = await getDb()
      .select()
      .from(contentRevisions)
      .where(eq(contentRevisions.id, id))
      .limit(1);
    const row = rows[0];
    return row ? toRevision(row) : null;
  }
}
