# Storage policy review

## Buckets
- `portfolio-public` — public read; admin write only.
- `portfolio-private` — no public read; signed URL only; admin read/write.
- `portfolio-video-clips` (optional) — small optimized clips only.

## Policy requirements (RLS on storage metadata)
Restrict INSERT / SELECT / UPDATE / DELETE by bucket, path prefix, and authenticated admin identity. Verified by `scripts/verify-storage-policies.ts` (Wave 03/07).

## Upload controls
- Server verifies admin role before issuing a signed upload.
- Validate bucket + path prefix + declared MIME + byte size; generate safe object path; never trust original filename.
- Persist `media_assets` only after upload result; reconcile partial failures; audit.

## Type policy
Allow `image/jpeg|png|webp|avif` and `application/pdf` (size-limited). **SVG disallowed by default** (only after a sanitization strategy). No executables. Large video via external provider or resumable upload with quota.

## Delivery
Private objects via short-lived signed URLs. `public_url` is not authority for private objects. Deletion is reference-aware.
