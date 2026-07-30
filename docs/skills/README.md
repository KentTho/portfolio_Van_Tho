# Skill governance

The Owner added three external "skill" README sources. This directory records how
they are **selectively** evaluated and adopted — the project does not blindly apply them.

## Precedence (PROJECT_AUTHORITY_WINS)
1. Actual Git/filesystem/runtime evidence
2. Root `CLAUDE.md`
3. Landed ADRs + architecture docs
4. Current Wave scope
5. Landed security policy
6. Selected project-specific skill rules
7. Original skill README sources
8. Model inference

A README is **advisory**, not an executable project rule. Each rule is evaluated
before adoption; conflicting rules are rejected or adapted.

## Files
- [`sources/MANIFEST.md`](sources/MANIFEST.md) — source inventory, checksums, license, redistribution status
- [`SKILL_ADOPTION_MATRIX.md`](SKILL_ADOPTION_MATRIX.md) — rule-by-rule decisions
- [`SKILL_CONFLICT_REGISTER.md`](SKILL_CONFLICT_REGISTER.md) — conflicts vs project authority + resolutions
- [`WAVE_SKILL_MAP.md`](WAVE_SKILL_MAP.md) — which skills are relevant to which Wave

## Rules for using skills
- Skills activate only for the current Wave's relevant tasks (see the Wave map).
- Read only the mapped rules for the current Wave — do not load every source each task.
- Tool-specific instructions (Cline/Kilo CLI, plugins, MCP) apply only if that tool is used.
- No README command is executed without a project safety review (path/network/security/license/compat).
- No skill may weaken tests, TypeScript strictness, security, or Git safety.
- No skill may read or expose raw secrets.
- Sources with unknown/unclear license stay `LOCAL_REFERENCE_ONLY` (not copied into tracked docs).
