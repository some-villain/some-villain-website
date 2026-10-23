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

Create `.env.local` first (see [Environment variables](#environment-variables)), then open [http://localhost:3000](http://localhost:3000).

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

## Environment variables

Two variables are required, locally in `.env.local` (git-ignored) and in your
hosting provider's dashboard:

| Variable | Value | Where to find it |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` | Supabase dashboard > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | the publishable (anon) key | Same page, API keys |

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
```

Notes:

- Both values are public by design: the `NEXT_PUBLIC_` prefix means Next.js
  inlines them into the browser bundle at build time. Access is limited by the
  read-only RLS policies in `supabase/schema.sql`, so no secret or service-role
  key is ever needed or should be added.
- Because they are inlined at build time, changing either value on a host
  requires a new deploy. `next.config.ts` also reads the URL at build time to
  allow images from the Supabase Storage host.
- If either variable is missing, pages render the static fallback content in
  `lib/content.ts` (a single placeholder image) instead of failing.

## Deployment

Prerequisites: the repository is on GitHub, `supabase/schema.sql` has been run
in your Supabase project, and the `images` bucket is public and populated.
The project uses pnpm (`pnpm-lock.yaml`) and Next.js 16, which needs Node 20.9
or newer. Both hosts detect the framework, package manager and build command
(`pnpm build`) automatically.

### Vercel

1. Import the GitHub repository at vercel.com/new. Keep the detected Next.js
   preset.
2. Under Environment Variables, add `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for Production, Preview and
   Development.
3. Deploy. Pushes to `main` deploy to production, and other branches and pull
   requests get preview URLs.

### Netlify

1. Add a new site from Git at app.netlify.com and pick the repository. Netlify
   detects Next.js and applies its Next.js runtime automatically.
2. Under Site configuration > Environment variables, add the same two
   variables.
3. Deploy. Pushes to the production branch deploy to production, and pull
   requests get deploy previews.

### Pointing a Cloudflare domain at the site

First add the domain to the hosting project, then create DNS records in
Cloudflare (DNS > Records). Set each record to **DNS only** (grey cloud) at
first. Both hosts need to validate the domain and issue their own HTTPS
certificate, and proxying through Cloudflare can interfere with that. Once the
host shows the domain as valid you can turn the proxy on if you want
Cloudflare's CDN or firewall in front; if you do, set Cloudflare's SSL/TLS mode
to Full (strict) to avoid redirect loops.

Always prefer the exact values the host's dashboard shows for your project.
The typical records are:

**Vercel** (Project > Settings > Domains > Add Domain)

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` (or the value shown in the dashboard) |
| CNAME | `www` | the project-specific target shown in the dashboard (for example `cname.vercel-dns.com`) |

Add both the apex and `www` domains in Vercel and choose which one redirects to
the other.

**Netlify** (Site configuration > Domain management > Add a domain)

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `@` | `apex-loadbalancer.netlify.com` (Cloudflare flattens an apex CNAME) |
| CNAME | `www` | `<your-site>.netlify.app` |

If you prefer an A record for the apex, use `75.2.60.5`. Netlify recommends
making `www` the primary domain when using external DNS.

DNS changes usually take effect within minutes but can take up to 48 hours.
Check progress with `dig <domain>` and `dig www.<domain>`.

Reference docs: [Vercel custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain),
[Netlify external DNS](https://docs.netlify.com/domains-https/custom-domains/configure-external-dns/).

## Architecture

Components follow Atomic Design:

- `components/ui/` — atoms (Button, Badge, SectionHeading)
- `components/common/` — molecules (YouTubePlayer, AutoplayVideo)
- `components/layout/` — Navbar, Footer
- `components/sections/` — page sections (HeroCollage, NowPlaying, WorksGrid)

The `YouTubePlayer` is a "lite embed": it renders only the video thumbnail
until clicked, keeping the gallery fast. The hero `AutoplayVideo` is muted and
looped, since browsers only allow autoplay for muted video.
