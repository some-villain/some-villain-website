import type { Metadata } from 'next';
import { SectionHeading, buttonVariants } from '@/components/ui';
import { ZineGrid } from '@/components/sections';
import { site } from '@/lib/content';

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
          Click a cover to flip through.
        </p>
      </div>

      <ZineGrid />

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
