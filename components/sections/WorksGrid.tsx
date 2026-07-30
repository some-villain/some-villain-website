'use client';

import { useState } from 'react';
import { YouTubePlayer } from '@/components/common';
import { Badge } from '@/components/ui';
import { works, type WorkCategory } from '@/lib/content';
import { cn } from '@/lib/utils';

const categories: Array<WorkCategory | 'All'> = [
  'All',
  'Short Film',
  'Commercial',
  'Wedding & Event',
  'Social',
];

const WorksGrid = () => {
  const [filter, setFilter] = useState<WorkCategory | 'All'>('All');
  const visible = filter === 'All' ? works : works.filter((w) => w.category === filter);

  return (
    <div className="space-y-10">
      <div role="group" aria-label="Filter works by category" className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
            className={cn(
              'border px-4 py-2 font-display text-xs font-medium uppercase tracking-[0.15em] transition-colors',
              filter === category
                ? 'border-accent bg-accent text-ink'
                : 'border-line text-muted hover:border-cream/40 hover:text-cream'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
        {visible.map((work) => (
          <li key={work.youtubeId} className="space-y-4">
            <YouTubePlayer youtubeId={work.youtubeId} title={work.title} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-cream">
                  {work.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{work.description}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Badge variant="accent">{work.category}</Badge>
                <span className="text-xs tracking-wide text-muted">{work.year}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { WorksGrid };
