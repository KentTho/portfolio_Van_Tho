import { DomainError } from "@/shared/domain/domain-error";

export class SettingNotFoundError extends DomainError {
  readonly code = "SETTING_NOT_FOUND";
  constructor(key: string) {
    super(`Setting not found: ${key}`);
  }
}

export class SettingValidationError extends DomainError {
  readonly code = "SETTING_VALIDATION";
  constructor(readonly issues: readonly string[]) {
    super(`Invalid setting input: ${issues.join("; ")}`);
  }
}

export class SettingForbiddenError extends DomainError {
  readonly code = "SETTING_FORBIDDEN";
  constructor(reason = "Setting operation is not permitted") {
    super(reason);
  }
}

export type SettingError = SettingNotFoundError | SettingValidationError | SettingForbiddenError;
