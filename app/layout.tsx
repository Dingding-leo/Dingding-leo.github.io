import type { Metadata } from 'next';
import { Inter, DM_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { site } from '@/config/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-serif' });

const siteTitle = 'Austin Liu — The Last Blue Hour';

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
    siteName: 'The Last Blue Hour',
    locale: 'en_AU',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'The Last Blue Hour — Austin Liu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: site.description,
    images: ['/og.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06101b',
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
      description: site.identity,
      knowsAbout: [
        'Product design',
        'Software development',
        'Photography',
        'Writing',
        'Dentistry',
      ],
      address: { '@type': 'PostalAddress', addressLocality: 'Adelaide', addressCountry: 'AU' },
      sameAs: [site.github],
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: 'The Last Blue Hour',
      alternateName: 'Austin Liu — Personal Space',
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
