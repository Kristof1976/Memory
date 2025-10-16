const CACHE_NAME = 'memory-game-v1';
const BASE_PATH = '/Memory/';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'css/main.css',
  BASE_PATH + 'js/main.js',
  BASE_PATH + 'js/ui.js',
  BASE_PATH + 'js/game.js',
  BASE_PATH + 'js/gameManager.js',
  BASE_PATH + 'js/board.js',
  BASE_PATH + 'js/card.js',
  BASE_PATH + 'js/config.js',
  BASE_PATH + 'manifest.json',
  // Images
  BASE_PATH + 'img/0.png',
  BASE_PATH + 'img/1.png',
  BASE_PATH + 'img/2.png',
  BASE_PATH + 'img/3.png',
  BASE_PATH + 'img/4.png',
  BASE_PATH + 'img/5.png',
  BASE_PATH + 'img/6.png',
  BASE_PATH + 'img/7.png',
  BASE_PATH + 'img/8.png',
  BASE_PATH + 'img/9.png',
  BASE_PATH + 'img/10.png',
  BASE_PATH + 'img/11.png',
  BASE_PATH + 'img/12.png',
  BASE_PATH + 'img/13.png',
  BASE_PATH + 'img/14.png',
  BASE_PATH + 'img/15.png',
  BASE_PATH + 'img/16.png',
  BASE_PATH + 'img/17.png',
  BASE_PATH + 'img/18.png',
  BASE_PATH + 'img/19.png',
  BASE_PATH + 'img/20.png',
  BASE_PATH + 'img/21.png',
  BASE_PATH + 'img/22.png',
  BASE_PATH + 'img/23.png',
  BASE_PATH + 'img/24.png',
  BASE_PATH + 'img/25.png',
  BASE_PATH + 'img/26.png',
  BASE_PATH + 'img/27.png',
  BASE_PATH + 'img/28.png',
  BASE_PATH + 'img/29.png',
  BASE_PATH + 'img/30.png',
  BASE_PATH + 'img/31.png'
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
          return caches.match(BASE_PATH + 'index.html');
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
      clients.openWindow(BASE_PATH)
    );
  }
});