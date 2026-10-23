-- Some Villain: content schema (Supabase-only: tables + Storage)
--
--   Text and links  -> tables (site_settings, social_links, home_settings, about_settings)
--   Videos          -> works and now_playing (provider + video_id, e.g. YouTube)
--   Images          -> files in the public Storage bucket "images", read by folder:
--                        Bio/             first file is the About portrait
--                        Collage/         every image rotates through the home collage
--                        Poster/          first file is the Upcoming page poster
--                        Zines/Zine<N>/   "<page> <name>.<ext>"; page 1 is the cover (title "Vol. N")
--                      Only png, jpg, jpeg and webp are used. There is no image table:
--                      the site lists the folders through the Storage API.
--
-- All tables are publicly readable (anon SELECT) with no public writes, and the
-- bucket's files can be listed by anon. Run once in the SQL editor, then manage
-- rows in the table editor. To upgrade a project created from an earlier version
-- of this file, run supabase/migrate-to-storage-listing.sql instead.

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

-- ---------------------------------------------------------------------------
-- Videos
-- ---------------------------------------------------------------------------
create table if not exists works (
  id bigint generated always as identity primary key,
  title text not null,
  provider text not null default 'youtube' check (provider in ('youtube', 'vimeo')),
  video_id text not null, -- the ID from the video URL (youtube.com/watch?v=<ID>)
  sort_order integer not null default 0
);

-- Home page "Now Playing" feature (single row, separate from the films gallery)
create table if not exists now_playing (
  id integer primary key default 1 check (id = 1),
  title text not null,
  provider text not null default 'youtube' check (provider in ('youtube', 'vimeo')),
  video_id text not null
);

create unique index if not exists works_provider_video_key on works (provider, video_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: public read, no public writes
-- ---------------------------------------------------------------------------
alter table site_settings enable row level security;
alter table social_links enable row level security;
alter table home_settings enable row level security;
alter table about_settings enable row level security;
alter table works enable row level security;
alter table now_playing enable row level security;

create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read social_links" on social_links for select using (true);
create policy "Public read home_settings" on home_settings for select using (true);
create policy "Public read about_settings" on about_settings for select using (true);
create policy "Public read works" on works for select using (true);
create policy "Public read now_playing" on now_playing for select using (true);

-- Lets the site list the bucket's folders (downloads of public files never need this)
create policy "Public list images" on storage.objects for select to anon, authenticated using (bucket_id = 'images');

-- ---------------------------------------------------------------------------
-- Seed content (mirrors the static fallbacks in lib/content.ts)
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

insert into now_playing (id, title, provider, video_id) values
  (1, 'Stardate: Unknown | Sci-Fi Comedy Short Film', 'youtube', 'eVkBWjiSydU');

insert into works (title, provider, video_id, sort_order) values
  ('QUEST BROS ep. 2 - The Feast of Fables', 'youtube', 'bj_3e3fa3jM', 1),
  ('Stardate: Unknown | Sci-Fi Comedy Short Film', 'youtube', 'eVkBWjiSydU', 2),
  ('The Arrangement', 'youtube', 'jtPLa5crpNo', 3),
  ('Gem Mint Holographic', 'youtube', 'Gmzc9YWM0C4', 4),
  ('Perspective or The Painting of a Magnificent Cowboy | Short Film', 'youtube', 'Ps79om0Kb8I', 5),
  ('Live-In Stand-Up', 'youtube', 'b1jM1SNoAF8', 6),
  ('Gourd of Darkness', 'youtube', 'pyM9V-7SF8c', 7),
  ('QUEST BROS ep. 1 The Ghost', 'youtube', 'V-13XrX4qAY', 8),
  ('Quest Bros', 'youtube', 'EWZaL3-usDE', 9);
