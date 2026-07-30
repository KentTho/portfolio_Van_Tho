-- Supabase Storage RLS policies for portfolio_Van_Tho.
-- Apply in the Supabase project (SQL editor or supabase CLI). NOT executed by the app.
-- Buckets: portfolio-public (public read / admin write), portfolio-private (signed URL only).
--
-- Assumes an is_owner_admin() helper resolves the current auth.uid() to an active
-- owner_admin. Adjust to your project's admin-claim strategy.

-- Public bucket: anyone may read; only admins may write/update/delete.
create policy "public_read_portfolio_public"
  on storage.objects for select
  using ( bucket_id = 'portfolio-public' );

create policy "admin_write_portfolio_public"
  on storage.objects for insert
  with check ( bucket_id = 'portfolio-public' and (select is_owner_admin()) );

create policy "admin_update_portfolio_public"
  on storage.objects for update
  using ( bucket_id = 'portfolio-public' and (select is_owner_admin()) );

create policy "admin_delete_portfolio_public"
  on storage.objects for delete
  using ( bucket_id = 'portfolio-public' and (select is_owner_admin()) );

-- Private bucket: no public read; admin-only for every operation. Reads go through
-- short-lived signed URLs issued by the server.
create policy "admin_all_portfolio_private"
  on storage.objects for all
  using ( bucket_id = 'portfolio-private' and (select is_owner_admin()) )
  with check ( bucket_id = 'portfolio-private' and (select is_owner_admin()) );
