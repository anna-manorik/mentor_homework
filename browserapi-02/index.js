if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('✅ Service Worker зареєстрований!'))
        .catch(error => console.error('❌ Помилка реєстрації SW:', error));
}

const dataValue = document.getElementById('data-input')

document.querySelector('#sendData').addEventListener('click', async () => {
    const data = { message: dataValue.value };

    if (navigator.onLine) {
        // Відправка даних на сервер
        saveDataLocally(data);
        navigator.serviceWorker.ready.then((sw) => {
            sw.sync.register('syncData');
        });
    }
});

function saveDataLocally(data) {
    const request = indexedDB.open('appDB', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('offlineData', { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('offlineData', 'readwrite');
        const store = transaction.objectStore('offlineData');
        store.add(data);
    };
}