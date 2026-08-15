# ROADMAP — portfolio_Van_Tho

> Living master status. Updated at the end of every Wave. For contribution rules see
> [`CLAUDE.md`](CLAUDE.md); for machine state see [`docs/ai/`](docs/ai/).
>
> **Cập nhật lần cuối:** Wave 04 Phase 2 — **Single Landing Architecture (Development-verified)**. Nhánh
> **`feat/wave-04-phase-2-public-visual-redesign`** (HEAD **`a151bf1`**, local == remote, remote-safe): `/vi` `/en`
> hợp nhất thành **một Landing Page/locale** (anchored sections `#home…#contact`, locale-aware scroll-spy nav);
> `/about /projects /articles /resume /contact` → `/#anchor`; `/projects/[slug]` + `/articles/[slug]` giữ nguyên.
> **public đọc trực tiếp live Neon** (`NeonPortfolioRepository`, single runtime authority, không fixture fallback);
> Admin/BE/DB/Auth contract **không đổi**. Runtime Recovery (Prompt 10) đã PASS (`.env.local` restored + Neon Dev
> credential rotated). Verified: check:env 18/0 · typecheck · lint · **184 test +6 skip** · 10 architecture ·
> **secret-free build** · **public browser E2E 7/7** · dev smoke (9 anchors + redirects). Ledger = 6, 25 bảng
> (KHÔNG migration). **Còn 2 việc thao tác Owner (release gate):** `AUTHENTICATED_BROWSER_E2E = PENDING_OPERATOR`
> + `PREVIEW = PENDING_OPERATOR`. `FRONTEND_REDESIGN = IN_PROGRESS` (Prompt 12 = brand visual system).
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
| `PRODUCTION_BRANCH` | `main` @ `cf613ec` — **application-integrated** (Wave 01+02+02B+03+03R + CI + build fix) |
| `ACTIVE_DEVELOPMENT_BRANCH` | **`feat/wave-04-phase-2-public-visual-redesign`** @ **`a151bf1`** (redesign checkpoint `473a683` → env governance `14083d1` → single-landing `a151bf1`; local == remote). Foundation `integration/pre-fe-foundation` @ `14a04a6` unchanged. |
| `CURRENT_HEAD` | `3486324` (brand visual system) + docs reconcile on top |
| `PUBLIC_ARCHITECTURE` | ✅ **SINGLE_LANDING_ARCHITECTURE_DEV_VERIFIED** — `/vi` `/en` = one landing/locale (anchored sections `#home…#contact`, locale-aware scroll-spy nav); `/about /projects /articles /resume /contact` → `/#anchor`; `/projects/[slug]` + `/articles/[slug]` preserved; FULL_LIVE_NEON |
| `PUBLIC_VISUAL_SYSTEM` | 🎨 **BRAND_SINGLE_LANDING_VISUAL_SYSTEM_DEV_VERIFIED (empty-state)** — logo-derived tokens (blue+gold on black), typography scale, portrait hero (`vantho.png`), motion/orbital, WCAG-AA. Data-driven sections show production empty states (Neon Dev unpopulated; Owner authors via Admin → populated QA later). Map: `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md` |
| `MAIN_INTEGRATION_STATUS` | **INTEGRATED** — PR #1 (CI), #2 (Wave 02), #3 (Wave 03) merged in order. `main` @ `cf613ec` (integration branch NOT yet merged to main — pre-redesign) |
| `CI_STATUS` | **GREEN on `main`** — Actions run `30601997949` @ `cf613ec` |
| `AUTH_STATUS` | ✅ **`OWNER_ADMIN_DEV_AUTH_VERIFIED`** — Owner completed GitHub OAuth; `bootstrapOwnerAdmin` provisioned **1 `app_users` = owner_admin / active** (Supabase UID linked, masked read-only proof on Neon) |
| `ADMIN_STATUS` | ✅ functional control plane (15 areas) — Server Action → use-case → repo (UI never touches Drizzle; arch 10/10) |
| `PUBLIC_NEON_STATUS` | ✅ **LIVE** — `NeonPortfolioRepository` = single runtime authority; no fixture runtime fallback; on-demand render keeps build secret-free |
| `PUBLIC_BROWSER_E2E_STATUS` | ✅ **VERIFIED_7_OF_7** (headless chromium, live Neon: single-landing sections present, consolidated-route redirects reach anchors, no admin/draft/archive leak, anon `/admin`→login, locale redirect). Suite reshaped from 9/9 for single-landing. |
| `AUTHENTICATED_BROWSER_E2E_STATUS` | ⏳ **PENDING_OPERATOR** — specs ready; needs local storageState via `pnpm e2e:auth-setup` (headed OAuth once) |
| `PREVIEW_STATUS` | ⏳ **PENDING_OPERATOR** — Vercel CLI authed (`kenttho`); needs deploy of `integration/pre-fe-foundation` + Supabase OAuth redirect for the Preview URL |
| `FRONTEND_REDESIGN_STATUS` | 🚧 **IN_PROGRESS** — Wave 04 Phase 2: cosmic redesign checkpoint (`473a683`) + single-landing consolidation (`a151bf1`) DEV-verified. **Next: Prompt 12** brand visual system (logo palette, `vantho.png` hero, all sections, motion, a11y). Release gates (authed E2E + Preview) remain `PENDING_OPERATOR` before main merge. |
| Stack | Next.js 16 · React 19 · TypeScript 5 (strict) · Tailwind v4 · pnpm · Neon · Supabase Auth/Storage · Vercel · Cloudflare DNS+Turnstile |
| Architecture | Feature-first modular monolith + Clean Architecture |
| Deploy authority | Vercel Git Integration · CI authority: GitHub Actions (minimal gate pulled forward from Wave 07) |

> **Honesty note:** "Development-verified" is the ceiling this phase — **not** production. Per the
> progress scale, 100% requires production proven with monitoring + rollback (Wave 07+), which the
> Owner has explicitly **deferred**. No production deploy / DNS / prod-DB mutation was performed.

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
| **04 Phase 2 — Public visual redesign** | cosmic/motion/3D redesign of the live-data public UI | 🔒 BLOCKED_PENDING_FINAL_OPERATOR_PROOF | after authed E2E + Preview |
| 09 Land & remote | consolidate integration → `main` via PR | 🔒 PRODUCTION_ADJACENT (later) | needs RC + green gates |
| 10 Deployment readiness | prod runbook, preview/migration/rollback proof, monitoring | 🔒 PRODUCTION_ONLY (last) | Owner-deferred; needs release candidate |

## 3. Capability levels (L0–L7)

| Capability | Level |
|---|---|
| Application foundation · Design system · Architecture enforcement | **L3** (offline proven, on `main`) |
| Admin authorization policy | **L3** (unit-proven, pure) |
| Media upload authorization (server-mediated) | **L3** (unit-proven) + **live storage L4** (buckets + signed-upload smoke on dev Supabase) |
| Database (Neon **development**) | **L4** — full Wave-05 contract: ledger=6, **25 tables** + indexes, FK cascade/restrict/setnull, locale checks, optimistic concurrency + atomic batched-tx + published-only reads all live-verified; fixtures clean |
| Backend content application (Neon **development**) | **L4** — tags/technologies/projects/articles/career/profile/skills/site-settings/revisions + Public Read Model; deny-by-default authz, Zod biên, atomic batch-tx, row_version, audit, published/visible-only; 6 live smoke xanh trên Neon Dev |
| Storage (Supabase **development**) | **L4** — `portfolio-public`/`portfolio-private` created; signed upload + private signed read smoke pass |
| Auth (Supabase GitHub OAuth) | **L2** — SSR code + policy proven; **live sign-in pending** (0 Supabase users → owner seed + admin authz smoke blocked on interactive OAuth) |
| CI | **L4** — green on `main` (GitHub Actions) |
| Preview · Production | **L0–L1** — Vercel authenticated; preview not deployed; production deliberately deferred |

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
