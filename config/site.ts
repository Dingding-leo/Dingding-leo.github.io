export type NavItem = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  tagline: string;
  description: string;
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
  { label: 'Now', href: '/now' },
  { label: 'Contact', href: '/#contact' },
];

export const projects: Project[] = [
  {
    title: 'KnightClub',
    tagline: 'Private, offline-first chess improvement.',
    description:
      'Play, review, and train entirely on-device with Stockfish analysis, personal mistake drills, a private game library, and local performance insights.',
    image: '/assets/projects/knightclub.jpg',
    imageAlt: 'KnightClub chess board and local Stockfish game controls',
    tags: ['React', 'Tauri', 'Rust', 'Stockfish'],
    status: 'Live',
    liveUrl: '/KnightLab/',
    repoUrl: 'https://github.com/Dingding-leo/KnightLab',
    featured: true,
  },
  {
    title: 'ScholarBank',
    tagline: 'Focused scholarship preparation for Years 5–10.',
    description:
      'A Melbourne-focused learning platform combining original skill-mapped questions, timed practice, worked explanations, and personalised progress insights.',
    image: '/assets/projects/scholarbank.jpg',
    imageAlt: 'ScholarBank scholarship preparation practice interface',
    tags: ['Next.js', 'Cloudflare D1', 'Drizzle', 'Education'],
    status: 'Live',
    liveUrl: 'https://scholarbank-melbourne.austinliu234.chatgpt.site',
    featured: true,
  },
  {
    title: 'Denki',
    tagline: 'A calmer way to remember what matters.',
    description:
      'A spaced-repetition flashcard studio for serious learners, built to organise knowledge systematically and retain it long-term.',
    image: '/assets/denki.jpg',
    imageAlt: 'Denki flashcard learning concept artwork',
    tags: ['Learning', 'Productivity', 'JavaScript'],
    status: 'Open source',
    repoUrl: 'https://github.com/Dingding-leo/Denki',
  },
  {
    title: 'Austin Liu / Personal space',
    tagline: 'The site you are exploring now.',
    description:
      'A warm, animated home for dental school, daily life, field notes, and the useful experiments I am building along the way.',
    image: '/assets/projects-bg.jpg',
    imageAlt: 'Soft abstract shapes representing Austin Liu\'s personal website',
    tags: ['Next.js', 'Design', 'Accessibility'],
    status: 'In progress',
    repoUrl: 'https://github.com/Dingding-leo/Dingding-leo.github.io',
  },
];

export const site = {
  name: 'Austin Liu',
  email: 'austinliu234@gmail.com',
  location: 'Adelaide, Australia',
  description:
    'The personal space of Austin Liu, a dental student in Adelaide, sharing dental school, daily life, routines, growth, and useful technology projects.',
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
