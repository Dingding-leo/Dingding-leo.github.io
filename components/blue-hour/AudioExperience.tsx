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

const pianoVoicings = [
  [146.83, 220, 293.66, 349.23],
  [164.81, 246.94, 329.63, 392],
  [146.83, 220, 329.63, 369.99],
  [123.47, 185, 246.94, 293.66],
  [130.81, 196, 293.66, 329.63],
];

const chapterFilters = [720, 580, 820, 490, 390];
const chapterNames = [
  'Bearing',
  'The Opening',
  'What the Tide Kept',
  'Water in the Dark',
  'One Window Left',
];
const DEFAULT_VOLUME = 0.28;

function readAudioPreference(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeAudioPreference(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Audio remains usable when storage is blocked.
  }
}

class BlueHourEngine {
  context: AudioContext;
  analyser: AnalyserNode;
  master: GainNode;
  compressor: DynamicsCompressorNode;
  padFilter: BiquadFilterNode;
  rainBus: GainNode;
  pianoDry: GainNode;
  pianoWet: GainNode;
  reverb: ConvolverNode;
  oscillators: OscillatorNode[] = [];
  continuousSources: AudioScheduledSourceNode[] = [];
  transientSources = new Set<AudioScheduledSourceNode>();
  rainDropBuffer: AudioBuffer;
  rainTimer?: number;
  pianoTimer?: number;
  suspendTimer?: number;
  chapter = 0;
  volume = DEFAULT_VOLUME;
  disposed = false;
  desiredPlaying = false;
  operation = 0;
  pianoIntroduced = false;

  constructor(Context: AudioContextConstructor) {
    this.context = new Context();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.88;

    this.master = this.context.createGain();
    this.master.gain.value = 0.0001;
    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.value = -18;
    this.compressor.knee.value = 12;
    this.compressor.ratio.value = 3.5;
    this.compressor.attack.value = 0.004;
    this.compressor.release.value = 0.3;

    this.padFilter = this.context.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.frequency.value = chapterFilters[0];
    this.padFilter.Q.value = 0.42;

    this.rainBus = this.context.createGain();
    this.rainBus.gain.value = 0.82;
    this.pianoDry = this.context.createGain();
    this.pianoDry.gain.value = 0.84;
    this.pianoWet = this.context.createGain();
    this.pianoWet.gain.value = 0.14;
    this.reverb = this.context.createConvolver();
    this.reverb.normalize = true;
    this.reverb.buffer = this.createReverbImpulse();
    this.rainDropBuffer = this.createRainDropBuffer();

    this.padFilter.connect(this.compressor);
    this.rainBus.connect(this.compressor);
    this.pianoDry.connect(this.compressor);
    this.pianoWet.connect(this.compressor);
    this.reverb.connect(this.pianoWet);
    this.compressor.connect(this.master);
    this.master.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.createPad();
    this.createRain();
  }

  private createPad() {
    const now = this.context.currentTime;
    chapterChords[0].forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const stereo = this.context.createStereoPanner?.();

      oscillator.type = index === 1 ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.detune.value = index === 0 ? -6 : index === 2 ? 7 : 0;
      gain.gain.value = index === 1 ? 0.014 : 0.011;

      oscillator.connect(gain);
      if (stereo) {
        stereo.pan.value = index === 0 ? -0.38 : index === 2 ? 0.38 : 0;
        gain.connect(stereo);
        stereo.connect(this.padFilter);
      } else {
        gain.connect(this.padFilter);
      }
      oscillator.start();
      this.oscillators.push(oscillator);
      this.continuousSources.push(oscillator);
    });
  }

  private createRain() {
    const length = Math.ceil(this.context.sampleRate * 3.5);
    const buffer = this.context.createBuffer(2, length, this.context.sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const data = buffer.getChannelData(channel);
      let slow = 0;
      for (let index = 0; index < length; index += 1) {
        const white = Math.random() * 2 - 1;
        slow = slow * 0.94 + white * 0.06;
        data[index] = white * 0.62 + slow * 0.7;
      }
    }

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const rainHighpass = this.context.createBiquadFilter();
    const rainLowpass = this.context.createBiquadFilter();
    const rainBedGain = this.context.createGain();
    rainHighpass.type = 'highpass';
    rainHighpass.frequency.value = 190;
    rainLowpass.type = 'lowpass';
    rainLowpass.frequency.value = 7800;
    rainBedGain.gain.value = 0.068;
    source.connect(rainHighpass);
    rainHighpass.connect(rainLowpass);
    rainLowpass.connect(rainBedGain);
    rainBedGain.connect(this.rainBus);

    const detailFilter = this.context.createBiquadFilter();
    const detailGain = this.context.createGain();
    detailFilter.type = 'bandpass';
    detailFilter.frequency.value = 3300;
    detailFilter.Q.value = 0.48;
    detailGain.gain.value = 0.026;
    source.connect(detailFilter);
    detailFilter.connect(detailGain);
    detailGain.connect(this.rainBus);

    const drift = this.context.createOscillator();
    const driftDepth = this.context.createGain();
    drift.type = 'sine';
    drift.frequency.value = 0.055;
    driftDepth.gain.value = 0.08;
    drift.connect(driftDepth);
    driftDepth.connect(this.rainBus.gain);

    source.start();
    drift.start();
    this.continuousSources.push(source, drift);
  }

  private createRainDropBuffer() {
    const duration = 0.16;
    const length = Math.ceil(this.context.sampleRate * duration);
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) {
      const envelope = Math.pow(1 - index / length, 3.4);
      data[index] = (Math.random() * 2 - 1) * envelope;
    }
    return buffer;
  }

  private createReverbImpulse() {
    const duration = 1.9;
    const length = Math.ceil(this.context.sampleRate * duration);
    const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const data = impulse.getChannelData(channel);
      for (let index = 0; index < length; index += 1) {
        const decay = Math.pow(1 - index / length, 3.2);
        data[index] = (Math.random() * 2 - 1) * decay * 0.42;
      }
    }
    return impulse;
  }

  private trackTransient(
    source: AudioScheduledSourceNode,
    cleanupNodes: AudioNode[],
  ) {
    this.transientSources.add(source);
    source.onended = () => {
      this.transientSources.delete(source);
      cleanupNodes.forEach((node) => {
        try {
          node.disconnect();
        } catch {
          // The shared graph may already have been released by another voice.
        }
      });
    };
  }

  private scheduleRain() {
    if (this.disposed || !this.desiredPlaying || this.rainTimer) return;
    const delay = 320 + Math.random() * 620;
    this.rainTimer = window.setTimeout(() => {
      this.rainTimer = undefined;
      if (this.context.state === 'running' && this.desiredPlaying) {
        const cluster = Math.random() < 0.16 ? 2 + Math.floor(Math.random() * 2) : 1;
        for (let index = 0; index < cluster; index += 1) {
          this.playRainDrop(index * (0.045 + Math.random() * 0.08));
        }
      }
      this.scheduleRain();
    }, delay);
  }

  private playRainDrop(offset = 0) {
    const now = this.context.currentTime + offset;
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = this.rainDropBuffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800 + Math.random() * 3600, now);
    filter.Q.value = 0.7 + Math.random() * 1.1;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.012 + Math.random() * 0.018, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09 + Math.random() * 0.07);
    source.connect(filter);
    filter.connect(gain);

    const stereo = this.context.createStereoPanner?.();
    if (stereo) {
      stereo.pan.value = Math.random() * 1.6 - 0.8;
      gain.connect(stereo);
      stereo.connect(this.rainBus);
    } else {
      gain.connect(this.rainBus);
    }

    this.trackTransient(
      source,
      stereo ? [source, filter, gain, stereo] : [source, filter, gain],
    );
    source.start(now);
    source.stop(now + 0.17);
  }

  private schedulePiano(initial = false) {
    if (this.disposed || !this.desiredPlaying || this.pianoTimer) return;
    const delay = initial
      ? 1800 + Math.random() * 2200
      : 7200 + Math.random() * 6800;
    this.pianoTimer = window.setTimeout(() => {
      this.pianoTimer = undefined;
      if (this.context.state === 'running' && this.desiredPlaying) {
        this.pianoIntroduced = true;
        const notes = pianoVoicings[this.chapter];
        const firstIndex = Math.floor(Math.random() * notes.length);
        this.playPianoNote(notes[firstIndex], 0);
        if (Math.random() < 0.34) {
          const secondIndex = (firstIndex + 1 + Math.floor(Math.random() * 2)) % notes.length;
          this.playPianoNote(notes[secondIndex], 0.85 + Math.random() * 0.85);
        }
      }
      this.schedulePiano(false);
    }, delay);
  }

  private holdMasterAt(now: number) {
    const currentValue = Math.max(this.master.gain.value, 0.0001);
    if (typeof this.master.gain.cancelAndHoldAtTime === 'function') {
      this.master.gain.cancelAndHoldAtTime(now);
    } else {
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(currentValue, now);
    }
  }

  private playPianoNote(frequency: number, offset: number) {
    const now = this.context.currentTime + offset;
    const noteGain = this.context.createGain();
    const toneFilter = this.context.createBiquadFilter();
    const stereo = this.context.createStereoPanner?.();
    const duration = 4.2 + Math.random() * 1.1;
    const harmonics = [
      { ratio: 1, level: 0.72, type: 'triangle' as OscillatorType },
      { ratio: 2.002, level: 0.18, type: 'sine' as OscillatorType },
      { ratio: 3.01, level: 0.065, type: 'sine' as OscillatorType },
    ];
    const voiceSources: OscillatorNode[] = [];
    const voiceNodes: AudioNode[] = [noteGain, toneFilter];
    if (stereo) voiceNodes.push(stereo);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.048, now + 0.012);
    noteGain.gain.exponentialRampToValueAtTime(0.019, now + 0.18);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    toneFilter.type = 'lowpass';
    toneFilter.frequency.setValueAtTime(3600, now);
    toneFilter.frequency.exponentialRampToValueAtTime(820, now + duration);
    toneFilter.Q.value = 0.36;

    noteGain.connect(toneFilter);
    if (stereo) {
      stereo.pan.value = Math.random() * 0.9 - 0.45;
      toneFilter.connect(stereo);
      stereo.connect(this.pianoDry);
      stereo.connect(this.reverb);
    } else {
      toneFilter.connect(this.pianoDry);
      toneFilter.connect(this.reverb);
    }
    harmonics.forEach(({ ratio, level, type }) => {
      const oscillator = this.context.createOscillator();
      const harmonicGain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency * ratio, now);
      oscillator.detune.value = (Math.random() - 0.5) * 2.4;
      harmonicGain.gain.value = level;
      oscillator.connect(harmonicGain);
      harmonicGain.connect(noteGain);
      voiceSources.push(oscillator);
      voiceNodes.push(harmonicGain);
      this.transientSources.add(oscillator);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.08);
    });

    let remainingSources = voiceSources.length;
    voiceSources.forEach((source) => {
      source.onended = () => {
        this.transientSources.delete(source);
        remainingSources -= 1;
        if (remainingSources > 0) {
          source.disconnect();
          return;
        }
        [...voiceSources, ...voiceNodes].forEach((node) => {
          try {
            node.disconnect();
          } catch {
            // Another cleanup path may already have released this node.
          }
        });
      };
    });
  }

  async start(volume = this.volume) {
    const operation = ++this.operation;
    this.desiredPlaying = true;
    if (this.suspendTimer) {
      window.clearTimeout(this.suspendTimer);
      this.suspendTimer = undefined;
    }
    this.volume = volume;
    try {
      await this.context.resume();
    } catch {
      if (operation === this.operation) this.desiredPlaying = false;
      return false;
    }
    if (
      operation !== this.operation ||
      !this.desiredPlaying ||
      this.context.state !== 'running'
    ) {
      if (operation === this.operation) this.desiredPlaying = false;
      if (!this.desiredPlaying && this.context.state === 'running') {
        const pausedOperation = this.operation;
        await this.context.suspend().catch(() => {});
        if (
          this.desiredPlaying &&
          pausedOperation !== this.operation
        ) {
          await this.context.resume().catch(() => {});
        }
      }
      return false;
    }
    const now = this.context.currentTime;
    this.holdMasterAt(now);
    this.master.gain.exponentialRampToValueAtTime(
      Math.max(this.volume, 0.0001),
      now + 2.4,
    );
    this.scheduleRain();
    this.schedulePiano(!this.pianoIntroduced);
    return true;
  }

  async pause() {
    this.operation += 1;
    this.desiredPlaying = false;
    if (this.rainTimer) {
      window.clearTimeout(this.rainTimer);
      this.rainTimer = undefined;
    }
    if (this.pianoTimer) {
      window.clearTimeout(this.pianoTimer);
      this.pianoTimer = undefined;
    }
    const now = this.context.currentTime;
    const wasRunning = this.context.state === 'running';
    if (wasRunning) {
      this.holdMasterAt(now);
      this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    } else {
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(0.0001, now);
    }
    this.transientSources.forEach((source) => {
      try {
        source.stop(wasRunning ? now + 0.46 : now);
      } catch {
        // One-shot sources can already be ending when pause is requested.
      }
    });
    if (!wasRunning) {
      await this.context.suspend().catch(() => {});
      return;
    }
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
    this.padFilter.frequency.cancelScheduledValues(now);
    this.padFilter.frequency.setValueAtTime(
      Math.max(this.padFilter.frequency.value, 0.001),
      now,
    );
    this.padFilter.frequency.exponentialRampToValueAtTime(
      chapterFilters[this.chapter],
      now + 2.4,
    );
  }

  destroy() {
    this.disposed = true;
    if (this.rainTimer) window.clearTimeout(this.rainTimer);
    if (this.pianoTimer) window.clearTimeout(this.pianoTimer);
    if (this.suspendTimer) window.clearTimeout(this.suspendTimer);
    [...this.continuousSources, ...this.transientSources].forEach((source) => {
      source.onended = null;
      try {
        source.stop();
      } catch {
        // Safari can throw if a one-shot source has already ended.
      }
      source.disconnect();
    });
    this.transientSources.clear();
    this.context.close().catch(() => {});
  }
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
  const engine = useRef<BlueHourEngine | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const shouldResume = useRef(false);
  const desiredPlaying = useRef(false);
  const actuallyPlaying = useRef(false);
  const startPending = useRef(false);
  const audioOperation = useRef(0);
  const previousVolume = useRef(DEFAULT_VOLUME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);

  const ensureEngine = useCallback(() => {
    if (engine.current) return engine.current;
    const browserWindow = window as typeof window & {
      webkitAudioContext?: AudioContextConstructor;
    };
    const Context = window.AudioContext || browserWindow.webkitAudioContext;
    if (!Context) return null;
    engine.current = new BlueHourEngine(Context);
    analyser.current = engine.current.analyser;
    engine.current.context.onstatechange = () => {
      const running =
        engine.current?.context.state === 'running' && desiredPlaying.current;
      actuallyPlaying.current = running;
      setIsPlaying(running);
    };
    return engine.current;
  }, []);

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
    const rawStored = readAudioPreference('blue-hour-volume');
    if (rawStored === null) return;
    const stored = Number(rawStored);
    if (Number.isFinite(stored) && stored >= 0 && stored <= 0.7) {
      setVolumeState(stored);
      setIsMuted(stored === 0);
      if (stored > 0) previousVolume.current = stored;
      engine.current?.setVolume(stored);
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
              <span>Rain study</span>
              <strong>Rain over {chapterNames[activeChapter]}</strong>
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
          <p>Original rain and piano, generated live in your browser.</p>
        </div>
      )}
      <div className={styles.audioQuick}>
        <button
          type="button"
          className={styles.audioButton}
          data-blue-hour-audio-toggle
          onClick={() => audio.toggle().catch(() => {})}
          aria-label={audio.isPlaying ? 'Pause rain and piano' : 'Play rain and piano'}
          aria-pressed={audio.isPlaying}
        >
          <AudioOrb analyser={audio.analyser} active={audio.isPlaying} />
          <span className={styles.audioState} aria-live="polite">
            {effectiveMuted
              ? 'Muted'
              : audio.isPlaying
                ? 'Rain + piano'
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
