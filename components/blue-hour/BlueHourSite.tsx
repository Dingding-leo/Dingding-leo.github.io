'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react';
import { projects, site } from '@/config/site';
import { notes } from '@/config/notes';
import { BlueHourArtifact } from '@/components/BlueHourArtifact';
import { ProjectDeck } from '@/components/ProjectDeck';
import { useBlueHourAudioContext } from './AudioExperience';
import styles from './BlueHourSite.module.css';

const MotionLink = motion.create(Link);

const scenes = [
  {
    id: 'bearing',
    time: '19:31',
    nav: 'Home',
    title: 'Bearing',
    image: 'lighthouse',
    alt: 'A lighthouse shining across a storm-darkened coastal headland',
    position: '54% 50%',
    mobilePosition: '59% 50%',
    weather: 'coast',
  },
  {
    id: 'opening',
    time: '19:43',
    nav: 'Projects',
    title: 'The Opening',
    image: 'mountain',
    alt: 'The final light touching a mountain above a mist-filled valley',
    position: '55% 50%',
    mobilePosition: '69% 50%',
    weather: 'mountain',
  },
  {
    id: 'tide',
    time: '19:55',
    nav: 'Moments',
    title: 'What the Tide Kept',
    image: 'tide',
    alt: 'A wooden boat resting in a tidal channel beneath a blue evening sky',
    position: '54% 50%',
    mobilePosition: '70% 50%',
    weather: 'estuary',
  },
  {
    id: 'water',
    time: '20:07',
    nav: 'Notes',
    title: 'Water in the Dark',
    image: 'waterfall',
    alt: 'A waterfall catching the last light inside a dark forest gorge',
    position: '52% 50%',
    mobilePosition: '62% 50%',
    weather: 'gorge',
  },
  {
    id: 'afterlight',
    time: '20:19',
    nav: 'About',
    title: 'One Window Left',
    image: 'afterlight',
    alt: 'A small stone cabin with one warm window on a blue moor',
    position: '54% 50%',
    mobilePosition: '71% 50%',
    weather: 'moor',
  },
] as const;

const places = [
  ['Adelaide', 'Riverbank light and Morialta stone', '/notes/adelaide'],
  ['Melbourne', 'St Kilda dusk and Dandenong mist', '/notes/melbourne'],
  ['Shanghai', 'A city remembered after dark', '/notes/shanghai-memories'],
  ['Beijing', 'Forty-eight hours at full volume', '/notes/beijing'],
  ['Cairns', 'Rainforest water and marina mornings', '/notes/cairns'],
  ['Great Ocean Road', 'Weather moving along the edge', '/notes/great-ocean-road'],
  ['Sydney', 'The first Australian chapter', '/notes/sydney'],
] as const;

const nowItems = [
  ['Building', 'Denki, ScholarBank, and quieter tools that respect attention.'],
  ['Learning', 'Clinical craft, systems thinking, and how good products earn trust.'],
  ['Exploring', 'Photography, systematic strategies, and cities on foot.'],
  ['Keeping', 'A little more room for books, music, friends, and unplanned days.'],
] as const;

function ScenePicture({
  scene,
  active,
  eager,
  transitioning,
}: {
  scene: (typeof scenes)[number];
  active: boolean;
  eager: boolean;
  transitioning: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const style = {
    '--scene-position': scene.position,
    '--scene-mobile-position': scene.mobilePosition,
    '--scene-preview': `url('/assets/blue-hour/${scene.image}-preview.webp')`,
  } as React.CSSProperties;

  return (
    <motion.div
      className={`${styles.sceneLayer} ${active ? styles.sceneLayerActive : ''} ${
        transitioning ? styles.sceneLayerTransitioning : ''
      }`}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 1.065 }}
      animate={{
        opacity: active ? 1 : 0,
        scale: active ? 1.025 : 1.065,
      }}
      transition={{
        duration: reducedMotion ? 0 : 1.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={style}
    >
      <picture>
        <source
          type="image/avif"
          srcSet={`/assets/blue-hour/${scene.image}-720.avif 720w, /assets/blue-hour/${scene.image}-1200.avif 1200w, /assets/blue-hour/${scene.image}-1672.avif 1672w`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`/assets/blue-hour/${scene.image}-720.webp 720w, /assets/blue-hour/${scene.image}-1200.webp 1200w, /assets/blue-hour/${scene.image}-1672.webp 1672w`}
          sizes="100vw"
        />
        <img
          src={`/assets/blue-hour/${scene.image}-1672.jpg`}
          srcSet={`/assets/blue-hour/${scene.image}-720.jpg 720w, /assets/blue-hour/${scene.image}-1200.jpg 1200w, /assets/blue-hour/${scene.image}-1672.jpg 1672w`}
          sizes="100vw"
          alt=""
          width={1672}
          height={941}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding={eager ? 'sync' : 'async'}
        />
      </picture>
    </motion.div>
  );
}

function Weather({ type }: { type: (typeof scenes)[number]['weather'] }) {
  return (
    <div className={`${styles.weather} ${styles[type]}`} aria-hidden="true">
      <span className={styles.weatherOne} />
      <span className={styles.weatherTwo} />
      <span className={styles.weatherThree} />
    </div>
  );
}

function SceneBackdrop({
  active,
  backdropRef,
}: {
  active: number;
  backdropRef: RefObject<HTMLDivElement | null>;
}) {
  const reducedMotion = useReducedMotion();
  const previousActive = useRef(active);
  const [renderedScenes, setRenderedScenes] = useState([active]);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const outgoing = previousActive.current;
    previousActive.current = active;

    if (outgoing === active) {
      setRenderedScenes([active]);
      return;
    }

    if (reducedMotion) {
      setRenderedScenes([active]);
      setTransitioning(false);
      return;
    }

    setRenderedScenes([outgoing, active]);
    setTransitioning(true);
    const settleTimer = window.setTimeout(() => {
      setRenderedScenes([active]);
      setTransitioning(false);
    }, 1650);

    return () => window.clearTimeout(settleTimer);
  }, [active, reducedMotion]);

  return (
    <div ref={backdropRef} className={styles.backdrop} aria-hidden="true">
      {renderedScenes.map((index) => (
        <ScenePicture
          key={scenes[index].id}
          scene={scenes[index]}
          active={index === active}
          eager={index === 0}
          transitioning={transitioning}
        />
      ))}
      <Weather type={scenes[active].weather} />
      <div className={styles.backdropTone} />
      <div className={styles.backdropGrain} />
    </div>
  );
}

function ChapterKicker({
  index,
  label,
}: {
  index: number;
  label: string;
}) {
  return (
    <div className={styles.chapterKicker}>
      <span>{String(index + 1).padStart(2, '0')}</span>
      <span className={styles.kickerLine} />
      <span>{label}</span>
    </div>
  );
}

function ChapterTitle({
  time,
  title,
  children,
}: {
  time: string;
  title: string;
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.header
      className={styles.chapterHeader}
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.38, once: true }}
      transition={{
        duration: reducedMotion ? 0 : 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <p className={styles.sceneTime}>
        <span>{time}</span>
        <span>{title}</span>
      </p>
      {children}
    </motion.header>
  );
}

function Header({
  active,
  mobileOpen,
  setMobileOpen,
}: {
  active: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNavigation = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopViewport = window.matchMedia('(min-width: 821px)');
    let closedForDesktop = false;
    const main = document.getElementById('main-content');
    const previousAriaHidden = main?.getAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    if (main) {
      main.inert = true;
      main.setAttribute('aria-hidden', 'true');
    }

    const firstLink = mobileNavigation.current?.querySelector<HTMLElement>('a');
    const focusTimer = window.setTimeout(() => firstLink?.focus(), 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = [
        menuButton.current,
        ...(mobileNavigation.current?.querySelectorAll<HTMLElement>('a, button') ?? []),
      ].filter(Boolean) as HTMLElement[];
      if (!focusable.length) return;

      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
      const nextIndex = event.shiftKey
        ? currentIndex <= 0
          ? focusable.length - 1
          : currentIndex - 1
        : currentIndex === focusable.length - 1
          ? 0
          : currentIndex + 1;
      event.preventDefault();
      focusable[nextIndex]?.focus();
    };
    const onViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closedForDesktop = true;
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    desktopViewport.addEventListener('change', onViewportChange);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      desktopViewport.removeEventListener('change', onViewportChange);
      document.body.style.overflow = previousOverflow;
      if (main) {
        main.inert = false;
        if (previousAriaHidden == null) main.removeAttribute('aria-hidden');
        else main.setAttribute('aria-hidden', previousAriaHidden);
      }
      if (closedForDesktop) {
        window.requestAnimationFrame(() => {
          document
            .querySelector<HTMLElement>(
              '[aria-label="Blue hour chapters"] [aria-current="location"]',
            )
            ?.focus();
        });
      } else {
        menuButton.current?.focus();
      }
    };
  }, [mobileOpen, setMobileOpen]);

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <header className={styles.nav}>
        <a className={styles.brand} href="#bearing" aria-label="Austin Liu — home">
          AL<span>·</span>
        </a>
        <div className={styles.nowPlaying} aria-live="polite">
          <span>{scenes[active].time}</span>
          <strong>{scenes[active].title}</strong>
        </div>
        <nav className={styles.desktopNav} aria-label="Blue hour chapters">
          {scenes.map((scene, index) => (
            <a
              key={scene.id}
              href={`#${scene.id}`}
              aria-current={index === active ? 'location' : undefined}
              className={index === active ? styles.activeNav : ''}
            >
              {scene.nav}
            </a>
          ))}
        </nav>
        <button
          ref={menuButton}
          className={styles.menuButton}
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          aria-controls="blue-hour-mobile-navigation"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            ref={mobileNavigation}
            id="blue-hour-mobile-navigation"
            className={styles.mobileNav}
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
          >
            {scenes.map((scene, index) => (
              <a
                href={`#${scene.id}`}
                key={scene.id}
                onClick={() => {
                  setMobileOpen(false);
                  window.requestAnimationFrame(() => {
                    document.getElementById(scene.id)?.focus({ preventScroll: true });
                  });
                }}
                aria-current={index === active ? 'location' : undefined}
              >
                <span>{scene.time}</span>
                <strong>{scene.nav}</strong>
                <ArrowRight size={16} />
              </a>
            ))}
            <div className={styles.mobileRouteLinks}>
              <Link href="/projects">All projects</Link>
              <Link href="/moments">All moments</Link>
              <Link href="/notes">All notes</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function ProgressRail({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <aside className={styles.progressRail} aria-label="Chapter progress">
      {scenes.map((scene, index) => (
        <button
          type="button"
          key={scene.id}
          className={index === active ? styles.progressActive : ''}
          onClick={() => onSelect(index)}
          aria-label={`Go to ${scene.nav}: ${scene.title}`}
          aria-current={index === active ? 'step' : undefined}
        >
          <span>{scene.time}</span>
          <i />
        </button>
      ))}
    </aside>
  );
}

export function BlueHourSite() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const chapterNodes = useRef<Array<HTMLElement | null>>([]);
  const backdropRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);
  const pointerLastUpdate = useRef(0);
  const pointerEnabled = useRef(false);
  const { setActiveChapter } = useBlueHourAudioContext();

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured).slice(0, 3),
    [],
  );
  const homepageNotes = useMemo(
    () =>
      [...notes]
        .sort(
          (a, b) =>
            Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
            b.occurredAt.localeCompare(a.occurredAt),
        )
        .slice(0, 4),
    [],
  );

  useEffect(() => {
    setActiveChapter(active);
  }, [active, setActiveChapter]);

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const updatePointerCapability = () => {
      pointerEnabled.current =
        !coarsePointer.matches && !reducedMotionQuery.matches;
    };

    updatePointerCapability();
    coarsePointer.addEventListener('change', updatePointerCapability);
    reducedMotionQuery.addEventListener('change', updatePointerCapability);
    return () => {
      coarsePointer.removeEventListener('change', updatePointerCapability);
      reducedMotionQuery.removeEventListener(
        'change',
        updatePointerCapability,
      );
    };
  }, []);

  useEffect(() => {
    const nodes = chapterNodes.current.filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.chapter);
        if (Number.isFinite(index)) setActive(index);
      },
      {
        threshold: [0, 0.01],
        rootMargin: '-44% 0px -44% 0px',
      },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('blue-hour-page');
    return () => {
      window.cancelAnimationFrame(pointerFrame.current);
      html.classList.remove('blue-hour-page');
    };
  }, []);

  const selectChapter = (index: number) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    chapterNodes.current[index]?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const onPointerMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!backdropRef.current || !pointerEnabled.current) return;
    const now = window.performance.now();
    if (now - pointerLastUpdate.current < 32) return;
    pointerLastUpdate.current = now;
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = window.requestAnimationFrame(() => {
      backdropRef.current?.style.setProperty('--pointer-x', `${x}`);
      backdropRef.current?.style.setProperty('--pointer-y', `${y}`);
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={styles.experience}
        onMouseMove={onPointerMove}
        style={{ '--active-chapter': active } as React.CSSProperties}
      >
      <SceneBackdrop active={active} backdropRef={backdropRef} />
      <div className={styles.globalProgress} aria-hidden="true" />
      <Header
        active={active}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <ProgressRail active={active} onSelect={selectChapter} />

      <main id="main-content" className={styles.main} tabIndex={-1}>
        <section
          id="bearing"
          tabIndex={-1}
          ref={(node) => {
            chapterNodes.current[0] = node;
          }}
          data-chapter="0"
          className={`${styles.chapter} ${styles.heroChapter}`}
          aria-labelledby="bearing-title"
        >
          <div className={styles.chapterInner}>
            <ChapterKicker index={0} label="Home / Direction" />
            <BlueHourArtifact
              scene="lighthouse"
              className={styles.chapterArtifact}
              priority
            />
            <motion.div
              className={styles.heroCopy}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 1.1,
                delay: reducedMotion ? 0 : 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <p className={styles.sceneTime}>
                <span>19:31</span>
                <span>Bearing</span>
              </p>
              <h1 id="bearing-title">
                The last
                <br />
                <em>blue hour.</em>
              </h1>
              <p className={styles.heroChinese}>最后的蓝调时刻</p>
              <p className={styles.heroLead}>
                I&apos;m Austin Liu — a builder, traveller, writer, photographer,
                and dental student in Adelaide. This is a field guide to the
                things I am making and the moments I want to keep.
              </p>
              <div className={styles.heroActions}>
                <a href="#opening">
                  Begin the journey <ArrowDown size={16} />
                </a>
                <Link href="/projects">
                  View the index <ArrowUpRight size={15} />
                </Link>
              </div>
            </motion.div>
            <motion.aside
              className={`${styles.fieldNote} ${styles.heroFieldNote}`}
              initial={{ opacity: 0, rotate: -3, y: 20 }}
              animate={{ opacity: 1, rotate: -1.5, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.8,
                delay: reducedMotion ? 0 : 1,
              }}
            >
              <span>Field note 001</span>
              <strong>Direction is not the same as certainty.</strong>
              <small>34.9285° S · 138.6007° E → Adelaide</small>
            </motion.aside>
            <div className={styles.scrollMark} aria-hidden="true">
              <span>Scroll through dusk</span>
              <i />
            </div>
          </div>
        </section>

        <section
          id="opening"
          tabIndex={-1}
          ref={(node) => {
            chapterNodes.current[1] = node;
          }}
          data-chapter="1"
          className={`${styles.chapter} ${styles.projectsChapter}`}
          aria-labelledby="projects-title"
        >
          <div className={styles.chapterInner}>
            <ChapterKicker index={1} label="Projects / Ambition" />
            <BlueHourArtifact
              scene="mountain"
              className={styles.chapterArtifact}
            />
            <div className={styles.projectShowcase}>
              <div className={styles.projectIntro}>
                <ChapterTitle time="19:43" title="The Opening">
                  <h2 id="projects-title">
                    Useful things,
                    <br />
                    <em>built with intent.</em>
                  </h2>
                  <p>
                    Projects shaped by real needs: private chess training,
                    focused scholarship preparation, and memory that works with
                    you.
                  </p>
                </ChapterTitle>
                <p className={styles.projectDeckNote}>
                  Three independent builds. Pick one up, turn it over, keep
                  moving.
                </p>
                <Link className={styles.chapterLink} href="/projects">
                  Explore every build <ArrowUpRight size={16} />
                </Link>
              </div>
              <ProjectDeck
                className={styles.homepageProjectDeck}
                deckProjects={featuredProjects}
              />
            </div>
          </div>
        </section>

        <section
          id="tide"
          tabIndex={-1}
          ref={(node) => {
            chapterNodes.current[2] = node;
          }}
          data-chapter="2"
          className={`${styles.chapter} ${styles.momentsChapter}`}
          aria-labelledby="moments-title"
        >
          <div className={styles.chapterInner}>
            <ChapterKicker index={2} label="Moments / Memory" />
            <BlueHourArtifact
              scene="tide"
              className={styles.chapterArtifact}
            />
            <ChapterTitle time="19:55" title="What the Tide Kept">
              <h2 id="moments-title">
                Places return
                <br />
                <em>in fragments.</em>
              </h2>
              <p>
                Light on a riverbank. Rain over a road. A city louder at night.
                Seven chapters, kept without trying to make them perfect.
              </p>
            </ChapterTitle>
            <motion.div
              className={styles.placeIndex}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reducedMotion ? 0 : 0.055,
                    duration: reducedMotion ? 0 : undefined,
                  },
                },
              }}
            >
              {places.map(([name, copy, href], index) => (
                <MotionLink
                  href={href}
                  key={name}
                  variants={{
                    hidden: { opacity: 0, x: -18 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: reducedMotion ? 0 : 0.5 }}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{name}</strong>
                  <small>{copy}</small>
                  <ArrowUpRight size={16} />
                </MotionLink>
              ))}
            </motion.div>
            <div className={styles.momentFooter}>
              <span>07 places · 24 frames · still becoming</span>
              <Link href="/moments">
                Open the full visual journal <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="water"
          tabIndex={-1}
          ref={(node) => {
            chapterNodes.current[3] = node;
          }}
          data-chapter="3"
          className={`${styles.chapter} ${styles.notesChapter}`}
          aria-labelledby="notes-title"
        >
          <div className={styles.chapterInner}>
            <ChapterKicker index={3} label="Notes / Reflection" />
            <BlueHourArtifact
              scene="waterfall"
              className={styles.chapterArtifact}
            />
            <ChapterTitle time="20:07" title="Water in the Dark">
              <h2 id="notes-title">
                Thinking,
                <br />
                <em>before it settles.</em>
              </h2>
              <p>
                Field notes from travel, projects, systems, and ordinary days.
                Written to understand, not to perform certainty.
              </p>
            </ChapterTitle>
            <div className={styles.noteList}>
              {homepageNotes.map((note, index) => (
                <MotionLink
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.6,
                    delay: reducedMotion ? 0 : index * 0.07,
                  }}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <small>
                      {note.label} · {note.readingTime}
                    </small>
                    <h3 lang={note.localLang}>{note.localTitle || note.title}</h3>
                    <p lang={note.localExcerpt ? note.localLang : undefined}>
                      {note.localExcerpt || note.excerpt}
                    </p>
                  </div>
                  <ArrowUpRight size={17} />
                </MotionLink>
              ))}
            </div>
            <Link className={styles.chapterLink} href="/notes">
              Read all notes <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>

        <section
          id="afterlight"
          tabIndex={-1}
          ref={(node) => {
            chapterNodes.current[4] = node;
          }}
          data-chapter="4"
          className={`${styles.chapter} ${styles.finalChapter}`}
          aria-labelledby="about-title"
        >
          <div className={styles.chapterInner}>
            <ChapterKicker index={4} label="About / Return" />
            <BlueHourArtifact
              scene="afterlight"
              className={styles.chapterArtifact}
            />
            <ChapterTitle time="20:19" title="One Window Left">
              <h2 id="about-title">
                A life with
                <br />
                <em>more than one room.</em>
              </h2>
              <p>
                Born in China, based in Adelaide, always moving between
                disciplines. Medicine is one room. Technology, design,
                photography, people, and the road outside are others.
              </p>
            </ChapterTitle>
            <div className={styles.finalGrid}>
              <motion.div
                className={styles.aboutPanel}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reducedMotion ? 0 : 0.5 }}
              >
                <span className={styles.panelLabel}>About Austin</span>
                <p>
                  I like making useful things feel considered. Some weeks that
                  means clinical training; others mean debugging a product,
                  walking through a new city, or noticing how evening light
                  changes a familiar street.
                </p>
                <div>
                  <MapPin size={15} />
                  Adelaide, South Australia
                </div>
                <Link href="/about">
                  The longer version <ArrowUpRight size={14} />
                </Link>
              </motion.div>
              <motion.div
                className={styles.nowPanel}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.5,
                  delay: reducedMotion ? 0 : 0.1,
                }}
              >
                <span className={styles.panelLabel}>Now · Winter 2026</span>
                <ul>
                  {nowItems.map(([label, copy]) => (
                    <li key={label}>
                      <strong>{label}</strong>
                      <span>{copy}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/now">
                  See what is current <ArrowUpRight size={14} />
                </Link>
              </motion.div>
            </div>
            <motion.div
              id="contact"
              className={styles.contactPanel}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: reducedMotion ? 0 : 0.5 }}
            >
              <div>
                <span className={styles.panelLabel}>The light is still on</span>
                <h3>Have something worth making together?</h3>
              </div>
              <a href={`mailto:${site.email}`}>
                <Mail size={17} />
                {site.email}
                <ArrowUpRight size={16} />
              </a>
            </motion.div>
            <footer className={styles.footer}>
              <span>© 2026 Austin Liu</span>
              <span>The Last Blue Hour · 最后的蓝调时刻</span>
              <div>
                <a href={site.github} target="_blank" rel="noreferrer">
                  GitHub <ArrowUpRight size={13} />
                </a>
                <button type="button" onClick={() => selectChapter(0)}>
                  Back to light <ArrowUp size={13} />
                </button>
              </div>
            </footer>
          </div>
        </section>
      </main>
      </div>
    </MotionConfig>
  );
}
