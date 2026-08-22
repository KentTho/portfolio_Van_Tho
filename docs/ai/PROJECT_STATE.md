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

## V2 Vivid Visual Substrate + Section Scene Motion (2026-08-20, awaiting Owner Visual Acceptance)

- **Branch:** `feat/v2-vivid-visual-substrate-and-motion-rebase-03` (from `main` @ `ab4b5a8`), **PR open** — **NOT merged** (Owner 5A). `cosmic-background.tsx` evolved into a **section-aware VIVID SUBSTRATE** (single authority): graphite-veil depth + brand-recoloured chromatic **prism** (CSS/SVG, blue/gold, no rainbow, **no WebGL**) that repositions per scene + per-section motifs (grid-plane/vertical-channel/distributed-nodes/focus-collapse/rest) so the environment visibly differs between sections (fixes homogeneous-substrate root cause). Pointer-light (`pointer:fine`+!reduced), one ~7s shimmer, `--ease-scene-focus` token. Owner Q01A–Q08A. `vivid_co/` = untracked design-token reference (mechanics ported, content NOT copied). Reduced-motion static, mobile simplified, hydration 0, content/brand/IA/fonts unchanged, no fabrication, no new dependency. Validation GREEN (check:env·typecheck·lint·**test 198/6**·arch 10/10·secret-free build·**e2e:public 11/11**); scene differentiation verified. Applied /taste-design + /ui-ux-pro-max.

## V2 Global Navigation + Motion System — VISIBLE-PREMIUM · MERGED + Production LIVE (2026-08-18)

- **✅ PR #13 MERGED → `main` = `68e6f9e`; Production LIVE + verified** (nav handoff all 6, motion visible-premium, overflowX=0, hydration 0, reduced-motion ok, no phone, admin deny). Compact/expanded icon-capsule nav (active always expanded, no dead-zone, 0 header CLS, mobile full-label drawer) + **visible-premium MASTER-MOTION-02** motion (perception-first: ~28–34px/0.7s, per-section choreography — Hero descend, **About converge**, Projects/Skills stagger, Career timeline-draw, Contact emphasis; `Reveal` reworked directional; once/no-replay/reduced-safe; ambient aurora recede). Applied /taste-design + /ui-ux-pro-max. `@remixicon/vue` removed (one framework). Validation GREEN (check:env·typecheck·lint·**test 198/6**·arch 10/10·secret-free build·**e2e:public 11/11**); QA VI+EN × 320–1440 (overflowX=0, hydration 0, perception verified). Owner authorized merge → Production.

## V2 Contact + Footer — MERGED + Production LIVE (2026-08-18)

- **Merged:** PR #12 → `main` = **`9939ec5`**; production verified (Contact "Gửi email"/"Sao chép email", Footer "Lên đầu"). Conversion-first Contact (real mailto + robust copy-email state machine, 0 width-jump, aria-live) + Footer closure + Back-to-Top. **Branch history (superseded):** `feat/v2-contact-footer-enhancement` (from `main` @ `16878f5`). `#contact` V2: conversion-first centered editorial + primary real `mailto` CTA + robust copy-email state machine (idle/copied/error, 0 width-jump, aria-live, keyboard) + verified channels only; Footer closure + Back-to-Top; year server-deterministic. **Hydration:** `EXTERNAL_BROWSER_EXTENSION_MUTATION_CONFIRMED` (clean env 0 errors; regression guard in e2e:public). `@remixicon/vue` = `WRONG_FRAMEWORK_UNUSED_DEPENDENCY` (zero imports, not staged/reverted — Owner remove). Validation GREEN (check:env·typecheck·lint·**test 198/6**·arch 10/10·secret-free build·**e2e:public 9/9**); QA VI+EN × 320–1440. No form (Wave 06A), no fabrication, phone private.

## V2 Career — Education-first timeline — MERGED + Production LIVE (2026-08-18)

- **Career merged:** PR #11 → `main` = **`16878f5`**; production verified (`#career` "Học vấn"/"Nguyen Tat Thanh" present). Central-axis Education-first timeline + dormant two-tab [Experience|Education] state machine (`listEducation()` port; live Neon; `PENDING_OWNER_EXPERIENCE_DETAILS` remains). Hero/Menu/About also on main (PR #10 `b360eed`).

## V2 Hero + Menu + About — Owner APPROVED + MERGED + Production LIVE (2026-08-18)

- **`main` = `b360eed`** (merge commit "PR #10", parents `6cc060e`+`fff79ec`) — the approved Hero/Menu/About head `fff79ec` landed on main (merged during a GitHub API outage; PR #9 shows merged). **Production LIVE + verified:** `/vi` `/en` 200, Hero/About V2 present, admin deny, no phone, CI green. Career PR #11 is stacked cleanly on top (base main).
- **Delivered:** 3-zone Hero corrected (2-line name "Hà Văn"/"Thọ", portrait anchor bigger/higher/focused-backlight, right zone near eye-line, single primary CTA + light secondary link, darker canvas/dimmer grid); Menu verified vs `Menu_audit` (active≠hover, scroll-spy all 6 blocks incl. Contact no-dead-zone, anchor offset); About redesigned as editorial split (statement + backlit identity fact-panel, real facts, continuation of Hero). Entrance visible (`intro-gate`), brand blue/gold, reduced-motion hydration-safe (`use-reduced-motion-safe`). **Hydration forensic:** `EXTERNAL_BROWSER_EXTENSION_MUTATION_CONFIRMED` (clean env 0 errors; Owner warning = Liner/`data-be-installed` extension). Validation GREEN (check:env·typecheck·lint·test 186/6·arch 10/10·secret-free build·e2e:public 7/7); QA VI+EN × 320/390/768/1024/1440 (overflowX=0, console clean). Owner UI map: `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md`.
- **Anomaly (pre-existing, not V2, not staged):** `package.json`/`pnpm-lock.yaml` add `@remixicon/vue` (Vue pkg in a React repo) — Owner should review/remove.

## Current machine state — ✅ V1 CLOSED, Production LIVE (2026-08-16)

- **Branch:** `main` @ **`6cc060e`** (`LOCAL == REMOTE`). V1 merged: PR #6 (CV-driven 6-block single-landing) → merge commit `30b1184` (contains validated feature HEAD `b367d1d`) → PR #7 (docs post-merge reconcile) → `feeb0bd` → PR #8 (post-V1 state reconcile) → **`6cc060e`**. Feature branch `feat/wave-04-phase-2-public-visual-redesign` retired. **Verdict:** `V1_MAIN_MERGED_AND_POST_MERGE_VERIFIED`.
- **Production:** ✅ **LIVE** — `https://portfolio-van-tho.vercel.app` (Vercel Git-integration deploy on push to `main`; `…-git-main…` alias binds main-branch production). Post-merge runtime smoke: `/vi` `/en` 200 · 6 anchors live · real content (Hà Văn Thọ · NTTU · Expense Tracker) · admin deny (`/vi/admin`→404, `/admin`→307) · no phone. CI on `main` @ `feeb0bd` GREEN. Ruleset `protect-main` required-check corrected `CI / quality` → `quality` (name-mismatch that had blocked merge); no protection weakened.
- **V2 public visual enhancement — vivid foundation: ✅ MERGED + PRODUCTION VERIFIED (2026-08-22).** `main` @ **`51b17bc`** (PR #15 merge; final feature HEAD `ce8c57f`). Cinematic Hero video (`/video/GEMINI_IMAGE_TO_VIDEO.mp4` committed under `public/`, serves 200 in prod) + scroll-linked dissolve · transparent scene-integrated header · native scroll · replayable reveal with hysteresis + product-state preservation · crisp optical prism / mask-composite portrait · `motion/react` sole authority (no framer-motion). Prod smoke `/vi` `/en` 200, video loads, real content, no phone, admin deny. **Remaining V2:** Projects V2 + Skills V2 full redesign (not started).
- **⚠️ PRODUCTION_DATABASE_TARGET = `SAME_AS_DEVELOPMENT`** (secret-safe behavioral proof: Production renders the exact rows only ever ingested into Neon Development; Vercel has a single `DATABASE_URL`/`_UNPOOLED` binding shared `Production, Preview`, no separate Development binding). **Owner-decided: `PRODUCTION_DATABASE_ISOLATION = APPROVED_PLANNED_NOT_EXECUTED`** — a separate Neon Production branch (isolated from Dev/Preview) is the approved target, tracked as a small planned infra task **INFRA-DB-ISO** (runbook in HANDOFF/ROADMAP). NOT executed this prompt: no DB create, no migration, no data copy, no `DATABASE_URL`/Vercel-env change. AI performed NO migrate/copy/switch; no secret/URL printed.
- **Public architecture:** ✅ **6-block recruiter-first landing per locale** (`/vi`, `/en`): `#home #about #projects #career #skills #contact` + locale-aware scroll-spy nav. Consolidated `/about /projects /articles /resume /contact` → `/#anchor`; `/projects/[slug]` + `/articles/[slug]` preserved. Focus/Principles/Articles removed from landing (article domain + detail route retained). FULL_LIVE_NEON, no fixture fallback; `#contact` = real email/social (contact form backend → later backlog, not V1).
- **Public content (real CV, ingested to Neon Development via authenticated Admin UI → Server Action → use-case → repo):** profile (Hà Văn Thọ / Software Engineer / TP.HCM / havantho2004@gmail.com), Education (NTTU/Software Engineering/2022–nay), 15 skills (6 groups), 6 technologies, published **Expense Tracker** project (+2 translations, +6 project_technologies). Two integration mapping fixes (`getTechGroups`←skills grouped by category, `education`←`listPublicEducation`) so ingested data reaches `#skills`/`#career`. Populated visual QA PASS. Phone NOT stored (private). Experience NOT ingested (`PENDING_OWNER_EXPERIENCE_DETAILS`). Awards omitted (`AWARDS_DOMAIN_GAP`). No raw SQL, no migration (25 tables/ledger 6).
- **Public visual system:** ✅ logo-derived brand (electric blue + gold on black) in `tokens.css`/`globals.css` (typography scale, spatial grammar, WCAG-AA); portrait hero (`vantho.png`); premium motion (cursor halo, kinetic type, magnetic CTA, pointer-tilt portrait, intro curtain, orbital/BlurText). `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md` owns the section→file map (current 6-block IA authority). Technology tile authority = Neon/Admin only. *(Cosmetic V2: a few skill tiles render the slug when the slug is outside `technology-catalog`.)*
- **Integration:** ✅ Wave-04 public presentation hợp nhất với foundation Wave-05 (presentation không chồng lấn; middleware auto-combine auth-gate + locale-routing).
- **Public data authority:** ✅ **FULL_LIVE_NEON** — trang công khai đọc trực tiếp live Neon qua `NeonPortfolioRepository` (thin adapter trên public read model đã verified; vi/en zip; section-kind→case-study mapping; **không fixture fallback runtime**; SAMPLE fixtures chỉ còn cho test/tham chiếu). Render on-demand (`force-dynamic` trên `[locale]` layout + sitemap; `[slug]` generateStaticParams→[]) ⇒ **secret-free `pnpm build` vẫn xanh** (không chạm DB lúc build). 5 mapper unit test.
- **E2E (Playwright 1.56.1):** ✅ Public E2E **7/7** headless trên app thật + live Neon (6-block landing sections + consolidated-route redirects, no admin-nav/draft/archive leak, anon `/admin`→`/admin-login`, locale redirect). ✅ Authenticated E2E VERIFIED — `admin-allow.authed.spec.ts` PASS via local storageState (`tests/.auth/owner.json`; run authed `--no-deps`). Validation at V1 merge HEAD: **check:env 18/0 · typecheck · lint · test 186 +6 skip · 10 arch · secret-free build** · public E2E 7/7 · authed E2E pass · CI `quality` green · Vercel Preview green.
- **Admin CMS:** ✅ control plane đầy đủ — profile/projects/articles/career/skills/technologies/tags/settings/audit/revisions; media+messages = status pages. UI→Server Action→use-case→repo (không chạm Drizzle). Sơ đồ: `docs/architecture/SYSTEM_MAP.md`.
- **Auth:** ✅ **`OWNER_ADMIN_DEV_AUTH_VERIFIED`** — Owner đã hoàn tất GitHub OAuth; `bootstrapOwnerAdmin` cấp **1 hàng `app_users` = `owner_admin`/`active`**, có Supabase UID + last_login, không revoked (kiểm chứng read-only đã che định danh trên Neon). Negative chain (unauth/unknown/inactive/role → DENY) unit-proven.
- **Open decision (V1-era, RESOLVED):** public wiring to live Neon read model → done (FULL_LIVE_NEON, populated with real CV content). No fixture fallback at runtime.
- **Migration ledger:** 6 (`0000`–`0005`), applied on Neon **Development** = 6 (no drift). **25 public tables**. Không migration mới lượt backend này.
- **DB contract:** `WAVE05_DATABASE_CONTRACT_DEV_VERIFIED` — G1 taxonomy, G2a projects model, G3 articles, G4 career, G5 revisions. See `docs/audit/WAVE05_DATABASE_CONTRACT.md`.
- **Backend application:** ✅ `BACKEND_APPLICATION_FOUNDATION_DEV_VERIFIED` — tags, technologies (G1B), projects (G2b), articles (G3), career + profile + skills + site-settings (G4), revisions (G5), + Public Neon Read Model hợp nhất. Deny-by-default authz, Zod biên, atomic `db.batch`, row_version, audit, published/visible-only. See `docs/audit/WAVE05_BACKEND_APPLICATION_AUDIT.md`.
- **Bằng chứng:** offline 159 test + 10 architecture + build xanh; 6 live smoke trên Neon Dev (12 test), fixtures dọn sạch.
- **Infra substrate:** `INFRA_DEV_PREVIEW_SUBSTRATE_VERIFIED_WITH_EXTERNAL_GAPS`. See `docs/audit/INFRA_DEV_PREVIEW_SUBSTRATE.md`.
- **Transaction strategy:** neon-http `db.batch` → `client.transaction` (atomic); no interactive tx, no Pool.
- **Next phase (candidate, NOT started):** `V2_PUBLIC_VISUAL_ENHANCEMENT` — per-section visual enhancement of the 6 blocks on live data; UI authority = `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md`; design reference = `docs/ui/PREMIUM_PORTFOLIO_DESIGN_BRIEF.md`. Independent backlog (contact backend/Turnstile/email, `PROFILE_AND_PUBLIC_IDENTITY_DOMAIN_EXPANSION`, observability/rollback, GSAP/R3F) NOT auto-included — Owner-selected or genuinely-dependent only.
- **Owner-managed pending (not V2 blockers):** `PENDING_OWNER_EXPERIENCE_DETAILS` (company/title/dates before ingesting Experience — no fabrication); `PENDING_PUBLIC_SAFE_RESUME` (both resume PDFs still contain phone → no public Resume CTA until phone-stripped PDF exists); **INFRA-DB-ISO** = `PRODUCTION_DATABASE_ISOLATION = APPROVED_PLANNED_NOT_EXECUTED` (planned infra task, runbook recorded).
- **Cloudflare** DNS/Turnstile still `PENDING_INTERACTIVE` (not wired; not a V1/V2 blocker).

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
