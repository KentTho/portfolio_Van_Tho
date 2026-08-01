# Skill adoption matrix

Legend — DECISION: ADOPT · ADOPT_WITH_MODIFICATION (AWM) · DEFER · REJECT · NOT_APPLICABLE (NA) · DUPLICATE_EXISTING_RULE (DUP).
Provenance tags: `[S]` source-derived · `[P]` project adaptation · `[M]` model inference.

## From `andrej-karpathy-skills` (MIT) — global engineering discipline

| RULE_ID | Summary | Category | Decision | Target Wave / File |
|---|---|---|---|---|
| KA-01 `[S][P]` | Think Before Coding — no silent assumptions; surface tradeoffs; ask when confused | PLANNING | ADOPT (integrated) | all · CLAUDE.md §27 |
| KA-02 `[S]` | Simplicity First — minimum code for the real root cause; nothing speculative | ARCHITECTURE | ADOPT (integrated; reinforces §2/§25) | all · CLAUDE.md §27 |
| KA-03 `[S]` | Surgical Changes — touch only what the request requires; clean only own orphans | GIT/EDIT | ADOPT (integrated; reinforces §18/§25) | all · CLAUDE.md §27 |
| KA-04 `[S]` | Goal-Driven Execution — success criteria first; reproduce→test→loop→evidence | TESTING | ADOPT (integrated; reinforces §21/§24) | all · CLAUDE.md §27 |
| KA-05 `[S]` | Install as Claude Code plugin (`/plugin install`) | TOOL_USE | REJECT — manual integration only; no installer run | — |
| KA-06 `[P]` | Owner session rule: ask clarifying questions + options each session | PROCESS | ADOPT (Owner-instituted) | all · CLAUDE.md §27 |

## Design-phase skills (activate only in Public/Admin UI redesign, after Foundation Gate)

| RULE_ID | Summary | Category | Decision | Target |
|---|---|---|---|---|
| FD-01 `[S]` | Anthropic frontend-design: audience→single-job→design plan→critique-before/after | DESIGN | ADOPT (RUNTIME_AVAILABLE; redesign only) | Wave 04B/05 UI |
| TA-01 `[S]` | Taste redesign-existing-projects critique checklist (hierarchy/type/spacing/anti-generic) | DESIGN_REVIEW | AWM — checklist only; no installer | Wave 04B/05 UI |
| RB-01 `[S]` | React Bits selected components (≤2), refactored to project conventions | UI_COMPONENT | AWM — post Design Plan; NOT_A_SKILL; license-checked | Wave 04B/05 UI |

## From `mattpocock` (engineering skills)

| RULE_ID | Summary | Category | Decision | Target Wave / File |
|---|---|---|---|---|
| MP-01 `[S]` | Grill/align on requirements before building | REQUIREMENT_CLARIFICATION | ADOPT (matches Clarification Gate) | all · process |
| MP-02 `[S][P]` | Shared language / glossary to cut verbosity | DOCUMENTATION | AWM — use `docs/ai` + ADRs instead of a separate `CONTEXT.md` | all · docs/ai |
| MP-03 `[S]` | Small deliberate steps; fast feedback loops (types/tests/browser) | PLANNING | ADOPT (Wave discipline) | all |
| MP-04 `[S]` | TDD red-green-refactor at chosen seams | TESTING | AWM — apply to domain/use-case logic (Wave 03+), not every file | 03+ · tests |
| MP-05 `[S]` | Disciplined bug-diagnosis loop (reproduce→minimise→fix→regress) | DEBUGGING | ADOPT (folds into bounded self-healing) | all |
| MP-06 `[S]` | Deep modules: much behaviour behind a small interface | ARCHITECTURE | ADOPT (reinforces feature-first Clean Arch) | all |
| MP-07 `[S]` | Two-axis code review: standards + spec | TESTING | AWM — run at validation/PR | 02B+ |
| MP-08 `[P]` | Strict type inference, generic constraints, **Zod schema inference** (`z.infer`), no unsafe `any`/`unknown` | TYPESCRIPT | ADOPT (author is Total TypeScript; strengthen CLAUDE §8) | all · src/**, CLAUDE.md |
| MP-09 `[S]` | Install via `claude plugins install` / `npx skills` | TOOL_USE | REJECT — no auto plugin install; keep as reference | — |

## From `cline` (Apache-2.0)

| RULE_ID | Summary | Category | Decision | Target |
|---|---|---|---|---|
| CL-01 `[S]` | Project rules file (`.clinerules`) | AI_AGENT_BEHAVIOR | DUP — `CLAUDE.md` already serves this | CLAUDE.md |
| CL-02 `[S]` | Plan mode → align → Act mode | PLANNING | ADOPT (maps to scope-lock before mutation) | all |
| CL-03 `[S]` | Monitor linter/compiler; fix errors proactively | DEBUGGING | DUP (bounded self-healing) | all |
| CL-04 `[S]` | Checkpoints + human-in-the-loop approval | GIT | ADOPT (exact-path staging + PR review + no auto-merge) | all · Git |
| CL-05 `[S]` | Skills load specific rules only when needed | TOOL_USE | ADOPT (selective activation) | all |
| CL-06 `[S]` | Multi-agent teams, scheduled agents, Slack/MCP, SDK plugins | TOOL_USE | NA — Cline-specific tooling | — |

## From `Kilo-Org.vi` (MIT)

| RULE_ID | Summary | Category | Decision | Target |
|---|---|---|---|---|
| KI-01 `[S]` | Agent modes: Code / Plan / Ask / Debug / Review | AI_AGENT_BEHAVIOR | AWM — conceptual separation of concerns per task | all |
| KI-02 `[S]` | Self-check: agent reviews and fixes its own work | DEBUGGING | DUP (self-healing + review) | all |
| KI-03 `[S]` | Review pass for perf/security/style/test-coverage | SECURITY | AWM — folds into validation matrix + security checklist | 02B+ |
| KI-04 `[S]` | `--auto` fully autonomous, no approval | GIT | REJECT — human merge required; no auto prod/DNS | — |
| KI-05 `[S]` | 500 models / ghost-text / MCP marketplace | TOOL_USE | NA — tool-specific | — |

## Cross-source (Owner-highlighted)
| RULE_ID | Summary | Decision | Note |
|---|---|---|---|
| X-01 `[S]` | **Memory retention** (persist project rules/state across sessions) | ADOPT | Already via `docs/ai/*` + `CLAUDE.md`; keep updated each Wave |
| X-02 `[S]` | **Exact-path staging** | DUP | Already a CLAUDE.md Git rule |
| X-03 `[S]` | **Bounded self-healing** | DUP | Already the Wave self-healing policy |

## Net new changes landing this phase
- Strengthen **CLAUDE.md §8** (TypeScript) with MP-08 (Zod `z.infer`, generic constraints, no unsafe `any`/`unknown`).
- Add **CLAUDE.md §26 Selective Skill Policy**.
- Everything else is either already present (DUP), advisory-only, deferred, rejected, or not applicable.
