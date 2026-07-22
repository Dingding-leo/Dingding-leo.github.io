import type { Metadata } from 'next';
import { NowPage } from '@/components/LegacyPages';

export const metadata: Metadata = {
  title: 'Now — Austin Liu',
  description:
    'A current snapshot of what Austin is studying, building, and exploring.',
};

export default function Page() {
  return <NowPage />;
}
