import { ContactPage } from '@/components/LegacyPages';
import { pageMetadata } from '@/config/pageMetadata';

export const metadata = pageMetadata({
  title: 'Contact — Austin Liu',
  description:
    'Get in touch with Austin about products, photography, collaborations, or a thoughtful hello.',
  image: '/assets/blue-hour/lighthouse-1200.jpg',
  imageAlt: 'A lighthouse shining across a storm-darkened coastal headland',
});

export default function Page() {
  return <ContactPage />;
}
