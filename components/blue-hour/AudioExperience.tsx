'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  Pause,
  Play,
  SlidersHorizontal,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import styles from './AudioExperience.module.css';
import {
  RecordedAmbienceEngine,
  chapterTracks,
} from './RecordedAmbienceEngine';

type AudioContextConstructor = typeof AudioContext;

const chapterNames = chapterTracks.map((track) => track.chapter);
const DEFAULT_VOLUME = 0.28;

function readAudioPreference(key: string) {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeAudioPreference(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Audio remains usable when storage is blocked.
  }
}

function readInitialVolume() {
  const stored = Number(readAudioPreference('blue-hour-volume'));
  return Number.isFinite(stored) && stored >= 0 && stored <= 0.7
    ? stored
    : DEFAULT_VOLUME;
}

export type AudioExperience = {
  analyser: MutableRefObject<AnalyserNode | null>;
  isPlaying: boolean;
  isMuted: boolean;
  panelOpen: boolean;
  volume: number;
  start: () => Promise<boolean>;
  pause: () => Promise<void>;
  toggle: () => Promise<void>;
  toggleMute: () => void;
  setPanelOpen: (open: boolean) => void;
  setVolume: (volume: number) => void;
};

export function useBlueHourAudio(activeChapter: number): AudioExperience {
  const engine = useRef<RecordedAmbienceEngine | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const shouldResume = useRef(false);
  const desiredPlaying = useRef(false);
  const actuallyPlaying = useRef(false);
  const startPending = useRef(false);
  const audioOperation = useRef(0);
  const previousVolume = useRef(readInitialVolume() || DEFAULT_VOLUME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => readInitialVolume() === 0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [volume, setVolumeState] = useState(readInitialVolume);

  const ensureEngine = useCallback(() => {
    if (engine.current) return engine.current;
    const browserWindow = window as typeof window & {
      webkitAudioContext?: AudioContextConstructor;
    };
    const Context = window.AudioContext || browserWindow.webkitAudioContext;
    if (!Context) return null;
    const browserNavigator = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const conserveResources =
      Boolean(browserNavigator.connection?.saveData) ||
      window.matchMedia('(max-width: 900px)').matches ||
      (browserNavigator.deviceMemory !== undefined &&
        browserNavigator.deviceMemory <= 4);
    engine.current = new RecordedAmbienceEngine(
      Context,
      DEFAULT_VOLUME,
      conserveResources,
    );
    analyser.current = engine.current.analyser;
    engine.current.context.onstatechange = () => {
      const running =
        engine.current?.context.state === 'running' && desiredPlaying.current;
      actuallyPlaying.current = running;
      setIsPlaying(running);
    };
    return engine.current;
  }, []);

  useEffect(() => {
    if (readAudioPreference('blue-hour-sound') !== 'on') return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;

    let cancelled = false;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    const warmEngine = () => {
      if (!cancelled && !document.hidden) ensureEngine();
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleHandle = window.requestIdleCallback(warmEngine, { timeout: 2800 });
    } else {
      timeoutHandle = window.setTimeout(warmEngine, 1800);
    }

    return () => {
      cancelled = true;
      if (
        idleHandle !== undefined &&
        typeof window.cancelIdleCallback === 'function'
      ) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
    };
  }, [ensureEngine]);

  const start = useCallback(async () => {
    const operation = ++audioOperation.current;
    desiredPlaying.current = true;
    startPending.current = true;
    const instance = ensureEngine();
    if (!instance) {
      if (operation === audioOperation.current) {
        desiredPlaying.current = false;
        startPending.current = false;
      }
      return false;
    }
    instance.setChapter(activeChapter);
    const started = await instance.start(isMuted ? 0 : volume);
    if (operation !== audioOperation.current) return false;
    startPending.current = false;
    if (!started) {
      desiredPlaying.current = false;
      shouldResume.current = false;
      actuallyPlaying.current = false;
      setIsPlaying(false);
      return false;
    }
    shouldResume.current = true;
    actuallyPlaying.current = true;
    setIsPlaying(true);
    writeAudioPreference('blue-hour-sound', 'on');
    return true;
  }, [activeChapter, ensureEngine, isMuted, volume]);

  const pause = useCallback(async () => {
    const operation = ++audioOperation.current;
    desiredPlaying.current = false;
    startPending.current = false;
    actuallyPlaying.current = false;
    shouldResume.current = false;
    setIsPlaying(false);
    await engine.current?.pause();
    if (operation !== audioOperation.current) return;
    writeAudioPreference('blue-hour-sound', 'off');
  }, []);

  const toggle = useCallback(async () => {
    if (actuallyPlaying.current || startPending.current) {
      await pause();
    } else {
      await start();
    }
  }, [pause, start]);

  const setVolume = useCallback((nextVolume: number) => {
    const bounded = Math.max(0, Math.min(nextVolume, 0.7));
    if (bounded > 0) previousVolume.current = bounded;
    setVolumeState(bounded);
    setIsMuted(bounded === 0);
    engine.current?.setVolume(bounded);
    writeAudioPreference('blue-hour-volume', String(bounded));
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted || volume === 0) {
      const restored = previousVolume.current || DEFAULT_VOLUME;
      setVolumeState(restored);
      setIsMuted(false);
      engine.current?.setVolume(restored);
      writeAudioPreference('blue-hour-volume', String(restored));
      return;
    }
    setIsMuted(true);
    engine.current?.setVolume(0);
  }, [isMuted, volume]);

  useEffect(() => {
    engine.current?.setChapter(activeChapter);
  }, [activeChapter]);

  useEffect(() => {
    const onVisibility = () => {
      const instance = engine.current;
      if (!instance) return;
      if (document.hidden) {
        startPending.current = false;
        actuallyPlaying.current = false;
        instance.pause().catch(() => {});
        setIsPlaying(false);
      } else if (shouldResume.current) {
        startPending.current = true;
        instance
          .start(isMuted ? 0 : volume)
          .then((started) => {
            startPending.current = false;
            actuallyPlaying.current = started;
            setIsPlaying(started);
          })
          .catch(() => {
            startPending.current = false;
            actuallyPlaying.current = false;
            setIsPlaying(false);
          });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isMuted, volume]);

  useEffect(
    () => () => {
      desiredPlaying.current = false;
      actuallyPlaying.current = false;
      startPending.current = false;
      if (engine.current) engine.current.context.onstatechange = null;
      engine.current?.destroy();
      engine.current = null;
      analyser.current = null;
    },
    [],
  );

  return {
    analyser,
    isPlaying,
    isMuted,
    panelOpen,
    volume,
    start,
    pause,
    toggle,
    toggleMute,
    setPanelOpen,
    setVolume,
  };
}

const BlueHourChapterDispatchContext = createContext<
  ((chapter: number) => void) | null
>(null);

function chapterForPath(pathname: string) {
  if (pathname.startsWith('/projects')) return 1;
  if (pathname.startsWith('/moments')) return 2;
  if (pathname.startsWith('/notes')) return 3;
  if (
    pathname.startsWith('/about') ||
    pathname.startsWith('/library') ||
    pathname.startsWith('/now')
  ) {
    return 4;
  }
  return 0;
}

export function BlueHourAudioProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routeChapter = chapterForPath(pathname);
  const [chapterSelection, setChapterSelection] = useState<{
    pathname: string;
    chapter: number;
  } | null>(null);
  const activeChapter =
    chapterSelection?.pathname === pathname
      ? chapterSelection.chapter
      : routeChapter;
  const audio = useBlueHourAudio(activeChapter);
  const startRef = useRef(audio.start);
  const playingRef = useRef(audio.isPlaying);
  const startPending = useRef(false);

  const setActiveChapter = useCallback(
    (chapter: number) => {
      setChapterSelection({
        pathname,
        chapter: Math.max(0, Math.min(chapter, chapterNames.length - 1)),
      });
    },
    [pathname],
  );

  useEffect(() => {
    startRef.current = audio.start;
    playingRef.current = audio.isPlaying;
  }, [audio.isPlaying, audio.start]);

  useEffect(() => {
    if (readAudioPreference('blue-hour-sound') !== 'on') return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;

    const cleanup = () => {
      window.removeEventListener('click', onGesture, true);
      window.removeEventListener('keydown', onGesture, true);
    };

    const onGesture = (event: MouseEvent | KeyboardEvent) => {
      if (playingRef.current) {
        cleanup();
        return;
      }

      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('[data-blue-hour-audio-toggle]')
      ) {
        cleanup();
        return;
      }

      if (readAudioPreference('blue-hour-sound') !== 'on') {
        cleanup();
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

      if (startPending.current) return;
      startPending.current = true;
      void startRef
        .current()
        .then((started) => {
          if (started) cleanup();
        })
        .catch(() => {
          // Keep the listener armed for the next eligible interaction.
        })
        .finally(() => {
          startPending.current = false;
        });
    };

    window.addEventListener('click', onGesture, {
      capture: true,
    });
    window.addEventListener('keydown', onGesture, true);
    return cleanup;
  }, []);

  return (
    <BlueHourChapterDispatchContext.Provider value={setActiveChapter}>
      {children}
      <AudioControl audio={audio} activeChapter={activeChapter} />
    </BlueHourChapterDispatchContext.Provider>
  );
}

export function useBlueHourChapterDispatch() {
  const setActiveChapter = useContext(BlueHourChapterDispatchContext);
  if (!setActiveChapter) {
    throw new Error(
      'useBlueHourChapterDispatch must be used within BlueHourAudioProvider',
    );
  }
  return setActiveChapter;
}

function AudioOrb({
  analyser,
  active,
}: {
  analyser: MutableRefObject<AnalyserNode | null>;
  active: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d');
    if (!context) return;
    let raf = 0;
    let lastFrame = 0;
    const frameInterval = 1000 / 24;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const values = new Uint8Array(analyser.current?.frequencyBinCount ?? 64);

    const draw = (live: boolean) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const size = element.clientWidth || 38;
      const nextSize = Math.round(size * ratio);
      if (element.width !== nextSize || element.height !== nextSize) {
        element.width = nextSize;
        element.height = nextSize;
      }

      context.clearRect(0, 0, nextSize, nextSize);
      context.save();
      context.scale(ratio, ratio);
      context.translate(size / 2, size / 2);

      const node = analyser.current;
      if (node && live) node.getByteFrequencyData(values);

      const bars = 14;
      for (let index = 0; index < bars; index += 1) {
        const value = live ? values[index % values.length] / 255 : 0.08;
        const angle = (Math.PI * 2 * index) / bars - Math.PI / 2;
        const inner = size * 0.25;
        const length = 2.5 + value * size * 0.17;
        context.beginPath();
        context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
        context.lineTo(
          Math.cos(angle) * (inner + length),
          Math.sin(angle) * (inner + length),
        );
        context.strokeStyle = `rgba(244, 183, 112, ${0.35 + value * 0.65})`;
        context.lineWidth = 1.35;
        context.lineCap = 'round';
        context.stroke();
      }
      context.restore();
    };

    const stop = () => {
      window.cancelAnimationFrame(raf);
      raf = 0;
    };
    const loop = (timestamp: number) => {
      if (timestamp - lastFrame >= frameInterval) {
        draw(true);
        lastFrame = timestamp;
      }
      raf = window.requestAnimationFrame(loop);
    };
    const sync = () => {
      stop();
      if (active && !document.hidden && !reduced.matches) {
        lastFrame = 0;
        raf = window.requestAnimationFrame(loop);
      } else {
        draw(false);
      }
    };

    sync();
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
    };
  }, [active, analyser]);

  return <canvas ref={canvas} className={styles.audioOrb} aria-hidden="true" />;
}

export function AudioControl({
  audio,
  activeChapter,
}: {
  audio: AudioExperience;
  activeChapter: number;
}) {
  const settingsButton = useRef<HTMLButtonElement>(null);
  const firstPanelControl = useRef<HTMLButtonElement>(null);
  const setPanelOpen = audio.setPanelOpen;
  const track = chapterTracks[activeChapter] ?? chapterTracks[0];
  const effectiveMuted = audio.isMuted || audio.volume === 0;
  const volumeIcon =
    effectiveMuted ? (
      <VolumeX size={15} />
    ) : audio.volume < 0.3 ? (
      <Volume1 size={15} />
    ) : (
      <Volume2 size={15} />
    );

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    window.requestAnimationFrame(() => settingsButton.current?.focus());
  }, [setPanelOpen]);

  useEffect(() => {
    if (!audio.panelOpen) return;
    const focusFrame = window.requestAnimationFrame(() =>
      firstPanelControl.current?.focus(),
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closePanel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [audio.panelOpen, closePanel]);

  return (
    <div className={styles.audioDock} data-blue-hour-audio-root>
      {audio.panelOpen && (
        <div
          id="blue-hour-audio-panel"
          className={styles.audioPanel}
          role="group"
          aria-label="Ambient sound"
        >
          <div className={styles.audioPanelHead}>
            <div>
              <span>
                Field recording · {String(activeChapter + 1).padStart(2, '0')}
              </span>
              <strong>{track.title}</strong>
            </div>
            <button
              ref={firstPanelControl}
              type="button"
              onClick={closePanel}
              aria-label="Close sound controls"
            >
              <X size={15} />
            </button>
          </div>
          <div className={styles.volumeRow}>
            <button
              type="button"
              className={styles.muteButton}
              onClick={audio.toggleMute}
              aria-label={effectiveMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
              aria-pressed={effectiveMuted}
            >
              {volumeIcon}
            </button>
            <label className={styles.srOnly} htmlFor="blue-hour-volume">
              Ambient sound volume
            </label>
            <input
              id="blue-hour-volume"
              type="range"
              min="0"
              max="0.7"
              step="0.01"
              value={audio.volume}
              onChange={(event) => audio.setVolume(Number(event.target.value))}
            />
          </div>
          <p className={styles.audioDescription}>{track.description}</p>
          <a
            className={styles.audioCredit}
            href={track.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            {track.sourceName} · Mixkit
          </a>
        </div>
      )}
      <div className={styles.audioQuick}>
        <button
          type="button"
          className={styles.audioButton}
          data-blue-hour-audio-toggle
          onClick={() => audio.toggle().catch(() => {})}
          aria-label={
            audio.isPlaying
              ? `Pause ${track.title}`
              : `Play ${track.title}`
          }
          aria-pressed={audio.isPlaying}
        >
          <AudioOrb analyser={audio.analyser} active={audio.isPlaying} />
          <span className={styles.audioState} aria-live="polite">
            {audio.isPlaying
              ? effectiveMuted
                ? 'Muted'
                : track.shortLabel
              : 'Play ambience'}
          </span>
          {audio.isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          ref={settingsButton}
          type="button"
          className={styles.audioSettingsButton}
          onClick={() => audio.setPanelOpen(!audio.panelOpen)}
          aria-label="Ambient sound settings"
          aria-expanded={audio.panelOpen}
          aria-controls="blue-hour-audio-panel"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>
    </div>
  );
}
