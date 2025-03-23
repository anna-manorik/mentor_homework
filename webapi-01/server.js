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


function broadcastUserCount() {
  const userCount = users.size;
  const userCountMessage = JSON.stringify({ 
    type: 'userCount', 
    count: userCount 
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(userCountMessage);
    }
  });
}

wss.on("connection", (ws) => {
  console.log("✅ Користувач підключився!");
  
  users.add(ws);

  ws.send(JSON.stringify({ 
    type: 'message',
    message: "Ласкаво просимо!" 
  }));
  
  broadcastUserCount();

  ws.on("message", (data) => {
    console.log("📩 Отримано повідомлення:", data);
    
    try {
      const parsedData = JSON.parse(data);
      const outgoingMessage = JSON.stringify({
        type: 'message',
        message: parsedData.message
      });
      
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(outgoingMessage);
        }
      });
    } catch (error) {
      console.error("Помилка обробки повідомлення:", error);
    }
  });

  ws.on("close", () => {
    console.log("⛔ Користувач відключився");
    
    users.delete(ws);
    
    broadcastUserCount();
  });
});

server.listen(9090, () => {
  console.log("📡 WebSocket сервер запущено на порту 9090");
});