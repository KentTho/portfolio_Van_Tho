# Stack progress (Wave 04 Phase 2 — Single Landing Architecture, DEV-verified)

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
| **INFRASTRUCTURE** | **70** | `INFRA_DEV_PREVIEW_SUBSTRATE_VERIFIED_WITH_EXTERNAL_GAPS` (Wave 05 MODE A): Git/CI contract, Neon Dev pooled+direct, migration system, env/secret/server-only all verified; secret-free build | Vercel Preview deploy `PENDING_OPERATOR`; Supabase live sign-in / Cloudflare `PENDING_INTERACTIVE`; no prod | Vercel Preview deploy; Sentry (Wave 06/07) |
| **PUBLIC PRESENTATION** | **78** | **SINGLE LANDING per locale** (`/vi` `/en`, anchored sections + scroll-spy) + **brand visual system (Prompt 12)**: logo-derived tokens (blue+gold on black), typography scale, portrait hero (`vantho.png`), motion/orbital, WCAG-AA, admin-regression clean. Sections compose live Neon read model (`NeonPortfolioRepository`, no fixture fallback); consolidated routes → `/#anchor`; detail routes preserved. **Public E2E 7/7** · typecheck/lint/184+6/arch 10/10/secret-free build green. Design map `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md` | real published content pending (Owner authors via Admin — Neon Dev ~0 rows ⇒ production empty states; **populated visual QA after content**); technology authority Neon/Admin only; Preview smoke pending | Owner authors content → authed E2E + Vercel Preview (Prompt 13) |
| **DATABASE** | **75** | `WAVE05_DATABASE_CONTRACT_DEV_VERIFIED`: full Wave-05 contract on Neon **development** — ledger = 6, **25 tables** (G1–G5), FK cascade/restrict/setnull, locale checks, atomic batched-tx + optimistic concurrency + published-only reads live-verified; fixtures clean | no preview-branch-per-PR yet; no prod DB | Backend/admin for articles/career/revisions; Wave 07 Neon preview branching |
| **BACKEND** | **75** | `BACKEND_APPLICATION_FOUNDATION_DEV_VERIFIED`: toàn bộ tầng application nội dung — tags/technologies/projects/articles/career/profile/skills/site-settings/revisions + Public Neon Read Model. Deny-by-default authz, Zod biên, atomic `db.batch`, row_version, audit, published/visible-only; **6 live smoke Neon Dev** (12 test), fixtures sạch; 159 offline + 10 arch + build xanh | live admin **session** chưa chạy end-to-end (Owner đã đăng nhập; app_users seed để lượt Admin); contact backend HOÃN (biên bảo mật Wave 06); Admin UI chưa dựng | Admin Functional CMS → live auth session smoke → Preview |
| **ADMIN (Functional CMS)** | **70** | Control plane đầy đủ trên tầng application (profile/projects/articles/career/skills/technologies/tags/settings/audit/revisions; media+messages=status pages). Server Action→use-case→repo (không chạm Drizzle); mọi state (loading/empty/validation/authz/not-found/success/stale). First-login owner provisioning wired. Offline-verified: typecheck/lint/168 test/build 37 routes | live admin **session** chưa chạy (Supabase host unreachable → PENDING_OPERATOR); links/metrics/sections editor + media attach = nâng cấp sau | Operator OAuth+seed → E2E (Playwright) → redesign |
| **FRONTEND (public)** | **10** | App shell, admin login page, auth error page, admin protected layout (`force-dynamic`); design tokens | no public pages, i18n, case study, SEO (Wave 04/redesign) | `FRONTEND_REDESIGN` sau foundation gate |
| **OVERALL** | **~48** | weighted; foundation + backend application + Admin CMS dev-verified offline; no production, no preview, no live auth session | production, preview, live OAuth session, live data-driven UI | Operator OAuth+preview; then redesign |

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
