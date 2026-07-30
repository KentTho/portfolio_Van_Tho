# ADR-0001 — Next.js modular monolith with Clean Architecture

- Status: Accepted (Owner-confirmed 2026-07-30)
- Deciders: Owner (Van Tho), engineering

## Context
V1 is a personal portfolio + CMS. We need low operational complexity, one deployment authority, strong testability, and room to later extract AI/RAG work — without over-engineering.

## Decision
Build a **feature-first modular monolith** on Next.js App Router with Clean Architecture layers:
`presentation → application → domain`; `infrastructure` implements application/domain ports. Feature modules live in `src/modules/<feature>/{domain,application,infrastructure,presentation}`. `src/app` stays at the framework-conventional location.

## Consequences
- (+) Single deploy, single auth path, cheap, easy to test and secure.
- (+) Future Python/RAG service can be split out behind application ports without rewrites.
- (−) Discipline required to keep layer boundaries (enforced by ESLint + dependency-cruiser + arch tests).

## Alternatives rejected
- Next + FastAPI/Django now → two backend authorities, duplicate auth, more infra — no live Python use case in V1.
- Microservices → unjustified for a single-owner portfolio.

## Guardrails
No microservices in V1. No second backend authority. No duplicated auth. Add CORS/service-to-service only when a real need appears.
