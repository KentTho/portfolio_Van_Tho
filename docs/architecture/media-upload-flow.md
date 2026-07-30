# Media upload flow

Storage: **Supabase Storage**. Buckets: `portfolio-public` (public read / admin write), `portfolio-private` (signed URL only), optional `portfolio-video-clips`.

## Signed upload sequence
```
Admin → POST /api/media/upload-request
   1. verify admin session + role (server)
   2. validate requested bucket + path prefix
   3. validate declared MIME + byte size against allow-list/limits
   4. generate safe object path (do NOT trust original filename)
   5. issue signed upload URL
→ client uploads bytes directly to Supabase Storage
→ Admin → POST /api/media/upload-confirm
   6. verify upload result; persist media_assets row (upload_status)
   7. reconcile partial failure; audit
```

## Validation
Images: `image/jpeg|png|webp|avif`. Documents: `application/pdf` (résumé/certificates) with size limit. **SVG disallowed by default** (only after a sanitization strategy). No executables. Video prefers external provider; large uploads need resumable upload + quota + delivery strategy before being accepted.

## Delivery & deletion
Private objects served via short-lived signed URLs — `public_url` is not authority for private objects. Deletion is reference-aware: check `project_media`/other references before removing; `DeleteUnreferencedMedia` targets orphans only. Service key never reaches the browser.
