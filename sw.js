/* Apuntamiento Satelital · Service Worker
   Estrategia:
   - SHELL (app + Leaflet): cache-first, se precachea al instalar.
   - TILES (teselas del mapa): cache-first; se guardan al vuelo y vía "Descargar zona".
   Los nombres de caché coinciden con los usados por la página (gestión de caché). */
const SHELL = 'apsat-shell-v4';
const TILES = 'apsat-tiles-v1';

const SHELL_URLS = [
  './', './index.html', './satellites.json',
  './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './apple-touch-icon.png', './favicon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    // allSettled: si una URL falla, no se cae toda la instalación
    await Promise.allSettled(SHELL_URLS.map(u => c.add(new Request(u, { cache: 'reload' }))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== SHELL && k !== TILES) ? caches.delete(k) : null));
    await self.clients.claim();
  })());
});

function isTile(url) {
  return /tile\.openstreetmap|server\.arcgisonline\.com|tile\.opentopomap\.org|basemaps\.cartocdn\.com/.test(url);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  // satellites.json -> network-first (para reflejar actualizaciones), caché como respaldo offline
  if (url.indexOf('satellites.json') !== -1) {
    e.respondWith((async () => {
      try {
        const res = await fetch(req, { cache: 'no-store' });
        const c = await caches.open(SHELL); c.put('./satellites.json', res.clone());
        return res;
      } catch (err) {
        return (await caches.match('./satellites.json')) || new Response('[]', { headers: { 'Content-Type': 'application/json' } });
      }
    })());
    return;
  }

  // Teselas del mapa -> cache-first, guardando lo que se descarga (incluye respuestas opacas)
  if (isTile(url)) {
    e.respondWith((async () => {
      const c = await caches.open(TILES);
      const hit = await c.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        c.put(req, res.clone());
        return res;
      } catch (err) {
        return hit || new Response('', { status: 504 });
      }
    })());
    return;
  }

  // Shell / Leaflet -> cache-first con respaldo de red
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (url.startsWith(self.location.origin) || url.includes('unpkg.com')) {
        const c = await caches.open(SHELL);
        c.put(req, res.clone());
      }
      return res;
    } catch (err) {
      return new Response('', { status: 504 });
    }
  })());
});
