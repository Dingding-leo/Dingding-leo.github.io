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

const notes = [
  {
    title: '魔都漫游：一半是烟火，一半是赛博霓虹',
    excerpt: '上海，一座古典与魔幻赛博朋克交织的城市。这是我的旅途纪实。',
    label: 'Shanghai',
    time: '5 min read',
    href: '/notes/shanghai-memories',
  },
  {
    title: 'The Great Ocean Road',
    excerpt: 'Salt air, rainforest, long roads, and a landscape that asks you to slow down.',
    label: 'Victoria',
    time: '4 min read',
    href: '/notes/great-ocean-road',
  },
  {
    title: 'A First Sydney Chapter',
    excerpt: 'Sandstone quadrangles, harbour light, and an early memory of life in Australia.',
    label: 'Sydney',
    time: '4 min read',
    href: '/notes/sydney',
  },
  {
    title: 'Adelaide, Slowly',
    excerpt: 'Riverbank walks, campus routines, and a city that leaves enough room to grow.',
    label: 'Adelaide',
    time: '3 min read',
    href: '/notes/adelaide',
  },
  {
    title: 'Melbourne in Two Moods',
    excerpt: 'St Kilda sunsets, Dandenong mornings, and a city that keeps changing pace.',
    label: 'Melbourne',
    time: '3 min read',
    href: '/notes/melbourne',
  },
  {
    title: 'Forty-Eight Hours in Beijing',
    excerpt: 'A quick chapter of big landmarks, loud theme parks, and late-evening light.',
    label: 'Beijing',
    time: '3 min read',
    href: '/notes/beijing',
  },
  {
    title: 'Warm Days in Cairns',
    excerpt: 'Barron Gorge, marina mornings, and a winter week that felt like summer.',
    label: 'Cairns',
    time: '3 min read',
    href: '/notes/cairns',
  },
];

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
            <div className="note-main">
              <h2>{note.title}</h2>
              <p>{note.excerpt}</p>
            </div>
            <div className="note-meta">
              <span>{note.label}</span>
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

export function NowPage() {
  return (
    <Wrap
      kicker="Now / 05"
      title="What I&apos;m doing now."
      copy="A current snapshot, updated as the season changes."
    >
      <div className="now-card legacy-now">
        <div className="now-updated">Last updated: July 2026</div>
        <ul>
          <li>
            <BookOpen size={18} /> Studying dentistry and preparing for clinical
            rotations
          </li>
          <li>
            <PenLine size={18} /> Shipping and refining KnightClub and
            ScholarBank
          </li>
          <li>
            <Tags size={18} /> Organising GitHub and documenting useful projects
          </li>
          <li>
            <MapPin size={18} /> Reading about systems thinking,
            decision-making, and compounding
          </li>
        </ul>
      </div>
      <div className="legacy-bottom-grid">
        <div>
          <span className="eyebrow">A small note</span>
          <p className="legacy-lead">
            The current priority is simple: learn properly, make useful things,
            and keep a life outside the screen.
          </p>
        </div>
        <a className="button" href="/#contact">
          Say hello <ArrowUpRight size={16} />
        </a>
      </div>
    </Wrap>
  );
}
