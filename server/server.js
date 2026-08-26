import {
  getSerialPorts,
  printSerialPorts,
} from "./serial/serialDetector.js";

import {
  connectSerial,
  disconnectSerial,
  isSerialConnected,
} from "./serial/serialManager.js";

import { parseTelemetryPacket } from "./telemetry/telemetryParser.js";

import {
  startWebSocketServer,
  broadcastTelemetry,
} from "./websocket/websocketServer.js";


import { startSimulator } from "../simulator/telemetrySimulator.js";
const SCAN_INTERVAL = 3000;

let currentPort = null;

/**
 * Procesa un paquete recibido desde la ESP32.
 */
function handleTelemetryPacket(rawPacket) {
  console.log("\n Paquete recibido desde ESP32:");
  console.log(rawPacket);

  const telemetry = parseTelemetryPacket(rawPacket);

  if (!telemetry.valid) {
    console.log(" Paquete inválido:");
    console.log(telemetry.error);
    return;
  }

  console.log("\n Telemetría procesada:");

  console.dir(telemetry, {
    depth: null,
  });

  broadcastTelemetry(telemetry);
}
/**
 * Busca dispositivos seriales.
 */
async function scanSerialPorts() {
  const ports = await getSerialPorts();

  if (ports.length === 0) {
    if (currentPort !== null) {
      console.log(" ESP32 desconectada.");

      disconnectSerial();

      currentPort = null;
    }

    console.log(" Esperando conexión de ESP32...");
    return;
  }

  const port = ports[0];

  /*
   * Si ya estamos conectados al mismo puerto,
   * no hacemos nada.
   */
  if (currentPort === port.path && isSerialConnected()) {
    return;
  }

  /*
   * Si aparece un puerto nuevo,
   * intentamos conectarnos.
   */
  console.log(`\n🔌 Dispositivo encontrado: ${port.path}`);

  currentPort = port.path;

  connectSerial(port.path, handleTelemetryPacket);
}

/**
 * Inicia FENIX Telemetry.
 */
async function startServer() {
  console.log("\n=================================");
  console.log("       FENIX TELEMETRY");
  console.log("       SERIAL SERVER");
  console.log("=================================\n");

  console.log("Servidor iniciado.");

  startWebSocketServer();

  if (process.env.SIMULATOR === "true") {
    console.log("🧪 MODO SIMULADOR ACTIVADO\n");

    startSimulator();

    return;
  }

  await scanSerialPorts();

  setInterval(scanSerialPorts, SCAN_INTERVAL);
}

startServer();