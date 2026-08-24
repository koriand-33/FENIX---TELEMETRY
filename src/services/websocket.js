const WEBSOCKET_URL = "ws://localhost:8080";

let socket = null;

export function connectWebSocket({
  onMessage,
  onOpen,
  onClose,
  onError,
} = {}) {
  socket = new WebSocket(WEBSOCKET_URL);

  socket.onopen = () => {
    console.log("🟢 WebSocket conectado");

    if (onOpen) {
      onOpen();
    }
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (onMessage) {
        onMessage(data);
      }
    } catch (error) {
      console.error(
        "❌ Error procesando mensaje WebSocket:",
        error
      );
    }
  };

  socket.onclose = () => {
    console.log("🔴 WebSocket desconectado");

    if (onClose) {
      onClose();
    }
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);

    if (onError) {
      onError(error);
    }
  };

  return socket;
}

export function disconnectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function isWebSocketConnected() {
  return socket?.readyState === WebSocket.OPEN;
}