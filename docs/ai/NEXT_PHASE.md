# NEXT_PHASE

## NEXT_PHASE_NAME
`WAVE_04_PUBLIC_EXPERIENCE`

## WHY_NOW
Wave 03 landed the data/auth/storage foundation locally (schema + migration generated, Supabase SSR auth + admin authorization, middleware gate; typecheck/lint/test/arch/build green). The next value step is the public-facing experience that reads published content.

## PRECONDITIONS
- **Main-integration COMPLETE (Wave 03S):** CI gate + Wave 02/02B + Wave 03/03R merged to `main` @
  `cf613ec`; CI green on `main`; local validation green. Branch Wave 04 **from verified `main`**. ✅
- **Neon dev DB + Supabase storage VERIFIED (Wave 03S):** migration applied (8 tables + ledger + smoke);
  buckets created + signed-upload smoke. ✅ Public pages may still use typed **mock repositories**
  (see `docs/status/DB_CONTENT_GAP_MATRIX.md`) until CMS content exists (Wave 05).
- **Remaining before live admin (not required for Wave 04 public build):** Owner completes the Supabase
  GitHub OAuth sign-in through the app once → seed owner `app_users` row → admin authz smoke. Optional:
  deploy Vercel Preview. **Rotate the Neon password** flagged in Wave 03S.

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
