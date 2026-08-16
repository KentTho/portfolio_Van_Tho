import { DomainError } from "@/shared/domain/domain-error";

export class ProfileValidationError extends DomainError {
  readonly code = "PROFILE_VALIDATION";
  constructor(readonly issues: readonly string[]) {
    super(`Invalid profile input: ${issues.join("; ")}`);
  }
}

export class ProfileForbiddenError extends DomainError {
  readonly code = "PROFILE_FORBIDDEN";
  constructor(reason = "Profile operation is not permitted") {
    super(reason);
  }
}

export type ProfileError = ProfileValidationError | ProfileForbiddenError;
