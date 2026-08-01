import type { Technology } from "@/modules/technologies/domain/technology";
import type { TechnologyCreateInput, TechnologyUpdateInput } from "../technology-schema";

/**
 * Port over the technologies store (Neon). The Drizzle implementation lands with the
 * Group 1 apply-phase (needs a verified Neon Development target); presentation and
 * use-cases depend only on this interface. Public reads never return soft-deleted rows.
 */
export interface TechnologyRepositoryPort {
  /** Visible, non-deleted technologies ordered by (category, sortOrder) — public read. */
  listVisible(): Promise<readonly Technology[]>;
  /** All non-deleted technologies — admin read. */
  listAll(): Promise<readonly Technology[]>;
  findBySlug(slug: string): Promise<Technology | null>;
  create(input: TechnologyCreateInput): Promise<Technology>;
  /** Returns null when the id does not exist (or is already soft-deleted). */
  update(id: string, patch: TechnologyUpdateInput): Promise<Technology | null>;
  softDelete(id: string): Promise<boolean>;
}
