import type { Metadata } from 'next';
import Image from 'next/image';
import { SectionHeading } from '@/components/ui';
import { getAbout } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Andrew Davies is a writer, filmmaker, and performer from Seattle, WA who brings creativity and collaboration to every project.',
};

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8">
      <SectionHeading title="About" />

      <div className="mt-12 grid gap-12 md:grid-cols-5 md:gap-16">
        <div className="md:col-span-2">
          <div className="relative aspect-[3/4] overflow-hidden bg-surface">
            <Image
              src={about.portrait.src}
              alt={about.portrait.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="space-y-6 md:col-span-3">
          {about.byline && (
            <p className="text-base leading-relaxed text-cream/85 sm:text-lg sm:leading-relaxed">
              {about.byline}
            </p>
          )}
          {about.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-base leading-relaxed text-cream/85 sm:text-lg sm:leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
