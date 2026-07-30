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

## Current capability levels

- Application foundation / Design system / Architecture enforcement: **L3_OFFLINE_PROVEN**.
- Admin authorization policy: **L3** (pure, unit-proven).
- Database / Auth / Storage integration: **L1–L2** (source + migration generated; live connectivity = target proof pending).
- Public content: **L1** (skeleton) · Admin content operations: **L1** (shell + protected route).
- CI / Preview / Production: **L0_NOT_PRESENT**.

## Environment state

No external services connected. No secrets provisioned. `.env.example` is a placeholder template only. Wave 02 builds and runs with no populated `.env`.
