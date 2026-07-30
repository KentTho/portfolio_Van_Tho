# Data classification

| Class | Examples | Handling |
|---|---|---|
| Public | Published projects/articles, public profile, public media | Cacheable; served to anyone; no secrets |
| Internal | Drafts, unpublished content, audit logs, site settings | Admin-only; no-store; never in public responses |
| Sensitive PII | Contact messages (name/email/message), hashed IP | Neon only; not in public API; not in logs; defined retention + deletion |
| Secret | DB URLs, Supabase secret key, Turnstile secret, email key, OAuth secrets | Server-only; never in repo/logs/bundle/screenshots; rotated per runbook |

## Retention
- Contact messages: retained while relevant; Owner can archive/delete; raw IP not stored (only `ip_hash`).
- Audit logs: append-only; retained for security review; no secrets stored.

## Logging policy
Never log tokens, cookies, passwords, DB URLs, service keys, raw Authorization headers, full contact bodies, or private media URLs. Structured logs carry `request_id`, route, status, duration, error_code, actor_class — no secrets.
