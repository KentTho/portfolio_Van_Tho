# ROADMAP — portfolio_Van_Tho

> Living master status. Updated at the end of every Wave. For contribution rules see
> [`CLAUDE.md`](CLAUDE.md); for machine state see [`docs/ai/`](docs/ai/).
>
> **Cập nhật lần cuối (2026-08-16):** ✅ **`V1_MAIN_MERGED_AND_POST_MERGE_VERIFIED` — V1 CLOSED, Production LIVE.**
> `main` @ **`feeb0bd`** (PR #6 CV-driven single-landing merged `30b1184` → PR #7 docs reconcile `feeb0bd`).
> **Vercel Production LIVE:** `https://portfolio-van-tho.vercel.app` (Git-integration deploy on push to `main`;
> `…-git-main…` alias). Runtime smoke: `/vi` `/en` 200 · 6 anchor live (`#home #about #projects #career #skills
> #contact`) · nội dung thật (Hà Văn Thọ · NTTU · Expense Tracker) · admin deny (404/307) · no phone. CI on
> `main` GREEN. Ruleset `protect-main` required check corrected `CI / quality` → `quality`. Real CV content
> ingested vào Neon **Development** qua Admin UI (profile · Education NTTU · 15 skills/6 groups · 6 technologies
> · published Expense Tracker); Experience intentionally absent (`PENDING_OWNER_EXPERIENCE_DETAILS`); public-safe
> resume pending. DB: ledger = 6, 25 bảng (KHÔNG migration mới trong V1 finalize). **Next candidate:**
> `V2_PUBLIC_VISUAL_ENHANCEMENT` (không tự khởi động; UI authority = `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md`).
>
> **✅ Owner-decided — `PRODUCTION_DATABASE_ISOLATION = APPROVED_PLANNED_NOT_EXECUTED`** (thay cho STOP cũ).
> Current classification: `PRODUCTION_DATABASE_TARGET = SAME_AS_DEVELOPMENT` (bằng chứng hành vi secret-safe:
> Production render đúng các hàng chỉ từng ghi vào Neon Development; Vercel có một binding `DATABASE_URL` dùng
> chung `Production, Preview`). **Kiến trúc mục tiêu:** Neon Production **riêng** cho Vercel Production, cô lập
> khỏi Development/Preview. Đây là **infrastructure task nhỏ, có kế hoạch** (chưa thực hiện — không tạo DB,
> không migration, không copy data, không đổi `DATABASE_URL`/Vercel env trong prompt này). Xem row
> **"INFRA-DB-ISO"** ở §2 và runbook trong HANDOFF.
>
> **[HISTORICAL — pre-V1, superseded]** Wave 04 Phase 2 Single Landing (Development-verified), nhánh
> `feat/wave-04-phase-2-public-visual-redesign` @ `a151bf1`: `/vi` `/en` hợp nhất một Landing/locale; consolidated
> routes → `/#anchor`; detail routes giữ; FULL_LIVE_NEON. Khi đó `AUTHENTICATED_BROWSER_E2E`/`PREVIEW` =
> PENDING_OPERATOR, `FRONTEND_REDESIGN` = IN_PROGRESS — **tất cả đã đóng ở V1**.
>
> **📍 Báo cáo & tài liệu nằm ở đâu (đọc mục này trước):** xem **[`docs/ai/REPORTS_INDEX.md`](docs/ai/REPORTS_INDEX.md)**
> — bản đồ mọi file báo cáo/tiến độ. Hiểu toàn hệ thống + luồng xử lý: **[`docs/architecture/PROJECT_UNDERSTANDING.md`](docs/architecture/PROJECT_UNDERSTANDING.md)**
> (knowledge map) + **[`docs/architecture/SYSTEM_MAP.md`](docs/architecture/SYSTEM_MAP.md)** (ERD + infra/data/BE flows).

> **Future architecture item (Owner-mandated, deferred — NOT in Prompt 12R):**
> `PROFILE_AND_PUBLIC_IDENTITY_DOMAIN_EXPANSION` — add CMS-managed profile summary/headline,
> social-links, and (if needed) awards via a dedicated migration wave (ports/use-cases/repos/Admin
> CRUD/public read model/tests/arch). Proven domain gaps: `SUMMARY_DOMAIN_GAP`, `SOCIAL_LINKS_DOMAIN_GAP`,
> `AWARDS_DOMAIN_GAP` (see HANDOFF). RC uses temporary SITE/config fallback; before Production decide
> CMS-authority vs SITE/config-authority. No migration now (invariant 25 tables / ledger=6).

## 1. Snapshot (branch/integration state — machine-precise)

| Field | Value |
|---|---|
| Repository | `github.com/KentTho/portfolio_Van_Tho` (public) |
| `PRODUCTION_BRANCH` | `main` @ **`feeb0bd`** — **V1 merged + Production-deployed** (PR #6 `30b1184` → PR #7 docs `feeb0bd`) |
| `ACTIVE_DEVELOPMENT_BRANCH` | **none** — V1 CLOSED. `feat/wave-04-phase-2-public-visual-redesign` merged & retired. Next candidate `V2_PUBLIC_VISUAL_ENHANCEMENT` (not started). |
| `CURRENT_HEAD` | `main` @ **`feeb0bd`** (local == remote) |
| `V1_STATUS` | ✅ **`V1_MAIN_MERGED_AND_POST_MERGE_VERIFIED`** — merged, Production live, post-merge smoke green |
| `PRODUCTION_STATUS` | ✅ **LIVE** — `https://portfolio-van-tho.vercel.app` (Vercel Git-integration on push to `main`; `…-git-main…` alias). `/vi` `/en` 200; 6 anchor + real content; admin deny; no phone |
| `PRODUCTION_DATABASE_TARGET` | ⚠️ **`SAME_AS_DEVELOPMENT`** (secret-safe behavioral proof). Owner-decided: **`PRODUCTION_DATABASE_ISOLATION = APPROVED_PLANNED_NOT_EXECUTED`** — tách Neon Production riêng là infra task đã duyệt, chưa thực hiện (no DB create/migration/copy/env-change now) |
| `PUBLIC_ARCHITECTURE` | ✅ **SIX_BLOCK_RECRUITER_FIRST_LANDING** — `/vi` `/en` = one landing/locale (`#home #about #projects #career #skills #contact`, locale-aware scroll-spy); consolidated `/about /projects /articles /resume /contact` → `/#anchor`; `/projects/[slug]` + `/articles/[slug]` preserved; FULL_LIVE_NEON (no fixture fallback). Focus/Principles/Articles removed from landing (article domain + detail route retained). |
| `PUBLIC_CONTENT_STATE` | ✅ **POPULATED (real CV)** — profile (Hà Văn Thọ) · Education NTTU · 15 skills/6 groups · 6 technologies · published Expense Tracker. Experience intentionally absent (`PENDING_OWNER_EXPERIENCE_DETAILS`). Populated visual QA PASS. |
| `MAIN_INTEGRATION_STATUS` | **INTEGRATED + V1 MERGED** — `main` @ `feeb0bd` contains validated feature HEAD `b367d1d` |
| `CI_STATUS` | **GREEN on `main` @ `feeb0bd`** (GitHub Actions `CI / quality`) |
| `AUTH_STATUS` | ✅ **`OWNER_ADMIN_DEV_AUTH_VERIFIED` + `AUTHENTICATED_ADMIN_SESSION_VERIFIED`** — GitHub OAuth; `bootstrapOwnerAdmin` provisioned 1 `app_users` = owner_admin/active; authed Playwright storageState (`tests/.auth/owner.json`) drives Admin |
| `ADMIN_STATUS` | ✅ functional control plane (15 areas) — Server Action → use-case → repo (UI never touches Drizzle; arch 10/10) |
| `PUBLIC_NEON_STATUS` | ✅ **LIVE** — `NeonPortfolioRepository` = single runtime authority; no fixture runtime fallback; on-demand render keeps build secret-free |
| `PUBLIC_BROWSER_E2E_STATUS` | ✅ **VERIFIED_7_OF_7** (headless chromium, live Neon: 6-block sections present, consolidated-route redirects reach anchors, no admin/draft/archive leak, anon `/admin`→login, locale redirect) |
| `AUTHENTICATED_BROWSER_E2E_STATUS` | ✅ **VERIFIED** — `admin-allow.authed.spec.ts` PASS via local storageState (`pnpm e2e:auth-setup` done; run authed `--no-deps`) |
| `PREVIEW_STATUS` | ✅ **VERIFIED** — Vercel Preview built green on PR #6 head (fresh redeploy after transient font flake) |
| `FRONTEND_REDESIGN_STATUS` | ✅ **V1 DELIVERED** — brand visual system (logo palette blue+gold, `vantho.png` hero, premium motion: cursor halo/kinetic type/magnetic CTA/pointer-tilt/intro) shipped to Production. Next candidate `V2_PUBLIC_VISUAL_ENHANCEMENT` (per-section enhancement, not started). |
| Stack | Next.js 16 · React 19 · TypeScript 5 (strict) · Tailwind v4 · pnpm · Neon · Supabase Auth/Storage · Vercel · Cloudflare DNS+Turnstile |
| Architecture | Feature-first modular monolith + Clean Architecture |
| Deploy authority | Vercel Git Integration · CI authority: GitHub Actions (minimal gate pulled forward from Wave 07) |

> **Honesty note (post-V1):** V1 is **Production-LIVE** and post-merge-verified — but "Production live" is
> **not** the 100% ceiling. Per the progress scale, 100% requires production proven **with monitoring +
> rollback + observability**, none of which are yet in place (Wave 07/10, Owner-deferred). So V1 the
> *product scope* is CLOSED, while the *long-term platform* stays below 100%. No prod-DB **mutation** was
> performed to author content (real content was ingested into the development database only). Production-DB
> isolation is Owner-decided: `PRODUCTION_DATABASE_ISOLATION = APPROVED_PLANNED_NOT_EXECUTED` (planned infra task).

## 2. Wave status

| Wave | Scope | Status | Evidence |
|---|---|---|---|
| 00 Audit | Read-only forensic | ✅ Done | greenfield verified |
| 01 Architecture & Governance | CLAUDE.md, ADRs, threat model, data model, docs | ✅ Landed `main` (now `cf613ec`) | 38 files |
| 02 Foundation | Next.js app, strict TS, tokens, env validation, arch enforcement, skeletons | ✅ `FOUNDATION_LOCAL_PASS` `711e13f` | typecheck/lint/test/build green |
| 02B Skill intake & reconciliation | 3 README audit, selective adoption, env verify, arch-test strengthen, ROADMAP | ✅ `a6d2a0d` | see `docs/skills/` |
| 03 Data/Auth/Storage | Neon+Drizzle schema/migrations, Supabase SSR Auth (GitHub OAuth) + admin authz, storage policies, repos, audit, middleware | ✅ `DATA_AUTH_LOCAL_PASS` (target proof pending) | schema+migration generated offline; auth policy unit-proven |
| 03R Integration & target proof | Consolidate 02/02B/03→main behind minimal CI; storage authority correction (server-mediated); DB content-gap matrix; progress matrices | ✅ merged to `main` | 35/35 tests; server-mediated storage |
| 03S Main-integration & dev-target completion | Create+merge PR #1/#2/#3 in order; CI green on `main`; build-secret fix; Neon **dev** migration + DB smoke; **storage buckets + signed-upload smoke** | ✅ **`PRE_FE_FOUNDATION_TARGET_VERIFIED_EXCEPT_PREVIEW`** (auth sign-in interactive-pending) | CI `30601997949`; 8 tables + ledger; buckets live |
| 04 Public experience | i18n (vi/en) shell, Home (hero + tech matrix), projects/articles/about/resume/contact, SEO, motion, cosmic design system | ✅ Phase 1 (`94f547e`) — **integrated + wired to live Neon** (`NeonPortfolioRepository`, single runtime authority); **public E2E 9/9**. Phase 2 visual redesign deferred until foundation gate closed | live-wired; on-demand render; secret-free build |
| 05 CMS foundation (DB/BE + Admin) | shared taxonomy → projects → articles → career → revisions; write-side; Neon public read model; **Admin Functional CMS**; live owner auth | ✅ **Foundation + Admin control plane verified** — `BACKEND_APPLICATION_FOUNDATION_DEV_VERIFIED` + Admin CMS (15 areas) + **live `owner_admin` auth verified** on Neon Dev (ledger=6, 25 tables, 6 live smoke). Contact backend HOÃN (Wave 06). | `e7f8e02` → integrated |
| **06A Non-visual integration foundation** | contact **write boundary** + Turnstile **server** verify + rate limiting + email provider adapter + error-tracking foundation | 🔓 **NEXT (PRE_REDESIGN_SAFE)** | pure backend/boundary; no UI redesign needed |
| 06B Visual/product integration | contact **form UX**, video embeds, analytics surface | 🔒 POST_REDESIGN_REQUIRED | depends on redesigned public UI |
| **07A Dev/Preview delivery closure** | env contract doc, Vercel **Preview** pipeline, Neon **preview-branch-per-PR**, migration-check workflow, runbook | 🔓 **PRE_REDESIGN_SAFE** (partly operator) | CI already pulled forward (03R/03S) |
| 07 CI/CD (base) | GitHub Actions quality gate | ✅ **ALREADY_PULLED_FORWARD** (green on `main`) | Actions `30601997949` |
| **08A Pre-UI security/backend hardening** | authz/security tests, secret-scan, dependency audit, server hardening, integration/e2e depth | 🔓 **PRE_REDESIGN_SAFE** | backend-facing; independent of visuals |
| 08B Visual/a11y/perf hardening | a11y, Lighthouse/perf, cross-browser, visual regression | 🔒 POST_REDESIGN_REQUIRED | must follow redesign |
| **04 Phase 2 — Public visual redesign (V1)** | CV-driven 6-block premium landing on live data | ✅ **DONE — merged + Production-live** (`V1_MAIN_MERGED_AND_POST_MERGE_VERIFIED`) | PR #6 `30b1184`; Production `portfolio-van-tho.vercel.app` |
| 09 Land & remote | consolidate feature → `main` via PR | ✅ **DONE** — PR #6 + PR #7 merged to `main` @ `feeb0bd` | repo-approved merge, ruleset check corrected |
| 10 Deployment readiness | prod runbook, preview/migration/rollback proof, **monitoring + observability** | 🔒 **PARTIAL** — Vercel Production deploy LIVE, but monitoring/rollback/observability NOT yet proven (Owner-deferred) | needs Wave 07/10 platform work |
| **V2 Public visual enhancement** | per-section visual enhancement of the 6 blocks (Hero/About/Projects/Career/Skills/Contact) on live data | 🚧 **IN PROGRESS** — Hero+Menu+About + **Career MERGED** to `main` `16878f5` (Production live); **Contact+Footer** done (branch `feat/v2-contact-footer-enhancement`, conversion-first + copy-email state machine + Back-to-Top + hydration hardening, **not merged** — Owner review). Projects/Skills pending. | UI authority `PUBLIC_LANDING_DESIGN_MAP.md`; refs `docs/image_demo_portfolio/*` + `HEROAUDIT`/`Menu_audit`/`ABOUT01audit`/`EXPERIENCE_EDUCATIONaudit`/`CONTACTFOOTER01audit` |
| **INFRA-DB-ISO — Production DB isolation** | tách Neon Production riêng cho Vercel Production (cô lập khỏi Dev/Preview) | 🔓 **APPROVED_PLANNED_NOT_EXECUTED** (Owner-decided) — infra task nhỏ, chưa chạy | runbook ↓ ; no execution in this prompt |

**INFRA-DB-ISO runbook (Owner-mandated, khi thực hiện — KHÔNG làm bây giờ):** `VERIFY CURRENT TARGET → BACKUP/RECOVERY PLAN → CREATE PRODUCTION TARGET → APPLY EXISTING FORWARD MIGRATIONS → TRANSFER ONLY REQUIRED REAL CONTENT → VERIFY DATA → CHANGE PRODUCTION ENV ONLY → DEPLOY → SMOKE → ROLLBACK IF FAILURE.` Bất biến: **không mất/ghi đè dữ liệu V1 hiện tại**; forward-only migration; không đổi `DATABASE_URL`/Vercel env cho tới bước "CHANGE PRODUCTION ENV ONLY"; mỗi bước có bằng chứng.

## 3. Capability levels (L0–L7)

| Capability | Level |
|---|---|
| Application foundation · Design system · Architecture enforcement | **L3** (offline proven, on `main`) |
| Admin authorization policy | **L3** (unit-proven, pure) |
| Media upload authorization (server-mediated) | **L3** (unit-proven) + **live storage L4** (buckets + signed-upload smoke on dev Supabase) |
| Database (Neon **development**) | **L4** — full Wave-05 contract: ledger=6, **25 tables** + indexes, FK cascade/restrict/setnull, locale checks, optimistic concurrency + atomic batched-tx + published-only reads all live-verified; fixtures clean |
| Backend content application (Neon **development**) | **L4** — tags/technologies/projects/articles/career/profile/skills/site-settings/revisions + Public Read Model; deny-by-default authz, Zod biên, atomic batch-tx, row_version, audit, published/visible-only; 6 live smoke xanh trên Neon Dev |
| Storage (Supabase **development**) | **L4** — `portfolio-public`/`portfolio-private` created; signed upload + private signed read smoke pass |
| Auth (Supabase GitHub OAuth) | **L4** — live GitHub OAuth verified; 1 `owner_admin`/active provisioned; authenticated admin session drives Admin (storageState); negative chain unit-proven |
| CI | **L4** — green on `main` @ `feeb0bd` (GitHub Actions `CI / quality`) |
| Preview | **L4** — Vercel Preview built green on PR head |
| Production | **L5** — Vercel Production LIVE + post-merge runtime smoke green. **NOT yet L6/L7** — monitoring/rollback/observability unproven (Owner-deferred) |

## 4. Owner-confirmed decisions

Next.js modular monolith · Neon single primary DB · Supabase Auth (GitHub OAuth) + Storage · Vercel CD · Cloudflare DNS-only + Turnstile · bilingual vi/en (default vi) · per-Wave feature branch + PR, AI never auto-merges. Full log: [`docs/ai/DECISION_LOG.md`](docs/ai/DECISION_LOG.md).

## 5. Environment status (names only, no values)

- `.env.local`: present, **gitignored, untracked** (safe). Verify anytime with `pnpm check:env`.
- Wave 03 keys (Neon `DATABASE_URL`/`_UNPOOLED`, Supabase URL/publishable/secret): **PRESENT + connectivity-verified** for Neon dev DB and Supabase Storage this phase (`DATABASE_URL_UNPOOLED` was normalized from a `psql '...'` paste). Supabase Auth sign-in not yet exercised.
- Turnstile keys: PRESENT. Email (`RESEND_API_KEY`/`CONTACT_TO_EMAIL`) + Sentry: partial/`PENDING_OPERATOR` → needed at Wave 06 (email) / when observability enabled.

## 6. Wave 03 — delivered (this phase)

Feature-first (numbered `src/1_domain` rejected per ADR-0001). Landed on `feat/wave-03-data-auth-storage`:
- 6 deps installed (drizzle-orm, @neondatabase/serverless, @supabase/ssr, @supabase/supabase-js, lucide-react, server-only) + drizzle-kit.
- Neon Drizzle schema (8 tables) under `src/infrastructure/database/schema/**` + client (neon-http, `server-only`) + **migration generated offline** (`0000_*.sql`). `pnpm db:migrate` is human-approved, not run.
- Supabase SSR clients (server/browser/middleware) + service storage client + bucket policy SQL.
- Identity module (feature-first): domain/application (ports, pure `admin-access-policy`, `RequireAdmin`) / infrastructure (Supabase auth adapter, Drizzle app-user repo) + composition root `src/composition/identity.ts`.
- `middleware.ts` (session refresh + /admin gate) + `/admin-login`, `/auth/callback`, `/auth/error`; admin layout enforces authorization.
- `env.server.ts` (server-only secrets) split from public env; `permissions.ts`; audit writer.
- Validation green: typecheck/lint/test(17)/arch(6)/build.

### Target proof PENDING (needs Owner go)
Live Neon migration apply, Supabase GitHub OAuth end-to-end sign-in, storage bucket/policy creation, seeding an owner `app_users` row. Presence of keys ≠ connectivity.

## 7. Wave 03R — integration & hardening (this phase)

Foundation-first: **no Public UI in this phase**. Delivered locally on `feat/wave-03-data-auth-storage`:
- **Storage authority correction** → `SERVER_MEDIATED_STORAGE_AUTHORIZATION`. Removed the undefined
  `is_owner_admin()` Postgres helper; Neon remains the sole role authority. New `src/modules/media/**`
  (pure upload policy → use-case requiring admin + `media.write` → server-only Supabase signed-upload
  adapter → composition root → `POST /api/media/upload-url`). SVG disallowed; MIME/size/path validated;
  object names generated; service key server-only. See `docs/status/DB_CONTENT_GAP_MATRIX.md`.
- **Minimal CI gate** pulled forward from Wave 07 → `.github/workflows/ci.yml` on branch
  `ci/wave-03r-baseline-gate` (lint/typecheck/test/arch/build + tracked-env + secret checks).
- **Progress matrices**: `docs/status/FEATURE_PROGRESS_MATRIX.md`, `docs/status/STACK_PROGRESS.md`.
- Validation: typecheck ✅ · lint ✅ · **test 35/35** ✅ · build ✅.

## 8. Wave 03S — main integration & dev-target completion (this phase)

- **Merged to `main` in order (merge commits, `gh` write-authenticated):** PR #1 `ci` (CI green 5s),
  PR #2 Wave 02 (CI green 41s), PR #3 Wave 03 (CI green 49s after fix). `main` @ `cf613ec`, CI run
  `30601997949` green. Local validation on merged `main`: lint/typecheck/**test 35/35**/arch 10/10/build.
- **Self-heal (build fix, PR #3):** `next build` collected page data by importing route modules, and
  eager `serverEnv`/`neon()` init made the build require real secrets → CI build failed. Fixed by lazy,
  memoized env validation (`serverEnv` proxy, `getAdminAllowedEmails()`), lazy `getDb()`, and
  `dynamic = "force-dynamic"` on the admin layout. Reproduced the secret-free build locally before push.
  No strictness weakened. (Commit `833ed64`.)
- **Neon development target — VERIFIED:** classified by DB state (empty greenfield, 0 tables) + Neon host,
  not by variable name. Normalized a malformed `psql '...'`-wrapped connection string in `.env.local`
  (no values printed). Applied additive-only migration → ledger = 1, **8 kernel tables** + 18 indexes;
  read/write + unique-constraint smoke pass; DB left clean.
- **Supabase storage — VERIFIED (dev):** created `portfolio-public` (public) + `portfolio-private`
  (private); signed upload issued → uploaded → confirmed; private short-lived signed read; self-cleaned.
- **Auth sign-in — PENDING (interactive):** Supabase project has **0 users**; the owner `app_users`
  row cannot be seeded from a real UID until the Owner completes the GitHub OAuth sign-in through the app.
  No UID was fabricated.
- **Security:** one credential appeared in a local driver error before normalization → **rotate the Neon
  password** as a precaution. No secret entered VCS/CI.

## 9. Next step (Wave 04, unblocked) — Public experience
`main` is integrated + CI-green + dev-target-verified, so Wave 04 is unblocked: public pages
(`/[locale]`, about, projects + case study, articles, resume, contact UI), i18n (vi/en), SEO
metadata/sitemap/robots, accessibility, responsive. Read published data via repositories/ports (typed
mocks until content exists). Verdict target: `PUBLIC_EXPERIENCE_LOCAL_PASS`. Branch
`feat/wave-04-public-portfolio` **from verified `main`**. Not started in this phase (foundation-first).

## 10. Standing guardrails

Exact-path staging · no force/rewrite · no auto-merge · no prod/DNS mutation · no secret in VCS/logs · preview ≠ prod secrets · capability levels advance one step · no fabricated content/metrics · verify latest **stable** versions at install time.
