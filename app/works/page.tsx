import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui';
import { WorksGrid } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Works',
  description:
    'Short films, commercials, social campaigns, and wedding and event films by Seattle filmmaker Andrew Davies.',
};

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8">
      <div className="mb-12 space-y-6">
        <SectionHeading eyebrow="Gallery" title="Selected Works" />
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          A collection of short films, commercial work, social campaigns, and
          celebration films. Press play on anything that catches your eye.
        </p>
      </div>
      <WorksGrid />
    </div>
  );
}
