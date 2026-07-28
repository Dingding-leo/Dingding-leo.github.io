import type { Metadata } from 'next';
import { AboutPage } from '@/components/LegacyPages';

export const metadata: Metadata = {
  title: 'About — Austin Liu',
  description:
    'Builder, traveller, photographer, writer, and dental student behind this public notebook.',
};

export default function Page() {
  return <AboutPage />;
}
