'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export interface LightboxProps {
  image: { src: string; alt: string } | null;
  onClose: () => void;
}

/**
 * Full-screen image lightbox with a smooth fade/zoom entrance. Closes on
 * backdrop click, the close button, or Escape.
 */
const Lightbox = ({ image, onClose }: LightboxProps) => {
  useEffect(() => {
    if (!image) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-[60] flex animate-fade-in items-center justify-center bg-ink/95 p-5 backdrop-blur-sm sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close expanded image"
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-line text-cream transition-colors hover:border-accent hover:text-accent"
        onClick={onClose}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <figure
        className="relative h-full max-h-[85vh] w-full max-w-5xl animate-zoom-fade-in"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
        <figcaption className="absolute -bottom-8 left-0 right-0 text-center font-display text-xs uppercase tracking-[0.2em] text-muted">
          {image.alt}
        </figcaption>
      </figure>
    </div>
  );
};

export { Lightbox };
