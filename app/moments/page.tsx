import type { Metadata } from 'next';
import { MomentsPage } from '@/components/LegacyPages';

export const metadata: Metadata = {
  title: 'Moments — Austin Liu',
  description:
    'Travel photographs and field notes from Adelaide, Melbourne, Shanghai, Beijing, Cairns, Sydney, and the Great Ocean Road.',
};

export default function Page() {
  return <MomentsPage />;
}
