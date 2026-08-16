/* Offline support: immutable build files, bounded media, fresh pages. */
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
