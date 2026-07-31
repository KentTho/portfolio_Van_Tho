# Stack progress (Wave 03R)

> Scale: `0` absent · `25` source/skeleton · `50` local feature proven · `75` preview/staging
> verified · `100` production proven (monitoring + rollback). Documentation is **not** live
> capability; key presence is **not** connectivity; a generated migration is **not** applied
> schema; source middleware is **not** live OAuth; Preview is **not** Production.

## Layer percentages

| Layer | % | Evidence | Unverified gaps | Next unlock |
|---|---|---|---|---|
| **INFRASTRUCTURE** | **30** | Next 16 app builds; strict TS; ESLint boundaries; Vitest arch tests; env split (`env.ts` / `env.server.ts` + `server-only`); minimal CI **prepared** (`ci/wave-03r-baseline-gate`) | CI not merged/green on `main`; no Vercel project; no Preview; no observability | Merge CI → main; green run; wire Vercel Preview (Wave 07) |
| **DATABASE** | **25** | Drizzle schema (8 kernel tables); migration `0000_*.sql` generated offline; `pnpm db:generate` ✅ | migration **not applied**; no live Neon connectivity proof; CMS tables deferred (see gap matrix) | Operator target proof → `pnpm db:migrate` on Neon **dev** |
| **BACKEND** | **40** | Pure domain (result/entity/errors); admin authorization policy + `RequireAdmin` (unit-proven); **server-mediated media upload** (policy + use-case + route, unit-proven); audit writer; composition roots | live auth/session, live signed upload, repository integration all target-proof pending | Operator target proof (OAuth + buckets) → integration smokes |
| **FRONTEND** | **10** | App shell, admin login page, auth error page, admin protected layout; design tokens | no public pages, no i18n, no case study, no SEO (all Wave 04) | Wave 04 after main-integration |
| **OVERALL** | **~26** | weighted by the above; local foundation strong, no live/prod capability | no production, no preview, no live data path | main-integration + operator target proof |

## Capability level ladder (L0–L7)
- Application foundation / design system / architecture enforcement — **L3** (offline proven).
- Admin authorization policy / media upload authorization — **L3** (pure, unit-proven).
- Database / Auth / Storage integration — **L1–L2** (source + generated migration; live = pending).
- CI / Preview / Production — **L0** (CI prepared, not merged/green).

## Honesty ledger (what these numbers do NOT claim)
- No route is proven against a live database.
- No OAuth sign-in has completed end-to-end.
- No storage bucket exists yet; the signed-upload adapter is unproven live.
- No production or preview deployment exists.
