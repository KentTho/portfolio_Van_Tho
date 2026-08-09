import { DomainError } from "@/shared/domain/domain-error";

export class SkillNotFoundError extends DomainError {
  readonly code = "SKILL_NOT_FOUND";
  constructor(id: string) {
    super(`Skill not found: ${id}`);
  }
}

export class SkillSlugConflictError extends DomainError {
  readonly code = "SKILL_SLUG_CONFLICT";
  constructor(slug: string) {
    super(`Skill slug already exists: ${slug}`);
  }
}

export class SkillValidationError extends DomainError {
  readonly code = "SKILL_VALIDATION";
  constructor(readonly issues: readonly string[]) {
    super(`Invalid skill input: ${issues.join("; ")}`);
  }
}

export class SkillForbiddenError extends DomainError {
  readonly code = "SKILL_FORBIDDEN";
  constructor(reason = "Skill operation is not permitted") {
    super(reason);
  }
}

export type SkillError =
  | SkillNotFoundError
  | SkillSlugConflictError
  | SkillValidationError
  | SkillForbiddenError;
