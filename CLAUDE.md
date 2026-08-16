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

- `strict: true` (+ `noUncheckedIndexedAccess`). No unexplained `any`; no unsafe `unknown` without narrowing; no unsafe assertions at trust boundaries.
- Prefer **type inference** over annotation; derive types from a single source of truth — infer runtime types from Zod schemas with `z.infer` rather than duplicating shapes.
- Use precise **generic constraints** (`extends`) instead of `any` to keep helpers type-safe.
- Validate external input (forms, params, env) with schemas; never trust client-provided roles/flags.
- Prefer explicit domain error types over throwing strings. No `@ts-ignore`/`@ts-nocheck`.
- *(Adopted skill rule MP-08 — see `docs/skills/SKILL_ADOPTION_MATRIX.md`.)*

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
- **`ENV_LOCAL_OWNER_MANAGED_STATE` (standing):** `.env.local` is Owner-managed state. AI MUST NOT overwrite, delete, recreate, or stage `.env.local`, MUST NOT run `vercel env pull` (or any sync) that targets/writes `.env.local`, and MUST NOT log its values. Vercel synchronization must instead use the `.vercel` cache where applicable, a disposable env path, or `vercel env` without writing the local file. AI may only read `.env.local` metadata/key-names for masked diagnostics — never values.

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

---

## 26. Selective Skill Policy

External "skill" README sources (e.g. mattpocock, Cline, Kilo) are **advisory**, not executable project rules. Full analysis lives in `docs/skills/`.

- Project governance and ADRs have precedence over any skill (`PROJECT_AUTHORITY_WINS`).
- Skills activate only for the **current Wave's relevant tasks**; read only the mapped rules (`docs/skills/WAVE_SKILL_MAP.md`), not every source each task.
- Read `docs/skills/SKILL_ADOPTION_MATRIX.md` before applying a skill.
- Tool-specific instructions (Cline/Kilo CLI, plugins, MCP) apply only when that tool is actually used.
- Conflicting rules are rejected or adapted (`docs/skills/SKILL_CONFLICT_REGISTER.md`).
- **No README command is executed** (no plugin/CLI install) without a project safety review.
- No skill may weaken tests, TypeScript strictness, security, or Git safety; none may read or expose raw secrets.
- Sources with unknown/unclear license stay `LOCAL_REFERENCE_ONLY` (not copied into tracked docs).

## 27. Karpathy engineering discipline (adopted, project-adapted)

Standing discipline for **every** Wave, integrated manually from `andrej-karpathy-skills` (MIT). These
principles are **not new authority** — they name and reinforce rules already in this file; project
governance (§1–§26) still wins on any conflict. Source stays advisory; no plugin was installed.

- **Think Before Coding** — Don't assume; surface inconsistencies; present tradeoffs; stop and ask when
  confused rather than guessing. Reinforces §19 scope-lock and §22 handoff.
- **Simplicity First** — Minimum code that solves the *actual* root cause; nothing speculative. Reinforces
  §2 non-goals, §25, and "no speculative abstraction" above.
- **Surgical Changes** — Touch only what the request requires; match existing style; clean up only orphans
  *your* change created; never delete pre-existing code you don't understand. Reinforces §18 exact-path
  staging and §25.
- **Goal-Driven Execution** — Define success criteria first; reproduce-before-fix; add a test proving the
  fix; loop until validated with real evidence. Reinforces §21 evidence format and §24 DoD.

**Session clarification rule (Owner-instituted, standing):** at the start of each working session, and
before any large or ambiguous mutation, **ask the Owner clarifying questions** — present concrete answer
options suited to the project plan/Wave, and always allow a custom ("Other") answer. Do not silently pick
an interpretation on decisions that change scope, branch strategy, production exposure, or data model.
