'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react';
import { projects, site } from '@/config/site';
import { notes } from '@/config/notes';
import { AudioControl, useBlueHourAudio } from './AudioExperience';
import styles from './BlueHourSite.module.css';

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
}: {
  scene: (typeof scenes)[number];
  active: boolean;
  eager: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const style = {
    '--scene-position': scene.position,
    '--scene-mobile-position': scene.mobilePosition,
    '--scene-preview': `url('/assets/blue-hour/${scene.image}-preview.webp')`,
  } as React.CSSProperties;

  return (
    <motion.div
      className={`${styles.sceneLayer} ${active ? styles.sceneLayerActive : ''}`}
      aria-hidden="true"
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        scale: active ? 1.025 : 1.065,
        filter: active ? 'saturate(1) contrast(1)' : 'saturate(.78) contrast(1.05)',
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

function SceneBackdrop({ active }: { active: number }) {
  const [mountedScenes, setMountedScenes] = useState(() => new Set([0, 1]));

  useEffect(() => {
    setMountedScenes((current) => {
      const next = new Set(current);
      next.add(active);
      if (active > 0) next.add(active - 1);
      if (active < scenes.length - 1) next.add(active + 1);
      return next;
    });
  }, [active]);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      {scenes.map((scene, index) =>
        mountedScenes.has(index) ? (
          <ScenePicture
            key={scene.id}
            scene={scene}
            active={index === active}
            eager={index === 0}
          />
        ) : null,
      )}
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
      initial={{ opacity: 0, y: 42, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ amount: 0.38, once: false }}
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
              <a href="/projects">All projects</a>
              <a href="/moments">All moments</a>
              <a href="/notes">All notes</a>
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

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const primaryUrl = project.liveUrl || project.repoUrl || '/projects';
  const reducedMotion = useReducedMotion();
  const visual = useRef<HTMLAnchorElement>(null);
  const [imageVisible, setImageVisible] = useState(false);
  const optimizedImageName =
    project.title === 'KnightClub'
      ? 'knightclub'
      : project.title === 'ScholarBank'
        ? 'scholarbank'
        : project.title === 'Denki'
          ? 'denki'
          : null;

  useEffect(() => {
    const node = visual.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setImageVisible(true);
        observer.disconnect();
      },
      { rootMargin: '180px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.article
      className={styles.projectCard}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.24, once: true }}
      transition={{
        duration: reducedMotion ? 0 : 0.78,
        delay: reducedMotion ? 0 : index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <a
        ref={visual}
        className={styles.projectVisual}
        href={primaryUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.title}`}
      >
        {imageVisible ? (
          optimizedImageName ? (
            <picture>
              <source
                type="image/avif"
                srcSet={`/assets/projects/optimized/${optimizedImageName}-640.avif 640w, /assets/projects/optimized/${optimizedImageName}-960.avif 960w`}
                sizes="(max-width: 760px) 100vw, 52vw"
              />
              <source
                type="image/webp"
                srcSet={`/assets/projects/optimized/${optimizedImageName}-640.webp 640w, /assets/projects/optimized/${optimizedImageName}-960.webp 960w`}
                sizes="(max-width: 760px) 100vw, 52vw"
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
          ) : (
            <img
              src={project.image}
              alt={project.imageAlt}
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
            />
          )
        ) : (
          <div
            className={styles.projectImagePlaceholder}
            role="img"
            aria-label={project.imageAlt}
          />
        )}
        <span>{project.status}</span>
      </a>
      <div className={styles.projectCopy}>
        <div className={styles.projectHeading}>
          <span>0{index + 1}</span>
          <h3>{project.title}</h3>
        </div>
        <p className={styles.projectTagline}>{project.tagline}</p>
        <p>{project.why || project.description}</p>
        <dl>
          <div>
            <dt>Role</dt>
            <dd>{project.role || 'Independent designer and developer'}</dd>
          </div>
          <div>
            <dt>Key decision</dt>
            <dd>{project.decision || project.description}</dd>
          </div>
        </dl>
        <div className={styles.projectFooter}>
          <div>
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span className={styles.projectLinks}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                Live <ExternalLink size={13} />
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer">
                Source <Github size={13} />
              </a>
            )}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function BlueHourSite() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const chapterNodes = useRef<Array<HTMLElement | null>>([]);
  const root = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);
  const audioStartRef = useRef<() => Promise<boolean>>(async () => false);
  const audioPlayingRef = useRef(false);
  const audioStartAttempting = useRef(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.3,
  });
  const audio = useBlueHourAudio(active);

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured).slice(0, 3),
    [],
  );

  useEffect(() => {
    audioStartRef.current = audio.start;
    audioPlayingRef.current = audio.isPlaying;
  }, [audio.isPlaying, audio.start]);

  useEffect(() => {
    try {
      if (window.localStorage.getItem('blue-hour-sound') === 'off') return;
    } catch {
      // Storage can be unavailable in strict privacy modes; sound can still run.
    }

    const cleanup = () => {
      window.removeEventListener('pointerdown', onGesture, true);
      window.removeEventListener('keydown', onGesture, true);
    };

    const onGesture = (event: PointerEvent | KeyboardEvent) => {
      if (audioPlayingRef.current) {
        cleanup();
        return;
      }

      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('[data-blue-hour-audio-toggle]')
      ) {
        return;
      }

      if (event instanceof KeyboardEvent) {
        if (
          event.repeat ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          !['Enter', ' '].includes(event.key)
        ) {
          return;
        }
        if (
          target instanceof HTMLElement &&
          (target.isContentEditable ||
            ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
        ) {
          return;
        }
      }

      if (audioStartAttempting.current) return;
      audioStartAttempting.current = true;
      void audioStartRef
        .current()
        .then((started) => {
          if (started) cleanup();
        })
        .catch(() => {
          // Keep the listener armed for the next eligible interaction.
        })
        .finally(() => {
          audioStartAttempting.current = false;
        });
    };

    window.addEventListener('pointerdown', onGesture, {
      capture: true,
      passive: true,
    });
    window.addEventListener('keydown', onGesture, true);
    return cleanup;
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
    if (
      !root.current ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = window.requestAnimationFrame(() => {
      root.current?.style.setProperty('--pointer-x', `${x}`);
      root.current?.style.setProperty('--pointer-y', `${y}`);
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={root}
        className={styles.experience}
        onMouseMove={onPointerMove}
        style={{ '--active-chapter': active } as React.CSSProperties}
      >
      <SceneBackdrop active={active} />
      <motion.div
        className={styles.globalProgress}
        style={{ scaleX: reducedMotion ? scrollYProgress : smoothProgress }}
        aria-hidden="true"
      />
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
                <a href="/projects">
                  View the index <ArrowUpRight size={15} />
                </a>
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
            <ChapterTitle time="19:43" title="The Opening">
              <h2 id="projects-title">
                Useful things,
                <br />
                <em>built with intent.</em>
              </h2>
              <p>
                Products shaped by real needs: private chess training, focused
                scholarship preparation, and memory that works with you.
              </p>
            </ChapterTitle>
            <div className={styles.projectGrid}>
              {featuredProjects.map((project, index) => (
                <ProjectCard project={project} index={index} key={project.title} />
              ))}
            </div>
            <a className={styles.chapterLink} href="/projects">
              Explore every build <ArrowUpRight size={16} />
            </a>
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
                <motion.a
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
                </motion.a>
              ))}
            </motion.div>
            <div className={styles.momentFooter}>
              <span>07 places · 24 frames · still becoming</span>
              <a href="/moments">
                Open the full visual journal <ArrowRight size={15} />
              </a>
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
              {notes.slice(0, 4).map((note, index) => (
                <motion.a
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
                    <p>{note.localExcerpt || note.excerpt}</p>
                  </div>
                  <ArrowUpRight size={17} />
                </motion.a>
              ))}
            </div>
            <a className={styles.chapterLink} href="/notes">
              Read all notes <ArrowUpRight size={16} />
            </a>
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
                <a href="/about">
                  The longer version <ArrowUpRight size={14} />
                </a>
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
                <a href="/now">
                  See what is current <ArrowUpRight size={14} />
                </a>
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

        <AudioControl audio={audio} activeChapter={active} />
      </div>
    </MotionConfig>
  );
}
