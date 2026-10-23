import type { Metadata } from 'next';
import Image from 'next/image';
import { SectionHeading } from '@/components/ui';
import { getPoster } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Upcoming',
  description: 'Upcoming films and zines from Some Villain.',
};

export default async function UpcomingPage() {
  const poster = await getPoster();

  // Page height is the viewport below the 4rem navbar; the poster takes whatever the heading leaves
  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-6xl flex-col px-5 py-8 sm:px-8">
      <SectionHeading title="Upcoming" className="mb-6" />
      {poster && (
        <div className="relative min-h-0 w-full flex-1">
          <Image src={poster.src} alt={poster.alt} fill priority sizes="100vw" className="object-contain" />
        </div>
      )}
    </div>
  );
}
