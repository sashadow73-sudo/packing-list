// প্যাকিং লিস্ট অ্যাপ — অ্যাপ হিসেবে ইনস্টলের জন্য। সবসময় নেটের নতুন সংস্করণ নেয়, নেট না থাকলে শেষ সেভ করা পেজ দেখায়।
const CACHE = "pl-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./index.html", "./manifest.webmanifest", "./icon-192.png"]))); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // ডাটাবেস/অন্য সাইটের অনুরোধ সরাসরি যাবে
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
