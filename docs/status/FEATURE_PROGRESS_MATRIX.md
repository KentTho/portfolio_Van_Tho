# Feature progress matrix (Wave 03R)

> Scale: `0` absent · `25` source/skeleton · `50` local feature proven · `75` preview/staging
> verified · `100` production proven (monitoring + rollback). Each row states where the code
> lives and what is **not** yet verified. No capability is counted from documentation alone.

| Feature | % | Location | Verified | Unverified gap |
|---|---|---|---|---|
| **Public — Home** | 0 | — | — | Wave 04 |
| **Public — Projects / case study** | 0 | — | — | Wave 04 (ports + mock repos) |
| **Public — Articles (MDX)** | 0 | — | — | Wave 04 |
| **Public — Resume** | 0 | — | — | Wave 04 |
| **Public — Contact (UI)** | 0 | — | — | Wave 04 UI; Wave 06 Turnstile/email |
| **i18n (vi/en)** | 0 | — | — | Wave 04 routing |
| **SEO (metadata/sitemap/robots/JSON-LD)** | 0 | — | — | Wave 04 |
| **Accessibility (WCAG 2.2 AA)** | 0 | — | — | Wave 04 + Wave 08 audits |
| **Admin — Auth (GitHub OAuth)** | 40 | `src/modules/identity/**`, `middleware.ts`, `src/app/auth/**`, `src/app/admin-login` | policy unit-proven; SSR clients build | live OAuth sign-in (operator) |
| **Admin — Authorization (deny-by-default)** | 50 | `admin-access-policy.ts`, `RequireAdmin`, admin layout | 7 unit tests; pure decision | live session → app_user resolution |
| **Admin — CMS CRUD** | 0 | — | — | Wave 05 |
| **Media — upload authorization** | 50 | `src/modules/media/**`, `src/app/api/media/upload-url/route.ts`, `src/composition/media.ts` | policy + use-case unit-proven (18 assertions across 2 suites); build ✅ | live signed upload (buckets, operator) |
| **Media — storage policies** | 30 | `supabase/migrations/storage-policies.sql` | server-mediated model documented; `is_owner_admin()` removed | applied in Supabase (operator) |
| **Messages (contact inbox)** | 15 | `contact_messages` schema | table designed | Wave 05/06 |
| **Audit** | 25 | `audit_logs` schema, `audit-writer.ts` | writer compiles | live writes on real mutations |
| **Database (kernel schema)** | 25 | `src/infrastructure/database/**` | 8 tables, migration generated | applied to Neon dev (operator) |
| **Storage (service client)** | 25 | `src/infrastructure/supabase/storage-client.ts` | server-only; single-source bucket names | live buckets (operator) |
| **CI/CD (minimal gate)** | 25 | `.github/workflows/ci.yml` (branch `ci/wave-03r-baseline-gate`) | YAML authored; local gates all green | merged + green on `main` |
| **Preview** | 0 | — | — | Wave 07 (after CI) |
| **Production** | 0 | — | — | out of scope this phase |

## Aggregate (see `STACK_PROGRESS.md` for method)
`FRONTEND ~10 · BACKEND ~40 · DATABASE ~25 · INFRASTRUCTURE ~30 · OVERALL ~26`

## Legend of honesty
Skeleton (25) means code exists and compiles. Local-proven (50) means unit/architecture tests
pass offline. Nothing here is ≥75 because no Preview/Production/live-data path exists yet.
