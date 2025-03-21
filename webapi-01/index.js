const socket = new WebSocket(`ws://${window.location.hostname}:9090`);

socket.onopen = () => {
    console.log("✅ Підключено до сервера WebSocket");
    document.getElementById("sendBtn").disabled = false;
};

socket.onerror = (error) => {
    console.error("❌ Помилка WebSocket:", error);
    document.getElementById("chat").innerHTML += `<p style="color: red">Помилка підключення до сервера. Переконайтеся, що сервер запущено.</p>`;
    document.getElementById("sendBtn").disabled = true;
};

socket.onmessage = async (event) => {
    const chat = document.getElementById("chat");
    const userCountElement = document.getElementById("userCount");
    
    const textData = event.data instanceof Blob ? await event.data.text() : event.data; 
    const data = JSON.parse(textData);
    
    if (data.type === 'message') {
        chat.innerHTML += `<p>${data.message}</p>`;
    } else if (data.type === 'userCount') {
        userCountElement.textContent = `Користувачів онлайн: ${data.count}`;
    }
};

document.getElementById('sendBtn').addEventListener('click', () => sendMessage());

document.getElementById('messageInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const input = document.getElementById("messageInput");
    if (input.value.trim() !== '') {
        socket.send(JSON.stringify({ message: input.value }));
        input.value = "";
    }
}