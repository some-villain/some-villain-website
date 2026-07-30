import { cn } from '@/lib/utils';

export interface AutoplayVideoProps extends React.HTMLAttributes<HTMLDivElement> {
  youtubeId: string;
  title: string;
}

/**
 * Decorative, muted, looping YouTube embed (browsers only allow autoplay when
 * muted). The iframe is oversized and centered so YouTube's chrome is cropped
 * out, and pointer events are disabled so it reads as a background film loop.
 */
const AutoplayVideo = ({ youtubeId, title, className, ...props }: AutoplayVideoProps) => (
  <div
    className={cn('relative overflow-hidden bg-surface', className)}
    aria-hidden
    {...props}
  >
    <iframe
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-video h-[140%] min-w-[140%] -translate-x-1/2 -translate-y-1/2"
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
      title={title}
      tabIndex={-1}
      allow="accelerometer; autoplay; encrypted-media; gyroscope"
    />
  </div>
);

export { AutoplayVideo };
