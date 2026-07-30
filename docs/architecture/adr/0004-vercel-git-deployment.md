# ADR-0004 — Vercel Git Integration for deployment; GitHub Actions for CI

- Status: Accepted
- Deciders: Owner, engineering

## Context
We must avoid two systems both claiming deployment authority (`STOP_DUPLICATE_DEPLOYMENT_AUTHORITY`).

## Decision
**GitHub Actions** is the CI authority (lint, typecheck, unit/arch tests, build, security, migration checks). **Vercel Git Integration** is the deployment authority: Preview per PR/branch, Production from `main`. No duplicate deploy jobs in Actions.

## Consequences
- (+) Clear split: Actions gates quality; Vercel ships. Deployment checks can depend on required CI status.
- (+) Preview environments enable per-PR verification (with non-production Auth/DB).
- (−) Vercel coupling; acceptable for V1, revisitable later.

## Guardrails
Production promotion stays human-governed. No production DB migration inside deploy. Preview never uses production secrets (`STOP_PREVIEW_USING_PRODUCTION_SECRET`).
