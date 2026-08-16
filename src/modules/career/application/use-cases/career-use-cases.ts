import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type {
  AdminExperienceAggregate,
  Certification,
  Education,
  Experience,
} from "@/modules/career/domain/career";
import {
  CareerNotFoundError,
  CareerStaleWriteError,
  CareerValidationError,
  type CareerEntity,
  type CareerError,
} from "@/modules/career/domain/career-errors";
import {
  certificationCreateSchema,
  certificationUpdateSchema,
  educationCreateSchema,
  educationUpdateSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
} from "@/modules/career/application/career-schema";
import { authorizeCareer } from "@/modules/career/application/career-authorization";
import type {
  CareerRepositoryPort,
  CareerWriteOutcome,
} from "@/modules/career/application/ports/career-repository-port";

export interface ReadDeps {
  readonly repo: CareerRepositoryPort;
}
export interface WriteDeps {
  readonly repo: CareerRepositoryPort;
  readonly audit: AuditLogPort;
}
interface AdminInput {
  readonly admin: AdminUser | null;
}
interface VersionedInput extends AdminInput {
  readonly id: string;
  readonly expectedRowVersion: number;
  readonly patch: unknown;
}

function validation(messages: readonly string[]): CareerValidationError {
  return new CareerValidationError(messages);
}

function fromOutcome<T>(
  outcome: CareerWriteOutcome<T>,
  entity: CareerEntity,
  id: string,
): Result<T, CareerError> {
  switch (outcome.kind) {
    case "updated":
      return ok(outcome.entity);
    case "not_found":
      return err(new CareerNotFoundError(entity, id));
    case "stale":
      return err(new CareerStaleWriteError());
  }
}

// ---- Experiences ---------------------------------------------------------------------

export class ListExperiences
  implements UseCase<AdminInput, Result<readonly Experience[], CareerError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput): Promise<Result<readonly Experience[], CareerError>> {
    const auth = authorizeCareer(input.admin, "content.read");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.listAdminExperiences());
  }
}

export class GetExperience
  implements UseCase<AdminInput & { id: string }, Result<AdminExperienceAggregate, CareerError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(
    input: AdminInput & { id: string },
  ): Promise<Result<AdminExperienceAggregate, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.read");
    if (isErr(auth)) return auth;
    const found = await this.deps.repo.findExperienceById(input.id);
    return found ? ok(found) : err(new CareerNotFoundError("experience", input.id));
  }
}

export class CreateExperience
  implements UseCase<AdminInput & { data: unknown }, Result<Experience, CareerError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { data: unknown }): Promise<Result<Experience, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = experienceCreateSchema.safeParse(input.data);
    if (!parsed.success) return err(validation(parsed.error.issues.map((i) => i.message)));
    const created = await this.deps.repo.createExperience(parsed.data);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "experience.create",
      entityType: "experience",
      entityId: created.id,
      metadata: { organization: created.organization },
    });
    return ok(created);
  }
}

export class UpdateExperience implements UseCase<VersionedInput, Result<Experience, CareerError>> {
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: VersionedInput): Promise<Result<Experience, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = experienceUpdateSchema.safeParse(input.patch);
    if (!parsed.success) return err(validation(parsed.error.issues.map((i) => i.message)));
    const outcome = await this.deps.repo.updateExperience(
      input.id,
      input.expectedRowVersion,
      parsed.data,
    );
    const result = fromOutcome(outcome, "experience", input.id);
    if (isErr(result)) return result;
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "experience.update",
      entityType: "experience",
      entityId: input.id,
      metadata: { fields: Object.keys(parsed.data) },
    });
    return result;
  }
}

export class ArchiveExperience
  implements UseCase<AdminInput & { id: string }, Result<true, CareerError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { id: string }): Promise<Result<true, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const done = await this.deps.repo.softDeleteExperience(input.id);
    if (!done) return err(new CareerNotFoundError("experience", input.id));
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "experience.archive",
      entityType: "experience",
      entityId: input.id,
      metadata: null,
    });
    return ok(true);
  }
}

// ---- Education -----------------------------------------------------------------------

export class ListEducation
  implements UseCase<AdminInput, Result<readonly Education[], CareerError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput): Promise<Result<readonly Education[], CareerError>> {
    const auth = authorizeCareer(input.admin, "content.read");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.listAdminEducation());
  }
}

export class CreateEducation
  implements UseCase<AdminInput & { data: unknown }, Result<Education, CareerError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { data: unknown }): Promise<Result<Education, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = educationCreateSchema.safeParse(input.data);
    if (!parsed.success) return err(validation(parsed.error.issues.map((i) => i.message)));
    const created = await this.deps.repo.createEducation(parsed.data);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "education.create",
      entityType: "education",
      entityId: created.id,
      metadata: { institution: created.institution },
    });
    return ok(created);
  }
}

export class UpdateEducation implements UseCase<VersionedInput, Result<Education, CareerError>> {
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: VersionedInput): Promise<Result<Education, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = educationUpdateSchema.safeParse(input.patch);
    if (!parsed.success) return err(validation(parsed.error.issues.map((i) => i.message)));
    const outcome = await this.deps.repo.updateEducation(
      input.id,
      input.expectedRowVersion,
      parsed.data,
    );
    const result = fromOutcome(outcome, "education", input.id);
    if (isErr(result)) return result;
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "education.update",
      entityType: "education",
      entityId: input.id,
      metadata: { fields: Object.keys(parsed.data) },
    });
    return result;
  }
}

export class ArchiveEducation
  implements UseCase<AdminInput & { id: string }, Result<true, CareerError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { id: string }): Promise<Result<true, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const done = await this.deps.repo.softDeleteEducation(input.id);
    if (!done) return err(new CareerNotFoundError("education", input.id));
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "education.archive",
      entityType: "education",
      entityId: input.id,
      metadata: null,
    });
    return ok(true);
  }
}

// ---- Certifications ------------------------------------------------------------------

export class ListCertifications
  implements UseCase<AdminInput, Result<readonly Certification[], CareerError>>
{
  constructor(private readonly deps: ReadDeps) {}
  async execute(input: AdminInput): Promise<Result<readonly Certification[], CareerError>> {
    const auth = authorizeCareer(input.admin, "content.read");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.listAdminCertifications());
  }
}

export class CreateCertification
  implements UseCase<AdminInput & { data: unknown }, Result<Certification, CareerError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(
    input: AdminInput & { data: unknown },
  ): Promise<Result<Certification, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = certificationCreateSchema.safeParse(input.data);
    if (!parsed.success) return err(validation(parsed.error.issues.map((i) => i.message)));
    const created = await this.deps.repo.createCertification(parsed.data);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "certification.create",
      entityType: "certification",
      entityId: created.id,
      metadata: { name: created.name, issuer: created.issuer },
    });
    return ok(created);
  }
}

export class UpdateCertification
  implements UseCase<VersionedInput, Result<Certification, CareerError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: VersionedInput): Promise<Result<Certification, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = certificationUpdateSchema.safeParse(input.patch);
    if (!parsed.success) return err(validation(parsed.error.issues.map((i) => i.message)));
    const outcome = await this.deps.repo.updateCertification(
      input.id,
      input.expectedRowVersion,
      parsed.data,
    );
    const result = fromOutcome(outcome, "certification", input.id);
    if (isErr(result)) return result;
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "certification.update",
      entityType: "certification",
      entityId: input.id,
      metadata: { fields: Object.keys(parsed.data) },
    });
    return result;
  }
}

export class ArchiveCertification
  implements UseCase<AdminInput & { id: string }, Result<true, CareerError>>
{
  constructor(private readonly deps: WriteDeps) {}
  async execute(input: AdminInput & { id: string }): Promise<Result<true, CareerError>> {
    const auth = authorizeCareer(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const done = await this.deps.repo.softDeleteCertification(input.id);
    if (!done) return err(new CareerNotFoundError("certification", input.id));
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "certification.archive",
      entityType: "certification",
      entityId: input.id,
      metadata: null,
    });
    return ok(true);
  }
}
