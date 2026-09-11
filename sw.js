// Nika Net service worker — offline copy of the site (v1)
const V='nika-v7';
const CORE=['/','/index.html','/docs.html','/changelog.html','/brand.html','/404.html','/style.css?v=33','/manifest.json','/assets/qr.js','/assets/logo-512.webp?v=2','/assets/logo-hero.webp?v=2','/assets/favicon.png?v=2','/assets/paper.webp',
'/assets/fonts/vazirmatn-arabic-400-normal.woff2','/assets/fonts/vazirmatn-arabic-700-normal.woff2','/assets/fonts/parastoo-700.woff2','/assets/fonts/playfair-display-latin-700-normal.woff2','/assets/fonts/playfair-display-latin-400-italic.woff2','/assets/fonts/special-elite-latin-400-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
 if(u.origin!==location.origin){return}
 // network-first for HTML, cache-first for assets
 if(e.request.mode==='navigate'||u.pathname.endsWith('.html')){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('/index.html'))));return}
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(e.request,c))}return res})))});
self.addEventListener('message',e=>{if(e.data==='ping')e.source.postMessage({ok:true,v:V})});
