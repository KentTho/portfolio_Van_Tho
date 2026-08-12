# PROJECT_STATE

> Verified facts only. Updated at the end of each Wave. Session start reads this.

## Baseline (as of Wave 01)

- **Workspace:** `D:\web-app\portfolio` — verified, greenfield (was empty except `.claude/`).
- **Git (local):** repository not yet initialized at Wave 00; Wave 01 bootstraps it.
- **Remote:** `https://github.com/KentTho/portfolio_Van_Tho.git` — verified via `git ls-remote` = **REMOTE_EMPTY** (public, reachable, no refs, unborn). Bootstrap exception applies once.
- **Toolchain (verified):** git 2.45.1.windows.1 · node v22.18.0 · pnpm 10.11.0 · npm 11.6.0 · corepack 0.33.0.
- **Platform:** Windows 11, PowerShell.

## Owner-confirmed decisions

| Topic | Decision |
|---|---|
| Backend topology | Next.js full-stack **modular monolith** (no FastAPI/Django in V1) |
| Locales | **VI + EN**, default **VI** |
| Admin auth | **GitHub OAuth**, public signup OFF, email allow-list |
| Git authority | AI may create/edit in-scope files, branch, commit (exact-path), push feature branches, open PRs, monitor + self-heal CI. **No auto-merge, no force, no prod/DNS mutation.** Empty-repo bootstrap of `main` allowed once. |

Full rationale: `docs/ai/DECISION_LOG.md`.

## Assumed safe-defaults (not yet Owner-confirmed; changeable)

Visitor-only public users · OWNER_ADMIN only (EDITOR schema-ready, UI off) · all CMS modules · external video provider (YouTube/Loom) · Cloudflare DNS-only + Turnstile · Neon preview branch per PR · Vercel Preview URL (no domain yet) · design "inspired not cloned" · contact stored in Neon (+ optional email) · no LICENSE yet.

## Current architecture

Feature-first modular monolith, Clean Architecture layers. Neon = single primary DB. Supabase = Auth + Storage only. Vercel = runtime + CD authority. GitHub Actions = CI authority. See `docs/architecture/`.

## Current machine state (through Wave 04 Phase 2 — Single Landing DEV verified)

- **Active branch:** `feat/wave-04-phase-2-public-visual-redesign` @ `a151bf1` (remote-safe, `LOCAL == REMOTE`). History: `473a683` redesign checkpoint → `14083d1` env governance → `a151bf1` single-landing consolidation. Foundation `integration/pre-fe-foundation` @ `14a04a6` unchanged. Production locked; no prod deploy/migration/DNS.
- **Public architecture:** ✅ **SINGLE LANDING PAGE per locale** (`/vi`, `/en`) with anchored sections (`#home … #contact`) + locale-aware anchor nav (scroll-spy). Former `/about /projects /articles /resume /contact` redirect to `/#anchor`; `/projects/[slug]` + `/articles/[slug]` preserved. Still FULL_LIVE_NEON, no fixture fallback; `#contact` = real email/social (form → Wave 06A). Env: `.env.local` restored + Neon Dev credential rotated (Prompt 10); live fingerprint matches dev baseline.
- **Public visual system (Prompt 12):** ✅ logo-derived brand (electric blue + gold on black) in `tokens.css`/`globals.css` (typography scale, spatial grammar, WCAG-AA); portrait hero (`vantho.png`) + orbital/BlurText motion; `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md` owns the section→file map. **Owner decisions:** robust empty states first (no seed/fabrication); technology authority = Neon/Admin only. Data-driven sections render production empty states until Owner authors content via Admin (Neon Dev: 1 empty profile, 0 published projects/articles/experiences/technologies; `getTechGroups()`→[]).
- **Integration:** ✅ Wave-04 public presentation hợp nhất với foundation Wave-05 (presentation không chồng lấn; middleware auto-combine auth-gate + locale-routing).
- **Public data authority:** ✅ **FULL_LIVE_NEON** — trang công khai đọc trực tiếp live Neon qua `NeonPortfolioRepository` (thin adapter trên public read model đã verified; vi/en zip; section-kind→case-study mapping; **không fixture fallback runtime**; SAMPLE fixtures chỉ còn cho test/tham chiếu). Render on-demand (`force-dynamic` trên `[locale]` layout + sitemap; `[slug]` generateStaticParams→[]) ⇒ **secret-free `pnpm build` vẫn xanh** (không chạm DB lúc build). 5 mapper unit test.
- **E2E (Playwright 1.56.1):** ✅ Public E2E VERIFIED headless trên app thật + live Neon — foundation era 9/9; **hiện 7/7** sau khi suite được reshape hợp lệ cho single-landing (landing sections + consolidated-route redirects). Historically 9/9 headless (load vi/en, no admin-nav/draft/archive leak, anon `/admin`→`/admin-login`, locale redirect). Authenticated specs (admin allow, project/article lifecycle) chờ storageState OAuth headed = **PENDING_OPERATOR**. Validation: **check:env 18/18 · 184 unit +6 skip · 10 arch · secret-free build xanh** · live public read smoke (2) trên Neon Dev.
- **Admin CMS:** ✅ control plane đầy đủ — profile/projects/articles/career/skills/technologies/tags/settings/audit/revisions; media+messages = status pages. UI→Server Action→use-case→repo (không chạm Drizzle). Sơ đồ: `docs/architecture/SYSTEM_MAP.md`.
- **Auth:** ✅ **`OWNER_ADMIN_DEV_AUTH_VERIFIED`** — Owner đã hoàn tất GitHub OAuth; `bootstrapOwnerAdmin` cấp **1 hàng `app_users` = `owner_admin`/`active`**, có Supabase UID + last_login, không revoked (kiểm chứng read-only đã che định danh trên Neon). Negative chain (unauth/unknown/inactive/role → DENY) unit-proven.
- **Open decision:** wiring trang công khai từ fixtures tĩnh (Wave-04) sang **live Neon read model** — đang chờ Owner chọn chiến lược dữ liệu (Neon Dev hiện ~0 nội dung published; types Wave-04 song ngữ + case-study chưa map 1:1 với read model). Xem `NEXT_PHASE.md`.
- **Migration ledger:** 6 (`0000`–`0005`), applied on Neon **Development** = 6 (no drift). **25 public tables**. Không migration mới lượt backend này.
- **DB contract:** `WAVE05_DATABASE_CONTRACT_DEV_VERIFIED` — G1 taxonomy, G2a projects model, G3 articles, G4 career, G5 revisions. See `docs/audit/WAVE05_DATABASE_CONTRACT.md`.
- **Backend application:** ✅ `BACKEND_APPLICATION_FOUNDATION_DEV_VERIFIED` — tags, technologies (G1B), projects (G2b), articles (G3), career + profile + skills + site-settings (G4), revisions (G5), + Public Neon Read Model hợp nhất. Deny-by-default authz, Zod biên, atomic `db.batch`, row_version, audit, published/visible-only. See `docs/audit/WAVE05_BACKEND_APPLICATION_AUDIT.md`.
- **Bằng chứng:** offline 159 test + 10 architecture + build xanh; 6 live smoke trên Neon Dev (12 test), fixtures dọn sạch.
- **Infra substrate:** `INFRA_DEV_PREVIEW_SUBSTRATE_VERIFIED_WITH_EXTERNAL_GAPS`. See `docs/audit/INFRA_DEV_PREVIEW_SUBSTRATE.md`.
- **Transaction strategy:** neon-http `db.batch` → `client.transaction` (atomic); no interactive tx, no Pool.
- **Giai đoạn kế tiếp:** `ADMIN_FUNCTIONAL_CMS_COMPLETION`. Contact backend HOÃN (biên bảo mật public-write — Wave tích hợp/bảo mật).
- **External PENDING:** Supabase live OAuth sign-in `PENDING_INTERACTIVE` (Owner đã đăng nhập; seed app_users để lượt Admin); Vercel Preview deploy `PENDING_OPERATOR`; Cloudflare `PENDING_INTERACTIVE`. None block backend work.
- **Next phase:** `WAVE05_BACKEND_ADMIN_FUNCTIONAL_COMPLETION` (articles/career/revisions backend + admin functional). Frontend redesign `BLOCKED_UNTIL_BACKEND_ADMIN_FOUNDATION_PASS`.

## Wave 02 foundation (landed on branch `feat/wave-02-foundation`)

- Bootstrap mode: **MODE A** (isolated `create-next-app` scaffold outside repo → configs adapted in-repo; scaffold deleted).
- Resolved stable versions (pinned via `pnpm-lock.yaml`): next 16.2.12 · react/react-dom 19.2.4 · typescript 5.9.3 · eslint 9.39.5 · eslint-config-next 16.2.12 · tailwindcss 4.3.3 · zod 4.4.3 · vitest 4.1.10. (Registry offered newer majors — TS 7 / ESLint 10 / React 19.2.8 — intentionally not used; the generator's compatible set was chosen.)
- Architecture enforcement: ESLint import-boundary rules (`eslint.config.mjs`) + `tests/architecture/dependency-rules.test.ts` (real graph scan + fixture). dependency-cruiser deferred (not needed).
- Local validation GREEN: typecheck ✅ · lint ✅ · vitest 7/7 ✅ · test:architecture 3/3 ✅ · production build ✅ (routes `/`, `/_not-found`, `/admin` static).

## Wave 02B skill intake & reconciliation (branch `feat/wave-02-foundation`)

- 3 Owner README sources found at repo root (UNTRACKED_OWNER_INPUT): `README_mattpocock.md` (UNKNOWN license → local-reference-only), `README_cline.md` (Apache-2.0), `README_Kilo-Org.vi.md` (MIT). Not committed.
- Selective adoption recorded in `docs/skills/` (adoption matrix, conflict register, wave map, manifest). Net change: strengthened CLAUDE.md §8 (TS: `z.infer`, generic constraints, no unsafe any/unknown) + added §26 Selective Skill Policy.
- Rejected: numbered folders `src/1_domain` (ADR-0001), Kilo `--auto`, README plugin/CLI installs, adding Drizzle/Supabase/Lucide in this phase.
- Env: `.env.local` present, gitignored, untracked. `pnpm check:env` → Wave 03 keys (Neon/Supabase) PRESENT (presence ≠ connectivity); email/Sentry partial/PENDING_OPERATOR.
- Architecture test strengthened: now covers domain, application, infrastructure→presentation, presentation→infrastructure + 4 fixtures.

## Wave 03 data/auth/storage (branch `feat/wave-03-data-auth-storage`, stacked on Wave 02)

- Deps: drizzle-orm, @neondatabase/serverless, @supabase/ssr, @supabase/supabase-js, lucide-react, server-only (+ drizzle-kit). Pinned in lockfile.
- Neon Drizzle schema (8 tables: app_users, profiles, projects, media_assets, skills, contact_messages, audit_logs, site_settings) + neon-http client (`server-only`) + migration `0000_boring_skullbuster.sql` generated **offline** (not applied).
- Auth: Supabase SSR clients (server/browser/middleware) + service storage client; identity module (feature-first) with pure `evaluateAdminAccess` policy, `RequireAdmin` use-case, Supabase auth adapter, Drizzle app-user repo; composition root `src/composition/identity.ts`; `middleware.ts` gate + `/admin-login`, `/auth/callback`, `/auth/error`; admin layout enforces authorization.
- env split: `env.ts` (public) + `env.server.ts` (`server-only` secrets). `permissions.ts`, audit writer, storage-policies.sql.
- Validation green: typecheck/lint/test(17)/arch(6)/build. Self-heal: 1 (test fixture message after rule refinement).
- **Target proof PENDING:** live Neon migration, Supabase GitHub OAuth sign-in, storage bucket creation, owner `app_users` seed. Keys PRESENT ≠ connectivity.

## Wave 03R integration & target proof (branch `feat/wave-03-data-auth-storage` + `ci/wave-03r-baseline-gate`)

- **Baseline verified:** main=8b487c7, wave-02=a6d2a0d, wave-03=e48a95f; wave-03 based on wave-02; no in-progress git op/lock/stash. 3 untracked Owner READMEs kept local (not staged/deleted).
- **Storage authority corrected → server-mediated.** `src/modules/media/**` (pure upload policy + `AuthorizeMediaUpload` use-case + server-only Supabase signed-upload adapter + composition root + `POST /api/media/upload-url`). `storage-policies.sql` rewritten (undefined `is_owner_admin()` removed; browser roles zero-write; Neon = sole role authority). Bucket names single-sourced in the media domain.
- **Security tests:** media upload policy + use-case authorization + server-only boundary → suite **35/35** (was 17). No client module can import the service secret (proven by test).
- **Minimal CI prepared:** `.github/workflows/ci.yml` on `ci/wave-03r-baseline-gate` (from main). Not yet merged/green.
- **Progress matrices:** `docs/status/{FEATURE_PROGRESS_MATRIX,STACK_PROGRESS,DB_CONTENT_GAP_MATRIX}.md`. Aggregate: FRONTEND ~10 · BACKEND ~40 · DATABASE ~25 · INFRASTRUCTURE ~30 · OVERALL ~26.
- **Integration status:** `MAIN_INTEGRATION_STATUS = PENDING_PR_MERGE`; `TARGET_PROOF_STATUS = PENDING_OPERATOR`. Merges/target-proof require Owner (no `gh`).
- Known warning: Next 16 deprecates `middleware` file convention → `proxy` (non-blocking; deferred).

## Wave 03S main-integration & development-target completion (merged to `main`)

- **Main integration DONE:** `gh` was write-authenticated (account `KentTho`, scopes `repo`+`workflow`).
  Created + merged PRs in order (merge commits): **#1** `ci/wave-03r-baseline-gate` → CI green 5s;
  **#2** `feat/wave-02-foundation` → CI green 41s; **#3** `feat/wave-03-data-auth-storage` → CI green
  49s (after build fix). `main` @ **`cf613ec`**; Actions run `30601997949` green on `main`. No branch
  protection existed; merges were conflict-free (three-way merge preserved `ci.yml`).
- **Build self-heal (commit `833ed64`, in PR #3):** `next build` failed in CI because route modules were
  imported during page-data collection and eagerly validated `serverEnv` / built `neon(DATABASE_URL)` at
  module scope → build required real secrets. Fixed with lazy memoized env (`serverEnv` proxy,
  `getAdminAllowedEmails()`), lazy `getDb()`, and `export const dynamic = "force-dynamic"` on the admin
  layout. Reproduced secret-free build locally (`DATABASE_URL= pnpm build`) before pushing. No `any`,
  no `ts-ignore`, no test/strictness weakening.
- **Merged-`main` validation GREEN:** install (frozen) · check:env (18 keys) · db:generate (no drift) ·
  lint · typecheck · **test 35/35** · arch 10/10 · secret-free build.
- **Neon DEVELOPMENT verified (evidence-based, not variable-name-based):** empty greenfield schema
  (0 tables) + Neon host `…ap-southeast-1.aws.neon.tech` + Owner authorization. Normalized a malformed
  `psql '...'`-wrapped `DATABASE_URL`/`_UNPOOLED` in `.env.local` (no values printed; `.bak` deleted).
  Applied additive-only migration (`db:migrate`) → ledger = 1, **8 kernel tables** + 18 indexes;
  read/write + unique-constraint (`media_bucket_path_idx`) smoke pass; DB left clean.
- **Supabase Storage verified (development):** created `portfolio-public` (public) + `portfolio-private`
  (private) via service key; signed upload issued → uploaded → confirmed; private short-lived signed
  read (60s); self-cleaned. Server-mediated model holds; service key server-only.
- **Auth sign-in PENDING (interactive):** Supabase project has **0 users** → owner `app_users` row not
  seeded (no UID fabricated). Requires the Owner to complete GitHub OAuth sign-in through the app once.
- **Vercel Preview PENDING:** CLI authenticated (`kenttho`); not deployed (needs env propagation + OAuth
  redirect config). **Production deliberately not touched.**
- **Security note:** a Neon credential appeared in a driver error before normalization → Owner should
  **rotate the Neon password**. No secret entered VCS/CI/committed files.
- **Verdict:** `PRE_FE_FOUNDATION_TARGET_VERIFIED_EXCEPT_PREVIEW` + `AUTH_SIGN_IN_PENDING_INTERACTIVE`.
  Wave 04 is unblocked (branch from `main`) but **not started** this phase (foundation-first).

## Current capability levels

- Application foundation / Design system / Architecture enforcement: **L3_OFFLINE_PROVEN**.
- Admin authorization policy / Media upload authorization: **L3** (pure, unit-proven).
- Database / Auth / Storage integration: **L1–L2** (source + migration generated; live connectivity = target proof pending).
- Public content: **L1** (skeleton) · Admin content operations: **L1** (shell + protected route).
- CI / Preview / Production: **L0_NOT_PRESENT** (CI branch prepared, not merged/green).

## Environment state

No external services connected. No secrets provisioned. `.env.example` is a placeholder template only. Wave 02 builds and runs with no populated `.env`.
