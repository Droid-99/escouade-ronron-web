// Service worker : le jeu fonctionne hors connexion une fois ouvert.
// Stratégie « réseau d'abord » pour la page (pour recevoir les mises à jour), cache en secours.
const CACHE = 'ronron-dev-1791660647498';
const FICHIERS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './fonts/fredoka-400.woff2', './fonts/fredoka-500.woff2', './fonts/fredoka-600.woff2', './fonts/lilita-400.woff2', './fonts/lilita-ext-400.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
