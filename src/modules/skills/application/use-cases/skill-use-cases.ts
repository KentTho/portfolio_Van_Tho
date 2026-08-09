import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { Skill } from "@/modules/skills/domain/skill";
import {
  SkillNotFoundError,
  SkillSlugConflictError,
  SkillValidationError,
  type SkillError,
} from "@/modules/skills/domain/skill-errors";
import {
  skillCreateSchema,
  skillUpdateSchema,
} from "@/modules/skills/application/skill-schema";
import { authorizeSkill } from "@/modules/skills/application/skill-authorization";
import type { SkillRepositoryPort } from "@/modules/skills/application/ports/skill-repository-port";

export interface ReadDeps {
  readonly repo: SkillRepositoryPort;
}
export interface WriteDeps {
  readonly repo: SkillRepositoryPort;
  readonly audit: AuditLogPort;
}
interface AdminInput {
  readonly admin: AdminUser | null;
}

function validation(messages: readonly string[]): SkillValidationError {
  return new SkillValidationError(messages);
}

export class ListSkills implements UseCase<AdminInput, Result<readonly Skill[], SkillError>> {
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput): Promise<Result<readonly Skill[], SkillError>> {
    const auth = authorizeSkill(input.admin, "content.read");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.listAdmin());
  }
}

export class GetSkill
  implements UseCase<AdminInput & { id: string }, Result<Skill, SkillError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput & { id: string }): Promise<Result<Skill, SkillError>> {
    const auth = authorizeSkill(input.admin, "content.read");
    if (isErr(auth)) return auth;
    const found = await this.deps.repo.findById(input.id);
    return found ? ok(found) : err(new SkillNotFoundError(input.id));
  }
}

export class CreateSkill
  implements UseCase<AdminInput & { data: unknown }, Result<Skill, SkillError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { data: unknown }): Promise<Result<Skill, SkillError>> {
    const auth = authorizeSkill(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = skillCreateSchema.safeParse(input.data);
    if (!parsed.success) return err(validation(parsed.error.issues.map((i) => i.message)));
    if (await this.deps.repo.findBySlug(parsed.data.slug)) {
      return err(new SkillSlugConflictError(parsed.data.slug));
    }
    const created = await this.deps.repo.create(parsed.data);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "skill.create",
      entityType: "skill",
      entityId: created.id,
      metadata: { slug: created.slug, category: created.category },
    });
    return ok(created);
  }
}

export class UpdateSkill
  implements UseCase<AdminInput & { id: string; patch: unknown }, Result<Skill, SkillError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: AdminInput & { id: string; patch: unknown },
  ): Promise<Result<Skill, SkillError>> {
    const auth = authorizeSkill(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = skillUpdateSchema.safeParse(input.patch);
    if (!parsed.success) return err(validation(parsed.error.issues.map((i) => i.message)));
    if (parsed.data.slug !== undefined) {
      const clash = await this.deps.repo.findBySlug(parsed.data.slug);
      if (clash && clash.id !== input.id) return err(new SkillSlugConflictError(parsed.data.slug));
    }
    const updated = await this.deps.repo.update(input.id, parsed.data);
    if (!updated) return err(new SkillNotFoundError(input.id));
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "skill.update",
      entityType: "skill",
      entityId: updated.id,
      metadata: { fields: Object.keys(parsed.data) },
    });
    return ok(updated);
  }
}

export class DeleteSkill
  implements UseCase<AdminInput & { id: string }, Result<true, SkillError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { id: string }): Promise<Result<true, SkillError>> {
    const auth = authorizeSkill(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const removed = await this.deps.repo.remove(input.id);
    if (!removed) return err(new SkillNotFoundError(input.id));
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "skill.delete",
      entityType: "skill",
      entityId: input.id,
      metadata: null,
    });
    return ok(true);
  }
}
