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
    console.log('Фоновий sync отриманий:', event.tag);
    if (event.tag === 'syncData') {
        event.waitUntil(syncOfflineData());
    }
});

async function syncOfflineData() {
    console.log('Синхронізація offline даних...');
    const dbRequest = indexedDB.open('appDB', 1);

    dbRequest.onsuccess = async (event) => {
        console.log('IndexedDB відкрито для sync');
        const db = event.target.result;
        const transaction = db.transaction('offlineData', 'readonly');
        const store = transaction.objectStore('offlineData');
        const getRequest = await store.getAll();

        getRequest.onsuccess = () => {
            const data = getRequest.result;

            if (data.length > 0) {
                self.clients.matchAll().then((clients) => {
                    clients.forEach(client => {
                        client.postMessage({ type: 'SYNC_COMPLETE', data });
                    });
                });
            }
        };
    };

    dbRequest.onerror = (event) => {
        console.error('Помилка відкриття IndexedDB:', event.target.error);
    };
}