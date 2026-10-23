-- Andrew Davies Film — content schema
-- Run this once in the Supabase SQL editor, then manage rows in the table editor.
-- Every table has public read access (anon SELECT) and no public writes.

-- ---------------------------------------------------------------------------
-- Site-wide settings (single row)
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

-- ---------------------------------------------------------------------------
-- Home page (single row) + collage images
-- ---------------------------------------------------------------------------
create table if not exists home_settings (
  id integer primary key default 1 check (id = 1),
  hero_video_id text not null, -- YouTube ID for the autoplay loop
  intro text not null
);

create table if not exists collage_images (
  id bigint generated always as identity primary key,
  src text not null, -- path under /public or a full image URL
  alt text not null,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Works gallery. The row with now_playing = true is featured on the home page.
-- ---------------------------------------------------------------------------
create table if not exists works (
  id bigint generated always as identity primary key,
  title text not null,
  year text not null,
  category text not null check (category in ('Short Film', 'Commercial', 'Wedding & Event', 'Social')),
  youtube_id text not null,
  description text not null,
  now_playing boolean not null default false,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- About page (single row) + services
-- ---------------------------------------------------------------------------
create table if not exists about_settings (
  id integer primary key default 1 check (id = 1),
  portrait_src text not null,
  portrait_alt text not null,
  bio text not null -- separate paragraphs with a blank line
);

create table if not exists services (
  id bigint generated always as identity primary key,
  label text not null,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Zines + interior pages (slideshow slides after the cover)
-- ---------------------------------------------------------------------------
create table if not exists zines (
  id bigint generated always as identity primary key,
  title text not null,
  year text not null,
  cover text not null,
  description text not null,
  sort_order integer not null default 0
);

create table if not exists zine_pages (
  id bigint generated always as identity primary key,
  zine_id bigint not null references zines (id) on delete cascade,
  src text not null,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Row Level Security: public read, no public writes
-- ---------------------------------------------------------------------------
alter table site_settings enable row level security;
alter table social_links enable row level security;
alter table home_settings enable row level security;
alter table collage_images enable row level security;
alter table works enable row level security;
alter table about_settings enable row level security;
alter table services enable row level security;
alter table zines enable row level security;
alter table zine_pages enable row level security;

create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read social_links" on social_links for select using (true);
create policy "Public read home_settings" on home_settings for select using (true);
create policy "Public read collage_images" on collage_images for select using (true);
create policy "Public read works" on works for select using (true);
create policy "Public read about_settings" on about_settings for select using (true);
create policy "Public read services" on services for select using (true);
create policy "Public read zines" on zines for select using (true);
create policy "Public read zine_pages" on zine_pages for select using (true);

-- ---------------------------------------------------------------------------
-- Seed data (matches the current placeholder content in lib/content.ts)
-- ---------------------------------------------------------------------------
insert into site_settings (id, name, tagline, location, email) values
  (1, 'Andrew Davies', 'Filmmaker & Storyteller', 'Seattle, WA', 'hello@andrewdaviesfilm.com');

insert into social_links (label, href, sort_order) values
  ('Instagram', 'https://instagram.com', 1),
  ('Vimeo', 'https://vimeo.com', 2),
  ('YouTube', 'https://youtube.com', 3);

insert into home_settings (id, hero_video_id, intro) values
  (1, 'WpX3ctbQq0E', 'I’m Andrew Davies, a Seattle-based filmmaker and storyteller. I create short films, social media campaigns, event and wedding videos, and commercial work, all with a focus on authenticity, collaboration, and creativity.');

insert into collage_images (src, alt, sort_order) values
  ('/stills/still-01.svg', 'Film still — dusk over the Puget Sound', 1),
  ('/stills/still-02.svg', 'Film still — golden hour close-up', 2),
  ('/stills/still-03.svg', 'Film still — neon-lit street scene', 3),
  ('/stills/still-04.svg', 'Film still — behind the scenes on set', 4),
  ('/stills/still-05.svg', 'Film still — forest light', 5),
  ('/stills/still-06.svg', 'Film still — late-night interior', 6);

insert into works (title, year, category, youtube_id, description, now_playing, sort_order) values
  ('Sintel', '2026', 'Short Film', 'eRsGyueVLvQ', 'A short film about the search for what we’ve lost.', true, 1),
  ('Tears of Steel', '2025', 'Short Film', 'R6MlUcmOul8', 'A sci-fi short shot on location in the city.', false, 2),
  ('Elephants Dream', '2025', 'Short Film', 'TLkA0RELQ1g', 'A surreal two-hander about the worlds we build.', false, 3),
  ('Big Buck Bunny', '2024', 'Commercial', 'aqz-KE-bpKQ', 'A playful brand spot with a lot of heart.', false, 4),
  ('Spring', '2024', 'Commercial', 'WhWc3b3KhnY', 'A seasonal campaign film built around natural light.', false, 5),
  ('Operation Barbershop', '2024', 'Social', 'mN0zPOpADL4', 'A fast-cut social campaign teaser.', false, 6),
  ('Llamigos', '2023', 'Wedding & Event', 'SkVqJ1SGeL0', 'A celebration film — warm, candid, and true to the day.', false, 7),
  ('Cosmos Laundromat', '2023', 'Wedding & Event', 'Y-rmzh0PI3c', 'An event highlight film with an ensemble cast of guests.', false, 8);

insert into about_settings (id, portrait_src, portrait_alt, bio) values
  (1, '/stills/portrait.svg', 'Portrait of Andrew Davies',
'I’m a writer, filmmaker, and performer from Seattle, WA with a lifelong passion for storytelling that began when I played a seagull in Treasure Island at age six. Theater taught me the power of collaboration, the magic that happens when creatives combine their different perspectives and skills. Today I channel that magic into my short films and creative work.

As a freelance filmmaker, I bring years of storytelling experience to every project. From social media campaigns and commercials to event and wedding films, I have found that the key to success is always collaboration, creating work that is not only visually striking but also deeply connected to the people it is made for.

If you’re looking for a filmmaker who values creativity and collaboration, let’s create something together.');

insert into services (label, sort_order) values
  ('Short Films', 1),
  ('Commercials', 2),
  ('Social Media Campaigns', 3),
  ('Wedding Films', 4),
  ('Event Coverage', 5);

insert into zines (title, year, cover, description, sort_order) values
  ('Frame Lines No. 1', '2026', '/stills/zine-01.svg', 'Production diaries, storyboards, and stills from a year of short films.', 1),
  ('Puget Sound Notes', '2025', '/stills/zine-02.svg', 'A photo essay on the light, water, and weather of the Pacific Northwest.', 2),
  ('Call Sheet', '2025', '/stills/zine-03.svg', 'Interviews and portraits of the collaborators behind the camera.', 3),
  ('Seagull, Age Six', '2024', '/stills/zine-04.svg', 'Essays on theater, performance, and how storytelling begins.', 4);

insert into zine_pages (zine_id, src, sort_order)
select z.id, p.src, p.sort_order
from zines z
join lateral (
  values
    ('/stills/' || case z.sort_order when 1 then 'zine-01' when 2 then 'zine-02' when 3 then 'zine-03' else 'zine-04' end || '-page-1.svg', 1),
    ('/stills/' || case z.sort_order when 1 then 'zine-01' when 2 then 'zine-02' when 3 then 'zine-03' else 'zine-04' end || '-page-2.svg', 2),
    ('/stills/' || case z.sort_order when 1 then 'zine-01' when 2 then 'zine-02' when 3 then 'zine-03' else 'zine-04' end || '-page-3.svg', 3)
) as p (src, sort_order) on true;
