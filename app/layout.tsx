import type { Metadata } from 'next';
import { Inter, DM_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Site';
import { site } from '@/config/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Austin Liu — Dental Student in Adelaide',
  description: site.description,
  metadataBase: new URL('https://austinliu.com'),
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  openGraph: { title: 'Austin Liu — Dental Student in Adelaide', description: site.description, type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Austin Liu — Dental Student in Adelaide', description: site.description },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0c0e0d' },
    { media: '(prefers-color-scheme: light)', color: '#f3eee5' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} ${playfair.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
