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
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8">
      <SectionHeading title="Upcoming" className="mb-12" />
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
          {/* Sized by screen width only; see .upcoming-box in globals.css */}
          <div className="upcoming-box-row">
            <div className="upcoming-box mx-auto my-4.5 space-y-5 py-6 text-center text-pretty sm:my-6 sm:space-y-6 sm:py-8 text-base leading-7 text-cream/90 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
              {item.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <SectionHeading title="Trailer" className="mb-6 sm:mb-4" />
          <YouTubePlayer youtubeId={item.trailerId} title={`${item.title} trailer`} className="mx-auto w-full max-w-5xl" />
        </section>
      ))}
    </div>
  );
}
