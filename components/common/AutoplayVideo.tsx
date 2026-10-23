'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface AutoplayVideoProps extends React.HTMLAttributes<HTMLDivElement> {
  youtubeId: string;
  title: string;
}

const PLAYER_ORIGIN = 'https://www.youtube-nocookie.com';

// YouTube widget player states
const PLAYING = 1;
const BUFFERING = 3;

/**
 * Decorative, muted, looping YouTube embed (browsers only allow autoplay when
 * muted). The iframe is oversized and centered so YouTube's top/bottom chrome
 * is cropped out, pointer events are disabled, and the video is only visible
 * while the player reports it is actually playing — so no player controls,
 * spinners, or paused states are ever shown. If the player stops for any
 * reason the background fades to dark and a muted play command is retried.
 */
const AutoplayVideo = ({ youtubeId, title, className, ...props }: AutoplayVideoProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const setPlayingState = (value: boolean) => {
      playingRef.current = value;
      setPlaying(value);
    };
    const post = (message: Record<string, unknown>) =>
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ id: 1, channel: 'widget', ...message }),
        PLAYER_ORIGIN
      );

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== PLAYER_ORIGIN) return;
      // TEMP DEBUG
      console.debug('[AutoplayVideo] msg', {
        sourceMatch: event.source === iframeRef.current?.contentWindow,
        hasRef: !!iframeRef.current,
        sample: String(event.data).slice(0, 80),
      });
      if (event.source !== iframeRef.current?.contentWindow) return;
      let data;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      const state =
        data?.event === 'onStateChange' ? data.info : data?.info?.playerState;
      if (typeof state !== 'number') return;
      if (state === PLAYING) {
        setPlayingState(true);
      } else if (state !== BUFFERING) {
        // Unstarted, paused, ended, or cued: hide the player until it plays.
        setPlayingState(false);
      }
    };
    window.addEventListener('message', onMessage);

    // The widget only posts state events once it hears "listening"; commands
    // sent before the player is ready are dropped, so keep re-subscribing and
    // nudging a muted play until the player reports it is playing.
    const heartbeat = setInterval(() => {
      if (playingRef.current) return;
      post({ event: 'listening' });
      post({ event: 'command', func: 'mute', args: [] });
      post({ event: 'command', func: 'playVideo', args: [] });
    }, 1000);

    return () => {
      window.removeEventListener('message', onMessage);
      clearInterval(heartbeat);
    };
  }, [youtubeId]);

  return (
    <div
      className={cn('relative overflow-hidden bg-surface', className)}
      aria-hidden
      data-playing={String(playing)}
      {...props}
    >
      <iframe
        ref={iframeRef}
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/2 aspect-video h-[140%] min-w-[140%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000',
          playing ? 'opacity-100' : 'opacity-0'
        )}
        src={`${PLAYER_ORIGIN}/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1`}
        title={title}
        tabIndex={-1}
        allow="accelerometer; autoplay; encrypted-media; gyroscope"
      />
    </div>
  );
};

export { AutoplayVideo };
