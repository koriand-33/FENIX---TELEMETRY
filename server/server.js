import {
  getSerialPorts,
} from "./serial/serialDetector.js";

import {
  connectSerial,
  disconnectSerial,
  isSerialConnected,
  getCurrentSerialPort,
} from "./serial/serialManager.js";

import {
  startWebSocketServer,
  broadcastTelemetry,
  broadcastSerialStatus,
  sendToClient,
} from "./websocket/websocketServer.js";

import {
  parseTelemetryPacket,
} from "./telemetry/telemetryParser.js";


import {
  startSimulator,
  stopSimulator,
} from "../simulator/telemetrySimulator.js";

const SCAN_INTERVAL = 3000;

/**
 * Procesa datos de la ESP32.
 */
function handleTelemetryPacket(rawPacket) {
  console.log(
    "📡 Recibido:",
    rawPacket
  );

  const telemetry =
    parseTelemetryPacket(rawPacket);

  if (!telemetry.valid) {
    console.error(
      "❌ Paquete inválido:",
      telemetry.error
    );

    return;
  }

  broadcastTelemetry(
    telemetry
  );
}

/**
 * Envía la lista de puertos
 * al dashboard.
 */
async function sendSerialPorts(socket) {
  const ports =
    await getSerialPorts();

  sendToClient(socket, {
    type: "serial_ports",
    ports,
  });
}

/**
 * Envía el estado actual
 * de la conexión.
 */
function sendSerialStatus(socket = null) {
  const status = {
    connected:
      isSerialConnected(),

    port:
      getCurrentSerialPort(),

    connecting: false,
  };

  if (socket) {
    sendToClient(socket, {
      type: "serial_status",
      ...status,
    });

    return;
  }

  broadcastSerialStatus(
    status
  );
}

/**
 * Conecta al puerto seleccionado.
 */
async function handleConnectSerial(
  portPath,
  socket
) {
  if (!portPath) {
    sendToClient(socket, {
      type: "serial_error",
      message:
        "No se seleccionó ningún puerto.",
    });

    return;
  }

  const ports =
    await getSerialPorts();

  const selectedPort =
    ports.find(
      (port) =>
        port.path === portPath
    );

  if (!selectedPort) {
    sendToClient(socket, {
      type: "serial_error",
      message:
        `El puerto ${portPath} ya no está disponible.`,
    });

    await sendSerialPorts(socket);

    return;
  }

  console.log(
    `🔌 Conectando a ${portPath}...`
  );

  sendToClient(socket, {
    type: "serial_status",
    connected: false,
    connecting: true,
    port: portPath,
  });

  connectSerial(
    portPath,
    handleTelemetryPacket,
    (status) => {
      broadcastSerialStatus(
        status
      );
    }
  );
}

/**
 * Desconecta el puerto.
 */
function handleDisconnectSerial(
  socket
) {
  disconnectSerial();

  sendToClient(socket, {
    type: "serial_status",
    connected: false,
    connecting: false,
    port: null,
  });
}

/**
 * Procesa comandos del dashboard.
 */
async function handleCommand(
  command,
  socket
) {
  switch (command.type) {

    case "get_serial_ports":
      await sendSerialPorts(
        socket
      );
      break;

    case "get_serial_status":
      sendSerialStatus(
        socket
      );
      break;

    case "connect_serial":
      await handleConnectSerial(
        command.port,
        socket
      );
      break;

    case "disconnect_serial":
      handleDisconnectSerial(
        socket
      );
      break;

    default:
      console.warn(
        "⚠️ Comando desconocido:",
        command.type
      );
  }
}

/**
 * Escanea los puertos periódicamente.
 */
async function scanSerialPorts() {
  const ports =
    await getSerialPorts();

  const currentPort =
    getCurrentSerialPort();

  /**
   * Si el puerto actualmente conectado
   * desapareció, notificamos desconexión.
   */
  if (
    currentPort &&
    !ports.some(
      (port) =>
        port.path === currentPort
    )
  ) {
    console.log(
      `🔴 ${currentPort} desconectado físicamente.`
    );

    disconnectSerial();

    broadcastSerialStatus({
      connected: false,
      connecting: false,
      port: null,
    });
  }
}

/**
 * Inicio del servidor.
 */
async function startServer() {
  console.log("");
  console.log(
    "================================="
  );
  console.log(
    "       FENIX TELEMETRY"
  );
  console.log(
    "       SERIAL SERVER"
  );
  console.log(
    "================================="
  );
  console.log("");

  startWebSocketServer(
    handleCommand
  );

  startSimulator(handleTelemetryPacket);

  await scanSerialPorts();

  setInterval(
    scanSerialPorts,
    SCAN_INTERVAL
  );
}

startServer();