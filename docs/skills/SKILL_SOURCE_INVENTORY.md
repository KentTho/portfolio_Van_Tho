# Skill source inventory

> One row per source the Owner supplied. Records what was **read**, its classification, license posture,
> and whether any rule landed. Complements `INSTALLED_SKILLS.md` (status) and `SKILL_ADOPTION_MATRIX.md` (per-rule).

| Source | Local file | Classification | Read? | License | Landed this phase | Authority rank (CLAUDE.md §27 / Owner Q3) |
|---|---|---|---|---|---|---|
| Andrej Karpathy skills | `README_andrej-karpathy-skills.md` | GLOBAL_ENGINEERING_DISCIPLINE | ✅ full | MIT | ✅ CLAUDE.md §27 (4 principles) | 5 (after project governance) |
| Matt Pocock skills | `README_mattpocock.md` | SELECTIVE_ENGINEERING_SKILLS | prior Wave 02B | Unstated → `LOCAL_REFERENCE_ONLY` | rules already in §8 + matrix (MP-01…09) | 6 |
| Anthropic frontend-design | runtime skill | FRONTEND_DESIGN_ONLY | on activation | Anthropic | not yet (redesign phase) | 7 |
| Taste skill | `README_Taste_Skill.md` | VISUAL_REVIEW_AND_REDESIGN_ONLY | checklist | Review required | not yet (redesign phase) | 8 |
| React Bits | `README_React_Bits.md` | UI_COMPONENT_LIBRARY (not a skill) | on selection | MIT + Commons Clause | not yet (≤2 comps, post Design Plan) | 9 |
| Kilo Code | `README_Kilo-Org.vi.md` | EXTERNAL_AGENT_PLATFORM / WORKFLOW_REF | prior Wave 02B | MIT | workflow ideas adapted (KI-01…05) | process ref |
| Cline | `README_cline.md` | EXTERNAL_CODING_AGENT / WORKFLOW_REF | prior Wave 02B | Apache-2.0 | workflow ideas adapted (CL-01…06) | process ref |
| UI/UX Pro Max | `README_UI-UX-PRO-MAX.md` | UI/UX_REFERENCE | redesign phase | Review required | not yet | ref |
| Cosmic style / Hero prompts | `Prompt-Portfolio-Cosmic(style).md`, `Prompt_Hero_section.md` | DESIGN_STYLE_REFERENCE | redesign phase | Owner-local | style informed Wave 04 (untracked) | ref |
| MCP servers | `MCP-SERVER.md` | TOOLING | — | n/a | `DEFER_MCP_INSTALLATION` | ref |

## Domain-authority guardrail (Owner Q3 §9)

For **Infrastructure / Database / Backend** decisions the active authority set is:
CLAUDE.md + ADRs + Karpathy discipline + selected Matt Pocock engineering rules + evidence-first execution.
`frontend-design`, `Taste`, and `React Bits` **must not** influence schema, migration, infrastructure, or security.
