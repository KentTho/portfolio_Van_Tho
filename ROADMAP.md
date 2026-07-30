# ROADMAP — portfolio_Van_Tho

> Living master status. Updated at the end of every Wave. For contribution rules see
> [`CLAUDE.md`](CLAUDE.md); for machine state see [`docs/ai/`](docs/ai/).
>
> **Last updated:** end of Wave 03 (branch `feat/wave-03-data-auth-storage`, stacked on `feat/wave-02-foundation`).

## 1. Snapshot

| Item | Value |
|---|---|
| Repository | `github.com/KentTho/portfolio_Van_Tho` (public) |
| Production branch | `main` @ `8b487c7` (governance baseline; unchanged) |
| Active branch | `feat/wave-02-foundation` (Wave 02 + 02B) |
| Stack | Next.js 16 · React 19 · TypeScript 5 (strict) · Tailwind v4 · pnpm · Neon (Wave 03) · Supabase Auth/Storage (Wave 03) · Vercel · Cloudflare DNS+Turnstile |
| Architecture | Feature-first modular monolith + Clean Architecture |
| Deploy authority | Vercel Git Integration · CI authority: GitHub Actions (Wave 07) |

## 2. Wave status

| Wave | Scope | Status | Evidence |
|---|---|---|---|
| 00 Audit | Read-only forensic | ✅ Done | greenfield verified |
| 01 Architecture & Governance | CLAUDE.md, ADRs, threat model, data model, docs | ✅ Landed `main 8b487c7` | 38 files |
| 02 Foundation | Next.js app, strict TS, tokens, env validation, arch enforcement, skeletons | ✅ `FOUNDATION_LOCAL_PASS` `711e13f` | typecheck/lint/test/build green |
| 02B Skill intake & reconciliation | 3 README audit, selective adoption, env verify, arch-test strengthen, ROADMAP | ✅ `a6d2a0d` | see `docs/skills/` |
| 03 Data/Auth/Storage | Neon+Drizzle schema/migrations, Supabase SSR Auth (GitHub OAuth) + admin authz, storage policies, repos, audit, middleware | ✅ `DATA_AUTH_LOCAL_PASS` (target proof pending) | schema+migration generated offline; auth policy unit-proven |
| 04 Public experience | pages, case study, blog, i18n, SEO, a11y, responsive | ⏭️ **NEXT** | — |
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
| Database · Auth · Storage (integration) | **L1–L2** source present + migration generated; live connectivity = **target proof pending** |
| Public content · Admin content operations | **L1** (skeleton/shell + protected route) |
| CI · Preview · Production | **L0** |

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

## 7. Next step (Wave 04) — Public experience
Public pages (`/[locale]`, about, projects + case study, articles, resume, contact UI), i18n routing (vi/en), SEO metadata/sitemap/robots, accessibility, responsive. Read published data via repositories/ports. Verdict target: `PUBLIC_EXPERIENCE_LOCAL_PASS`.

## 8. Standing guardrails

Exact-path staging · no force/rewrite · no auto-merge · no prod/DNS mutation · no secret in VCS/logs · preview ≠ prod secrets · capability levels advance one step · no fabricated content/metrics · verify latest **stable** versions at install time.
