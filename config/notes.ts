import type { Metadata } from 'next';

export type Note = {
  slug: string;
  title: string;
  kind?: 'field' | 'project';
  /** Display title on the notes index when it differs from the canonical title. */
  localTitle?: string;
  excerpt: string;
  /** Display excerpt on the notes index when it differs from the canonical excerpt. */
  localExcerpt?: string;
  /** BCP 47 language tag for localTitle/localExcerpt when they are not English. */
  localLang?: string;
  /** A short deck shown beneath the canonical title on the note page. */
  pageTitle: string;
  kicker: string;
  lede: string;
  label: string;
  readingTime: string;
  /** When the photographed event happened; month-only entries use the first day as a sort key. */
  occurredAt: string;
  dateLabel: string;
  /** First publication and latest editorial revision; never substitute the photographed date. */
  publishedAt: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  featured?: boolean;
};

export const notes: Note[] = [
  {
    slug: 'memory-needs-a-calmer-interface',
    title: 'Memory Needs a Calmer Interface',
    kind: 'project',
    excerpt:
      'What building Denki taught me about local-first study, honest scheduling, and making review feel less like another inbox.',
    pageTitle:
      'A local-first spaced-repetition studio built around trust, intervals, and quieter study.',
    kicker: 'Notes / Denki',
    lede:
      'The design decisions behind a calmer flashcard studio: FSRS scheduling, data that stays close, and fewer reasons to leave the learning loop.',
    label: 'Denki',
    readingTime: '7 min read',
    occurredAt: '2026-07-27',
    dateLabel: 'June–July 2026',
    publishedAt: '2026-07-29T11:00:00+09:30',
    updatedAt: '2026-07-29T11:00:00+09:30',
    image: '/assets/projects/denki.jpg',
    imageAlt:
      'A quiet blue desk with a row of cream and violet study cards, a notebook, and a circular progress light',
    imageWidth: 1600,
    imageHeight: 900,
    featured: true,
  },
  {
    slug: 'why-i-removed-14400-questions',
    title: 'Why I Removed 14,400 Questions',
    kind: 'project',
    excerpt:
      'ScholarBank became more credible when I stopped treating question count as a substitute for content integrity.',
    pageTitle:
      'What ScholarBank taught me about useful practice, calibrated claims, and the courage to make a catalogue smaller.',
    kicker: 'Notes / ScholarBank',
    lede:
      'A design note on current-year pathways, server-side practice, transparent limits, and why curated does not mean calibrated.',
    label: 'ScholarBank',
    readingTime: '7 min read',
    occurredAt: '2026-07-26',
    dateLabel: 'July 2026',
    publishedAt: '2026-07-29T11:00:00+09:30',
    updatedAt: '2026-07-29T11:00:00+09:30',
    image: '/assets/projects/scholarbank.jpg',
    imageAlt:
      'ScholarBank editorial artwork with a practice question card, progress indicator, and the words Practise with purpose',
    imageWidth: 1600,
    imageHeight: 840,
    featured: true,
  },
  {
    slug: 'no-account-between-me-and-the-board',
    title: 'No Account Between Me and the Board',
    kind: 'project',
    excerpt:
      'Inside KnightClub: private game data, bounded Stockfish analysis, and an on-device loop from play to practice.',
    pageTitle:
      'Building a local-first chess studio around ownership, understandable analysis, and honest limits.',
    kicker: 'Notes / KnightClub',
    lede:
      'How KnightClub keeps play, review, and mistakes from my games close to the board—without pretending local software has no tradeoffs.',
    label: 'KnightClub',
    readingTime: '7 min read',
    occurredAt: '2026-07-25',
    dateLabel: 'July 2026',
    publishedAt: '2026-07-29T11:00:00+09:30',
    updatedAt: '2026-07-29T11:00:00+09:30',
    image: '/assets/projects/knightclub-editorial.jpg',
    imageAlt:
      'A white knight lit warmly on a dark wooden chessboard beside a rain-covered blue-hour window',
    imageWidth: 1600,
    imageHeight: 900,
    featured: true,
  },
  {
    slug: 'shanghai-memories',
    title: 'Shanghai Memories',
    localTitle: '上海片刻：舞台灯光下的一帧',
    excerpt:
      'A Shanghai Disney stage washed in magenta and blue, kept as one vivid frame from July 2024.',
    localExcerpt:
      '一束舞台灯光、鲜明的蓝紫色彩，以及我在 2024 年 7 月上海之行留下的一帧。',
    localLang: 'zh-Hans',
    pageTitle: 'One bright fragment of a much larger city.',
    kicker: 'Notes / Shanghai',
    lede:
      'A performer, oversized animal silhouettes, and a canopy of magenta light at Shanghai Disney Resort.',
    label: 'Shanghai',
    readingTime: '2 min read',
    occurredAt: '2024-07-01',
    dateLabel: 'July 2024',
    publishedAt: '2026-07-11T10:16:21+09:30',
    updatedAt: '2026-07-29T01:51:57+09:30',
    image: '/assets/gallery/shanghai-disney.jpg',
    imageAlt:
      'A costumed performer in red beneath magenta and blue stage lights at Shanghai Disney Resort',
    imageWidth: 1920,
    imageHeight: 1080,
    featured: true,
  },
  {
    slug: 'great-ocean-road',
    title: 'The Great Ocean Road',
    excerpt:
      'Layered limestone, a cloud-heavy horizon, and the coast changing from one stop to the next.',
    pageTitle: 'Weather moving along the limestone coast.',
    kicker: 'Notes / Great Ocean Road',
    lede:
      'A December road trip recorded in two coastal frames: weathered rock, open water, and a sky in motion.',
    label: 'Victoria',
    readingTime: '2 min read',
    occurredAt: '2024-12-22',
    dateLabel: 'December 2024',
    publishedAt: '2026-07-11T17:55:32+09:30',
    updatedAt: '2026-07-29T01:51:57+09:30',
    image: '/assets/gallery/great-ocean-road.jpg',
    imageAlt:
      'Layered limestone cliffs and offshore stacks beneath broken cloud along the Great Ocean Road',
    imageWidth: 1920,
    imageHeight: 1440,
    featured: true,
  },
  {
    slug: 'sydney',
    title: 'A First Sydney Chapter',
    excerpt:
      'Modern campus lines, the Opera House beneath cloud, and open water at Kamay Botany Bay.',
    pageTitle: 'An early Australian chapter, recorded in three frames.',
    kicker: 'Notes / Sydney',
    lede:
      'October 2022 — a first Sydney trip moving from campus architecture to the harbour and coast.',
    label: 'Sydney',
    readingTime: '2 min read',
    occurredAt: '2022-10-01',
    dateLabel: 'October 2022',
    publishedAt: '2026-07-11T17:55:32+09:30',
    updatedAt: '2026-07-29T01:51:57+09:30',
    image: '/assets/gallery/sydney-usyd.jpg',
    imageAlt:
      'A modern glass and metal building at the University of Sydney',
    imageWidth: 1920,
    imageHeight: 1440,
    featured: true,
  },
  {
    slug: 'adelaide',
    title: 'Adelaide, Slowly',
    excerpt:
      'New Year’s Eve fireworks and a study-break walk among the rock and water of Morialta.',
    pageTitle: 'Two ways Adelaide changes the scale of a day.',
    kicker: 'Notes / Adelaide',
    lede:
      'A night sky above the city, then three figures among the rock pools of Morialta.',
    label: 'Adelaide',
    readingTime: '2 min read',
    occurredAt: '2023-12-31',
    dateLabel: 'December 2023',
    publishedAt: '2026-07-11T17:55:32+09:30',
    updatedAt: '2026-07-29T01:51:57+09:30',
    image: '/assets/gallery/adelaide-riverbank.jpg',
    imageAlt:
      'Orange fireworks and smoke above Adelaide on New Year’s Eve 2023',
    imageWidth: 1919,
    imageHeight: 1080,
  },
  {
    slug: 'melbourne',
    title: 'Melbourne in Two Moods',
    excerpt:
      'Late light above the Dandenong foothills and a red-hooded figure beside the water at St Kilda.',
    pageTitle: 'A city held between overlook and shoreline.',
    kicker: 'Notes / Melbourne',
    lede:
      'A sunlit Dandenong overlook and marina lights at St Kilda on New Year’s Eve.',
    label: 'Melbourne',
    readingTime: '2 min read',
    occurredAt: '2025-01-01',
    dateLabel: 'December 2024 — January 2025',
    publishedAt: '2026-07-11T17:55:32+09:30',
    updatedAt: '2026-07-29T01:51:57+09:30',
    image: '/assets/gallery/melbourne-stkilda.jpg',
    imageAlt:
      'A person in a red-and-black hood beside the water at St Kilda, with marina lights beyond',
    imageWidth: 1440,
    imageHeight: 1920,
  },
  {
    slug: 'beijing',
    title: 'Forty-Eight Hours in Beijing',
    excerpt: 'Two packed days between Universal Beijing Resort and Tiananmen Square at dusk.',
    pageTitle: 'Two July evenings, built at completely different scales.',
    kicker: 'Notes / Beijing',
    lede:
      'Universal Beijing Resort on July 9, then a crowd beneath the lamps at Tiananmen Square the following evening.',
    label: 'Beijing',
    readingTime: '2 min read',
    occurredAt: '2024-07-10',
    dateLabel: 'July 2024',
    publishedAt: '2026-07-11T17:55:32+09:30',
    updatedAt: '2026-07-29T01:51:57+09:30',
    image: '/assets/gallery/beijing-tiananmen.jpg',
    imageAlt:
      'A crowd waiting behind barriers beneath lamps at Tiananmen Square after dusk',
    imageWidth: 1920,
    imageHeight: 1440,
  },
  {
    slug: 'cairns',
    title: 'Warm Days in Cairns',
    excerpt:
      'A narrow fall at Barron Gorge, reef water, and three tropical days in the middle of winter.',
    pageTitle: 'From exposed rock to an underwater horizon.',
    kicker: 'Notes / Cairns',
    lede:
      'Tropical Queensland in July — a rainforest lookout, coral forms, and fish suspended in blue water.',
    label: 'Cairns',
    readingTime: '2 min read',
    occurredAt: '2025-07-01',
    dateLabel: 'July 2025',
    publishedAt: '2026-07-11T17:55:32+09:30',
    updatedAt: '2026-07-29T01:51:57+09:30',
    image: '/assets/gallery/cairns-barron.jpg',
    imageAlt:
      'A narrow waterfall crossing exposed rock in the rainforest at Barron Gorge',
    imageWidth: 1920,
    imageHeight: 1440,
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
  const image = {
    url: note.image,
    width: note.imageWidth,
    height: note.imageHeight,
    alt: note.imageAlt,
  };

  return {
    title,
    description: note.lede,
    authors: [{ name: 'Austin Liu', url: '/' }],
    alternates: { canonical: `/notes/${note.slug}/` },
    openGraph: {
      title,
      description: note.lede,
      type: 'article',
      publishedTime: note.publishedAt,
      modifiedTime: note.updatedAt,
      authors: ['/'],
      section: note.kind === 'project' ? 'Project notes' : 'Field notes',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: note.lede,
      images: [image],
    },
  };
}
