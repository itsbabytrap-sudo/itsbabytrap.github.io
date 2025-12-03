// Actualiza la versión de caché si haces cambios importantes
const CACHE_NAME = 'neo-portfolio-v1';

// Lista de todos los archivos estáticos que queremos cachear
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    // Íconos 
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    // La fuente de iconos externa (Font Awesome)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// 🟢 EVENTO 1: INSTALACIÓN 
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// 🟢 EVENTO 2: ACTIVACIÓN (Limpieza de caché antigua)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 🟢 EVENTO 3: RECUPERACIÓN (FETCH) - Estrategia: Cache, luego Network
self.addEventListener('fetch', event => {
    if (!(event.request.url.startsWith('http'))) return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request);
            })
    );
});