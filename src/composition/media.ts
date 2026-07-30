import "server-only";
import { getCurrentAdmin } from "@/composition/identity";
import { AuthorizeMediaUpload } from "@/modules/media/application/use-cases/authorize-media-upload";
import type { SignedUpload } from "@/modules/media/application/ports/storage-uploader-port";
import type { MediaUploadError } from "@/modules/media/domain/errors/media-upload-error";
import { SupabaseStorageUploader } from "@/modules/media/infrastructure/supabase-storage-uploader";
import type { Result } from "@/shared/domain/result";

export interface RequestUploadInput {
  readonly bucket: string;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly keyPrefix: string;
}

/**
 * Composition root for media uploads: resolves the current admin server-side,
 * wires the storage uploader, and runs the authorization use case. Presentation
 * calls this — never a concrete adapter or the storage client directly.
 */
export async function requestSignedUpload(
  input: RequestUploadInput,
): Promise<Result<SignedUpload, MediaUploadError>> {
  const admin = await getCurrentAdmin();
  const useCase = new AuthorizeMediaUpload({
    uploader: new SupabaseStorageUploader(),
    newObjectId: () => crypto.randomUUID(),
  });
  return useCase.execute({ admin, ...input });
}
