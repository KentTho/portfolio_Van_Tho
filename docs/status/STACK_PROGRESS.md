# Stack progress (Wave 03S)

> Scale: `0` absent · `25` source/skeleton · `50` local feature proven · `75` development/preview
> verified · `100` production proven (monitoring + rollback). Documentation is **not** live
> capability; key presence is **not** connectivity; a generated migration is **not** applied
> schema; source middleware is **not** live OAuth; Preview is **not** Production.
>
> **100% is not reachable in this phase by definition** — it requires production with monitoring +
> rollback, which the Owner has explicitly deferred (no prod deploy/DNS/prod-DB this phase). The honest
> ceiling for merged + development-verified foundation is the **75 band**.

## Layer percentages

| Layer | % | Evidence | Unverified gaps | Next unlock |
|---|---|---|---|---|
| **INFRASTRUCTURE** | **55** | All of the below **merged to `main` @ `cf613ec`**; **CI green on `main`** (Actions `30601997949`); env split + `server-only`; secret-free production build proven | no Vercel Preview deployed; no observability; no prod | Deploy Vercel Preview; wire Sentry (Wave 06/07) |
| **DATABASE** | **60** | Neon **development** migration **applied**; ledger = 1; **8 kernel tables** + 18 indexes/constraints verified; read/write + unique-constraint smoke pass; DB left clean | CMS content tables deferred (gap matrix); no preview-branch-per-PR yet; no prod DB | Wave 05 content tables; Wave 07 Neon preview branching |
| **BACKEND** | **60** | Pure domain; admin authz + `RequireAdmin` (unit-proven); **server-mediated media upload** (unit-proven) + **live signed-upload smoke** against dev Supabase; audit writer writes to live dev DB; lazy env/db (build needs no secrets) | live admin session/authz not exercised end-to-end (0 Supabase users); contact/email path (Wave 06) | Interactive OAuth sign-in → owner seed → admin authz smoke |
| **FRONTEND** | **10** | App shell, admin login page, auth error page, admin protected layout (now `force-dynamic`); design tokens | no public pages, i18n, case study, SEO (all Wave 04) | Wave 04 (unblocked; not started this phase) |
| **OVERALL** | **~40** | weighted; foundation merged + dev-target-verified; no production, no preview, no live auth session | production, preview, live OAuth session, live data-driven UI | Preview deploy + interactive OAuth; then Wave 04 |

## Capability level ladder (L0–L7)
- Application foundation / design system / architecture enforcement — **L3** (offline proven, on `main`).
- Admin authorization / media upload authorization — **L3** (unit-proven).
- Database (Neon dev) / Storage (Supabase dev) — **L4** (live development-verified).
- Auth (GitHub OAuth) — **L2** (SSR code + policy proven; live sign-in pending).
- CI — **L4** (green on `main`). Preview / Production — **L0–L1** (authenticated; not deployed / deferred).

## Honesty ledger (what these numbers do NOT claim)
- No live **admin OAuth session** has completed end-to-end (Supabase has 0 users); owner `app_users` row is **not** seeded.
- No **production** or **preview** deployment exists.
- Development-verified ≠ production-ready; monitoring/rollback are Wave 07+.
- A Neon credential appeared in a local driver error before the connection string was normalized → **rotate it**.
