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
          className="grid grid-cols-[1fr_minmax(0,auto)_1fr] gap-y-10 sm:gap-y-12"
        >
          {/* The middle column is as wide as the poster; the other items (w-0 min-w-full) fill their column without widening it */}
          <Image
            src={item.poster.src}
            alt={item.poster.alt}
            width={0}
            height={0}
            priority={index === 0}
            sizes="100vw"
            className="col-start-2 mx-auto h-auto max-h-[80dvh] w-auto max-w-full"
          />
          <div className="col-start-2 mx-auto my-3 w-0 min-w-[calc(100%-6rem)] space-y-5 bg-black p-6 text-center text-pretty sm:my-4 sm:min-w-[calc(100%-9rem)] sm:p-8 text-base leading-7 text-cream/90 sm:space-y-6 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
            {item.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
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
