/**
 * Upload constraints — the single source of truth for what the server will allow
 * into storage. Pure and framework-free so it can be unit-tested and shared by
 * the domain policy, the application use case and (indirectly) infrastructure.
 *
 * Security posture (see CLAUDE.md §14):
 * - SVG is disallowed by default (script execution vector).
 * - The original client filename is never trusted; object names are generated.
 * - MIME and byte-size are validated before any signed upload is issued.
 */

/** Canonical bucket names. Infrastructure re-exports these to avoid drift. */
export const STORAGE_BUCKET = {
  public: "portfolio-public",
  private: "portfolio-private",
} as const;

export type StorageBucketName = (typeof STORAGE_BUCKET)[keyof typeof STORAGE_BUCKET];

/** Allowed MIME → file extension. SVG is intentionally absent. */
const IMAGE_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
} as const;

const DOCUMENT_TYPES = {
  "application/pdf": "pdf",
} as const;

/** Per-bucket allow-list. Public serves web imagery + the resume PDF. */
export const BUCKET_ALLOWED_MIME: Record<StorageBucketName, Readonly<Record<string, string>>> = {
  [STORAGE_BUCKET.public]: { ...IMAGE_TYPES, ...DOCUMENT_TYPES },
  [STORAGE_BUCKET.private]: { ...IMAGE_TYPES, ...DOCUMENT_TYPES },
};

/** Per-MIME maximum byte size. Images are capped tighter than documents. */
export const MAX_BYTES_BY_MIME: Readonly<Record<string, number>> = {
  "image/png": 5 * 1024 * 1024,
  "image/jpeg": 5 * 1024 * 1024,
  "image/webp": 5 * 1024 * 1024,
  "image/avif": 5 * 1024 * 1024,
  "image/gif": 5 * 1024 * 1024,
  "application/pdf": 10 * 1024 * 1024,
};

/** Signed upload URLs are short-lived. Reads use equally short-lived signed URLs. */
export const SIGNED_URL_TTL_SECONDS = 120;

/** Logical folders a caller may target. Prevents arbitrary/traversal paths. */
export const ALLOWED_KEY_PREFIXES = ["projects", "articles", "profile", "resume", "site"] as const;
export type KeyPrefix = (typeof ALLOWED_KEY_PREFIXES)[number];

/** A safe object-name segment: lowercase hex/uuid only, no separators. */
export const SAFE_OBJECT_ID = /^[a-f0-9-]{8,64}$/;

export function isKnownBucket(bucket: string): bucket is StorageBucketName {
  return bucket === STORAGE_BUCKET.public || bucket === STORAGE_BUCKET.private;
}

export function extensionFor(bucket: StorageBucketName, mimeType: string): string | null {
  return BUCKET_ALLOWED_MIME[bucket][mimeType] ?? null;
}
