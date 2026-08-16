import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type {
  ContentRevision,
  RevisionSummary,
} from "@/modules/revisions/domain/content-revision";
import {
  RevisionNotFoundError,
  RevisionValidationError,
  type RevisionError,
} from "@/modules/revisions/domain/revision-errors";
import {
  createRevisionSchema,
  revisionRefSchema,
} from "@/modules/revisions/application/revision-schema";
import { authorizeRevision } from "@/modules/revisions/application/revision-authorization";
import type { RevisionRepositoryPort } from "@/modules/revisions/application/ports/revision-repository-port";

export interface ReadDeps {
  readonly repo: RevisionRepositoryPort;
}
export interface WriteDeps {
  readonly repo: RevisionRepositoryPort;
  readonly audit: AuditLogPort;
}
interface AdminInput {
  readonly admin: AdminUser | null;
}

/** Snapshot the current state of a content entity as a new immutable revision. */
export class CreateRevision
  implements UseCase<AdminInput & { data: unknown }, Result<ContentRevision, RevisionError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: AdminInput & { data: unknown },
  ): Promise<Result<ContentRevision, RevisionError>> {
    const auth = authorizeRevision(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = createRevisionSchema.safeParse(input.data);
    if (!parsed.success) {
      return err(new RevisionValidationError(parsed.error.issues.map((i) => i.message)));
    }
    const created = await this.deps.repo.create(parsed.data, auth.value.id);
    // Distinct authority: the snapshot lives in content_revisions; audit_logs only records
    // that a revision was taken (who/when), never the content payload.
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "revision.create",
      entityType: parsed.data.contentType,
      entityId: parsed.data.contentId,
      metadata: { version: created.version, revisionId: created.id },
    });
    return ok(created);
  }
}

/** List the revision history (metadata only) for a content entity, newest version first. */
export class ListRevisions
  implements
    UseCase<AdminInput & { ref: unknown }, Result<readonly RevisionSummary[], RevisionError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(
    input: AdminInput & { ref: unknown },
  ): Promise<Result<readonly RevisionSummary[], RevisionError>> {
    const auth = authorizeRevision(input.admin, "content.read");
    if (isErr(auth)) return auth;
    const parsed = revisionRefSchema.safeParse(input.ref);
    if (!parsed.success) {
      return err(new RevisionValidationError(parsed.error.issues.map((i) => i.message)));
    }
    return ok(await this.deps.repo.listForEntity(parsed.data.contentType, parsed.data.contentId));
  }
}

/** Fetch one revision including its immutable snapshot. */
export class GetRevision
  implements UseCase<AdminInput & { id: string }, Result<ContentRevision, RevisionError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(
    input: AdminInput & { id: string },
  ): Promise<Result<ContentRevision, RevisionError>> {
    const auth = authorizeRevision(input.admin, "content.read");
    if (isErr(auth)) return auth;
    const found = await this.deps.repo.findById(input.id);
    return found ? ok(found) : err(new RevisionNotFoundError(input.id));
  }
}

/**
 * Preview a restore: returns the snapshot payload WITHOUT mutating anything. Restoring is a
 * separate forward mutation performed by the owning entity's own use-cases — this read never
 * rewrites history or the live entity, so it is inherently safe.
 */
export class PreviewRestore
  implements
    UseCase<
      AdminInput & { id: string },
      Result<{ revision: ContentRevision; snapshot: unknown }, RevisionError>
    >
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(
    input: AdminInput & { id: string },
  ): Promise<Result<{ revision: ContentRevision; snapshot: unknown }, RevisionError>> {
    const auth = authorizeRevision(input.admin, "content.read");
    if (isErr(auth)) return auth;
    const found = await this.deps.repo.findById(input.id);
    if (!found) return err(new RevisionNotFoundError(input.id));
    return ok({ revision: found, snapshot: found.snapshot });
  }
}
