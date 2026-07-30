import type { Metadata } from 'next';
import Image from 'next/image';
import { Badge, SectionHeading, buttonVariants } from '@/components/ui';
import { about, site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Andrew Davies is a writer, filmmaker, and performer from Seattle, WA who brings creativity and collaboration to every project.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8">
      <SectionHeading eyebrow="About" title="The Story So Far" />

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
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Services">
            {about.services.map((service) => (
              <Badge key={service}>{service}</Badge>
            ))}
          </div>
        </div>

        <div className="space-y-6 md:col-span-3">
          {about.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-base leading-relaxed text-cream/85 sm:text-lg sm:leading-relaxed">
              {paragraph}
            </p>
          ))}
          <a href={`mailto:${site.email}`} className={buttonVariants({ variant: 'outline' })}>
            Let’s Create Something Together
          </a>
        </div>
      </div>
    </div>
  );
}
