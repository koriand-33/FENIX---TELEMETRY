const WEBSOCKET_URL =
  `ws://${window.location.hostname}:8080`;
let socket = null;

export function connectWebSocket({
  onMessage,
  onOpen,
  onClose,
  onError,
} = {}) {

  socket = new WebSocket(
    WEBSOCKET_URL
  );

  socket.onopen = () => {
    console.log(
      "🟢 WebSocket conectado"
    );

    onOpen?.();
  };

  socket.onmessage = (event) => {
    try {
      const data =
        JSON.parse(event.data);

      onMessage?.(data);

    } catch (error) {
      console.error(
        "❌ Error WebSocket:",
        error
      );
    }
  };

  socket.onclose = () => {
    console.log(
      "🔴 WebSocket desconectado"
    );

    onClose?.();
  };

  socket.onerror = (error) => {
    console.error(
      "❌ WebSocket error:",
      error
    );

    onError?.(error);
  };

  return socket;
}

export function sendWebSocketMessage(
  message
) {
  if (
    !socket ||
    socket.readyState !==
      WebSocket.OPEN
  ) {
    console.warn(
      "⚠️ WebSocket no conectado."
    );

    return false;
  }

  socket.send(
    JSON.stringify(message)
  );

  return true;
}

export function requestSerialPorts() {
  return sendWebSocketMessage({
    type: "get_serial_ports",
  });
}

export function requestSerialStatus() {
  return sendWebSocketMessage({
    type: "get_serial_status",
  });
}

export function connectSerialPort(
  port
) {
  return sendWebSocketMessage({
    type: "connect_serial",
    port,
  });
}

export function disconnectSerialPort() {
  return sendWebSocketMessage({
    type: "disconnect_serial",
  });
}

export function disconnectWebSocket() {
  socket?.close();

  socket = null;
}