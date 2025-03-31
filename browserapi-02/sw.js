const CACHE_NAME = 'app-cache-v1';
const STATIC_FILES = [
    './index.js',
    './index.html',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_FILES);
        })
    );
    console.log('📦 Статичні файли закешовані');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => caches.match(event.request))
    );
});

self.addEventListener('sync', (event) => {
    console.log('!!sync', event)
    if (event.tag === 'syncData') {
        event.waitUntil(syncOfflineData());
    }
});

async function syncOfflineData() {
    const dbRequest = indexedDB.open('appDB', 1);

    console.log('!!', dbRequest)

    dbRequest.onsuccess = async (event) => {
        const db = event.target.result;
        const transaction = db.transaction('offlineData', 'readonly');
        const store = transaction.objectStore('offlineData');
        const data = await store.getAll();

        console.log('data', data)

        if (data.length > 0) {
            await fetch('/api/sync', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            // Очищаємо локальну базу після успішної синхронізації
            const clearTransaction = db.transaction('offlineData', 'readwrite');
            const clearStore = clearTransaction.objectStore('offlineData');
            clearStore.clear();
        }
    };
}