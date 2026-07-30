# Skill source manifest

Sources are Owner-provided reference files kept **local only** (not committed) until
redistribution rights are confirmed. Bytes are preserved unaltered.

| SOURCE_ID | Exact path | Tracking | Bytes | sha256 (short) | License | Redistribution | Handling |
|---|---|---|---|---|---|---|---|
| `mattpocock` | `README_mattpocock.md` (repo root) | UNTRACKED_OWNER_INPUT | 14585 | `6fab7e1acf0a5ded` | **UNKNOWN** (README states none) | UNRESOLVED | `SOURCE_LOCAL_REFERENCE_ONLY` · `LICENSE_REVIEW_REQUIRED` |
| `cline` | `README_cline.md` (repo root) | UNTRACKED_OWNER_INPUT | 9105 | `b3747628b566bd93` | **Apache-2.0** (© 2026 Cline Bot Inc.) | Allowed w/ attribution | Local reference kept; product README, low reuse value |
| `Kilo-Org.vi` | `README_Kilo-Org.vi.md` (repo root) | UNTRACKED_OWNER_INPUT | 8524 | `cfc9e6b1241f22f1` | **MIT** (Kilo-Org) | Allowed w/ attribution | Local reference kept; product README, low reuse value |

## Classification
- OWNER_SOURCE: files placed by the Owner.
- THIRD_PARTY_REFERENCE: content authored by third parties (mattpocock, Cline Bot Inc., Kilo-Org).
- Because `mattpocock` license is UNKNOWN, **no full source is copied into tracked docs**. Only summarized, transformed adoption decisions are stored (fair analysis, not redistribution).

## Decision
Keep all three at their original root paths, **untracked** (not pushed to GitHub). If the
Owner confirms redistribution rights (or licenses), they may later be relocated to
`docs/skills/sources/` with attribution. Until then: `SOURCE_LOCAL_REFERENCE_ONLY`.
