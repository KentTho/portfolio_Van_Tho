import type {
  ContentRevision,
  RevisionContentType,
  RevisionSummary,
} from "@/modules/revisions/domain/content-revision";
import type { CreateRevisionInput } from "@/modules/revisions/application/revision-schema";

/**
 * Append-only revision store. `create` assigns the next version (max+1) for the entity and
 * inserts an immutable snapshot; there is intentionally no update or delete method.
 */
export interface RevisionRepositoryPort {
  create(input: CreateRevisionInput, actorUserId: string | null): Promise<ContentRevision>;
  listForEntity(
    contentType: RevisionContentType,
    contentId: string,
  ): Promise<readonly RevisionSummary[]>;
  findById(id: string): Promise<ContentRevision | null>;
}
