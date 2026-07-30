import { describe, expect, it } from "vitest";
import { isErr, isOk } from "@/shared/domain/result";
import { evaluateUploadRequest } from "@/modules/media/domain/services/upload-policy";
import { STORAGE_BUCKET } from "@/modules/media/domain/value-objects/upload-constraints";

const OBJECT_ID = "0f8fad5b-d9cb-469f-a165-70867728950e";

function req(overrides: Partial<Parameters<typeof evaluateUploadRequest>[0]> = {}) {
  return evaluateUploadRequest({
    bucket: STORAGE_BUCKET.public,
    mimeType: "image/png",
    byteSize: 1024,
    keyPrefix: "projects",
    objectId: OBJECT_ID,
    ...overrides,
  });
}

describe("evaluateUploadRequest", () => {
  it("authorizes a valid image with a server-generated path", () => {
    const r = req();
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.objectPath).toBe(`projects/${OBJECT_ID}.png`);
      expect(r.value.bucket).toBe(STORAGE_BUCKET.public);
    }
  });

  it("rejects SVG (script vector) by default", () => {
    const r = req({ mimeType: "image/svg+xml" });
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error.code).toBe("MEDIA_UPLOAD_REJECTED");
  });

  it("rejects an unknown MIME type", () => {
    expect(isErr(req({ mimeType: "application/x-msdownload" }))).toBe(true);
  });

  it("rejects a file over the size limit", () => {
    expect(isErr(req({ byteSize: 6 * 1024 * 1024 }))).toBe(true);
  });

  it("rejects a zero or negative byte size", () => {
    expect(isErr(req({ byteSize: 0 }))).toBe(true);
    expect(isErr(req({ byteSize: -1 }))).toBe(true);
  });

  it("rejects an unknown bucket (no arbitrary bucket selection)", () => {
    expect(isErr(req({ bucket: "secrets" }))).toBe(true);
  });

  it("rejects a disallowed key prefix (no traversal / arbitrary path)", () => {
    expect(isErr(req({ keyPrefix: "../../etc" }))).toBe(true);
    expect(isErr(req({ keyPrefix: "random" }))).toBe(true);
  });

  it("rejects an unsafe object identifier", () => {
    expect(isErr(req({ objectId: "../evil" }))).toBe(true);
    expect(isErr(req({ objectId: "a/b" }))).toBe(true);
  });

  it("keeps public and private buckets separate in the result", () => {
    const pub = req({ bucket: STORAGE_BUCKET.public });
    const priv = req({ bucket: STORAGE_BUCKET.private, mimeType: "application/pdf", keyPrefix: "resume" });
    expect(isOk(pub) && pub.value.bucket).toBe(STORAGE_BUCKET.public);
    expect(isOk(priv) && priv.value.bucket).toBe(STORAGE_BUCKET.private);
    if (isOk(priv)) expect(priv.value.objectPath).toBe(`resume/${OBJECT_ID}.pdf`);
  });
});
