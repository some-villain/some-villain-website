'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Lightbox } from '@/components/common';
import { cn } from '@/lib/utils';

type CollageImage = { src: string; alt: string };

export interface HeroCollageProps {
  collage: CollageImage[];
}

const VISIBLE_TILES = 7;
const PHONE_TILES = 5; // tiles visible on phones (the last column is hidden)
const ROTATE_EVERY_MS = 4800; // one tile swaps this often
const FADE_MS = 900; // crossfade duration

/**
 * Seven tiles in three columns that all end at the same height: a stack of 2,
 * a stack of 3 in the middle, and another stack of 2. Each tile is about 16:9
 * (column widths are 3fr / 2fr / 3fr over a 6-row grid: the stacks of 2 span 3
 * rows per tile, the stack of 3 spans 2). On phones the last column is hidden,
 * leaving the first stack of 2 beside the stack of 3.
 */
const TILE_LAYOUT = [
  'col-start-1 row-start-1 row-span-3',
  'col-start-1 row-start-4 row-span-3',
  'col-start-2 row-start-1 row-span-2',
  'col-start-2 row-start-3 row-span-2',
  'col-start-2 row-start-5 row-span-2',
  'hidden md:block md:col-start-3 md:row-start-1 md:row-span-3',
  'hidden md:block md:col-start-3 md:row-start-4 md:row-span-3',
];

interface Layer {
  image: CollageImage;
  loaded: boolean;
}

/**
 * One 16:9 tile. When it is given a new image, the new image is stacked on top
 * and fades in once it has loaded; the old image is removed after the fade.
 */
const CollageTile = ({
  image,
  onOpen,
  className,
}: {
  image: CollageImage;
  onOpen: () => void;
  className: string;
}) => {
  const [layers, setLayers] = useState<Layer[]>([{ image, loaded: false }]);

  // A new image for this tile: stack it on top (invisible until it has loaded)
  if (layers[layers.length - 1].image.src !== image.src) {
    setLayers([...layers, { image, loaded: false }]);
  }

  // Once the top layer has faded in, drop the layers beneath it
  useEffect(() => {
    const top = layers[layers.length - 1];
    if (layers.length === 1 || !top.loaded) return;
    const timer = setTimeout(() => setLayers([top]), FADE_MS);
    return () => clearTimeout(timer);
  }, [layers]);

  const markLoaded = (src: string) =>
    setLayers((current) =>
      current.map((layer) => (layer.image.src === src ? { ...layer, loaded: true } : layer))
    );

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Expand image: ${layers[layers.length - 1].image.alt}`}
      className={cn(
        'group relative min-h-0 min-w-0 cursor-zoom-in overflow-hidden bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className
      )}
    >
      {layers.map((layer) => (
        <Image
          key={layer.image.src}
          src={layer.image.src}
          alt={layer.image.alt}
          fill
          sizes="(max-width: 768px) 60vw, 40vw"
          priority // the whole collage is above the fold, so any tile can be the LCP image
          onLoad={() => markLoaded(layer.image.src)}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          className={cn(
            'object-cover transition-opacity ease-in-out',
            layer.loaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}
      <span className="absolute inset-0 bg-ink/20 transition-colors duration-300 group-hover:bg-ink/0" />
    </button>
  );
};

const shuffle = (items: number[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/**
 * Collage of 16:9 tiles in columns of differing tile counts. Seven images show
 * at a time (five on phones). Every few seconds one tile, picked at random (each
 * position gets a turn once per round), crossfades to the next image from a
 * shuffled queue of everything not on screen; the image it
 * replaces goes to the back of the queue, so every image in the collage gets its
 * turn before any repeats. Clicking a tile expands it in a lightbox (rotation
 * pauses while it is open).
 */
const HeroCollage = ({ collage }: HeroCollageProps) => {
  const tileCount = Math.min(VISIBLE_TILES, collage.length);
  // Pool indexes currently shown, one per tile (mirrored in a ref for the timer)
  const [shown, setShown] = useState<number[]>(() => collage.slice(0, tileCount).map((_, i) => i));
  const shownRef = useRef(shown);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (collage.length <= tileCount || expanded !== null || reduceMotion) return;

    const queue = shuffle(collage.map((_, i) => i).filter((i) => !shownRef.current.includes(i)));
    let tileBag: number[] = []; // tile positions still to swap in this round, in random order
    let lastTile = -1;
    const timer = setInterval(() => {
      const rotating = window.matchMedia('(min-width: 768px)').matches ? tileCount : PHONE_TILES;
      tileBag = tileBag.filter((position) => position < rotating);
      if (tileBag.length === 0) {
        // New round: every visible position swaps once, in a fresh random order
        tileBag = shuffle(Array.from({ length: rotating }, (_, position) => position));
        if (tileBag[0] === lastTile && tileBag.length > 1) tileBag.reverse(); // no back-to-back repeat
      }
      const tile = tileBag.shift()!;
      lastTile = tile;
      const next = [...shownRef.current];
      queue.push(next[tile]);
      next[tile] = queue.shift()!;
      shownRef.current = next;
      setShown(next);
    }, ROTATE_EVERY_MS);
    return () => clearInterval(timer);
  }, [collage, tileCount, expanded]);

  return (
    <section aria-label="Featured film stills">
      <div className="grid aspect-[40/27] grid-cols-[3fr_2fr] grid-rows-6 gap-2 md:aspect-[64/27] md:grid-cols-[3fr_2fr_3fr] md:gap-3">
        {shown.map((poolIndex, tile) => (
          <CollageTile
            key={tile}
            image={collage[poolIndex]}
            className={TILE_LAYOUT[tile]}
            onOpen={() => setExpanded(tile)}
          />
        ))}
      </div>

      <Lightbox
        image={expanded === null ? null : collage[shown[expanded]]}
        onClose={() => setExpanded(null)}
      />
    </section>
  );
};

export { HeroCollage };
