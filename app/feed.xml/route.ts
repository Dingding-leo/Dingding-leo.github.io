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
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((note) => {
      const url = `${site.url}/notes/${note.slug}/`;
      return `    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(note.excerpt)}</description>
      <category>${escapeXml(note.label)}</category>
      <pubDate>${new Date(`${note.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Austin Liu — Notes</title>
    <link>${site.url}/notes/</link>
    <description>${escapeXml('Field notes from places, projects, and the ordinary days worth keeping.')}</description>
    <language>en-au</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
