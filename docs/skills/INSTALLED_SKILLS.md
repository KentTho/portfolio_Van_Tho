# Installed skills — status ledger

> Governance: CLAUDE.md §26 (Selective Skill Policy) + §27 (Karpathy discipline).
> Owner decision (Wave 04B/05): **MANUAL_INTEGRATION_ONLY** — no third-party installer was run.
> Status vocabulary is deliberately strict: reading a README is **not** installing a skill.

## Status vocabulary

| Status | Meaning |
|---|---|
| `MANUALLY_INTEGRATED` | Principles integrated into project files (e.g. CLAUDE.md); no package installed. |
| `RUNTIME_AVAILABLE` | Skill is exposed by the Claude Code runtime this session; usable without install. |
| `PROPOSED_FOR_INSTALL` | Read + evaluated; a scoped install is proposed for a future approved step. |
| `NOT_INSTALLED` | Deliberately not installed this phase. |
| `NOT_A_SKILL` | Source is a component library / platform, not an Agent Skill. |
| `DEFERRED` | Decision postponed to a later Wave / explicit approval. |

## Ledger

| Source | Type | Status this phase | License | Install location | Active scope |
|---|---|---|---|---|---|
| `multica-ai/andrej-karpathy-skills` (README_andrej-karpathy-skills.md) | Engineering discipline | **MANUALLY_INTEGRATED** → CLAUDE.md §27 | MIT | — (no package) | All Waves |
| Anthropic `frontend-design` skill | Frontend design workflow | **RUNTIME_AVAILABLE** (used only in redesign phase) | Anthropic | runtime | Public/Admin UI redesign only |
| `mattpocock/skills` (README_mattpocock.md) | Selective TS/testing skills | **NOT_INSTALLED** (selected rules already in CLAUDE.md §8 + adoption matrix; bundle install `PROPOSED_FOR_INSTALL` later) | Unstated → `LOCAL_REFERENCE_ONLY` | — | BE/TS/testing (rules only) |
| `Leonxlnx/taste-skill` (README_Taste_Skill.md) | Visual redesign critique | **DEFERRED** (checklist only, redesign phase) | Review required | — | UI critique only |
| `DavidHDev/react-bits` (README_React_Bits.md) | Component library | **NOT_A_SKILL** (≤2 components, chosen after Design Plan) | MIT + Commons Clause | — | UI redesign only |
| `Kilo-Org/kilocode` (README_Kilo-Org.vi.md) | Agent platform / workflow ref | **NOT_INSTALLED** (workflow ideas adapted) | MIT | — | Process reference |
| `cline/cline` (README_cline.md) | Coding agent / workflow ref | **NOT_INSTALLED** (workflow ideas adapted) | Apache-2.0 | — | Process reference |
| `README_UI-UX-PRO-MAX.md` | UI/UX reference | **DEFERRED** | Review required | — | UI redesign only |
| MCP servers (MCP-SERVER.md) | Tooling | **DEFERRED** (`DEFER_MCP_INSTALLATION`) | n/a | — | — |

## Assertions (honest)

- **No third-party installer was executed** this phase: no `/plugin marketplace add`, no `/plugin install`,
  no `npx skills add`, no `npm i -g` for Kilo/Cline, no shadcn component pulls, no full-repo clone of React Bits.
- CLAUDE.md was **not** overwritten; §27 was **appended** and cross-references existing sections (no duplicated rule).
- Owner-local skill source files (`README_*`, `Prompt_*`, `MCP-SERVER.md`) remain **untracked** — never staged or deleted.
- Anthropic `frontend-design` is available at runtime and will be activated **only** during the visual redesign
  phase (after the CMS Foundation Completion Gate passes), never for schema/migration/security decisions.
