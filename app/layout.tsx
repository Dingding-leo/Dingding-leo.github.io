import type { Metadata } from 'next';
import { Inter, DM_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Site';
import { site } from '@/config/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-serif' });

const siteTitle = 'Austin Liu — Dental Student in Adelaide';

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: '%s',
  },
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'Austin Liu — Notes' }],
    },
  },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  openGraph: {
    title: siteTitle,
    description: site.description,
    type: 'website',
    siteName: 'Austin Liu — Personal Space',
    locale: 'en_AU',
    images: ['/assets/projects-bg.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: site.description,
    images: ['/assets/projects-bg.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0c0e0d' },
    { media: '(prefers-color-scheme: light)', color: '#f3eee5' },
  ],
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${site.url}/#person`,
      name: site.name,
      url: site.url,
      email: `mailto:${site.email}`,
      jobTitle: 'Dental Student',
      address: { '@type': 'PostalAddress', addressLocality: 'Adelaide', addressCountry: 'AU' },
      sameAs: [site.github],
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: 'Austin Liu — Personal Space',
      description: site.description,
      publisher: { '@id': `${site.url}/#person` },
      inLanguage: 'en-AU',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} ${playfair.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
