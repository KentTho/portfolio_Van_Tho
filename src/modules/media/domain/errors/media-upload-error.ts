import { DomainError } from "@/shared/domain/domain-error";

/** Raised when a requested upload violates a storage constraint. */
export class MediaUploadRejectedError extends DomainError {
  readonly code = "MEDIA_UPLOAD_REJECTED";
  constructor(reason: string) {
    super(reason);
  }
}

/** Raised when the caller is not an authorized admin for media writes. */
export class MediaUploadForbiddenError extends DomainError {
  readonly code = "MEDIA_UPLOAD_FORBIDDEN";
  constructor(reason = "Media upload is not permitted") {
    super(reason);
  }
}

export type MediaUploadError = MediaUploadRejectedError | MediaUploadForbiddenError;
