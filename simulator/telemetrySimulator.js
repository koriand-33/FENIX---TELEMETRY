import { parseTelemetryPacket } from "../server/telemetry/telemetryParser.js";
import { broadcastTelemetry } from "../server/websocket/websocketServer.js";

let packetId = 1;

let current = -18.6;
let voltage = 523;

function sendPacket(rawPacket) {
  console.log(`\n📡 SIM → ${rawPacket}`);

  const telemetry = parseTelemetryPacket(rawPacket);

  if (!telemetry.valid) {
    console.log("❌ Paquete inválido:", telemetry.error);
    return;
  }

  console.dir(telemetry, { depth: null });

  broadcastTelemetry(telemetry);
}

function generateTelemetry() {
  /*
   * Pequeña variación para que podamos
   * observar movimiento en el dashboard.
   */

  current += (Math.random() - 0.5) * 10;

  if (current > 60) {
    current = 60;
  }

  if (current < -220) {
    current = -220;
  }

  voltage += (Math.random() - 0.5) * 2;

  if (voltage > 540) {
    voltage = 540;
  }

  if (voltage < 480) {
    voltage = 480;
  }

  const packet = [
    "T",
    packetId,
    85,                  // Curtis IRMS
    4200,                // RPM
    120,                 // Torque
    45,                  // Motor temp
    38,                  // Controller temp
    20,                  // Acceleration
    10,                  // Regen
    0,                   // Curtis errors

    Math.round(voltage), // BMS voltage
    current.toFixed(1),  // BMS current
    86,                   // SOC
    31,                   // Max temp
    24,                   // Min temp
    16,                   // Cells
    0,                    // BMS errors
  ];

  sendPacket(packet.join(","));

  packetId++;
}

function generateCells() {
  const cells = [
  331,
  330,
  298, // 🟡
  328,
  327,
  269, // 🔴
  325,
  324,
  323,
  322,
  321,
  320,
  319,
  318,
  317,
  316,
];

  const packet = [
    "C",
    ...cells,
  ];

  sendPacket(packet.join(","));
}

export function startSimulator() {
  console.log("\n=================================");
  console.log("     FENIX TELEMETRY SIMULATOR");
  console.log("=================================\n");

  console.log("🟢 Simulador iniciado.");
  console.log("📡 Generando telemetría cada segundo...\n");

  generateTelemetry();
  generateCells();

  setInterval(() => {
    generateTelemetry();
  }, 1000);

  setInterval(() => {
    generateCells();
  }, 1000);
}