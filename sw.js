const CACHE_NAME = "impostor-cache-v1";

const ASSETS = [
  "/",               // raíz
  "/index.html",
  "/site.webmanifest",
  "/sw-register.js",

  // Íconos PWA
  "/android-chrome-72x72.png",
  "/android-chrome-96x96.png",
  "/android-chrome-128x128.png",
  "/android-chrome-192x192.png",
  "/android-chrome-256x256.png",
  "/android-chrome-384x384.png",
  "/android-chrome-512x512.png",

  // Otros archivos de tu juego (agregá aquí si tenés más)
  "/styles.css",
  "/script.js"
];

// INSTALACIÓN: Cachea archivos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE: Limpia caché vieja
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) =>
          key !== CACHE_NAME ? caches.delete(key) : null
        )
      )
    )
  );
  self.clients.claim();
});

// FETCH: Usa caché primero, luego red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          caches.match("/index.html")
        )
      );
    })
  );
});
