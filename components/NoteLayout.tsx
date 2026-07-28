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

function editorialDate(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Australia/Adelaide',
  }).format(new Date(value));
}

type ArticleImageProps = {
  src: string;
  alt: string;
  thumbWidth?: number;
  fullWidth?: number;
  fullHeight?: number;
};

const articleImageWidths = [480, 960, 1440] as const;

function articleImageStem(src: string) {
  const pathname = src.split(/[?#]/, 1)[0];
  const match = pathname.match(/^\/assets\/gallery\/([^/]+)\.jpg$/i);

  return match?.[1] ?? null;
}

export function ArticleImage({
  src,
  alt,
  fullWidth = 1920,
  fullHeight = 1440,
}: ArticleImageProps) {
  const stem = articleImageStem(src);
  const sourceSet = (format: 'avif' | 'webp') =>
    stem
      ? articleImageWidths
          .map(
            (width) =>
              `/assets/gallery/optimized-note/${stem}-${width}.${format} ${width}w`,
          )
          .join(', ')
      : undefined;
  const sizes = '(max-width: 760px) calc(100vw - 74px), 720px';

  return (
    <picture style={{ display: 'block' }}>
      {stem && (
        <>
          <source
            type="image/avif"
            srcSet={sourceSet('avif')}
            sizes={sizes}
          />
          <source
            type="image/webp"
            srcSet={sourceSet('webp')}
            sizes={sizes}
          />
        </>
      )}
      <img
        src={src}
        alt={alt}
        width={fullWidth}
        height={fullHeight}
        loading="lazy"
        decoding="async"
        style={{ margin: 0 }}
      />
    </picture>
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

const projectArtwork = {
  'knightclub-editorial': {
    src: '/assets/projects/knightclub-editorial.jpg',
    width: 1600,
    height: 900,
  },
  scholarbank: {
    src: '/assets/projects/scholarbank.jpg',
    width: 1600,
    height: 840,
  },
  denki: {
    src: '/assets/projects/denki.jpg',
    width: 1600,
    height: 900,
  },
} as const;

export function ProjectArticleFigure({
  artwork,
  alt,
  caption,
}: {
  artwork: keyof typeof projectArtwork;
  alt: string;
  caption: React.ReactNode;
}) {
  const image = projectArtwork[artwork];
  const widths = [640, 960] as const;
  const sourceSet = (format: 'avif' | 'webp') =>
    widths
      .map(
        (width) =>
          `/assets/projects/optimized/${artwork}-${width}.${format} ${width}w`,
      )
      .join(', ');

  return (
    <figure className={`${styles.articleFigure} ${styles.projectFigure}`}>
      <picture>
        <source
          type="image/avif"
          srcSet={sourceSet('avif')}
          sizes="(max-width: 760px) calc(100vw - 74px), 720px"
        />
        <source
          type="image/webp"
          srcSet={sourceSet('webp')}
          sizes="(max-width: 760px) calc(100vw - 74px), 720px"
        />
        <img
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
        />
      </picture>
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
  const isProjectNote = note.kind === 'project';
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
        articleSection: isProjectNote ? 'Project notes' : 'Field notes',
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
        tabIndex={-1}
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
              <span>
                {isProjectNote ? 'Built ' : 'Photographed '}
                <time dateTime={note.occurredAt}>{note.dateLabel}</time>
              </span>
              <span aria-hidden="true">·</span>
              <span>{note.readingTime}</span>
              <span aria-hidden="true">·</span>
              <span>
                Published{' '}
                <time dateTime={note.publishedAt}>
                  {editorialDate(note.publishedAt)}
                </time>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Updated{' '}
                <time dateTime={note.updatedAt}>
                  {editorialDate(note.updatedAt)}
                </time>
              </span>
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
