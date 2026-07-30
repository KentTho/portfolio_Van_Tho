# ADR-0005 — Cloudflare DNS-only + Turnstile (no proxy/WAF in V1)

- Status: Accepted
- Deciders: Owner, engineering

## Context
Cloudflare can act as DNS only, or as a proxy/WAF/CDN in front of Vercel. Proxying in front of Vercel introduces double-cache, TLS mode, origin verification, forwarded-IP, and header concerns.

## Decision
Use Cloudflare as **authoritative DNS only**, pointing to Vercel per Vercel's domain verification, plus **Turnstile** for contact-form bot protection. No orange-cloud proxy/WAF by default.

## Consequences
- (+) No double-proxy/cache pitfalls; no false "WAF protects us" claims.
- (+) Turnstile verified server-side via siteverify before persisting contact messages.
- (−) No edge WAF benefits until a separate approved design phase enables them.

## Guardrails
Do not infer Cloudflare WAF protection when records are DNS-only. Enabling proxy requires a dedicated design/validation phase (TLS mode, cache ownership, headers, rollback to DNS-only).
