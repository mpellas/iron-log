// 90Strong service worker — enables offline use + PWA installability.
// Strategy:
//   - On install: pre-cache the app shell (index.html, manifest, icons).
//   - On activate: clear old caches so a new deploy takes effect.
//   - On fetch:
//     * For navigation requests (HTML): network-first, fall back to cached index.html.
//       Keeps the user on the latest version when online, but keeps the app usable offline.
//     * For same-origin assets: cache-first with background revalidation.
//     * For cross-origin (React, Babel, fonts): pass through to the network; the CDN sets
//       its own cache headers and we don't want to double-cache those bytes.
//
// Bump CACHE_VERSION on every deploy so stale app shells get purged.

const CACHE_VERSION = "v1-2026-10-24";
const CACHE_NAME = `90strong-${CACHE_VERSION}`;
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only GET requests belong in a cache.
  if (req.method !== "GET") return;

  // Cross-origin: pass through (CDN scripts, Google Fonts, YouTube embeds, Anthropic API).
  if (url.origin !== self.location.origin) return;

  // Navigation requests (user typed URL, tapped PWA icon, etc.): network-first with offline fallback.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Keep a fresh copy of the shell for next offline load.
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Same-origin assets: cache-first, with a background fetch to refresh.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

// Lets the page push an update once the SW is installed. The page sends
// {type: "SKIP_WAITING"} after showing a toast, and this activates immediately.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
