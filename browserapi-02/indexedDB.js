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