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
