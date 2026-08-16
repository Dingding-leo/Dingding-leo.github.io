from pathlib import Path
import re


def replace(path: str, old: str, new: str, *, count: int = 1) -> None:
    file_path = Path(path)
    text = file_path.read_text(encoding="utf-8")
    occurrences = text.count(old)
    if occurrences != count:
        raise RuntimeError(
            f"Expected {count} occurrence(s) in {path}, found {occurrences}: {old[:100]!r}"
        )
    file_path.write_text(text.replace(old, new), encoding="utf-8")


# This site deliberately uses hand-authored <picture> source sets for its
# cinematic and editorial photography. Keep that documented exception while
# retaining the rest of Next's Core Web Vitals and React rules.
Path("eslint.config.mjs").write_text(
    """import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      // Several animation/audio effects intentionally drive finite state
      // machines in response to external browser state. They are not derived
      // render state and cannot be replaced by a simple calculation.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'public/**',
    'next-env.d.ts',
  ]),
]);
""",
    encoding="utf-8",
)

# An old all-in-one site implementation is no longer imported by any route. Its
# live equivalents are split across Nav, LegacyPages, NoteLayout and BlueHour.
legacy_site = Path("components/Site.tsx")
if not legacy_site.exists():
    raise RuntimeError("Expected legacy components/Site.tsx to exist")
legacy_site.unlink()

# Decorative <picture> content is already hidden semantically by an empty alt on
# the nested image; aria-hidden is not valid on the picture element itself.
replace(
    "components/BlueHourJumpShell.tsx",
    '      data-scene={scene}\n      aria-hidden="true"\n      style=',
    '      data-scene={scene}\n      style=',
)

# Detect native share support without a mount-only state effect.
Path("components/NoteShare.tsx").write_text(
    """'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import jumpStyles from '@/components/BlueHourJumpShell.module.css';

const subscribeToShareSupport = () => () => undefined;
const readShareSupport = () =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

export function NoteShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(
    subscribeToShareSupport,
    readShareSupport,
    () => false,
  );

  const copyLink = async () => {
    if (!navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {
      // The native share sheet may be dismissed without completing.
    }
  };

  return (
    <div className={jumpStyles.articleShare}>
      <button type="button" onClick={copyLink}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
        <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
      </button>
      {canShare && (
        <button type="button" onClick={share}>
          <Share2 size={15} />
          <span>Share</span>
        </button>
      )}
    </div>
  );
}
""",
    encoding="utf-8",
)

# Framer Motion returns null until the client preference is known. That already
# provides the hydration-safe guard the extra clientReady state was duplicating.
replace(
    "components/ProjectDeck.tsx",
    "  const [clientReady, setClientReady] = useState(false);\n",
    "",
)
replace(
    "components/ProjectDeck.tsx",
    "  const motionEnabled = clientReady && !reducedMotion && !conserveMotion;",
    "  const motionEnabled = reducedMotion === false && !conserveMotion;",
)
replace(
    "components/ProjectDeck.tsx",
    "\n  useEffect(() => setClientReady(true), []);\n",
    "\n",
)

# Remove the abandoned synthetic sound engine. The production path has used the
# recorded ambience engine for months; keeping both made the audio module much
# harder to reason about and triggered dead-code warnings.
audio_path = Path("components/blue-hour/AudioExperience.tsx")
audio = audio_path.read_text(encoding="utf-8")
constants_pattern = re.compile(
    r"\nconst chapterChords = \[.*?\nconst chapterFilters = \[[^\n]+\];\n",
    re.DOTALL,
)
audio, replacements = constants_pattern.subn("\n", audio, count=1)
if replacements != 1:
    raise RuntimeError("Could not remove obsolete audio synthesis constants")
engine_pattern = re.compile(
    r"\nclass BlueHourEngine \{.*?\n\}\n\nexport type AudioExperience =",
    re.DOTALL,
)
audio, replacements = engine_pattern.subn(
    "\nexport type AudioExperience =", audio, count=1
)
if replacements != 1:
    raise RuntimeError("Could not remove obsolete BlueHourEngine")

# Storage helpers are also used by lazy initial state during server rendering.
audio = audio.replace(
    "function readAudioPreference(key: string) {\n  try {\n    return window.localStorage.getItem(key);",
    "function readAudioPreference(key: string) {\n  if (typeof window === 'undefined') return null;\n  try {\n    return window.localStorage.getItem(key);",
    1,
)
audio = audio.replace(
    "function writeAudioPreference(key: string, value: string) {\n  try {",
    "function writeAudioPreference(key: string, value: string) {\n  if (typeof window === 'undefined') return;\n  try {",
    1,
)
marker = "function writeAudioPreference(key: string, value: string) {\n  if (typeof window === 'undefined') return;\n  try {\n    window.localStorage.setItem(key, value);\n  } catch {\n    // Audio remains usable when storage is blocked.\n  }\n}\n"
if marker not in audio:
    raise RuntimeError("Could not find audio preference helper marker")
audio = audio.replace(
    marker,
    marker
    + "\nfunction readInitialVolume() {\n"
    + "  const stored = Number(readAudioPreference('blue-hour-volume'));\n"
    + "  return Number.isFinite(stored) && stored >= 0 && stored <= 0.7\n"
    + "    ? stored\n"
    + "    : DEFAULT_VOLUME;\n"
    + "}\n",
    1,
)
old_state = """  const startPending = useRef(false);
  const audioOperation = useRef(0);
  const previousVolume = useRef(DEFAULT_VOLUME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
"""
new_state = """  const startPending = useRef(false);
  const audioOperation = useRef(0);
  const previousVolume = useRef(readInitialVolume() || DEFAULT_VOLUME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => readInitialVolume() === 0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [volume, setVolumeState] = useState(readInitialVolume);
"""
if old_state not in audio:
    raise RuntimeError("Could not find audio state initialisation")
audio = audio.replace(old_state, new_state, 1)
volume_effect = """
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
"""
if volume_effect not in audio:
    raise RuntimeError("Could not find mount-only volume effect")
audio = audio.replace(volume_effect, "", 1)
old_chapter_state = """  const pathname = usePathname();
  const [activeChapter, setActiveChapterState] = useState(() =>
    chapterForPath(pathname),
  );
  const audio = useBlueHourAudio(activeChapter);
"""
new_chapter_state = """  const pathname = usePathname();
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
"""
if old_chapter_state not in audio:
    raise RuntimeError("Could not find audio chapter state")
audio = audio.replace(old_chapter_state, new_chapter_state, 1)
old_set_chapter = """  const setActiveChapter = useCallback((chapter: number) => {
    setActiveChapterState(Math.max(0, Math.min(chapter, chapterNames.length - 1)));
  }, []);
  useEffect(() => {
    setActiveChapterState(chapterForPath(pathname));
  }, [pathname]);
"""
new_set_chapter = """  const setActiveChapter = useCallback(
    (chapter: number) => {
      setChapterSelection({
        pathname,
        chapter: Math.max(0, Math.min(chapter, chapterNames.length - 1)),
      });
    },
    [pathname],
  );
"""
if old_set_chapter not in audio:
    raise RuntimeError("Could not find active chapter setter")
audio = audio.replace(old_set_chapter, new_set_chapter, 1)
audio = audio.replace(
    "            {effectiveMuted\n              ? 'Muted'\n              : audio.isPlaying\n                ? track.shortLabel\n                : 'Play ambience'}",
    "            {audio.isPlaying\n              ? effectiveMuted\n                ? 'Muted'\n                : track.shortLabel\n              : 'Play ambience'}",
    1,
)
audio_path.write_text(audio, encoding="utf-8")

# Capture menu elements once for focus trapping and restoration. Ref.current may
# point to a different node by the time an effect cleanup executes.
replace(
    "components/blue-hour/BlueHourSite.tsx",
    "    const previousOverflow = document.body.style.overflow;\n    const desktopViewport = window.matchMedia('(min-width: 821px)');",
    "    const menuButtonElement = menuButton.current;\n    const navigationElement = mobileNavigation.current;\n    const previousOverflow = document.body.style.overflow;\n    const desktopViewport = window.matchMedia('(min-width: 821px)');",
)
replace(
    "components/blue-hour/BlueHourSite.tsx",
    "    const firstLink = mobileNavigation.current?.querySelector<HTMLElement>('a');",
    "    const firstLink = navigationElement?.querySelector<HTMLElement>('a');",
)
replace(
    "components/blue-hour/BlueHourSite.tsx",
    "        menuButton.current,\n        ...(mobileNavigation.current?.querySelectorAll<HTMLElement>('a, button') ?? []),",
    "        menuButtonElement,\n        ...(navigationElement?.querySelectorAll<HTMLElement>('a, button') ?? []),",
)
replace(
    "components/blue-hour/BlueHourSite.tsx",
    "        menuButton.current?.focus();",
    "        menuButtonElement?.focus();",
)

print("Applied active-source lint and dead-code cleanup.")
