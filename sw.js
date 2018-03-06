// step2 快取靜態檔案list
const filesToCache = [
  "/",
  "/assets/images/ic_add.jpeg",
  "/assets/images/logo_todo.png",
  "/assets/images/icon-192x192.png",
  "/src/main.css",
  "/index.html"
];

// 快取名稱（自訂）
const cacheName = "pwaTest123";

// step3.install
self.addEventListener("install", event => {
  console.log("installing…");
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("Caching app ok");
      // 加入要cache的file路徑
      return cache.addAll(filesToCache);
    })
  );
});

// activate
// step4.清除舊有cache
self.addEventListener('activate', function(e) {  
    console.log('[ServiceWorker] Activate');  
    e.waitUntil(  
      caches.keys().then(function(keyList) {  
        return Promise.all(keyList.map(function(key) {  
          console.log('[ServiceWorker] Removing old cache', key);  
          if (key !== cacheName) {  
            return caches.delete(key);  
          }  
        }));  
      })  
    );  
  });

// fetch
// step5.用來攔截Requests
self.addEventListener("fetch", event => {
  console.log("now fetch!");
  console.log("event.request:", event.request);
  console.log("[ServiceWorker] Fetch", event.request.url);
  const dataUrl = 'static';
  // Request 要透過 respondWith 方法、才能將 response 回傳給網頁。
  event.respondWith(
    // 如果網站失去網路連線，我們可以回傳 cached 過的 response，提供網站資料、讓使用者能夠持續進行瀏覽
    // 尋找cache內已存在之前的cache
    caches.match(event.request).then(function(response) {
      // 如果沒有cache過用就用當下fetch的資料response回去
      return (
        response ||
        fetch(event.request).then(res =>
          // 存 caches 之前，要先打開 caches.open(cacheName)
          caches.open(dataUrl).then(function(cache) {
            // 存cache
            // cache.put(key, value)
            // 下一次 caches.match 會對應到 event.request
            cache.put(event.request, res.clone());
            return res;
          })
        )
      );
    })
  );
});
