# Implementation plan (Wave roadmap)

One Wave per session where practical. Each Wave: scope-lock → implement → validate → land (branch+PR+CI) → stop for human review.

| Wave | Goal | Branch | Expected verdict |
|---|---|---|---|
| 00 | Read-only forensic audit | — | READ_ONLY_AUDIT_PASS_WITH_GAPS ✅ |
| 01 | Architecture & governance (docs) | `docs/wave-01-architecture-governance` | DESIGN_READY_FOR_REVIEW ◀ current |
| 02 | Foundation (Next.js, strict TS, tokens, env validation, test harness, arch enforcement) | `feat/wave-02-foundation` | FOUNDATION_LOCAL_PASS |
| 03 | Data/Auth/Storage (Neon schema+migrations, Drizzle repos, Supabase Auth, storage policies, audit) | `feat/wave-03-data-auth-storage` | DATA_AUTH_LOCAL_PASS_WITH_TARGET_PROOF_PENDING |
| 04 | Public experience (pages, case study, blog, i18n, SEO, a11y, responsive) | `feat/wave-04-public-portfolio` | PUBLIC_EXPERIENCE_LOCAL_PASS |
| 05 | Admin content operations (CRUD, draft/publish, preview, media, revisions, inbox, audit UI) | `feat/wave-05-admin-cms` | ADMIN_CONTENT_OPERATIONS_LOCAL_PASS |
| 06 | Integrations (contact, Turnstile, email adapter, video embeds, analytics, error tracking) | `feat/wave-06-integrations` | INTEGRATIONS_LOCAL_PASS_TARGET_CONFIG_PENDING |
| 07 | CI/CD infra (GitHub Actions, env contracts, Neon preview branching, runbooks) | `ci/wave-07-ci-cd` | CI_CD_AND_DEPLOYMENT_READINESS_DESIGN_PASS |
| 08 | Hardening & validation (unit/integration/e2e/a11y/security, prod build, preview smoke, scans) | `test/wave-08-hardening` | VALIDATION_PASS_WITH_DEFERRED_PRODUCTION_PROOF |
| 09 | Land & remote (consolidation if needed) | per-wave already landed | LAND_PASS |
| 10 | Deployment readiness (human runbook, preview/migration/rollback proof) | — | RUNBOOK_READY_FOR_HUMAN_REVIEW |

## Guardrails carried through every Wave
Exact-path staging · no force/rewrite · no auto-merge · no prod/DNS mutation · preview never uses prod secrets · no overclaim · capability levels advance one step at a time.

## Version policy
At Wave 02 verify latest **stable** versions of Next.js/React/Tailwind/Drizzle/Supabase libs at implementation time (no canary, no hardcoding from memory), pin via `pnpm-lock.yaml`, record toolchain versions.
