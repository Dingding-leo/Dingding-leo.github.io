import type { Metadata } from 'next';
import { LibraryPage } from '@/components/LegacyPages';

export const metadata: Metadata = {
  title: 'Library — Austin Liu',
  description:
    'A collection of books read and movies watched.',
};

export default function Page() {
  return <LibraryPage />;
}
