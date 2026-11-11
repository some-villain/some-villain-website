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
        <section key={item.title} aria-label={item.title} className="space-y-8">
          {/* Poster left, description right on desktop; stacked on mobile */}
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {/* Natural aspect ratio, capped to the viewport height so the poster never overflows the screen */}
            <Image
              src={item.poster.src}
              alt={item.poster.alt}
              width={0}
              height={0}
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="mx-auto h-auto max-h-[80dvh] w-auto max-w-full"
            />
            <div className="space-y-4 text-base leading-relaxed text-cream/90 sm:text-lg">
              {item.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <YouTubePlayer youtubeId={item.trailerId} title={`${item.title} trailer`} />
        </section>
      ))}
    </div>
  );
}
