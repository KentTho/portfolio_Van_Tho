import "server-only";
import { asc, eq } from "drizzle-orm";
import type { Skill } from "@/modules/skills/domain/skill";
import type { SkillRepositoryPort } from "@/modules/skills/application/ports/skill-repository-port";
import type { SkillCreateInput, SkillUpdateInput } from "@/modules/skills/application/skill-schema";
import { getDb } from "@/infrastructure/database/client";
import { skills, type SkillRow } from "@/infrastructure/database/schema";

function toSkill(r: SkillRow): Skill {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    proficiencyLabel: r.proficiencyLabel,
    evidenceText: r.evidenceText,
    displayOrder: r.displayOrder,
    isVisible: r.isVisible,
  };
}

function definedOnly<T extends Record<string, unknown>>(patch: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) out[k as keyof T] = v as T[keyof T];
  }
  return out;
}

/** Neon-backed skill catalog repository (Group 4). Flat CRUD; visible-only public reads. */
export class DrizzleSkillRepository implements SkillRepositoryPort {
  async listAdmin(): Promise<readonly Skill[]> {
    const rows = await getDb().select().from(skills).orderBy(asc(skills.displayOrder));
    return rows.map(toSkill);
  }

  async findById(id: string): Promise<Skill | null> {
    const rows = await getDb().select().from(skills).where(eq(skills.id, id)).limit(1);
    const row = rows[0];
    return row ? toSkill(row) : null;
  }

  async findBySlug(slug: string): Promise<{ id: string } | null> {
    const rows = await getDb().select({ id: skills.id }).from(skills).where(eq(skills.slug, slug)).limit(1);
    const row = rows[0];
    return row ? { id: row.id } : null;
  }

  async create(input: SkillCreateInput): Promise<Skill> {
    const id = crypto.randomUUID();
    await getDb().insert(skills).values({ id, ...input });
    return { id, ...input };
  }

  async update(id: string, patch: SkillUpdateInput): Promise<Skill | null> {
    const changes = definedOnly(patch);
    if (Object.keys(changes).length > 0) {
      await getDb().update(skills).set(changes).where(eq(skills.id, id));
    }
    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;
    await getDb().delete(skills).where(eq(skills.id, id));
    return true;
  }

  async listPublic(): Promise<readonly Skill[]> {
    const rows = await getDb()
      .select()
      .from(skills)
      .where(eq(skills.isVisible, true))
      .orderBy(asc(skills.displayOrder));
    return rows.map(toSkill);
  }
}
