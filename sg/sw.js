// Guarda la cáscara (pantalla de bienvenida, íconos, tipografía) para
// que abra al instante y muestre el aviso de "sin conexión" con la marca.
// El sistema en sí siempre se carga en línea desde Apps Script.
const CACHE = "confiatt-sg-v1";
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "logo.svg",
  "icons/icon-192.png", "icons/favicon-64.png", "../fonts/outfit-600.woff2"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Apps Script va directo a la red
  if (e.request.mode === "navigate") {
    // Primero la red (para recibir actualizaciones); sin red, la copia guardada.
    e.respondWith(fetch(e.request).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
