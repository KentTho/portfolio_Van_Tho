# CURRENT_SCOPE

## CURRENT_WAVE
`WAVE_02B_SKILL_INTAKE_AND_BRANCH_RECONCILIATION` — on `feat/wave-02-foundation` (adds skill governance + ROADMAP + strengthened arch test + safe env check to the Wave 02 branch). Next: `WAVE_03_DATA_AUTH_STORAGE`.

## Wave 02B allowed paths
`CLAUDE.md`, `ROADMAP.md`, `docs/skills/**`, `docs/ai/**`, `tests/architecture/**`, `scripts/check-env.mjs`, `package.json` (script only). NOT modifying: `docs/architecture/**`, `docs/security/**`, `src/**` feature code, env files, README sources (kept untracked).

## Branch
`feat/wave-02-foundation` (from `main` @ `8b487c7`). PR-only into `main`; no direct main pushes; AI does not merge.

## Wave 02 allowed paths (delivered)
`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `components.json`, `vitest.config.ts`, `.gitignore` (merge), `src/**`, `tests/**`, `docs/ai/**`.

## Protected paths (unchanged this Wave)
`.github/**`, `supabase/**`, `infra/**`, `docs/architecture/**`, `docs/security/**`, Git history, `main`, production config, real env files, `.claude/settings.local.json`.

## Out of scope this Wave (deferred)
Neon/Drizzle, Supabase Auth/Storage, admin/project/contact CRUD, Turnstile, email, analytics, Sentry, Cloudflare, Vercel deploy config, GitHub Actions, i18n routing, real personal content.

## Validation plan (executed)
`pnpm typecheck` ✅ · `pnpm lint` ✅ · `pnpm test` (7/7) ✅ · `pnpm test:architecture` (3/3) ✅ · `pnpm build` ✅ · git diff + secret scan ✅.

## Next scope (Wave 03 — not started)
Branch `feat/wave-03-data-auth-storage`. Requires Neon dev + Supabase dev project info supplied securely (never pasted into chat/committed).
