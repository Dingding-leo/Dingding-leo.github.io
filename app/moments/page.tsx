import { MomentsPage } from '@/components/LegacyPages';
import { pageMetadata } from '@/config/pageMetadata';

export const metadata = pageMetadata({
  title: 'Moments — Austin Liu',
  description:
    'Travel photographs and field notes from Adelaide, Melbourne, Shanghai, Beijing, Cairns, Sydney, and the Great Ocean Road.',
  image: '/assets/blue-hour/tide-1200.jpg',
  imageAlt: 'A wooden boat resting in a tidal channel beneath a blue evening sky',
});

export default function Page() {
  return <MomentsPage />;
}
