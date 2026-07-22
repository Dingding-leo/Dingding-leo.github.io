import type { Metadata } from 'next';
import { AboutPage } from '@/components/LegacyPages';

export const metadata: Metadata = {
  title: 'About — Austin Liu',
  description:
    'Dental student, curious builder, and the person behind this public notebook.',
};

export default function Page() {
  return <AboutPage />;
}
