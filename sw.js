// Unser Baby – Service Worker. Bei jedem Update die VERSION erhöhen.
const VERSION = '2026-11-16-2';
const CACHE = 'unser-baby-' + VERSION;
const ASSETS = ['./', './index.html', './manifest.webmanifest', './chart.umd.js', './manrope.woff2', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, {cache: 'reload'})))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('unser-baby-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(hit => hit || (req.mode === 'navigate'
      ? caches.match('./index.html').then(r => r || fetch(req))
      : fetch(req)))
  );
});
