const CACHE_NAME = 'study-cat-v24';
const CACHE_FILES = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './images/cat-sleep.jpg',
  './images/cat-back.jpg',
  './images/cat-sit.jpg',
  './images/cat-white-sleep.jpg',
  './images/cat-white-back.jpg',
  './images/cat-white-sit.jpg',
  './images/cat-bengal-sleep.jpg',
  './images/cat-bengal-back.jpg',
  './images/cat-bengal-sit.jpg',
  './images/cat-calico-sleep.jpg',
  './images/cat-calico-back.jpg',
  './images/cat-calico-sit.jpg',
  './images/cat-scottish-sleep.jpg',
  './images/cat-scottish-back.jpg',
  './images/cat-scottish-sit.jpg',
  './images/wall-minato.jpg',
  './images/wall-minato-thumb.jpg',
  './images/wall-kogen.jpg',
  './images/wall-kogen-thumb.jpg',
  './images/wall-asa.jpg',
  './images/wall-asa-thumb.jpg',
  './fonts/dotgothic16-digits.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES.map(url => new Request(url, { cache: 'reload' }))))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
