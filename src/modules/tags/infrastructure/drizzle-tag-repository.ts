import "server-only";
import { and, asc, eq, isNull } from "drizzle-orm";
import type { Tag } from "@/modules/tags/domain/tag";
import type { TagRepositoryPort } from "@/modules/tags/application/ports/tag-repository-port";
import type { TagCreateInput, TagUpdateInput } from "@/modules/tags/application/tag-schema";
import { getDb } from "@/infrastructure/database/client";
import { tags, type TagRow } from "@/infrastructure/database/schema";

function toDomain(row: TagRow): Tag {
  return { id: row.id, slug: row.slug, name: row.name, sortOrder: row.sortOrder };
}

function definedOnly<T extends object>(patch: T): Partial<T> {
  return Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)) as Partial<T>;
}

/** Neon-backed tag repository. Single-table writes; reads exclude soft-deleted rows. */
export class DrizzleTagRepository implements TagRepositoryPort {
  async listAll(): Promise<readonly Tag[]> {
    const rows = await getDb()
      .select()
      .from(tags)
      .where(isNull(tags.deletedAt))
      .orderBy(asc(tags.sortOrder), asc(tags.name));
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Tag | null> {
    const rows = await getDb()
      .select()
      .from(tags)
      .where(and(eq(tags.id, id), isNull(tags.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    const rows = await getDb()
      .select()
      .from(tags)
      .where(and(eq(tags.slug, slug), isNull(tags.deletedAt)))
      .limit(1);
    const row = rows[0];
    return row ? toDomain(row) : null;
  }

  async create(input: TagCreateInput): Promise<Tag> {
    const rows = await getDb().insert(tags).values(input).returning();
    const row = rows[0];
    if (!row) throw new Error("tag insert returned no row");
    return toDomain(row);
  }

  async update(id: string, patch: TagUpdateInput): Promise<Tag | null> {
    const rows = await getDb()
      .update(tags)
      .set({ ...definedOnly(patch), updatedAt: new Date() })
      .where(and(eq(tags.id, id), isNull(tags.deletedAt)))
      .returning();
    const row = rows[0];
    return row ? toDomain(row) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const now = new Date();
    const rows = await getDb()
      .update(tags)
      .set({ deletedAt: now, updatedAt: now })
      .where(and(eq(tags.id, id), isNull(tags.deletedAt)))
      .returning({ id: tags.id });
    return rows.length > 0;
  }
}
