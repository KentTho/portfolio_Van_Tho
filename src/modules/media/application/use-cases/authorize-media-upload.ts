import { err, isErr, ok, type Result } from "@/shared/domain/result";
import type { UseCase } from "@/shared/application/use-case";
import { hasPermission } from "@/config/permissions";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import {
  MediaUploadForbiddenError,
  type MediaUploadError,
} from "@/modules/media/domain/errors/media-upload-error";
import { evaluateUploadRequest } from "@/modules/media/domain/services/upload-policy";
import type { SignedUpload, StorageUploaderPort } from "@/modules/media/application/ports/storage-uploader-port";

export interface AuthorizeUploadInput {
  /** Resolved by the composition root — never a client-asserted role. */
  readonly admin: AdminUser | null;
  readonly bucket: string;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly keyPrefix: string;
}

export interface AuthorizeUploadDeps {
  readonly uploader: StorageUploaderPort;
  /** Generates a server-side object id (uuid). Injected for testability. */
  readonly newObjectId: () => string;
}

/**
 * Server-mediated media upload authorization (CLAUDE.md §14):
 * 1. requires an authenticated, authorized admin with `media.write`;
 * 2. validates bucket/MIME/size/path via the pure domain policy;
 * 3. only then asks the storage provider for a short-lived signed upload.
 * The uploader is never touched when authorization or validation fails.
 */
export class AuthorizeMediaUpload
  implements UseCase<AuthorizeUploadInput, Result<SignedUpload, MediaUploadError>>
{
  constructor(private readonly deps: AuthorizeUploadDeps) {}

  async execute(input: AuthorizeUploadInput): Promise<Result<SignedUpload, MediaUploadError>> {
    const { admin } = input;
    if (!admin || !admin.isActive()) {
      return err(new MediaUploadForbiddenError("Authentication required"));
    }
    if (!hasPermission(admin.role, "media.write")) {
      return err(new MediaUploadForbiddenError("Role lacks media.write"));
    }

    const decision = evaluateUploadRequest({
      bucket: input.bucket,
      mimeType: input.mimeType,
      byteSize: input.byteSize,
      keyPrefix: input.keyPrefix,
      objectId: this.deps.newObjectId(),
    });
    if (isErr(decision)) return decision;

    const signed = await this.deps.uploader.createSignedUpload(decision.value);
    return ok(signed);
  }
}
