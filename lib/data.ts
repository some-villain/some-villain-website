import { cache } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  site as siteFallback,
  home as homeFallback,
  about as aboutFallback,
  works as worksFallback,
  zines as zinesFallback,
  type AboutContent,
  type HomeContent,
  type SiteContent,
  type Work,
  type Zine,
} from '@/lib/content';
import { IMAGE_BUCKET, WEB_IMAGE, byPage, imageUrl, zineNumber } from '@/lib/images';

/**
 * Server-side content fetchers backed by Supabase (schema in
 * supabase/schema.sql). Text, links and video IDs come from tables; images are
 * read straight from the public "images" Storage bucket by folder (Bio/,
 * Collage/, Poster/, Zines/Zine<N>/).
 *
 * Responses go through Next's data cache and are revalidated every
 * REVALIDATE_SECONDS, so pages are static and served from the host's edge
 * instead of querying Supabase on every visit. Each fetcher logs any failure
 * and falls back to the static content in lib/content.ts when a table is
 * empty, unreachable or slow, so the site keeps rendering.
 */

const REVALIDATE_SECONDS = 300;

// Hard cap on how long a single fetcher can block rendering before the
// fallback is used (a paused or unreachable project can otherwise hang).
const QUERY_TIMEOUT_MS = 2500;

// Public read-only client with no session or cookies, so nothing here makes a
// page dynamic. Created lazily so a missing env var is logged, not fatal.
const getClient = cache(() =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS } }) },
  }),
);

/** Throws a query's error (so it is logged) and otherwise returns its data. */
const rows = <T>({ data, error }: { data: T | null; error: { message: string } | null }) => {
  if (error) throw new Error(error.message);
  return data;
};

/** Runs a query; returns the fallback (and logs why) on error or timeout, or when it yields null. */
async function load<T>(scope: string, fallback: T, query: (supabase: SupabaseClient) => Promise<T | null>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`timed out after ${QUERY_TIMEOUT_MS}ms`)), QUERY_TIMEOUT_MS);
    });
    return (await Promise.race([query(getClient()), timeout])) ?? fallback;
  } catch (error) {
    console.error(`[supabase] ${scope} failed, using fallback content:`, error);
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

/** Entries (files and folders) directly inside a bucket folder. */
const listEntries = async (supabase: SupabaseClient, folder: string) => {
  const { data, error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .list(folder, { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
  if (error) throw new Error(error.message);
  return data ?? [];
};

/** Paths of the displayable images in a bucket folder, in page order (files have an id, folders do not). */
const listImages = async (supabase: SupabaseClient, folder: string) =>
  (await listEntries(supabase, folder))
    .filter((entry) => entry.id && WEB_IMAGE.test(entry.name))
    .map((entry) => `${folder}/${entry.name}`)
    .sort(byPage);

export const getSite = cache(() =>
  load<SiteContent>('getSite', siteFallback, async (supabase) => {
    const [settings, socials] = await Promise.all([
      supabase.from('site_settings').select('name, tagline, location, email').eq('id', 1).maybeSingle().then(rows),
      supabase.from('social_links').select('label, href').order('sort_order').then(rows),
    ]);
    return settings && { ...settings, socials: socials?.length ? socials : siteFallback.socials };
  }),
);

export const getHome = cache(() =>
  load<HomeContent>('getHome', homeFallback, async (supabase) => {
    const [settings, featured, collage] = await Promise.all([
      supabase.from('home_settings').select('hero_video_id, intro').eq('id', 1).maybeSingle().then(rows),
      supabase.from('now_playing').select('title, video_id').eq('id', 1).maybeSingle().then(rows),
      // Every image in the bucket's Collage/ folder (new uploads appear automatically)
      listImages(supabase, 'Collage'),
    ]);
    return (
      settings && {
        heroVideoId: settings.hero_video_id,
        intro: settings.intro,
        collage: collage.length
          ? collage.map((path, index) => ({ src: imageUrl(path), alt: `Some Villain collage, image ${index + 1}` }))
          : homeFallback.collage,
        nowPlaying: featured
          ? { youtubeId: featured.video_id, title: featured.title }
          : homeFallback.nowPlaying,
      }
    );
  }),
);

export const getAbout = cache(() =>
  load<AboutContent>('getAbout', aboutFallback, async (supabase) => {
    const [settings, [portrait]] = await Promise.all([
      supabase.from('about_settings').select('byline, bio').eq('id', 1).maybeSingle().then(rows),
      // The portrait is the first image in the bucket's Bio/ folder
      listImages(supabase, 'Bio'),
    ]);
    return (
      settings && {
        portrait: portrait ? { src: imageUrl(portrait), alt: 'Portrait of Andrew Davies' } : aboutFallback.portrait,
        byline: settings.byline,
        bio: String(settings.bio)
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean),
      }
    );
  }),
);

export const getWorks = cache(() =>
  load<Work[]>('getWorks', worksFallback, async (supabase) => {
    const works = await supabase.from('works').select('title, video_id').order('sort_order').then(rows);
    return works?.length ? works.map((row) => ({ title: row.title, youtubeId: row.video_id })) : null;
  }),
);

/** Zines come from the bucket: Zines/Zine<N>/<page number> <name>.<png|jpg|jpeg|webp>; page 1 is the cover. */
export const getZines = cache(() =>
  load<Zine[]>('getZines', zinesFallback, async (supabase) => {
    const folders = (await listEntries(supabase, 'Zines'))
      .flatMap((entry) => {
        const number = zineNumber(entry.name);
        return number ? [{ name: entry.name, number }] : [];
      })
      .sort((a, b) => Number(a.number) - Number(b.number));
    const zines = await Promise.all(
      folders.map(async ({ name, number }) => {
        const [cover, ...pages] = await listImages(supabase, `Zines/${name}`);
        return cover ? { title: `Vol. ${number}`, cover: imageUrl(cover), pages: pages.map(imageUrl) } : null;
      }),
    );
    const available = zines.filter((zine): zine is Zine => zine !== null);
    return available.length ? available : null;
  }),
);

/** The poster for the Upcoming page: the first image in the bucket's Poster/ folder (null if none). */
export const getPoster = cache(() =>
  load<{ src: string; alt: string } | null>('getPoster', null, async (supabase) => {
    const [poster] = await listImages(supabase, 'Poster');
    return poster ? { src: imageUrl(poster), alt: 'Upcoming poster' } : null;
  }),
);
