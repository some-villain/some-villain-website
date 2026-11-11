import type { Metadata } from 'next';
import Image from 'next/image';
import { YouTubePlayer } from '@/components/common';
import { SectionHeading } from '@/components/ui';
import { getUpcoming } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Upcoming',
  description: 'Upcoming films and zines from Some Villain.',
};

export default async function UpcomingPage() {
  const upcoming = await getUpcoming();

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-5 py-8 sm:px-8">
      <SectionHeading title="Upcoming" />
      {upcoming.map((item, index) => (
        <section key={item.title} aria-label={item.title} className="mb-16 flex flex-col gap-y-10 sm:mb-24 sm:gap-y-12">
          {/* Poster and trailer are centered and indented from the headings (up to 64rem wide), so their size never depends on screen height */}
          <Image
            src={item.poster.src}
            alt={item.poster.alt}
            width={0}
            height={0}
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="mx-auto h-auto w-full max-w-5xl"
          />
          {/* The box fades to transparent over twice its side padding. It is sized by screen width only: its outside side margins are a quarter of what a 45vw box would leave */}
          <div className="mx-auto my-4.5 w-[calc((3*min(100%,64rem)+clamp(18rem,45vw,40rem))/4)] max-w-full space-y-5 bg-[linear-gradient(to_right,transparent,black_6rem,black_calc(100%-6rem),transparent)] px-12 py-6 text-center text-pretty sm:my-6 sm:space-y-6 sm:bg-[linear-gradient(to_right,transparent,black_9rem,black_calc(100%-9rem),transparent)] sm:px-18 sm:py-8 text-base leading-7 text-cream/90 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
            {item.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <SectionHeading title="Trailer" className="mb-6 sm:mb-4" />
          <YouTubePlayer youtubeId={item.trailerId} title={`${item.title} trailer`} className="mx-auto w-full max-w-5xl" />
        </section>
      ))}
    </div>
  );
}
