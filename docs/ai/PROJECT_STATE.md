# PROJECT_STATE

> Verified facts only. Updated at the end of each Wave. Session start reads this.

## Baseline (as of Wave 01)

- **Workspace:** `D:\web-app\portfolio` — verified, greenfield (was empty except `.claude/`).
- **Git (local):** repository not yet initialized at Wave 00; Wave 01 bootstraps it.
- **Remote:** `https://github.com/KentTho/portfolio_Van_Tho.git` — verified via `git ls-remote` = **REMOTE_EMPTY** (public, reachable, no refs, unborn). Bootstrap exception applies once.
- **Toolchain (verified):** git 2.45.1.windows.1 · node v22.18.0 · pnpm 10.11.0 · npm 11.6.0 · corepack 0.33.0.
- **Platform:** Windows 11, PowerShell.

## Owner-confirmed decisions

| Topic | Decision |
|---|---|
| Backend topology | Next.js full-stack **modular monolith** (no FastAPI/Django in V1) |
| Locales | **VI + EN**, default **VI** |
| Admin auth | **GitHub OAuth**, public signup OFF, email allow-list |
| Git authority | AI may create/edit in-scope files, branch, commit (exact-path), push feature branches, open PRs, monitor + self-heal CI. **No auto-merge, no force, no prod/DNS mutation.** Empty-repo bootstrap of `main` allowed once. |

Full rationale: `docs/ai/DECISION_LOG.md`.

## Assumed safe-defaults (not yet Owner-confirmed; changeable)

Visitor-only public users · OWNER_ADMIN only (EDITOR schema-ready, UI off) · all CMS modules · external video provider (YouTube/Loom) · Cloudflare DNS-only + Turnstile · Neon preview branch per PR · Vercel Preview URL (no domain yet) · design "inspired not cloned" · contact stored in Neon (+ optional email) · no LICENSE yet.

## Current architecture

Feature-first modular monolith, Clean Architecture layers. Neon = single primary DB. Supabase = Auth + Storage only. Vercel = runtime + CD authority. GitHub Actions = CI authority. See `docs/architecture/`.

## Current capability levels

All modules: **L0_NOT_PRESENT** (source not yet created). Wave 01 delivers design docs only (no runtime capability).

## Environment state

No external services connected. No secrets provisioned. `.env.example` is a placeholder template only.
