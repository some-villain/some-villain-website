import { YouTubePlayer } from '@/components/common';
import { type Work } from '@/lib/content';

export interface WorksGridProps {
  works: Work[];
}

const WorksGrid = ({ works }: WorksGridProps) => (
  <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
    {works.map((work) => (
      <li key={work.youtubeId} className="space-y-4">
        <YouTubePlayer youtubeId={work.youtubeId} title={work.title} />
        <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-cream">
          {work.title}
        </h3>
      </li>
    ))}
  </ul>
);

export { WorksGrid };
