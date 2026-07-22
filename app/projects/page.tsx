import type { Metadata } from 'next';
import { ProjectsPage } from '@/components/LegacyPages';

export const metadata: Metadata = {
  title: 'Projects — Austin Liu',
  description:
    'KnightClub, ScholarBank, Denki, and other useful products built by Austin Liu.',
  openGraph: {
    title: 'Projects — Austin Liu',
    description:
      'Local-first software, learning tools, and practical experiments shaped by real interests.',
    images: ['/assets/projects/knightclub.jpg'],
  },
};

export default function Page() {
  return <ProjectsPage />;
}
