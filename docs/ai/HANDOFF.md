# HANDOFF

## Completed
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

## Next-phase capsule
`WAVE_04_PUBLIC_EXPERIENCE` on `feat/wave-04-public-portfolio`. See `NEXT_PHASE.md`.
