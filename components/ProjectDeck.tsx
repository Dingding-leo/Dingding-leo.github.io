'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Pause,
  Play,
} from 'lucide-react';
import type { Project } from '@/config/site';
import styles from './ProjectDeck.module.css';

const optimizedProjectArtwork: Record<string, string> = {
  KnightClub: 'knightclub-editorial',
  ScholarBank: 'scholarbank',
  Denki: 'denki',
};

const AUTO_ADVANCE_MS = 5600;

type NetworkInformationLike = {
  saveData?: boolean;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

function projectSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function ProjectPicture({
  project,
  decorative = false,
}: {
  project: Project;
  decorative?: boolean;
}) {
  const optimizedName = optimizedProjectArtwork[project.title];
  const projectSlug = project.title.toLowerCase();

  if (!optimizedName) {
    return (
      <img
        src={project.image}
        alt={decorative ? '' : project.imageAlt}
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );
  }

  return (
    <picture className={styles.projectPicture} data-project={projectSlug}>
      <source
        type="image/avif"
        srcSet={`/assets/projects/optimized/${optimizedName}-640.avif 640w, /assets/projects/optimized/${optimizedName}-960.avif 960w`}
        sizes="(max-width: 820px) 86vw, 420px"
      />
      <source
        type="image/webp"
        srcSet={`/assets/projects/optimized/${optimizedName}-640.webp 640w, /assets/projects/optimized/${optimizedName}-960.webp 960w`}
        sizes="(max-width: 820px) 86vw, 420px"
      />
      <img
        src={project.image}
        alt={decorative ? '' : project.imageAlt}
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

function ProjectActiveCard({
  project,
  index,
  count,
  direction,
  disabled,
  onSwipe,
  onDragStateChange,
  onInteraction,
  onSettled,
}: {
  project: Project;
  index: number;
  count: number;
  direction: number;
  disabled: boolean;
  onSwipe: (direction: number) => void;
  onDragStateChange: (dragging: boolean) => void;
  onInteraction: () => void;
  onSettled: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const didDrag = useRef(false);

  const onDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    didDrag.current = Math.abs(info.offset.x) > 6;
    onDragStateChange(false);
    onInteraction();
    if (info.offset.x < -72 || info.velocity.x < -550) {
      onSwipe(1);
    } else if (info.offset.x > 72 || info.velocity.x > 550) {
      onSwipe(-1);
    }
    window.setTimeout(() => {
      didDrag.current = false;
    }, 180);
  };

  const artwork = <ProjectPicture project={project} />;

  return (
    <motion.article
      className={styles.projectActiveCard}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count}: ${project.title}`}
      custom={direction}
      variants={{
        enter: (travelDirection: number) =>
          reducedMotion
            ? { opacity: 0 }
            : {
                opacity: 1,
                x: travelDirection > 0 ? 12 : -7,
                y: travelDirection > 0 ? 12 : 25,
                scale: travelDirection > 0 ? 0.98 : 0.945,
                rotate: travelDirection > 0 ? 1.5 : -2.05,
              },
        centre: reducedMotion
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: -0.65,
              transition: { duration: 0 },
            }
          : {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: -0.65,
              transition: {
                duration: 0.56,
                ease: [0.16, 1, 0.3, 1],
              },
            },
        exit: (travelDirection: number) =>
          reducedMotion
            ? { opacity: 0, transition: { duration: 0 } }
            : {
                opacity: 1,
                x: 0,
                y: [0, -10, 14, 26, 30],
                rotate: [
                  -0.65,
                  travelDirection > 0 ? -1.3 : 0.7,
                  travelDirection > 0 ? 0.35 : -1.35,
                  travelDirection > 0 ? -1.8 : 1.1,
                  travelDirection > 0 ? -2.4 : 1.6,
                ],
                scale: [1, 1.006, 0.97, 0.95, 0.94],
                transition: {
                  duration: 0.72,
                  times: [0, 0.24, 0.62, 0.88, 1],
                  ease: [0.4, 0, 0.2, 1],
                },
              },
      }}
      initial="enter"
      animate="centre"
      exit="exit"
      drag={!reducedMotion && !disabled ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.44}
      dragMomentum={false}
      dragSnapToOrigin
      whileDrag={{ scale: 1.01, rotate: 1.6, cursor: 'grabbing' }}
      onDragStart={() => {
        didDrag.current = false;
        onDragStateChange(true);
        onInteraction();
      }}
      onDrag={(_event, info) => {
        if (Math.abs(info.offset.x) > 6) didDrag.current = true;
      }}
      onDragEnd={onDragEnd}
      onAnimationComplete={(definition) => {
        if (definition === 'centre') onSettled();
      }}
      onClickCapture={(event) => {
        if (!didDrag.current) return;
        event.preventDefault();
        event.stopPropagation();
        didDrag.current = false;
      }}
    >
      <div className={styles.projectCardVisual}>
        {artwork}
        <span>{project.status}</span>
      </div>
      <div className={styles.projectCompactCopy}>
        <div className={styles.projectCompactHeading}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{project.title}</h3>
        </div>
        <p className={styles.projectCompactTagline}>{project.tagline}</p>
        <p className={styles.projectCompactWhy}>
          {project.why || project.description}
        </p>
        <div className={styles.projectCompactFooter}>
          <div>
            {project.tags.slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span className={styles.projectLinks}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                aria-label={`${project.title} live site (opens in a new tab)`}
              >
                Live <ExternalLink size={13} aria-hidden="true" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                aria-label={`${project.title} source code (opens in a new tab)`}
              >
                Source <Github size={13} aria-hidden="true" />
              </a>
            )}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectDeck({
  deckProjects,
  label = 'Featured projects',
  className,
}: {
  deckProjects: readonly Project[];
  label?: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastInputWasPointer = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [busy, setBusy] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [allowAutoplayWhileFocused, setAllowAutoplayWhileFocused] =
    useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [conserveMotion, setConserveMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [autoplayEpoch, setAutoplayEpoch] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const count = deckProjects.length;
  const activeProject = deckProjects[activeIndex];
  const motionEnabled = reducedMotion === false && !conserveMotion;
  const temporarilyPaused =
    isHovered ||
    (hasFocusWithin && !allowAutoplayWhileFocused) ||
    isDragging ||
    !isInView ||
    !documentVisible;
  const autoplayRunning =
    motionEnabled &&
    !userPaused &&
    !temporarilyPaused &&
    !busy &&
    count > 1;
  const deckMoving =
    motionEnabled &&
    isInView &&
    documentVisible &&
    !isHovered &&
    (!hasFocusWithin || allowAutoplayWhileFocused) &&
    !isDragging;
  const autoplayState = !motionEnabled
    ? 'motion-disabled'
    : userPaused
      ? 'user-paused'
      : isHovered
        ? 'hover-paused'
        : hasFocusWithin && !allowAutoplayWhileFocused
          ? 'focus-paused'
          : isDragging
            ? 'drag-paused'
            : !isInView
              ? 'offscreen'
              : !documentVisible
                ? 'hidden'
                : busy
                  ? 'transitioning'
                  : 'running';

  const resetAutoplay = useCallback(() => {
    setAutoplayEpoch((epoch) => epoch + 1);
  }, []);


  useEffect(() => {
    const selectRequestedProject = (requested: string | null) => {
      if (!requested) return;
      const requestedIndex = deckProjects.findIndex(
        (project) => projectSlug(project.title) === requested.toLowerCase(),
      );
      if (requestedIndex < 0) return;
      setActiveIndex((currentIndex) => {
        setDirection(requestedIndex >= currentIndex ? 1 : -1);
        return requestedIndex;
      });
      setBusy(false);
      resetAutoplay();
    };
    const selectFromLocation = () =>
      selectRequestedProject(
        new URLSearchParams(window.location.search).get('project'),
      );
    const selectFromEvent = (event: Event) =>
      selectRequestedProject((event as CustomEvent<string>).detail);

    selectFromLocation();
    window.addEventListener('popstate', selectFromLocation);
    window.addEventListener('project-deck-select', selectFromEvent);
    return () => {
      window.removeEventListener('popstate', selectFromLocation);
      window.removeEventListener('project-deck-select', selectFromEvent);
    };
  }, [deckProjects, resetAutoplay]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.18 },
    );
    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateDocumentVisibility = () => {
      setDocumentVisible(document.visibilityState === 'visible');
    };
    updateDocumentVisibility();
    document.addEventListener('visibilitychange', updateDocumentVisibility);
    return () =>
      document.removeEventListener(
        'visibilitychange',
        updateDocumentVisibility,
      );
  }, []);

  useEffect(() => {
    const notePointerInput = () => {
      lastInputWasPointer.current = true;
      setAllowAutoplayWhileFocused(true);
    };
    const noteKeyboardInput = () => {
      lastInputWasPointer.current = false;
      setAllowAutoplayWhileFocused(false);
    };

    document.addEventListener('pointerdown', notePointerInput, true);
    document.addEventListener('keydown', noteKeyboardInput, true);
    return () => {
      document.removeEventListener('pointerdown', notePointerInput, true);
      document.removeEventListener('keydown', noteKeyboardInput, true);
    };
  }, []);

  useEffect(() => {
    const slowUpdate = window.matchMedia('(update: slow)');
    const reducedData = window.matchMedia('(prefers-reduced-data: reduce)');
    const connection = (
      navigator as Navigator & { connection?: NetworkInformationLike }
    ).connection;
    const updatePreference = () => {
      setConserveMotion(
        slowUpdate.matches ||
          reducedData.matches ||
          Boolean(connection?.saveData),
      );
    };

    updatePreference();
    slowUpdate.addEventListener('change', updatePreference);
    reducedData.addEventListener('change', updatePreference);
    connection?.addEventListener?.('change', updatePreference);
    return () => {
      slowUpdate.removeEventListener('change', updatePreference);
      reducedData.removeEventListener('change', updatePreference);
      connection?.removeEventListener?.('change', updatePreference);
    };
  }, []);

  const goTo = useCallback(
    (
      nextIndex: number,
      travelDirection: number,
      source: 'manual' | 'automatic' = 'manual',
    ) => {
      if (count < 2) return;
      const normalizedIndex = (nextIndex + count) % count;
      if (source === 'manual') resetAutoplay();
      if (busy || normalizedIndex === activeIndex) return;
      setDirection(travelDirection);
      setBusy(true);
      setActiveIndex(normalizedIndex);
      if (source === 'manual') {
        const selectedProject = deckProjects[normalizedIndex];
        setAnnouncement(
          `${selectedProject.title}, project ${normalizedIndex + 1} of ${count}`,
        );
      }
    },
    [activeIndex, busy, count, deckProjects, resetAutoplay],
  );

  const move = useCallback(
    (
      travelDirection: number,
      source: 'manual' | 'automatic' = 'manual',
    ) => {
      goTo(activeIndex + travelDirection, travelDirection, source);
    },
    [activeIndex, goTo],
  );

  useEffect(() => {
    if (!autoplayRunning) return;
    const timer = window.setTimeout(
      () => move(1, 'automatic'),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, autoplayEpoch, autoplayRunning, move]);

  if (!activeProject || count === 0) return null;

  const projectAt = (offset: number) =>
    deckProjects[(activeIndex + offset + count) % count];

  return (
    <motion.div
      ref={carouselRef}
      className={`${styles.projectCarousel} ${className ?? ''}`}
      data-motion={motionEnabled ? 'enabled' : 'disabled'}
      data-deck-moving={deckMoving ? 'true' : 'false'}
      data-autoplay-state={autoplayState}
      data-turning={busy ? 'true' : 'false'}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{
        duration: reducedMotion ? 0 : 0.75,
        ease: [0.16, 1, 0.3, 1],
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setIsHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setIsHovered(false);
      }}
      onPointerCancel={() => setIsHovered(false)}
      onFocusCapture={() => {
        setHasFocusWithin(true);
        setAllowAutoplayWhileFocused(lastInputWasPointer.current);
      }}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        ) {
          setHasFocusWithin(false);
          setAllowAutoplayWhileFocused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          move(-1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          move(1);
        } else if (event.key === 'Home') {
          event.preventDefault();
          goTo(0, -1);
        } else if (event.key === 'End') {
          event.preventDefault();
          goTo(count - 1, 1);
        }
      }}
    >
      <div className={styles.projectStage} onPointerDown={resetAutoplay}>
        {[2, 1].map((offset) => {
          const project = projectAt(offset);
          return (
            <div
              className={`${styles.projectBackCard} ${
                offset === 1 ? styles.projectBackOne : styles.projectBackTwo
              }`}
              aria-hidden="true"
              key={count > 2 ? project.title : `${project.title}-${offset}`}
            >
              <ProjectPicture project={project} decorative />
              <span>{project.title}</span>
            </div>
          );
        })}
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <ProjectActiveCard
            key={activeProject.title}
            project={activeProject}
            index={activeIndex}
            count={count}
            direction={direction}
            disabled={busy}
            onSwipe={move}
            onDragStateChange={setIsDragging}
            onInteraction={resetAutoplay}
            onSettled={() => setBusy(false)}
          />
        </AnimatePresence>
      </div>
      <div className={styles.projectControls}>
        {count > 1 && motionEnabled && (
          <button
            className={styles.autoplayControl}
            type="button"
            onClick={() => {
              const nextPaused = !userPaused;
              setUserPaused(nextPaused);
              setAllowAutoplayWhileFocused(!nextPaused);
              if (!nextPaused) {
                setIsHovered(false);
                window.setTimeout(
                  () => {
                    setAllowAutoplayWhileFocused(true);
                    setIsHovered(false);
                  },
                  0,
                );
              }
              resetAutoplay();
            }}
            aria-pressed={userPaused}
            aria-label={
              userPaused
                ? 'Resume automatic project rotation'
                : 'Pause automatic project rotation'
            }
          >
            {userPaused ? (
              <Play size={12} aria-hidden="true" />
            ) : (
              <Pause size={12} aria-hidden="true" />
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={busy || count < 2}
          aria-label={`Previous project: ${projectAt(-1).title}`}
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <span className={styles.projectCounter}>
          <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
          <span className={styles.projectProgress} aria-hidden="true">
            <i
              key={`${activeIndex}-${autoplayEpoch}-${
                autoplayRunning ? 'running' : 'held'
              }`}
              className={
                autoplayRunning ? styles.projectProgressRunning : undefined
              }
            />
          </span>
          <span>{String(count).padStart(2, '0')}</span>
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={busy || count < 2}
          aria-label={`Next project: ${projectAt(1).title}`}
        >
          <ArrowRight size={16} aria-hidden="true" />
        </button>
        <small>
          {userPaused ? 'Still · drag anytime' : 'Auto · drag anytime'}
        </small>
      </div>
      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </motion.div>
  );
}
