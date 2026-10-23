/**
 * Static fallback content and shared content types.
 *
 * Live content comes from Supabase via the fetchers in lib/data.ts (schema in
 * supabase/schema.sql). The values here are used as fallbacks whenever a
 * table is empty or unreachable, so the site always renders. Video
 * placeholders point to Blender Foundation open movies; images are generated
 * a single placeholder image (/fallback.svg).
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
  nowPlaying: {
    youtubeId: string;
    title: string;
    year: string;
    category: string;
    description: string;
  };
}

export interface AboutContent {
  portrait: { src: string; alt: string };
  /** Single line shown above the bio, e.g. "Name - Role". */
  byline: string;
  bio: string[];
  services: string[];
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
  nowPlaying: {
    youtubeId: 'eRsGyueVLvQ', // PLACEHOLDER — most recent film
    title: 'Sintel',
    year: '2026',
    category: 'Short Film',
    description:
      'The latest release — a short film about the search for what we’ve lost, and what we find along the way.',
  },
};

export const about: AboutContent = {
  portrait: { src: FALLBACK_IMAGE, alt: 'Portrait of Andrew Davies' },
  byline: 'Andrew Davies - Creative Director',
  bio: [
    'I’m a writer, filmmaker, and performer from Seattle, WA with a lifelong passion for storytelling that began when I played a seagull in Treasure Island at age six. Theater taught me the power of collaboration, the magic that happens when creatives combine their different perspectives and skills. Today I channel that magic into my short films and creative work.',
    'As a freelance filmmaker, I bring years of storytelling experience to every project. From social media campaigns and commercials to event and wedding films, I have found that the key to success is always collaboration, creating work that is not only visually striking but also deeply connected to the people it is made for.',
    'If you’re looking for a filmmaker who values creativity and collaboration, let’s create something together.',
  ],
  services: [
    'Short Films',
    'Commercials',
    'Social Media Campaigns',
    'Wedding Films',
    'Event Coverage',
  ],
};

export type WorkCategory = 'Short Film' | 'Commercial' | 'Wedding & Event' | 'Social';

export interface Work {
  title: string;
  year: string;
  category: WorkCategory;
  youtubeId: string; // PLACEHOLDER IDs — replace with real videos
  description: string;
}

export const works: Work[] = [
  {
    title: 'Sintel',
    year: '2026',
    category: 'Short Film',
    youtubeId: 'eRsGyueVLvQ',
    description: 'A short film about the search for what we’ve lost.',
  },
  {
    title: 'Tears of Steel',
    year: '2025',
    category: 'Short Film',
    youtubeId: 'R6MlUcmOul8',
    description: 'A sci-fi short shot on location in the city.',
  },
  {
    title: 'Elephants Dream',
    year: '2025',
    category: 'Short Film',
    youtubeId: 'TLkA0RELQ1g',
    description: 'A surreal two-hander about the worlds we build.',
  },
  {
    title: 'Big Buck Bunny',
    year: '2024',
    category: 'Commercial',
    youtubeId: 'aqz-KE-bpKQ',
    description: 'A playful brand spot with a lot of heart.',
  },
  {
    title: 'Spring',
    year: '2024',
    category: 'Commercial',
    youtubeId: 'WhWc3b3KhnY',
    description: 'A seasonal campaign film built around natural light.',
  },
  {
    title: 'Operation Barbershop',
    year: '2024',
    category: 'Social',
    youtubeId: 'mN0zPOpADL4',
    description: 'A fast-cut social campaign teaser.',
  },
  {
    title: 'Llamigos',
    year: '2023',
    category: 'Wedding & Event',
    youtubeId: 'SkVqJ1SGeL0',
    description: 'A celebration film — warm, candid, and true to the day.',
  },
  {
    title: 'Cosmos Laundromat',
    year: '2023',
    category: 'Wedding & Event',
    youtubeId: 'Y-rmzh0PI3c',
    description: 'An event highlight film with an ensemble cast of guests.',
  },
];

export interface Zine {
  title: string;
  year: string;
  cover: string;
  description: string;
  /** Interior page images shown in the slideshow after the cover. */
  pages: string[];
}

const zinePages = [FALLBACK_IMAGE, FALLBACK_IMAGE];

export const zines: Zine[] = [
  {
    title: 'Frame Lines No. 1',
    year: '2026',
    cover: FALLBACK_IMAGE,
    description:
      'Production diaries, storyboards, and stills from a year of short films.',
    pages: zinePages,
  },
  {
    title: 'Puget Sound Notes',
    year: '2025',
    cover: FALLBACK_IMAGE,
    description:
      'A photo essay on the light, water, and weather of the Pacific Northwest.',
    pages: zinePages,
  },
  {
    title: 'Call Sheet',
    year: '2025',
    cover: FALLBACK_IMAGE,
    description:
      'Interviews and portraits of the collaborators behind the camera.',
    pages: zinePages,
  },
  {
    title: 'Seagull, Age Six',
    year: '2024',
    cover: FALLBACK_IMAGE,
    description:
      'Essays on theater, performance, and how storytelling begins.',
    pages: zinePages,
  },
];
