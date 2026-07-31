import { DomainError } from "@/shared/domain/domain-error";

export class AuthenticationRequiredError extends DomainError {
  readonly code = "AUTHENTICATION_REQUIRED";
  constructor() {
    super("Authentication required");
  }
}

export class AuthorizationDeniedError extends DomainError {
  readonly code = "AUTHORIZATION_DENIED";
  constructor(reason = "Authorization denied") {
    super(reason);
  }
}

export type AdminAccessError = AuthenticationRequiredError | AuthorizationDeniedError;
