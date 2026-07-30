# ADR-0003 — Supabase for Auth and Storage

- Status: Accepted (auth method Owner-confirmed 2026-07-30)
- Deciders: Owner, engineering

## Context
We need a managed identity provider and object storage without running our own auth server or building a custom JWT issuer.

## Decision
Use **Supabase Auth** (GitHub OAuth for Admin) and **Supabase Storage**. Public admin signup is disabled; admin access requires the email allow-list **and** an active `owner_admin` row in Neon, verified server-side.

## Consequences
- (+) SSR session handling per Supabase official guidance; no custom JWT.
- (+) Storage split into `portfolio-public` (public read / admin write) and `portfolio-private` (signed URL only).
- (−) Global logout revokes sessions but existing access tokens live until expiry — documented honestly (see auth review).

## Guardrails
Server-side session verification only; never trust client role claims. Service/secret key never reaches the browser. Refresh tokens are never stored in Neon. SVG uploads disallowed by default.
