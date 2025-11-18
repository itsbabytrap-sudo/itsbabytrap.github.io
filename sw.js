// sw.js (Service Worker para Bytecraft Admin PWA con Push)

const CACHE_NAME = 'bytecraft-admin-v1';
const urlsToCache = [
    './',
    './index.html',
    // ... otros archivos que quieres cachear
];

// Evento de Instalación
self.addEventListener('install', event => {
    console.log('[SW] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Cacheado de archivos esenciales');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Evento de Activación
self.addEventListener('activate', event => {
    console.log('[SW] Activado.');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim(); 
});

// Estrategia: Cache-first para un dashboard PWA
self.addEventListener('fetch', event => {
    if (!event.request.url.startsWith('http')) return; 

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


// ----------------------------------------------------
// LÓGICA DE NOTIFICACIONES PUSH
// ----------------------------------------------------

// Escuchador de mensajes del cliente (index.html) para simular la Push
// Esta es la función que usa el index.html para mostrar una notificación localmente
self.addEventListener('message', event => {
    if (event.data.action === 'simulate_push') {
        const data = event.data.data;
        const title = data.title || 'Alerta de Bytecraft Admin';
        const options = {
            body: data.body || 'Tienes una nueva actualización en el sistema.',
            icon: '/path/to/icon.png', // Asegúrate de tener un ícono real
            badge: '/path/to/badge.png', // Asegúrate de tener un badge real
            vibration: [100, 50, 100],
            data: {
                url: data.url || '#'
            }
        };
        // Muestra la notificación
        event.waitUntil(self.registration.showNotification(title, options));
    }
});


// Evento de Click en la Notificación
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const targetUrl = event.notification.data.url;

    // Abrir o enfocar la pestaña al hacer clic
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (const client of clientList) {
                // Si la URL ya está abierta, simplemente la enfoca
                if (client.url.includes(targetUrl.split('#')[0]) && 'focus' in client) {
                    return client.focus().then(focusedClient => {
                        // Navega al hash específico (ej. #tareas)
                        if (targetUrl.includes('#')) {
                            focusedClient.navigate(targetUrl);
                        }
                    });
                }
            }
            // Si no está abierta, abre una nueva ventana/pestaña
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});


// Evento 'push' (solo se dispara cuando un servidor real envía una notificación)
// Aunque no tenemos un backend, es necesario para la PWA
self.addEventListener('push', event => {
    console.log('[SW] Push recibido.');
    const data = event.data.json(); // Se asume que el backend envía JSON
    const title = data.title || 'Nueva Notificación';
    
    const options = {
        body: data.body || 'Revisa el panel de administración.',
        icon: '/path/to/icon.png', 
        data: {
            url: data.url || '#dashboard' 
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});