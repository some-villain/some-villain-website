import { YouTubePlayer } from '@/components/common';
import { Badge, SectionHeading } from '@/components/ui';
import { home } from '@/lib/content';

const NowPlaying = () => {
  const film = home.nowPlaying;

  return (
    <section aria-labelledby="now-playing" className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading id="now-playing" eyebrow="Now Playing" title={film.title} />
        <div className="flex gap-2">
          <Badge variant="accent">{film.category}</Badge>
          <Badge>{film.year}</Badge>
        </div>
      </div>
      <YouTubePlayer youtubeId={film.youtubeId} title={film.title} />
      <p className="max-w-2xl text-base leading-relaxed text-muted">{film.description}</p>
    </section>
  );
};

export { NowPlaying };
