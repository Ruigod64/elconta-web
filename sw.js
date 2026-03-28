/**
 * sw.js — Service Worker
 * El Conta Pizzas — Cache-first para assets estáticos
 */

var CACHE_NAME    = 'elconta-v1';
var OFFLINE_URL   = '/index.html';

/* Archivos a cachear en la instalación */
var PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/hero.css',
  '/css/sections.css',
  '/css/components.css',
  '/css/extras.css',
  '/css/mobile.css',
  '/css/preloader.css',
  '/css/legacy-support.css',
  '/js/browser-support.js',
  '/js/preloader.js',
  '/js/cursor.js',
  '/js/parallax.js',
  '/js/menu.js',
  '/js/scrollspy.js',
  '/js/touch.js',
  '/js/toast.js',
  '/js/main.js',
  '/assets/chef.jpeg',
  '/assets/logo.jpeg',
  '/assets/pizza.png'
];

/* Instalación: pre-cachear todos los assets */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* Activación: limpiar caches viejos */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key)  { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* Fetch: cache-first, red como fallback */
self.addEventListener('fetch', function (event) {
  /* Solo interceptar GETs del mismo origen */
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  /* Ignorar extensiones de Chrome y URLs externas */
  if (event.request.url.includes('chrome-extension')) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        /* Solo cachear respuestas válidas */
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var toCache = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, toCache);
        });
        return response;
      }).catch(function () {
        /* Sin red: devolver página offline */
        return caches.match(OFFLINE_URL);
      });
    })
  );
});
