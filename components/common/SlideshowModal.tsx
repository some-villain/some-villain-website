'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

export interface SlideshowModalProps {
  title: string;
  slides: Array<{ src: string; alt: string }>;
  onClose: () => void;
}

/**
 * Full-screen slideshow modal. Clicking the current slide (or the arrows, or
 * pressing the arrow keys) pages through the slides with a soft cross-fade;
 * Escape, the close button, or a backdrop click dismisses it.
 */
const SlideshowModal = ({ title, slides, onClose }: SlideshowModalProps) => {
  const [index, setIndex] = useState(0);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [next, prev, onClose]);

  const slide = slides[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} slideshow`}
      className="fixed inset-0 z-[60] flex animate-fade-in flex-col items-center justify-center bg-ink/95 p-5 backdrop-blur-sm sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close slideshow"
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-line text-cream transition-colors hover:border-accent hover:text-accent"
        onClick={onClose}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <div
        className="flex w-full max-w-4xl animate-zoom-fade-in flex-col items-center gap-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full items-center justify-center gap-3 sm:gap-6">
          <button
            type="button"
            aria-label="Previous page"
            onClick={prev}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-cream transition-colors hover:border-accent hover:text-accent"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next page"
            title="Click to turn the page"
            className="relative h-[70vh] w-full max-w-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div key={index} className="absolute inset-0 animate-fade-in">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </button>

          <button
            type="button"
            aria-label="Next page"
            onClick={next}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-cream transition-colors hover:border-accent hover:text-accent"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <p
          aria-live="polite"
          className="font-display text-xs uppercase tracking-[0.2em] text-muted"
        >
          {title} — {index + 1} / {slides.length}
        </p>
      </div>
    </div>
  );
};

export { SlideshowModal };
