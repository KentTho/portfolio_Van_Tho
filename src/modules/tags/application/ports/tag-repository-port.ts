import type { Tag } from "@/modules/tags/domain/tag";
import type { TagCreateInput, TagUpdateInput } from "@/modules/tags/application/tag-schema";

/** Tag store port. Reads never return soft-deleted rows; ordered by (sortOrder, name). */
export interface TagRepositoryPort {
  listAll(): Promise<readonly Tag[]>;
  findById(id: string): Promise<Tag | null>;
  findBySlug(slug: string): Promise<Tag | null>;
  create(input: TagCreateInput): Promise<Tag>;
  update(id: string, patch: TagUpdateInput): Promise<Tag | null>;
  softDelete(id: string): Promise<boolean>;
}
