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
        <section key={item.title} aria-label={item.title} className="mx-auto w-fit max-w-full space-y-10 sm:space-y-12">
          {/* Poster: natural aspect ratio, capped to the viewport height. The section is only as wide as the poster; the text and trailer (w-0 min-w-full) fill that width without widening it */}
          <Image
            src={item.poster.src}
            alt={item.poster.alt}
            width={0}
            height={0}
            priority={index === 0}
            sizes="100vw"
            className="mx-auto h-auto max-h-[80dvh] w-auto max-w-full"
          />
          <div className="w-0 min-w-full space-y-5 text-pretty text-base leading-7 text-cream/90 sm:space-y-6 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
            {item.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="w-0 min-w-full space-y-16">
            <SectionHeading title="Trailer" />
            <YouTubePlayer youtubeId={item.trailerId} title={`${item.title} trailer`} />
          </div>
        </section>
      ))}
    </div>
  );
}
