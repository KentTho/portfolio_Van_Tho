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

No conflict was resolved in favour of a README over landed project authority.
