# Some Villain

Site for Some Villain, a Seattle-based film and zine makers, built with
Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Pages

- **Home** (`/`) — photo collage with an autoplaying film loop, intro, and a "Now Playing" feature
- **About** (`/about`) — portrait and bio
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

1. Add your project keys to `.env.local`
   (see [Environment variables](#environment-variables)).
2. Run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL
   editor. It creates the tables with public-read RLS, a policy that lets the
   site list the bucket, and seed content. A project created from an earlier
   version of the schema should run
   [`supabase/migrate-to-storage-listing.sql`](supabase/migrate-to-storage-listing.sql)
   instead.
3. Create a public Storage bucket named `images` and upload to these folders
   (png, jpg, jpeg or webp, any letter case; not .ai or .pdf):
   - `Bio/`: the first file is the About portrait
   - `Collage/`: every image rotates through the home collage
   - `Poster/`: the first file is the Upcoming page poster
   - `Zines/Zine<N>/`: files named `<page> <name>.<ext>`; page 1 is the cover
     and the zine is titled "Vol. N"

   There is no image table or wiring step. The site lists these folders
   directly, so uploads appear after the cache refreshes (up to 5 minutes).

| Table | Holds |
| --- | --- |
| `site_settings`, `home_settings`, `about_settings` | text |
| `social_links` | social media links |
| `works` | videos in the Films gallery (`provider` + `video_id`, e.g. YouTube) |
| `now_playing` | the single video featured on the home page (separate from `works`) |

Image URLs are
`<SUPABASE_URL>/storage/v1/object/public/images/<path>`.

### Caching and fallbacks

Data flows through the fetchers in [`lib/data.ts`](lib/data.ts), which use a
public client with no cookies or session. Responses are cached by Next.js and
revalidated every 5 minutes (`REVALIDATE_SECONDS`), so pages are static and
served from the host's edge rather than querying Supabase on every visit.

If a table is empty, Supabase is unreachable or a query exceeds 2.5 seconds,
the fetcher logs `[supabase] <name> failed, using fallback content` to the
server log (development only: production builds strip all `console.*` calls
via `compiler.removeConsole` in `next.config.ts`) and the page uses the static fallbacks in
[`lib/content.ts`](lib/content.ts) (a single placeholder image,
`public/fallback.svg`). To see these failures in production, change `removeConsole` to
`{ exclude: ["error"] }`.

### Image resizing

All Supabase images go through `next/image` with the loader in
[`lib/supabaseImageLoader.ts`](lib/supabaseImageLoader.ts). By default Next.js
resizes them. If your Supabase plan includes Image Transformations (a paid
feature), set `NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORMS=true` and Supabase will
resize and compress them instead, so large originals are never downloaded in
full by the server.

## Tests

```bash
pnpm test
```

Unit tests cover the image helpers, the image loader, and the fetchers
(folder listing, zine ordering, fallbacks and error logging) using a mocked
Supabase client.

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
  `lib/content.ts` (a single placeholder image) instead of failing, and the
  server log shows `[supabase] ... failed`.

Optional: `NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORMS=true` switches image resizing
to Supabase Image Transformations (see [Image resizing](#image-resizing)).

## Deployment

Prerequisites: the repository is on GitHub, `supabase/schema.sql` has been run
in your Supabase project (or, for an existing project,
`supabase/migrate-to-storage-listing.sql`, which must run before deploying this
version), and the `images` bucket is public and populated.
The project uses pnpm (`pnpm-lock.yaml`) and Next.js 16, which needs Node 20.9
or newer. Both hosts detect the framework, package manager and build command
(`pnpm build`) automatically.

Pages are built from Supabase data and then refreshed in the background every
5 minutes. After editing a table or uploading an image, allow up to 5 minutes
for the live site to update (or redeploy to refresh immediately). If Supabase is
unreachable during a build, the build still succeeds with the fallback content
until the next refresh.

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

Data and images:

- `lib/data.ts` — the only code that talks to Supabase (cached fetchers with fallbacks)
- `lib/images.ts` — bucket helpers: public URLs, accepted formats, page ordering
- `lib/supabaseImageLoader.ts` — `next/image` loader (resizing)
- `lib/content.ts` — shared content types and static fallbacks

The `YouTubePlayer` is a "lite embed": it renders only the video thumbnail
until clicked, keeping the gallery fast. The hero `AutoplayVideo` is muted and
looped, since browsers only allow autoplay for muted video.

## Before launch

- Replace the placeholder background loop: `home_settings.hero_video_id` is still
  the placeholder video ID.
- Confirm Films and Now Playing should not share a video (`eVkBWjiSydU` is both).
- Run `pnpm test` and `pnpm build`, and check that the build output lists the
  routes as static.
