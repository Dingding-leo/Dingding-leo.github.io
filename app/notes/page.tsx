import { NotesPage } from '@/components/LegacyPages';
import { pageMetadata } from '@/config/pageMetadata';

export const metadata = pageMetadata({
  title: 'Notes — Austin Liu',
  description:
    'Ten notes on products and places: three build journals and seven photographic field notes.',
  image: '/assets/blue-hour/waterfall-1200.jpg',
  imageAlt: 'A waterfall catching the last light inside a dark forest gorge',
});

export default function Page() {
  return <NotesPage />;
}
