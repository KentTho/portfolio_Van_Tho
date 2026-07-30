# Deployment topology

## Request path (safe default — DNS-only)
```
Visitor → Cloudflare DNS → Vercel → Next.js → application layer → Neon / Supabase
```
Cloudflare is authoritative DNS only (no orange-cloud proxy). Turnstile widget → server siteverify on contact.

## Environments
| Env | Frontend/runtime | Database | Auth/Storage |
|---|---|---|---|
| Local | `next dev` | Neon dev branch (or local) | Supabase dev project |
| Preview (per PR) | Vercel Preview | Neon preview branch | Supabase dev project (non-prod) |
| Production | Vercel Production (`main`) | Neon production | Supabase production project |

Rules: Preview never uses production secrets. Production Auth/Storage secrets stay out of Preview. Domain attaches only after human approval (until then, Vercel Preview URL).

## CI/CD authority
- **GitHub Actions** = CI (quality gate).
- **Vercel Git Integration** = deployment (Preview per PR, Production from `main`). No duplicate deploy jobs.
- Production DB migration is a separate, human-approved workflow (`production-migrate.yml`, Wave 07) — never inside deploy.

## Recovery
Vercel deployment rollback; forward-compatible Neon migrations + Neon restore per plan; content revision restore; media reconciliation; contact notification retry; documented secret rotation. System is not called "recoverable" until runbooks + environment support are verified (Wave 10).
