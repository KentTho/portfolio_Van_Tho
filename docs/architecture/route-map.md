# Route map

## Public (`/[locale]` — locale ∈ {vi, en}, default vi)
`/` → resolve/redirect default locale · `/[locale]` home · `/about` · `/projects` · `/projects/[slug]` · `/experience` · `/skills` · `/articles` · `/articles/[slug]` · `/resume` · `/contact`

Rendering: server-rendered/SSG where appropriate; published content cached with tag/path revalidation.

## Auth
`/admin/login` · `/auth/callback` (route handler, SSR code exchange) · `/auth/error`

## Admin (authorized, no-store)
`/admin` · `/admin/profile` · `/admin/projects` · `/admin/projects/new` · `/admin/projects/[id]` · `/admin/projects/[id]/preview` · `/admin/articles` · `/admin/experience` · `/admin/skills` · `/admin/education` · `/admin/certifications` · `/admin/media` · `/admin/messages` · `/admin/settings` · `/admin/audit` · `/admin/security`

## API / boundary (route handlers)
`/api/contact` · `/api/auth/logout` · `/api/auth/logout-all` · `/api/media/upload-request` · `/api/media/upload-confirm` · `/api/revalidate` · `/api/health/live` · `/api/health/ready`

## Rules
- Prefer secure Server Actions for internal admin mutations over creating a REST endpoint per action.
- `/api/health/live` shallow; `/api/health/ready` may test dependencies with safe timeout; neither exposes secrets/DB URL/provider detail.
- Admin/auth/draft routes are excluded from indexing (robots) and never cached as public.
