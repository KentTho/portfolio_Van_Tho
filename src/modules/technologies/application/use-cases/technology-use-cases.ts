import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { Technology } from "@/modules/technologies/domain/technology";
import {
  TechnologyNotFoundError,
  TechnologySlugConflictError,
  TechnologyValidationError,
  type TechnologyError,
} from "@/modules/technologies/domain/technology-errors";
import {
  technologyCreateSchema,
  technologyUpdateSchema,
} from "@/modules/technologies/application/technology-schema";
import { authorizeTechnology } from "@/modules/technologies/application/technology-authorization";
import type { TechnologyRepositoryPort } from "@/modules/technologies/application/ports/technology-repository-port";

/**
 * Admin application capability over the verified `technologies` schema (Group 1B).
 * Every operation authorizes an active admin first (deny by default); writes validate
 * at the trust boundary (Zod), enforce slug uniqueness, and record an audit entry.
 * Technologies carry no row_version — single-row writes need no optimistic concurrency.
 */

export interface ReadDeps {
  readonly repo: TechnologyRepositoryPort;
}
export interface WriteDeps {
  readonly repo: TechnologyRepositoryPort;
  readonly audit: AuditLogPort;
}

interface AdminInput {
  /** Resolved by the composition root — never a client-asserted role. */
  readonly admin: AdminUser | null;
}

function issues(messages: readonly string[]): TechnologyValidationError {
  return new TechnologyValidationError(messages);
}

/** List all non-deleted technologies for the admin catalog. */
export class ListTechnologies
  implements UseCase<AdminInput, Result<readonly Technology[], TechnologyError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput): Promise<Result<readonly Technology[], TechnologyError>> {
    const auth = authorizeTechnology(input.admin, "content.read");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.listAll());
  }
}

/** Fetch a single technology by id for the admin detail view. */
export class GetTechnology
  implements UseCase<AdminInput & { id: string }, Result<Technology, TechnologyError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(
    input: AdminInput & { id: string },
  ): Promise<Result<Technology, TechnologyError>> {
    const auth = authorizeTechnology(input.admin, "content.read");
    if (isErr(auth)) return auth;
    const found = await this.deps.repo.findById(input.id);
    return found ? ok(found) : err(new TechnologyNotFoundError(input.id));
  }
}

/** Create a technology (unique slug, validated category, audited). */
export class CreateTechnology
  implements UseCase<AdminInput & { data: unknown }, Result<Technology, TechnologyError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: AdminInput & { data: unknown },
  ): Promise<Result<Technology, TechnologyError>> {
    const auth = authorizeTechnology(input.admin, "content.write");
    if (isErr(auth)) return auth;

    const parsed = technologyCreateSchema.safeParse(input.data);
    if (!parsed.success) return err(issues(parsed.error.issues.map((i) => i.message)));

    if (await this.deps.repo.findBySlug(parsed.data.slug)) {
      return err(new TechnologySlugConflictError(parsed.data.slug));
    }

    const created = await this.deps.repo.create(parsed.data);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "technology.create",
      entityType: "technology",
      entityId: created.id,
      metadata: { slug: created.slug, category: created.category },
    });
    return ok(created);
  }
}

/** Update mutable technology fields; a slug change may not collide with another row. */
export class UpdateTechnology
  implements
    UseCase<AdminInput & { id: string; patch: unknown }, Result<Technology, TechnologyError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: AdminInput & { id: string; patch: unknown },
  ): Promise<Result<Technology, TechnologyError>> {
    const auth = authorizeTechnology(input.admin, "content.write");
    if (isErr(auth)) return auth;

    const parsed = technologyUpdateSchema.safeParse(input.patch);
    if (!parsed.success) return err(issues(parsed.error.issues.map((i) => i.message)));

    if (parsed.data.slug !== undefined) {
      const clash = await this.deps.repo.findBySlug(parsed.data.slug);
      if (clash && clash.id !== input.id) {
        return err(new TechnologySlugConflictError(parsed.data.slug));
      }
    }

    const updated = await this.deps.repo.update(input.id, parsed.data);
    if (!updated) return err(new TechnologyNotFoundError(input.id));

    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "technology.update",
      entityType: "technology",
      entityId: updated.id,
      metadata: { fields: Object.keys(parsed.data) },
    });
    return ok(updated);
  }
}

/** Soft-delete (archive) a technology. Idempotent-safe: missing/already-archived → not found. */
export class ArchiveTechnology
  implements UseCase<AdminInput & { id: string }, Result<true, TechnologyError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { id: string }): Promise<Result<true, TechnologyError>> {
    const auth = authorizeTechnology(input.admin, "content.write");
    if (isErr(auth)) return auth;

    const archived = await this.deps.repo.softDelete(input.id);
    if (!archived) return err(new TechnologyNotFoundError(input.id));

    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "technology.archive",
      entityType: "technology",
      entityId: input.id,
      metadata: null,
    });
    return ok(true);
  }
}

/** Toggle public visibility without deleting. */
export class SetTechnologyVisibility
  implements
    UseCase<AdminInput & { id: string; isVisible: boolean }, Result<Technology, TechnologyError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: AdminInput & { id: string; isVisible: boolean },
  ): Promise<Result<Technology, TechnologyError>> {
    const auth = authorizeTechnology(input.admin, "content.write");
    if (isErr(auth)) return auth;

    const updated = await this.deps.repo.setVisibility(input.id, input.isVisible);
    if (!updated) return err(new TechnologyNotFoundError(input.id));

    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "technology.set_visibility",
      entityType: "technology",
      entityId: updated.id,
      metadata: { isVisible: input.isVisible },
    });
    return ok(updated);
  }
}
