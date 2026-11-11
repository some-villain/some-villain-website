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
        <section
          key={item.title}
          aria-label={item.title}
          className="grid grid-cols-[1fr_min(100%,40rem)_1fr] gap-y-10 sm:gap-y-12"
        >
          {/* The middle column is the screen width up to 40rem; the poster and trailer fill it, so their size never depends on screen height */}
          <Image
            src={item.poster.src}
            alt={item.poster.alt}
            width={0}
            height={0}
            priority={index === 0}
            sizes="(max-width: 640px) 100vw, 640px"
            className="col-start-2 h-auto w-full"
          />
          {/* Zero-width, full-row wrapper: the box inside is sized by screen width and does not affect the poster and trailer column */}
          <div className="col-span-full w-0 min-w-full">
            <div className="mx-auto my-4.5 w-[clamp(18rem,45vw,40rem)] max-w-full space-y-5 bg-black px-12 py-6 text-center text-pretty sm:my-6 sm:space-y-6 sm:px-18 sm:py-8 text-base leading-7 text-cream/90 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
              {item.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          {/* Spans the full width so it lines up with the Upcoming heading; its gap to the video matches that heading's (4rem) */}
          <SectionHeading title="Trailer" className="col-span-full mb-6 w-0 min-w-full sm:mb-4" />
          <YouTubePlayer
            youtubeId={item.trailerId}
            title={`${item.title} trailer`}
            className="col-start-2 w-0 min-w-full"
          />
        </section>
      ))}
    </div>
  );
}
