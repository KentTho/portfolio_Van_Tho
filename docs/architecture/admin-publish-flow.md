# Admin publish flow

## States
`draft → review → published → archived` (+ `unpublish` returns to draft/review).

## Publish sequence
```
Admin edits draft (autosave) → RequestReview (optional)
→ PublishProject use-case:
   1. authorize (owner_admin, active)
   2. validate invariants (≥1 translation, required fields, valid slug)
   3. write content_revision snapshot (pre-change)
   4. set status=published, published_at, updated_by  (transaction)
   5. audit_log append
   6. revalidate public cache tags/paths for this entity
```

## Preview
`/admin/projects/[id]/preview` renders the draft using the same view model as public, but behind admin authorization and `no-store`. Drafts are never cached as public content and never returned by public repositories.

## Revision / restore
`content_revisions` stores a JSON snapshot per change. `RestoreProjectRevision` writes a new revision (never rewrites history) then applies the snapshot in a transaction, then revalidates.

## Cache
Public pages use tag/path revalidation triggered on publish/unpublish. Admin session must never leak into a cached public response.
