'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
  type MotionValue,
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
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react';
import { projects, site } from '@/config/site';
import { notes } from '@/config/notes';
import { BlueHourArtifact } from '@/components/BlueHourArtifact';
import { ProjectDeck } from '@/components/ProjectDeck';
import { useBlueHourChapterDispatch } from './AudioExperience';
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
  {
    name: 'Adelaide',
    copy: 'Riverbank light and Morialta stone',
    href: '/notes/adelaide',
    image: 'adelaide-riverbank',
    fallback: '/assets/gallery/adelaide-riverbank.jpg',
    position: '50% 50%',
  },
  {
    name: 'Melbourne',
    copy: 'St Kilda dusk and Dandenong light',
    href: '/notes/melbourne',
    image: 'melbourne-stkilda',
    fallback: '/assets/gallery/melbourne-stkilda.jpg',
    position: '52% 50%',
  },
  {
    name: 'Shanghai',
    copy: 'A performer held in stage light',
    href: '/notes/shanghai-memories',
    image: 'shanghai-disney',
    fallback: '/assets/gallery/shanghai-disney.jpg',
    position: '46% 50%',
  },
  {
    name: 'Beijing',
    copy: 'Forty-eight hours at full volume',
    href: '/notes/beijing',
    image: 'beijing-tiananmen',
    fallback: '/assets/gallery/beijing-tiananmen.jpg',
    position: '50% 50%',
  },
  {
    name: 'Cairns',
    copy: 'Rainforest rock and reef-blue water',
    href: '/notes/cairns',
    image: 'cairns-barron',
    fallback: '/assets/gallery/cairns-barron.jpg',
    position: '50% 48%',
  },
  {
    name: 'Great Ocean Road',
    copy: 'Weather moving along the edge',
    href: '/notes/great-ocean-road',
    image: 'great-ocean-road',
    fallback: '/assets/gallery/great-ocean-road.jpg',
    position: '50% 50%',
  },
  {
    name: 'Sydney',
    copy: 'The first Australian chapter',
    href: '/notes/sydney',
    image: 'sydney-usyd',
    fallback: '/assets/gallery/sydney-usyd.jpg',
    position: '50% 50%',
  },
] as const;

const nowItems = [
  ['Building', 'KnightClub, ScholarBank, Denki, and quieter tools that respect attention.'],
  ['Learning', 'Clinical craft, systems thinking, and how good products earn trust.'],
  ['Exploring', 'Photography, systematic strategies, and cities on foot.'],
  ['Keeping', 'A little more room for books, music, friends, and unplanned days.'],
] as const;

function ScenePicture({
  scene,
  active,
  eager,
  transitioning,
  direction,
}: {
  scene: (typeof scenes)[number];
  active: boolean;
  eager: boolean;
  transitioning: boolean;
  direction: number;
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
      initial={{
        opacity: eager ? 0.72 : 0,
        scale: reducedMotion ? 1.018 : 1.04,
        y: reducedMotion ? 0 : direction > 0 ? 13 : -13,
      }}
      animate={{
        opacity: active ? 1 : 0,
        scale: active ? 1.018 : 1.002,
        y: active ? 0 : direction > 0 ? -10 : 10,
      }}
      transition={{
        duration: reducedMotion ? 0 : 1.28,
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
          decoding="async"
        />
      </picture>
    </motion.div>
  );
}

function Weather({ type }: { type: (typeof scenes)[number]['weather'] }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`${styles.weather} ${styles[type]}`}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.72 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.9, ease: 'easeInOut' }}
    >
      <span className={styles.weatherOne} />
      <span className={styles.weatherTwo} />
      <span className={styles.weatherThree} />
    </motion.div>
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
  const [direction, setDirection] = useState(1);

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

    setDirection(active > outgoing ? 1 : -1);
    setRenderedScenes([outgoing, active]);
    setTransitioning(true);
    const settleTimer = window.setTimeout(() => {
      setRenderedScenes([active]);
      setTransitioning(false);
    }, 1400);

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
          direction={direction}
        />
      ))}
      <AnimatePresence initial={false} mode="sync">
        <Weather key={scenes[active].id} type={scenes[active].weather} />
      </AnimatePresence>
      <div className={styles.backdropTone} />
      <AnimatePresence initial={false}>
        {transitioning && (
          <motion.div
            key={`${active}-${direction}`}
            className={styles.exposureEvent}
            initial={{
              opacity: 0,
              y: direction > 0 ? '58vh' : '-58vh',
            }}
            animate={{
              opacity: [0, 0.78, 0],
              y:
                direction > 0
                  ? ['58vh', '0vh', '-58vh']
                  : ['-58vh', '0vh', '58vh'],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 1.34,
              times: [0, 0.48, 1],
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        )}
      </AnimatePresence>
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
  headingId,
  lines,
  description,
}: {
  time: string;
  title: string;
  headingId: string;
  lines: React.ReactNode[];
  description: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const container = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0 : 0.04,
        staggerChildren: reducedMotion ? 0 : 0.09,
      },
    },
  };
  const line = {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: '108%', rotate: 1.2 },
    visible: {
      opacity: 1,
      y: '0%',
      rotate: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.92,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.header
      className={styles.chapterHeader}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.38, once: true }}
    >
      <motion.p
        className={styles.sceneTime}
        variants={{
          hidden: { opacity: 0, x: reducedMotion ? 0 : -12 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: reducedMotion ? 0 : 0.48 },
          },
        }}
      >
        <span>{time}</span>
        <span>{title}</span>
      </motion.p>
      <h2 id={headingId}>
        {lines.map((headingLine, index) => (
          <span className={styles.titleLineMask} key={index}>
            <motion.span className={styles.titleLine} variants={line}>
              {headingLine}
            </motion.span>
          </span>
        ))}
      </h2>
      <motion.p
        variants={{
          hidden: { opacity: 0, y: reducedMotion ? 0 : 15 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: reducedMotion ? 0 : 0.72,
              ease: [0.16, 1, 0.3, 1],
            },
          },
        }}
      >
        {description}
      </motion.p>
    </motion.header>
  );
}

function MomentViewfinder({ activeIndex }: { activeIndex: number }) {
  const reducedMotion = useReducedMotion();
  const place = places[activeIndex];

  useEffect(() => {
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    if (saveData) return;

    const preload = () => {
      places.slice(1).forEach((item) => {
        const preview = new Image();
        preview.src = `/assets/gallery/optimized-note/${item.image}-480.webp`;
      });
    };
    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = idleWindow.requestIdleCallback?.(preload);
    const timerId =
      idleId == null ? window.setTimeout(preload, 900) : undefined;

    return () => {
      if (idleId != null) idleWindow.cancelIdleCallback?.(idleId);
      if (timerId != null) window.clearTimeout(timerId);
    };
  }, []);

  return (
    <aside className={styles.momentViewfinder} aria-hidden="true">
      <div className={styles.viewfinderFrame}>
        <AnimatePresence initial={false}>
          <motion.figure
            key={place.name}
            initial={
              reducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 14,
                    scale: 1.025,
                    clipPath: 'inset(100% 0 0 0)',
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: 'inset(0% 0 0 0)',
            }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -8,
                    scale: 0.992,
                    clipPath: 'inset(0 0 100% 0)',
                  }
            }
            transition={{
              duration: reducedMotion ? 0 : 0.78,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <picture>
              <source
                type="image/avif"
                srcSet={`/assets/gallery/optimized-note/${place.image}-480.avif 480w, /assets/gallery/optimized-note/${place.image}-960.avif 960w`}
                sizes="(max-width: 1180px) 310px, 420px"
              />
              <source
                type="image/webp"
                srcSet={`/assets/gallery/optimized-note/${place.image}-480.webp 480w, /assets/gallery/optimized-note/${place.image}-960.webp 960w`}
                sizes="(max-width: 1180px) 310px, 420px"
              />
              <img
                src={place.fallback}
                alt=""
                width={960}
                height={1200}
                loading={activeIndex === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{ objectPosition: place.position }}
              />
            </picture>
            <figcaption>
              <span>
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(places.length).padStart(2, '0')}
              </span>
              <strong>{place.name}</strong>
              <small>{place.copy}</small>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
        <span className={styles.viewfinderReticle} />
      </div>
      <p>
        <span>Field frame</span>
        Focus a place to develop the photograph
      </p>
    </aside>
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
    const audioRoot = document.querySelector<HTMLElement>(
      '[data-blue-hour-audio-root]',
    );
    const previousAriaHidden = main?.getAttribute('aria-hidden');
    const previousAudioAriaHidden = audioRoot?.getAttribute('aria-hidden');
    const previousAudioInert = audioRoot?.inert;
    document.body.style.overflow = 'hidden';
    if (main) {
      main.inert = true;
      main.setAttribute('aria-hidden', 'true');
    }
    if (audioRoot) {
      audioRoot.inert = true;
      audioRoot.setAttribute('aria-hidden', 'true');
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
      if (audioRoot) {
        audioRoot.inert = previousAudioInert ?? false;
        if (previousAudioAriaHidden == null) {
          audioRoot.removeAttribute('aria-hidden');
        } else {
          audioRoot.setAttribute('aria-hidden', previousAudioAriaHidden);
        }
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
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              className={styles.nowPlayingValue}
              key={scenes[active].id}
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 13, clipPath: 'inset(100% 0 0 0)' }
              }
              animate={{
                opacity: 1,
                y: 0,
                clipPath: 'inset(0% 0 0 0)',
              }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -12, clipPath: 'inset(0 0 100% 0)' }
              }
              transition={{
                duration: reducedMotion ? 0 : 0.46,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span>{scenes[active].time}</span>
              <strong>{scenes[active].title}</strong>
            </motion.div>
          </AnimatePresence>
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
          <details className={styles.siteIndex}>
            <summary>Index</summary>
            <div>
              <Link href="/projects">Projects</Link>
              <Link href="/moments">Moments</Link>
              <Link href="/notes">Notes</Link>
              <Link href="/library">Library</Link>
              <Link href="/now">Now</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </details>
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
              <Link href="/library">Library</Link>
              <Link href="/now">Now</Link>
              <Link href="/contact">Contact</Link>
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
  progress,
}: {
  active: number;
  onSelect: (index: number) => void;
  progress: MotionValue<number>;
}) {
  return (
    <aside className={styles.progressRail} aria-label="Chapter progress">
      <span className={styles.progressTrack} aria-hidden="true">
        <motion.i style={{ scaleY: progress }} />
      </span>
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
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 28,
    mass: 0.24,
  });
  const [active, setActive] = useState(0);
  const [activePlace, setActivePlace] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const chapterNodes = useRef<Array<HTMLElement | null>>([]);
  const experienceRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);
  const pointerLastUpdate = useRef(0);
  const scrollFrame = useRef(0);
  const setActiveChapter = useBlueHourChapterDispatch();

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
    const surface = experienceRef.current;
    if (!surface) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const slowUpdate = window.matchMedia('(update: slow)');
    const wideScreen = window.matchMedia('(min-width: 1024px)');
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    let listening = false;

    const onPointerMove = (event: PointerEvent) => {
      if (!backdropRef.current) return;
      const now = window.performance.now();
      if (now - pointerLastUpdate.current < 64) return;
      pointerLastUpdate.current = now;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      window.cancelAnimationFrame(pointerFrame.current);
      pointerFrame.current = window.requestAnimationFrame(() => {
        backdropRef.current?.style.setProperty('--pointer-x', `${x}`);
        backdropRef.current?.style.setProperty('--pointer-y', `${y}`);
      });
    };

    const updateListener = () => {
      const shouldListen =
        finePointer.matches &&
        wideScreen.matches &&
        !reducedMotionQuery.matches &&
        !slowUpdate.matches &&
        !saveData;
      if (shouldListen === listening) return;
      listening = shouldListen;
      if (listening) {
        surface.addEventListener('pointermove', onPointerMove, {
          passive: true,
        });
      } else {
        surface.removeEventListener('pointermove', onPointerMove);
        backdropRef.current?.style.removeProperty('--pointer-x');
        backdropRef.current?.style.removeProperty('--pointer-y');
      }
    };

    const queries = [
      finePointer,
      reducedMotionQuery,
      slowUpdate,
      wideScreen,
    ];
    updateListener();
    queries.forEach((query) => query.addEventListener('change', updateListener));
    return () => {
      surface.removeEventListener('pointermove', onPointerMove);
      queries.forEach((query) =>
        query.removeEventListener('change', updateListener),
      );
      window.cancelAnimationFrame(pointerFrame.current);
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
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const slowUpdate = window.matchMedia('(update: slow)');
    const wideScreen = window.matchMedia('(min-width: 821px)');
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    let listening = false;

    const clearCamera = () => {
      backdropRef.current?.style.removeProperty('--scroll-drift');
      backdropRef.current?.style.removeProperty('--scroll-scale');
    };

    const updateCamera = () => {
      window.cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = window.requestAnimationFrame(() => {
        const chapter = chapterNodes.current[active];
        if (!chapter || !backdropRef.current) return;
        const rect = chapter.getBoundingClientRect();
        const travel = Math.max(1, rect.height + window.innerHeight);
        const progress = Math.min(
          1,
          Math.max(0, (window.innerHeight - rect.top) / travel),
        );
        const centred = progress - 0.5;
        backdropRef.current.style.setProperty(
          '--scroll-drift',
          `${(-centred * 12).toFixed(2)}px`,
        );
        backdropRef.current.style.setProperty(
          '--scroll-scale',
          `${(1.012 + progress * 0.012).toFixed(4)}`,
        );
      });
    };

    const updateListener = () => {
      const shouldListen =
        wideScreen.matches &&
        !reducedMotionQuery.matches &&
        !slowUpdate.matches &&
        !saveData;
      if (shouldListen === listening) {
        if (shouldListen) updateCamera();
        return;
      }
      listening = shouldListen;
      if (listening) {
        window.addEventListener('scroll', updateCamera, { passive: true });
        window.addEventListener('resize', updateCamera, { passive: true });
        updateCamera();
      } else {
        window.removeEventListener('scroll', updateCamera);
        window.removeEventListener('resize', updateCamera);
        clearCamera();
      }
    };

    const queries = [reducedMotionQuery, slowUpdate, wideScreen];
    updateListener();
    queries.forEach((query) => query.addEventListener('change', updateListener));
    return () => {
      window.removeEventListener('scroll', updateCamera);
      window.removeEventListener('resize', updateCamera);
      queries.forEach((query) =>
        query.removeEventListener('change', updateListener),
      );
      window.cancelAnimationFrame(scrollFrame.current);
      clearCamera();
    };
  }, [active]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('blue-hour-page');
    return () => {
      window.cancelAnimationFrame(pointerFrame.current);
      window.cancelAnimationFrame(scrollFrame.current);
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

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={experienceRef}
        className={styles.experience}
        style={{ '--active-chapter': active } as React.CSSProperties}
      >
      <SceneBackdrop active={active} backdropRef={backdropRef} />
      <motion.div
        className={styles.globalProgress}
        aria-hidden="true"
        style={{ scaleX: smoothScrollProgress }}
      />
      <Header
        active={active}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <ProgressRail
        active={active}
        onSelect={selectChapter}
        progress={smoothScrollProgress}
      />

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
            />
            <motion.div
              className={styles.heroCopy}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    delayChildren: reducedMotion ? 0 : 0.2,
                    staggerChildren: reducedMotion ? 0 : 0.095,
                  },
                },
              }}
            >
              <motion.p
                className={styles.sceneTime}
                variants={{
                  hidden: { opacity: 0, x: reducedMotion ? 0 : -12 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: reducedMotion ? 0 : 0.48 },
                  },
                }}
              >
                <span>19:31</span>
                <span>Bearing</span>
              </motion.p>
              <h1 id="bearing-title">
                <span className={styles.titleLineMask}>
                  <motion.span
                    className={styles.titleLine}
                    variants={{
                      hidden: reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: '108%', rotate: 1.2 },
                      visible: {
                        opacity: 1,
                        y: '0%',
                        rotate: 0,
                        transition: {
                          duration: reducedMotion ? 0 : 1.04,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      },
                    }}
                  >
                    The last
                  </motion.span>
                </span>
                <span className={styles.titleLineMask}>
                  <motion.em
                    className={styles.titleLine}
                    variants={{
                      hidden: reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: '108%', rotate: 1.2 },
                      visible: {
                        opacity: 1,
                        y: '0%',
                        rotate: 0,
                        transition: {
                          duration: reducedMotion ? 0 : 1.04,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      },
                    }}
                  >
                    blue hour.
                  </motion.em>
                </span>
              </h1>
              <motion.p
                className={styles.heroChinese}
                variants={{
                  hidden: { opacity: 0, y: reducedMotion ? 0 : 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reducedMotion ? 0 : 0.62 },
                  },
                }}
              >
                最后的蓝调时刻
              </motion.p>
              <motion.p
                className={styles.heroLead}
                variants={{
                  hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reducedMotion ? 0 : 0.7 },
                  },
                }}
              >
                I&apos;m Austin Liu — a builder, traveller, writer, and
                photographer in Adelaide. This is a field guide to the things I
                am making and the moments I want to keep.
              </motion.p>
              <motion.div
                className={styles.heroActions}
                variants={{
                  hidden: { opacity: 0, y: reducedMotion ? 0 : 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reducedMotion ? 0 : 0.62 },
                  },
                }}
              >
                <a href="#opening">
                  Begin the journey <ArrowDown size={16} />
                </a>
                <Link href="/projects">
                  View the index <ArrowUpRight size={15} />
                </Link>
              </motion.div>
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
                <ChapterTitle
                  time="19:43"
                  title="The Opening"
                  headingId="projects-title"
                  lines={[
                    'Useful things,',
                    <em key="projects-emphasis">built with intent.</em>,
                  ]}
                  description={
                    <>
                    Projects shaped by real needs: private chess training,
                    focused scholarship preparation, and memory that works with
                    you.
                    </>
                  }
                />
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
            <ChapterTitle
              time="19:55"
              title="What the Tide Kept"
              headingId="moments-title"
              lines={[
                'Places return',
                <em key="moments-emphasis">in fragments.</em>,
              ]}
              description={
                <>
                Light on a riverbank. Rain over a road. A city louder at night.
                Seven chapters, kept without trying to make them perfect.
                </>
              }
            />
            <div className={styles.momentsBody}>
              <div className={styles.momentIndexColumn}>
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
                  {places.map((place, index) => (
                    <MotionLink
                      href={place.href}
                      key={place.name}
                      className={
                        index === activePlace ? styles.placeActive : undefined
                      }
                      onMouseEnter={() => setActivePlace(index)}
                      onFocus={() => setActivePlace(index)}
                      variants={{
                        hidden: { opacity: 0, x: -18 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: reducedMotion ? 0 : 0.5 }}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{place.name}</strong>
                      <small>{place.copy}</small>
                      <ArrowUpRight size={16} />
                    </MotionLink>
                  ))}
                </motion.div>
                <div className={styles.momentFooter}>
                  <span>07 places · 14 published frames</span>
                  <Link href="/moments">
                    Open the full visual journal <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
              <MomentViewfinder activeIndex={activePlace} />
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
            <ChapterTitle
              time="20:07"
              title="Water in the Dark"
              headingId="notes-title"
              lines={[
                'Thinking,',
                <em key="notes-emphasis">before it settles.</em>,
              ]}
              description={
                <>
                Three build journals and seven photographic field notes.
                Written to notice what a system—or a frame—chooses to keep.
                </>
              }
            />
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
                  <h3>{note.title}</h3>
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
            <ChapterTitle
              time="20:19"
              title="One Window Left"
              headingId="about-title"
              lines={[
                'A life with',
                <em key="about-emphasis">more than one room.</em>,
              ]}
              description={
                <>
                Born in China, based in Adelaide, always moving between
                disciplines. No single pursuit gets the whole house.
                Technology, design, photography, people, and the road outside
                each leave a light on.
                </>
              }
            />
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
                  means studying carefully; others mean debugging a product,
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
                <Link href="/library">Library</Link>
                <Link href="/now">Now</Link>
                <Link href="/contact">Contact</Link>
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
