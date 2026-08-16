# Wave 04 — Design Source Matrix

> Owner-local design/skill sources are **advisory** and kept **untracked** (never staged,
> never copied verbatim). We extract *style/discipline*, never content. Project authority
> (CLAUDE.md, ADRs, security, a11y) wins over any source.

| SOURCE_ID | File (untracked) | License | Type | Decision | Applied as |
|---|---|---|---|---|---|
| S1 | `Prompt-Portfolio-Cosmic(style).md` | prompt text | DESIGN_STYLE_SOURCE | ADOPT_WITH_MODIFICATION | Dark cosmic palette, editorial serif display, eyebrow rules, motion grammar → `tokens.css` + sections. Fake content (Michael Smith, stats) **rejected**. |
| S2 | `Prompt_Hero_section.md` | prompt text | HERO_STYLE_SOURCE | ADOPT_WITH_MODIFICATION | `fadeUp`/stagger entrance, CTA hierarchy, clamp typography → `hero-section.tsx`. VaultShield content **rejected**. |
| S3 | `README_React_Bits.md` | MIT + Commons Clause | UI_COMPONENT_SOURCE | DEFER | No components copied in Phase 1. Selective, refactored intake only when a specific animation is needed (§I). |
| S4 | `README_Taste_Skill.md` | advisory | DESIGN_REVIEW_SKILL | ADOPT (principles) | Anti-generic discipline: restraint, whitespace, no gradient-everywhere. |
| S5 | `README_UI-UX-PRO-MAX.md` | advisory | DESIGN_REVIEW_SKILL | ADOPT (principles) | A11y + hierarchy checklist folded into the Design Contract. |
| S6 | `README_andrej-karpathy-skills.md` | MIT | AGENT_WORKFLOW_SKILL | ADOPT (discipline) | Think-before-coding, Simplicity-first, Surgical changes, Goal-driven+verify. **Plugin install NOT run** (governance §26). |
| S7 | `MCP-SERVER.md` | advisory | TOOL_OR_MCP_INSTRUCTION | DEFER_MCP_INSTALLATION | No MCP needed for Wave 04; installing one merely because the file exists is rejected (§H). |
| S8 | `README_mattpocock.md` | UNKNOWN | TYPESCRIPT_SKILL | ADOPT (already in CLAUDE §8) | Strict inference, `z.infer`, discriminated unions in UI props/data. |
| S9 | `README_cline.md` / `README_Kilo-Org.vi.md` | Apache-2.0 / MIT | AGENT_WORKFLOW_SKILL | ADOPT (plan-then-act) | Plan-before-act, inspect-before-edit, exact scope. |

**MCP decision:** `DEFER_MCP_INSTALLATION` — no server installed. **React Bits:** `DEFER` — none copied.
No brand SVGs copied (license review pending) → accessible branded tiles used instead (§M).
