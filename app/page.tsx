import { AutoplayVideo } from '@/components/common';
import { HeroCollage, NowPlaying } from '@/components/sections';
import { home, site } from '@/lib/content';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-6 sm:px-8">
      <HeroCollage />

      <AutoplayVideo
        youtubeId={home.heroVideoId}
        title="Featured film loop"
        className="mt-2 aspect-video w-full md:mt-3 md:aspect-[21/9]"
      />

      <section aria-label="Introduction" className="mx-auto max-w-3xl py-20 text-center sm:py-28">
        <p className="font-display text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {site.tagline} — {site.location}
        </p>
        <h1 className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-cream sm:text-3xl sm:leading-snug">
          {home.intro}
        </h1>
      </section>

      <NowPlaying />
    </div>
  );
}
