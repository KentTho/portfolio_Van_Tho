# NEXT_PHASE

## NEXT_PHASE_NAME
`WAVE_03_DATA_AUTH_STORAGE`

## WHY_NOW
The application foundation, strict typing, runtime env-validation boundary, and architecture enforcement are proven locally (Wave 02: typecheck/lint/test/arch/build all green). The next value step is a secure persistent backend and the Owner-Admin identity boundary.

## PRECONDITIONS
- Owner reviews the Wave 02 branch/PR.
- Neon **development** project connection prepared securely (never pasted into chat or committed).
- Supabase **development** project prepared securely (URL + keys as env, not in VCS).
- Exact Wave 03 scope approved.

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
