// Pan: la página sale de la caché al instante y la nueva se trae detrás para la próxima vez
var CACHE="pan-v1.03";
var FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(e.request,{ignoreSearch:true}).then(function(hit){
      var red=fetch(e.request,{cache:"no-cache"}).then(function(r){if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(function(){return hit||Response.error()});
      return hit||red;
    });
  }));
});
