import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  Github,
} from 'lucide-react';
import {
  BlueHourHero,
  type BlueHourScene,
} from '@/components/BlueHourJumpShell';
import jumpStyles from '@/components/BlueHourJumpShell.module.css';
import { Nav } from '@/components/Nav';
import { books, movies } from '@/config/media';
import { notes as allNotes } from '@/config/notes';
import { projects, site, type Project } from '@/config/site';
import styles from './LegacyPages.module.css';

function Wrap({
  children,
  title,
  kicker,
  copy,
  scene,
}: {
  children: React.ReactNode;
  title: string;
  kicker: string;
  copy: string;
  scene: BlueHourScene;
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
          <a href="/">
            Return to the living space <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export function AboutPage() {
  return (
    <Wrap
      kicker="About / 01"
      title="A public notebook, still in progress."
      copy="A little more context about the person behind the notes, projects, and experiments."
      scene="afterlight"
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
    </Wrap>
  );
}

export function MomentsPage() {
  const items = [
    {
      title: 'Adelaide',
      copy: 'Riverbank walks, campus routines, and the quiet pulse of a city that gives you room to grow.',
      image: '/assets/gallery/adelaide-riverbank_thumb.jpg',
      href: '/notes/adelaide',
    },
    {
      title: 'Melbourne',
      copy: 'St Kilda sunsets and Dandenong mornings. A second city that always has something new.',
      image: '/assets/gallery/melbourne-stkilda_thumb.jpg',
      href: '/notes/melbourne',
    },
    {
      title: 'Shanghai',
      copy: 'Disney castle at dusk, then lost in the streets. 魔都 hits different at night.',
      image: '/assets/gallery/shanghai-disney_thumb.jpg',
      href: '/notes/shanghai-memories',
    },
    {
      title: 'Beijing',
      copy: 'Universal Studios at full volume, Tiananmen at dusk. 48 hours that felt like a week.',
      image: '/assets/gallery/beijing-universal_thumb.jpg',
      href: '/notes/beijing',
    },
    {
      title: 'Cairns',
      copy: 'Barron Gorge roaring, marina mornings, and the kind of warmth you forget exists in July.',
      image: '/assets/gallery/cairns-barron_thumb.jpg',
      href: '/notes/cairns',
    },
    {
      title: 'Great Ocean Road',
      copy: 'Twelve Apostles at the edge of summer. One road, two Australias, no rush.',
      image: '/assets/gallery/great-ocean-road_thumb.jpg',
      href: '/notes/great-ocean-road',
    },
    {
      title: 'Sydney',
      copy: 'October 2022. Sandstone quadrangles, harbour light, and my first real Australian chapter.',
      image: '/assets/gallery/sydney-usyd_thumb.jpg',
      href: '/notes/sydney',
    },
  ];

  return (
    <Wrap
      kicker="Moments / 02"
      title="A few things worth remembering."
      copy="Places I've been, things I've seen, and the small moments that stay with you."
      scene="tide"
    >
      <div className={styles.momentsGrid}>
        {items.map((item, index) => (
          <a
            href={item.href}
            key={item.title}
            className={`${styles.momentCard} ${index < 2 ? styles.momentCardLarge : ''}`}
          >
            <img
              src={item.image}
              alt={item.title}
              width={900}
              height={675}
              loading={index < 2 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : undefined}
              decoding="async"
            />
            <div className={styles.momentCopy}>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </div>
            <ArrowUpRight size={24} aria-hidden="true" />
          </a>
        ))}
      </div>
    </Wrap>
  );
}

const optimizedProjectArtwork: Record<string, string> = {
  KnightClub: 'knightclub-editorial',
  ScholarBank: 'scholarbank',
  Denki: 'denki',
};

function ProjectArtwork({ project }: { project: Project }) {
  const optimizedName = optimizedProjectArtwork[project.title];

  if (!optimizedName) {
    return (
      <img
        src={project.image}
        alt={project.imageAlt}
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`/assets/projects/optimized/${optimizedName}-640.avif 640w, /assets/projects/optimized/${optimizedName}-960.avif 960w`}
        sizes="(max-width: 760px) 100vw, 50vw"
      />
      <source
        type="image/webp"
        srcSet={`/assets/projects/optimized/${optimizedName}-640.webp 640w, /assets/projects/optimized/${optimizedName}-960.webp 960w`}
        sizes="(max-width: 760px) 100vw, 50vw"
      />
      <img
        src={project.image}
        alt={project.imageAlt}
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const primaryUrl = project.liveUrl || project.repoUrl;
  const artwork = <ProjectArtwork project={project} />;

  return (
    <article
      className={`${styles.projectCard} ${project.featured ? styles.projectFeatured : ''}`}
    >
      {primaryUrl ? (
        <a
          className={styles.projectMedia}
          href={primaryUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title}`}
        >
          {artwork}
        </a>
      ) : (
        <div className={styles.projectMedia}>{artwork}</div>
      )}
      <div className={styles.projectBody}>
        <div className={styles.projectStatus}>{project.status}</div>
        <h2>{project.title}</h2>
        <p className={styles.projectTagline}>{project.tagline}</p>
        <p>{project.description}</p>
        <div className={styles.projectTags}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className={styles.projectActions}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              Live demo <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              GitHub <Github size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsPage() {
  return (
    <Wrap
      kicker="Projects / 03"
      title="Useful things, built and shipped."
      copy="A growing collection of learning tools, local-first software, and practical experiments shaped by real interests."
      scene="mountain"
    >
      <div className={styles.projectSummary} aria-label="Project summary">
        <span>{projects.length} projects</span>
        <span>{projects.filter((project) => project.liveUrl).length} live products</span>
        <span>Built across web and desktop</span>
      </div>
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <ProjectCard project={project} key={project.title} />
        ))}
      </div>
    </Wrap>
  );
}

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
  }));

export function NotesPage() {
  return (
    <Wrap
      kicker="Notes / 04"
      title="Things I&apos;ve been thinking about."
      copy="Field notes from places, projects, and the ordinary days that are worth keeping."
      scene="waterfall"
    >
      <div className={styles.notesList}>
        {notes.map((note, index) => (
          <a className={styles.note} href={note.href} key={note.title}>
            <div className={styles.noteIndex}>
              {String(index + 1).padStart(2, '0')}
            </div>
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
          </a>
        ))}
      </div>
    </Wrap>
  );
}

function MediaShelf({
  title,
  items,
}: {
  title: string;
  items: typeof books;
}) {
  return (
    <section className={styles.shelf}>
      <h2>{title}</h2>
      <div className={styles.mediaGrid}>
        {items.map((item) => (
          <article className={styles.mediaCard} key={item.title}>
            <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
              <div className={styles.mediaCover}>
                <img
                  src={item.coverImage}
                  alt={item.title}
                  width={800}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3>{item.title}</h3>
              <p className={styles.mediaCreator}>{item.creator}</p>
              {item.comment && (
                <p className={styles.mediaComment}>&quot;{item.comment}&quot;</p>
              )}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LibraryPage() {
  return (
    <Wrap
      kicker="Library / 05"
      title="Digital Bookshelf & Cinema."
      copy="A collection of books I've read and movies I've watched recently."
      scene="afterlight"
    >
      <div className={styles.library}>
        <MediaShelf title="Books" items={books} />
        <MediaShelf title="Movies" items={movies} />
      </div>
    </Wrap>
  );
}

export function ContactPage() {
  return (
    <Wrap
      kicker="Say hello / 11"
      title="Let's keep in touch."
      copy="For study chats, food recommendations, collaborations, or simply saying hello."
      scene="lighthouse"
    >
      <div className={styles.contact}>
        <p>Feel free to drop me an email:</p>
        <a href={`mailto:${site.email}`}>
          {site.email}
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </Wrap>
  );
}
