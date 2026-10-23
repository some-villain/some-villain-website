/**
 * Static fallback content and shared content types.
 *
 * Live content comes from Supabase via the fetchers in lib/data.ts (schema in
 * supabase/schema.sql). The values here are used as fallbacks whenever a
 * table is empty or unreachable, so the site always renders. Fallback images
 * all use a single placeholder (/fallback.svg).
 */

export interface SiteContent {
  name: string;
  tagline: string;
  location: string;
  email: string;
  socials: Array<{ label: string; href: string }>;
}

export interface HomeContent {
  heroVideoId: string;
  intro: string;
  collage: Array<{ src: string; alt: string }>;
  nowPlaying: { youtubeId: string; title: string };
}

export interface AboutContent {
  portrait: { src: string; alt: string };
  /** Single line shown above the bio, e.g. "Name - Role". */
  byline: string;
  bio: string[];
}

/** Single placeholder shown whenever Supabase content is unavailable. */
const FALLBACK_IMAGE = '/fallback.svg';

export const site: SiteContent = {
  name: 'Some Villain',
  tagline: 'Seattle-based film and zine makers',
  location: 'Seattle, WA',
  email: 'somevillainfilms@gmail.com',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/some.villain' },
    { label: 'YouTube', href: 'https://youtube.com/@some.villain' },
  ],
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Films', href: '/films' },
  { label: 'Zines', href: '/zines' },
  { label: 'Upcoming', href: '/upcoming' },
];

export const home: HomeContent = {
  heroVideoId: 'WpX3ctbQq0E', // Autoplaying background film loop on the home page
  intro: 'Seattle-based film and zine makers',
  collage: [
    { src: FALLBACK_IMAGE, alt: 'Film still — dusk over the Puget Sound' },
    { src: FALLBACK_IMAGE, alt: 'Film still — golden hour close-up' },
    { src: FALLBACK_IMAGE, alt: 'Film still — neon-lit street scene' },
    { src: FALLBACK_IMAGE, alt: 'Film still — behind the scenes on set' },
    { src: FALLBACK_IMAGE, alt: 'Film still — forest light' },
    { src: FALLBACK_IMAGE, alt: 'Film still — late-night interior' },
  ],
  nowPlaying: { youtubeId: 'eVkBWjiSydU', title: 'Stardate: Unknown | Sci-Fi Comedy Short Film' },
};

export const about: AboutContent = {
  portrait: { src: FALLBACK_IMAGE, alt: 'Portrait of Andrew Davies' },
  byline: 'Andrew Davies - Creative Director',
  bio: [
    'I’m a writer, filmmaker, and performer from Seattle, WA with a lifelong passion for storytelling that began when I played a seagull in Treasure Island at age six. Theater taught me the power of collaboration, the magic that happens when creatives combine their different perspectives and skills. Today I channel that magic into my short films and creative work.',
    'As a freelance filmmaker, I bring years of storytelling experience to every project. From social media campaigns and commercials to event and wedding films, I have found that the key to success is always collaboration, creating work that is not only visually striking but also deeply connected to the people it is made for.',
    'If you’re looking for a filmmaker who values creativity and collaboration, let’s create something together.',
  ],
};

export interface Work {
  title: string;
  youtubeId: string;
}

export const works: Work[] = [
  { title: 'QUEST BROS ep. 2 - The Feast of Fables', youtubeId: 'bj_3e3fa3jM' },
  { title: 'Stardate: Unknown | Sci-Fi Comedy Short Film', youtubeId: 'eVkBWjiSydU' },
  { title: 'The Arrangement', youtubeId: 'jtPLa5crpNo' },
  { title: 'Gem Mint Holographic', youtubeId: 'Gmzc9YWM0C4' },
  { title: 'Perspective or The Painting of a Magnificent Cowboy | Short Film', youtubeId: 'Ps79om0Kb8I' },
  { title: 'Live-In Stand-Up', youtubeId: 'b1jM1SNoAF8' },
  { title: 'Gourd of Darkness', youtubeId: 'pyM9V-7SF8c' },
  { title: 'QUEST BROS ep. 1 The Ghost', youtubeId: 'V-13XrX4qAY' },
  { title: 'Quest Bros', youtubeId: 'EWZaL3-usDE' },
];

export interface Zine {
  title: string;
  cover: string;
  /** Interior page images shown in the slideshow after the cover. */
  pages: string[];
}

/** Zines come from the Storage bucket; there is no static fallback. */
export const zines: Zine[] = [];
