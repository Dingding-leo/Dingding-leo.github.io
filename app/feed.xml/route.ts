import { notes } from '@/config/notes';
import { site } from '@/config/site';

export const dynamic = 'force-static';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const items = [...notes]
    .sort(
      (a, b) =>
        b.publishedAt.localeCompare(a.publishedAt) ||
        b.occurredAt.localeCompare(a.occurredAt),
    )
    .map((note) => {
      const url = `${site.url}/notes/${note.slug}/`;
      return `    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(note.excerpt)}</description>
      <dc:creator>${escapeXml(site.name)}</dc:creator>
      <category>${escapeXml(note.label)}</category>
      <media:content url="${site.url}${note.image}" medium="image">
        <media:description>${escapeXml(note.imageAlt)}</media:description>
      </media:content>
      <pubDate>${new Date(note.publishedAt).toUTCString()}</pubDate>
      <dcterms:modified>${note.updatedAt}</dcterms:modified>
    </item>`;
    })
    .join('\n');

  const lastUpdated = [...notes]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.updatedAt;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Austin Liu — Notes</title>
    <link>${site.url}/notes/</link>
    <description>${escapeXml('Ten notes on products and places: three build journals and seven photographic field notes.')}</description>
    <language>en-au</language>
    ${lastUpdated ? `<lastBuildDate>${new Date(lastUpdated).toUTCString()}</lastBuildDate>` : ''}
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
