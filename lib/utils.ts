import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** YouTube video ID from a watch, youtu.be, embed or shorts link (or a bare ID); undefined if none is found. */
export const youtubeId = (link: string) =>
  link.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? link.match(/^[\w-]{11}$/)?.[0];
