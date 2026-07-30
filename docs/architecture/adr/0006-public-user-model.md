# ADR-0006 — Public user model (visitor-only) and bilingual content

- Status: Accepted (locale Owner-confirmed 2026-07-30; visitor-only = assumed safe default)
- Deciders: Owner, engineering

## Context
"User" could mean anonymous visitor or an authenticated member. Content may be single- or multi-locale.

## Decision
- **Public users are visitors only** in V1: browse, search, download résumé, watch video, submit contact. No signup, no member accounts. (Assumed safe default — reversible if Owner requests a member area.)
- **Bilingual VI + EN**, default `vi`. `*_translations` tables from day one; English-ready in schema.

## Consequences
- (+) Minimal attack surface; no user PII beyond contact messages.
- (+) i18n baked into data model and routing (`/[locale]/...`) — no costly retrofit.
- (−) Translation authoring workload for the Owner in Admin.

## Guardrails
No public admin signup ever. Authenticated-member features only if the Owner confirms a concrete use case (not in V1).
