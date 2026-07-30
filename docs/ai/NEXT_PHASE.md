# NEXT_PHASE

## NEXT_PHASE_NAME
`WAVE_03_DATA_AUTH_STORAGE`

## WHY_NOW
The application foundation, strict typing, runtime env-validation boundary, and architecture enforcement are proven locally (Wave 02: typecheck/lint/test/arch/build all green). The next value step is a secure persistent backend and the Owner-Admin identity boundary.

## PRECONDITIONS
- Owner reviews the Wave 02 / 02B branch/PR.
- Neon + Supabase dev keys in `.env.local` — **verified PRESENT** via `pnpm check:env` (presence ≠ connectivity; validated for real at Wave 03).
- Wave 03 branch is feature-first (`feat/wave-03-data-auth-storage`); numbered-folder layout rejected (ADR-0001).
- No raw secrets pasted into chat.

## GIT STRATEGY NOTE
Per Wave 02B §S, Wave 03 ideally branches from an updated `main` after the Wave 02/02B PR merges. Since `gh` is absent and Owner wants forward progress, Owner may authorize **stacking** `feat/wave-03-data-auth-storage` on `feat/wave-02-foundation` (explicit Git-strategy change) — otherwise wait for merge.

## ALLOWED_ACTIONS
- Neon schema + Drizzle ORM/Kit models and migrations (per `docs/architecture/data-model.md`).
- Repository implementations behind application ports; transaction helper.
- Supabase Auth (GitHub OAuth) SSR integration + admin authorization (allow-list + `app_users`).
- Supabase Storage bucket policies (public/private) + verification script.
- Audit-log foundation; integration tests against a dev/preview database.

## FORBIDDEN_ACTIONS
- No production DB migration; no `db push` on shared/prod. No prod secrets in preview. No deployment/DNS mutation. No GitHub Actions (Wave 07).

## EXPECTED_VERDICT
`DATA_AUTH_LOCAL_PASS_WITH_TARGET_PROOF_PENDING`

## WHAT_IT_UNLOCKS
A secure persistent backend and Owner-Admin identity boundary for the Public Portfolio (Wave 04) and Admin CMS (Wave 05).
