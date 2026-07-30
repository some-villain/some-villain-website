'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lightbox } from '@/components/common';
import { home, site } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * Modern asymmetric collage grid of six stills. Clicking a tile expands it in
 * a fade-in lightbox. On mobile the tiles stack as a lead image, pairs, and a
 * full-width closer; on desktop they fill a 4-column, 3-row mosaic.
 */
const HeroCollage = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [a, b, c, d, e, f] = home.collage;

  const tiles = [
    { still: a, span: 'col-span-2 min-h-56 sm:min-h-72 md:row-span-2 md:min-h-0', priority: true },
    { still: b, span: '', priority: true },
    { still: c, span: 'md:row-span-2', priority: true },
    { still: d, span: '', priority: false },
    { still: e, span: '', priority: false },
    { still: f, span: 'col-span-2 md:col-span-3', priority: false },
  ];

  return (
    <section aria-label={`${site.name} — featured film stills`}>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {tiles.map((tile, index) => (
          <button
            key={tile.still.src}
            type="button"
            onClick={() => setExpanded(index)}
            aria-label={`Expand image: ${tile.still.alt}`}
            className={cn(
              'group relative min-h-40 cursor-zoom-in overflow-hidden bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              tile.span
            )}
          >
            <Image
              src={tile.still.src}
              alt={tile.still.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={tile.priority}
            />
            <span className="absolute inset-0 bg-ink/20 transition-colors duration-300 group-hover:bg-ink/0" />
          </button>
        ))}
      </div>

      <Lightbox
        image={expanded === null ? null : home.collage[expanded]}
        onClose={() => setExpanded(null)}
      />
    </section>
  );
};

export { HeroCollage };
