const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => console.log("✅ Підключено до сервера WebSocket");

    socket.onmessage = async (event) => {
        console.log("🔌 Стан WebSocket:", socket.readyState);
        const chat = document.getElementById("chat");
        const onlineIndicator = document.getElementById("onlineCount");

        const textData = event.data instanceof Blob ? await event.data.text() : event.data; 
        const data = JSON.parse(textData);

        if (data.type === 'message') {
            chat.innerHTML += `<p>${data.message}</p>`;
        } else if (data.type === 'userCount') {
            onlineIndicator.textContent = `Користувачів онлайн: ${data.count}`;
        }
    };

    socket.onclose = () => {
        console.log("🔴 З'єднання з WebSocket закрито!");
    };

    document.getElementById('sendBtn').addEventListener('click', () => sendMessage())

    function sendMessage() {
        const input = document.getElementById("messageInput");
        if (input.value.trim() !== '') {
            socket.send(JSON.stringify({ message: input.value }));
            input.value = "";
        }
    }

