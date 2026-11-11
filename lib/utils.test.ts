import { describe, expect, it } from 'vitest';
import { youtubeId } from './utils';

describe('youtubeId', () => {
  it.each([
    'https://youtu.be/SauoRcuJxl4',
    'https://youtu.be/SauoRcuJxl4?si=abc',
    'https://www.youtube.com/watch?v=SauoRcuJxl4&t=5',
    'https://www.youtube.com/embed/SauoRcuJxl4',
    'https://www.youtube.com/shorts/SauoRcuJxl4',
    'SauoRcuJxl4',
  ])('extracts the ID from %s', (link) => expect(youtubeId(link)).toBe('SauoRcuJxl4'));

  it('returns undefined for other text', () => expect(youtubeId('https://example.com')).toBeUndefined());
});
