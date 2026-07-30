import "server-only";
import { createSupabaseServiceClient } from "@/infrastructure/supabase/storage-client";
import { SIGNED_URL_TTL_SECONDS } from "@/modules/media/domain/value-objects/upload-constraints";
import type { AuthorizedUpload } from "@/modules/media/domain/services/upload-policy";
import type {
  SignedUpload,
  StorageUploaderPort,
} from "@/modules/media/application/ports/storage-uploader-port";

/**
 * Supabase implementation of the signed-upload port. Uses the server-only
 * service client; the secret never reaches the browser bundle. The provider
 * manages the upload token TTL; SIGNED_URL_TTL_SECONDS is our policy for the
 * short-lived signed *read* URLs issued elsewhere.
 *
 * NOTE: live behaviour is target-proof pending until Supabase Storage buckets
 * exist (Wave 03R target proof). The pure authorization above is unit-proven.
 */
export class SupabaseStorageUploader implements StorageUploaderPort {
  async createSignedUpload(target: AuthorizedUpload): Promise<SignedUpload> {
    const client = createSupabaseServiceClient();
    const { data, error } = await client.storage
      .from(target.bucket)
      .createSignedUploadUrl(target.objectPath);

    if (error || !data) {
      throw new Error(`Failed to create signed upload for ${target.bucket}`);
    }

    return {
      bucket: target.bucket,
      objectPath: data.path,
      signedUrl: data.signedUrl,
      token: data.token,
      expiresInSeconds: SIGNED_URL_TTL_SECONDS,
    };
  }
}
