# ROADMAP — portfolio_Van_Tho

> Living master status. Updated at the end of every Wave. For contribution rules see
> [`CLAUDE.md`](CLAUDE.md); for machine state see [`docs/ai/`](docs/ai/).
>
> **Last updated:** end of Wave 02B (branch `feat/wave-02-foundation`).

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
| 02B Skill intake & reconciliation | 3 README audit, selective adoption, env verify, arch-test strengthen, ROADMAP | ✅ this phase | see `docs/skills/` |
| 03 Data/Auth/Storage | Neon+Drizzle schema/migrations, Supabase Auth (GitHub OAuth), storage policies, repos, audit | ⏭️ **NEXT** | keys PRESENT (not connectivity-proven) |
| 04 Public experience | pages, case study, blog, i18n, SEO, a11y, responsive | 🔒 planned | — |
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
| Public content · Admin content operations | **L1** (skeleton/shell) |
| Database · Auth · Storage · CI · Preview · Production | **L0** |

## 4. Owner-confirmed decisions

Next.js modular monolith · Neon single primary DB · Supabase Auth (GitHub OAuth) + Storage · Vercel CD · Cloudflare DNS-only + Turnstile · bilingual vi/en (default vi) · per-Wave feature branch + PR, AI never auto-merges. Full log: [`docs/ai/DECISION_LOG.md`](docs/ai/DECISION_LOG.md).

## 5. Environment status (names only, no values)

- `.env.local`: present, **gitignored, untracked** (safe). Verify anytime with `pnpm check:env`.
- Wave 03 keys (Neon `DATABASE_URL`/`_UNPOOLED`, Supabase URL/publishable/secret): **PRESENT** — presence ≠ connectivity.
- Turnstile keys: PRESENT. Email (`RESEND_API_KEY`/`CONTACT_TO_EMAIL`) + Sentry: partial/`PENDING_OPERATOR` → needed at Wave 06 (email) / when observability enabled.

## 6. Next step (Wave 03) — plan

**Branch:** `feat/wave-03-data-auth-storage` (feature-first; **numbered folders `src/1_domain` rejected** per ADR-0001).
**Do:**
1. Install `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `@supabase/ssr`, `@supabase/supabase-js` (+ `lucide-react` when UI needs icons).
2. Drizzle schema under `src/infrastructure/database/schema/**` (per `docs/architecture/data-model.md`) + Neon client (pooled runtime / unpooled migration) + generated migrations.
3. Supabase SSR Auth (GitHub OAuth) + admin authorization (allow-list + `app_users`), all server-verified; wrap server-only DB/auth with `import "server-only"`.
4. Supabase Storage client + bucket policies (public/private) + verify script.
5. Repositories implementing domain ports; audit foundation; integration tests on dev DB.
**Validate:** typecheck → lint → test → test:architecture → build. **Gate:** no prod migration; preview never uses prod secrets.
**Verdict target:** `DATA_AUTH_LOCAL_PASS_WITH_TARGET_PROOF_PENDING`.

## 7. Standing guardrails

Exact-path staging · no force/rewrite · no auto-merge · no prod/DNS mutation · no secret in VCS/logs · preview ≠ prod secrets · capability levels advance one step · no fabricated content/metrics · verify latest **stable** versions at install time.
