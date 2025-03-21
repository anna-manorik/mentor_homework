const WebSocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server");
});

const wss = new WebSocket.Server({ server });

let users = new Set();

function broadcastOnlineUsers() {
    const onlineCount = users.size;
    const message = JSON.stringify({ type: "online", count: onlineCount });

    console.log(`🟢 Онлайн користувачів: ${onlineCount}`);
    console.log("📤 Відправляю:", message);

    users.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

wss.on("connection", (ws) => {
  console.log("✅ Користувач підключився!");
  users.add(ws);
  
  
  // Надсилаємо повідомлення клієнту після підключення
  ws.send(JSON.stringify({ message: "Ласкаво просимо!" }));
  broadcastOnlineUsers();
  // Обробка вхідних повідомлень
  ws.on("message", (data) => {
    console.log("📩 Отримано повідомлення:", data);
   
    // Розсилаємо отримане повідомлення всім підключеним клієнтам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  // Обробка роз'єднання
  ws.on("close", () => {
    console.log("⛔ Користувач відключився");
    users.delete(ws);
    broadcastOnlineUsers();
  });


});

