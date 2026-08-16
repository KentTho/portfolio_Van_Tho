# Skill conflict register

Each conflict resolved under **PROJECT_AUTHORITY_WINS**.

| ID | Conflict | Source | Project authority | Resolution |
|---|---|---|---|---|
| C-01 | Wave 03 secondary prompt uses `src/1_domain`, `src/3_infrastructure` (numbered global layers) | secondary request | ADR-0001 + CLAUDE.md §6 (feature-first; **no numbered folders**; `src/app` stays conventional) | **REJECT numbered layout.** Wave 03 uses `src/modules/<feature>/{domain,application,infrastructure,presentation}` + `src/infrastructure/*` for cross-cutting adapters. |
| C-02 | Kilo `--auto` fully autonomous, no approval | Kilo README | CLAUDE.md §18 + Git authority (human merges; no auto prod/DNS) | **REJECT** full-auto. Keep human-in-the-loop; AI stops at `PR_READY_FOR_HUMAN_REVIEW_AND_MERGE`. |
| C-03 | "Install this plugin/CLI" (`claude plugins install`, `npx skills`, `npm i -g cline/@kilocode/cli`) | all three READMEs | CLAUDE.md §20/§dependency policy; Wave scope | **REJECT auto-install.** No plugin/CLI installed from a README without explicit, reviewed need. |
| C-04 | mattpocock README has no stated license | mattpocock | Section I license policy | **SOURCE_LOCAL_REFERENCE_ONLY**; do not copy full content into tracked docs; `LICENSE_REVIEW_REQUIRED`. |
| C-05 | Secondary prompt: "start Wave 03 now" | secondary request | Wave 02B prompt §S (Wave 03 gated) + Wave state machine | **Follow the gate.** Wave 02B completes first; Wave 03 is the next session on a feature-first branch. |
| C-06 | Add Drizzle/Supabase/Lucide now | secondary request | Wave 02B §N ("do not add Drizzle or Supabase in this phase"); "no unused dependency" | **DEFER.** Drizzle/Supabase → Wave 03; Lucide → when UI needs icons (Wave 04). Not installed in 02B. |

| C-07 | Prompt §F: run `/plugin marketplace add`, `/plugin install`, `npx skills add`, shadcn pulls | Wave 04B/05 prompt | CLAUDE.md §26 (no README command without safety review); Owner Q3 = MANUAL_INTEGRATION_ONLY | **REJECT installers this phase.** Integrate Karpathy 4 principles into CLAUDE.md §27; use runtime `frontend-design`; defer the rest. |
| C-08 | Prompt §L1 lists `articles`, `tags`, `technologies` as *new* tables; some names collide with kernel `skills` / `media_assets` / `audit_logs` | Wave 05 prompt | CLAUDE.md §11 (single source of truth; no duplicate authority) | **Reconcile in Group 0.** `technologies` supersedes free-text `skills.category`; `project_media` references `media_assets` (no second blob store); `content_revisions` complements `audit_logs` (does not replace it). See `docs/audit/DATABASE_SCHEMA_MATRIX.md`. |
| C-09 | Prompt MODE_E: "MODE_E starts only after PR #5 is merged to main" vs Owner no-production (main auto-deploys prod) | Wave 05 prompt vs Owner Q1/Q2 | Owner Q1 (production locked) + Q2 (foundation first) | **Adapt the gate.** Build CMS foundation on `feat/wave-05-cms-foundation` off verified `main`; do **not** merge PR #5. Public Neon repo (needs Wave 04 ports) is surfaced as a gate item at Group 1. |
| C-10 | Prompt §F frontend-design "install marketplace" vs it already being runtime-available | Wave 04B prompt | Owner Q3 | **Use runtime skill**; no marketplace install. Recorded `RUNTIME_AVAILABLE` in `INSTALLED_SKILLS.md`. |

No conflict was resolved in favour of a README over landed project authority.
