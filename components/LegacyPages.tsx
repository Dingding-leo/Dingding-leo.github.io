import {
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import {
  BlueHourHero,
  type BlueHourScene,
} from '@/components/BlueHourJumpShell';
import jumpStyles from '@/components/BlueHourJumpShell.module.css';
import { Nav } from '@/components/Nav';
import { books, movies, type MediaItem } from '@/config/media';
import { notes as allNotes } from '@/config/notes';
import { site } from '@/config/site';
import styles from './LegacyPages.module.css';

type GalleryArtwork = {
  name: string;
  width: number;
  height: number;
  alt: string;
  collection?: 'gallery' | 'projects';
};

const galleryArtwork = {
  adelaide: {
    name: 'adelaide-riverbank',
    width: 800,
    height: 450,
    alt: "Orange fireworks and smoke above Adelaide on New Year's Eve 2023",
  },
  adelaideMorialta: {
    name: 'adelaide-morialta',
    width: 1920,
    height: 1440,
    alt: 'Warm sandstone cliffs and gum trees at Morialta Conservation Park',
  },
  melbourne: {
    name: 'melbourne-stkilda',
    width: 600,
    height: 800,
    alt: 'A person in a red-and-black hood beside the water at St Kilda',
  },
  melbourneDandenong: {
    name: 'melbourne-dandenong',
    width: 1920,
    height: 1440,
    alt: 'Late light over the layered ridges of the Dandenong Ranges',
  },
  shanghai: {
    name: 'shanghai-disney',
    width: 800,
    height: 450,
    alt: 'A performer beneath purple stage lights at Shanghai Disney Resort',
  },
  beijing: {
    name: 'beijing-universal',
    width: 800,
    height: 600,
    alt: 'Illuminated waterfront buildings at Universal Beijing Resort at night',
  },
  beijingTiananmen: {
    name: 'beijing-tiananmen',
    width: 1920,
    height: 1440,
    alt: 'Tiananmen gate illuminated across the water at dusk',
  },
  cairns: {
    name: 'cairns-barron',
    width: 800,
    height: 600,
    alt: 'A narrow waterfall crossing exposed rock in the rainforest at Barron Gorge',
  },
  cairnsReef: {
    name: 'cairns-marina',
    width: 1920,
    height: 1440,
    alt: 'A coral reef and fish beneath clear blue water near Cairns',
  },
  greatOceanRoad: {
    name: 'great-ocean-road',
    width: 800,
    height: 600,
    alt: "Layered limestone formations along Victoria's Great Ocean Road",
  },
  greatOceanRoadOtway: {
    name: 'gor-otway',
    width: 1920,
    height: 1440,
    alt: 'A green path beneath arching trees in the Otways',
  },
  sydney: {
    name: 'sydney-usyd',
    width: 800,
    height: 600,
    alt: 'A modern glass and metal building at the University of Sydney',
  },
  sydneyOpera: {
    name: 'sydney-opera',
    width: 1920,
    height: 1440,
    alt: 'The Sydney Opera House beneath a cloud-layered sky',
  },
  sydneyBotany: {
    name: 'sydney-botany',
    width: 1920,
    height: 1440,
    alt: 'Open blue water and a low shoreline at Kamay Botany Bay',
  },
} as const satisfies Record<string, GalleryArtwork>;

function GalleryPicture({
  artwork,
  sizes,
  className,
  priority = false,
}: {
  artwork: GalleryArtwork;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const isProjectArtwork = artwork.collection === 'projects';
  const originalBase = isProjectArtwork
    ? '/assets/projects'
    : '/assets/gallery';
  const optimizedBase = isProjectArtwork
    ? '/assets/projects/optimized'
    : '/assets/gallery/optimized-note';
  const widths = isProjectArtwork ? [640, 960] : [480, 960, 1440];
  const sourceSet = (format: 'avif' | 'webp') =>
    widths
      .map(
        (width) =>
          `${optimizedBase}/${artwork.name}-${width}.${format} ${width}w`,
      )
      .join(', ');

  return (
    <picture className={className}>
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
      <img
        src={`${originalBase}/${artwork.name}.jpg`}
        alt={artwork.alt}
        width={artwork.width}
        height={artwork.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}

export function LegacyPageShell({
  children,
  title,
  kicker,
  copy,
  scene,
  returnHref,
}: {
  children: React.ReactNode;
  title: string;
  kicker: string;
  copy: string;
  scene: BlueHourScene;
  returnHref: string;
}) {
  return (
    <div className={jumpStyles.shell}>
      <Nav />
      <main id="main-content" className={jumpStyles.page} tabIndex={-1}>
        <BlueHourHero
          scene={scene}
          kicker={kicker}
          title={title}
          copy={copy}
        />
        <div className={`container ${jumpStyles.content}`}>
          <div className={jumpStyles.surface}>{children}</div>
        </div>
      </main>
      <footer className={jumpStyles.footer}>
        <div className="container">
          <span>© 2026 Austin Liu</span>
          <Link href={returnHref}>
            Return to the living space <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function AboutPage() {
  return (
    <LegacyPageShell
      kicker="20:19 · One Window Left / About"
      title="A wider life, made visible."
      copy="The person behind the products, photographs, field notes, and experiments."
      scene="afterlight"
      returnHref="/#afterlight"
    >
      <div className={styles.aboutSplit}>
        <div>
          <p className={styles.aboutLead}>
            A dental student, builder, and traveller from China, now based in
            Adelaide — making small digital tools, collecting places, and keeping
            a public record of the things that hold my attention.
          </p>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span>Location</span>
              <strong>ADL</strong>
              <small>South Australia</small>
            </div>
            <div className={styles.statCard}>
              <span>Practice</span>
              <strong>MAKE</strong>
              <small>Design / writing / code</small>
            </div>
            <div className={styles.statCard}>
              <span>Code</span>
              <strong>TS</strong>
              <small>React / Next.js</small>
            </div>
          </div>
        </div>
        <div className={styles.prose}>
          <p>
            I like work that begins with a real question: could this be calmer,
            clearer, or more useful? That has led me from interface details and
            prototypes to photographs, short notes, and long walks with a camera.
          </p>
          <p>
            This site is less a résumé than a field notebook. Projects show how I
            think through a problem; Moments are a way of paying closer attention;
            Notes are where unfinished ideas get a little room to breathe.
          </p>
          <p>
            I also study dentistry seriously; it has sharpened my patience,
            care, and respect for small details. It is one part of a life that
            also makes room for reading, building, travelling, people, and the
            next blue hour.
          </p>
        </div>
      </div>
      <section className={styles.principles} aria-labelledby="principles-title">
        <div className={styles.principlesHead}>
          <span>How I like to work</span>
          <h2 id="principles-title">Three decisions I keep returning to.</h2>
        </div>
        <div className={styles.principlesGrid}>
          <Link href="/projects?project=knightclub">
            <span>01</span>
            <h3>Keep data close.</h3>
            <p>
              KnightClub and Denki explore what useful software feels like when
              privacy, offline access, and the person using it come first.
            </p>
            <small>
              See the local-first work <ArrowUpRight size={13} aria-hidden="true" />
            </small>
          </Link>
          <Link href="/projects?project=scholarbank">
            <span>02</span>
            <h3>Begin with a real need.</h3>
            <p>
              ScholarBank grew from a specific learning problem, then became a
              system for clearer practice, explanations, and progress.
            </p>
            <small>
              See the learning system <ArrowUpRight size={13} aria-hidden="true" />
            </small>
          </Link>
          <Link href="/moments">
            <span>03</span>
            <h3>Leave room for texture.</h3>
            <p>
              A photograph, a sentence, or a quiet transition can carry meaning
              that a résumé or feature list cannot.
            </p>
            <small>
              Open the visual journal <ArrowUpRight size={13} aria-hidden="true" />
            </small>
          </Link>
        </div>
      </section>
    </LegacyPageShell>
  );
}

export function MomentsPage() {
  const items = [
    {
      title: 'Adelaide',
      copy: 'New Year’s Eve fireworks, Morialta stone, and the quieter rhythm of a city becoming home.',
      artworks: [galleryArtwork.adelaide, galleryArtwork.adelaideMorialta],
      href: '/notes/adelaide',
    },
    {
      title: 'Melbourne',
      copy: 'A figure at St Kilda and a framed view from the Dandenong Ranges — two ways of holding the city’s edges.',
      artworks: [galleryArtwork.melbourne, galleryArtwork.melbourneDandenong],
      href: '/notes/melbourne',
    },
    {
      title: 'Shanghai',
      copy: 'One costumed performer held beneath magenta and blue stage lights at Shanghai Disney Resort.',
      artworks: [galleryArtwork.shanghai],
      href: '/notes/shanghai-memories',
    },
    {
      title: 'Beijing',
      copy: 'Universal Beijing Resort, then Tiananmen Square at dusk across two packed July days.',
      artworks: [galleryArtwork.beijing, galleryArtwork.beijingTiananmen],
      href: '/notes/beijing',
    },
    {
      title: 'Cairns',
      copy: 'Barron Gorge, Great Barrier Reef water, and three warm July days in tropical Queensland.',
      artworks: [galleryArtwork.cairns, galleryArtwork.cairnsReef],
      href: '/notes/cairns',
    },
    {
      title: 'Great Ocean Road',
      copy: 'Layered limestone, broken cloud, and an open horizon farther along the same coast.',
      artworks: [
        galleryArtwork.greatOceanRoad,
        galleryArtwork.greatOceanRoadOtway,
      ],
      href: '/notes/great-ocean-road',
    },
    {
      title: 'Sydney',
      copy: 'University buildings, harbour light, and an early chapter of life in Australia.',
      artworks: [
        galleryArtwork.sydney,
        galleryArtwork.sydneyOpera,
        galleryArtwork.sydneyBotany,
      ],
      href: '/notes/sydney',
    },
  ];

  return (
    <LegacyPageShell
      kicker="19:55 · What the Tide Kept / Moments"
      title="A few things worth remembering."
      copy="Places I've been, things I've seen, and the small moments that stay with you."
      scene="tide"
      returnHref="/#tide"
    >
      <div className={styles.momentsPrelude}>
        <span>14 published frames</span>
        <p>
          Moments is the visual index: diptychs and triptychs first, with the
          written field note waiting behind each place.
        </p>
      </div>
      <div className={styles.momentsGrid}>
        {items.map((item, index) => (
          <Link
            href={item.href}
            key={item.title}
            className={`${styles.momentCard} ${index < 2 ? styles.momentCardLarge : ''}`}
          >
            <div
              className={styles.momentCollage}
              data-count={item.artworks.length}
              aria-hidden="true"
            >
              {item.artworks.map((artwork) => (
                <GalleryPicture
                  artwork={{ ...artwork, alt: '' }}
                  className={styles.momentPicture}
                  sizes="(max-width: 760px) calc(50vw - 36px), (max-width: 1200px) 25vw, 280px"
                  key={artwork.name}
                />
              ))}
            </div>
            <div className={styles.momentCopy}>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </div>
            <ArrowUpRight size={24} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </LegacyPageShell>
  );
}

const noteArtworkBySlug: Record<string, GalleryArtwork> = {
  'memory-needs-a-calmer-interface': {
    name: 'denki',
    width: 1600,
    height: 900,
    alt: 'A quiet desk with a row of cream and violet study cards',
    collection: 'projects',
  },
  'why-i-removed-14400-questions': {
    name: 'scholarbank',
    width: 1600,
    height: 840,
    alt: 'ScholarBank editorial artwork with a practice question card',
    collection: 'projects',
  },
  'no-account-between-me-and-the-board': {
    name: 'knightclub-editorial',
    width: 1600,
    height: 900,
    alt: 'A white knight on a dark chessboard beside a rain-covered window',
    collection: 'projects',
  },
  adelaide: galleryArtwork.adelaide,
  melbourne: galleryArtwork.melbourne,
  'shanghai-memories': galleryArtwork.shanghai,
  beijing: galleryArtwork.beijing,
  cairns: galleryArtwork.cairns,
  'great-ocean-road': galleryArtwork.greatOceanRoad,
  sydney: galleryArtwork.sydney,
};

const notes = [...allNotes]
  .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
  .map((note) => ({
    title: note.title,
    localTitle: note.localTitle,
    localLang: note.localLang,
    excerpt: note.excerpt,
    label: note.label,
    time: note.readingTime,
    date: note.dateLabel,
    href: `/notes/${note.slug}`,
    artwork: noteArtworkBySlug[note.slug],
  }));

export function NotesPage() {
  return (
    <LegacyPageShell
      kicker="20:07 · Water in the Dark / Notes"
      title="Things I&apos;ve been thinking about."
      copy="Ten notes on products and places: three build journals, seven photographic field notes, and the decisions behind each."
      scene="waterfall"
      returnHref="/#water"
    >
      <div className={styles.notesList}>
        {notes.map((note, index) => (
          <Link className={styles.note} href={note.href} key={note.title}>
            <div className={styles.noteIndex}>
              {String(index + 1).padStart(2, '0')}
            </div>
            <GalleryPicture
              artwork={note.artwork}
              className={styles.notePicture}
              sizes="(max-width: 760px) 68px, 96px"
            />
            <div className={styles.noteMain}>
              <h2>{note.title}</h2>
              {note.localTitle && (
                <span
                  className={styles.noteLocalTitle}
                  lang={note.localLang}
                >
                  {note.localTitle}
                </span>
              )}
              <p>{note.excerpt}</p>
            </div>
            <div className={styles.noteMeta}>
              <span>{note.label}</span>
              <span>{note.date}</span>
              <span>
                <Clock size={13} aria-hidden="true" /> {note.time}
              </span>
            </div>
            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className={styles.noteArrow}
            />
          </Link>
        ))}
      </div>
    </LegacyPageShell>
  );
}

function MediaShelf({
  title,
  description,
  medium,
  creatorLabel,
  items,
}: {
  title: string;
  description: string;
  medium: string;
  creatorLabel: string;
  items: MediaItem[];
}) {
  const headingId = `library-${title.toLowerCase()}`;

  return (
    <section className={styles.shelf} aria-labelledby={headingId}>
      <header className={styles.shelfHeader}>
        <div>
          <p className={styles.shelfCount}>
            {String(items.length).padStart(2, '0')}{' '}
            {items.length === 1 ? 'selection' : 'selections'}
          </p>
          <h2 id={headingId}>{title}</h2>
        </div>
        <p>{description}</p>
      </header>
      <ol className={styles.mediaGrid} data-count={items.length}>
        {items.map((item, index) => (
          <li className={styles.mediaCard} key={item.title}>
            <article className={styles.mediaEntry}>
              <div
                className={styles.mediaArtwork}
                data-artwork={item.artwork}
                aria-hidden="true"
              >
                <div className={styles.mediaArtTopline}>
                  <span>Personal selection</span>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className={styles.mediaArtTitle}>
                  <span>{medium}</span>
                  <strong lang={item.language}>{item.title}</strong>
                </div>
                <span className={styles.mediaArtCredit}>
                  {item.creator} · {item.year}
                </span>
              </div>
              <div className={styles.mediaBody}>
                <div>
                  <p className={styles.mediaEyebrow}>
                    {medium} · {item.year}
                  </p>
                  <h3 lang={item.language}>{item.title}</h3>
                  <p className={styles.mediaCreator}>
                    <span>{creatorLabel}</span> {item.creator}
                  </p>
                </div>
                {item.rating != null && (
                  <p className={styles.mediaRating}>
                    <span>Personal rating</span>
                    <strong>{item.rating}/5</strong>
                  </p>
                )}
                {item.comment && (
                  <blockquote className={styles.mediaComment}>
                    {item.comment}
                  </blockquote>
                )}
                <p className={styles.mediaArtworkNote}>
                  Original site artwork — not an official cover or poster.
                </p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function LibraryPage() {
  return (
    <LegacyPageShell
      kicker="20:19 · Afterlight / Library"
      title="A small shelf, personally selected."
      copy="Three personal selections from books and cinema — not a complete reading or watch history."
      scene="afterlight"
      returnHref="/#afterlight"
    >
      <div className={styles.library}>
        <aside className={styles.libraryNote} aria-label="About this shelf">
          <p>On this shelf</p>
          <strong>03</strong>
          <span>
            Two books and one film, with only the ratings and notes kept here.
          </span>
        </aside>
        <MediaShelf
          title="Books"
          description="Two titles on the current shelf."
          medium="Book"
          creatorLabel="By"
          items={books}
        />
        <MediaShelf
          title="Cinema"
          description="One film on the current shelf."
          medium="Film"
          creatorLabel="Directed by"
          items={movies}
        />
      </div>
    </LegacyPageShell>
  );
}

export function ContactPage() {
  return (
    <LegacyPageShell
      kicker="19:31 · Bearing / Contact"
      title="Let's keep in touch."
      copy="For thoughtful collaborations, product ideas, photographs, food recommendations, or simply saying hello."
      scene="lighthouse"
      returnHref="/#bearing"
    >
      <div className={styles.contact}>
        <div className={styles.contactCopy}>
          <span>Adelaide · Australia</span>
          <h2>A good message can begin anywhere.</h2>
          <p>
            I&apos;m glad to hear about a useful product, a thoughtful
            collaboration, a photograph, a place worth eating, or an idea that
            is still finding its shape.
          </p>
          <small>
            I read every message personally. Replies may take a few days when
            study and building get busy.
          </small>
        </div>
        <div className={styles.contactChannels}>
          <a href={`mailto:${site.email}`}>
            <span>
              <small>Email</small>
              {site.email}
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Austin Liu on GitHub (opens in a new tab)"
          >
            <span>
              <small>GitHub</small>
              Dingding-leo
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <p>Usually reading in Australia/Adelaide time.</p>
        </div>
      </div>
    </LegacyPageShell>
  );
}
