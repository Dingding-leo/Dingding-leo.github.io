import { BlueHourHero } from '@/components/BlueHourJumpShell';
import Link from 'next/link';
import jumpStyles from '@/components/BlueHourJumpShell.module.css';
import { Nav } from '@/components/Nav';
import { NoteShare } from '@/components/NoteShare';
import { noteBySlug, notes } from '@/config/notes';
import { site } from '@/config/site';
import styles from './NoteLayout.module.css';

const notesByOccurrence = [...notes].sort((a, b) =>
  b.occurredAt.localeCompare(a.occurredAt),
);

type ArticleImageProps = {
  src: string;
  alt: string;
  thumbWidth?: number;
  fullWidth?: number;
  fullHeight?: number;
};

export function ArticleImage({
  src,
  alt,
  thumbWidth = 800,
  fullWidth = 1920,
  fullHeight = 1440,
}: ArticleImageProps) {
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

export function ArticleFigure({
  caption,
  ...image
}: ArticleImageProps & { caption: React.ReactNode }) {
  return (
    <figure className={styles.articleFigure}>
      <ArticleImage {...image} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function FieldNote({
  children,
  label = 'Field note',
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <aside className={styles.fieldNote} aria-label={label}>
      <span className={styles.fieldLabel}>{label}</span>
      <p>{children}</p>
    </aside>
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
  const newer = index > 0 ? notesByOccurrence[index - 1] : null;
  const older =
    index < notesByOccurrence.length - 1 ? notesByOccurrence[index + 1] : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: note.title,
        alternativeHeadline: note.pageTitle,
        description: note.lede,
        image: {
          '@type': 'ImageObject',
          url: `${site.url}${note.image}`,
          contentUrl: `${site.url}${note.image}`,
          width: note.imageWidth,
          height: note.imageHeight,
          caption: note.imageAlt,
        },
        datePublished: note.publishedAt,
        dateModified: note.updatedAt,
        articleSection: 'Field notes',
        about: note.label,
        inLanguage: 'en-AU',
        author: {
          '@type': 'Person',
          '@id': `${site.url}/#person`,
          name: site.name,
          url: site.url,
        },
        mainEntityOfPage: `${site.url}/notes/${note.slug}/`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Notes', item: `${site.url}/notes/` },
          {
            '@type': 'ListItem',
            position: 3,
            name: note.title,
            item: `${site.url}/notes/${note.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <div className={jumpStyles.shell}>
      <div className={styles.readingProgress} aria-hidden="true">
        <span />
      </div>
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
          kicker={
            <>
              <span>20:07</span>
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                ·
              </span>
              <Link className={styles.breadcrumbLink} href="/notes">
                Notes
              </Link>
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
              <span>{note.label}</span>
            </>
          }
          title={note.title}
          copy={
            <>
              <span className={styles.heroDeck}>{note.pageTitle}</span>
              <span className={styles.heroSummary}>{note.lede}</span>
            </>
          }
          meta={
            <>
              <time dateTime={note.occurredAt}>{note.dateLabel}</time>
              <span aria-hidden="true">·</span>
              <span>{note.readingTime}</span>
            </>
          }
        />
        <div className={jumpStyles.articleWrap}>
          <article className={jumpStyles.articleContent}>{children}</article>
          <NoteShare title={note.title} />
        </div>
        {(newer || older) && (
          <nav className={jumpStyles.pagination} aria-label="More notes">
            {newer ? (
              <Link
                className={jumpStyles.pageLink}
                href={`/notes/${newer.slug}`}
              >
                <span>&larr; Newer note</span>
                <strong>{newer.title}</strong>
                <small className={styles.pageLinkMeta}>
                  {newer.label} ·{' '}
                  <time dateTime={newer.occurredAt}>{newer.dateLabel}</time>
                </small>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {older ? (
              <Link
                className={`${jumpStyles.pageLink} ${jumpStyles.pageLinkNext}`}
                href={`/notes/${older.slug}`}
              >
                <span>Older note &rarr;</span>
                <strong>{older.title}</strong>
                <small className={styles.pageLinkMeta}>
                  {older.label} ·{' '}
                  <time dateTime={older.occurredAt}>{older.dateLabel}</time>
                </small>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </nav>
        )}
      </main>
      <footer className={jumpStyles.footer}>
        <div className="container">
          <Link href="/notes">&larr; Back to notes</Link>
          <span>&copy; 2026 Austin Liu</span>
        </div>
      </footer>
    </div>
  );
}
