export type AudioContextConstructor = typeof AudioContext;

export const chapterTracks = [
  {
    chapter: 'Bearing',
    title: 'Storm Coast',
    shortLabel: 'Storm coast',
    description: 'Stormy sea waves rolling beneath the lighthouse.',
    src: '/assets/audio/blue-hour/01-storm-coast.mp3?v=20260731',
    sourceUrl: 'https://mixkit.co/free-sound-effects/sea/',
    sourceName: 'Stormy sea waves loop',
  },
  {
    chapter: 'The Opening',
    title: 'Mountain Wind',
    shortLabel: 'Mountain wind',
    description: 'Exposed wind moving across a high mountain ridge.',
    src: '/assets/audio/blue-hour/02-mountain-wind.mp3?v=20260731',
    sourceUrl: 'https://mixkit.co/free-sound-effects/mountain/',
    sourceName: 'Wind in the top of the mountain',
  },
  {
    chapter: 'What the Tide Kept',
    title: 'The Returning Tide',
    shortLabel: 'Soft tide',
    description: 'A calmer sea breathing through the tidal channel.',
    src: '/assets/audio/blue-hour/03-tidal-sea.mp3?v=20260731',
    sourceUrl: 'https://mixkit.co/free-sound-effects/sea/',
    sourceName: 'Sea waves ambience',
  },
  {
    chapter: 'Water in the Dark',
    title: 'Forest Waterfall',
    shortLabel: 'Forest water',
    description: 'A real waterfall recorded close among the trees.',
    src: '/assets/audio/blue-hour/04-forest-waterfall.mp3?v=20260731',
    sourceUrl: 'https://mixkit.co/free-sound-effects/waterfall/',
    sourceName: 'Waterfall in the woods',
  },
  {
    chapter: 'One Window Left',
    title: 'Rain on the Roof',
    shortLabel: 'Cabin rain',
    description: 'Heavy rain striking the roof outside the last warm window.',
    src: '/assets/audio/blue-hour/05-cabin-rain.mp3?v=20260731',
    sourceUrl: 'https://mixkit.co/free-sound-effects/rain/',
    sourceName: 'Heavy rain over metal roof',
  },
] as const;

type PlayingTrack = {
  chapter: number;
  source: AudioBufferSourceNode;
  gain: GainNode;
};

const CROSSFADE_SECONDS = 2.6;
const MASTER_FADE_SECONDS = 0.65;

export class RecordedAmbienceEngine {
  context: AudioContext;
  analyser: AnalyserNode;
  master: GainNode;
  compressor: DynamicsCompressorNode;
  chapter = 0;
  volume: number;
  desiredPlaying = false;
  disposed = false;

  private activeTrack: PlayingTrack | null = null;
  private retiringTracks = new Set<PlayingTrack>();
  private buffers = new Map<number, AudioBuffer>();
  private pendingBuffers = new Map<number, Promise<AudioBuffer>>();
  private lifecycleOperation = 0;
  private switchOperation = 0;
  private suspendTimer?: number;
  private preloadTimer?: number;
  private conserveResources: boolean;

  constructor(
    Context: AudioContextConstructor,
    volume: number,
    conserveResources = false,
  ) {
    this.context = new Context();
    this.volume = volume;
    this.conserveResources = conserveResources;

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.86;

    this.master = this.context.createGain();
    this.master.gain.value = 0.0001;

    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.value = -17;
    this.compressor.knee.value = 9;
    this.compressor.ratio.value = 2.4;
    this.compressor.attack.value = 0.012;
    this.compressor.release.value = 0.34;

    this.compressor.connect(this.master);
    this.master.connect(this.analyser);
    this.analyser.connect(this.context.destination);
  }

  private hold(parameter: AudioParam, now: number) {
    if (typeof parameter.cancelAndHoldAtTime === 'function') {
      parameter.cancelAndHoldAtTime(now);
      return;
    }
    const current = Math.max(parameter.value, 0.0001);
    parameter.cancelScheduledValues(now);
    parameter.setValueAtTime(current, now);
  }

  private shouldRetainBuffer(chapter: number) {
    if (chapter === this.chapter) return true;
    return (
      !this.conserveResources &&
      chapter === (this.chapter + 1) % chapterTracks.length
    );
  }

  private async loadTrack(chapter: number) {
    const bounded = Math.max(0, Math.min(chapter, chapterTracks.length - 1));
    const cached = this.buffers.get(bounded);
    if (cached) return cached;

    const pending = this.pendingBuffers.get(bounded);
    if (pending) return pending;

    const load = fetch(chapterTracks[bounded].src, {
      cache: 'force-cache',
      credentials: 'same-origin',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load ambience ${bounded + 1}`);
        }
        return response.arrayBuffer();
      })
      .then((bytes) => this.context.decodeAudioData(bytes))
      .then((buffer) => {
        if (this.shouldRetainBuffer(bounded)) {
          this.buffers.set(bounded, buffer);
        }
        this.pendingBuffers.delete(bounded);
        return buffer;
      })
      .catch((error) => {
        this.pendingBuffers.delete(bounded);
        throw error;
      });

    this.pendingBuffers.set(bounded, load);
    return load;
  }

  private createPlayingTrack(
    chapter: number,
    buffer: AudioBuffer,
    initialGain: number,
  ) {
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    source.loop = true;
    gain.gain.value = initialGain;
    source.connect(gain);
    gain.connect(this.compressor);

    const track = { chapter, source, gain };
    source.onended = () => {
      this.retiringTracks.delete(track);
      try {
        source.disconnect();
        gain.disconnect();
      } catch {
        // A later teardown may already have released the graph.
      }
    };
    source.start();
    return track;
  }

  private retireTrack(track: PlayingTrack, duration = CROSSFADE_SECONDS) {
    const now = this.context.currentTime;
    this.hold(track.gain.gain, now);
    track.gain.gain.linearRampToValueAtTime(0.0001, now + duration);
    this.retiringTracks.add(track);
    window.setTimeout(() => {
      try {
        track.source.stop();
      } catch {
        // A rapid chapter change may already have stopped this source.
      }
    }, duration * 1000 + 80);
  }

  private scheduleNeighbourPreload(chapter: number) {
    if (this.preloadTimer) {
      window.clearTimeout(this.preloadTimer);
      this.preloadTimer = undefined;
    }
    if (this.conserveResources) return;
    this.preloadTimer = window.setTimeout(() => {
      this.preloadTimer = undefined;
      if (!this.desiredPlaying || this.disposed) return;
      const neighbour = (chapter + 1) % chapterTracks.length;
      void this.loadTrack(neighbour).catch(() => {
        // The current recording keeps playing if preloading fails.
      });
    }, 2400);
  }

  private pruneBuffers(chapter: number) {
    if (this.conserveResources) {
      this.buffers.forEach((_buffer, index) => {
        if (index !== chapter) this.buffers.delete(index);
      });
      return;
    }
    const keep = new Set([
      chapter,
      (chapter + 1) % chapterTracks.length,
    ]);
    this.buffers.forEach((_buffer, index) => {
      if (!keep.has(index)) this.buffers.delete(index);
    });
  }

  private async crossfadeTo(chapter: number, operation: number) {
    const buffer = await this.loadTrack(chapter);
    if (
      this.disposed ||
      !this.desiredPlaying ||
      operation !== this.switchOperation ||
      this.context.state !== 'running'
    ) {
      this.pruneBuffers(this.chapter);
      return;
    }
    if (this.activeTrack?.chapter === chapter) return;

    const incoming = this.createPlayingTrack(chapter, buffer, 0.0001);
    const now = this.context.currentTime;
    incoming.gain.gain.setValueAtTime(0.0001, now);
    incoming.gain.gain.linearRampToValueAtTime(1, now + CROSSFADE_SECONDS);

    const outgoing = this.activeTrack;
    this.activeTrack = incoming;
    if (outgoing) this.retireTrack(outgoing);
    this.pruneBuffers(chapter);
    this.scheduleNeighbourPreload(chapter);
  }

  async start(volume = this.volume) {
    const operation = ++this.lifecycleOperation;
    this.desiredPlaying = true;
    this.volume = volume;
    if (this.suspendTimer) {
      window.clearTimeout(this.suspendTimer);
      this.suspendTimer = undefined;
    }

    try {
      await this.context.resume();
    } catch {
      if (operation === this.lifecycleOperation) this.desiredPlaying = false;
      return false;
    }

    let targetChapter: number;
    let buffer: AudioBuffer;
    try {
      while (true) {
        if (
          this.disposed ||
          !this.desiredPlaying ||
          operation !== this.lifecycleOperation
        ) {
          return false;
        }
        targetChapter = this.chapter;
        buffer = await this.loadTrack(targetChapter);
        if (targetChapter === this.chapter) break;
      }
    } catch {
      if (operation === this.lifecycleOperation) this.desiredPlaying = false;
      return false;
    }

    if (
      this.disposed ||
      !this.desiredPlaying ||
      operation !== this.lifecycleOperation
    ) {
      return false;
    }

    if (!this.activeTrack || this.activeTrack.chapter !== targetChapter) {
      if (this.activeTrack) this.retireTrack(this.activeTrack, 0.25);
      this.activeTrack = this.createPlayingTrack(targetChapter, buffer, 1);
    }

    const now = this.context.currentTime;
    this.hold(this.master.gain, now);
    this.master.gain.linearRampToValueAtTime(
      Math.max(this.volume, 0.0001),
      now + MASTER_FADE_SECONDS,
    );
    this.pruneBuffers(targetChapter);
    this.scheduleNeighbourPreload(targetChapter);
    return true;
  }

  async pause() {
    const operation = ++this.lifecycleOperation;
    this.switchOperation += 1;
    this.desiredPlaying = false;
    if (this.preloadTimer) {
      window.clearTimeout(this.preloadTimer);
      this.preloadTimer = undefined;
    }

    const now = this.context.currentTime;
    if (this.context.state === 'running') {
      this.hold(this.master.gain, now);
      this.master.gain.linearRampToValueAtTime(
        0.0001,
        now + MASTER_FADE_SECONDS,
      );
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, MASTER_FADE_SECONDS * 1000 + 60);
    });
    if (operation !== this.lifecycleOperation || this.desiredPlaying) return;

    const tracks = [
      ...(this.activeTrack ? [this.activeTrack] : []),
      ...this.retiringTracks,
    ];
    this.activeTrack = null;
    this.retiringTracks.clear();
    tracks.forEach((track) => {
      try {
        track.source.stop();
      } catch {
        // A crossfade may have ended this track already.
      }
    });
    await this.context.suspend().catch(() => {});
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (this.context.state !== 'running') return;
    const now = this.context.currentTime;
    this.hold(this.master.gain, now);
    this.master.gain.setTargetAtTime(
      Math.max(volume, 0.0001),
      now,
      0.16,
    );
  }

  setChapter(chapter: number) {
    const bounded = Math.max(0, Math.min(chapter, chapterTracks.length - 1));
    this.chapter = bounded;
    if (
      !this.desiredPlaying ||
      this.context.state !== 'running' ||
      !this.activeTrack
    ) {
      return;
    }
    const operation = ++this.switchOperation;
    void this.crossfadeTo(bounded, operation).catch(() => {
      // Keep the outgoing recording if the new file cannot be loaded.
    });
  }

  destroy() {
    this.disposed = true;
    this.desiredPlaying = false;
    this.lifecycleOperation += 1;
    this.switchOperation += 1;
    if (this.preloadTimer) window.clearTimeout(this.preloadTimer);
    if (this.suspendTimer) window.clearTimeout(this.suspendTimer);

    const tracks = [
      ...(this.activeTrack ? [this.activeTrack] : []),
      ...this.retiringTracks,
    ];
    tracks.forEach((track) => {
      track.source.onended = null;
      try {
        track.source.stop();
        track.source.disconnect();
        track.gain.disconnect();
      } catch {
        // The graph can already be released during route teardown.
      }
    });
    this.activeTrack = null;
    this.retiringTracks.clear();
    this.pendingBuffers.clear();
    this.buffers.clear();
    this.context.close().catch(() => {});
  }
}
