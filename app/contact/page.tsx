import type { Metadata } from 'next';
import { ContactPage } from '@/components/LegacyPages';

export const metadata: Metadata = {
  title: 'Contact — Austin Liu',
  description:
    'Get in touch for study chats, food recommendations, and collaborations.',
};

export default function Page() {
  return <ContactPage />;
}
