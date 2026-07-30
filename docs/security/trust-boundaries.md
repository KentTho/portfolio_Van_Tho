# Trust boundaries

| # | Boundary | What crosses | Controls |
|---|---|---|---|
| B1 | Browser → Next.js server | Form input, params, cookies | Server-side validation, CSRF/origin checks, rate limit, auth verification |
| B2 | Next.js → Neon | SQL via Drizzle | Server-only credentials, least-privilege runtime role, parameterized queries, transactions |
| B3 | Next.js → Supabase Auth | Session/token exchange | Official SSR flow, server-side verification, no client role trust |
| B4 | Next.js → Supabase Storage | Signed upload/read | Role+bucket+path validation, signed URLs, service key server-only |
| B5 | Next.js → Cloudflare siteverify | Turnstile token | Server-side verification before persistence |
| B6 | Next.js → email provider | Notification payload | Server-only key; failure does not lose persisted message |
| B7 | CI/CD → providers | Secrets in Actions/Vercel | Environment separation; preview never uses prod secrets |

## Principles
- Validate/authorize on the **server** at every boundary; the client is untrusted.
- Secrets live only on the server; `NEXT_PUBLIC_*` is browser-safe only.
- Fail closed. Deny by default. Log decisions without logging secrets.
