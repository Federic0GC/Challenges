// Service Worker con estrategia híbrida
const CACHE_NAME = 'challenge01-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Instalación del SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activación del SW - limpiar cachés antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Estrategia híbrida
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Estrategia para assets (JS, CSS, imágenes) - Cache First
  if (request.method === 'GET' && 
      (request.url.includes('/assets/') || 
       request.url.includes('.js') || 
       request.url.includes('.css') ||
       request.url.includes('.png') ||
       request.url.includes('.svg'))) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(response => {
          // Guardar en cache nuevos assets
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      }).catch(() => {
        // Si falla, intentar desde caché
        return caches.match(request);
      })
    );
  }
  // Estrategia para HTML - Network First
  else if (request.method === 'GET' && 
           (request.url.includes('.html') || url.pathname === '/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
  // Otros tipos de request - Network First
  else {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then(response => {
            return response || new Response('Offline - No hay contenido en caché', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
        })
    );
  }
});
