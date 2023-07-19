const CacheName = '202307200151';
const assets = [
    '/DateJumper/',
    '/DateJumper/index.html',
    '/DateJumper/assets/reset.css',
    '/DateJumper/assets/style.css',
    '/DateJumper/assets/script.js',
    '/DateJumper/assets/jalali-moment.browser.js',
];

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CacheName)
        .map(key => caches.delete(key))
      );
    }));
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});