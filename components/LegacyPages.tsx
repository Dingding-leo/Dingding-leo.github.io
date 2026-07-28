'use client';

import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  ExternalLink,
  Github,
  MapPin,
  PenLine,
  Star,
  Tags,
} from 'lucide-react';
import { Nav } from '@/components/Site';
import { projects, type Project } from '@/config/site';
import { notes as allNotes } from '@/config/notes';
import { books, movies } from '@/config/media';

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function Wrap({
  children,
  title,
  kicker,
  copy,
}: {
  children: React.ReactNode;
  title: string;
  kicker: string;
  copy: string;
}) {
  return (
    <>
      <Nav />
      <main id="main-content" className="legacy-page">
        <section className="legacy-hero">
          <div className="container">
            <motion.p
              className="eyebrow"
              initial="hidden"
              animate="show"
              variants={reveal}
            >
              {kicker}
            </motion.p>
            <motion.h1 initial="hidden" animate="show" variants={reveal}>
              {title}
            </motion.h1>
            <motion.p
              className="lede"
              initial="hidden"
              animate="show"
              variants={reveal}
            >
              {copy}
            </motion.p>
          </div>
        </section>
        <div className="container legacy-content">{children}</div>
      </main>
      <footer className="legacy-footer">
        <div className="container">
          <span>© 2026 Austin Liu</span>
          <a href="/">
            Return to the living space <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
    </>
  );
}

export function AboutPage() {
  return (
    <Wrap
      kicker="About / 01"
      title="A public notebook, still in progress."
      copy="A little more context about the person behind the notes, projects, and experiments."
    >
      <div className="legacy-split">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={reveal}
        >
          <p className="legacy-lead">
            I&apos;m Austin — a dental student at university with a deep interest
            in technology, artificial intelligence, and quantitative systems.
            I believe the best way to learn is to build, and the best way to
            build is to ship.
          </p>
          <p>
            This site is my public notebook. It&apos;s not a portfolio designed to
            impress — it&apos;s a working laboratory where I document what I&apos;m
            learning, what I&apos;m building, and what I&apos;m thinking about.
          </p>
        </motion.div>
        <div className="legacy-stats">
          <Stat number={String(projects.length).padStart(2, '0')} label="Listed projects" />
          <Stat number="05" label="Fields of study" />
          <Stat number="∞" label="Things to learn" />
        </div>
      </div>
      <div className="legacy-callout">
        <Star size={18} />
        <span>
          Precision in dentistry, curiosity in technology, and enough room for
          ordinary life.
        </span>
      </div>
    </Wrap>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      className="stat-card"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={reveal}
    >
      <strong>{number}</strong>
      <span>{label}</span>
    </motion.div>
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
    >
      <div className="legacy-gallery">
        {items.map((item, index) => (
          <motion.a
            className={`legacy-photo photo-${index}`}
            href={item.href}
            key={item.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={reveal}
          >
            <img
              src={item.image}
              alt={item.title}
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div>
              <span className="eyebrow">Moment / 0{index + 1}</span>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </motion.a>
        ))}
      </div>
    </Wrap>
  );
}

export function ProjectsPage() {
  return (
    <Wrap
      kicker="Projects / 03"
      title="Useful things, built and shipped."
      copy="A growing collection of learning tools, local-first software, and practical experiments shaped by real interests."
    >
      <div className="project-summary" aria-label="Project summary">
        <span>{projects.length} projects</span>
        <span>{projects.filter((project) => project.liveUrl).length} live products</span>
        <span>Built across web and desktop</span>
      </div>
      <div className="legacy-projects">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.title} />
        ))}
      </div>
    </Wrap>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const primaryUrl = project.liveUrl || project.repoUrl;
  const image = (
    <img
      src={project.image}
      alt={project.imageAlt}
      loading="lazy"
      decoding="async"
    />
  );

  return (
    <article
      className={`legacy-project ${project.featured ? 'project-featured' : ''}`}
    >
      {primaryUrl ? (
        <a
          className="project-image"
          href={primaryUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title}`}
        >
          {image}
        </a>
      ) : (
        <div className="project-image">{image}</div>
      )}
      <div className="project-body">
        <div className="project-status">{project.status}</div>
        <h2 className="project-title">{project.title}</h2>
        <p className="project-tagline">{project.tagline}</p>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="project-actions">
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

const notes = allNotes.map((note) => ({
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
    >
      <div className="notes-list">
        {notes.map((note, index) => (
          <motion.a
            className="legacy-note"
            href={note.href}
            key={note.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={reveal}
          >
            <div className="note-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="note-main" lang={note.lang}>
              <h2>{note.title}</h2>
              <p>{note.excerpt}</p>
            </div>
            <div className="note-meta">
              <span>{note.label}</span>
              <span>{note.date}</span>
              <span>
                <Clock size={13} /> {note.time}
              </span>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </motion.a>
        ))}
      </div>
    </Wrap>
  );
}

export function LibraryPage() {
  return (
    <Wrap
      kicker="Library / 05"
      title="Digital Bookshelf & Cinema."
      copy="A collection of books I've read and movies I've watched recently."
    >
      <div className="mt-12 space-y-16">
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6">
            Books
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.title} className="flex flex-col group">
                <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none transition-transform duration-300 group-hover:-translate-y-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full" />
                </div>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                  {book.title}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  {book.creator}
                </p>
                {book.comment && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                    "{book.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6">
            Movies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div key={movie.title} className="flex flex-col group">
                <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none transition-transform duration-300 group-hover:-translate-y-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={movie.coverImage} alt={movie.title} className="object-cover w-full h-full" />
                </div>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                  {movie.title}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  {movie.creator}
                </p>
                {movie.comment && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                    "{movie.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Wrap>
  );
}
