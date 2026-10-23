import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui';
import { WorksGrid } from '@/components/sections';
import { getWorks } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Films',
  description:
    'Short films by Some Villain.',
};

export default async function FilmsPage() {
  const works = await getWorks();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8">
      <SectionHeading title="Films" className="mb-12" />
      <WorksGrid works={works} />
    </div>
  );
}
