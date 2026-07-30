# Permissions map

Deny by default. Permissions enforced server-side per use case (`src/config/permissions.ts`).

## PUBLIC_VISITOR
Read published profile/projects/articles · filter/search public content · view diagrams/video · follow external links · download public résumé · submit contact · change theme/locale.
**Denied:** any mutation, admin routes, private storage, contact messages, drafts.

## OWNER_ADMIN
Full admin dashboard; manage profile/projects/sections+ordering/technologies/skills/experience/education/certifications/articles/media/résumé/social/SEO/site-settings; read+update contact status; preview drafts; publish/unpublish; restore revisions; view audit logs; logout current/all sessions.

## EDITOR (schema-ready, UI disabled in V1)
Would manage content only. Cannot manage admins, modify security settings, rotate credentials, delete audit logs, or promote production.

## AUTHENTICATED_USER (not in V1)
Only if the Owner confirms a concrete use case. No public signup in V1.

## Enforcement
Authorization runs in the application (use case / policy layer), never via hidden UI. Public/draft/private filtering happens inside repositories or use cases, not in the view.
