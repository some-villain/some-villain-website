-- Andrew Davies Film: content schema (Supabase-only: tables + Storage)
--
--   Text and links  -> tables (site_settings, social_links, home_settings, about_settings, services)
--   Videos          -> works (provider + video_id, e.g. YouTube)
--   Images          -> files live in the public Storage bucket "images";
--                      the images table registers each file by its path in the bucket
--                      (kept in sync by a trigger on storage.objects). The site reads
--                      Bio/, Collage/, Poster/ and Zines/Zine<N>/ by folder.
--
-- Public URL of an image: <SUPABASE_URL>/storage/v1/object/public/images/<images.path>
-- All tables are publicly readable (anon SELECT) with no public writes.
-- Run once in the SQL editor, then manage rows in the table editor.

-- ---------------------------------------------------------------------------
-- Images registry (one row per file in the "images" bucket)
-- ---------------------------------------------------------------------------
create table if not exists images (
  id bigint generated always as identity primary key,
  path text not null unique, -- object name inside the bucket, e.g. 'Zines/1_Cover_WA_1_ielo71.png'
  alt text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Text + links
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  name text not null,
  tagline text not null,
  location text not null,
  email text not null
);

create table if not exists social_links (
  id bigint generated always as identity primary key,
  label text not null,
  href text not null,
  sort_order integer not null default 0
);

create table if not exists home_settings (
  id integer primary key default 1 check (id = 1),
  hero_video_id text not null, -- YouTube ID for the autoplay loop
  intro text not null
);

create table if not exists about_settings (
  id integer primary key default 1 check (id = 1),
  byline text not null default '', -- one line shown above the bio
  bio text not null -- separate paragraphs with a blank line
);

create table if not exists services (
  id bigint generated always as identity primary key,
  label text not null,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Works (videos shown in the Works gallery)
-- ---------------------------------------------------------------------------
create table if not exists works (
  id bigint generated always as identity primary key,
  title text not null,
  year text not null,
  category text not null check (category in ('Short Film', 'Commercial', 'Wedding & Event', 'Social')),
  provider text not null default 'youtube' check (provider in ('youtube', 'vimeo')),
  video_id text not null, -- the ID from the video URL (youtube.com/watch?v=<ID>)
  description text not null default '', -- not shown on the site
  sort_order integer not null default 0
);

-- Home page "Now Playing" feature (single row, separate from the Works gallery)
create table if not exists now_playing (
  id integer primary key default 1 check (id = 1),
  title text not null,
  year text not null,
  category text not null check (category in ('Short Film', 'Commercial', 'Wedding & Event', 'Social')),
  provider text not null default 'youtube' check (provider in ('youtube', 'vimeo')),
  video_id text not null,
  description text not null default '' -- not shown on the site
);

-- ---------------------------------------------------------------------------
-- Zines: title and description only; cover and pages come from Zines/Zine<N>/ in the bucket
-- ---------------------------------------------------------------------------
create table if not exists zines (
  id bigint generated always as identity primary key,
  slug text unique, -- stable key, e.g. 'zine-1'
  title text not null,
  year text not null,
  description text not null default '', -- not shown on the site
  sort_order integer not null default 0
);

create unique index if not exists works_provider_video_key on works (provider, video_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: public read, no public writes
-- ---------------------------------------------------------------------------
alter table images enable row level security;
alter table site_settings enable row level security;
alter table social_links enable row level security;
alter table home_settings enable row level security;
alter table about_settings enable row level security;
alter table services enable row level security;
alter table works enable row level security;
alter table now_playing enable row level security;
alter table zines enable row level security;

create policy "Public read images" on images for select using (true);
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read social_links" on social_links for select using (true);
create policy "Public read home_settings" on home_settings for select using (true);
create policy "Public read about_settings" on about_settings for select using (true);
create policy "Public read services" on services for select using (true);
create policy "Public read works" on works for select using (true);
create policy "Public read now_playing" on now_playing for select using (true);
create policy "Public read zines" on zines for select using (true);

-- ---------------------------------------------------------------------------
-- Seed: text content (from the current placeholder copy in lib/content.ts)
-- ---------------------------------------------------------------------------
insert into site_settings (id, name, tagline, location, email) values
  (1, 'Some Villain', 'Seattle-based film and zine makers', 'Seattle, WA', 'somevillainfilms@gmail.com');

insert into social_links (label, href, sort_order) values
  ('Instagram', 'https://www.instagram.com/some.villain', 1),
  ('YouTube', 'https://youtube.com/@some.villain', 2);

insert into home_settings (id, hero_video_id, intro) values
  (1, 'WpX3ctbQq0E', 'Seattle-based film and zine makers');

insert into about_settings (id, byline, bio) values
  (1, 'Andrew Davies - Creative Director', 'I’m a writer, filmmaker, and performer from Seattle, WA with a lifelong passion for storytelling that began when I played a seagull in Treasure Island at age six. Theater taught me the power of collaboration, the magic that happens when creatives combine their different perspectives and skills. Today I channel that magic into my short films and creative work.

As a freelance filmmaker, I bring years of storytelling experience to every project. From social media campaigns and commercials to event and wedding films, I have found that the key to success is always collaboration, creating work that is not only visually striking but also deeply connected to the people it is made for.

If you’re looking for a filmmaker who values creativity and collaboration, let’s create something together.');

insert into services (label, sort_order) values
  ('Short Films', 1),
  ('Commercials', 2),
  ('Social Media Campaigns', 3),
  ('Wedding Films', 4),
  ('Event Coverage', 5);

insert into now_playing (id, title, year, category, provider, video_id, description) values
  (1, 'Stardate: Unknown | Sci-Fi Comedy Short Film', '2026', 'Short Film', 'youtube', 'eVkBWjiSydU', '');

insert into works (title, year, category, provider, video_id, description, sort_order) values
  ('QUEST BROS ep. 2 - The Feast of Fables', '2026', 'Short Film', 'youtube', 'bj_3e3fa3jM', '', 1),
  ('Stardate: Unknown | Sci-Fi Comedy Short Film', '2026', 'Short Film', 'youtube', 'eVkBWjiSydU', '', 2),
  ('The Arrangement', '2026', 'Short Film', 'youtube', 'jtPLa5crpNo', '', 3),
  ('Gem Mint Holographic', '2026', 'Short Film', 'youtube', 'Gmzc9YWM0C4', '', 4),
  ('Perspective or The Painting of a Magnificent Cowboy | Short Film', '2026', 'Short Film', 'youtube', 'Ps79om0Kb8I', '', 5),
  ('Live-In Stand-Up', '2026', 'Short Film', 'youtube', 'b1jM1SNoAF8', '', 6),
  ('Gourd of Darkness', '2026', 'Short Film', 'youtube', 'pyM9V-7SF8c', '', 7),
  ('QUEST BROS ep. 1 The Ghost', '2026', 'Short Film', 'youtube', 'V-13XrX4qAY', '', 8),
  ('Quest Bros', '2026', 'Short Film', 'youtube', 'EWZaL3-usDE', '', 9);

-- ---------------------------------------------------------------------------
-- Keep the images registry in sync with the "images" bucket
-- Upload a file in Storage (any subfolder) and a row appears in images;
-- rename/move keeps the same row; delete removes it. A file in Zines/Zine<N>/
-- also creates that zine's row (title "Vol. N"; edit title/description in the table editor).
-- Failures here never block an upload.
-- ---------------------------------------------------------------------------
create or replace function public.sync_image_registry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  zine_no text;
begin
  begin
    if tg_op = 'DELETE' then
      if old.bucket_id = 'images' then
        delete from public.images where path = old.name;
      end if;
      return old;
    end if;

    if tg_op = 'UPDATE' then
      if new.bucket_id = 'images' and old.bucket_id = 'images' and new.name <> old.name then
        update public.images set path = new.name where path = old.name;
      end if;
    elsif new.bucket_id = 'images' and new.name !~ '\.emptyFolderPlaceholder$' then
      insert into public.images (path, alt)
      values (new.name, replace(regexp_replace(regexp_replace(new.name, '^.*/', ''), '(_[a-z0-9]{6})?\.[A-Za-z]+$', ''), '_', ' '))
      on conflict (path) do nothing;
    end if;

    if new.bucket_id = 'images' then
      zine_no := (regexp_match(new.name, '^Zines/Zine\s*([0-9]+)/', 'i'))[1];
      if zine_no is not null then
        insert into public.zines (slug, title, year, description, sort_order)
        values ('zine-' || zine_no, 'Vol. ' || zine_no, '2026', '', zine_no::int)
        on conflict (slug) do nothing;
      end if;
    end if;
    return new;
  exception when others then
    return new;
  end;
end;
$$;

create or replace trigger sync_image_registry
after insert or update of name or delete on storage.objects
for each row execute function public.sync_image_registry();

-- Backfill files that were uploaded before the trigger existed
insert into images (path, alt)
select o.name, replace(regexp_replace(regexp_replace(o.name, '^.*/', ''), '(_[a-z0-9]{6})?\.[A-Za-z]+$', ''), '_', ' ')
from storage.objects o
where o.bucket_id = 'images' and o.name !~ '\.emptyFolderPlaceholder$'
on conflict (path) do nothing;

-- ---------------------------------------------------------------------------
-- Folder wiring (safe to re-run)
--   Zines/Zine<N>/   files named "<page> ...": page 1 = cover, last = back cover
--   Bio/             first file is the About portrait
--   Collage/         every image rotates through the home collage
--   Poster/          first file is the Upcoming page poster
-- Only png/jpg/jpeg/webp are used (browsers can't display .ai or .pdf).
-- This section only sets alt text and creates zines rows for folders that already exist.
-- ---------------------------------------------------------------------------
with parsed as (
  select id,
         (regexp_match(path, '^Zines/Zine([0-9]+)/'))[1]::int as zine_no,
         (regexp_match(regexp_replace(path, '^.*/', ''), '^([0-9]+)'))[1]::int as page_no
  from images
  where path ~* '^Zines/Zine[0-9]+/.+\.(png|jpe?g|webp)$'
), ranked as (
  select *, max(page_no) over (partition by zine_no) as last_page from parsed
)
update images i
set alt = 'Zine ' || r.zine_no || ', ' ||
          case when r.page_no = 1 then 'cover'
               when r.page_no = r.last_page then 'back cover'
               else 'page ' || r.page_no end
from ranked r
where r.id = i.id;

insert into zines (slug, title, year, description, sort_order)
select distinct 'zine-' || n, 'Vol. ' || n, '2026', '', n
from (select (regexp_match(path, '^Zines/Zine\s*([0-9]+)/', 'i'))[1]::int as n from images) folders
where n is not null
on conflict (slug) do nothing;

update images set alt = 'Portrait of Andrew Davies' where path like 'Bio/%';
