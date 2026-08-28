import { WebSocketServer } from "ws";

const WEBSOCKET_PORT = 8080;

let wss = null;
let commandHandler = null;

export function startWebSocketServer(onCommand) {
  commandHandler = onCommand;

  wss = new WebSocketServer({
    port: WEBSOCKET_PORT,
  });

  wss.on("listening", () => {
    console.log(
      `🟢 WebSocket activo en ws://localhost:${WEBSOCKET_PORT}`
    );
  });

  wss.on("connection", (socket) => {
    console.log(
      "🟢 Dashboard conectado al WebSocket"
    );

    socket.send(
      JSON.stringify({
        type: "connection",
        status: "connected",
      })
    );

    socket.on("message", async (message) => {
      try {
        const command = JSON.parse(
          message.toString()
        );

        console.log(
          "📨 Comando recibido:",
          command
        );

        if (commandHandler) {
          await commandHandler(
            command,
            socket
          );
        }

      } catch (error) {
        console.error(
          "❌ Error procesando comando:",
          error.message
        );
      }
    });

    socket.on("close", () => {
      console.log(
        "🔴 Dashboard desconectado"
      );
    });

    socket.on("error", (error) => {
      console.error(
        "❌ WebSocket error:",
        error.message
      );
    });
  });

  return wss;
}

export function broadcastTelemetry(data) {
  if (!wss) return;

  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

export function broadcastSerialStatus(data) {
  if (!wss) return;

  const message = JSON.stringify({
    type: "serial_status",
    ...data,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

export function sendToClient(socket, data) {
  if (
    !socket ||
    socket.readyState !== 1
  ) {
    return;
  }

  socket.send(
    JSON.stringify(data)
  );
}