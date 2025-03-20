const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => console.log("✅ Підключено до сервера WebSocket");

    socket.onmessage = async (event) => {
        const chat = document.getElementById("chat");
        const textData = event.data instanceof Blob ? await event.data.text() : event.data; 
        const data = JSON.parse(textData);
        const message = data.message;
        chat.innerHTML += `<p>${message}</p>`;
    };

    document.getElementById('sendBtn').addEventListener('click', () => sendMessage())

    function sendMessage() {
        const input = document.getElementById("messageInput");
        socket.send(JSON.stringify({ message: input.value }));
        input.value = "";
    }