const CACHE_NAME = 'memory-game-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/main.css',
  './js/main.js',
  './js/ui.js',
  './js/game.js',
  './js/gameManager.js',
  './js/board.js',
  './js/card.js',
  './js/config.js',
  './manifest.json',
  // Images
  './img/0.png',
  './img/1.png',
  './img/2.png',
  './img/3.png',
  './img/4.png',
  './img/5.png',
  './img/6.png',
  './img/7.png',
  './img/8.png',
  './img/9.png',
  './img/10.png',
  './img/11.png',
  './img/12.png',
  './img/13.png',
  './img/14.png',
  './img/15.png',
  './img/16.png',
  './img/17.png',
  './img/18.png',
  './img/19.png',
  './img/20.png',
  './img/21.png',
  './img/22.png',
  './img/23.png',
  './img/24.png',
  './img/25.png',
  './img/26.png',
  './img/27.png',
  './img/28.png',
  './img/29.png',
  './img/30.png',
  './img/31.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cached all files');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response for cache
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// Background sync for game progress
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-progress') {
    console.log('Service Worker: Background sync - saving progress');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Here you could sync game progress to a server
  // For now, we just ensure local storage is consistent
  return Promise.resolve();
}

// Push notifications (optional for game updates)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New content available!',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Play Now',
          icon: './icons/icon-192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: './icons/icon-192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Memory Game', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});