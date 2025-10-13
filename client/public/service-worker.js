const CACHE_NAME = 'finsight-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/src/assets/finSightIcon.png',
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[ServiceWorker] Installation failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Activation complete');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  if (!request.url.startsWith('http')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached => {
            if (cached) {
              console.log('[ServiceWorker] Serving API from cache:', request.url);
              return cached;
            }
            return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            });
          })
        )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        console.log('[ServiceWorker] Fetch failed, checking cache:', request.url);

        return caches.match(request).then(cached => {
          if (cached) {
            console.log('[ServiceWorker] Serving from cache:', request.url);
            return cached;
          }

          // For navigation requests, show offline page
          if (request.mode === 'navigate' || request.destination === 'document') {
            console.log('[ServiceWorker] Navigation failed, showing offline page');
            return caches.match(OFFLINE_URL);
          }

          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data === 'clearCache') {
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))))
    );
  }
});
