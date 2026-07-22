'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ThemeProvider, useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Github,
  Heart,
  Leaf,
  MapPin,
  Menu,
  Moon,
  PenLine,
  Search,
  Sun,
  Utensils,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { projects, site, type NavItem } from '@/config/site';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}

const fade = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Container({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`container ${className}`}>{children}</div>;
}

function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fade}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="section-head">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {copy && <p className="lede">{copy}</p>}
    </div>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const label = mounted
    ? `Switch to ${isDark ? 'light' : 'dark'} theme`
    : 'Change colour theme';

  return (
    <button
      className="icon-button"
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

function LocalTime() {
  const [clock, setClock] = useState({ time: '', zone: '' });

  useEffect(() => {
    const tick = () => {
      const parts = new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Adelaide',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZoneName: 'short',
      }).formatToParts(new Date());
      const part = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((item) => item.type === type)?.value ?? '';

      setClock({
        time: `${part('hour')}:${part('minute')}`,
        zone: part('timeZoneName'),
      });
    };

    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span>
      {clock.time || '—'} <small>{clock.zone}</small>
    </span>
  );
}

function normalisePath(path: string) {
  if (path === '/') return '/';
  return path.replace(/\/+$/, '');
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState('');
  const [onLight, setOnLight] = useState(false);
  const [hash, setHash] = useState('');
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closePalette = useCallback((restoreFocus = true) => {
    setPalette(false);
    setQuery('');
    if (restoreFocus) {
      window.requestAnimationFrame(() => searchButtonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPalette(true);
      }
      if (event.key === 'Escape') {
        if (palette) closePalette();
        if (open) {
          setOpen(false);
          window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        }
      }
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);
    window.addEventListener('popstate', updateHash);
    window.addEventListener('keydown', onKeyDown);

    const sections = [...document.querySelectorAll('.section-soft')];
    const observer = new IntersectionObserver(
      (entries) => setOnLight(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: '-20% 0px -65% 0px' },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('hashchange', updateHash);
      window.removeEventListener('popstate', updateHash);
      window.removeEventListener('keydown', onKeyDown);
      observer.disconnect();
    };
  }, [closePalette, open, palette]);

  useEffect(() => {
    if (!open && !palette) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, palette]);

  const filteredNav = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return site.nav;
    return site.nav.filter((item) => item.label.toLowerCase().includes(value));
  }, [query]);

  const isActive = (item: NavItem) => {
    const currentPath = normalisePath(pathname || '/');
    if (item.href === '/#contact') {
      return currentPath === '/' && hash === '#contact';
    }
    if (item.href === '/') {
      return currentPath === '/' && hash !== '#contact';
    }
    return currentPath === normalisePath(item.href);
  };

  const navigate = (item: NavItem) => {
    closePalette(false);
    window.location.href = item.href;
  };

  const trapDialogFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && document.activeElement?.tagName === 'INPUT') {
      const firstResult = filteredNav[0];
      if (firstResult) navigate(firstResult);
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        'input, a[href], button:not([disabled])',
      ),
    ];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className={`nav ${onLight ? 'on-light' : ''}`}>
        <a href="/" className="brand" aria-label="Austin Liu — home">
          AL<span>•</span>
        </a>
        <nav aria-label="Primary navigation">
          {site.nav.map((item) => (
            <a
              className={isActive(item) ? 'active' : ''}
              key={item.label}
              href={item.href}
              aria-current={isActive(item) ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            ref={searchButtonRef}
            className="command"
            type="button"
            onClick={() => setPalette(true)}
            aria-haspopup="dialog"
            aria-expanded={palette}
          >
            <Search size={15} aria-hidden="true" />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            className="icon-button mobile-only"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {site.nav.map((item) => (
              <a
                className={isActive(item) ? 'active' : ''}
                onClick={() => setOpen(false)}
                key={item.label}
                href={item.href}
                aria-current={isActive(item) ? 'page' : undefined}
              >
                {item.label}
                <ChevronRight size={17} aria-hidden="true" />
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {palette && (
          <motion.div
            className="palette-backdrop"
            onClick={() => closePalette()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="palette"
              role="dialog"
              aria-modal="true"
              aria-label="Search site pages"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={trapDialogFocus}
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
            >
              <div className="palette-search">
                <Search size={18} aria-hidden="true" />
                <label className="sr-only" htmlFor="site-search">
                  Search pages
                </label>
                <input
                  id="site-search"
                  autoFocus
                  value={query}
                  placeholder="Jump to a page..."
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button
                  className="palette-close"
                  type="button"
                  onClick={() => closePalette()}
                  aria-label="Close search"
                >
                  ESC
                </button>
              </div>
              <div className="palette-results" aria-live="polite">
                {filteredNav.map((item) => (
                  <a
                    className={isActive(item) ? 'active' : ''}
                    key={item.label}
                    href={item.href}
                    onClick={() => closePalette(false)}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ))}
                {!filteredNav.length && (
                  <p className="palette-empty">No matching page. Try “Projects”.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Button({
  children,
  href = '#life',
  secondary = false,
}: {
  children: React.ReactNode;
  href?: string;
  secondary?: boolean;
}) {
  return (
    <a className={`button ${secondary ? 'secondary' : ''}`} href={href}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-orb orb-one" />
      <div className="hero-orb orb-two" />
      <Container>
        <div className="hero-grid">
          <div>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Personal space / 2026
            </motion.p>
            <motion.h1
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, delay: 0.15 },
                },
              }}
            >
              Austin
              <br />
              <em>Liu</em>
            </motion.h1>
            <motion.p
              className="hero-copy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              A personal space for dental school, daily life, growth, and the
              useful things I build along the way.
            </motion.p>
            <div className="hero-actions">
              <Button>Explore my life</Button>
              <Button secondary href="/projects">
                See my projects
              </Button>
            </div>
          </div>
          <div className="hero-side">
            <div className="status">
              <span className="pulse" /> Currently studying dentistry in
              Adelaide
            </div>
            <div className="time-card">
              <span className="eyebrow">Local time</span>
              <strong>
                <LocalTime />
              </strong>
              <span className="muted">
                A quiet afternoon, probably with coffee.
              </span>
            </div>
            <div className="floating-note note-a">
              <BookOpen size={15} />
              <span>
                Study notes<small>in progress</small>
              </span>
            </div>
            <div className="floating-note note-b">
              <MapPin size={15} />
              <span>
                Adelaide evenings<small>somewhere nearby</small>
              </span>
            </div>
          </div>
        </div>
        <div className="scroll-cue">
          <ArrowDown size={15} />
          <span>Scroll slowly</span>
        </div>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="01 / About Austin"
            title="A student life, in progress."
            copy="I’m Austin — studying dentistry in Adelaide, building better habits, collecting small moments, and slowly shaping the kind of life I want to live."
          />
        </Reveal>
        <div className="about-grid">
          <Reveal>
            <p className="big-copy">
              Most days are a mix of lectures, notes, food, walks, friends,
              and trying to leave a little space for curiosity. Dentistry gives
              me precision, patience, and discipline. Life keeps reminding me
              that care is also about the small things.
            </p>
            <p className="muted">
              This site is a living record rather than a polished résumé — a
              place for the ideas, routines, experiments and ordinary days I
              want to remember.
            </p>
          </Reveal>
          <Reveal className="identity-card">
            <div className="portrait">
              <span>AL</span>
              <div className="portrait-grain" />
            </div>
            <div className="identity-meta">
              <span className="eyebrow">Based in</span>
              <strong>Adelaide, Australia</strong>
              <span className="muted">
                Dental student · building a life with intention
              </span>
            </div>
          </Reveal>
        </div>
        <div className="chips">
          {['coffee', 'notes', 'walks', 'study', 'friends', 'Adelaide'].map(
            (item) => (
              <span key={item}>✦ {item}</span>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}

type LifeItem = {
  title: string;
  copy: string;
  icon: LucideIcon;
  size?: string;
  href: string;
};

const bento: LifeItem[] = [
  {
    title: 'Currently studying',
    copy: 'Dentistry, one careful layer at a time.',
    icon: BookOpen,
    size: 'wide',
    href: '/about',
  },
  {
    title: 'Adelaide life',
    copy: 'Local days, long-term thoughts.',
    icon: MapPin,
    size: 'tall',
    href: '/moments',
  },
  {
    title: 'Study desk',
    copy: 'Notes open. Phone away. Mostly.',
    icon: PenLine,
    href: '/notes',
  },
  {
    title: 'Food spots',
    copy: 'Good food is better shared.',
    icon: Utensils,
    href: '/moments',
  },
  {
    title: 'Weekend reset',
    copy: 'A little order makes room for more.',
    icon: Leaf,
    size: 'wide',
    href: '/now',
  },
  {
    title: 'Friends & moments',
    copy: 'The best plans are rarely over-planned.',
    icon: Users,
    href: '/moments',
  },
];

function Life() {
  return (
    <section id="life" className="section section-dark">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="02 / Life dashboard"
            title="The things that make up a week."
            copy="A bento-sized view of the current season: study, people, places, rituals, and the bits in between."
          />
        </Reveal>
        <div className="bento">
          {bento.map(({ title, copy, icon: Icon, size = '', href }, index) => (
            <Reveal key={title} className={`bento-card-wrap ${size}`}>
              <a className={`bento-card ${size}`} href={href}>
                <div className="card-top">
                  <Icon size={19} aria-hidden="true" />
                  <span>0{index + 1}</span>
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <ArrowUpRight className="card-arrow" size={18} />
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Journey() {
  const items = [
    ['Starting the path', 'Finding out that the interesting part is often the detail.'],
    ['Learning the science', 'Making room for questions, repetition, and patience.'],
    ['Building precision', 'Small improvements are still improvements.'],
    ['Practising communication', 'Learning to be clear, calm, and present.'],
    ['Balancing study and life', 'A full life makes better study possible.'],
    [
      'Looking forward',
      'Keeping future clinical practice in view, without rushing there.',
    ],
  ];

  return (
    <section id="journey" className="section">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="03 / Dental school"
            title="Learning the craft, staying human."
            copy="A student perspective on the path so far — professional enough to take seriously, personal enough to feel real."
          />
        </Reveal>
        <div className="timeline">
          {items.map(([title, copy], index) => (
            <Reveal key={title}>
              <div className="timeline-item">
                <span className="timeline-index">0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <span className="timeline-dot" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Adelaide() {
  return (
    <section id="adelaide" className="section adelaide">
      <Container>
        <div className="adelaide-grid">
          <Reveal>
            <p className="eyebrow">04 / Adelaide life</p>
            <h2>
              A slower city
              <br />
              <em>with room to grow.</em>
            </h2>
            <p className="lede">
              Quiet evenings. Campus days. Coffee after study. Food with
              friends. Living locally while thinking long-term.
            </p>
            <Button href="#contact">Share a recommendation</Button>
          </Reveal>
          <Reveal className="city-card">
            <div className="city-map">
              <div className="map-line l1" />
              <div className="map-line l2" />
              <div className="map-line l3" />
              <MapPin className="map-pin" size={28} />
              <span className="map-label">ADELAIDE / SA</span>
            </div>
            <div className="city-footer">
              <span>Local notes</span>
              <strong>Currently exploring</strong>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Rhythm() {
  const days = [
    ['07:30', 'Morning reset', 'Coffee, water, a little sunlight.'],
    ['09:00', 'Lectures / study', 'Showing up is half the rhythm.'],
    ['12:30', 'Food & friends', 'A proper break is part of the plan.'],
    ['14:00', 'Deep work', 'Notes, questions, repeat.'],
    ['18:30', 'Evening walk', 'A change of pace, not a finish line.'],
    ['21:30', 'Reflection', 'Put tomorrow somewhere gentle.'],
  ];

  return (
    <section id="rhythm" className="section section-soft">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="05 / A day in my life"
            title="A rhythm, not a rulebook."
            copy="The shape of a good day is flexible. These are the anchors I keep returning to."
          />
        </Reveal>
        <div className="day-grid">
          {days.map(([time, title, copy]) => (
            <Reveal key={time}>
              <div className="day-card">
                <span className="mono">{time}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <ChevronRight size={17} aria-hidden="true" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const studyViews = {
  'Weekly rhythm': {
    rows: [
      ['Deep work blocks', 72],
      ['Dental notes', 58],
      ['Revision cycles', 44],
      ['Life outside study', 81],
    ],
    note: 'The goal is to return to the rhythm.',
  },
  'Revision cycles': {
    rows: [
      ['Active recall', 76],
      ['Error review', 62],
      ['Topics revisited', 69],
      ['Spaced follow-ups', 54],
    ],
    note: 'Revisit the difficult parts before they become distant.',
  },
  'Wellness balance': {
    rows: [
      ['Sleep routine', 68],
      ['Movement', 74],
      ['Proper breaks', 82],
      ['Unscheduled time', 61],
    ],
    note: 'Energy is part of the study system, not a reward after it.',
  },
};

type StudyTab = keyof typeof studyViews;

function Study() {
  const [tab, setTab] = useState<StudyTab>('Weekly rhythm');
  const view = studyViews[tab];

  return (
    <section id="study" className="section">
      <Container>
        <div className="study-grid">
          <Reveal>
            <SectionHeader
              kicker="06 / Study system"
              title="Consistency over perfection."
              copy="A flexible system for doing the work, remembering what matters, and keeping enough energy for the rest of life."
            />
            <div className="tabs" role="tablist" aria-label="Study system views">
              {(Object.keys(studyViews) as StudyTab[]).map((item) => (
                <button
                  className={tab === item ? 'active' : ''}
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={tab === item}
                  onClick={() => setTab(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal className="study-card">
            <div className="study-head">
              <span className="eyebrow">A flexible view / {tab}</span>
              <Zap size={18} aria-hidden="true" />
            </div>
            {view.rows.map(([label, value]) => (
              <div className="progress-row" key={label}>
                <div>
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <div
                  className="progress"
                  role="progressbar"
                  aria-label={label as string}
                  aria-valuenow={value as number}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
            <p className="study-note">
              <Check size={15} aria-hidden="true" /> {view.note}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Interests() {
  return (
    <section className="section section-dark">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="07 / Interests"
            title="Curious about a lot of things."
          />
        </Reveal>
        <div className="interest-grid">
          {site.interests.map(([title, copy], index) => (
            <Reveal key={title}>
              <div className="interest">
                <span className="interest-num">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeaturedProjects() {
  const featured = projects.filter((project) => project.featured);

  return (
    <section id="featured-projects" className="section featured-projects">
      <Container>
        <Reveal>
          <div className="featured-projects-head">
            <SectionHeader
              kicker="08 / Featured projects"
              title="Useful things, shipped with care."
              copy="Two recent builds that turn personal interests into focused, practical products."
            />
            <a className="text-link" href="/projects">
              View all projects <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
        <div className="featured-project-grid">
          {featured.map((project) => (
            <Reveal key={project.title}>
              <article className="featured-project-card">
                <a
                  className="featured-project-image"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${project.title} live demo`}
                >
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{project.status}</span>
                </a>
                <div className="featured-project-copy">
                  <p className="eyebrow">{project.tagline}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="featured-project-actions">
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
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const galleryItems = [
  {
    title: 'Shanghai lights',
    image: '/assets/gallery/shanghai-disney_thumb.jpg',
    href: '/notes/shanghai-memories',
  },
  {
    title: 'Great Ocean Road',
    image: '/assets/gallery/great-ocean-road_thumb.jpg',
    href: '/notes/great-ocean-road',
  },
  {
    title: 'Melbourne escape',
    image: '/assets/gallery/melbourne-dandenong_thumb.jpg',
    href: '/notes/melbourne',
  },
  {
    title: 'Otway rainforest',
    image: '/assets/gallery/gor-otway_thumb.jpg',
    href: '/notes/great-ocean-road',
  },
  {
    title: 'Cairns waterfall',
    image: '/assets/gallery/cairns-barron_thumb.jpg',
    href: '/notes/cairns',
  },
  {
    title: 'Tiananmen Square',
    image: '/assets/gallery/beijing-tiananmen_thumb.jpg',
    href: '/notes/beijing',
  },
];

function Gallery() {
  return (
    <section id="gallery" className="section">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="09 / Moments"
            title="A few things worth keeping."
            copy="A gallery of the places I've been — real photos from real moments."
          />
        </Reveal>
        <div className="gallery">
          {galleryItems.map(({ title, image, href }, index) => (
            <Reveal key={`${title}-${index}`} className={`gallery-item g${index}`}>
              <a className="gallery-image" href={href}>
                <img src={image} alt={title} loading="lazy" decoding="async" />
                <div>
                  <span className="eyebrow">Moment / 0{index + 1}</span>
                  <h3>{title}</h3>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const journalItems = [
  {
    title: 'Shanghai Memories',
    copy: 'Classical streets, everyday warmth, and a city lit by cyberpunk neon.',
    href: '/notes/shanghai-memories',
    time: '5 min read',
  },
  {
    title: 'The Great Ocean Road',
    copy: 'A slow drive through salt air, rainforest, and the edge of summer.',
    href: '/notes/great-ocean-road',
    time: '4 min read',
  },
  {
    title: 'A First Sydney Chapter',
    copy: 'Sandstone quadrangles, harbour light, and an early Australian memory.',
    href: '/notes/sydney',
    time: '4 min read',
  },
];

function Journal() {
  return (
    <section id="journal" className="section section-soft">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="10 / Journal"
            title="Notes from the in-between."
            copy="Field notes from places, projects, and the ordinary days that are worth remembering."
          />
        </Reveal>
        <div className="journal-grid">
          {journalItems.map((item, index) => (
            <Reveal key={item.title}>
              <article className="journal-card">
                <div className="journal-meta">
                  <span>Note / 0{index + 1}</span>
                  <span>{item.time}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <a href={item.href}>
                  Read note <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="section contact">
      <Container>
        <Reveal>
          <div className="contact-card">
            <div>
              <p className="eyebrow">11 / Say hello</p>
              <h2>Let&apos;s keep in touch.</h2>
              <p className="lede">
                For study chats, food recommendations, collaborations, or
                simply saying hello.
              </p>
            </div>
            <div className="contact-actions">
              <a className="email" href={`mailto:${site.email}`}>
                {site.email}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <button className="copy" type="button" onClick={copyEmail}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
              </button>
              <div className="socials">
                <a
                  aria-label="Austin Liu on GitHub"
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={19} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
        <footer>
          <span>© 2026 Austin Liu</span>
          <span>
            Made with care in Adelaide <Heart size={13} />
          </span>
          <a href="#top">
            Back to top <ArrowUp size={14} />
          </a>
        </footer>
      </Container>
    </section>
  );
}

export function SitePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <About />
        <Life />
        <Journey />
        <Adelaide />
        <Rhythm />
        <Study />
        <Interests />
        <FeaturedProjects />
        <Gallery />
        <Journal />
        <Contact />
      </main>
    </>
  );
}
