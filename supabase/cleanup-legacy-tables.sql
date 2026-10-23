-- Optional cleanup for projects created from an earlier schema.sql. Run it AFTER the
-- Storage-listing version of the site is live: the previous version still reads these
-- tables and would break if they were dropped first. Dropped data is not recoverable.
--
-- Images are now listed straight from the Storage bucket, so the images registry, its sync
-- trigger, the zines table and the unused services table are removed, along with columns
-- the site never displayed.
drop trigger if exists sync_image_registry on storage.objects;
drop function if exists public.sync_image_registry();
drop table if exists zines;
drop table if exists images;
drop table if exists services;

alter table works drop column if exists year, drop column if exists category, drop column if exists description;
alter table now_playing drop column if exists year, drop column if exists category, drop column if exists description;
