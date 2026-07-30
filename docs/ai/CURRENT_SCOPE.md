# CURRENT_SCOPE

## CURRENT_WAVE
`WAVE_01_ARCHITECTURE_AND_GOVERNANCE`

## Branch
Wave 01 lands via the **one-time empty-repo bootstrap of `main`** (REMOTE_EMPTY verified; `gh` CLI unavailable; cannot PR into an empty repo). Governance + architecture docs are explicitly permitted in the initial commit. **From Wave 02 onward: feature branch + PR only** (`feat/wave-02-foundation`, …); no further direct pushes to `main`.

## Allowed (add/modify) paths
- `CLAUDE.md`, `README.md`, `.gitignore`, `.gitattributes`, `.editorconfig`, `.node-version`, `.env.example`
- `docs/ai/**`
- `docs/architecture/**` (including `adr/**`)
- `docs/security/**`

## Protected paths (must not change outside scope)
- Any future `src/**`, `package.json`, lockfiles, CI workflows (Wave 02+ territory).
- `.claude/**` (user-owned settings).
- Existing Git history once created.

## Out of scope this Wave
- Any application source code, dependency install, or build.
- External service provisioning (Vercel/Neon/Supabase/Cloudflare), secrets, DNS, deployment.
- CI workflow files (`.github/**`) — belongs to Wave 07.

## Validation plan
- Markdown/link sanity (manual read).
- Git preflight before commit; exact-path staging; secret scan of staged diff.
- No build/lint/test yet (no source exists) — stated honestly as deferred to Wave 02+.

## Definition of Done for Wave 01
Governance + architecture + security docs coherent and review-ready; bootstrap `main` established; Wave 01 docs on a feature branch pushed and PR opened; verdict `DESIGN_READY_FOR_REVIEW`.
