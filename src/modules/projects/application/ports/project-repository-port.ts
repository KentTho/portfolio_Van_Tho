import type {
  AdminProjectAggregate,
  Project,
  ProjectStatus,
} from "@/modules/projects/domain/project";
import type {
  ProjectCreateInput,
  ProjectUpdateInput,
} from "@/modules/projects/application/project-schema";

/** Result of an optimistic-concurrency write. `not_found` and `stale` are distinct. */
export type WriteOutcome =
  | { readonly kind: "updated"; readonly project: Project }
  | { readonly kind: "not_found" }
  | { readonly kind: "stale" };

/** New status plus the publish timestamp to persist (null when unpublishing/archiving). */
export interface StatusChange {
  readonly status: ProjectStatus;
  readonly publishedAt: Date | null;
}

/**
 * Admin-side project repository. Multi-table writes are atomic (Neon HTTP batched
 * transaction, §G). Reads here are the admin view and may include non-published rows;
 * they still exclude soft-deleted rows.
 */
export interface ProjectRepositoryPort {
  findBySlug(slug: string): Promise<{ readonly id: string } | null>;
  findAdminById(id: string): Promise<AdminProjectAggregate | null>;
  listAdmin(): Promise<readonly Project[]>;
  /** Atomically inserts the project and all provided child collections. */
  create(input: ProjectCreateInput): Promise<Project>;
  /** Conditional update guarded by `expectedRowVersion`; replaces provided collections. */
  update(
    id: string,
    expectedRowVersion: number,
    patch: ProjectUpdateInput,
  ): Promise<WriteOutcome>;
  /** Conditional status transition guarded by `expectedRowVersion`. */
  setStatus(
    id: string,
    expectedRowVersion: number,
    change: StatusChange,
  ): Promise<WriteOutcome>;
}
