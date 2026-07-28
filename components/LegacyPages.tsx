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
};

const galleryArtwork = {
  adelaide: {
    name: 'adelaide-riverbank',
    width: 800,
    height: 450,
    alt: "Orange fireworks and smoke above Adelaide on New Year's Eve 2023",
  },
  melbourne: {
    name: 'melbourne-stkilda',
    width: 600,
    height: 800,
    alt: 'A person in a red-and-black hood beside the water at St Kilda',
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
  cairns: {
    name: 'cairns-barron',
    width: 800,
    height: 600,
    alt: 'A narrow waterfall crossing exposed rock in the rainforest at Barron Gorge',
  },
  greatOceanRoad: {
    name: 'great-ocean-road',
    width: 800,
    height: 600,
    alt: "Layered limestone formations along Victoria's Great Ocean Road",
  },
  sydney: {
    name: 'sydney-usyd',
    width: 800,
    height: 600,
    alt: 'A modern glass and metal building at the University of Sydney',
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
  return (
    <picture className={className}>
      <source
        type="image/avif"
        srcSet={`/assets/gallery/optimized/${artwork.name}-320.avif 320w, /assets/gallery/optimized/${artwork.name}-600.avif 600w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`/assets/gallery/optimized/${artwork.name}-320.webp 320w, /assets/gallery/optimized/${artwork.name}-600.webp 600w`}
        sizes={sizes}
      />
      <img
        src={`/assets/gallery/${artwork.name}_thumb.jpg`}
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
      <main id="main-content" className={jumpStyles.page}>
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
      title="A public notebook, still in progress."
      copy="A little more context about the person behind the notes, projects, and experiments."
      scene="afterlight"
      returnHref="/#afterlight"
    >
      <div className={styles.aboutSplit}>
        <div>
          <p className={styles.aboutLead}>
            A builder and traveller from China, now based in Adelaide — making
            small digital tools, collecting places, and keeping a public record
            of the things that hold my attention.
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
            Dentistry is one important room in that wider life: a discipline I am
            studying seriously, and one that has taught me patience, care, and the
            value of getting the small things right. Outside it, I&apos;m usually
            reading, building, travelling, or looking for the next blue hour.
          </p>
        </div>
      </div>
    </LegacyPageShell>
  );
}

export function MomentsPage() {
  const items = [
    {
      title: 'Adelaide',
      copy: 'New Year’s Eve fireworks, Morialta stone, and the quieter rhythm of a city becoming home.',
      artwork: galleryArtwork.adelaide,
      href: '/notes/adelaide',
    },
    {
      title: 'Melbourne',
      copy: 'A figure at St Kilda and a framed view from the Dandenong Ranges — two ways of holding the city’s edges.',
      artwork: galleryArtwork.melbourne,
      href: '/notes/melbourne',
    },
    {
      title: 'Shanghai',
      copy: 'One costumed performer held beneath magenta and blue stage lights at Shanghai Disney Resort.',
      artwork: galleryArtwork.shanghai,
      href: '/notes/shanghai-memories',
    },
    {
      title: 'Beijing',
      copy: 'Universal Beijing Resort, then Tiananmen Square at dusk across two packed July days.',
      artwork: galleryArtwork.beijing,
      href: '/notes/beijing',
    },
    {
      title: 'Cairns',
      copy: 'Barron Gorge, Great Barrier Reef water, and three warm July days in tropical Queensland.',
      artwork: galleryArtwork.cairns,
      href: '/notes/cairns',
    },
    {
      title: 'Great Ocean Road',
      copy: 'Layered limestone, broken cloud, and an open horizon farther along the same coast.',
      artwork: galleryArtwork.greatOceanRoad,
      href: '/notes/great-ocean-road',
    },
    {
      title: 'Sydney',
      copy: 'University buildings, harbour light, and an early chapter of life in Australia.',
      artwork: galleryArtwork.sydney,
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
      <div className={styles.momentsGrid}>
        {items.map((item, index) => (
          <Link
            href={item.href}
            key={item.title}
            className={`${styles.momentCard} ${index < 2 ? styles.momentCardLarge : ''}`}
          >
            <GalleryPicture
              artwork={item.artwork}
              className={styles.momentPicture}
              sizes="(max-width: 760px) calc(100vw - 64px), (max-width: 1200px) 50vw, 560px"
              priority={index === 0}
            />
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
    title: note.localTitle ?? note.title,
    excerpt: note.localExcerpt ?? note.excerpt,
    lang: note.localTitle ? note.localLang : undefined,
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
      copy="Field notes from places, projects, and the ordinary days that are worth keeping."
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
            <div className={styles.noteMain} lang={note.lang}>
              <h2>{note.title}</h2>
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
  items,
}: {
  title: string;
  items: MediaItem[];
}) {
  return (
    <section className={styles.shelf}>
      <h2>{title}</h2>
      <div className={styles.mediaGrid}>
        {items.map((item) => {
          const content = (
            <>
              <div className={styles.mediaCover}>
                <img
                  src={item.coverImage}
                  alt={`${item.title} cover`}
                  width={800}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3>{item.title}</h3>
              <p className={styles.mediaCreator}>{item.creator}</p>
              <p className={styles.mediaMeta}>
                <span>{item.year}</span>
                {item.rating != null && (
                  <span aria-label={`${item.rating} out of 5 stars`}>
                    <span aria-hidden="true">★</span> {item.rating}/5
                  </span>
                )}
              </p>
              {item.comment && (
                <p className={styles.mediaComment}>&quot;{item.comment}&quot;</p>
              )}
            </>
          );

          return (
            <article
              className={`${styles.mediaCard} ${item.url ? styles.mediaCardLinked : ''}`}
              key={item.title}
            >
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div className={styles.mediaEntry}>{content}</div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function LibraryPage() {
  return (
    <LegacyPageShell
      kicker="20:19 · Afterlight / Library"
      title="Digital Bookshelf & Cinema."
      copy="A collection of books I've read and movies I've watched recently."
      scene="afterlight"
      returnHref="/#afterlight"
    >
      <div className={styles.library}>
        <MediaShelf title="Books" items={books} />
        <MediaShelf title="Movies" items={movies} />
      </div>
    </LegacyPageShell>
  );
}

export function ContactPage() {
  return (
    <LegacyPageShell
      kicker="19:31 · Bearing / Contact"
      title="Let's keep in touch."
      copy="For study chats, food recommendations, collaborations, or simply saying hello."
      scene="lighthouse"
      returnHref="/#bearing"
    >
      <div className={styles.contact}>
        <p>Feel free to drop me an email:</p>
        <a href={`mailto:${site.email}`}>
          {site.email}
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </LegacyPageShell>
  );
}
