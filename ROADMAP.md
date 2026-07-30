# ROADMAP — portfolio_Van_Tho

> Living master status. Updated at the end of every Wave. For contribution rules see
> [`CLAUDE.md`](CLAUDE.md); for machine state see [`docs/ai/`](docs/ai/).
>
> **Last updated:** Wave 03R integration & target-proof phase (on branch
> `feat/wave-03-data-auth-storage`). This phase consolidates Wave 02/02B/03 toward
> `main` behind a minimal CI gate; it does **not** implement Wave 04.

## 1. Snapshot (branch/integration state — machine-precise)

| Field | Value |
|---|---|
| Repository | `github.com/KentTho/portfolio_Van_Tho` (public) |
| `PRODUCTION_BRANCH` | `main` @ `8b487c7` — **governance-only** (Wave 01); no application source yet |
| `ACTIVE_DEVELOPMENT_BRANCH` | `feat/wave-03-data-auth-storage` (Wave 03 + 03R hardening) |
| `PARENT_BRANCH` | `feat/wave-02-foundation` @ `a6d2a0d` (Wave 02 + 02B) |
| `REMOTE_FEATURE_HEAD` | `origin/feat/wave-03-data-auth-storage` (updated this phase) |
| `MAIN_INTEGRATION_STATUS` | **PENDING_PR_MERGE** — CI gate + Wave 02→main + Wave 03→main are PR-prepared, not merged (no `gh` locally; Owner clicks merge) |
| `TARGET_PROOF_STATUS` | **PENDING_OPERATOR** — keys present ≠ connectivity; no live Neon migration / OAuth / bucket proof run |
| `CI_STATUS` | branch `ci/wave-03r-baseline-gate` prepared (`.github/workflows/ci.yml`); **L0 until merged & green on `main`** |
| Stack | Next.js 16 · React 19 · TypeScript 5 (strict) · Tailwind v4 · pnpm · Neon · Supabase Auth/Storage · Vercel · Cloudflare DNS+Turnstile |
| Architecture | Feature-first modular monolith + Clean Architecture |
| Deploy authority | Vercel Git Integration · CI authority: GitHub Actions (minimal gate pulled forward from Wave 07) |

> **Reconciliation note (Wave 03R):** Wave 03 is a **remote feature branch updated**, not
> "main-landed". `main` stays governance-only until the PRs merge. History is not rewritten.

## 2. Wave status

| Wave | Scope | Status | Evidence |
|---|---|---|---|
| 00 Audit | Read-only forensic | ✅ Done | greenfield verified |
| 01 Architecture & Governance | CLAUDE.md, ADRs, threat model, data model, docs | ✅ Landed `main 8b487c7` | 38 files |
| 02 Foundation | Next.js app, strict TS, tokens, env validation, arch enforcement, skeletons | ✅ `FOUNDATION_LOCAL_PASS` `711e13f` | typecheck/lint/test/build green |
| 02B Skill intake & reconciliation | 3 README audit, selective adoption, env verify, arch-test strengthen, ROADMAP | ✅ `a6d2a0d` | see `docs/skills/` |
| 03 Data/Auth/Storage | Neon+Drizzle schema/migrations, Supabase SSR Auth (GitHub OAuth) + admin authz, storage policies, repos, audit, middleware | ✅ `DATA_AUTH_LOCAL_PASS` (target proof pending) | schema+migration generated offline; auth policy unit-proven |
| 03R Integration & target proof | Consolidate 02/02B/03→main behind minimal CI; storage authority correction (server-mediated); DB content-gap matrix; progress matrices; dev target proof | 🔄 **CURRENT** — local hardening done; merges/target proof = operator | 35/35 tests; storage server-mediated + unit-proven |
| 04 Public experience | pages, case study, blog, i18n, SEO, a11y, responsive | 🔒 gated on 03R main-integration | — |
| 05 Admin CMS | dashboard, CRUD, draft/publish, media, revisions, inbox, audit UI | 🔒 planned | — |
| 06 Integrations | contact, Turnstile, email, video, analytics, error tracking | 🔒 planned | email keys pending |
| 07 CI/CD | GitHub Actions, env contracts, Neon preview branching, runbooks | 🔒 planned | — |
| 08 Hardening | unit/integration/e2e/a11y/security, prod build, preview smoke, scans | 🔒 planned | — |
| 09 Land & remote | consolidation | 🔒 planned | per-wave PR model |
| 10 Deployment readiness | human runbook, preview/migration/rollback proof | 🔒 planned | — |

## 3. Capability levels (L0–L7)

| Capability | Level |
|---|---|
| Application foundation · Design system · Architecture enforcement | **L3** (offline proven) |
| Admin authorization policy | **L3** (unit-proven, pure) |
| Media upload authorization (server-mediated) | **L3** (pure policy + use-case unit-proven; live signing = target-proof pending) |
| Database · Auth · Storage (integration) | **L1–L2** source present + migration generated; live connectivity = **target proof pending** |
| Public content · Admin content operations | **L1** (skeleton/shell + protected route) |
| CI · Preview · Production | **L0** (CI branch prepared, not yet merged/green on `main`) |

## 4. Owner-confirmed decisions

Next.js modular monolith · Neon single primary DB · Supabase Auth (GitHub OAuth) + Storage · Vercel CD · Cloudflare DNS-only + Turnstile · bilingual vi/en (default vi) · per-Wave feature branch + PR, AI never auto-merges. Full log: [`docs/ai/DECISION_LOG.md`](docs/ai/DECISION_LOG.md).

## 5. Environment status (names only, no values)

- `.env.local`: present, **gitignored, untracked** (safe). Verify anytime with `pnpm check:env`.
- Wave 03 keys (Neon `DATABASE_URL`/`_UNPOOLED`, Supabase URL/publishable/secret): **PRESENT** — presence ≠ connectivity.
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

### Merge order for Owner (no `gh` locally → click merge in GitHub UI)
1. `ci/wave-03r-baseline-gate` → `main` (establish gate first).
2. `feat/wave-02-foundation` → `main` (Wave 02 + 02B).
3. `feat/wave-03-data-auth-storage` → `main` (Wave 03 + 03R), after (2) merges.

## 8. Next step (Wave 04, gated) — Public experience
Only after 02/02B/03 are on `main`, CI is green, and storage authority is resolved: public pages
(`/[locale]`, about, projects + case study, articles, resume, contact UI), i18n (vi/en), SEO
metadata/sitemap/robots, accessibility, responsive. Read published data via repositories/ports.
Verdict target: `PUBLIC_EXPERIENCE_LOCAL_PASS`. Branch `feat/wave-04-public-portfolio` **from verified `main`**.

## 9. Standing guardrails

Exact-path staging · no force/rewrite · no auto-merge · no prod/DNS mutation · no secret in VCS/logs · preview ≠ prod secrets · capability levels advance one step · no fabricated content/metrics · verify latest **stable** versions at install time.
