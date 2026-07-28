'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { BlueHourHero } from '@/components/BlueHourJumpShell';
import jumpStyles from '@/components/BlueHourJumpShell.module.css';
import { Nav } from '@/components/Nav';
import { noteBySlug, notes } from '@/config/notes';
import { site } from '@/config/site';

const notesByOccurrence = [...notes].sort((a, b) =>
  b.occurredAt.localeCompare(a.occurredAt),
);

export function ArticleImage({
  src,
  alt,
  thumbWidth = 800,
  fullWidth = 1920,
  fullHeight = 1440,
}: {
  src: string;
  alt: string;
  thumbWidth?: number;
  fullWidth?: number;
  fullHeight?: number;
}) {
  const thumb = src.replace(/\.jpg$/, '_thumb.jpg');
  return (
    <img
      src={src}
      srcSet={`${thumb} ${thumbWidth}w, ${src} ${fullWidth}w`}
      sizes="(max-width: 828px) 100vw, 780px"
      alt={alt}
      width={fullWidth}
      height={fullHeight}
      loading="lazy"
      decoding="async"
    />
  );
}

function NoteShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const copyLink = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {
      // user dismissed the share sheet
    }
  };

  return (
    <div className={jumpStyles.articleShare}>
      <button type="button" onClick={copyLink}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
        <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
      </button>
      {canShare && (
        <button type="button" onClick={share}>
          <Share2 size={15} />
          <span>Share</span>
        </button>
      )}
    </div>
  );
}

export function NoteLayout({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const note = noteBySlug(slug);
  const index = notesByOccurrence.findIndex((item) => item.slug === slug);
  const previous = index > 0 ? notesByOccurrence[index - 1] : null;
  const next =
    index < notesByOccurrence.length - 1 ? notesByOccurrence[index + 1] : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: note.title,
        description: note.lede,
        image: `${site.url}${note.image}`,
        inLanguage: 'en-AU',
        author: { '@type': 'Person', name: site.name, url: site.url },
        mainEntityOfPage: `${site.url}/notes/${note.slug}/`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Notes', item: `${site.url}/notes/` },
          { '@type': 'ListItem', position: 3, name: note.title },
        ],
      },
    ],
  };

  return (
    <div className={jumpStyles.shell}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav />
      <main
        id="main-content"
        className={`${jumpStyles.page} ${jumpStyles.articlePage}`}
      >
        <BlueHourHero
          scene="waterfall"
          kicker={note.kicker}
          title={note.pageTitle}
          copy={note.lede}
          meta={
            <>
              <span>{note.dateLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{note.readingTime}</span>
            </>
          }
        />
        <div className={jumpStyles.articleWrap}>
          <article className={jumpStyles.articleContent}>{children}</article>
          <NoteShare title={note.title} />
        </div>
        {(previous || next) && (
          <nav className={jumpStyles.pagination} aria-label="More notes">
            {previous ? (
              <a
                className={jumpStyles.pageLink}
                href={`/notes/${previous.slug}`}
              >
                <span>&larr; Previous note</span>
                <strong>{previous.title}</strong>
              </a>
            ) : (
              <span aria-hidden="true" />
            )}
            {next ? (
              <a
                className={`${jumpStyles.pageLink} ${jumpStyles.pageLinkNext}`}
                href={`/notes/${next.slug}`}
              >
                <span>Next note &rarr;</span>
                <strong>{next.title}</strong>
              </a>
            ) : (
              <span aria-hidden="true" />
            )}
          </nav>
        )}
      </main>
      <footer className={jumpStyles.footer}>
        <div className="container">
          <a href="/notes">&larr; Back to notes</a>
          <span>&copy; 2026 Austin Liu</span>
        </div>
      </footer>
    </div>
  );
}
