/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'weather-app-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
      
        return cache.addAll([
          '/index.html',
          '/index.js',
          '/style.css',
          '/manifest.json',
          '/favicon.ico',
        ]);
      })
  );
});

// Intercept fetch requests and serve from cache if available, otherwise fetch and cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the request is in the cache, return the cached response
        if (response) {
          return response;
        }

        // Otherwise, fetch the request and cache the response on-the-fly
        return fetch(event.request)
          .then(response => {
            // Clone the response before caching it
            const clonedResponse = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Cache the fetched response
                cache.put(event.request, clonedResponse);
              });

            return response;
          });
      })
  );
});

// Remove old caches when a new service worker is activated
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
  );
});
