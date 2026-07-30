# Database content-gap matrix (read-only audit)

> Wave 03R audit. The Wave 03 schema is an intentional **kernel** (8 tables), not the
> full CMS schema. This matrix records what future modules need and **when**. No tables
> are fabricated here; expansion is owned by the Waves below. No fake data is added.

## Current kernel (Wave 03, shipped)
`app_users`, `profiles`, `projects`, `media_assets`, `skills`, `contact_messages`,
`audit_logs`, `site_settings` — see `src/infrastructure/database/schema/**`.

## Default decision
- **Do NOT expand all tables in Wave 03R.** Wave 04 (public experience) reads through
  **typed mock repositories** that satisfy the domain ports and mirror the Drizzle row
  shapes — so the public UI can be built and tested before persistence exists.
- **Wave 05 owns CMS persistence expansion** (real writes, revisions, translations).
- Add a table *now* only if Wave 04 cannot satisfy a port contract without it → none qualify.

## Gap matrix

| Table | REQUIRED_FOR_WAVE | CURRENT_STATUS | ADD_NOW / DEFER | REASON | MIGRATION_OWNER | TEST_REQUIRED |
|---|---|---|---|---|---|---|
| `project_translations` | 04 (read) / 05 (write) | absent | **DEFER → 05** | Wave 04 mock repo returns localized DTOs; vi/en handled in view layer until CMS persists | Wave 05 | repo contract + locale fallback |
| `project_sections` | 05 | absent | DEFER → 05 | Case-study body is authored content; mock fixtures suffice for 04 | Wave 05 | ordering + publish scope |
| `project_section_translations` | 05 | absent | DEFER → 05 | Follows `project_sections` | Wave 05 | locale fallback |
| `technologies` | 04 (read) / 05 | absent | DEFER → 05 | `skills` kernel + mock tech badges cover 04 display | Wave 05 | dedupe/slug uniqueness |
| `project_technologies` | 05 | absent | DEFER → 05 | Join table only needed once tech is persisted | Wave 05 | FK integrity |
| `project_media` | 05 | absent (`media_assets` kernel exists) | DEFER → 05 | Media↔project linking is a CMS write concern | Wave 05 | reference-aware delete |
| `project_links` | 04 (read) / 05 | absent | DEFER → 05 | GitHub/demo links come from mock DTO for 04 | Wave 05 | URL validation |
| `project_metrics` | 05 | absent | DEFER → 05 | **No fabricated metrics** — real metrics only when authored | Wave 05 | no-fabrication guard |
| `experiences` | 04 (read) / 05 | absent | DEFER → 05 | Timeline rendered from mock DTO for 04 | Wave 05 | date ordering |
| `experience_translations` | 05 | absent | DEFER → 05 | Follows `experiences` | Wave 05 | locale fallback |
| `education` | 05 | absent | DEFER → 05 | Not on the Wave 04 critical path | Wave 05 | — |
| `certifications` | 05 | absent | DEFER → 05 | Not on the Wave 04 critical path | Wave 05 | evidence link |
| `articles` | 04 (read) / 05 | absent | DEFER → 05 | Wave 04 renders MDX/mock articles; publish scope enforced in port | Wave 05 | draft never public |
| `article_translations` | 05 | absent | DEFER → 05 | Follows `articles` | Wave 05 | locale fallback |
| `tags` | 05 | absent | DEFER → 05 | Taxonomy is a CMS concern | Wave 05 | slug uniqueness |
| `article_tags` | 05 | absent | DEFER → 05 | Join table | Wave 05 | FK integrity |
| `content_revisions` | 05 | absent | DEFER → 05 | Revision history is a write-side feature | Wave 05 | immutable append |

## Consequence for Wave 04
Wave 04 defines **domain ports** (e.g. `ProjectReadPort`, `ArticleReadPort`) and **typed mock
repositories** aligned to the kernel + planned columns above. Public repositories must never
return draft/private rows (CLAUDE.md §11). When Wave 05 persists these tables, the mock
implementations are swapped for Drizzle implementations behind the same ports — zero UI change.
