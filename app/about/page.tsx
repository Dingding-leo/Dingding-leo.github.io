import { AboutPage } from '@/components/LegacyPages';
import { pageMetadata } from '@/config/pageMetadata';

export const metadata = pageMetadata({
  title: 'About — Austin Liu',
  description:
    'Dental student, builder, traveller, photographer, and writer behind The Last Blue Hour.',
  image: '/assets/blue-hour/afterlight-1200.jpg',
  imageAlt: 'A small stone cabin with one warm window on a blue moor',
});

export default function Page() {
  return <AboutPage />;
}
