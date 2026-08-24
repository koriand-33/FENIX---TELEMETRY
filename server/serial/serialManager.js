import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const BAUD_RATE = 115200;

let serialPort = null;
let parser = null;

/**
 * Conecta FENIX a un puerto serial.
 */
export function connectSerial(portPath, onData) {
  if (serialPort?.isOpen) {
    console.log("⚠️ Ya existe una conexión serial activa.");
    return serialPort;
  }

  console.log(`\n🔌 Intentando conectar a ${portPath}...`);

  serialPort = new SerialPort({
    path: portPath,
    baudRate: BAUD_RATE,
  });

  parser = serialPort.pipe(
    new ReadlineParser({
      delimiter: "\n",
    })
  );

  serialPort.on("open", () => {
    console.log("\n🟢 ESP32 SERIAL CONNECTED");
    console.log(`Puerto   : ${portPath}`);
    console.log(`Baudrate : ${BAUD_RATE}`);
    console.log("Esperando telemetría...\n");
  });

  parser.on("data", (data) => {
    const packet = data.trim();

    if (!packet) {
      return;
    }

    console.log(`📡 RX: ${packet}`);

    if (onData) {
      onData(packet);
    }
  });

  serialPort.on("error", (error) => {
    console.error(`❌ Error en ${portPath}:`, error.message);
  });

  serialPort.on("close", () => {
    console.log(`\n🔴 ESP32 SERIAL DISCONNECTED`);
    console.log(`Puerto: ${portPath}\n`);

    serialPort = null;
    parser = null;
  });

  return serialPort;
}

/**
 * Desconecta el puerto serial actual.
 */
export function disconnectSerial() {
  if (!serialPort) {
    console.log("⚠️ No existe una conexión serial activa.");
    return;
  }

  if (serialPort.isOpen) {
    serialPort.close();
  }

  serialPort = null;
  parser = null;

  console.log("🔌 Conexión serial cerrada.");
}

/**
 * Indica si existe una conexión serial activa.
 */
export function isSerialConnected() {
  return serialPort?.isOpen ?? false;
}