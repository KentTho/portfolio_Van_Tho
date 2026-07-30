import { err, ok, type Result } from "@/shared/domain/result";
import { MediaUploadRejectedError } from "@/modules/media/domain/errors/media-upload-error";
import {
  BUCKET_ALLOWED_MIME,
  extensionFor,
  isKnownBucket,
  MAX_BYTES_BY_MIME,
  SAFE_OBJECT_ID,
  type KeyPrefix,
  type StorageBucketName,
} from "@/modules/media/domain/value-objects/upload-constraints";

export interface UploadRequest {
  readonly bucket: string;
  readonly mimeType: string;
  readonly byteSize: number;
  /** Logical folder (validated against an allow-list). */
  readonly keyPrefix: string;
  /** Server-generated identifier (never the client filename). */
  readonly objectId: string;
}

export interface AuthorizedUpload {
  readonly bucket: StorageBucketName;
  readonly objectPath: string;
  readonly mimeType: string;
  readonly byteSize: number;
}

const ALLOWED_PREFIXES = new Set<KeyPrefix>(["projects", "articles", "profile", "resume", "site"]);

/**
 * Pure server-side validation for a signed-upload request. Deny by default.
 * Order: bucket → MIME (per bucket) → size → prefix → generated id → safe path.
 * The returned `objectPath` is generated from trusted parts only, so a caller
 * can never smuggle a traversal path or arbitrary bucket through this policy.
 */
export function evaluateUploadRequest(
  input: UploadRequest,
): Result<AuthorizedUpload, MediaUploadRejectedError> {
  const { bucket, mimeType, byteSize, keyPrefix, objectId } = input;

  if (!isKnownBucket(bucket)) {
    return err(new MediaUploadRejectedError(`Unknown bucket "${bucket}"`));
  }

  const extension = extensionFor(bucket, mimeType);
  if (!extension) {
    const allowed = Object.keys(BUCKET_ALLOWED_MIME[bucket]).join(", ");
    return err(
      new MediaUploadRejectedError(`MIME "${mimeType}" not allowed in "${bucket}" (allowed: ${allowed})`),
    );
  }

  if (!Number.isInteger(byteSize) || byteSize <= 0) {
    return err(new MediaUploadRejectedError("Invalid byte size"));
  }
  const maxBytes = MAX_BYTES_BY_MIME[mimeType];
  if (maxBytes === undefined || byteSize > maxBytes) {
    return err(new MediaUploadRejectedError(`File exceeds the ${mimeType} size limit`));
  }

  if (!ALLOWED_PREFIXES.has(keyPrefix as KeyPrefix)) {
    return err(new MediaUploadRejectedError(`Key prefix "${keyPrefix}" is not allowed`));
  }

  if (!SAFE_OBJECT_ID.test(objectId)) {
    return err(new MediaUploadRejectedError("Unsafe object identifier"));
  }

  const objectPath = `${keyPrefix}/${objectId}.${extension}`;
  return ok({ bucket, objectPath, mimeType, byteSize });
}
