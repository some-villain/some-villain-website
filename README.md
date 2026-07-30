# Andrew Davies — Film Portfolio

A cinematic portfolio site for Seattle filmmaker Andrew Davies, built with
Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Pages

- **Home** (`/`) — photo collage with an autoplaying film loop, intro, and a "Now Playing" feature
- **About** (`/about`) — portrait, bio, and services
- **Works** (`/works`) — filterable gallery of films with click-to-play YouTube embeds
- **Zines** (`/zines`) — print publications

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Swapping in real content

All editable content lives in [`lib/content.ts`](lib/content.ts):

- **Videos** — every `youtubeId` currently points to a Blender Foundation open
  movie as a placeholder. Replace each with the ID from a real YouTube URL
  (the part after `watch?v=`).
- **Photos** — the images in `public/stills/` are generated SVG placeholders.
  Drop in real photos (JPG/PNG) and update the paths in `lib/content.ts`.
- **Contact & socials** — update `site.email` and `site.socials`.

## Architecture

Components follow Atomic Design:

- `components/ui/` — atoms (Button, Badge, SectionHeading)
- `components/common/` — molecules (YouTubePlayer, AutoplayVideo)
- `components/layout/` — Navbar, Footer
- `components/sections/` — page sections (HeroCollage, NowPlaying, WorksGrid)

The `YouTubePlayer` is a "lite embed": it renders only the video thumbnail
until clicked, keeping the gallery fast. The hero `AutoplayVideo` is muted and
looped, since browsers only allow autoplay for muted video.
