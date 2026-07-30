# CURRENT_SCOPE

## CURRENT_WAVE
`WAVE_03R_INTEGRATION_AND_TARGET_PROOF` — consolidate Wave 02/02B/03 toward `main` behind a
minimal CI gate; correct storage authority (server-mediated); audit DB content gaps; publish
progress matrices; classify env + attempt dev target proof. **No Wave 04 (public UI) here.**
Delivered on `feat/wave-03-data-auth-storage` (+ CI on `ci/wave-03r-baseline-gate`).

## Wave 03R allowed paths (this phase)
`src/modules/media/**`, `src/composition/media.ts`, `src/app/api/media/upload-url/route.ts`,
`src/config/permissions.ts`, `src/infrastructure/supabase/storage-client.ts`,
`supabase/migrations/storage-policies.sql`, `tests/unit/media-*.test.ts`,
`tests/unit/authorize-media-upload.test.ts`, `tests/architecture/server-only-boundary.test.ts`,
`.github/workflows/ci.yml` (CI branch only), `ROADMAP.md`, `docs/status/**`, `docs/ai/**`.

## Prior wave reference (delivered)
`WAVE_03_DATA_AUTH_STORAGE` on `feat/wave-03-data-auth-storage` (stacked on `feat/wave-02-foundation`).
Next after main-integration: `WAVE_04_PUBLIC_EXPERIENCE`.

## Branch
`feat/wave-03-data-auth-storage` (from `feat/wave-02-foundation` @ `a6d2a0d`, Owner-authorized stack). PR-only into `main`; AI does not merge; no direct main pushes.

## Wave 03 allowed paths (delivered)
`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `drizzle.config.ts`, `src/config/env.ts` + `env.server.ts` + `permissions.ts`, `src/infrastructure/**`, `src/modules/identity/**`, `src/composition/**`, `src/middleware.ts`, `src/app/{admin,admin-login,auth}/**`, `src/components/layout/admin-shell.tsx`, `supabase/migrations/storage-policies.sql`, `tests/**`, `ROADMAP.md`, `docs/ai/**`.

## Protected paths (unchanged this Wave)
`.github/**`, `infra/**`, `docs/architecture/**`, `docs/security/**`, `docs/skills/**`, Git history, `main`, production config, real env files (`.env.local`), README sources, `.claude/settings.local.json`.

## Out of scope this Wave (deferred)
Live Neon migration apply, live Supabase OAuth end-to-end, storage bucket creation, owner seed (all = target proof). Project/article/contact CRUD (Wave 05), public pages/i18n/SEO (Wave 04), Turnstile/email/analytics (Wave 06), GitHub Actions (Wave 07).

## Validation plan (executed)
`pnpm typecheck` ✅ · `pnpm lint` ✅ · `pnpm test` (17/17) ✅ · `pnpm test:architecture` (6/6) ✅ · `pnpm build` ✅ · `pnpm db:generate` ✅ (offline) · git diff + secret scan ✅.

## Next scope (Wave 04 — not started)
Branch `feat/wave-04-public-portfolio`. Public pages, i18n routing (vi/en), SEO, accessibility, responsive; read published data via ports.
