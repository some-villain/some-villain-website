import { AutoplayVideo } from '@/components/common';
import { SectionHeading } from '@/components/ui';
import { HeroCollage, NowPlaying } from '@/components/sections';
import { getHome, getSite } from '@/lib/data';

export default async function HomePage() {
  const [site, home] = await Promise.all([getSite(), getHome()]);

  return (
    <>
      {/* Fixed film loop behind the page, dimmed so content stays readable */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <AutoplayVideo
          youtubeId={home.heroVideoId}
          title="Background film loop"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-ink/75" />
      </div>

      {/* Wider than the page content so the collage reads large */}
      <div className="mx-auto max-w-[1800px] px-2 pt-2 sm:px-4 sm:pt-4">
        <HeroCollage collage={home.collage} />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <section aria-label="Introduction" className="mx-auto max-w-3xl py-20 text-center sm:py-28">
          {/* 2.5x the standard heading size (36px -> 90px), scaled down on narrow screens so it never overflows */}
          <SectionHeading
            as="h1"
            title={site.name}
            titleClassName="text-[length:min(90px,11vw)] leading-none"
          />
          <p className="mt-6 font-display text-xs font-medium uppercase tracking-[0.3em] text-accent">
            {home.intro}
          </p>
        </section>

        <NowPlaying film={home.nowPlaying} />
      </div>
    </>
  );
}
