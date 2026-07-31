# Wave 04 — Component Map

Presentation consumes the `PortfolioRepository` port via `@/composition/public-portfolio`
(never a concrete repository). Content types live in `src/modules/public-portfolio/domain`.

## Data / BE (the stable layer so the UI can't break)
- `modules/public-portfolio/domain/types.ts` — Profile, TechGroup, Project*, Article*, ExperienceItem.
- `.../application/ports/portfolio-repository.ts` — read-only port (public never returns drafts).
- `.../infrastructure/static-portfolio-repository.ts` + `fixtures/portfolio-content.ts` (real profile; labelled SAMPLE projects/articles).
- `composition/public-portfolio.ts` — factory (swap to Neon-backed in Wave 05, no UI change).

## Shell (locale-aware, no admin surface)
- `app/[locale]/layout.tsx` → `CosmicBackground`, `PublicHeader` (client), `PublicFooter`.
- `components/public/{public-header,language-switcher,public-footer,page-header,section-heading,sample-badge,reveal,markdown,json-ld}.tsx`.
- `components/technology/{technology-logo}` + `config/technology-catalog.ts`.

## Home sections (one file each) — `components/public/sections/`
| Section | File | Source informed | Client? |
|---|---|---|---|
| Hero (language logos) | `hero-section.tsx` | S2 hero, S1 style | yes (motion) |
| Professional focus | `focus-section.tsx` | S1/S4 | no |
| Featured case studies | `featured-projects-section.tsx` + `project-card.tsx` | S1 | no |
| Capabilities & tech | `tech-matrix-section.tsx` | S1/S5 | no |
| Engineering principles | `principles-section.tsx` | S4 | no |
| Contact CTA | `contact-cta-section.tsx` | S1 | no |

## Routes — `app/[locale]/`
`/` · `/about` · `/projects` + `/projects/[slug]` · `/articles` + `/articles/[slug]` · `/resume` · `/contact`
(+ `robots.ts`, `sitemap.ts`). vi default, en secondary. Public pages are SSG.
