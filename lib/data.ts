import { cache } from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
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
  type WorkCategory,
  type Zine,
} from '@/lib/content';

/**
 * Server-side content fetchers backed by Supabase (schema in
 * supabase/schema.sql). Text, links and video IDs come from tables; images are
 * files in the public "images" Storage bucket, registered in the images table
 * and referenced by id. Every fetcher falls back to the static placeholder
 * content in lib/content.ts when a table is empty, unreachable, or slow to
 * respond (e.g. a paused project) — so the site keeps rendering fast
 * regardless of Supabase's availability.
 */

// Hard cap on how long a single Supabase call can block rendering before we
// give up and use the static fallback. A paused/unreachable project can
// otherwise hang for several seconds per query with no error until then.
const QUERY_TIMEOUT_MS = 2500;

const IMAGE_BUCKET = 'images';

/** Public URL for a file in the images bucket (path segments are encoded, e.g. "Zine 1"). */
const imageUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;

interface ImageRow {
  path: string;
  alt: string;
}

/** Image formats the site displays (any letter case: .PNG, .Jpeg, ...). */
const WEB_IMAGE = /\.(png|jpe?g|webp)$/i;

/** Leading page number in a file name ("3 name.png", "3_name.jpg"); un-numbered files sort last. */
const pageNumber = (path: string) => {
  const match = path.slice(path.lastIndexOf('/') + 1).match(/^(\d+)/);
  return match ? Number(match[1]) : Infinity;
};
const byPage = (a: ImageRow, b: ImageRow) =>
  pageNumber(a.path) - pageNumber(b.path) || a.path.localeCompare(b.path);

const getSupabase = async () => createClient(await cookies());

// React's cache() memoizes per request, so calling getSite() from both the
// root layout and a page (as /about and /zines do) only hits Supabase once.
const getSupabaseOnce = cache(getSupabase);

interface WorkRow {
  title: string;
  year: string;
  category: string;
  video_id: string;
  description: string;
}

interface ZineRow {
  slug: string;
  title: string;
  year: string;
  description: string;
}

export const getSite = cache(async (): Promise<SiteContent> => {
  try {
    const supabase = await getSupabaseOnce();
    const timeout = AbortSignal.timeout(QUERY_TIMEOUT_MS);
    const [settings, socials] = await Promise.all([
      supabase
        .from('site_settings')
        .select('name, tagline, location, email')
        .eq('id', 1)
        .abortSignal(timeout)
        .maybeSingle(),
      supabase.from('social_links').select('label, href').order('sort_order').abortSignal(timeout),
    ]);
    if (!settings.data) return siteFallback;
    return {
      ...settings.data,
      socials: socials.data?.length ? socials.data : siteFallback.socials,
    };
  } catch {
    return siteFallback;
  }
});

export async function getHome(): Promise<HomeContent> {
  try {
    const supabase = await getSupabaseOnce();
    const timeout = AbortSignal.timeout(QUERY_TIMEOUT_MS);
    const [settings, collage, featured] = await Promise.all([
      supabase
        .from('home_settings')
        .select('hero_video_id, intro')
        .eq('id', 1)
        .abortSignal(timeout)
        .maybeSingle(),
      // Every image in the bucket's Collage/ folder (new uploads appear automatically)
      supabase
        .from('images')
        .select('path, alt')
        .ilike('path', 'Collage/%')
        .order('path')
        .abortSignal(timeout),
      supabase
        .from('now_playing')
        .select('title, year, category, video_id, description')
        .eq('id', 1)
        .abortSignal(timeout)
        .maybeSingle(),
    ]);
    if (!settings.data) return homeFallback;
    const collageImages = (collage.data ?? [])
      .filter((row: ImageRow) => WEB_IMAGE.test(row.path))
      .map((row: ImageRow) => ({ src: imageUrl(row.path), alt: row.alt }));
    return {
      heroVideoId: settings.data.hero_video_id,
      intro: settings.data.intro,
      collage: collageImages.length ? collageImages : homeFallback.collage,
      nowPlaying: featured.data
        ? {
            youtubeId: featured.data.video_id,
            title: featured.data.title,
            year: featured.data.year,
            category: featured.data.category,
            description: featured.data.description,
          }
        : homeFallback.nowPlaying,
    };
  } catch {
    return homeFallback;
  }
}

export async function getAbout(): Promise<AboutContent> {
  try {
    const supabase = await getSupabaseOnce();
    const timeout = AbortSignal.timeout(QUERY_TIMEOUT_MS);
    const [settings, services, bioImages] = await Promise.all([
      supabase
        .from('about_settings')
        .select('byline, bio')
        .eq('id', 1)
        .abortSignal(timeout)
        .maybeSingle(),
      supabase.from('services').select('label').order('sort_order').abortSignal(timeout),
      // The portrait is the first image in the bucket's Bio/ folder
      supabase.from('images').select('path, alt').ilike('path', 'Bio/%').abortSignal(timeout),
    ]);
    if (!settings.data) return aboutFallback;
    const portrait =
      ((bioImages.data ?? []) as ImageRow[]).filter((row) => WEB_IMAGE.test(row.path)).sort(byPage)[0] ??
      null;
    return {
      portrait: portrait
        ? { src: imageUrl(portrait.path), alt: portrait.alt }
        : aboutFallback.portrait,
      byline: settings.data.byline,
      bio: String(settings.data.bio)
        .split(/\n\s*\n/)
        .map((paragraph: string) => paragraph.trim())
        .filter(Boolean),
      services: services.data?.length
        ? services.data.map((s: { label: string }) => s.label)
        : aboutFallback.services,
    };
  } catch {
    return aboutFallback;
  }
}

export async function getWorks(): Promise<Work[]> {
  try {
    const supabase = await getSupabaseOnce();
    const { data } = await supabase
      .from('works')
      .select('title, year, category, video_id, description')
      .order('sort_order')
      .abortSignal(AbortSignal.timeout(QUERY_TIMEOUT_MS));
    if (!data?.length) return worksFallback;
    return data.map((row: WorkRow) => ({
      title: row.title,
      year: row.year,
      category: row.category as WorkCategory,
      youtubeId: row.video_id,
      description: row.description,
    }));
  } catch {
    return worksFallback;
  }
}

export async function getZines(): Promise<Zine[]> {
  try {
    const supabase = await getSupabaseOnce();
    const timeout = AbortSignal.timeout(QUERY_TIMEOUT_MS);
    const [zines, images] = await Promise.all([
      supabase
        .from('zines')
        .select('slug, title, year, description')
        .order('sort_order')
        .abortSignal(timeout),
      // Pages come from the bucket: Zines/Zine<N>/<page number> <name>.<png|jpg|jpeg|webp>
      supabase.from('images').select('path, alt').ilike('path', 'Zines/%').abortSignal(timeout),
    ]);

    const pagesByZine: Record<string, ImageRow[]> = {};
    ((images.data ?? []) as ImageRow[])
      .filter((row) => WEB_IMAGE.test(row.path))
      .forEach((row) => {
        const zineNumber = row.path.match(/^Zines\/Zine\s*(\d+)\//i)?.[1];
        if (zineNumber) (pagesByZine[zineNumber] = pagesByZine[zineNumber] ?? []).push(row);
      });

    // A zine's first page is its cover; zines with no images yet are left out
    const result = ((zines.data ?? []) as ZineRow[]).flatMap((row) => {
      const pages = (pagesByZine[row.slug.match(/(\d+)$/)?.[1] ?? ''] ?? []).sort(byPage);
      if (!pages.length) return [];
      return [
        {
          title: row.title,
          year: row.year,
          cover: imageUrl(pages[0].path),
          description: row.description,
          pages: pages.slice(1).map((page) => imageUrl(page.path)),
        },
      ];
    });
    return result.length ? result : zinesFallback;
  } catch {
    return zinesFallback;
  }
}

/** The poster for the Upcoming page: the first web image in the bucket's Poster/ folder (null if none). */
export async function getPoster(): Promise<{ src: string; alt: string } | null> {
  try {
    const supabase = await getSupabaseOnce();
    const { data } = await supabase
      .from('images')
      .select('path, alt')
      .ilike('path', 'Poster/%')
      .abortSignal(AbortSignal.timeout(QUERY_TIMEOUT_MS));
    const poster = ((data ?? []) as ImageRow[]).filter((row) => WEB_IMAGE.test(row.path)).sort(byPage)[0];
    return poster ? { src: imageUrl(poster.path), alt: 'Upcoming poster' } : null;
  } catch {
    return null;
  }
}
