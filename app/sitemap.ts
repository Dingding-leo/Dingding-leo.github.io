import type { MetadataRoute } from 'next';
import { notes } from '@/config/notes';
import { site } from '@/config/site';

export const dynamic = 'force-static';
const pageLastModified = '2026-07-29T00:00:00+09:30';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: pageLastModified, priority: 1 },
    { url: `${site.url}/about/`, lastModified: pageLastModified, priority: 0.8 },
    { url: `${site.url}/projects/`, lastModified: pageLastModified, priority: 0.9 },
    { url: `${site.url}/moments/`, lastModified: pageLastModified, priority: 0.7 },
    { url: `${site.url}/notes/`, lastModified: pageLastModified, priority: 0.8 },
    { url: `${site.url}/library/`, lastModified: pageLastModified, priority: 0.5 },
    { url: `${site.url}/now/`, lastModified: pageLastModified, priority: 0.6 },
    { url: `${site.url}/contact/`, lastModified: pageLastModified, priority: 0.6 },
  ];

  const noteEntries: MetadataRoute.Sitemap = notes.map((note) => ({
    url: `${site.url}/notes/${note.slug}/`,
    lastModified: note.updatedAt,
    priority: 0.6,
  }));

  return [...pages, ...noteEntries];
}
