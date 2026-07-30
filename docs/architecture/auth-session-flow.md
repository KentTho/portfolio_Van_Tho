# Auth & session flow

Identity provider: **Supabase Auth (GitHub OAuth)**. Authorization decided in the application against Neon `app_users`.

## Login (admin)
```
Owner → /admin/login → GitHub OAuth (Supabase) → /auth/callback (SSR code exchange)
      → session cookie set (SSR flow) → redirect to /admin (allow-list validated)
```

## Authorization sequence (every admin request/mutation)
1. Read session via official Supabase SSR flow.
2. Verify session server-side; extract Supabase user id.
3. Load `app_users` by `supabase_auth_user_id` from Neon.
4. Require `status = active`.
5. Require `role` sufficient for the use case.
6. Compare session issue time vs `credentials_revoked_at` when revocation policy applies.
7. Enforce per-use-case permission (deny by default).
8. Audit sensitive mutations.
9. Continue, or **fail closed**.

## Logout
- **Local:** local sign-out; clear session; verify protected route no longer accessible.
- **Global:** provider global sign-out + set `credentials_revoked_at`; sensitive ops reject sessions issued before that timestamp when supportable.

## Honest limitations
Global logout revokes refresh/session state, but already-issued access tokens remain valid until their natural expiry. This residual window is documented in `docs/security/auth-review.md`; we do not claim instant provider-level token invalidation.

## Rules
No public admin signup. No custom JWT (unless explicitly approved). No role claim from client. Cookies Secure/HttpOnly per SSR guidance; SameSite chosen for OAuth callback compatibility. Login rate-limited, generic errors, redirect allow-list (no open redirect).
