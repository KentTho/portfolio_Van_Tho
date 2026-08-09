# Wave-05 Database Contract — Final Audit (MODE B)

> Authority audit of every Wave-05 table on Neon **Development**. Not a Production claim.
> Ledger = 6 (`0000`–`0005`), applied on Neon Dev = 6 (no drift). Public tables = 25
> (8 kernel + 17 Wave-05). No fixtures remain. Prompt: INFRA-DATABASE-CLOSURE-01 §S.

## Authority matrix (Wave-05 tables)

Legend — DELETE: `soft`=deleted_at, `cascade`=FK cascade from parent, `restrict`=blocks
parent delete, `setnull`=FK set null. LOCALE: `check`=vi/en CHECK constraint. RV=row_version.
All rows: LEDGER_STATUS=applied, DEV_RUNTIME_PROOF=verified (live smoke this session).

| Table | Owner | PK | Foreign keys | Delete policy | Unique | Indexes | Locale | Public visibility | RV | Migration |
|-------|-------|----|--------------|--------------|--------|---------|--------|-------------------|----|-----------|
| technologies | technologies | uuid | — | soft | slug | (category,sort) | — | is_visible | — | 0001 |
| tags | shared | uuid | — | soft | slug | (sort) | — | — | — | 0001 |
| projects¹ | projects | uuid | cover_media_id→media_assets setnull | soft | slug | (status,published),(featured) | via translations | status+visibility | ✓ | 0000/0002 |
| project_translations | projects | uuid | project_id→projects cascade | cascade | (project,locale) | — | check | — | — | 0002 |
| project_sections | projects | uuid | project_id→projects cascade | cascade | (project,kind) | — | — | is_visible | — | 0002 |
| project_section_translations | projects | uuid | section_id→project_sections cascade | cascade | (section,locale) | — | check | — | — | 0002 |
| project_technologies | projects | uuid | project_id cascade; technology_id→technologies **restrict** | cascade/restrict | (project,technology) | — | — | — | — | 0002 |
| project_media | projects | uuid | project_id cascade; media_id→media_assets **restrict** | cascade/restrict | — | (project,sort) | — | — | — | 0002 |
| project_links | projects | uuid | project_id→projects cascade | cascade | — | (project,sort) | — | — | — | 0002 |
| project_metrics | projects | uuid | project_id→projects cascade | cascade | — | (project,sort) | — | — | — | 0002 |
| articles | articles | uuid | cover_media_id→media_assets setnull | soft | slug | (status,published) | via translations | status | ✓ | 0003 |
| article_translations | articles | uuid | article_id→articles cascade | cascade | (article,locale) | — | check | — | — | 0003 |
| article_tags | articles | uuid | article_id cascade; tag_id→tags **restrict** | cascade/restrict | (article,tag) | — | — | — | — | 0003 |
| experiences | career | uuid | — | soft | — | (visible,sort) | via translations | is_visible | ✓ | 0004 |
| experience_translations | career | uuid | experience_id→experiences cascade | cascade | (exp,locale) | — | check | — | — | 0004 |
| education | career | uuid | — | soft | — | (visible,sort) | neutral² | is_visible | ✓ | 0004 |
| certifications | career | uuid | — | soft | — | (visible,sort) | neutral² | is_visible | ✓ | 0004 |
| content_revisions | revisions | uuid | actor_user_id→app_users setnull | append-only³ | (content_type,content_id,version) | (type,id,created) | optional col | — | — | 0005 |

¹ `projects` is a kernel table (0000) extended in Wave 05 (cover FK, 0002). Legacy
`github_url/live_url/video_url` retained, deprecated in favor of `project_links` (no DROP).
² education/certifications hold locale-neutral facts; bilingual display can be added
additively later (no translation table this phase, per prompt table list).
³ `content_revisions` has no `updated_at`/`deleted_at` — immutable by design; a restore is
a forward mutation on the live entity, never a destructive rewrite. No Dev auto-purge.

## Cross-cutting checks

- **No duplicate authority:** `audit_logs` (who/action/time) ≠ `content_revisions` (content state); `skills` (proficiency) ≠ `technologies` (catalog); `media_assets` is the sole blob authority (project_media/*_cover reference it).
- **Reference-aware deletes:** technology/media/tag references use RESTRICT; parent→child use CASCADE; media covers use SET NULL. Verified live (RESTRICT blocks, CASCADE cleans).
- **Draft never public:** projects (status+visibility) and articles (status) gate public reads; the neutral `PortfolioRepository` returns published+public+non-deleted only (G2b, verified).
- **Locale:** all translation tables enforce `in ('vi','en')` CHECK + unique (parent,locale).
- **Migration integrity:** ledger 6 = applied 6 (no drift); all migrations additive (no DROP/TRUNCATE/destructive ALTER); Neon Development only; Production untouched.
- **Schema ↔ Drizzle parity:** `drizzle-kit generate` produced no pending diff after 0005; `getDb()` client compiles against the schema; build green.
- **Dev fixtures absent:** post-run scan shows 0 `smoke-%` rows across projects/technologies/articles/tags and 0 revision fixtures.

## Verdict

**`WAVE05_DATABASE_CONTRACT_DEV_VERIFIED`** — the full Wave-05 database contract (G1→G5) is
designed, migrated additively, and runtime-proven on Neon Development. Backend/Admin
application layer for articles/career/revisions is intentionally deferred (DB-only phase).
Not Production-ready.
