import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { AdminProjectAggregate, Project } from "@/modules/projects/domain/project";
import {
  ProjectNotFoundError,
  ProjectSlugConflictError,
  ProjectStaleWriteError,
  ProjectValidationError,
  type ProjectError,
} from "@/modules/projects/domain/project-errors";
import {
  assertCanArchive,
  assertCanPublish,
  assertCanUnpublish,
} from "@/modules/projects/domain/project-state";
import {
  projectCreateSchema,
  projectUpdateSchema,
} from "@/modules/projects/application/project-schema";
import { authorizeProject } from "@/modules/projects/application/project-authorization";
import type {
  ProjectRepositoryPort,
  WriteOutcome,
} from "@/modules/projects/application/ports/project-repository-port";

/**
 * Admin application capability over the verified Group 2a schema. Authorization is
 * enforced here (never only in the UI). Writes validate at the boundary (Zod), guard
 * slug uniqueness and optimistic concurrency (row_version), and audit every mutation.
 * Multi-table atomicity is the repository's responsibility (Neon batched transaction).
 */

export interface ReadDeps {
  readonly repo: ProjectRepositoryPort;
}
export interface WriteDeps {
  readonly repo: ProjectRepositoryPort;
  readonly audit: AuditLogPort;
}

interface AdminInput {
  readonly admin: AdminUser | null;
}

interface VersionedInput extends AdminInput {
  readonly id: string;
  readonly expectedRowVersion: number;
}

function fromWriteOutcome(
  outcome: WriteOutcome,
  id: string,
): Result<Project, ProjectError> {
  switch (outcome.kind) {
    case "updated":
      return ok(outcome.project);
    case "not_found":
      return err(new ProjectNotFoundError(id));
    case "stale":
      return err(new ProjectStaleWriteError());
  }
}

export class ListAdminProjects
  implements UseCase<AdminInput, Result<readonly Project[], ProjectError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput): Promise<Result<readonly Project[], ProjectError>> {
    const auth = authorizeProject(input.admin, "content.read");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.listAdmin());
  }
}

export class GetAdminProject
  implements UseCase<AdminInput & { id: string }, Result<AdminProjectAggregate, ProjectError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(
    input: AdminInput & { id: string },
  ): Promise<Result<AdminProjectAggregate, ProjectError>> {
    const auth = authorizeProject(input.admin, "content.read");
    if (isErr(auth)) return auth;
    const found = await this.deps.repo.findAdminById(input.id);
    return found ? ok(found) : err(new ProjectNotFoundError(input.id));
  }
}

export class CreateProject
  implements UseCase<AdminInput & { data: unknown }, Result<Project, ProjectError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: AdminInput & { data: unknown },
  ): Promise<Result<Project, ProjectError>> {
    const auth = authorizeProject(input.admin, "content.write");
    if (isErr(auth)) return auth;

    const parsed = projectCreateSchema.safeParse(input.data);
    if (!parsed.success) {
      return err(new ProjectValidationError(parsed.error.issues.map((i) => i.message)));
    }
    if (await this.deps.repo.findBySlug(parsed.data.slug)) {
      return err(new ProjectSlugConflictError(parsed.data.slug));
    }

    const created = await this.deps.repo.create(parsed.data);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "project.create",
      entityType: "project",
      entityId: created.id,
      metadata: { slug: created.slug, status: created.status },
    });
    return ok(created);
  }
}

export class UpdateProject
  implements UseCase<VersionedInput & { patch: unknown }, Result<Project, ProjectError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: VersionedInput & { patch: unknown },
  ): Promise<Result<Project, ProjectError>> {
    const auth = authorizeProject(input.admin, "content.write");
    if (isErr(auth)) return auth;

    const parsed = projectUpdateSchema.safeParse(input.patch);
    if (!parsed.success) {
      return err(new ProjectValidationError(parsed.error.issues.map((i) => i.message)));
    }
    if (parsed.data.slug !== undefined) {
      const clash = await this.deps.repo.findBySlug(parsed.data.slug);
      if (clash && clash.id !== input.id) {
        return err(new ProjectSlugConflictError(parsed.data.slug));
      }
    }

    const outcome = await this.deps.repo.update(input.id, input.expectedRowVersion, parsed.data);
    const result = fromWriteOutcome(outcome, input.id);
    if (isErr(result)) return result;

    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "project.update",
      entityType: "project",
      entityId: input.id,
      metadata: { fields: Object.keys(parsed.data) },
    });
    return result;
  }
}

/** Shared status-transition executor for publish/unpublish/archive. */
async function transition(
  deps: WriteDeps,
  input: VersionedInput,
  permission: "content.publish" | "content.write",
  action: string,
  compute: (current: AdminProjectAggregate) => Result<
    { status: Parameters<ProjectRepositoryPort["setStatus"]>[2]["status"]; publishedAt: Date | null },
    ProjectError
  >,
): Promise<Result<Project, ProjectError>> {
  const auth = authorizeProject(input.admin, permission);
  if (isErr(auth)) return auth;

  const current = await deps.repo.findAdminById(input.id);
  if (!current) return err(new ProjectNotFoundError(input.id));
  if (current.project.rowVersion !== input.expectedRowVersion) {
    return err(new ProjectStaleWriteError());
  }

  const change = compute(current);
  if (isErr(change)) return change;

  const outcome = await deps.repo.setStatus(input.id, input.expectedRowVersion, change.value);
  const result = fromWriteOutcome(outcome, input.id);
  if (isErr(result)) return result;

  await deps.audit.record({
    actorUserId: auth.value.id,
    action,
    entityType: "project",
    entityId: input.id,
    metadata: { status: change.value.status },
  });
  return result;
}

export class PublishProject implements UseCase<VersionedInput, Result<Project, ProjectError>> {
  constructor(private readonly deps: WriteDeps) {}
  execute(input: VersionedInput): Promise<Result<Project, ProjectError>> {
    return transition(this.deps, input, "content.publish", "project.publish", (current) => {
      const can = assertCanPublish(current.project.status);
      if (isErr(can)) return can;
      const publishedAt = current.project.publishedAt ?? new Date();
      return ok({ status: "published" as const, publishedAt });
    });
  }
}

export class UnpublishProject implements UseCase<VersionedInput, Result<Project, ProjectError>> {
  constructor(private readonly deps: WriteDeps) {}
  execute(input: VersionedInput): Promise<Result<Project, ProjectError>> {
    return transition(this.deps, input, "content.publish", "project.unpublish", (current) => {
      const can = assertCanUnpublish(current.project.status);
      if (isErr(can)) return can;
      return ok({ status: "draft" as const, publishedAt: null });
    });
  }
}

export class ArchiveProject implements UseCase<VersionedInput, Result<Project, ProjectError>> {
  constructor(private readonly deps: WriteDeps) {}
  execute(input: VersionedInput): Promise<Result<Project, ProjectError>> {
    return transition(this.deps, input, "content.write", "project.archive", (current) => {
      const can = assertCanArchive(current.project.status);
      if (isErr(can)) return can;
      return ok({ status: "archived" as const, publishedAt: null });
    });
  }
}
