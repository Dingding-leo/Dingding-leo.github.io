import type { Metadata } from 'next';

export type Note = {
  slug: string;
  title: string;
  /** Display title on the notes index when it differs from the canonical title. */
  localTitle?: string;
  excerpt: string;
  /** Display excerpt on the notes index when it differs from the canonical excerpt. */
  localExcerpt?: string;
  /** BCP 47 language tag for localTitle/localExcerpt when they are not English. */
  localLang?: string;
  /** The note page's own headline. */
  pageTitle: string;
  kicker: string;
  lede: string;
  label: string;
  readingTime: string;
  /** When the photographed event happened; month-only entries use the first day as a sort key. */
  occurredAt: string;
  dateLabel: string;
  image: string;
  featured?: boolean;
};

export const notes: Note[] = [
  {
    slug: 'shanghai-memories',
    title: 'Shanghai Memories',
    localTitle: '魔都漫游：城堡黄昏与夜色街巷',
    excerpt: 'Disney at dusk, narrow streets, food stalls, and Shanghai after dark.',
    localExcerpt: '从迪士尼的黄昏到夜里的街巷与小吃摊，这是我在上海留下的一段旅途记录。',
    localLang: 'zh-Hans',
    pageTitle: 'A city after dark.',
    kicker: 'Notes / Shanghai',
    lede: 'Disney at dusk, then narrow streets, food stalls, and the city moving after dark.',
    label: 'Shanghai',
    readingTime: '1 min read',
    occurredAt: '2024-07-01',
    dateLabel: 'July 2024',
    image: '/assets/gallery/shanghai-disney.jpg',
    featured: true,
  },
  {
    slug: 'great-ocean-road',
    title: 'The Great Ocean Road',
    excerpt: 'Wind at the Twelve Apostles, cool rainforest in the Otways, and one road between them.',
    pageTitle: 'Twelve Apostles at the edge of summer.',
    kicker: 'Notes / Great Ocean Road',
    lede: 'A December road trip through limestone coast and cool Otway rainforest.',
    label: 'Victoria',
    readingTime: '1 min read',
    occurredAt: '2024-12-22',
    dateLabel: 'December 2024',
    image: '/assets/gallery/great-ocean-road.jpg',
    featured: true,
  },
  {
    slug: 'sydney',
    title: 'A First Sydney Chapter',
    excerpt: 'Sandstone quadrangles, harbour light, and an early memory of life in Australia.',
    pageTitle: 'An early Australian chapter.',
    kicker: 'Notes / Sydney',
    lede: 'October 2022 — sandstone quadrangles, harbour light, and one of my first big trips in Australia.',
    label: 'Sydney',
    readingTime: '1 min read',
    occurredAt: '2022-10-01',
    dateLabel: 'October 2022',
    image: '/assets/gallery/sydney-usyd.jpg',
    featured: true,
  },
  {
    slug: 'adelaide',
    title: 'Adelaide, Slowly',
    excerpt: 'Riverbank evenings, campus routines, and a study-break walk through Morialta.',
    pageTitle: 'The steady rhythm of home.',
    kicker: 'Notes / Adelaide',
    lede: 'Campus routines, Morialta rock faces, and the River Torrens at dusk.',
    label: 'Adelaide',
    readingTime: '1 min read',
    occurredAt: '2023-12-31',
    dateLabel: 'December 2023',
    image: '/assets/gallery/adelaide-riverbank.jpg',
  },
  {
    slug: 'melbourne',
    title: 'Melbourne in Two Moods',
    excerpt: 'St Kilda sunsets, Dandenong mornings, and a city that keeps changing pace.',
    pageTitle: 'Weekend escapes to the south.',
    kicker: 'Notes / Melbourne',
    lede: 'A second city in two moods — mountain ash in the Dandenong Ranges and New Year’s Eve at St Kilda.',
    label: 'Melbourne',
    readingTime: '1 min read',
    occurredAt: '2025-01-01',
    dateLabel: 'January 2025',
    image: '/assets/gallery/melbourne-stkilda.jpg',
  },
  {
    slug: 'beijing',
    title: 'Forty-Eight Hours in Beijing',
    excerpt: 'Two packed days between Universal Beijing Resort and Tiananmen Square at dusk.',
    pageTitle: 'Two days in the capital.',
    kicker: 'Notes / Beijing',
    lede: 'Universal Beijing Resort on July 9, then Tiananmen Square at dusk the following day.',
    label: 'Beijing',
    readingTime: '1 min read',
    occurredAt: '2024-07-10',
    dateLabel: 'July 2024',
    image: '/assets/gallery/beijing-tiananmen.jpg',
  },
  {
    slug: 'cairns',
    title: 'Warm Days in Cairns',
    excerpt: 'Barron Gorge, reef water, and three tropical days in the middle of winter.',
    pageTitle: 'Chasing the winter sun north.',
    kicker: 'Notes / Cairns',
    lede: 'Tropical Queensland in July — Barron Gorge, reef water, and three warm days away from Adelaide winter.',
    label: 'Cairns',
    readingTime: '1 min read',
    occurredAt: '2025-07-01',
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
