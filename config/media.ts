export type MediaItem = {
  title: string;
  creator: string; // Author or Director
  year: number;
  coverImage: string;
  rating?: number; // Out of 5
  comment?: string;
  url?: string; // Link to Goodreads/IMDb/etc
};

export const books: MediaItem[] = [
  {
    title: '我的26岁女房客',
    creator: '超级大坦克科比',
    year: 2014,
    coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800',
    rating: 5,
    url: 'https://book.douban.com/subject/26343118/',
  },
  {
    title: 'The Design of Everyday Things',
    creator: 'Don Norman',
    year: 2013,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1400827252i/840.jpg',
    rating: 5,
    comment: 'Completely changed how I look at doors and interfaces.',
  },
];

export const movies: MediaItem[] = [
  {
    title: 'Dune: Part Two',
    creator: 'Denis Villeneuve',
    year: 2024,
    coverImage: 'https://m.media-amazon.com/images/M/MV5BODdjNjEyNDYtMTU0My00MTRjLTllNDQtNmFhNDVhODU5NjY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    rating: 5,
    comment: 'The sand worm sequence was incredible.',
  },
];
