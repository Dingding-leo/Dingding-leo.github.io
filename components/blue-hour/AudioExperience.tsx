'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from 'react';
import {
  Pause,
  Play,
  SlidersHorizontal,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import styles from './BlueHourSite.module.css';

type AudioContextConstructor = typeof AudioContext;

const chapterChords = [
  [73.42, 110, 146.83],
  [82.41, 123.47, 164.81],
  [73.42, 110, 164.81],
  [82.41, 123.47, 185],
  [65.41, 98, 146.83],
];

const chapterFilters = [640, 520, 760, 430, 340];
const chapterNames = [
  'Bearing',
  'The Opening',
  'What the Tide Kept',
  'Water in the Dark',
  'One Window Left',
];

class BlueHourEngine {
  context: AudioContext;
  analyser: AnalyserNode;
  master: GainNode;
  filter: BiquadFilterNode;
  oscillators: OscillatorNode[] = [];
  noise?: AudioBufferSourceNode;
  bellTimer?: number;
  suspendTimer?: number;
  chapter = 0;
  volume = 0.34;
  disposed = false;
  desiredPlaying = false;

  constructor(Context: AudioContextConstructor) {
    this.context = new Context();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.84;

    this.master = this.context.createGain();
    this.master.gain.value = 0;
    this.filter = this.context.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = chapterFilters[0];
    this.filter.Q.value = 0.42;

    this.filter.connect(this.master);
    this.master.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.createPad();
    this.createNoise();
    this.scheduleBell();
  }

  private createPad() {
    const now = this.context.currentTime;
    chapterChords[0].forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const stereo = this.context.createStereoPanner();

      oscillator.type = index === 1 ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.detune.value = index === 0 ? -6 : index === 2 ? 7 : 0;
      gain.gain.value = index === 1 ? 0.035 : 0.027;
      stereo.pan.value = index === 0 ? -0.38 : index === 2 ? 0.38 : 0;

      oscillator.connect(gain);
      gain.connect(stereo);
      stereo.connect(this.filter);
      oscillator.start();
      this.oscillators.push(oscillator);
    });
  }

  private createNoise() {
    const length = this.context.sampleRate * 4;
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;

    for (let index = 0; index < length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = last * 0.985 + white * 0.015;
      data[index] = last * 2.2;
    }

    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = 'bandpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.24;
    gain.gain.value = 0.036;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.filter);
    source.start();
    this.noise = source;
  }

  private scheduleBell() {
    if (this.disposed) return;
    const delay = 6500 + Math.random() * 5200;
    this.bellTimer = window.setTimeout(() => {
      if (this.context.state === 'running') this.playBell();
      this.scheduleBell();
    }, delay);
  }

  private playBell() {
    const now = this.context.currentTime;
    const root = chapterChords[this.chapter][1] * (Math.random() > 0.58 ? 2 : 1);
    const oscillator = this.context.createOscillator();
    const overtone = this.context.createOscillator();
    const gain = this.context.createGain();
    const overtoneGain = this.context.createGain();
    const pan = this.context.createStereoPanner();

    oscillator.type = 'sine';
    overtone.type = 'sine';
    oscillator.frequency.setValueAtTime(root, now);
    overtone.frequency.setValueAtTime(root * 2.01, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);
    overtoneGain.gain.value = 0.18;
    pan.pan.value = Math.random() * 1.2 - 0.6;

    oscillator.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(pan);
    pan.connect(this.filter);
    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(now + 3.8);
    overtone.stop(now + 3.8);
  }

  async start(volume = this.volume) {
    this.desiredPlaying = true;
    if (this.suspendTimer) {
      window.clearTimeout(this.suspendTimer);
      this.suspendTimer = undefined;
    }
    this.volume = volume;
    await this.context.resume();
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0001), now + 1.8);
  }

  async pause() {
    this.desiredPlaying = false;
    if (this.context.state !== 'running') return;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    if (this.suspendTimer) window.clearTimeout(this.suspendTimer);
    this.suspendTimer = window.setTimeout(() => {
      if (!this.disposed && !this.desiredPlaying && this.master.gain.value < 0.001) {
        this.context.suspend().catch(() => {});
      }
    }, 520);
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (this.context.state !== 'running') return;
    const now = this.context.currentTime;
    const currentValue = Math.max(this.master.gain.value, 0.0001);
    if (typeof this.master.gain.cancelAndHoldAtTime === 'function') {
      this.master.gain.cancelAndHoldAtTime(now);
    } else {
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(currentValue, now);
    }
    this.master.gain.setTargetAtTime(Math.max(volume, 0.0001), now, 0.18);
  }

  setChapter(chapter: number) {
    this.chapter = Math.max(0, Math.min(chapter, chapterChords.length - 1));
    const now = this.context.currentTime;
    chapterChords[this.chapter].forEach((frequency, index) => {
      const parameter = this.oscillators[index]?.frequency;
      if (!parameter) return;
      parameter.cancelScheduledValues(now);
      parameter.setValueAtTime(Math.max(parameter.value, 0.001), now);
      parameter.exponentialRampToValueAtTime(frequency, now + 3.2);
    });
    this.filter.frequency.cancelScheduledValues(now);
    this.filter.frequency.setValueAtTime(
      Math.max(this.filter.frequency.value, 0.001),
      now,
    );
    this.filter.frequency.exponentialRampToValueAtTime(
      chapterFilters[this.chapter],
      now + 2.4,
    );
  }

  destroy() {
    this.disposed = true;
    if (this.bellTimer) window.clearTimeout(this.bellTimer);
    if (this.suspendTimer) window.clearTimeout(this.suspendTimer);
    this.noise?.stop();
    this.oscillators.forEach((oscillator) => oscillator.stop());
    this.context.close().catch(() => {});
  }
}

export type AudioExperience = {
  analyser: MutableRefObject<AnalyserNode | null>;
  isPlaying: boolean;
  isMuted: boolean;
  panelOpen: boolean;
  volume: number;
  start: () => Promise<void>;
  pause: () => Promise<void>;
  toggle: () => Promise<void>;
  toggleMute: () => void;
  setPanelOpen: (open: boolean) => void;
  setVolume: (volume: number) => void;
};

export function useBlueHourAudio(activeChapter: number): AudioExperience {
  const engine = useRef<BlueHourEngine | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const shouldResume = useRef(false);
  const previousVolume = useRef(0.34);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [volume, setVolumeState] = useState(0.34);

  const ensureEngine = useCallback(() => {
    if (engine.current) return engine.current;
    const browserWindow = window as typeof window & {
      webkitAudioContext?: AudioContextConstructor;
    };
    const Context = window.AudioContext || browserWindow.webkitAudioContext;
    if (!Context) return null;
    engine.current = new BlueHourEngine(Context);
    analyser.current = engine.current.analyser;
    return engine.current;
  }, []);

  const start = useCallback(async () => {
    const instance = ensureEngine();
    if (!instance) return;
    instance.setChapter(activeChapter);
    await instance.start(isMuted ? 0 : volume);
    shouldResume.current = true;
    setIsPlaying(true);
    window.localStorage.setItem('blue-hour-sound', 'on');
  }, [activeChapter, ensureEngine, isMuted, volume]);

  const pause = useCallback(async () => {
    shouldResume.current = false;
    await engine.current?.pause();
    setIsPlaying(false);
    window.localStorage.setItem('blue-hour-sound', 'off');
  }, []);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await start();
    }
  }, [isPlaying, pause, start]);

  const setVolume = useCallback((nextVolume: number) => {
    const bounded = Math.max(0, Math.min(nextVolume, 0.7));
    if (bounded > 0) previousVolume.current = bounded;
    setVolumeState(bounded);
    setIsMuted(bounded === 0);
    engine.current?.setVolume(bounded);
    window.localStorage.setItem('blue-hour-volume', String(bounded));
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted || volume === 0) {
      const restored = previousVolume.current || 0.34;
      setVolumeState(restored);
      setIsMuted(false);
      engine.current?.setVolume(restored);
      window.localStorage.setItem('blue-hour-volume', String(restored));
      return;
    }
    setIsMuted(true);
    engine.current?.setVolume(0);
  }, [isMuted, volume]);

  useEffect(() => {
    const rawStored = window.localStorage.getItem('blue-hour-volume');
    if (rawStored === null) return;
    const stored = Number(rawStored);
    if (Number.isFinite(stored) && stored >= 0 && stored <= 0.7) {
      setVolumeState(stored);
      setIsMuted(stored === 0);
      if (stored > 0) previousVolume.current = stored;
    }
  }, []);

  useEffect(() => {
    engine.current?.setChapter(activeChapter);
  }, [activeChapter]);

  useEffect(() => {
    const onVisibility = () => {
      const instance = engine.current;
      if (!instance) return;
      if (document.hidden) {
        instance.pause().catch(() => {});
        setIsPlaying(false);
      } else if (shouldResume.current) {
        instance
          .start(isMuted ? 0 : volume)
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isMuted, volume]);

  useEffect(
    () => () => {
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
    const loop = () => {
      draw(true);
      raf = window.requestAnimationFrame(loop);
    };
    const sync = () => {
      stop();
      if (active && !document.hidden && !reduced.matches) {
        loop();
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
    <div className={styles.audioDock}>
      {audio.panelOpen && (
        <div
          id="blue-hour-audio-panel"
          className={styles.audioPanel}
          role="group"
          aria-label="Ambient sound"
        >
          <div className={styles.audioPanelHead}>
            <div>
              <span>Ambient movement</span>
              <strong>{chapterNames[activeChapter]}</strong>
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
          <p>Generative audio · no recording, no loop</p>
        </div>
      )}
      <div className={styles.audioQuick}>
        <button
          type="button"
          className={styles.audioButton}
          onClick={() => audio.toggle().catch(() => {})}
          aria-label={audio.isPlaying ? 'Pause ambient soundtrack' : 'Play ambient soundtrack'}
          aria-pressed={audio.isPlaying}
        >
          <AudioOrb analyser={audio.analyser} active={audio.isPlaying} />
          <span className={styles.audioState}>
            {audio.isPlaying ? 'Sound on' : 'Sound off'}
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
