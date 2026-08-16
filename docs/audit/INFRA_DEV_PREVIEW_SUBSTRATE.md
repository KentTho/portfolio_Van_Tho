# Infra Dev/Preview Substrate Audit — Wave 05 (MODE A)

> Evidence-first closure of the Development/Preview infrastructure substrate, independent
> of unfinished CMS/Admin features. Production remains locked. Verdict at bottom.
> Prompt: PORTFOLIO-WAVE-05-INFRA-DATABASE-CLOSURE-01 · Owner audit policy: HYBRID
> (live read-only where already authorized, otherwise PENDING).

## Baseline (verified)

| Item | Value |
|------|-------|
| Active branch | `feat/wave-05-cms-foundation` |
| HEAD | `85c1222` (= `origin/feat/wave-05-cms-foundation`, in sync) |
| Migration ledger | 3 entries (`0000`, `0001`, `0002`) |
| Applied migrations on Neon Dev | 3 (matches ledger — **no drift**) |
| Public table count | 17 |
| Worktree | clean (only Owner-local `README_*`/`Prompt_*`/`MCP-SERVER.md` untracked) |

## Substrate matrix

| Capability | Status | Evidence |
|-----------|--------|----------|
| Git baseline safe | ✅ | branch/HEAD verified, remote in sync, no active op, single writer |
| CI quality-gate contract | ✅ VALID | `.github/workflows/ci.yml`: env-not-tracked + secret-scan + install-frozen + lint + typecheck + test + arch + build |
| CI trigger on feature branch | ⏸️ DEFERRED_WAVE_07 | ci.yml triggers on PR→main / push main by design; branch/preview CI is Wave 07. Local gate is current evidence. |
| Neon Dev pooled runtime | ✅ | `DATABASE_URL` = NEON, pooled, db `neondb` |
| Neon Dev direct migration | ✅ | `DATABASE_URL_UNPOOLED` = NEON, direct (non-pooled), same endpoint, db `neondb` |
| No runtime DB → Supabase Postgres | ✅ | both endpoints NEON; `no_runtime_supabase_pg=true` |
| Migration system valid | ✅ | drizzle-kit generate/migrate; applied=ledger=3 |
| Transaction capability | ✅ | `NEON_HTTP_BATCH_TRANSACTION=SUPPORTED` (db.batch→client.transaction); interactive tx unsupported (documented) |
| Env contract | ✅ | `pnpm check:env` 18/18 expected present (3 optional Sentry empty), values never read |
| Env files untracked | ✅ | only `.env.example` tracked; `.env.local` git-ignored |
| Secret scan (tracked) | ✅ | mirror of CI scan — no secret material |
| server-only boundary | ✅ | `tests/architecture/server-only-boundary.test.ts` green |
| Secret-free production build | ✅ | `pnpm build` green without secrets (lazy env) |
| Skipped test reconciled | ✅ | see below |

## Skipped-test disposition

- **Test:** `tests/integration/projects-writeside.test.ts` → `it.runIf(RUN)` live Neon Dev smoke.
- **Classification:** `INTENTIONAL_ENVIRONMENT_DEFERRED`. The offline suite (and CI) skip it so no DB/secrets are needed; it **runs and passes** against Neon Development when invoked with `RUN_DB_SMOKE=1` (verified this session). A sibling always-on test keeps the file non-empty. Not a bug, not an unexpected skip.

## External services (HYBRID audit — no live mutation, no secrets printed)

| Service | Role (from source/docs) | Live proof | Classification |
|---------|-------------------------|-----------|----------------|
| Supabase Auth (GitHub OAuth) | Admin identity provider; Neon stays app content/role authority | interactive OAuth not performable here | `AUTH_LIVE_SIGNIN=PENDING_INTERACTIVE` |
| Supabase Storage | `portfolio-public` (public read, service-key write) + `portfolio-private` (no client access, signed URLs) — `supabase/migrations/storage-policies.sql` | bucket existence needs dashboard/API creds | `STORAGE_POLICY=DEFINED_IN_SOURCE`, live bucket check `PENDING_INTERACTIVE` |
| Vercel | Application hosting; Preview/Development only (Production locked) | deploy needs operator authority | `PREVIEW_RUNTIME_PROOF=PENDING_OPERATOR`; no `vercel.json` (Next.js auto-detect) |
| Cloudflare | DNS / CDN / Turnstile boundary (env has Turnstile keys) | no CF credentials/session here; no `wrangler.toml` (correct) | `CLOUDFLARE_RUNTIME_PROOF=PENDING_INTERACTIVE` |

These PENDING states are external-service gaps and, per Owner policy, **do not block MODE B Database (G3–G5)** — no external service is a dependency of the additive Neon migrations.

## Verdict

**`INFRA_DEV_PREVIEW_SUBSTRATE_VERIFIED_WITH_EXTERNAL_GAPS`**

Git/CI/Neon/migration-system/env/security/server-only all verified on Development; external
services classified with explicit PENDING markers. This is NOT a claim of Production
infrastructure completeness. → AUTO-CONTINUE MODE B (G3 → G4 → G5).
