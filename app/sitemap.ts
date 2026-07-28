import type { MetadataRoute } from 'next';
import { notes } from '@/config/notes';
import { site } from '@/config/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, priority: 1 },
    { url: `${site.url}/about/`, priority: 0.8 },
    { url: `${site.url}/projects/`, priority: 0.9 },
    { url: `${site.url}/moments/`, priority: 0.7 },
    { url: `${site.url}/notes/`, priority: 0.8 },
    { url: `${site.url}/library/`, priority: 0.5 },
    { url: `${site.url}/now/`, priority: 0.6 },
    { url: `${site.url}/contact/`, priority: 0.6 },
  ];

  const noteEntries: MetadataRoute.Sitemap = notes.map((note) => ({
    url: `${site.url}/notes/${note.slug}/`,
    priority: 0.6,
  }));

  return [...pages, ...noteEntries];
}
