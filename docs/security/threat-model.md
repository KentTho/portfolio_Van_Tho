# Threat model

Scope: public portfolio + admin CMS on Vercel, Neon DB, Supabase Auth/Storage, Cloudflare DNS/Turnstile.

## Assets
- Admin session / identity. Content integrity (drafts vs published). Contact messages (visitor PII).
- Secrets (DB URL, Supabase secret key, Turnstile secret, email key). Media objects (public + private).

## Trust boundaries
Browser ↔ Next.js server · Next.js ↔ Neon · Next.js ↔ Supabase Auth/Storage · Next.js ↔ Cloudflare siteverify · Next.js ↔ email provider. Details in `trust-boundaries.md`.

## STRIDE summary
| Threat | Example | Mitigation |
|---|---|---|
| Spoofing | Forged admin identity / role from client | Server-side Supabase session verify + Neon `app_users` role; never trust client role |
| Tampering | Stored markdown XSS; parameter tampering (IDOR) | Sanitize markdown (no raw HTML/js:/data:); authorize per record; UUIDs + ownership checks |
| Repudiation | Admin denies an action | Append-only `audit_logs` with actor + request id |
| Information disclosure | Draft/private leakage; secret in bundle; private media URL leak | Public repos exclude non-published; server-only secrets; signed URLs; CSP; log redaction |
| Denial of service | Contact spam; upload abuse | Turnstile, rate limits, size/type limits, duplicate protection |
| Elevation of privilege | Visitor reaches admin routes; open redirect | Deny-by-default authorization; redirect allow-list; no public signup |

## Key abuse cases
- Draft leakage via public route/API → tested (`tests/security`).
- Role bypass / IDOR on admin mutations → authorization tests.
- Open redirect on OAuth callback → allow-list validation.
- Oversized/invalid/SVG upload → MIME+size validation, SVG disallowed.
- Contact flood → Turnstile + rate limit + dedupe.

## Residual risks (accepted, documented)
- Access-token TTL window after global logout (see `auth-review.md`).
- DNS-only means no edge WAF (see ADR-0005).
- MFA depends on GitHub/provider support (tracked as PENDING_SECURITY until enabled).
