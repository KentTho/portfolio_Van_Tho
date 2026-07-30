# portfolio_Van_Tho

Personal engineering evidence platform for **Van Tho** — a production-grade portfolio that doubles as proof of
software-engineering, full-stack, database, auth, Clean Architecture, CI/CD, cloud, security, and technical-writing skill.

> Status: **Wave 01 — Architecture & Governance (design docs)**. No application code yet. See `docs/ai/PROJECT_STATE.md`.

## What this is

- **Public experience** — visitors browse projects, case studies, articles, résumé, and video demos, and can contact the Owner.
- **Admin dashboard** — the Owner edits all content (profile, projects, articles, media, SEO, settings, messages) without touching source.
- **Engineering governance** — architecture docs, ADRs, threat model, tests, CI/CD, and runbooks are first-class artifacts.

## Tech stack (target)

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router) — full-stack modular monolith |
| Language | TypeScript (strict) |
| UI | Tailwind CSS, shadcn/ui, Lucide, Framer Motion (only when justified) |
| Primary DB | Neon PostgreSQL + Drizzle ORM |
| Auth | Supabase Auth (GitHub OAuth, admin allow-list, no public signup) |
| Storage | Supabase Storage (public/private buckets, signed URLs) |
| Hosting / CD | Vercel (Git Integration) |
| DNS / bot | Cloudflare DNS + Turnstile (DNS-only by default) |
| CI | GitHub Actions |
| Tests | Vitest, React Testing Library, Playwright, axe |

Versions are pinned via the lockfile at Wave 02; this README does not hardcode versions.

## Architecture

Feature-first modular monolith with Clean Architecture layers (`presentation → application → domain`, `infrastructure` implements ports). See [`docs/architecture/`](docs/architecture/) and the [ADRs](docs/architecture/adr/).

## Repository conventions

- Package manager: **pnpm**. Node version pinned in `.node-version`.
- Contribution rules, scope discipline, and Git policy live in [`CLAUDE.md`](CLAUDE.md).
- Environment variables: copy `.env.example` → `.env.local` and fill real values (never commit real secrets).

## Documentation map

- [`CLAUDE.md`](CLAUDE.md) — governance / how we build
- [`docs/ai/`](docs/ai/) — live project state, decisions, scope, handoff
- [`docs/architecture/`](docs/architecture/) — architecture views + ADRs
- [`docs/security/`](docs/security/) — threat model, trust boundaries, checklists

## License

No license yet — **all rights reserved** by default until the Owner selects one.
