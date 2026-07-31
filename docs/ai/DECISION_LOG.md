# DECISION_LOG

> Append-only record of decisions: what, alternatives, trade-offs, evidence, owner.

## D-001 — Backend topology: Next.js modular monolith
- **Decision:** Next.js App Router as both presentation and BFF; Server Components + Server Actions + Route Handlers; feature-first modular monolith with Clean Architecture.
- **Alternatives:** Next + FastAPI; Next + Django; microservices.
- **Trade-offs:** Monolith → one deploy authority, simpler auth, cheaper, easier to test/secure. Cost: future Python/RAG work must be split out later (kept possible via application ports).
- **Evidence/owner:** OWNER_CONFIRMED (2026-07-30). See ADR-0001.

## D-002 — Neon is the single primary database
- **Decision:** Neon PostgreSQL for all application data. Supabase only for Auth + Storage.
- **Alternatives:** Supabase Postgres as primary (dual authority).
- **Trade-offs:** Avoids dual-database authority ambiguity; clear ownership. Cost: identity mapping across two systems (`supabase_auth_user_id`, no cross-DB FK).
- **Evidence/owner:** Prompt contract + ADR-0002. Owner topology confirmation supports this.

## D-003 — Supabase Auth via GitHub OAuth for Admin
- **Decision:** GitHub OAuth, public admin signup OFF, allow-list + `app_users` role check server-side.
- **Alternatives:** Email OTP; password; both.
- **Trade-offs:** OAuth fits an engineer portfolio, fewer credentials to manage. Cost: depends on GitHub availability; MFA follows GitHub.
- **Evidence/owner:** OWNER_CONFIRMED (2026-07-30). See ADR-0003.

## D-004 — Bilingual VI + EN, default VI
- **Decision:** `*_translations` tables from day one; default locale `vi`.
- **Alternatives:** VI-only; EN-only.
- **Trade-offs:** Slightly more schema/UX now; avoids a costly retrofit later.
- **Evidence/owner:** OWNER_CONFIRMED (2026-07-30). See ADR-0006.

## D-005 — Vercel = deployment authority; GitHub Actions = CI authority
- **Decision:** No duplicate deploy jobs. Vercel Git Integration deploys; Actions gates quality.
- **Trade-offs:** Avoids `STOP_DUPLICATE_DEPLOYMENT_AUTHORITY`. Cost: Vercel-specific coupling (acceptable for V1).
- **Evidence/owner:** Prompt contract + ADR-0004.

## D-006 — Cloudflare DNS-only + Turnstile (no proxy/WAF in V1)
- **Decision:** DNS-only to Vercel; Turnstile for contact. Proxy/WAF only in a separate approved design phase.
- **Trade-offs:** Avoids double-proxy/cache pitfalls and false "WAF protects us" claims.
- **Evidence/owner:** Prompt contract + ADR-0005.

## D-013 — Wave 03 auth architecture (composition root + server-only)
- **Decision:** Presentation reaches persistence/auth only through a **composition root** (`src/composition/*`), never a concrete repository. Server-only secrets isolated in `env.server.ts` (`server-only`); DB/auth adapters import `server-only`. Neon uses the **neon-http** driver (lazy, no build-time connection). Migrations are **generated offline**; `db:migrate` is human-approved and never auto-run against prod.
- **Arch rule refinement:** presentation boundary test forbids importing the **database/repository** specifically (scenario 6), allowing standard Next+Supabase auth-client usage at the UI boundary.
- **Evidence/owner:** typecheck/lint/test(17)/arch(6)/build green; `src/composition/identity.ts`.

## D-014 — Wave 03 branch stacked on Wave 02 (Owner-authorized)
- **Decision:** `gh` absent → Owner authorized stacking `feat/wave-03-data-auth-storage` on `feat/wave-02-foundation` (explicit Git-strategy change per Wave 02B §S). When Wave 02 PR merges, Wave 03 follows.
- **Evidence/owner:** OWNER_CONFIRMED (2026-07-30).

## D-011 — Selective skill adoption (Wave 02B)
- **Decision:** Treat the 3 Owner README sources as advisory. Adopt only tool-neutral rules that align with project authority: strict TS inference / `z.infer` (mattpocock MP-08 → CLAUDE §8), selective skill activation + plan-then-act (cline/kilo), reinforce memory/exact-path/self-healing (already present). Full matrix in `docs/skills/`.
- **Rejected:** numbered folders (ADR-0001), Kilo `--auto` full-autonomy, README plugin/CLI auto-installs.
- **License:** mattpocock UNKNOWN → sources kept local-reference-only (not committed); cline Apache-2.0, kilo MIT.
- **Evidence/owner:** OWNER added sources 2026-07-30; `docs/skills/SKILL_ADOPTION_MATRIX.md`.

## D-012 — Wave 03 stays feature-first (numbered-layout request rejected)
- **Decision:** The secondary Wave 03 request used `src/1_domain`/`src/3_infrastructure`. This violates ADR-0001 + CLAUDE §6. Wave 03 will use `src/modules/<feature>/{domain,application,infrastructure,presentation}` + `src/infrastructure/*` cross-cutting adapters.
- **Evidence/owner:** ADR-0001; `docs/skills/SKILL_CONFLICT_REGISTER.md` C-01.

## D-008 — Wave 02 stack versions chosen for compatibility, not "latest"
- **Decision:** Use the version set produced by the official `create-next-app` generator (next 16.2.12, react 19.2.4, typescript 5.9.x, eslint 9.x) rather than the registry `latest` majors (TS 7, ESLint 10, React 19.2.8).
- **Alternatives:** Hand-pick registry `latest` for every package.
- **Trade-offs:** Generator set is a proven-compatible graph → reliable green build; slightly behind bleeding edge. Upgrades happen deliberately later with validation.
- **Evidence/owner:** Wave 02 execution; `pnpm build`/`typecheck`/`lint` PASS. Pinned via `pnpm-lock.yaml`.

## D-009 — Architecture enforcement via ESLint boundaries + Vitest graph test
- **Decision:** Enforce Clean Architecture with ESLint `no-restricted-imports` layer zones + a Vitest architecture test that scans the real import graph (with a fixture proving the detector works). dependency-cruiser deferred.
- **Trade-offs:** Fewer dependencies, deterministic and readable failures; slightly less exhaustive than a full dep-cruiser ruleset (revisit if modules grow complex).
- **Evidence/owner:** `tests/architecture/dependency-rules.test.ts` 3/3 PASS.

## D-010 — Next 16 removed the `eslint` build option
- **Decision:** `next.config.ts` keeps only `reactStrictMode`; lint is a standalone `pnpm lint` gate (Next 16 no longer runs ESLint during `next build`).
- **Evidence/owner:** typecheck error `TS2353 'eslint' does not exist in type 'NextConfig'` → removed; typecheck/build PASS.

## D-007 — Git workflow: per-Wave feature branch + PR; bootstrap main once
- **Decision:** Reconcile prompt §X (Wave 09 land) with Owner's per-Wave push policy → adopt per-Wave branch+PR+CI. Empty remote → one bootstrap commit to `main`, then PR-only.
- **Trade-offs:** Incremental CI feedback per Wave (better) vs one big land. AI never auto-merges; Owner merges.
- **Evidence/owner:** OWNER_CONFIRMED (2026-07-30), `REMOTE_EMPTY` verified.

## D-015 — Storage authorization is server-mediated; Neon stays the sole role authority (Wave 03R)
- **Decision:** Adopt `SERVER_MEDIATED_STORAGE_AUTHORIZATION`. The Next.js server verifies the Supabase session, checks active `owner_admin` in **Neon**, validates bucket/MIME/size/path (pure domain policy), then uses the server-only **service key** to mint a short-lived signed upload URL. `storage-policies.sql` no longer references the undefined `is_owner_admin()`; browser roles get **zero write** access (service key is RLS-exempt by design). New `src/modules/media/**` + `POST /api/media/upload-url` + `src/composition/media.ts`.
- **Alternatives:** Duplicate admin role into Supabase Postgres; custom JWT role claims. **Rejected** in V1 (dual authority / needs separate ADR).
- **Trade-offs:** All writes flow through the server (one authorization seam, easy to audit) at the cost of an extra request hop. SVG disallowed by default; object names generated (never trust client filename).
- **Evidence/owner:** `tests/unit/media-upload-policy.test.ts`, `tests/unit/authorize-media-upload.test.ts`, `tests/architecture/server-only-boundary.test.ts`; typecheck/lint/test(35)/build green. Live signing = target-proof pending.

## D-016 — Minimal CI gate pulled forward from Wave 07 (Wave 03R)
- **Decision:** Extract only a minimal `ci.yml` (lint/typecheck/test/arch/build + tracked-env check + candidate secret scan) onto branch `ci/wave-03r-baseline-gate` from `main`, so a quality gate exists **before** application source merges. The workflow tolerates the governance-only `main` (skips app gates when no `package.json`) — honest, not a fake-green. Advanced CI (preview DB branching, migration workflow, deploy/security/rollback) stays Wave 07.
- **Evidence/owner:** OWNER_AUTHORIZATION (Wave 03R prompt). `gh` absent locally → PR is prepared via compare URL; Owner performs the final merge click.

## D-017 — Main integration is PR-prepared, not landed; no auto-merge (Wave 03R)
- **Decision:** ROADMAP reconciled: `main` stays governance-only until PRs merge; Wave 03 is a *remote feature branch updated*, not "main-landed". Merge order: CI → main, then Wave 02 → main, then Wave 03 → main. AI prepares branches/PRs/URLs and stops at the merge click (no `gh`, no direct main push, no history rewrite).
- **Evidence/owner:** baseline preflight (main=8b487c7, 02=a6d2a0d, 03=e48a95f, 03 based on 02); `ROADMAP.md` §1 fields.

## D-018 — Main integration executed + development target proven; lazy env for secret-free build (Wave 03S)
- **Decision:** With explicit Owner authorization and a write-scoped `gh`, AI created and merged PRs #1/#2/#3 (CI → Wave 02 → Wave 03) as merge commits into `main` (`cf613ec`), CI green. This is a one-time, Owner-authorized extension of §18's "AI never auto-merges" for the integration of already-reviewed foundation branches; the per-Wave PR + human-merge model resumes for new work.
- **Build fix:** `next build` collects page data by importing route modules; eager `serverEnv` validation and eager `neon(DATABASE_URL)` made the build require real secrets and fail in CI. Fixed by lazy memoized env (`serverEnv` Proxy, `getAdminAllowedEmails()`), lazy `getDb()`, and `dynamic = "force-dynamic"` on the admin layout. Validation still runs at request time; no strictness weakened. Standard pattern.
- **Target class:** Neon target classified **DEVELOPMENT** from DB *state* (empty greenfield, 0 tables) + Neon host + Owner authorization — **not** from a variable name (honors the "don't infer from var name" rule). Additive-only migration applied; 8 tables + ledger + read/write/unique smoke verified. Supabase storage buckets created + signed-upload smoke verified.
- **Not done (honest):** live GitHub OAuth sign-in (Supabase has 0 users → owner row not seeded; no UID fabricated); Vercel Preview (not deployed); production (deliberately untouched). A malformed `psql '...'` DB URL in `.env.local` was normalized without printing values; a Neon credential surfaced in a pre-normalization driver error → **rotate**.
- **Evidence/owner:** OWNER_AUTHORIZATION (Wave 03S prompt, 2026-07-31). CI run `30601997949`; commits `833ed64` (fix), `cf613ec` (main). `PRE_FE_FOUNDATION_TARGET_VERIFIED_EXCEPT_PREVIEW`.
