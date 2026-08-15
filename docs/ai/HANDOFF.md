# HANDOFF

## Completed
- **Wave 05 — Final Foundation Gate** (branch `integration/pre-fe-foundation` @ `60c8d90`, từ verified `e7f8e02`): ✅ **`OWNER_ADMIN_DEV_AUTH_VERIFIED`** — Owner hoàn tất GitHub OAuth; `bootstrapOwnerAdmin` cấp 1 hàng `app_users`=`owner_admin`/`active` (kiểm chứng read-only, che định danh trên Neon). **Integration merge:** hợp nhất Wave-04 public (`94f547e`) — presentation không chồng lấn, middleware auto-combine auth-gate + locale-routing. **Public data authority = FULL_LIVE_NEON** (Owner-decided): trang công khai đọc trực tiếp live Neon qua `NeonPortfolioRepository` (thin adapter; vi/en zip; section-kind→case-study; **không fixture fallback**); render on-demand ⇒ secret-free build vẫn xanh. **Playwright 1.56.1:** public E2E **9/9 VERIFIED** (no admin/draft/archive leak; anon `/admin`→login); authenticated specs = PENDING_OPERATOR (storageState OAuth headed). Validation: check:env 18/18 · **184 unit +6 skip** · 10 arch · secret-free build xanh · live public read smoke (2). Thêm `docs/ai/WORKING_METHOD.md`. **PENDING_OPERATOR:** (1) `pnpm e2e:auth-setup` (OAuth headed 1 lần) → chạy authenticated E2E; (2) Vercel Preview deploy + OAuth redirect config. Production vẫn khoá.
- **Wave 05 — Admin Functional CMS** (branch `feat/wave-05-cms-foundation` @ `f0fd362`): Admin control plane đầy đủ trên tầng application đã verified. Auth: `bootstrapOwnerAdmin` (first-login owner provisioning, allow-list gated, idempotent) wire vào `/auth/callback` + `provisionOwner` repo (5 unit test). UI: `_lib` (getAdminOrRedirect, FormState client-safe, withAdminAction server-only, fromResultError) + `_components` (form-ui, page-parts, delete/action buttons) + sidebar nav (VN) + dashboard đếm thật. Modules: profile, projects (+lifecycle), articles (+lifecycle +revisions link), experience/education/certifications, skills, technologies, tags, settings, revisions viewer, audit viewer (module read mới: AuditReadPort+ListAuditEntries+repo, 4 test); media/messages = trang trạng thái trung thực (backend chưa có). Pattern: Server Action → composition → use-case → repo (UI KHÔNG chạm Drizzle). States: loading/empty/validation/authz/not-found/success/server-fail/stale. Commits `8e9e3d2`→`f0fd362`. Validation: typecheck·lint·168 test·10 arch·build(37 routes) xanh. **Auth session trực tiếp + Preview = PENDING_OPERATOR** (host Supabase không reachable từ môi trường build; `app_users`=0). Sơ đồ toàn dự án: `docs/architecture/SYSTEM_MAP.md`. **Kế tiếp:** operator xác nhận OAuth+Preview → E2E (Playwright, chờ auth) → `FRONTEND_REDESIGN`.

- **Wave 05 — Backend Application Foundation** (branch `feat/wave-05-cms-foundation` @ `1d7a9f1`): ✅ `BACKEND_APPLICATION_FOUNDATION_DEV_VERIFIED`. Phục hồi phiên bị ngắt mạng (MODE A forensic → `INTERRUPTED_SESSION_STATE_RECONCILED`, phân loại `AI_SESSION_TRANSPORT_INTERRUPTION`, giữ nguyên patch G3 chưa commit) rồi hoàn tất toàn bộ tầng application backend: G3 articles (`10fc20f`), G4 career (`78a1006`), G4 profile/skills/site-settings (`0657732`), G5 revisions (`cf165c0`), Public Neon Read Model (`1d7a9f1`). Mỗi năng lực: domain + Zod + deny-by-default authz + repository + use-cases + composition + unit test + live smoke có cổng `RUN_DB_SMOKE`. Validation: typecheck · lint · test 159/6-skip · arch 10 · build xanh; 6 live smoke Neon Dev (12 test), fixtures sạch. Contact backend HOÃN (biên bảo mật). Chi tiết: `docs/audit/WAVE05_BACKEND_APPLICATION_AUDIT.md`. **Kế tiếp: Admin Functional CMS** (+ live auth app_users seed, Preview — cần thao tác viên).
- **Wave 05 — Infra + DB contract** (@ `bfe1660`): MODE A infra Dev/Preview substrate closure (`INFRA_DEV_PREVIEW_SUBSTRATE_VERIFIED_WITH_EXTERNAL_GAPS`) + full DB contract G1–G5 on Neon Development (`WAVE05_DATABASE_CONTRACT_DEV_VERIFIED`, ledger=6, 25 tables). Backend: technologies (G1B) + projects write-side/public read (G2b). Commits `45bf54f`→`bfe1660`.
- **Wave 01** (landed `main` @ `8b487c7`): governance + architecture + security docs.
- **Wave 02** (branch `feat/wave-02-foundation`): Next.js 16 App Router foundation, strict TS, Tailwind v4 design tokens, shadcn base config, Zod env validation, feature-first Clean Architecture kernel, ESLint + Vitest architecture enforcement, public/admin layout skeletons, test harness, production build.

## Evidence (Wave 02)
- Versions pinned in `pnpm-lock.yaml`; resolved next 16.2.12 / react 19.2.4 / ts 5.9.3 / eslint 9.39.5.
- `pnpm typecheck` ✅ · `pnpm lint` ✅ · `pnpm test` 7/7 ✅ · `pnpm test:architecture` 3/3 ✅ · `pnpm build` ✅.
- Self-healing: 1 incident (Next 16 removed `eslint` config key) → fixed `next.config.ts`.

## Commands
Version discovery; isolated scaffold (Mode A); `pnpm install`; validation matrix; exact-path stage; secret scan; commit; push feature branch.

## Failures / not run
- CI (GitHub Actions) — Wave 07. Preview/production/provider proofs — deferred (no services connected).
- exactOptionalPropertyTypes not enabled (practicality) — `noUncheckedIndexedAccess` is on.

## Remaining
- Owner review/merge of Wave 02 PR (no `gh` CLI → use compare URL).
- Prepare Neon dev + Supabase dev before Wave 03.

## Wave 02B (skill intake & reconciliation)
- 3 README sources audited → `docs/skills/` (matrix, conflict register, wave map, manifest). Sources kept untracked (mattpocock license UNKNOWN).
- CLAUDE.md: strengthened §8 TS rules + added §26 Selective Skill Policy.
- Added `ROADMAP.md`; `scripts/check-env.mjs` + `pnpm check:env`; strengthened architecture test (4 fixtures, 4 layers).
- Env verified secret-safe (`.env.local` gitignored/untracked); Wave 03 keys PRESENT.
- Report anomalies (L1–L5) reconciled: mostly NOT_REPRODUCIBLE / report-typo; temp scaffold path was `D:\web-app\wave02-scaffold-tmp` (deleted).

## Temp scaffold (exact)
`D:\web-app\wave02-scaffold-tmp` — created by `create-next-app` (Mode A), inspected, deleted (verified outside repo, not a symlink). Not tracked.

## Wave 03 (data/auth/storage — branch `feat/wave-03-data-auth-storage`, stacked on Wave 02)
- Deps: drizzle-orm, @neondatabase/serverless, @supabase/ssr, @supabase/supabase-js, lucide-react, server-only, drizzle-kit.
- Neon Drizzle schema (8 tables) + neon-http client (`server-only`) + migration `0000_boring_skullbuster.sql` generated offline (NOT applied).
- Supabase SSR clients + service storage client; identity module (feature-first) with pure `evaluateAdminAccess`, `RequireAdmin`, adapters; composition root `src/composition/identity.ts`; `middleware.ts` gate; `/admin-login`, `/auth/callback`, `/auth/error`; admin layout enforces authorization.
- `env.server.ts` (server-only secrets) split from public `env.ts`; `permissions.ts`; audit writer; `supabase/migrations/storage-policies.sql`.
- Validation green: typecheck/lint/test(17)/arch(6)/build; `pnpm db:generate` ✅. Self-heal: 1 (arch fixture message after rule refinement).
- **Target proof PENDING (Owner):** `pnpm db:migrate` (Neon), Supabase GitHub OAuth end-to-end, storage bucket creation, seed owner `app_users` row.

## Wave 03R (integration & target proof — branch `feat/wave-03-data-auth-storage` + `ci/wave-03r-baseline-gate`)
- **Baseline preflight PASS:** main=8b487c7, wave-02=a6d2a0d, wave-03=e48a95f; 03 based on 02; no in-progress git op/lock/stash; only 3 untracked Owner READMEs (kept local).
- **Storage authority correction (D-015):** server-mediated model. New `src/modules/media/**` (pure `evaluateUploadRequest` policy → `AuthorizeMediaUpload` use-case requiring admin + `media.write` → server-only `SupabaseStorageUploader` → `src/composition/media.ts` → `POST /api/media/upload-url`). `storage-policies.sql` rewritten (removed undefined `is_owner_admin()`; browser roles zero-write; Neon = sole role authority). `permissions.ts` gained pure `hasPermission`. `storage-client.ts` now single-sources bucket names from the media domain.
- **Security tests added:** `media-upload-policy` (9), `authorize-media-upload` (5), `server-only-boundary` (4) → suite now **35/35**.
- **Minimal CI (D-016):** `.github/workflows/ci.yml` on `ci/wave-03r-baseline-gate` (from main). Tolerates governance-only main. Advanced CI stays Wave 07.
- **Docs:** ROADMAP reconciled (branch/integration fields, D-017); `docs/status/{FEATURE_PROGRESS_MATRIX,STACK_PROGRESS,DB_CONTENT_GAP_MATRIX}.md`.
- **Validation:** typecheck ✅ · lint ✅ · test 35/35 ✅ · build ✅ (route `/api/media/upload-url` ƒ). Known warning: Next 16 deprecates `middleware` → `proxy` (non-blocking; defer).
- **PENDING_OPERATOR:** merge order CI→main, Wave02→main, Wave03→main (no `gh`); dev target proof (Neon migrate / Supabase OAuth / buckets / owner seed).

## Wave 03S (main integration & dev-target completion — landed on `main` @ `cf613ec`)
- **Merged in order (merge commits; `gh` write):** PR #1 `ci` (green 5s) → PR #2 Wave 02 (green 41s) →
  PR #3 Wave 03 (green 49s after fix). CI green on `main` (Actions `30601997949`). No branch protection;
  conflict-free; three-way merge preserved `ci.yml` (two-way diff false-positive checked).
- **Build self-heal (commit `833ed64`):** lazy env (`serverEnv` proxy, `getAdminAllowedEmails()`), lazy
  `getDb()`, admin layout `force-dynamic` → `next build` needs no secrets. Proven locally with
  `DATABASE_URL= pnpm build`; then CI green. Files: `env.server.ts`, `database/client.ts`,
  `audit-writer.ts`, `drizzle-app-user-repository.ts`, `composition/identity.ts`, `admin/layout.tsx`.
- **Neon dev VERIFIED:** classified DEVELOPMENT by empty schema (0 tables) + Neon host + Owner auth;
  normalized malformed `psql '...'` DB URL in `.env.local` (no values printed); `db:migrate` applied →
  ledger 1 + 8 tables + 18 indexes; write/read/unique smoke pass; DB clean.
- **Supabase Storage dev VERIFIED:** buckets `portfolio-public`/`portfolio-private` created; signed
  upload + private signed read smoke pass; self-cleaned.
- **Auth PENDING (interactive):** 0 Supabase users → owner row not seeded (no UID invented).
- **Preview PENDING:** Vercel CLI authed (`kenttho`); not deployed. Prod not touched.
- **Rotate the Neon password** (appeared in a pre-normalization driver error; never committed).
- Throwaway `scripts/_dev-*.mjs` + `scripts/_normalize-env.mjs` + `.env.local.bak` created and **deleted**.
- **Verdict:** `PRE_FE_FOUNDATION_TARGET_VERIFIED_EXCEPT_PREVIEW` + `AUTH_SIGN_IN_PENDING_INTERACTIVE`.

## Next-phase capsule
`WAVE_04_PUBLIC_EXPERIENCE` on `feat/wave-04-public-portfolio` **from verified `main` @ `cf613ec`**
(unblocked: 02/03 merged, CI green, dev DB+storage verified). Not started this phase. Before live admin:
Owner completes GitHub OAuth sign-in once → re-run owner-seed → admin authz smoke. See `NEXT_PHASE.md`.

## Wave 04 Phase 2 — Public Visual Redesign (COSMIC ENGINEERING EDITORIAL)
- **Branch:** `feat/wave-04-phase-2-public-visual-redesign` (from `integration/pre-fe-foundation` @ `14a04a6`)
- **Status:** `REDESIGN_STATIC_VALIDATION_CHECKPOINT_PASS` — static gate GREEN (typecheck + lint + test 184 pass/6 skip + arch 10/10 + secret-free `next build`). **NOT** runtime-verified / release-ready: `pnpm dev` surfaced a real runtime defect *"Invalid server environment configuration: DATABASE_URL"* → must fix before any visual-scope expansion, browser QA, or e2e.
- **Design Language:** COSMIC ENGINEERING EDITORIAL. Dials: DESIGN_VARIANCE=7, MOTION_INTENSITY=5, VISUAL_DENSITY=5.
- **Governance Fixes Applied:**
  - `motion` **restored to `^12.43.0`** (foundation authority; React Bits had silently downgraded to `^12.23.12`). `pnpm install` removed the stray direct `framer-motion 13.1.0` the React Bits CLI pulled in — `motion/react` is the sole animation authority, no `framer-motion` direct dep.
  - `Instrument_Serif` (banned font) → replaced with `Syne` 700/800 as `--font-display`
  - Added `JetBrains_Mono` as `--font-mono`
  - Orphan raw drop `src/components/BlurText.tsx` (no `"use client"`, unused) **deleted**; sole authority = `src/components/ui/blur-text.tsx`
  - Two strict-mode (`noUncheckedIndexedAccess`) fixes in `blur-text.tsx` found by `next build`: `buildKeyframes` carry-forward + IntersectionObserver `entry?.` guard (no `any`/`ts-ignore`)
  - `.ua/` excluded from ESLint scan; `.agent/`/`.agents/`/`skills-lock.json` (local skill tooling) gitignored
- **Design System Changes:** `tokens.css` (surface-hover, editorial motion vars, glow-soft/strong, typography anchors), `globals.css` (surface-hover in @theme, .text-display, .text-headline, .label-mono helpers, subtle scrollbar, refined selection color)
- **Component Redesigns:**
  - `hero-section.tsx`: asymmetric split (left content 60% / right tech cluster 40%), BlurText H1 word entrance, availability badge, tech cluster with glow, vertical rule desktop-only
  - `public-header.tsx`: transparent→blur on scroll (40px threshold), layoutId spring nav indicator, 68px height, brand with cyan dot
  - `public-footer.tsx`: minimal hairline footer, social links as mono-label pills
  - `section-heading.tsx`: removed eyebrow pattern, optional counter glyph inline with headline
  - `focus-section.tsx`: editorial large prose (text-xl/2xl), focus areas as pills not cards
  - `featured-projects-section.tsx`: client component, hover lift+glow on cards, designed empty state
  - `tech-matrix-section.tsx`: group label as mono, larger logos (44px), hairline divider above section
  - `principles-section.tsx`: manifesto numbered list layout (not card grid)
  - `contact-cta-section.tsx`: left-aligned horizontal banner (not centered card)
  - `project-card.tsx`: bold sans title, ArrowUpRight indicator, surface-hover on hover
  - `page-header.tsx`: font-bold tracking-tight (no italic)
  - `markdown.tsx`: font-bold tracking-tight headings
  - All inner pages: fixed font-display italic → font-bold tracking-tight
  - Empty states: designed dashed-border cards (not bare text)
- **DONE this session:** branch created (carried WIP off `integration`), lockfile reconciled, static validation matrix GREEN, checkpoint committed + pushed.
- **BLOCKING NEXT (runtime):** resolve `pnpm dev` env-validation defect *"Invalid server environment configuration: DATABASE_URL"* → local runtime smoke (`/vi`, `/en`, inner pages) must PASS before continuing.
- **THEN:** redesign consistency/polish → browser QA at `/vi`, `/en`, mobile 375px → `pnpm e2e:public`.
- **Still gated (operator):** `pnpm e2e:auth-setup` (authenticated E2E) + Vercel Preview deploy.
- **Next Waves:** Wave 06A (Contact write boundary + Turnstile), Wave 07A (Vercel Preview pipeline)

## Wave 04 Phase 2 — Runtime Recovery + Single Landing (Prompts 10–11)
- **Branch/HEAD:** `feat/wave-04-phase-2-public-visual-redesign` @ `a151bf1` (remote-safe; remote == local). History: `473a683` (redesign checkpoint) → `14083d1` (env governance) → `a151bf1` (single-landing consolidation).
- **Runtime Recovery (Prompt 10) = RESOLVED:** the earlier "Invalid server environment configuration: DATABASE_URL" was a clobbered `.env.local` (only `VERCEL_OIDC_TOKEN`), NOT a code defect. Owner rotated the Neon **Development** credential and restored `.env.local`. Verified (masked): env contract 9/9, `check:env` 18/0, Neon live fingerprint matches dev baseline (25 tables, ledger=6, 1 active `owner_admin`), dev smoke `/vi /en /vi/projects /vi/articles` all 200 no-500, public E2E green. Governance rule `ENV_LOCAL_OWNER_MANAGED_STATE` added to `CLAUDE.md §20` (committed `14083d1`).
- **Single Landing (Prompt 11) = DONE:** `/vi` and `/en` are one landing per locale with anchored sections `#home #about #focus #projects #experience #skills #principles #articles #contact` + locale-aware anchor nav (IntersectionObserver scroll-spy). New sections About / Experience & Education / Latest Articles compose the former `/about /resume /articles` content from the SAME live Neon read model (FULL_LIVE_NEON, honest empty states). `/about /projects /articles /resume /contact` now redirect to `/#anchor` (Next hash-redirect = 200 meta-refresh, browser-honored). `/projects/[slug]` + `/articles/[slug]` preserved (back-links → anchors). `#contact` exposes real email + social links (contact form deferred to Wave 06A, never faked). sitemap = locale root + published detail routes only.
- **Validation (Prompt 11, all GREEN):** `check:env` 18/0 · typecheck · lint · test 184/6 · arch 10/10 · secret-free `next build` · `git diff --check` · public E2E **7/7** (suite legitimately reshaped for single-landing) · dev smoke (9 anchors present, redirects reach sections, `/admin`→`/admin-login` deny, no 500). No DB migration, no schema/auth/admin change — presentation + routing only.
- **Now-unused (kept, not deleted; may return in Prompt 12):** `components/public/page-header.tsx`, `components/public/project-card.tsx`, `components/public/contact-form.tsx` (Wave 06A). Local-only assets staged for Prompt 12: `src/components/public/image/{logo_myself.jpg,vantho.png}` (untracked).
- **Understand-Anything:** full `/understand` re-run intentionally DEFERRED (the graph would go stale again after Prompt 12 visual work); flows mapped from code evidence this prompt. Refresh once after the visual system settles.
- **PENDING (operator gates, unchanged):** authenticated E2E (`pnpm e2e:auth-setup`) + Vercel Preview.
- **Prompt 12 target:** BRAND VISUAL SYSTEM — logo palette (blue+gold on black, from `logo_myself.jpg`), `vantho.png` hero portrait, hero + all landing sections, UI/UX Pro Max + Taste + selective React Bits, motion, responsive/a11y, visual QA.
  - **Candidate component sources (Owner-noted, reference only — NOT installed):** `@react-bits` (already in `components.json`) + `bklit-ui` shadcn registry (`https://raw.githubusercontent.com/bklit/bklit-ui/main/public/r/<component>.json`). Constraints locked by Owner for any add: **safety-review the JSON (component code + npm deps + license) before running `shadcn add`**; **max 1–3 components** each with explicit WHY_NEEDED/WHERE_USED/MOBILE_COST/REDUCED_MOTION; **animation authority stays `motion/react`** (never install `framer-motion`); presentation-only (no BE/DB/Auth contract change). Per §26 no external registry command is executed without that review.

## Wave 04 Phase 2 — Brand Visual System (Prompt 12)
- **Branch/HEAD:** `feat/wave-04-phase-2-public-visual-redesign` @ `3486324` (+ docs commit). History adds `3486324` on top of `682898b`.
- **Owner decisions (locked this prompt):** (1) **robust empty states first** — no seed, no fabricated projects/experience/skills/metrics; populated QA happens after Owner authors via Admin. (2) **Neon/Admin-only technology authority** — Skills renders empty until Admin data; frontend only maps canonical tech → rendering; no competing config inventory (hero tech cluster removed).
- **Delivered:** logo-derived brand system (electric blue + gold on black) in `tokens.css`/`globals.css` — `--brand-*` canonical + legacy aliases (no churn), full typography scale, spatial grammar, WCAG-AA. Portrait hero using real `vantho.png` (`components/public/visual/portrait-frame.tsx`) + orbital accent + BlurText. Section headings on `.text-h2`. Contact resolves real socials (GitHub fallback). Graceful empty-state fallbacks (`SITE.owner`, dict) — never fabricated. QA harness `scripts/qa-screenshot.mjs`.
- **Design ownership map (READ FIRST for future UI work):** `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md` — per-section owner file, data source, typography, motion, how-to-upgrade.
- **Data reality:** Neon Dev has 1 (empty) profile row, 0 published projects/articles/experiences/education/technologies. `getTechGroups()` structurally returns `[]` (no Neon source for capability groups). Profile table lacks headline/summary/socials columns → these default empty. **Owner must author content via Admin; then re-run populated visual QA.**
- **QA (Prompt 12):** Hero desktop 1440 + mobile 390 PASS (portrait/brand/typography); Principles PASS; Contact PASS; admin `/admin-login` PASS (no cosmic leak, brand-consistent, readable). Empty states on-brand. Validation: check:env 18/0 · typecheck · lint · test 184/6 · arch 10/10 · secret-free build · public E2E 7/7.
- **Understand-Anything:** full `/understand` refresh DEFERRED again (expensive; graph re-staled by Prompt 13 release work) — refresh once after main integration.
- **STOP after Prompt 12** — no authed E2E / Vercel Preview / PR / main merge (that is Prompt 13).
- **Prompt 13 target:** authenticated E2E → Vercel Preview → performance/a11y hardening → CI → final PR → merge to main → post-merge verification.

## Wave 04 Phase 2 — Prompt 12R Premium Interactive + CV-driven IA
- **Branch/HEAD:** `feat/wave-04-phase-2-public-visual-redesign` @ `e60b0f9` (LOCAL == REMOTE). History: `ed87e8a` (motion foundation + hero) → `839a214` (editorial About+Focus) → `3d93cd6` (owner portrait asset) → `e60b0f9` (CV-driven IA rebase).
- **Premium motion (Waves A–B, committed):** shared primitives `src/components/public/motion/` — `motion-tokens`, `cursor-halo` (desktop, touch/reduced-motion OFF), `interactions` (Magnetic + PointerTilt), `kinetic-text`, `intro-curtain`. Hero uses kinetic name + pointer-tilt portrait + magnetic CTAs + orbital; cursor halo + intro in `[locale]` layout. Design Brief: `docs/ui/PREMIUM_PORTFOLIO_DESIGN_BRIEF.md`.
- **Dependency gate:** CSS + motion/react = default; GSAP + R3F approved-but-DEFERRED (install only after QA proves need + Owner asks; R3F reconsideration point = Skills wave).
- **CV_SOURCE (2 real resumes read — Owner reference input, NOT staged):** name Hà Văn Thọ; NTTU Software Engineering 10/2022–present GPA 3.09/4.0; email havantho2004@gmail.com, GitHub KentTho, LinkedIn "Hà Văn Thọ"; **phone 0932077136 = PRIVATE** (public = email/GitHub/LinkedIn only). Awards: 2× Consolation (Data Science Challenge 2025, Software Engineering Competition 2025 — NTTU). **BBo Tech excluded** (CLAUDE.md §2). Projects: **ONLY Expense Tracker** (Mini CDP + Brand-Media-Platform excluded per Owner). Expense Tracker GitHub: `github.com/KentTho/Expense_Tracker_Web_Thesis`.
- **OWNER DECISIONS (locked):** (1) Expense Tracker = **MERGE both CVs, all features real** (Firebase+JWT+2FA TOTP, Service Layer, Alembic, Redis, Celery, race-condition atomic+SELECT FOR UPDATE, income/expense/transaction/budget/dashboard modules, deploy Vercel+Neon). (2) **Experience IS real — Owner will provide company name + dates + title** (currently `PENDING_OWNER_CONTENT`; do NOT fabricate). (3) Primary downloadable resume = **FULLSTACK** (`Hà_Văn_Thọ_Resume_FULLSTACK.pdf`).
- **IA rebase (Wave D, committed):** landing = `#home #about #projects #career #skills #contact` (was 9 → now 6, recruiter-first, shorter). Removed Focus/Principles/Articles from landing + deleted 3 orphan section components. `/resume`→`#career`, `/articles`→landing (article domain + detail routes preserved, no migration). Public E2E 7/7 on new anchors. typecheck/lint/build green.
- **PENDING (next exact steps):** (a) **§15 reference-image audit** — `docs/image_demo_portfolio/` (hero-section/About/Experience-Education/Education/portfolio.png) → REFERENCE_LAYOUT_MATRIX before visual rebuild. (b) **§14 content ingestion into Neon DEV** (verify APP_ENV=development first) — profile + Expense Tracker project + skills + education + awards via application/Admin boundary (no raw SQL bypass; only PDF-supported facts). (c) Wave E: Expense Tracker featured project + Career/Education/Awards. (d) Wave F: Skills/Credentials + Contact/Footer. (e) Wave G: cross-section choreography. (f) Wave H: populated QA + docs. (g) Experience details from Owner. (h) Resume download CTA wiring (Fullstack PDF — needs the PDF served; PDF is untracked owner input, decide serving path).
- **Orphan note:** `BlurText` (`components/ui/blur-text.tsx`) replaced by kinetic-text — proven orphan, remove in final sweep. `page-header.tsx`/`project-card.tsx`/`contact-form.tsx` still reserved.
- **Owner asset:** `vantho.png` OWNER_ASSET_CHANGE committed `3d93cd6` (never restore old).

