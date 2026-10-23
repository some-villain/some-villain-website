import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui';
import { ZineGrid } from '@/components/sections';
import { getZines } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Zines',
  description:
    'Zines by Some Villain.',
};

export default async function ZinesPage() {
  const zines = await getZines();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8">
      <SectionHeading title="Zines" className="mb-12" />

      <ZineGrid zines={zines} />
    </div>
  );
}
