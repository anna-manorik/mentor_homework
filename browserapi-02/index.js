if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('✅ Service Worker зареєстрований!'))
        .catch(error => console.error('❌ Помилка реєстрації SW:', error));
}

document.querySelector('#sendData').addEventListener('click', async () => {
    const data = { message: "Привіт, офлайн-збереження!" };

    if (navigator.onLine) {
        // Відправка даних на сервер
        await fetch('/api/data', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        // Збереження в IndexedDB і реєстрація sync
        saveDataLocally(data);
        navigator.serviceWorker.ready.then((sw) => {
            sw.sync.register('syncData');
        });
    }
});