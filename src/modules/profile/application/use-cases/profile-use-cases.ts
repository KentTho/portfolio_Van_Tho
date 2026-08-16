import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import type { Profile } from "@/modules/profile/domain/profile";
import {
  ProfileValidationError,
  type ProfileError,
} from "@/modules/profile/domain/profile-errors";
import { profileUpdateSchema } from "@/modules/profile/application/profile-schema";
import { authorizeProfile } from "@/modules/profile/application/profile-authorization";
import type { ProfileRepositoryPort } from "@/modules/profile/application/ports/profile-repository-port";

interface AdminInput {
  readonly admin: AdminUser | null;
}

export class GetProfile implements UseCase<AdminInput, Result<Profile, ProfileError>> {
  constructor(private readonly deps: { repo: ProfileRepositoryPort }) {}
  async execute(input: AdminInput): Promise<Result<Profile, ProfileError>> {
    const auth = authorizeProfile(input.admin, "content.read");
    if (isErr(auth)) return auth;
    return ok(await this.deps.repo.get());
  }
}

export class UpdateProfile
  implements UseCase<AdminInput & { patch: unknown }, Result<Profile, ProfileError>>
{
  constructor(private readonly deps: { repo: ProfileRepositoryPort; audit: AuditLogPort }) {}
  async execute(input: AdminInput & { patch: unknown }): Promise<Result<Profile, ProfileError>> {
    const auth = authorizeProfile(input.admin, "content.write");
    if (isErr(auth)) return auth;
    const parsed = profileUpdateSchema.safeParse(input.patch);
    if (!parsed.success) {
      return err(new ProfileValidationError(parsed.error.issues.map((i) => i.message)));
    }
    const updated = await this.deps.repo.update(parsed.data);
    await this.deps.audit.record({
      actorUserId: auth.value.id,
      action: "profile.update",
      entityType: "profile",
      entityId: "primary",
      metadata: { fields: Object.keys(parsed.data) },
    });
    return ok(updated);
  }
}
