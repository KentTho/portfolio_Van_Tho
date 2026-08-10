# HANDOFF

## Completed
- **Wave 05 — Final Foundation Gate** (branch `integration/pre-fe-foundation` @ `cde8b49`, từ verified `e7f8e02`): ✅ **`OWNER_ADMIN_DEV_AUTH_VERIFIED`** — Owner hoàn tất GitHub OAuth; `bootstrapOwnerAdmin` cấp 1 hàng `app_users`=`owner_admin`/`active` (Supabase UID + last_login, not revoked; kiểm chứng read-only đã che định danh trên Neon). Negative authz unit-proven. **Integration merge:** hợp nhất Wave-04 public presentation (`94f547e`) với foundation Wave-05 — presentation không chồng lấn, chỉ 2 doc conflict (reconciled), middleware auto-combine auth-gate + locale-routing, thêm dep `motion` (frozen lockfile consistent). Validation trên integration: **179 test + 6 skip · 10 arch · build xanh** (routes `[locale]/*` SSG + admin). DB truth re-verified: 25 bảng, ledger=6, no drift. Thêm `docs/ai/WORKING_METHOD.md` (quy trình + toàn bộ luật). **Open decision (chờ Owner):** chiến lược dữ liệu trang công khai — live Neon read model vs fixtures (Neon Dev ~0 published; types W04 song ngữ + case-study chưa map 1:1). **PENDING_OPERATOR:** Vercel Preview deploy; authenticated Playwright E2E (cần storageState từ OAuth headed). Production vẫn khoá.
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
