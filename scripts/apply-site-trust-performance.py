from pathlib import Path


def replace(path: str, old: str, new: str, *, count: int | None = 1) -> None:
    file_path = Path(path)
    text = file_path.read_text(encoding="utf-8")
    occurrences = text.count(old)
    if occurrences == 0:
        raise RuntimeError(f"Expected text not found in {path}: {old[:80]!r}")
    if count is not None and occurrences != count:
        raise RuntimeError(
            f"Expected {count} occurrence(s) in {path}, found {occurrences}: {old[:80]!r}"
        )
    file_path.write_text(text.replace(old, new), encoding="utf-8")


# Ambient sound should be a deliberate choice for first-time visitors. People
# who previously opted in still resume on their next eligible interaction.
audio_path = Path("components/blue-hour/AudioExperience.tsx")
audio = audio_path.read_text(encoding="utf-8")
old_audio_gate = "readAudioPreference('blue-hour-sound') === 'off'"
count = audio.count(old_audio_gate)
if count != 3:
    raise RuntimeError(f"Expected 3 legacy audio preference checks, found {count}")
audio = audio.replace(
    old_audio_gate,
    "readAudioPreference('blue-hour-sound') !== 'on'",
)
audio_path.write_text(audio, encoding="utf-8")

# Version service-worker registrations per deploy and reload exactly once when a
# new worker takes over an already-controlled tab.
Path("components/Providers.tsx").write_text(
    """'use client';

import { useEffect, type ReactNode } from 'react';
import { BlueHourAudioProvider } from './blue-hour/AudioExperience';

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? 'local';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const hadController = Boolean(navigator.serviceWorker.controller);
    const reloadKey = `blue-hour-sw-reloaded:${BUILD_ID}`;
    const onControllerChange = () => {
      if (!hadController) return;
      try {
        if (window.sessionStorage.getItem(reloadKey) === '1') return;
        window.sessionStorage.setItem(reloadKey, '1');
      } catch {
        // Reloading once is still safe when session storage is unavailable.
      }
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    void navigator.serviceWorker
      .register(`/sw.js?v=${encodeURIComponent(BUILD_ID)}`, {
        updateViaCache: 'none',
      })
      .then((registration) => registration.update())
      .catch((error: unknown) => {
        console.warn('[Austin Liu site] Service worker registration failed:', error);
      });

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange,
      );
    };
  }, []);

  return <BlueHourAudioProvider>{children}</BlueHourAudioProvider>;
}
""",
    encoding="utf-8",
)

# Keep media across deployments, but version page and static caches using the
# build SHA embedded in the service-worker URL.
Path("public/sw.js").write_text(
    """/* Offline support: immutable build files, bounded media, fresh pages. */
const VERSION =
  new URL(self.location.href).searchParams.get('v')?.replace(/[^a-zA-Z0-9_-]/g, '') ||
  'local';
const STATIC_CACHE = `al-blue-hour-static-${VERSION}`;
const PAGE_CACHE = `al-blue-hour-pages-${VERSION}`;
const MEDIA_CACHE = 'al-blue-hour-media-v7';
const CURRENT_CACHES = new Set([STATIC_CACHE, MEDIA_CACHE, PAGE_CACHE]);
const CACHE_PREFIX = 'al-blue-hour-';
const INDEPENDENT_APP_PATHS = ['/KnightClub/', '/Denki/'];
const MEDIA_LIMIT = 180;
const SHELL = ['/', '/404.html', '/manifest.webmanifest', '/icon.svg'];

async function cacheIndividually(cache, urls) {
  await Promise.allSettled(urls.map((url) => cache.add(url)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cacheIndividually(cache, SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith(CACHE_PREFIX) && !CURRENT_CACHES.has(key),
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function trimCache(cache, limit) {
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  await Promise.all(
    keys.slice(0, keys.length - limit).map((key) => cache.delete(key)),
  );
}

async function cacheSuccessfulResponse(cacheName, request, response) {
  if (!response.ok || response.type !== 'basic') return response;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return response;
}

async function navigationFallback(request) {
  const cache = await caches.open(PAGE_CACHE);
  return (
    (await cache.match(request)) ||
    (await cache.match('/')) ||
    (await cache.match('/404.html')) ||
    Response.error()
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (
    INDEPENDENT_APP_PATHS.some(
      (path) => url.pathname === path.slice(0, -1) || url.pathname.startsWith(path),
    )
  ) {
    return;
  }

  // Let the browser own streamed audio/video and byte-range requests. A synthetic
  // service-worker response can break seeking or return a partial file as if it
  // were the whole recording.
  if (
    url.pathname.startsWith('/assets/audio/') ||
    url.pathname.startsWith('/assets/video/') ||
    request.headers.has('range')
  ) {
    return;
  }

  // Next build filenames are content-hashed, so a cache hit is final.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const response = await fetch(request);
        return cacheSuccessfulResponse(STATIC_CACHE, request, response);
      }),
    );
    return;
  }

  // Media can keep stable URLs across edits: show the cache, refresh quietly.
  if (url.pathname.startsWith('/assets/')) {
    const cachePromise = caches.open(MEDIA_CACHE);
    const hitPromise = cachePromise.then((cache) => cache.match(request));
    const refreshPromise = cachePromise.then(async (cache) => {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
        await trimCache(cache, MEDIA_LIMIT);
      }
      return response;
    });

    event.waitUntil(refreshPromise.then(() => undefined).catch(() => undefined));
    event.respondWith(
      hitPromise.then(async (hit) => {
        if (hit) return hit;
        return refreshPromise.catch(() => Response.error());
      }),
    );
    return;
  }

  // Pages and everything else: prefer the network so deploys show up immediately.
  event.respondWith(
    fetch(request)
      .then((response) =>
        cacheSuccessfulResponse(PAGE_CACHE, request, response),
      )
      .catch(() => navigationFallback(request)),
  );
});
""",
    encoding="utf-8",
)

# Make the homepage and structured identity immediately explain what the site is.
replace(
    "components/blue-hour/BlueHourSite.tsx",
    "I&apos;m Austin Liu — a dental student in Adelaide.",
    "I&apos;m Austin Liu — a dental student in Adelaide, building useful software and keeping a record of places.",
)
replace(
    "components/LegacyPages.tsx",
    "A builder and traveller from China, now based in Adelaide — making\n            small digital tools, collecting places, and keeping a public record\n            of the things that hold my attention.",
    "A dental student, builder, and traveller from China, now based in\n            Adelaide — making small digital tools, collecting places, and keeping\n            a public record of the things that hold my attention.",
)
replace(
    "config/site.ts",
    "Austin Liu’s personal space for building useful products, travelling with a camera, writing field notes, and paying attention to a wider life.",
    "Austin Liu is a dental student and independent builder in Adelaide, making useful software and keeping a visual record of places, ideas, and ordinary days.",
)
replace(
    "config/site.ts",
    "Builder, traveller, writer, and photographer based in Adelaide, making useful tools and keeping a record of places, ideas, and ordinary days.",
    "Dental student, builder, traveller, writer, and photographer based in Adelaide, making useful tools and keeping a record of places, ideas, and ordinary days.",
)
replace(
    "app/about/page.tsx",
    "Builder, traveller, photographer, and writer behind The Last Blue Hour.",
    "Dental student, builder, traveller, photographer, and writer behind The Last Blue Hour.",
)

# Add explicit build and static-export verification scripts.
replace(
    "package.json",
    '    "build": "next build",\n    "build:sites": "npm run build && node scripts/build-sites.mjs",\n    "start": "next start",\n    "lint": "next lint"',
    '    "build": "next build",\n    "build:sites": "npm run build && node scripts/build-sites.mjs",\n    "start": "next start",\n    "typecheck": "tsc --noEmit",\n    "validate:export": "node scripts/validate-export.mjs",\n    "check": "npm run typecheck && npm run build && npm run validate:export",\n    "lint": "next lint"',
)

Path("scripts/validate-export.mjs").write_text(
    r"""import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');
const origin = 'https://static-export.local';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
}

function outputPath(file) {
  return `/${path.relative(outDir, file).split(path.sep).join('/')}`;
}

function pageUrlFor(filePath) {
  if (filePath === '/index.html') return '/';
  if (filePath.endsWith('/index.html')) {
    return filePath.slice(0, -'index.html'.length);
  }
  return filePath;
}

function candidateFiles(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/+/g, '/');
  if (clean.endsWith('/')) return [`${clean}index.html`];
  if (path.posix.extname(clean)) return [clean];
  return [clean, `${clean}.html`, `${clean}/index.html`];
}

function extractReferences(html) {
  const references = [];
  const attributes = /\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(attributes)) references.push(match[1]);

  const sourceSets = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(sourceSets)) {
    for (const item of match[1].split(',')) {
      const reference = item.trim().split(/\s+/)[0];
      if (reference) references.push(reference);
    }
  }
  return references;
}

function extractIds(html) {
  const ids = new Set();
  const pattern = /\b(?:id|name)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(pattern)) ids.add(match[1]);
  return ids;
}

const files = await walk(outDir);
const fileSet = new Set(files.map(outputPath));
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const htmlByUrl = new Map();
const idsByFile = new Map();

for (const file of htmlFiles) {
  const relative = outputPath(file);
  const html = await readFile(file, 'utf8');
  htmlByUrl.set(pageUrlFor(relative), { file, relative, html });
  idsByFile.set(relative, extractIds(html));
}

const failures = [];
let checkedReferences = 0;
for (const { relative, html } of htmlByUrl.values()) {
  const pageUrl = new URL(pageUrlFor(relative), origin);
  for (const rawReference of extractReferences(html)) {
    if (
      !rawReference ||
      rawReference === '#' ||
      rawReference.startsWith('data:') ||
      rawReference.startsWith('blob:') ||
      rawReference.startsWith('mailto:') ||
      rawReference.startsWith('tel:') ||
      rawReference.startsWith('javascript:') ||
      rawReference.startsWith('//')
    ) {
      continue;
    }

    let resolved;
    try {
      resolved = new URL(rawReference, pageUrl);
    } catch {
      failures.push(`${relative}: invalid URL ${JSON.stringify(rawReference)}`);
      continue;
    }
    if (resolved.origin !== origin) continue;

    checkedReferences += 1;
    const candidates = candidateFiles(resolved.pathname);
    const target = candidates.find((candidate) => fileSet.has(candidate));
    if (!target) {
      failures.push(
        `${relative}: ${JSON.stringify(rawReference)} does not resolve to an exported file`,
      );
      continue;
    }

    if (resolved.hash && target.endsWith('.html')) {
      const fragment = decodeURIComponent(resolved.hash.slice(1));
      if (fragment && !idsByFile.get(target)?.has(fragment)) {
        failures.push(
          `${relative}: ${JSON.stringify(rawReference)} points to missing #${fragment}`,
        );
      }
    }
  }
}

for (const required of [
  '/index.html',
  '/404.html',
  '/robots.txt',
  '/sitemap.xml',
  '/feed.xml',
  '/manifest.webmanifest',
  '/sw.js',
]) {
  if (!fileSet.has(required)) failures.push(`Missing required export: ${required}`);
}

const manifestPath = path.join(outDir, 'manifest.webmanifest');
try {
  JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (error) {
  failures.push(`manifest.webmanifest is invalid JSON: ${error.message}`);
}

const workerPath = path.join(outDir, 'sw.js');
const workerCheck = spawnSync(process.execPath, ['--check', workerPath], {
  encoding: 'utf8',
});
if (workerCheck.status !== 0) {
  failures.push(`sw.js failed syntax validation: ${workerCheck.stderr.trim()}`);
}

if (failures.length > 0) {
  console.error(`Static export validation failed with ${failures.length} problem(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const totalBytes = (
  await Promise.all(files.map(async (file) => (await stat(file)).size))
).reduce((sum, size) => sum + size, 0);
console.log(
  `Validated ${htmlFiles.length} pages, ${checkedReferences} internal references, and ${(totalBytes / 1024 / 1024).toFixed(1)} MB of exported files.`,
);
""",
    encoding="utf-8",
)

# CI and deployment now use the same complete verification gate and embed the
# commit SHA into the service-worker registration.
Path(".github/workflows/ci.yml").write_text(
    """name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_BUILD_ID: ${{ github.sha }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Typecheck
        run: npm run typecheck
      - name: Build static export
        run: npm run build
      - name: Validate routes and assets
        run: npm run validate:export
""",
    encoding="utf-8",
)

Path(".github/workflows/deploy.yml").write_text(
    """name: Deploy Next.js site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_BUILD_ID: ${{ github.sha }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Typecheck
        run: npm run typecheck
      - name: Build static export
        run: npm run build
      - name: Validate routes and assets
        run: npm run validate:export
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
""",
    encoding="utf-8",
)

replace(
    "README.md",
    "* **PWA** — web manifest plus a service worker for offline reading (network-first pages, stale-while-revalidate assets).",
    "* **PWA** — opt-in ambience, a versioned service worker, and offline reading without letting an older deploy pin stale pages or chunks.",
)
replace(
    "README.md",
    "* **Build Pipeline**: Static site generation producing optimized static assets to `out/` for edge deployment; CI typechecks and builds on every push to `main`, then deploys to GitHub Pages.",
    "* **Build Pipeline**: Static site generation to `out/`; CI typechecks, builds, validates every internal route/asset/fragment, and only then deploys to GitHub Pages.",
)
replace(
    "README.md",
    "```bash\nnpm run build\n```",
    "```bash\nnpm run check\n```\n\n`npm run check` typechecks, builds the complete static export, and verifies that internal links, fragments, required metadata files, and service-worker syntax are valid.",
)

print("Applied site trust, performance, and content hardening pass.")
