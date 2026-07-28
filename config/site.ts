export type NavItem = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  tagline: string;
  description: string;
  why: string;
  role: string;
  decision: string;
  image: string;
  imageAlt: string;
  tags: string[];
  status: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Moments', href: '/moments' },
  { label: 'Projects', href: '/projects' },
  { label: 'Notes', href: '/notes' },
  { label: 'Library', href: '/library' },
  { label: 'Now', href: '/now' },
  { label: 'Contact', href: '/contact' },
];

export const projects: Project[] = [
  {
    title: 'KnightClub',
    tagline: 'Private, offline-first chess improvement.',
    description:
      'Play, review, and train entirely on-device with Stockfish analysis, personal mistake drills, a private game library, and local performance insights.',
    why:
      'Chess improvement should be private, understandable, and available without an account or subscription.',
    role:
      'Product design, engineering, interaction design, and local engine integration.',
    decision:
      'Keep game data on-device and isolate bounded Stockfish work from the interface, with a native Tauri path for desktop analysis.',
    image: '/assets/projects/knightclub.jpg',
    imageAlt: 'KnightClub chess board and local Stockfish game controls',
    tags: ['React', 'Tauri', 'Rust', 'Stockfish'],
    status: 'Live',
    liveUrl: 'https://dingding-leo.github.io/KnightClub/',
    repoUrl: 'https://github.com/Dingding-leo/KnightClub',
    featured: true,
  },
  {
    title: 'ScholarBank',
    tagline: 'Focused scholarship preparation for Years 5–10.',
    description:
      'A Melbourne-focused learning platform combining original skill-mapped questions, timed practice, worked explanations, and personalised progress insights.',
    why:
      'Families need a clearer way to prepare for Melbourne scholarship pathways than another pile of generic worksheets.',
    role:
      'Product strategy, learning experience design, content systems, and full-stack engineering.',
    decision:
      'Organise original questions around transferable skills and bind saved practice to individual learners while keeping provider independence explicit.',
    image: '/assets/projects/scholarbank.jpg',
    imageAlt: 'ScholarBank scholarship preparation practice interface',
    tags: ['Next.js', 'Cloudflare D1', 'Drizzle', 'Education'],
    status: 'Public beta',
    liveUrl: 'https://mul.tjren.site/',
    featured: true,
  },
  {
    title: 'Denki',
    tagline: 'Focused review, timed by memory.',
    description:
      'Create, import, and review flashcards with FSRS scheduling, offline storage, focused study sessions, a built-in scratchpad, and clear progress insights.',
    why:
      'Spaced repetition works best when review feels calm, portable, and under the learner’s control.',
    role:
      'Product design, frontend engineering, offline architecture, and study workflow design.',
    decision:
      'Use FSRS 4.5 with IndexedDB and an offline-first PWA so cards and review history work without an account or required cloud service.',
    image: '/assets/projects/denki.jpg',
    imageAlt: 'Layered flashcards arranged along a calm spaced-repetition review timeline',
    tags: ['React', 'FSRS', 'IndexedDB', 'PWA'],
    status: 'Live',
    liveUrl: 'https://dingding-leo.github.io/Denki/',
    repoUrl: 'https://github.com/Dingding-leo/Denki',
    featured: true,
  },
  {
    title: 'Austin Liu / Personal space',
    tagline: 'A life told through the last blue hour.',
    description:
      'A cinematic personal space for useful products, photographs, field notes, travel, and the quieter parts of an unfinished life.',
    why:
      'A personal site should preserve the texture of a life instead of flattening it into a résumé.',
    role:
      'Creative direction, writing, photography, interaction design, and engineering.',
    decision:
      'Shape the experience as five blue-hour chapters while keeping familiar routes, accessible navigation, and reduced-motion support.',
    image: '/assets/blue-hour/lighthouse-1672.jpg',
    imageAlt: 'A lighthouse casting warm light across a blue-hour coastal landscape',
    tags: ['Next.js', 'Storytelling', 'Motion', 'Accessibility'],
    status: 'In progress',
    repoUrl: 'https://github.com/Dingding-leo/Dingding-leo.github.io',
  },
];

export const site = {
  name: 'Austin Liu',
  url: 'https://dingding-leo.github.io',
  email: 'austinliu234@gmail.com',
  location: 'Adelaide, Australia',
  description:
    'Austin Liu’s personal space for building useful products, travelling with a camera, writing field notes, and documenting a life that also includes dentistry.',
  identity:
    'Builder, traveller, writer, and photographer based in Adelaide. Dentistry is one discipline within a wider life of making, learning, and paying attention.',
  nav: navItems,
  interests: [
    ['Dentistry', 'Precision, patience, and care in progress.'],
    ['Coffee', 'A small ritual before the next thing.'],
    ['Food', 'Worth remembering, especially with friends.'],
    ['Design', 'Making useful things feel considered.'],
    ['Technology', 'Curious about what can be built.'],
    ['Photography', 'Keeping a record of the ordinary.'],
    ['Fitness', 'A steady way to reset.'],
    ['Music', 'Soundtrack for quiet work.'],
  ],
  moments: [
    'A new noodle place to try',
    'The same three songs on repeat',
    'Revision blocks with a proper lunch break',
    'A weekend walk without a schedule',
  ],
  github: 'https://github.com/Dingding-leo',
};
