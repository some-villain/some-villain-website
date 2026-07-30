/**
 * All editable site content lives here.
 *
 * Video placeholders currently point to Blender Foundation open movies —
 * swap each `youtubeId` for Andrew's real videos (the ID is the part after
 * `watch?v=` in a YouTube URL). Swap the SVG placeholders in /public/stills
 * for real photographs, keeping the same file names or updating the paths below.
 */

export const site = {
  name: 'Andrew Davies',
  tagline: 'Filmmaker & Storyteller',
  location: 'Seattle, WA',
  email: 'hello@andrewdaviesfilm.com',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Vimeo', href: 'https://vimeo.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Works', href: '/works' },
  { label: 'Zines', href: '/zines' },
];

export const home = {
  heroVideoId: 'aqz-KE-bpKQ', // PLACEHOLDER — autoplaying hero reel
  intro:
    'I’m Andrew Davies, a Seattle-based filmmaker and storyteller. I create short films, social media campaigns, event and wedding videos, and commercial work, all with a focus on authenticity, collaboration, and creativity.',
  collage: [
    { src: '/stills/still-01.svg', alt: 'Film still — dusk over the Puget Sound' },
    { src: '/stills/still-02.svg', alt: 'Film still — golden hour close-up' },
    { src: '/stills/still-03.svg', alt: 'Film still — neon-lit street scene' },
    { src: '/stills/still-04.svg', alt: 'Film still — behind the scenes on set' },
    { src: '/stills/still-05.svg', alt: 'Film still — forest light' },
    { src: '/stills/still-06.svg', alt: 'Film still — late-night interior' },
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

export const about = {
  portrait: { src: '/stills/portrait.svg', alt: 'Portrait of Andrew Davies' },
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
}

export const zines: Zine[] = [
  {
    title: 'Frame Lines No. 1',
    year: '2026',
    cover: '/stills/zine-01.svg',
    description:
      'Production diaries, storyboards, and stills from a year of short films.',
  },
  {
    title: 'Puget Sound Notes',
    year: '2025',
    cover: '/stills/zine-02.svg',
    description:
      'A photo essay on the light, water, and weather of the Pacific Northwest.',
  },
  {
    title: 'Call Sheet',
    year: '2025',
    cover: '/stills/zine-03.svg',
    description:
      'Interviews and portraits of the collaborators behind the camera.',
  },
  {
    title: 'Seagull, Age Six',
    year: '2024',
    cover: '/stills/zine-04.svg',
    description:
      'Essays on theater, performance, and how storytelling begins.',
  },
];
