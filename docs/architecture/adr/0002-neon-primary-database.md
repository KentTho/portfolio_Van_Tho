# ADR-0002 — Neon PostgreSQL as the single primary database

- Status: Accepted
- Deciders: Owner, engineering

## Context
Two systems can store relational data (Neon and Supabase Postgres). Having two authorities for the same capability creates ambiguity and risk (`STOP_DUAL_DATABASE_AUTHORITY`).

## Decision
**Neon PostgreSQL is the single primary application database.** Drizzle ORM + Drizzle Kit. Supabase is used **only** for Auth and Storage. Identity is bridged by storing `supabase_auth_user_id` on `app_users` — **no cross-database foreign keys**.

## Consequences
- (+) Clear data ownership; Neon preview branches per PR; forward-only migrations.
- (+) Pooled connection at runtime; direct/unpooled connection reserved for approved migrations.
- (−) Identity mapping and consistency handled in application code, not DB FKs.

## Guardrails
Public repositories never return draft/private rows. Multi-table writes use transactions. No `db push` on shared/prod; no destructive migration at startup.
