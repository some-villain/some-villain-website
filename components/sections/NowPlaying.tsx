import { YouTubePlayer } from '@/components/common';
import { SectionHeading } from '@/components/ui';
import { type HomeContent } from '@/lib/content';

export interface NowPlayingProps {
  film: HomeContent['nowPlaying'];
  /** Label above the title; defaults to "Now Playing". */
  eyebrow?: string;
}

const NowPlaying = ({ film, eyebrow = 'Now Playing' }: NowPlayingProps) => {
  const headingId = eyebrow.toLowerCase().replace(/\s+/g, '-');

  return (
    <section aria-labelledby={headingId} className="space-y-8">
      <SectionHeading id={headingId} eyebrow={eyebrow} title={film.title} />
      <YouTubePlayer youtubeId={film.youtubeId} title={film.title} />
    </section>
  );
};

export { NowPlaying };
