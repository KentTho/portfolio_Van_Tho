# CLAUDE.md — portfolio_Van_Tho

> Governance contract for AI/human contributors. Read this first, every session.
> This file is authoritative for HOW we build. Architecture detail lives in `docs/architecture/`.

---

## 1. Project purpose

`portfolio_Van_Tho` is a **personal engineering evidence platform** for Van Tho. It must:

- Let visitors verify engineering capability quickly (projects, case studies, video demos, GitHub links).
- Let the Owner update **all** portfolio content via an Admin dashboard **without editing source code**.
- Prove engineering discipline: Clean Architecture, tests, Git workflow, CI/CD, security, observability, rollback.

The portfolio is itself the primary evidence of the skills it claims.

## 2. Non-goals

- No decorative complexity: no gratuitous animation, badge-stuffing, or fake "enterprise" layers.
- No fabricated content: no invented metrics, testimonials, customers, or results without evidence.
- No third-party/company confidential data (explicitly **no BBOTech** brand, data, or positioning).
- No public user accounts in V1 (visitor-only public experience).
- No premature services: no Redis, Kafka, k8s, microservices, GraphQL, realtime, FastAPI/Django in V1.

## 3. Architecture (summary)

Feature-first **modular monolith** on Next.js App Router with **Clean Architecture** boundaries.
One backend authority (Next.js on Vercel). One primary database (Neon PostgreSQL).
Full detail: `docs/architecture/`. Decisions: `docs/architecture/adr/`.

## 4. Dependency rules (enforced)

```
presentation ──▶ application ──▶ domain
infrastructure ──▶ (implements) application/domain contracts
domain ──▶ (nothing framework/provider specific)
```

- `domain/` MUST NOT import: `next/*`, `react`, `drizzle`, postgres client, `@supabase/*`, Vercel/Cloudflare SDKs, `process.env`, browser APIs, Node `fs`, UI components.
- `application/` may import: domain entities, repository/service **interfaces (ports)**, DTOs, pure validators. MUST NOT import concrete repositories, Supabase client, Next request/response, or React.
- `infrastructure/` implements ports (Neon repos, Supabase Auth/Storage adapters, email, Turnstile, logging).
- `presentation/` owns pages, route handlers, server actions, React components, view models.
- Enforced by ESLint import rules + dependency-cruiser + `tests/architecture/`. See `docs/architecture/dependency-rules.md`.

## 5. Module ownership

Feature modules under `src/modules/<name>/{domain,application,infrastructure,presentation}`:
`identity, profile, projects, articles, experience, skills, media, contact, site-settings, revisions, audit`.
Cross-cutting infra under `src/infrastructure/`. Shared kernel under `src/shared/`.

## 6. Directory conventions

- `src/app` stays at the Next.js conventional location (NEVER inside a numbered `4_presentation`).
- No numbered folders (`1_domain` etc.). Use named layers inside feature modules.
- Do not create empty directories to match the target tree — create a directory only when its Wave needs it.
- No `wrangler.toml`, Docker, or k8s files without an approved runtime use case.

## 7. Naming conventions

- Files: `kebab-case` (unless framework convention forces otherwise).
- React components: `PascalCase` export. Functions/variables: `camelCase`. Types/interfaces: `PascalCase`.
- Database identifiers: `snake_case`. Env vars: `UPPER_SNAKE_CASE`. Route slugs: `kebab-case`.
- Test names: behavioral language ("returns 404 when project is draft").

## 8. TypeScript rules

- `strict: true`. No unexplained `any`. No unsafe type assertions at trust boundaries.
- Validate external input (forms, params, env) with schemas; never trust client-provided roles/flags.
- Prefer explicit domain error types over throwing strings.

## 9. React / Next.js rules

- Server Components by default. `"use client"` only when interactivity requires it.
- Server Actions for trusted UI mutations; Route Handlers for contact/auth-callback/signed-upload/health/webhook boundaries.
- Node runtime by default for DB/auth. Edge only after dependency compatibility is proven.

## 10. Server/client boundary

- Never import server-only modules (DB client, secret env, Supabase service key) into client components.
- `NEXT_PUBLIC_*` only for values safe in the browser bundle. Service/secret keys are server-only.
- Public responses must not leak Admin session, drafts, or private URLs.

## 11. Database rules

- Neon PostgreSQL is the **single primary application database**. Drizzle ORM + Drizzle Kit.
- UUID PKs, `timestamptz`, `created_at`/`updated_at`, explicit enums/checks, FKs within Neon only.
- No cross-database FK from Neon to Supabase Auth — store `supabase_auth_user_id` as an external reference.
- Public repositories NEVER return draft/private/unlisted rows. Transactions for multi-table writes.
- Pooled connection at runtime; direct/unpooled connection only for approved migrations.

## 12. Migration rules

- Migrations are forward-only in normal operation. No destructive migration during app startup.
- No `db push` against shared/production DB. No blind retry, no auto down-migrate, no reset.
- Schema/migration PRs run against an isolated Neon preview branch (Wave 07 `migration-check.yml`).

## 13. Auth & authorization rules

- Supabase Auth is the identity provider. **GitHub OAuth** for Admin (Owner-confirmed). No public admin signup.
- Admin access = allow-list (`ADMIN_ALLOWED_EMAILS`) + `app_users.role=owner_admin` + `status=active`, verified server-side.
- Deny by default. Permission checked per use case. Never trust role/flags from client. Fail closed.
- Logout local + global; `credentials_revoked_at` on global logout. Document access-token TTL limitation honestly.

## 14. Storage rules

- Supabase Storage. `portfolio-public` (public read, admin write) vs `portfolio-private` (signed URL only).
- Server verifies role + bucket + path + MIME + size before issuing signed upload. Never trust original filename.
- SVG disallowed by default. Service key never in the browser. Media deletion is reference-aware.

## 15. Security rules

See `docs/security/`. Highlights: validate at boundary, sanitize rendered markdown (no raw HTML/js:/data: URLs),
CSP without `unsafe-inline` where feasible, CSRF origin checks, rate limits, Turnstile on contact, redacted logs.

## 16. Testing commands

Placeholder until Wave 02 wires the harness. Target scripts (pnpm):
`pnpm lint`, `pnpm typecheck`, `pnpm test` (Vitest), `pnpm test:arch`, `pnpm e2e` (Playwright), `pnpm test:a11y`.

## 17. Build commands

`pnpm build` (Next.js production build). `pnpm check:env` (env schema validation).

## 18. Git rules

- Package manager: **pnpm**. Node pinned via `.node-version`.
- Branch per Wave: `docs/wave-01-architecture-governance`, `feat/wave-02-foundation`, … (see `docs/ai/CURRENT_SCOPE.md`).
- Conventional Commits. Stage **exact paths** only: `git add -- path`. NEVER `git add .`/`-A`/`commit -a`.
- Forbidden without explicit per-instance approval: force push, history rewrite, reset --hard, clean, stash, rebase, merge, cherry-pick, amend, delete remote branch/tag, change visibility/secrets/branch-protection, merge PR, deploy prod, DNS/domain change, prod DB migration.
- After `main` exists: all changes via feature branch + PR. AI stops at `PR_READY_FOR_HUMAN_REVIEW_AND_MERGE`; human merges.

## 19. Scope lock

Before any mutation, declare `CURRENT_WAVE`, intended add/modify/delete paths, protected paths, out-of-scope, validation plan (see `docs/ai/CURRENT_SCOPE.md`). New path outside scope → `STOP_SCOPE_EXPANSION_REQUIRES_REVIEW`.

## 20. Secret handling

- `.env*` ignored except `.env.example` (placeholders only). No real secret in repo, logs, README, screenshots, or client bundle.
- Redact credential-bearing remotes. Never log tokens/cookies/passwords/DB URLs/service keys/raw auth headers.

## 21. Output / evidence format

Every Wave report follows the 37-section format (see project prompt §AJ). Never claim PASS without command output from the current baseline. State skipped suites and their evidence owner. No "DONE/100%/production-ready" without evidence.

## 22. Context / handoff workflow

Session start reads only: this file, `docs/ai/PROJECT_STATE.md`, `CURRENT_SCOPE.md`, `NEXT_PHASE.md`, relevant ADRs, current-Wave files, Git state. Do not re-read the whole repo each turn. Update `docs/ai/HANDOFF.md` at a safe boundary before ending a session.

## 23. Stop conditions

Honor all `STOP_*` conditions in the project prompt §AI. STOP is a safe outcome — never self-override a STOP.

## 24. Definition of Done (per Wave)

Local validation PASS with real output; exact commit created; feature branch pushed & remote-verified; PR opened (once main exists); required GitHub Actions green (from Wave 07); no secrets; no unexpected/protected-path changes; no overclaim. Capability levels advance one step at a time (L0→L7), never skipped.

## 25. Acceptable vs unacceptable patches

**Acceptable:** small, in-scope, typed, tested; domain free of framework imports; explicit errors; exact-path staging; honest evidence.
**Unacceptable:** global reformat; unrelated refactor/rename spree; broad dependency bumps; `any` at boundaries; provider SDK in domain; fake data/metrics; `git add .`; committing secrets; claiming untested code works.

---

### Code quality (always)

Pure domain logic; explicit error types; no hidden side effects; no provider SDK in domain; no `utils.ts` dumping ground; no circular deps; no speculative abstraction; comments explain *why/architecture*, not obvious syntax; no `TODO` without owner+reason.
