-- Upgrade a project created from an earlier schema.sql (run once in the SQL editor).
-- Images are now listed straight from the Storage bucket, so the images registry,
-- its sync trigger, the zines table and the unused services table are removed,
-- along with display-unused columns on works and now_playing.

-- Let the site list the bucket's folders
drop policy if exists "Public list images" on storage.objects;
create policy "Public list images" on storage.objects for select to anon, authenticated using (bucket_id = 'images');

-- Remove the registry trigger and tables
drop trigger if exists sync_image_registry on storage.objects;
drop function if exists public.sync_image_registry();
drop table if exists zines;
drop table if exists images;
drop table if exists services;

-- Remove columns the site never displayed
alter table works drop column if exists year, drop column if exists category, drop column if exists description;
alter table now_playing drop column if exists year, drop column if exists category, drop column if exists description;
