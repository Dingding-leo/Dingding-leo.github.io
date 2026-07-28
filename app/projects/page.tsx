import type { Metadata } from 'next';
import { ProjectsPage } from '@/components/ProjectsPage';

export const metadata: Metadata = {
  title: 'Projects — Austin Liu',
  description:
    'KnightClub, ScholarBank, Denki, and other useful projects shaped by Austin Liu.',
  openGraph: {
    title: 'Projects — Austin Liu',
    description:
      'Local-first software, learning tools, and practical experiments shaped by real interests.',
    images: ['/assets/projects/knightclub-editorial.jpg'],
  },
};

export default function Page() {
  return <ProjectsPage />;
}
