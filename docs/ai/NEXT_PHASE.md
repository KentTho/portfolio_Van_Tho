# NEXT_PHASE

## NEXT_PHASE_NAME
`WAVE_02_FOUNDATION`

## WHY_NOW
Architecture, governance, data model, threat model, and ADRs are captured and review-ready. The next value step is a runnable foundation that enforces those boundaries in code.

## PRECONDITIONS
- Wave 01 PR reviewed/merged by Owner (or Owner approves proceeding on the feature branch).
- Latest stable versions of Next.js/React/Tailwind verified at implementation time (do not hardcode from memory).

## ALLOWED_ACTIONS
- `pnpm` bootstrap of Next.js (App Router, strict TS), Tailwind + design tokens, shadcn/ui init.
- ESLint + import-boundary rules + dependency-cruiser + `tests/architecture` harness.
- `src/config/env.ts` env validation (server/client split, fail-closed).
- Base public/admin layout skeletons. Local production build proof.

## FORBIDDEN_ACTIONS
- No data/auth/storage integration (Wave 03). No external service provisioning. No secrets. No deployment. No DNS.

## EXPECTED_VERDICT
`FOUNDATION_LOCAL_PASS`

## WHAT_IT_UNLOCKS
A typed, lint-clean, architecture-enforced base on which data/auth/storage and features can be built without vibe coding.
