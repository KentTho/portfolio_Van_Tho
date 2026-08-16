import type { Skill } from "@/modules/skills/domain/skill";
import type { SkillCreateInput, SkillUpdateInput } from "@/modules/skills/application/skill-schema";

/**
 * Skill catalog repository. Flat rows (no translations, no soft-delete): deletion is a hard
 * delete, `isVisible` gates public exposure. Public reads return ONLY visible rows.
 */
export interface SkillRepositoryPort {
  listAdmin(): Promise<readonly Skill[]>;
  findById(id: string): Promise<Skill | null>;
  findBySlug(slug: string): Promise<{ readonly id: string } | null>;
  create(input: SkillCreateInput): Promise<Skill>;
  update(id: string, patch: SkillUpdateInput): Promise<Skill | null>;
  remove(id: string): Promise<boolean>;
  listPublic(): Promise<readonly Skill[]>;
}
