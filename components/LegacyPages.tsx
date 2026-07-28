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
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ staggerChildren: 0.15 }}
      >
        <motion.div 
          className="legacy-split"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="legacy-lead">
              A dentistry student who builds software. Born in China, studying in
              Australia. Currently exploring the intersection of design, code, and
              healthcare.
            </p>
            <div className="legacy-stats mt-10">
              <div className="stat-card">
                <span>Location</span>
                <strong>ADL</strong>
                <span className="text-[10px] text-zinc-400">South Australia</span>
              </div>
              <div className="stat-card">
                <span>Discipline</span>
                <strong>BDS</strong>
                <span className="text-[10px] text-zinc-400">Year 3 / Clinical</span>
              </div>
              <div className="stat-card">
                <span>Code</span>
                <strong>TS</strong>
                <span className="text-[10px] text-zinc-400">React / Next.js</span>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-6">
              My background is a bit unconventional. I spend half my week in the
              clinic learning how to restore teeth, and the other half in my code
              editor building tools I wish existed.
            </p>
            <p className="mb-6">
              I believe the most interesting work happens at the boundaries between
              disciplines. The precision and manual dexterity required in dentistry
              translates surprisingly well to the discipline of writing maintainable
              code and crafting intuitive interfaces.
            </p>
            <p>
              When I&apos;m not studying or coding, I&apos;m probably taking photos
              somewhere, reading design books, or trying to understand web3 primitives
              like Soroban smart contracts.
            </p>
          </div>
        </motion.div>
      </motion.div>
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
      <motion.div 
        className="legacy-gallery" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ staggerChildren: 0.15 }}
      >
        {items.map((item, i) => (
          <motion.a
            href={item.href}
            key={item.title}
            className={`legacy-photo ${i < 2 ? 'photo-' + (i + 1) : 'photo-sm'}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={item.image} alt={item.title} />
            <div>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </div>
            <ArrowUpRight size={24} aria-hidden="true" color="rgba(255,255,255,0.7)" />
          </motion.a>
        ))}
      </motion.div>
    </Wrap>
  );
}

export function ProjectsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <Wrap
      kicker="Projects / 03"
      title="Useful things, built and shipped."
      copy="A growing collection of learning tools, local-first software, and practical experiments shaped by real interests."
    >
      <motion.div variants={item} className="project-summary" aria-label="Project summary">
        <span>{projects.length} projects</span>
        <span>{projects.filter((project) => project.liveUrl).length} live products</span>
        <span>Built across web and desktop</span>
      </motion.div>
      <motion.div variants={container} initial="hidden" animate="show" className="legacy-projects">
        {projects.map((project) => (
          <motion.div variants={item} key={project.title}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
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
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <Wrap
      kicker="Notes / 04"
      title="Things I&apos;ve been thinking about."
      copy="Field notes from places, projects, and the ordinary days that are worth keeping."
    >
      <motion.div variants={container} initial="hidden" animate="show" className="notes-list">
        {notes.map((note, index) => (
          <motion.a
            className="legacy-note group"
            href={note.href}
            key={note.title}
            variants={item}
          >
            <div className="note-index group-hover:text-amber-600 transition-colors">{String(index + 1).padStart(2, '0')}</div>
            <div className="note-main group-hover:translate-x-2 transition-transform duration-300" lang={note.lang}>
              <h2>{note.title}</h2>
              <p>{note.excerpt}</p>
            </div>
            <div className="note-meta opacity-60 group-hover:opacity-100 transition-opacity">
              <span>{note.label}</span>
              <span>{note.date}</span>
              <span>
                <Clock size={13} /> {note.time}
              </span>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-amber-600" />
          </motion.a>
        ))}
      </motion.div>
    </Wrap>
  );
}export function LibraryPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <Wrap
      kicker="Library / 05"
      title="Digital Bookshelf & Cinema."
      copy="A collection of books I've read and movies I've watched recently."
    >
      <motion.div variants={container} initial="hidden" animate="show" className="mt-12 space-y-16">
        <section>
          <motion.h2 variants={item} className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6">
            Books
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <motion.div variants={item} key={book.title} className="flex flex-col group block">
                <a href={book.url || '#'} target="_blank" rel="noopener noreferrer" className="block relative focus:outline-none">
                  <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 mb-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(232,166,109,0.12)]">
                    <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" />
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-500">
                    {book.title}
                  </h3>
                  <p className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-1">
                    {book.creator}
                  </p>
                  {book.comment && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      "{book.comment}"
                    </p>
                  )}
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <motion.h2 variants={item} className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6">
            Movies
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <motion.div variants={item} key={movie.title} className="flex flex-col group block">
                <a href={movie.url || '#'} target="_blank" rel="noopener noreferrer" className="block relative focus:outline-none">
                  <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 mb-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(232,166,109,0.12)]">
                    <img src={movie.coverImage} alt={movie.title} className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" />
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-500">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-1">
                    {movie.creator}
                  </p>
                  {movie.comment && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      "{movie.comment}"
                    </p>
                  )}
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </Wrap>
  );
}

