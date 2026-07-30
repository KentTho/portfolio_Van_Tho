# Container view (C4 Level 2)

One deployable container: the Next.js application on Vercel (Node runtime by default).

## Logical containers inside the app
- **Public web (RSC)** — `src/app/[locale]/**` server-rendered pages; cached published content.
- **Admin web** — `src/app/admin/**`; no-store; server-verified authorization.
- **Boundary APIs** — `src/app/api/**`: contact, auth logout, media upload-request/confirm, revalidate, health.
- **Auth callback** — `src/app/auth/callback/route.ts` (Supabase SSR exchange).

## Supporting infrastructure adapters (`src/infrastructure/`)
- Database client + transaction helper (Neon via Drizzle).
- Supabase clients (browser/server/middleware/storage).
- Security (authorization, csrf, origin-check, turnstile, rate-limit, sanitize-markdown, headers).
- Email port + provider adapters. Logging + audit writer. Observability. Cache.

## Runtime notes
- Node runtime for DB/auth workflows. Edge only after dependency compatibility is proven.
- Public content cached with tag/path revalidation; admin/auth/contact/upload/health-ready are no-store.
