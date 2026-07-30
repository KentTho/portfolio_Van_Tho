# Contact flow

Durability principle: **Neon is the source of truth**; email is a best-effort notification adapter.

## Sequence
```
Visitor submits form (name, email, message, locale, Turnstile token)
→ POST /api/contact
   1. validate input server-side (length, normalization, email format, no HTML exec)
   2. rate-limit + duplicate-submission protection
   3. Turnstile siteverify (server) → BOT_VERIFICATION_FAILED on failure
   4. persist contact_messages row (turnstile_verified=true, ip_hash, source_page)
   5. attempt email notification (adapter) → record email_delivery_status
   6. return safe success (with request_id) AFTER persistence
```

## Rules
- Do **not** roll back the persisted message if the email provider fails; expose Admin retry (`RetryNotification`).
- Never expose messages via any public API; never log the full message body; hash or avoid storing raw IP; define retention + deletion.
- Generic client errors; request id for correlation.

## Admin inbox
`/admin/messages`: list, mark read, archive, retry notification. Status timestamps: `read_at`, `archived_at`.
