# System context (C4 Level 1)

## Actors
- **Public visitor** — anonymous; reads published content, watches demos, downloads résumé, submits contact.
- **Owner admin** — authenticated (GitHub OAuth); manages all content via the Admin dashboard.

## External systems
- **Vercel** — hosts and runs the Next.js app; Preview + Production deployments.
- **Neon PostgreSQL** — primary application data.
- **Supabase Auth** — identity provider (GitHub OAuth).
- **Supabase Storage** — media/object storage.
- **Cloudflare** — authoritative DNS + Turnstile bot verification.
- **Video provider** (YouTube Unlisted / Loom) — hosts full project demos.
- **Email provider** (optional, e.g. Resend) — contact notifications.
- **GitHub** — source, CI, PRs.

## Context diagram
```
        ┌───────────────┐         ┌───────────────┐
        │ Public visitor│         │  Owner admin  │
        └──────┬────────┘         └──────┬────────┘
               │ HTTPS                    │ HTTPS (GitHub OAuth)
               ▼                          ▼
        ┌──────────────────────────────────────────┐
        │      Next.js app (Vercel)                 │
        │  public experience + admin CMS + APIs     │
        └───┬──────────┬───────────┬──────────┬─────┘
            │          │           │          │
            ▼          ▼           ▼          ▼
        ┌───────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
        │ Neon  │ │Supabase │ │Supabase  │ │Cloudflare│
        │  DB   │ │  Auth   │ │ Storage  │ │Turnstile │
        └───────┘ └─────────┘ └──────────┘ └──────────┘
                        (DNS via Cloudflare → Vercel)
```
