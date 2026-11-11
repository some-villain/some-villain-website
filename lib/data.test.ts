import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react', () => ({ cache: <T,>(fn: T) => fn }));

type Entry = { name: string; id: string | null };
const file = (name: string): Entry => ({ name, id: `id-${name}` });
const folder = (name: string): Entry => ({ name, id: null });

// Fake Storage listing keyed by folder
let listings: Record<string, Entry[]>;
let listError: { message: string } | null;
let queryResult: { data: unknown; error: { message: string } | null };

const builder = () => {
  const chain: Record<string, unknown> = {};
  for (const method of ['select', 'eq', 'order', 'maybeSingle']) chain[method] = () => chain;
  chain.then = (resolve: (value: unknown) => unknown) => resolve(queryResult);
  return chain;
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: builder,
    storage: {
      from: () => ({
        list: async (path: string) => ({ data: listError ? null : (listings[path] ?? []), error: listError }),
      }),
    },
  }),
}));

import { getHome, getUpcoming, getZines } from './data';

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'key';
  listError = null;
  queryResult = { data: [], error: null };
  listings = {};
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('getZines', () => {
  it('builds zines from the Zines/Zine<N>/ folders in numeric order, cover first', async () => {
    listings = {
      Zines: [folder('Zine10'), folder('Zine 2'), file('notes.txt')],
      'Zines/Zine10': [file('1 a.jpg')],
      'Zines/Zine 2': [file('10 j.png'), file('2 b.webp'), file('1 a.JPG'), file('3 scan.pdf')],
    };
    const zines = await getZines();
    expect(zines.map((zine) => zine.title)).toEqual(['Vol. 2', 'Vol. 10']);
    expect(zines[0].cover).toContain('/Zines/Zine%202/1%20a.JPG');
    expect(zines[0].pages.map((page) => page.split('/').pop())).toEqual(['2%20b.webp', '10%20j.png']);
    expect(zines[1].pages).toEqual([]);
  });

  it('skips folders with no displayable images', async () => {
    listings = { Zines: [folder('Zine1'), folder('Zine2')], 'Zines/Zine1': [file('1 a.ai')], 'Zines/Zine2': [file('1 a.jpg')] };
    expect((await getZines()).map((zine) => zine.title)).toEqual(['Vol. 2']);
  });

  it('logs the error and falls back when Storage fails', async () => {
    listError = { message: 'boom' };
    expect(await getZines()).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('getZines'), expect.any(Error));
  });
});

describe('getUpcoming', () => {
  const row = { title: 'Telephone', poster: 'Telephone Poster.png', description: 'One.\n\nTwo.', trailer: 'https://youtu.be/SauoRcuJxl4' };

  it('maps rows: poster file in Poster/, description paragraphs, trailer ID', async () => {
    queryResult = { data: [row], error: null };
    const [item] = await getUpcoming();
    expect(item.poster.src).toContain('/Poster/Telephone%20Poster.png');
    expect(item.description).toEqual(['One.', 'Two.']);
    expect(item.trailerId).toBe('SauoRcuJxl4');
  });

  it('skips rows whose trailer is not a YouTube link', async () => {
    queryResult = { data: [{ ...row, trailer: 'not a link' }], error: null };
    expect(await getUpcoming()).toEqual([]);
  });

  it('falls back to an empty list when the query fails', async () => {
    queryResult = { data: null, error: { message: 'boom' } };
    expect(await getUpcoming()).toEqual([]);
  });
});

describe('getHome', () => {
  const film = (title: string, coming_soon: boolean) => ({ title, video_id: `${title}-id`, coming_soon });

  it('splits now_playing rows into Now Playing and Coming Soon', async () => {
    queryResult = { data: [film('Soon', true), film('Now', false)], error: null };
    const home = await getHome();
    expect(home.nowPlaying).toEqual({ youtubeId: 'Now-id', title: 'Now' });
    expect(home.comingSoon).toEqual({ youtubeId: 'Soon-id', title: 'Soon' });
  });

  it('has no Coming Soon film when no row is marked coming soon', async () => {
    queryResult = { data: [film('Now', false)], error: null };
    expect((await getHome()).comingSoon).toBeUndefined();
  });
});
