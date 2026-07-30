import type { Metadata } from 'next';
import Image from 'next/image';
import { Badge, SectionHeading, buttonVariants } from '@/components/ui';
import { site, zines } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Zines',
  description:
    'Self-published zines by Andrew Davies — production diaries, photo essays, and writing on filmmaking and storytelling.',
};

export default function ZinesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8">
      <div className="mb-12 space-y-6">
        <SectionHeading eyebrow="Print" title="Zines" />
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Not everything belongs on a screen. These self-published zines collect
          production diaries, photo essays, and writing from behind the camera.
        </p>
      </div>

      <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {zines.map((zine) => (
          <li key={zine.title} className="group space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-surface">
              <Image
                src={zine.cover}
                alt={`Cover of ${zine.title}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-base font-semibold uppercase tracking-wide text-cream">
                  {zine.title}
                </h2>
                <Badge>{zine.year}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted">{zine.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-20 border-t border-line pt-12 text-center">
        <p className="mx-auto max-w-xl text-base leading-relaxed text-muted">
          Zines are printed in small runs. Want a copy, or want to collaborate
          on the next one?
        </p>
        <a
          href={`mailto:${site.email}`}
          className={`${buttonVariants({ variant: 'outline' })} mt-6`}
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}
