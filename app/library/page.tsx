import { LibraryPage } from '@/components/LegacyPages';
import { pageMetadata } from '@/config/pageMetadata';

export const metadata = pageMetadata({
  title: 'Library — Austin Liu',
  description:
    'Three personal selections from books and cinema, kept with ratings and brief notes.',
  image: '/assets/blue-hour/afterlight-1200.jpg',
  imageAlt: 'A small stone cabin with one warm window on a blue moor',
});

export default function Page() {
  return <LibraryPage />;
}
