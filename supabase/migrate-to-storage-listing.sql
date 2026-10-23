-- Required for any project running the Storage-listing version of the site (safe to re-run).
-- Lets the site list the bucket's folders (Bio/, Collage/, Poster/, Zines/). Without it the
-- listings come back empty and pages show their fallback content. Run this before deploying.
-- Projects created from the current schema.sql already have it.
drop policy if exists "Public list images" on storage.objects;
create policy "Public list images" on storage.objects for select to anon, authenticated using (bucket_id = 'images');
