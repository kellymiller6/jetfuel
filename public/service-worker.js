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
    })
  );
});

self.addEventListener('activate', (event) => {
  let cacheWhitelist = ['assets-v1'];

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(kelList.map(key => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
