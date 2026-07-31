import { describe, expect, it, vi } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { AuthorizeMediaUpload } from "@/modules/media/application/use-cases/authorize-media-upload";
import type { StorageUploaderPort } from "@/modules/media/application/ports/storage-uploader-port";

const OBJECT_ID = "0f8fad5b-d9cb-469f-a165-70867728950e";

function makeUploader() {
  const createSignedUpload = vi.fn(async () => ({
    bucket: "portfolio-public",
    objectPath: `projects/${OBJECT_ID}.png`,
    signedUrl: "https://example.test/signed",
    token: "tok",
    expiresInSeconds: 120,
  }));
  return { port: { createSignedUpload } satisfies StorageUploaderPort, createSignedUpload };
}

const validRequest = {
  bucket: "portfolio-public",
  mimeType: "image/png",
  byteSize: 1024,
  keyPrefix: "projects",
} as const;

const ownerAdmin = AdminUser.create("u1", {
  email: "owner@example.com",
  role: "owner_admin",
  status: "active",
});

describe("AuthorizeMediaUpload", () => {
  it("denies an unauthenticated caller and never touches storage", async () => {
    const { port, createSignedUpload } = makeUploader();
    const uc = new AuthorizeMediaUpload({ uploader: port, newObjectId: () => OBJECT_ID });
    const r = await uc.execute({ admin: null, ...validRequest });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("MEDIA_UPLOAD_FORBIDDEN");
    expect(createSignedUpload).not.toHaveBeenCalled();
  });

  it("denies a suspended admin", async () => {
    const { port, createSignedUpload } = makeUploader();
    const suspended = AdminUser.create("u2", {
      email: "owner@example.com",
      role: "owner_admin",
      status: "suspended",
    });
    const uc = new AuthorizeMediaUpload({ uploader: port, newObjectId: () => OBJECT_ID });
    const r = await uc.execute({ admin: suspended, ...validRequest });
    expect(isErr(r)).toBe(true);
    expect(createSignedUpload).not.toHaveBeenCalled();
  });

  it("denies a role without media.write (viewer)", async () => {
    const { port, createSignedUpload } = makeUploader();
    const viewer = AdminUser.create("u3", {
      email: "viewer@example.com",
      role: "viewer",
      status: "active",
    });
    const uc = new AuthorizeMediaUpload({ uploader: port, newObjectId: () => OBJECT_ID });
    const r = await uc.execute({ admin: viewer, ...validRequest });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("MEDIA_UPLOAD_FORBIDDEN");
    expect(createSignedUpload).not.toHaveBeenCalled();
  });

  it("rejects an invalid request before touching storage (SVG)", async () => {
    const { port, createSignedUpload } = makeUploader();
    const uc = new AuthorizeMediaUpload({ uploader: port, newObjectId: () => OBJECT_ID });
    const r = await uc.execute({ admin: ownerAdmin, ...validRequest, mimeType: "image/svg+xml" });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("MEDIA_UPLOAD_REJECTED");
    expect(createSignedUpload).not.toHaveBeenCalled();
  });

  it("issues a short-lived signed upload for an authorized admin", async () => {
    const { port, createSignedUpload } = makeUploader();
    const uc = new AuthorizeMediaUpload({ uploader: port, newObjectId: () => OBJECT_ID });
    const r = await uc.execute({ admin: ownerAdmin, ...validRequest });
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.expiresInSeconds).toBeGreaterThan(0);
      expect(r.value.expiresInSeconds).toBeLessThanOrEqual(300);
    }
    expect(createSignedUpload).toHaveBeenCalledTimes(1);
  });
});
