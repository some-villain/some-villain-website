import { afterEach, describe, expect, it } from 'vitest';
import loader from './supabaseImageLoader';

const src = 'https://abc.supabase.co/storage/v1/object/public/images/Poster/a%20b.jpg';

describe('supabaseImageLoader', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORMS;
  });

  it('serves local files as-is', () => {
    expect(loader({ src: '/fallback.svg', width: 640 })).toBe('/fallback.svg');
  });

  it('uses the Next.js optimizer by default', () => {
    expect(loader({ src, width: 640, quality: 60 })).toBe(`/_next/image?url=${encodeURIComponent(src)}&w=640&q=60`);
  });

  it('uses Supabase image transforms when enabled', () => {
    process.env.NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORMS = 'true';
    expect(loader({ src, width: 640 })).toBe(
      'https://abc.supabase.co/storage/v1/render/image/public/images/Poster/a%20b.jpg?width=640&quality=75',
    );
  });

  it('never rewrites non-Supabase URLs, even with transforms enabled', () => {
    process.env.NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORMS = 'true';
    const thumbnail = 'https://i.ytimg.com/vi/x/hqdefault.jpg';
    expect(loader({ src: thumbnail, width: 384 })).toBe(`/_next/image?url=${encodeURIComponent(thumbnail)}&w=384&q=75`);
  });
});
