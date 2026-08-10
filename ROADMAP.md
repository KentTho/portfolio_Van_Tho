# ROADMAP — portfolio_Van_Tho

> Living master status. Updated at the end of every Wave. For contribution rules see
> [`CLAUDE.md`](CLAUDE.md); for machine state see [`docs/ai/`](docs/ai/).
>
> **Cập nhật lần cuối:** Wave 05 — **Admin Functional CMS hoàn tất trên Development** (build/typecheck/lint
> xanh) + **Backend Application Foundation ĐÃ XÁC MINH trên Neon Dev**. Nhánh `feat/wave-05-cms-foundation`
> (HEAD `f0fd362`): tầng application backend (tags/technologies/projects/articles/career/profile/skills/
> site-settings/revisions + Public Read Model) + **Admin control plane** đầy đủ (dashboard, profile,
> projects, articles, experience, education, certifications, skills, technologies, tags, settings, audit,
> revisions; media/messages = trang trạng thái trung thực) qua Server Action → use-case → repo (UI không
> chạm Drizzle). **First-login owner provisioning** (allow-list gated) đã wire vào `/auth/callback`.
> Verified: typecheck · lint · **168 test** · 10 architecture · build (37 routes) · 6 live smoke Neon Dev.
> Ledger = 6, 25 bảng (KHÔNG migration mới). **Auth session trực tiếp = PENDING_OPERATOR** (host Supabase
> không reachable từ môi trường này). **Preview = PENDING_OPERATOR**. Giai đoạn kế: `FRONTEND_REDESIGN`
> (vẫn KHOÁ đến khi operator xác nhận auth+preview). Sơ đồ toàn dự án: [`docs/architecture/SYSTEM_MAP.md`](docs/architecture/SYSTEM_MAP.md).

## 1. Snapshot (branch/integration state — machine-precise)

| Field | Value |
|---|---|
| Repository | `github.com/KentTho/portfolio_Van_Tho` (public) |
| `PRODUCTION_BRANCH` | `main` @ `cf613ec` — **application-integrated** (Wave 01+02+02B+03+03R + CI + build fix) |
| `ACTIVE_DEVELOPMENT_BRANCH` | `feat/wave-05-cms-foundation` @ `f0fd362` (backend application + Admin CMS đã verified offline; local == remote) |
| `MAIN_INTEGRATION_STATUS` | **INTEGRATED** — PR #1 (CI), #2 (Wave 02), #3 (Wave 03) merged in order (merge commits) |
| `MAIN_SHA` | `cf613ec3ea8e11573a556c5ccbf0ca374b378bf2` |
| `MERGED_PRS` | #1 `ci/wave-03r-baseline-gate`, #2 `feat/wave-02-foundation`, #3 `feat/wave-03-data-auth-storage` |
| `CI_STATUS` | **GREEN on `main`** — Actions run `30601997949` (`quality` job) success @ `cf613ec` |
| `TARGET_PROOF_STATUS` | **DEV_VERIFIED (DB+Storage+Backend+Admin offline); AUTH_PENDING_OPERATOR** — Neon dev + buckets smoke-verified; backend application + Admin CMS verified (typecheck/lint/168 test/build); **owner provisioning code wired** (`bootstrapOwnerAdmin` on `/auth/callback`) nhưng live sign-in chưa chạy được (host Supabase không reachable từ môi trường build → `OWNER_ADMIN_DEV_AUTH = PENDING_OPERATOR`; `app_users` = 0) |
| `PREVIEW_STATUS` | **PENDING_OPERATOR** — Vercel CLI authenticated (`kenttho`); preview deploy needs env propagation + OAuth redirect config |
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
| 04 Public experience | i18n (vi/en) shell, Home (hero + tech matrix), projects/articles/about/resume/contact, SEO, motion, cosmic design system | ✅ Phase 1 (`94f547e`) — **integrated** into `integration/pre-fe-foundation`; visual redesign deferred until foundation gate | 46 tests; SSG both locales |
| 05 CMS foundation (DB/BE + Admin) | shared taxonomy → projects → articles → career → revisions; write-side; Neon public read model; **Admin Functional CMS**; live owner auth | ✅ **Foundation + Admin control plane verified** — `BACKEND_APPLICATION_FOUNDATION_DEV_VERIFIED` + Admin CMS (15 areas) + **live `owner_admin` auth verified** on Neon Dev (ledger=6, 25 tables, 6 live smoke). Contact backend HOÃN (Wave 06). | `e7f8e02` → integrated |
| 06 Integrations | contact, Turnstile, email, video, analytics, error tracking | 🔒 planned | email keys pending |
| 07 CI/CD | GitHub Actions, env contracts, Neon preview branching, runbooks | 🔒 planned | — |
| 08 Hardening | unit/integration/e2e/a11y/security, prod build, preview smoke, scans | 🔒 planned | — |
| 09 Land & remote | consolidation | 🔒 planned | per-wave PR model |
| 10 Deployment readiness | human runbook, preview/migration/rollback proof | 🔒 planned | — |

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
