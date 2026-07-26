import type { Metadata } from 'next';

export type Note = {
  slug: string;
  title: string;
  /** Display title on the notes index when it differs from the canonical title. */
  localTitle?: string;
  excerpt: string;
  /** Display excerpt on the notes index when it differs from the canonical excerpt. */
  localExcerpt?: string;
  /** The note page's own headline. */
  pageTitle: string;
  kicker: string;
  lede: string;
  label: string;
  readingTime: string;
  /** ISO sort key; precision is the month unless the note states an exact day. */
  date: string;
  dateLabel: string;
  image: string;
  featured?: boolean;
};

export const notes: Note[] = [
  {
    slug: 'shanghai-memories',
    title: 'Shanghai Memories',
    localTitle: '魔都漫游：一半是烟火，一半是赛博霓虹',
    excerpt: 'Classical streets, everyday warmth, and a city lit by cyberpunk neon.',
    localExcerpt: '上海，一座古典与魔幻赛博朋克交织的城市。这是我的旅途纪实。',
    pageTitle: 'Magic in the madness.',
    kicker: 'Notes / Shanghai',
    lede: 'Disney by day, streets by night. Shanghai doesn’t give you a moment to breathe.',
    label: 'Shanghai',
    readingTime: '5 min read',
    date: '2024-07-01',
    dateLabel: 'July 2024',
    image: '/assets/gallery/shanghai-disney.jpg',
    featured: true,
  },
  {
    slug: 'great-ocean-road',
    title: 'The Great Ocean Road',
    excerpt: 'Salt air, rainforest, long roads, and a landscape that asks you to slow down.',
    pageTitle: 'Twelve Apostles at the edge of summer.',
    kicker: 'Notes / Great Ocean Road',
    lede: 'A December road trip down the coast — wind, limestone, and the kind of light that makes you pull over.',
    label: 'Victoria',
    readingTime: '4 min read',
    date: '2024-12-22',
    dateLabel: 'December 2024',
    image: '/assets/gallery/great-ocean-road.jpg',
    featured: true,
  },
  {
    slug: 'sydney',
    title: 'A First Sydney Chapter',
    excerpt: 'Sandstone quadrangles, harbour light, and an early memory of life in Australia.',
    pageTitle: 'The city that started it all.',
    kicker: 'Notes / Sydney',
    lede: 'October 2022 — sandstone quadrangles, harbour light, and my first real taste of Australia.',
    label: 'Sydney',
    readingTime: '4 min read',
    date: '2022-10-01',
    dateLabel: 'October 2022',
    image: '/assets/gallery/sydney-usyd.jpg',
    featured: true,
  },
  {
    slug: 'adelaide',
    title: 'Adelaide, Slowly',
    excerpt: 'Riverbank walks, campus routines, and a city that leaves enough room to grow.',
    pageTitle: 'The steady rhythm of home.',
    kicker: 'Notes / Adelaide',
    lede: 'A dental student’s life in Adelaide — campus, coffee, and the river at dusk.',
    label: 'Adelaide',
    readingTime: '3 min read',
    date: '2023-12-31',
    dateLabel: 'December 2023',
    image: '/assets/gallery/adelaide-riverbank.jpg',
  },
  {
    slug: 'melbourne',
    title: 'Melbourne in Two Moods',
    excerpt: 'St Kilda sunsets, Dandenong mornings, and a city that keeps changing pace.',
    pageTitle: 'Weekend escapes to the south.',
    kicker: 'Notes / Melbourne',
    lede: 'A second city that keeps pulling me back — Dandenong mornings and St Kilda afternoons.',
    label: 'Melbourne',
    readingTime: '3 min read',
    date: '2025-01-01',
    dateLabel: 'January 2025',
    image: '/assets/gallery/melbourne-stkilda.jpg',
  },
  {
    slug: 'beijing',
    title: 'Forty-Eight Hours in Beijing',
    excerpt: 'A quick chapter of big landmarks, loud theme parks, and late-evening light.',
    pageTitle: 'A whirlwind 48 hours in the capital.',
    kicker: 'Notes / Beijing',
    lede: 'Universal Studios by day, Tiananmen by dusk — Beijing doesn’t do things halfway.',
    label: 'Beijing',
    readingTime: '3 min read',
    date: '2024-07-10',
    dateLabel: 'July 2024',
    image: '/assets/gallery/beijing-tiananmen.jpg',
  },
  {
    slug: 'cairns',
    title: 'Warm Days in Cairns',
    excerpt: 'Barron Gorge, marina mornings, and a winter week that felt like summer.',
    pageTitle: 'Chasing the winter sun north.',
    kicker: 'Notes / Cairns',
    lede: 'Tropical Queensland in July — rainforest, reef, and the kind of warmth you forget exists during an Adelaide winter.',
    label: 'Cairns',
    readingTime: '3 min read',
    date: '2025-07-01',
    dateLabel: 'July 2025',
    image: '/assets/gallery/cairns-barron.jpg',
  },
];

export function noteBySlug(slug: string): Note {
  const note = notes.find((item) => item.slug === slug);
  if (!note) throw new Error(`Unknown note slug: ${slug}`);
  return note;
}

export function noteMetadata(slug: string): Metadata {
  const note = noteBySlug(slug);
  const title = `${note.title} — Austin Liu`;
  return {
    title,
    description: note.lede,
    openGraph: {
      title,
      description: note.lede,
      type: 'article',
      images: [note.image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: note.lede,
      images: [note.image],
    },
  };
}
