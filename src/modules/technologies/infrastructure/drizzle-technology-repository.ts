import "server-only";
import { and, asc, eq, isNull } from "drizzle-orm";
import type { Technology } from "@/modules/technologies/domain/technology";
import type { TechnologyRepositoryPort } from "@/modules/technologies/application/ports/technology-repository-port";
import type {
  TechnologyCreateInput,
  TechnologyUpdateInput,
} from "@/modules/technologies/application/technology-schema";
import { getDb } from "@/infrastructure/database/client";
import { technologies, type TechnologyRow } from "@/infrastructure/database/schema";

function toDomain(row: TechnologyRow): Technology {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    deviconKey: row.deviconKey,
    brandColor: row.brandColor,
    website: row.website,
    sortOrder: row.sortOrder,
    isVisible: row.isVisible,
  };
}

/** Drops keys whose value is `undefined` so a partial patch never clobbers columns. */
function definedOnly<T extends object>(patch: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

/**
 * Neon-backed technology repository (Group 1B). All writes are single-table, so the
 * neon-http driver's lack of interactive transactions is not a constraint here.
 * Reads never return soft-deleted rows; ordering is deterministic (category, sortOrder).
 */
export class DrizzleTechnologyRepository implements TechnologyRepositoryPort {
  async listVisible(): Promise<readonly Technology[]> {
    const rows = await getDb()
      .select()
      .from(technologies)
      .where(and(isNull(technologies.deletedAt), eq(technologies.isVisible, true)))
      .orderBy(asc(technologies.category), asc(technologies.sortOrder));
    return rows.map(toDomain);
  }

  async listAll(): Promise<readonly Technology[]> {
    const rows = await getDb()
      .select()
      .from(technologies)
      .where(isNull(technologies.deletedAt))
      .orderBy(asc(technologies.category), asc(technologies.sortOrder));
    return rows.map(toDomain);
  }

  async findBySlug(slug: string): Promise<Technology | null> {
    const rows = await getDb()
      .select()
      .from(technologies)
      .where(and(eq(technologies.slug, slug), isNull(technologies.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? toDomain(row) : null;
  }

  async findById(id: string): Promise<Technology | null> {
    const rows = await getDb()
      .select()
      .from(technologies)
      .where(and(eq(technologies.id, id), isNull(technologies.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? toDomain(row) : null;
  }

  async create(input: TechnologyCreateInput): Promise<Technology> {
    const rows = await getDb().insert(technologies).values(input).returning();
    const row = rows[0];
    if (!row) throw new Error("technology insert returned no row");
    return toDomain(row);
  }

  async update(id: string, patch: TechnologyUpdateInput): Promise<Technology | null> {
    const rows = await getDb()
      .update(technologies)
      .set({ ...definedOnly(patch), updatedAt: new Date() })
      .where(and(eq(technologies.id, id), isNull(technologies.deletedAt)))
      .returning();
    const row = rows[0];
    return row ? toDomain(row) : null;
  }

  async setVisibility(id: string, isVisible: boolean): Promise<Technology | null> {
    const rows = await getDb()
      .update(technologies)
      .set({ isVisible, updatedAt: new Date() })
      .where(and(eq(technologies.id, id), isNull(technologies.deletedAt)))
      .returning();
    const row = rows[0];
    return row ? toDomain(row) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const now = new Date();
    const rows = await getDb()
      .update(technologies)
      .set({ deletedAt: now, updatedAt: now })
      .where(and(eq(technologies.id, id), isNull(technologies.deletedAt)))
      .returning({ id: technologies.id });
    return rows.length > 0;
  }
}
