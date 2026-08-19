# Stack progress — post-V1 (Production LIVE, monitoring/rollback pending)

> Scale: `0` absent · `25` source/skeleton · `50` local feature proven · `75` development/preview
> verified · `85` **production-deployed + runtime-verified** · `100` production proven **with monitoring +
> rollback + observability**. Documentation is **not** live capability; a live deploy is **not** an
> observable/rollback-able platform.
>
> **V1 the *product scope* is CLOSED** (merged to `main` @ `feeb0bd`, Vercel Production LIVE at
> `portfolio-van-tho.vercel.app`, post-merge smoke green). **100% is still not reached** — it requires
> monitoring + rollback + observability, which are NOT yet in place (Owner-deferred, Wave 07/10). So layers
> that are production-serving sit in the **85 band**, not 100. Two scopes are tracked separately below:
> **V1_PRODUCT_SCOPE** (recruiter-facing portfolio — CLOSED) vs **LONG_TERM_PLATFORM_ROADMAP** (observability,
> prod-DB isolation, contact backend, preview-branch-per-PR — open).
>
> ⚠️ **`PRODUCTION_DATABASE_TARGET = SAME_AS_DEVELOPMENT`** (secret-safe behavioral proof). Owner-decided:
> **`PRODUCTION_DATABASE_ISOLATION = APPROVED_PLANNED_NOT_EXECUTED`** (separate Neon Production = approved
> target, tracked as planned infra task **INFRA-DB-ISO**; not executed). Caps DATABASE below full marks until executed.

## Layer percentages

| Layer | % | Evidence | Unverified gaps | Next unlock |
|---|---|---|---|---|
| **INFRASTRUCTURE** | **82** | Vercel **Production LIVE** (Git-integration deploy on push to `main`; `…-git-main…` alias) + **Preview green** on PR head + **CI green on `main`** (`CI / quality`); Neon Dev pooled+direct, migration system, env/secret/server-only, secret-free build all verified | **monitoring/rollback/observability NOT proven** (no Sentry/health/alerting); Cloudflare DNS/Turnstile `PENDING_INTERACTIVE`; no preview-branch-per-PR | observability + rollback runbook (Wave 07/10); Cloudflare wiring |
| **PUBLIC PRESENTATION** | **88** | **6-block recruiter-first landing per locale** (`/vi` `/en`, scroll-spy) **LIVE in Production** with **real CV content** (Hà Văn Thọ · NTTU · 15 skills/6 groups · Expense Tracker). Logo-derived brand tokens (blue+gold), portrait hero (`vantho.png`), premium motion (cursor halo/kinetic/magnetic/pointer-tilt/intro), WCAG-AA. Live Neon read model (no fixture fallback); consolidated routes → `/#anchor`; detail routes preserved. **Public E2E 7/7** + **populated visual QA PASS** + production runtime smoke green. Map `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md` | a11y/Lighthouse/visual-regression hardening (Wave 08B) not run; cosmetic skill-slug tiles; V2 per-section enhancement pending | `V2_PUBLIC_VISUAL_ENHANCEMENT`; Wave 08B a11y/perf |
| **DATABASE** | **80** | `WAVE05_DATABASE_CONTRACT_DEV_VERIFIED` + **production-serving live**: ledger = 6, **25 tables** (G1–G5), FK cascade/restrict/setnull, locale checks, atomic batched-tx + optimistic concurrency + published-only reads verified; real content persisted | ⚠️ `PRODUCTION_DATABASE_TARGET = SAME_AS_DEVELOPMENT`; isolation `APPROVED_PLANNED_NOT_EXECUTED` (INFRA-DB-ISO); no preview-branch-per-PR; no prod backup/rollback drill | Execute INFRA-DB-ISO (separate prod Neon); Wave 07 Neon preview branching |
| **BACKEND** | **85** | `BACKEND_APPLICATION_FOUNDATION_DEV_VERIFIED` **running in Production**: tags/technologies/projects/articles/career/profile/skills/site-settings/revisions + Public Neon Read Model. Deny-by-default authz, Zod biên, atomic `db.batch`, row_version, audit, published/visible-only; live smoke + real ingestion through the stack | contact backend deferred (write-boundary/Turnstile/email = backlog); `PROFILE_AND_PUBLIC_IDENTITY_DOMAIN_EXPANSION` (summary/headline/social/awards) needs migration | contact backend + identity domain expansion (backlog) |
| **ADMIN (Functional CMS)** | **82** | Control plane (15 areas) with **live authenticated admin session VERIFIED end-to-end** — real CV content ingested through Admin UI → Server Action → use-case → repo (UI never touches Drizzle). All states (loading/empty/validation/authz/not-found/success/stale). First-login owner provisioning live | media attach / links / metrics / sections editor = later upgrade; media+messages still status pages | media/links/sections editors; contact inbox (backlog) |
| **FRONTEND (public)** | **88** | Subsumed by **PUBLIC PRESENTATION** — full 6-block public UI shipped to Production with real content, i18n (vi/en), premium motion, SEO/JSON-LD, detail routes. (Old "10 = app-shell-only" metric retired.) | same as PUBLIC PRESENTATION (a11y/perf hardening, V2 enhancement) | `V2_PUBLIC_VISUAL_ENHANCEMENT` |
| **OVERALL (V1_PRODUCT_SCOPE)** | **~85** | weighted; V1 merged + Production-live + post-merge-verified with real content, live auth, CI/Preview green | monitoring/rollback/observability; prod-DB isolation decision; a11y/perf hardening | see LONG_TERM_PLATFORM_ROADMAP |
| **V1_PRODUCT_SCOPE** | ✅ **CLOSED** | recruiter-facing 6-block portfolio, real content, Production live, verdict `V1_MAIN_MERGED_AND_POST_MERGE_VERIFIED` | — | `V2_PUBLIC_VISUAL_ENHANCEMENT` (candidate) |
| **V2_PUBLIC_VISUAL_ENHANCEMENT** | 🚧 **IN PROGRESS — 6 blocks + Footer MERGED; Global Nav/Motion in review** | **All six V2 blocks + Footer = MERGED to main `9939ec5` + Production LIVE** (Hero/Menu/About PR#10, Career PR#11, Contact/Footer PR#12). **Global Navigation + Motion** (branch `feat/v2-global-navigation-motion-system`, PR open): compact/expanded icon-capsule nav (active always expanded, 0 header CLS, no dead-zone) + MASTER-MOTION-02 handoff (Reveal once/no-replay + ambient recede); `@remixicon/vue` removed (one framework). Validation GREEN, **test 198/6**, **e2e:public 11/11** (nav handoff + hydration guard). **Not merged** (Owner Visual Acceptance). | Projects/Skills V2 pending; `PENDING_OWNER_EXPERIENCE_DETAILS` | Owner review Global Nav/Motion → Projects/Skills V2 |
| **LONG_TERM_PLATFORM_ROADMAP** | **~40** | platform maturity beyond V1: observability, rollback drills, prod-DB isolation, contact backend, preview-branch-per-PR, Cloudflare, a11y/perf gates | all of the above open (Owner-deferred) | Wave 06A/07A/07/08B/10 |

## Capability level ladder (L0–L7)
- Application foundation / design system / architecture enforcement — **L3** (proven, on `main`).
- Admin authorization / media upload authorization — **L3** (unit-proven).
- Database (Neon) / Storage (Supabase) — **L4** (live-verified; production-serving).
- Auth (GitHub OAuth) — **L4** (live sign-in verified; 1 owner_admin/active; authenticated session drives Admin).
- CI — **L4** (green on `main` @ `feeb0bd`). Preview — **L4** (green on PR head).
- Production — **L5** (Vercel Production LIVE + post-merge runtime smoke). **NOT L6/L7** — monitoring/rollback/observability unproven.

## Honesty ledger (what these numbers do NOT claim)
- **Production is LIVE and verified**, but there is **no monitoring / alerting / rollback drill / observability** yet → not 100%, not L6/L7.
- ⚠️ `PRODUCTION_DATABASE_TARGET = SAME_AS_DEVELOPMENT` (behavioral proof) — production and the local development environment read the **same** Neon database. Owner-decided `PRODUCTION_DATABASE_ISOLATION = APPROVED_PLANNED_NOT_EXECUTED` (INFRA-DB-ISO planned task); AI performed no migrate/switch.
- Real content was ingested into the **development** database only (no direct prod-DB authoring/mutation). It surfaces in Production because prod reads the same DB.
- a11y / Lighthouse / cross-browser / visual-regression hardening (Wave 08B) not yet run.
- Contact write-boundary / Turnstile / email backend deferred (backlog, not V1).
