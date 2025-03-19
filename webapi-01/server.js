const WebSocket = require("ws");

// Створюємо WebSocket-сервер на порту 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("✅ Користувач підключився!");

  // Надсилаємо повідомлення клієнту після підключення
  ws.send(JSON.stringify({ message: "Ласкаво просимо!" }));

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
  });
});
