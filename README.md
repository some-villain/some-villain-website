# Andrew Davies — Film Portfolio

A cinematic portfolio site for Seattle filmmaker Andrew Davies, built with
Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Pages

- **Home** (`/`) — photo collage with an autoplaying film loop, intro, and a "Now Playing" feature
- **About** (`/about`) — portrait, bio, and services
- **Films** (`/films`) — gallery of short films with click-to-play YouTube embeds
- **Zines** (`/zines`) — print publications
- **Upcoming** (`/upcoming`) — poster from the bucket's `Poster/` folder

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content: Supabase + static fallback

Everything lives in Supabase: text and links in tables, images in Storage.

1. Add your project keys to `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL
   editor. It creates the tables with public-read RLS, seeds the text content,
   and installs a trigger that registers every file in the `images` bucket.
3. Upload images to the public `images` bucket: `Bio/` (About portrait),
   `Collage/` (home collage), `Poster/` (Upcoming page), and `Zines/Zine<N>/` (files numbered by page,
   1 = cover; use png/jpg/webp, not .ai or .pdf). Each file gets
   a row in the `images` table automatically (edit its `alt` text there).
   Pages, the portrait and the collage are read from these folders; no
   further wiring is needed.

| Table | Holds |
| --- | --- |
| `site_settings`, `home_settings`, `about_settings`, `services` | text |
| `social_links` | social media links |
| `works` | videos in the Works gallery (`provider` + `video_id`, e.g. YouTube) |
| `now_playing` | the single video featured on the home page (separate from `works`) |
| `images` | registry of files in the `images` bucket (`path`, `alt`) |
| `zines` | zine titles and descriptions (pages come from `Zines/Zine<N>/`) |

Image URLs are built from the path:
`<SUPABASE_URL>/storage/v1/object/public/images/<path>`.

Data flows through the fetchers in [`lib/data.ts`](lib/data.ts). If a table is
empty or Supabase is unreachable, pages fall back to the static placeholder
content in [`lib/content.ts`](lib/content.ts) (a single placeholder image, `public/fallback.svg`).

## Architecture

Components follow Atomic Design:

- `components/ui/` — atoms (Button, Badge, SectionHeading)
- `components/common/` — molecules (YouTubePlayer, AutoplayVideo)
- `components/layout/` — Navbar, Footer
- `components/sections/` — page sections (HeroCollage, NowPlaying, WorksGrid)

The `YouTubePlayer` is a "lite embed": it renders only the video thumbnail
until clicked, keeping the gallery fast. The hero `AutoplayVideo` is muted and
looped, since browsers only allow autoplay for muted video.
