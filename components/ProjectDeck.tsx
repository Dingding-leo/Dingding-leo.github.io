'use client';

import { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import type { Project } from '@/config/site';
import styles from './ProjectDeck.module.css';

const optimizedProjectArtwork: Record<string, string> = {
  KnightClub: 'knightclub-editorial',
  ScholarBank: 'scholarbank',
  Denki: 'denki',
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
}: {
  project: Project;
  index: number;
  count: number;
  direction: number;
  disabled: boolean;
  onSwipe: (direction: number) => void;
}) {
  const reducedMotion = useReducedMotion();
  const didDrag = useRef(false);

  const onDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    didDrag.current = Math.abs(info.offset.x) > 6;
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
                opacity: 0,
                y: 18,
                scale: 0.965,
                rotate: travelDirection > 0 ? 2.4 : -2.4,
              },
        centre: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: -0.65,
          transition: reducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 260, damping: 26, mass: 0.72 },
        },
        exit: (travelDirection: number) =>
          reducedMotion
            ? { opacity: 0, transition: { duration: 0 } }
            : {
                opacity: 0,
                x: travelDirection > 0 ? -560 : 560,
                y: 34,
                rotate: travelDirection > 0 ? -14 : 14,
                scale: 0.94,
                transition: {
                  duration: 0.42,
                  ease: [0.32, 0.72, 0, 1],
                },
              },
      }}
      initial="enter"
      animate="centre"
      exit="exit"
      drag={!reducedMotion && !disabled ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.68}
      dragMomentum={false}
      dragSnapToOrigin
      whileDrag={{ scale: 1.015, rotate: 3, cursor: 'grabbing' }}
      onDragStart={() => {
        didDrag.current = false;
      }}
      onDrag={(_event, info) => {
        if (Math.abs(info.offset.x) > 6) didDrag.current = true;
      }}
      onDragEnd={onDragEnd}
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [busy, setBusy] = useState(false);
  const count = deckProjects.length;
  const activeProject = deckProjects[activeIndex];

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
  }, [deckProjects]);

  if (!activeProject || count === 0) return null;

  const projectAt = (offset: number) =>
    deckProjects[(activeIndex + offset + count) % count];

  const goTo = (nextIndex: number, travelDirection: number) => {
    const normalizedIndex = (nextIndex + count) % count;
    if (busy || normalizedIndex === activeIndex) return;
    setDirection(travelDirection);
    setBusy(true);
    setActiveIndex(normalizedIndex);
  };

  const move = (travelDirection: number) => {
    goTo(activeIndex + travelDirection, travelDirection);
  };

  return (
    <motion.div
      className={`${styles.projectCarousel} ${className ?? ''}`}
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
      <div className={styles.projectStage}>
        {[2, 1].map((offset) => {
          const project = projectAt(offset);
          return (
            <div
              className={`${styles.projectBackCard} ${
                offset === 1 ? styles.projectBackOne : styles.projectBackTwo
              }`}
              aria-hidden="true"
              key={`${project.title}-${offset}`}
            >
              <ProjectPicture project={project} decorative />
              <span>{project.title}</span>
            </div>
          );
        })}
        <AnimatePresence
          initial={false}
          custom={direction}
          onExitComplete={() => setBusy(false)}
        >
          <ProjectActiveCard
            key={activeProject.title}
            project={activeProject}
            index={activeIndex}
            count={count}
            direction={direction}
            disabled={busy}
            onSwipe={move}
          />
        </AnimatePresence>
      </div>
      <div className={styles.projectControls}>
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
          <i />
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
        <small>Drag or use arrows</small>
      </div>
      <p className={styles.srOnly} aria-live="polite">
        {`${activeProject.title}, project ${activeIndex + 1} of ${count}`}
      </p>
    </motion.div>
  );
}
