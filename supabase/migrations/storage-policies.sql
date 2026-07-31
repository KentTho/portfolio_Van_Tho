-- Supabase Storage configuration for portfolio_Van_Tho.
-- Model: SERVER_MEDIATED_STORAGE_AUTHORIZATION (see CLAUDE.md §14, docs/security).
-- Apply in the Supabase project (SQL editor or supabase CLI). NOT executed by the app.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- AUTHORITY MODEL (read before applying)
-- ─────────────────────────────────────────────────────────────────────────────
-- * Neon PostgreSQL is the SOLE authority for admin role (app_users.role =
--   owner_admin, status = active). Supabase Postgres does NOT know who is an admin.
--   We deliberately do NOT duplicate roles into Supabase, and do NOT add custom JWT
--   role claims in V1 (would require a separate ADR).
-- * Therefore the previous `is_owner_admin()` helper is REMOVED — it was undefined in
--   Supabase and could not resolve admin identity safely.
-- * All writes are mediated by the Next.js server, which:
--     1. verifies the Supabase Auth session,
--     2. checks active owner_admin in Neon (application authorization),
--     3. validates bucket + path + MIME + byte size (domain policy),
--     4. uses the SERVICE (secret) key to create a short-lived signed upload URL.
--   The service key bypasses RLS by design and lives only in env.server.ts (server-only).
--   Reference: src/modules/media/**, src/app/api/media/upload-url/route.ts.
--
-- Buckets:
--   portfolio-public   → public READ; writes only via the server service key.
--   portfolio-private  → no public read; reads via short-lived server-signed URLs.
--
-- Create the buckets first (Dashboard → Storage, or the API):
--   portfolio-public  : public = true
--   portfolio-private : public = false

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS POLICIES (for the anon/authenticated roles; the service key is exempt)
-- ─────────────────────────────────────────────────────────────────────────────

-- Public bucket: anyone may READ. No anon/authenticated write path exists — writes
-- arrive through the service key (RLS-exempt), so we grant NO insert/update/delete
-- to browser roles. This is deny-by-default for the client.
create policy "public_read_portfolio_public"
  on storage.objects for select
  using ( bucket_id = 'portfolio-public' );

-- Private bucket: NO policy for anon/authenticated → all client access denied.
-- Reads and writes happen only through server-created signed URLs (service key).
-- (Intentionally no create/select/update/delete policy here for browser roles.)

-- NOTE: If you later introduce Supabase-native admin JWT claims, gate writes with a
-- verified claim in a separate ADR. Until then, browser roles have zero write access
-- and Neon remains the single source of admin authority.
