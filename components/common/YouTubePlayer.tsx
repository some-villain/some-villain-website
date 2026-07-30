'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface YouTubePlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  youtubeId: string;
  title: string;
  /** Load the thumbnail eagerly (above-the-fold players). */
  priority?: boolean;
}

/**
 * Lite YouTube embed: renders only the thumbnail until clicked, then swaps in
 * the iframe with autoplay. Keeps pages with many videos fast.
 */
const YouTubePlayer = ({
  youtubeId,
  title,
  priority,
  className,
  ...props
}: YouTubePlayerProps) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn('group relative aspect-video overflow-hidden bg-surface', className)}
      {...props}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Image
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-ink/30 transition-colors group-hover:bg-ink/10" />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 bg-ink/60 backdrop-blur-sm transition-all duration-300 group-hover:border-accent group-hover:bg-ink/80"
          >
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path d="M1 1.5v17l16-8.5L1 1.5z" fill="currentColor" className="text-cream" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

export { YouTubePlayer };
