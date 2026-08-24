import { WebSocketServer } from "ws";

const WEBSOCKET_PORT = 8080;

let wss = null;

export function startWebSocketServer() {
  wss = new WebSocketServer({
    port: WEBSOCKET_PORT,
  });

  wss.on("listening", () => {
    console.log(
      `🟢 WebSocket activo en ws://localhost:${WEBSOCKET_PORT}`
    );
  });

  wss.on("connection", (socket) => {
    console.log("🟢 Dashboard conectado al WebSocket");

    socket.send(
      JSON.stringify({
        type: "connection",
        status: "connected",
        message: "FENIX Telemetry WebSocket conectado",
      })
    );

    socket.on("close", () => {
      console.log("🔴 Dashboard desconectado");
    });

    socket.on("error", (error) => {
      console.error("❌ WebSocket error:", error.message);
    });
  });

  wss.on("error", (error) => {
    console.error("❌ WebSocket Server error:", error.message);
  });

  return wss;
}

export function broadcastTelemetry(data) {
  if (!wss) {
    return;
  }

  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}