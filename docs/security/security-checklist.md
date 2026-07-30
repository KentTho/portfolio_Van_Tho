# Security checklist (living)

## Authentication & authorization
- [ ] No public admin signup. Allow-list + `owner_admin` + `active` enforced server-side.
- [ ] Deny by default; per-use-case permissions; never trust client role/flags.
- [ ] Login rate-limited; generic errors; redirect allow-list.

## Input & output
- [ ] Server-side validation at every boundary; length limits; normalization.
- [ ] Markdown sanitized (no raw HTML, no `javascript:`/`data:` URLs); URL protocol allow-list.
- [ ] Safe error mapping (error taxonomy); no stack traces to public.

## Uploads
- [ ] MIME + extension + size validation; safe generated path; SVG disallowed by default.
- [ ] Public/private bucket separation; reference-aware deletion.

## Headers (Wave 02+/06)
- [ ] CSP (avoid `unsafe-inline`; nonce/hash; allow only required providers incl. selected video origins).
- [ ] HSTS (after HTTPS/domain validation), X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP `frame-ancestors`.

## CSRF
- [ ] Origin/Host validation on cookie-authenticated mutations; framework protections; explicit anti-CSRF where needed.

## Secrets & dependencies
- [ ] `.env*` ignored except `.env.example`; no secret in repo/logs/bundle/screenshots.
- [ ] Lockfile pinned; minimal deps; audit new transitive deps; secret scanning in CI (Wave 07).

## Data & privacy
- [ ] Public repos never return drafts/private; contact never in public API; IP hashed; retention defined.
- [ ] Audit logging for sensitive admin actions; no secrets in audit metadata.

## Verification owners
Header/CSP/CSRF → Wave 02/06. Storage RLS → Wave 03/07. Security scans (CodeQL, dependency review, secret scan) → Wave 07. Security E2E (draft leakage, IDOR, XSS, upload abuse, rate limit) → Wave 08.
