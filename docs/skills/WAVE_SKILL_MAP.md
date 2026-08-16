# Wave → skill map

Skills are context-triggered. For each Wave, read only the mapped rules.

| Wave | Relevant skill rules | Explicitly NOT active |
|---|---|---|
| 02 Foundation | MP-03, MP-06, MP-08, CL-02, CL-04/05, KI-01 | database/auth/UI/SEO rules |
| 02B Skill intake (this) | MP-07, KI-03, CL-05, X-01/02/03 | code-generation of features |
| 03 Data/Auth/Storage | MP-04 (TDD on repos/use-cases), MP-08 (Zod `z.infer` for schema/DTO), MP-05, KI-03 (security review), server-only boundary | UI/SEO/UX rules |
| 04 Public experience | MP-06, React/Next/a11y/SEO/UX (from general practice) | database schema changes |
| 04B Public visual redesign | KA-01…04, FD-01 (frontend-design), TA-01 (Taste critique), RB-01 (≤2 React Bits), MP-08 | **database schema/migration; auth; infra** (design skills MUST NOT touch these) |
| 05 CMS foundation (DB/BE) | KA-01…04, MP-04 (TDD repos/use-cases), MP-08 (Zod `z.infer`), MP-06, KI-01/03, CL-02/04 | **FD-01/TA-01/RB-01** (no UI-design skill decides schema/security) |
| 05 Admin CMS UI | forms/validation/mutation-UX, KA-01…04, FD-01, TA-01, MP-04, MP-08, KI-03 | infra/DNS changes |
| 06 Integrations | MP-05, resilience/rate-limit/observability, KI-03 | schema redesign |
| 07 CI/CD | CL-04 (checkpoints), dependency checks, deployment workflow | feature CRUD |

## Guardrails
- A TypeScript rule may touch `src/**/*.ts` only; it must not alter DB schema or UI intent.
- A UI rule must not modify database schema.
- A Git/tool rule must not override project Git safety (no force, no auto-merge).
- A debugging rule must never justify deleting or skipping tests.
- A generic Clean Architecture rule must not replace the feature-first ADR.
- Tool-specific (Cline/Kilo) rules apply only when that tool is actually in use.
