# Architecture — portfolio_Van_Tho

Feature-first **modular monolith** on Next.js App Router with **Clean Architecture** boundaries.

## Index
- [system-context.md](system-context.md) — actors and external systems (C4 L1)
- [container-view.md](container-view.md) — runtime containers (C4 L2)
- [component-view.md](component-view.md) — module/layer components (C4 L3)
- [dependency-rules.md](dependency-rules.md) — layer import rules + enforcement
- [data-model.md](data-model.md) — Neon schema, invariants, indexes
- [auth-session-flow.md](auth-session-flow.md) — Supabase Auth → admin authorization
- [admin-publish-flow.md](admin-publish-flow.md) — draft → publish → revalidate
- [media-upload-flow.md](media-upload-flow.md) — signed upload to Supabase Storage
- [contact-flow.md](contact-flow.md) — Turnstile → persist → notify
- [deployment-topology.md](deployment-topology.md) — Vercel / Neon / Supabase / Cloudflare
- [adr/](adr/) — accepted decisions

## Layers (dependency direction)
```
presentation ──▶ application ──▶ domain
        ▲                             ▲
        └──────── infrastructure ─────┘   (implements ports; depends inward only)
```
Domain is framework/provider free. Application depends on ports (interfaces). Infrastructure implements them. Presentation composes.

## Provider ownership (one owner per capability)
| Capability | Owner |
|---|---|
| Hosting, runtime, CD, framework CDN | Vercel |
| Primary application data + migrations | Neon |
| Identity, sessions | Supabase Auth |
| Object storage + delivery | Supabase Storage |
| DNS, Turnstile | Cloudflare |
| Version control, CI, PR, branch protection | GitHub |
| Authorization, content workflow, validation, audit, cache invalidation | Application |
