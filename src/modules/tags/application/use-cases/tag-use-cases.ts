import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { Tag } from "@/modules/tags/domain/tag";
import {
  TagNotFoundError,
  TagSlugConflictError,
  TagValidationError,
  type TagError,
} from "@/modules/tags/domain/tag-errors";
import { tagCreateSchema, tagUpdateSchema } from "@/modules/tags/application/tag-schema";
import { authorizeTag } from "@/modules/tags/application/tag-authorization";
import type { TagRepositoryPort } from "@/modules/tags/application/ports/tag-repository-port";

/**
 * Admin tag application capability (Group 3 shared taxonomy). Authorization first, Zod at
 * the boundary, slug uniqueness, soft delete, audit on writes. Single-row writes need no
 * transaction/row_version.
 */
export interface ReadDeps {
  readonly repo: TagRepositoryPort;
}
export interface WriteDeps {
  readonly repo: TagRepositoryPort;
  readonly audit: AuditLogPort;
}
interface AdminInput {
  readonly admin: AdminUser | null;
}

export class ListTags implements UseCase<AdminInput, Result<readonly Tag[], TagError>> {
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput): Promise<Result<readonly Tag[], TagError>> {
    const auth = authorizeTag(input.admin, "content.read");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.listAll());
  }
}

export class GetTag implements UseCase<AdminInput & { id: string }, Result<Tag, TagError>> {
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput & { id: string }): Promise<Result<Tag, TagError>> {
    const auth = authorizeTag(input.admin, "content.read");
    if (isErr(auth)) return auth;
    const found = await this.deps.repo.findById(input.id);
    return found ? ok(found) : err(new TagNotFoundError(input.id));
  }
}

export class CreateTag
  implements UseCase<AdminInput & { data: unknown }, Result<Tag, TagError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { data: unknown }): Promise<Result<Tag, TagError>> {
    const auth = authorizeTag(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = tagCreateSchema.safeParse(input.data);
    if (!parsed.success) return err(new TagValidationError(parsed.error.issues.map((i) => i.message)));
    if (await this.deps.repo.findBySlug(parsed.data.slug)) {
      return err(new TagSlugConflictError(parsed.data.slug));
    }
    const created = await this.deps.repo.create(parsed.data);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "tag.create",
      entityType: "tag",
      entityId: created.id,
      metadata: { slug: created.slug },
    });
    return ok(created);
  }
}

export class UpdateTag
  implements UseCase<AdminInput & { id: string; patch: unknown }, Result<Tag, TagError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: AdminInput & { id: string; patch: unknown },
  ): Promise<Result<Tag, TagError>> {
    const auth = authorizeTag(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = tagUpdateSchema.safeParse(input.patch);
    if (!parsed.success) return err(new TagValidationError(parsed.error.issues.map((i) => i.message)));
    if (parsed.data.slug !== undefined) {
      const clash = await this.deps.repo.findBySlug(parsed.data.slug);
      if (clash && clash.id !== input.id) return err(new TagSlugConflictError(parsed.data.slug));
    }
    const updated = await this.deps.repo.update(input.id, parsed.data);
    if (!updated) return err(new TagNotFoundError(input.id));
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "tag.update",
      entityType: "tag",
      entityId: updated.id,
      metadata: { fields: Object.keys(parsed.data) },
    });
    return ok(updated);
  }
}

export class ArchiveTag
  implements UseCase<AdminInput & { id: string }, Result<true, TagError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { id: string }): Promise<Result<true, TagError>> {
    const auth = authorizeTag(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const archived = await this.deps.repo.softDelete(input.id);
    if (!archived) return err(new TagNotFoundError(input.id));
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "tag.archive",
      entityType: "tag",
      entityId: input.id,
      metadata: null,
    });
    return ok(true);
  }
}
