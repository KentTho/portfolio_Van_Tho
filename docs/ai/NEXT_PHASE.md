# NEXT_PHASE

## NEXT_PHASE_NAME
`WAVE_04_PUBLIC_EXPERIENCE`

## WHY_NOW
Wave 03 landed the data/auth/storage foundation locally (schema + migration generated, Supabase SSR auth + admin authorization, middleware gate; typecheck/lint/test/arch/build green). The next value step is the public-facing experience that reads published content.

## PRECONDITIONS
- Owner reviews the stacked Wave 03 branch/PR.
- (For live data) Owner completes Wave 03 **target proof**: apply Neon migration (`pnpm db:migrate` with unpooled URL), configure Supabase GitHub OAuth, create storage buckets, seed an owner `app_users` row. Public pages can be built against seed/placeholder data until then.

## ALLOWED_ACTIONS
- Public routes `/[locale]/**` (home, about, projects + `[slug]` case study, articles, resume, contact UI), i18n routing (vi/en) with default vi.
- SEO: metadata, canonical, Open Graph, sitemap, robots, JSON-LD. Accessibility (WCAG 2.2 AA) + responsive.
- Read published content via repositories/ports (public repos never return drafts/private). Explicit placeholders marked as such.

## FORBIDDEN_ACTIONS
- No production deploy/DNS. No live prod migration. No GitHub Actions (Wave 07). No fabricated projects/metrics/testimonials. No admin CRUD (Wave 05).

## EXPECTED_VERDICT
`PUBLIC_EXPERIENCE_LOCAL_PASS`

## WHAT_IT_UNLOCKS
A verifiable public portfolio surface for recruiters/leads, ready for Admin CMS (Wave 05) to populate.
