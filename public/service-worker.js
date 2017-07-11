self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1').then(cache =>{
      return cache.addAll([
        '/',
        './styles.css',
        './swirly-scribbled-arrow.svg',
        './scripts.js'
      ]);
    })
    .catch(error => {
      console.log(error);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    });
  );
});
