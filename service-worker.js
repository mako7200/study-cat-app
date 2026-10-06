const CACHE_NAME = 'study-cat-v12';
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
  './images/wall-minato.jpg',
  './images/wall-minato-thumb.jpg',
  './images/wall-kogen.jpg',
  './images/wall-kogen-thumb.jpg'
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
