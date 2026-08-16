# Wave 04B/05 — System Audit (MODE_A, foundation-first)

> Consolidated current-state audit. Status vocabulary: `VERIFIED` (checked this turn) ·
> `PARTIALLY_VERIFIED` (checked before, not re-run this turn) · `PENDING` · `ABSENT` ·
> `CONTRADICTORY` · `NOT_APPLICABLE`. Owner decision: DEV/PREVIEW 100%, foundation before UI.
> Single consolidated file (instead of six thin matrices) per Karpathy Simplicity; sections below map
> 1:1 to the prompt's requested matrices.

## 0. Baseline (VERIFIED this turn)
| Item | Value | Status |
|---|---|---|
| Branch (foundation) | `feat/wave-05-cms-foundation` @ `f24d1d8` (off verified `main`) | VERIFIED |
| `origin/main` | `f24d1d8` unchanged; `feat/wave-04` @ `94f547e` = 1 ahead / 0 behind | VERIFIED |
| Active git op | none (no MERGE/REBASE/CHERRY-PICK/sequencer/lock) | VERIFIED |
| Working tree | clean except 10 untracked Owner design-source files (kept) | VERIFIED |
| Single writer | yes (one session, one branch) | VERIFIED |

## 1. GitHub (VERIFIED this turn)
| Item | Value | Status |
|---|---|---|
| PR #5 | OPEN · MERGEABLE · mergeStateStatus CLEAN · not draft | VERIFIED |
| PR #5 head | `94f547e` | VERIFIED |
| Checks | CodeRabbit ✅ · Vercel ✅ · quality ✅ (run `30622844666`) | VERIFIED |
| Merge decision | **NOT merged** (main auto-deploys Production — locked) | VERIFIED |

## 2. Vercel
| Item | Value | Status |
|---|---|---|
| PR #5 Preview build | Ready (deployment completed) | VERIFIED |
| Preview content smoke | blocked by Deployment Protection SSO | PARTIALLY_VERIFIED |
| Production | exists (main auto-deploy); not touched this phase | PARTIALLY_VERIFIED |

## 3. Supabase (PARTIALLY_VERIFIED — prior evidence, not re-run)
| Item | Value | Status |
|---|---|---|
| Auth (GitHub OAuth) | code + policy present; **0 users**, owner `app_users` not seeded | PARTIALLY_VERIFIED |
| Storage buckets | `portfolio-public` / `portfolio-private` + signed upload (dev smoke prior) | PARTIALLY_VERIFIED |
| Owner mapping | PENDING (needs 1 interactive OAuth sign-in) | PENDING |

## 4. Neon (PARTIALLY_VERIFIED)
| Item | Value | Status |
|---|---|---|
| Migration ledger | 1 entry `0000_boring_skullbuster` | VERIFIED (file) |
| Dev migration applied | 8 kernel tables applied to Development (Wave 03S) | PARTIALLY_VERIFIED |
| Password rotation | credential leaked in a local driver error → **rotate** | PENDING (Owner) |
| Production DB | not targeted; locked | NOT_APPLICABLE (this phase) |

## 5. Database matrix (VERIFIED on main) → detail in `DATABASE_SCHEMA_MATRIX.md`
| Item | Value | Status |
|---|---|---|
| Kernel tables | 8 (app_users, profiles, projects, media_assets, skills, contact_messages, audit_logs, site_settings) | VERIFIED |
| CMS tables (17) | designed, not yet migrated | ABSENT (by design — Group 0) |
| Schema authority conflicts | 4 analyzed + resolved (skills/technologies, media/project_media, audit/revisions, projects/extensions) | VERIFIED |

## 6. Backend capability matrix
| Capability | Status | Note |
|---|---|---|
| Read ports (admin identity, media upload authz) | PARTIALLY_VERIFIED | unit-proven (Wave 03) |
| Public read port `PortfolioRepository` + static repo | PARTIALLY_VERIFIED | on `feat/wave-04` branch only (not on `main`) |
| Write-side use cases (CRUD/publish) | ABSENT | Group 2–5 |
| Neon-backed public repository | ABSENT | needs Wave 04 ports (gate item #1) |

## 7. Public frontend section matrix (on `feat/wave-04`, PARTIALLY_VERIFIED)
| Route/section | Status | Note |
|---|---|---|
| `/[locale]` + about/projects/[slug]/articles/[slug]/resume/contact | PARTIALLY_VERIFIED | SSG vi+en, on branch; not redesigned yet |
| 6 Home sections (hero/focus/featured/tech-matrix/principles/contact-cta) | PARTIALLY_VERIFIED | modular files; redesign deferred to Phase 2 |
| Admin presence on public | ABSENT (intended) | no admin/login links in public UI |
| SEO / i18n / a11y / draft-filter | PARTIALLY_VERIFIED | metadata/robots/sitemap/JSON-LD; sample noindex |

## 8. Admin feature matrix
| Feature | Status |
|---|---|
| `/admin-login`, `/admin` layout server-side authz gate | PARTIALLY_VERIFIED (code present, no live session) |
| Admin CMS CRUD (projects/articles/profile/media/...) | ABSENT (Wave 05 MODE_F) |
| `/user` portal | NOT_APPLICABLE (must not exist) |

## 9. Infrastructure matrix
| Item | Status |
|---|---|
| CI `quality` workflow | VERIFIED green |
| Branch protection / required checks | PENDING (audit in §P) |
| Secret scope / secret-free build | PARTIALLY_VERIFIED (lazy env; proven Wave 03S) |
| Observability / rollback | ABSENT (Production Readiness, deferred) |

## 10. Consolidated gaps → next unlocks
1. CMS schema (17 tables) — Group 0 done; **G1 migration pending review-gate**.
2. Backend write-side + Neon public repo — needs Wave 04 ports integration decision (gate item #1).
3. Live admin OAuth session + owner seed — 1 interactive step (Owner).
4. Neon password rotation (Owner).
5. Preview content smoke — SSO handling (Owner) or authenticated Playwright.
