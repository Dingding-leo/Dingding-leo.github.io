import type { Metadata } from 'next';
import { NotesPage } from '@/components/LegacyPages';

export const metadata: Metadata = {
  title: 'Notes — Austin Liu',
  description:
    'Field notes from places, projects, and the ordinary days worth keeping.',
};

export default function Page() {
  return <NotesPage />;
}
