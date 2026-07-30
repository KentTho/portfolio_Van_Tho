import type { AuthorizedUpload } from "@/modules/media/domain/services/upload-policy";

export interface SignedUpload {
  readonly bucket: string;
  readonly objectPath: string;
  /** Short-lived signed upload URL the browser PUTs the bytes to. */
  readonly signedUrl: string;
  /** Opaque upload token (Supabase). */
  readonly token: string;
  readonly expiresInSeconds: number;
}

/**
 * Port over the storage provider's signed-upload capability. Implemented in
 * infrastructure with the server-only service client — never in the browser.
 */
export interface StorageUploaderPort {
  createSignedUpload(target: AuthorizedUpload): Promise<SignedUpload>;
}
