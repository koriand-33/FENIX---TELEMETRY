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
  3.31, // 1 NORMAL
  3.30, // 2 NORMAL
  3.29, // 3 NORMAL
  3.70, // 4 🔴 CRITICAL
  3.01, // 5 NORMAL
  2.95, // 6 🟡 WARNING
  3.40, // 7 NORMAL
  3.50, // 8 NORMAL
  3.60, // 9 🟡 WARNING
  3.65, // 10 🟡 WARNING
  2.79, // 11 🔴 CRITICAL
  3.32, // 12 NORMAL
  3.33, // 13 NORMAL
  2.34, // 14 NORMAL
  3.35, // 15 NORMAL
  3.31, // 16 NORMAL
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