import { afterEach, describe, expect, it } from 'vitest';
import { WEB_IMAGE, byPage, imageUrl, pageNumber, zineNumber } from './images';

describe('WEB_IMAGE', () => {
  it.each(['a.png', 'a.jpg', 'a.jpeg', 'a.webp', 'A.PNG', 'b.JpEg', '1 cover.WEBP'])('accepts %s', (name) => {
    expect(WEB_IMAGE.test(name)).toBe(true);
  });

  it.each(['a.ai', 'a.pdf', 'a.png.txt', 'a.gif', 'png'])('rejects %s', (name) => {
    expect(WEB_IMAGE.test(name)).toBe(false);
  });
});

describe('pageNumber and byPage', () => {
  it('reads the leading number after the folder', () => {
    expect(pageNumber('Zines/Zine4/12 photo_1.jpg')).toBe(12);
    expect(pageNumber('Zines/Zine4/3_photo.jpg')).toBe(3);
    expect(pageNumber('Zines/Zine4/cover.jpg')).toBe(Infinity);
  });

  it('sorts numerically, then alphabetically, with un-numbered files last', () => {
    const files = ['10 j.jpg', '2 b.jpg', 'back.jpg', '1 a.jpg', 'alpha.jpg'];
    expect([...files].sort(byPage)).toEqual(['1 a.jpg', '2 b.jpg', '10 j.jpg', 'alpha.jpg', 'back.jpg']);
  });
});

describe('zineNumber', () => {
  it('matches Zine folders with or without a space', () => {
    expect(zineNumber('Zine4')).toBe('4');
    expect(zineNumber('Zine 12')).toBe('12');
    expect(zineNumber('zine3')).toBe('3');
  });

  it('ignores other folders', () => {
    expect(zineNumber('Posters')).toBeUndefined();
    expect(zineNumber('Zine4 old')).toBeUndefined();
  });
});

describe('imageUrl', () => {
  const original = process.env.NEXT_PUBLIC_SUPABASE_URL;
  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = original;
  });

  it('builds an encoded public URL', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co';
    expect(imageUrl('Zines/Zine 1/1 cover #2.jpg')).toBe(
      'https://abc.supabase.co/storage/v1/object/public/images/Zines/Zine%201/1%20cover%20%232.jpg',
    );
  });
});
