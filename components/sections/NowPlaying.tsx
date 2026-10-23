import { YouTubePlayer } from '@/components/common';
import { SectionHeading } from '@/components/ui';
import { type HomeContent } from '@/lib/content';

export interface NowPlayingProps {
  film: HomeContent['nowPlaying'];
}

const NowPlaying = ({ film }: NowPlayingProps) => {
  return (
    <section aria-labelledby="now-playing" className="space-y-8">
      <SectionHeading id="now-playing" eyebrow="Now Playing" title={film.title} />
      <YouTubePlayer youtubeId={film.youtubeId} title={film.title} />
    </section>
  );
};

export { NowPlaying };
