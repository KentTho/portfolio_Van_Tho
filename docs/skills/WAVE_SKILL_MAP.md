# Wave → skill map

Skills are context-triggered. For each Wave, read only the mapped rules.

| Wave | Relevant skill rules | Explicitly NOT active |
|---|---|---|
| 02 Foundation | MP-03, MP-06, MP-08, CL-02, CL-04/05, KI-01 | database/auth/UI/SEO rules |
| 02B Skill intake (this) | MP-07, KI-03, CL-05, X-01/02/03 | code-generation of features |
| 03 Data/Auth/Storage | MP-04 (TDD on repos/use-cases), MP-08 (Zod `z.infer` for schema/DTO), MP-05, KI-03 (security review), server-only boundary | UI/SEO/UX rules |
| 04 Public experience | MP-06, React/Next/a11y/SEO/UX (from general practice) | database schema changes |
| 05 Admin CMS | forms/validation/mutation-UX, MP-04, MP-08, KI-03 | infra/DNS changes |
| 06 Integrations | MP-05, resilience/rate-limit/observability, KI-03 | schema redesign |
| 07 CI/CD | CL-04 (checkpoints), dependency checks, deployment workflow | feature CRUD |

## Guardrails
- A TypeScript rule may touch `src/**/*.ts` only; it must not alter DB schema or UI intent.
- A UI rule must not modify database schema.
- A Git/tool rule must not override project Git safety (no force, no auto-merge).
- A debugging rule must never justify deleting or skipping tests.
- A generic Clean Architecture rule must not replace the feature-first ADR.
- Tool-specific (Cline/Kilo) rules apply only when that tool is actually in use.
