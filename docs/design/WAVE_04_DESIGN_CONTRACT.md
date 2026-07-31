# Wave 04 — Design Contract

**Product goal:** a recruiter or Tech Lead understands Van Tho's focus and reaches strong
evidence within ~2 minutes.

**Visual direction:** Cosmic Engineering Editorial — deep-navy canvas, cyan/teal primary,
controlled violet, a masked grid + soft aurora (pure CSS), precise typography, strong
whitespace, restrained depth. Not game-like, not crypto, no gradient-on-everything.

## Tokens (single source: `src/styles/tokens.css`)
- Canvas `#070b14` · surface `#0d1524` · elevated `#131f34`.
- Text `#e8eef7` / muted `#a9b7cc` / subtle `#6b7a90`. Border `#1e2b42`.
- Accent cyan `#22d3ee` · teal `#2dd4bf` · violet `#a78bfa`. Status: success/warning/danger/info.
- Motion: `--motion-fast/base/slow`, `--ease-out`. Glow: `--glow-soft/strong`. Radius `0.625rem`.
- Type: `--font-sans` (Inter, self-hosted) · `--font-display` (Instrument Serif, italic) · `--font-mono`.

No hardcoded colours in components — semantic Tailwind utilities only (`bg-canvas`, `text-fg`, …).

## Rules
- Dark-first, no light toggle (V1).
- CTAs visible immediately; animation never blocks content or LCP.
- Every section is its own file (layout/heading/animation separated) for editability.
- Content is verified Owner data or clearly labelled SAMPLE; no fabricated metrics/history.
- Public site has **no admin/login presence**; `/admin` stays a separate protected area.
