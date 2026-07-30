# Data model (Neon PostgreSQL)

Conventions: UUID primary keys, `timestamptz`, `created_at`/`updated_at`, explicit enums or checked text, FKs within Neon only, `row_version` for optimistic concurrency where noted. No cross-DB FK to Supabase Auth.

## Enums
- `app_role`: `owner_admin | editor | viewer`
- `user_status`: `active | suspended | disabled`
- `project_status`: `draft | review | published | archived`
- `project_visibility`: `public | unlisted | private`
- section types, media roles, link types: checked text / lookup.

## Tables (summary)
| Table | Purpose / key columns |
|---|---|
| `app_users` | admin identity map: `supabase_auth_user_id` (unique), `email` (unique), `role`, `status`, `credentials_revoked_at`, `last_login_at`, `row_version` |
| `profiles` | singleton profile; media refs; `default_locale` |
| `profile_translations` | PK(`profile_id`,`locale`); bios, positioning |
| `social_links` | provider/url, `is_public`, order |
| `projects` | `slug` unique, `status`, `visibility`, `featured`, links, media refs, `published_at`, audit cols, `deleted_at`, `row_version` |
| `project_translations` | PK(`project_id`,`locale`); title, summaries, SEO |
| `project_sections` + `_translations` | typed sections, ordering, per-locale body markdown |
| `technologies`, `project_technologies` | tech catalog + join with usage/order |
| `project_links`, `project_metrics` | typed links; verifiable metrics (`verified`, `evidence_url`, `measured_at`) |
| `media_assets`, `project_media` | storage metadata + join with `media_role` |
| `skills` | category, optional proficiency, evidence, order |
| `experiences` + `_translations`, `education`, `certifications` | career/academic history |
| `articles` + `article_translations`, `tags`, `article_tags` | technical writing |
| `contact_messages` | name/email/message, `turnstile_verified`, `ip_hash`, `email_delivery_status`, status timestamps |
| `content_revisions` | snapshot per entity for restore |
| `audit_logs` | append-only admin/security activity; sanitized metadata |
| `site_settings` | key/value_json, `is_public` |

## Required indexes
`projects(slug)` unique · `projects(status,published_at)` · `projects(featured,featured_order)` · `project_sections(project_id,display_order)` · `technologies(slug)` unique · `articles(slug)` unique · `articles(status,published_at)` · `contact_messages(status,created_at)` · `audit_logs(actor_user_id,created_at)` · `content_revisions(entity_type,entity_id,revision_number)` · `media_assets(bucket,object_path)` unique · `app_users(supabase_auth_user_id)` unique.

## Invariants
- Published project must have ≥1 translation; featured must be published to appear publicly.
- Public repositories never return draft/unlisted/private rows.
- Slugs normalized; hard delete restricted; media deletion is reference-aware.
- A revision is written before a destructive content update.
- Multi-table admin writes run in a transaction.

## Privacy
Do not store raw IP longer than necessary (`ip_hash`). Never log full contact message body or private media URLs.
