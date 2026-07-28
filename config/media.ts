export type MediaItem = {
  title: string;
  creator: string;
  year: number;
  artwork: 'amber-orbit' | 'blueprint-grid' | 'sandline';
  language?: string;
  rating?: number;
  comment?: string;
};

export const books: MediaItem[] = [
  {
    title: '我的26岁女房客',
    creator: '超级大坦克科比',
    year: 2014,
    artwork: 'amber-orbit',
    language: 'zh-CN',
    rating: 5,
  },
  {
    title: 'The Design of Everyday Things',
    creator: 'Don Norman',
    year: 2013,
    artwork: 'blueprint-grid',
    rating: 5,
    comment: 'Completely changed how I look at doors and interfaces.',
  },
];

export const movies: MediaItem[] = [
  {
    title: 'Dune: Part Two',
    creator: 'Denis Villeneuve',
    year: 2024,
    artwork: 'sandline',
    rating: 5,
    comment: 'The sand worm sequence was incredible.',
  },
];
