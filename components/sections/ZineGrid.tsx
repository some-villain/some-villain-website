'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SlideshowModal } from '@/components/common';
import { Badge } from '@/components/ui';
import { zines, type Zine } from '@/lib/content';

const zineSlides = (zine: Zine) => [
  { src: zine.cover, alt: `${zine.title} — cover` },
  ...zine.pages.map((src, i) => ({ src, alt: `${zine.title} — page ${i + 1}` })),
];

const ZineGrid = () => {
  const [openZine, setOpenZine] = useState<Zine | null>(null);

  return (
    <>
      <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {zines.map((zine) => (
          <li key={zine.title} className="group space-y-4">
            <button
              type="button"
              onClick={() => setOpenZine(zine)}
              aria-label={`Open ${zine.title} slideshow`}
              className="relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Image
                src={zine.cover}
                alt={`Cover of ${zine.title}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-ink/80 to-transparent pb-4 pt-10 font-display text-[11px] uppercase tracking-[0.2em] text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Flip Through
              </span>
            </button>
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

      {openZine && (
        <SlideshowModal
          title={openZine.title}
          slides={zineSlides(openZine)}
          onClose={() => setOpenZine(null)}
        />
      )}
    </>
  );
};

export { ZineGrid };
