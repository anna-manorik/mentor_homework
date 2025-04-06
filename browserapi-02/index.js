if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('✅ Service Worker зареєстрований!'))
        .catch(error => console.error('❌ Помилка реєстрації SW:', error));
}

const dataValue = document.getElementById('data-input')

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Завантаження сторінки...');
    
    const localData = await loadDataFromIndexedDB();
    if (localData.length > 0) {
        updateUI(localData);
    }
});

function loadDataFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('appDB', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('offlineData', 'readonly');
            const store = transaction.objectStore('offlineData');
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
            };

            getAllRequest.onerror = () => {
                reject('Помилка читання IndexedDB');
            };
        };

        request.onerror = () => {
            reject('IndexedDB не відкрився');
        };
    });
}

document.querySelector('#sendData').addEventListener('click', async (e) => {
    e.preventDefault()

    const input = document.getElementById('data-input');
    
    if (input.value.trim() !== '') {
        saveDataToIndexedDB({ message: input.value });
        input.value = '';
    }
    
        // **Реєстрація фонового синхронізатора**
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then((sw) => {
                console.log('🔄 Service Worker готовий, реєструю syncData');
                sw.sync.register('syncData')
                    .then(() => console.log('✅ Background Sync зареєстрований!'))
                    .catch((err) => console.error('❌ Помилка реєстрації Sync:', err));
            });
        }
});

function saveDataToIndexedDB(data) {
    const request = indexedDB.open('appDB', 1);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('offlineData', 'readwrite');
        const store = transaction.objectStore('offlineData');

        store.add(data);

        transaction.oncomplete = () => {
            console.log('Дані збережено в IndexedDB:', data);
            loadDataFromIndexedDB().then(updateUI);
        };
    };
}

function updateUI(data) {
    const dataValue = document.getElementById('data-list')
    dataValue.innerHTML = '';

            data.forEach(record => {
                const li = document.createElement('li')
                li.textContent = record.message
                dataValue.appendChild(li)
            })
}