# Auth review

## Model
Supabase Auth (GitHub OAuth) for identity; authorization in the application against Neon `app_users` (allow-list + `owner_admin` + `active`). No public admin signup. No custom JWT.

## Checks
- [ ] Session read + verified server-side (SSR flow) on every admin route/action.
- [ ] `app_users` loaded from Neon; status/role enforced; deny by default.
- [ ] Login rate-limited; generic errors; no email enumeration.
- [ ] OAuth callback redirect validated against an allow-list (no open redirect).
- [ ] Cookies Secure (prod), HttpOnly where supported, SameSite chosen for callback compatibility.
- [ ] Local logout clears session; global logout sets `credentials_revoked_at`.
- [ ] Sensitive ops reject sessions issued before revocation timestamp when supportable.

## Honest limitation — access-token TTL
Global logout revokes refresh/session state, but a previously issued access token remains valid until its natural expiry. We do **not** claim instant provider-level invalidation. Sensitive mutations additionally check `credentials_revoked_at` to shrink the window where technically supportable.

## MFA
Recommended for the owner admin. If the selected plan/provider cannot enforce the requested method, record status **PENDING_SECURITY** rather than blocking implementation.
