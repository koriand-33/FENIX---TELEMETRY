import { SerialPort } from "serialport";

let serialPort = null;

/**
 * Conecta al puerto serial indicado.
 *
 * Funciona con:
 * Windows -> COM5
 * Mac     -> /dev/cu.usbmodem14101
 * Linux   -> /dev/ttyUSB0
 */
export function connectSerial(portPath, onData, onStatus) {
  if (!portPath) {
    console.error("❌ No se especificó un puerto serial.");
    return;
  }

  // Si ya existe una conexión, la cerramos primero.
  if (serialPort && serialPort.isOpen) {
    console.log(
      `🔌 Cerrando conexión anterior: ${serialPort.path}`
    );

    serialPort.close();
    serialPort = null;
  }

  console.log(`🔌 Intentando conectar a ${portPath}...`);

  serialPort = new SerialPort({
    path: portPath,
    baudRate: 115200,
    autoOpen: false,
  });

  serialPort.open((error) => {
    if (error) {
      console.error(
        `❌ No se pudo abrir ${portPath}:`,
        error.message
      );

      if (onStatus) {
        onStatus({
          connected: false,
          connecting: false,
          port: portPath,
          error: error.message,
        });
      }

      serialPort = null;

      return;
    }

    console.log(
      `🟢 Puerto serial conectado: ${portPath}`
    );

    if (onStatus) {
      onStatus({
        connected: true,
        connecting: false,
        port: portPath,
        error: null,
      });
    }
  });

  serialPort.on("data", (data) => {
    if (onData) {
      onData(data.toString());
    }
  });

  serialPort.on("error", (error) => {
    console.error(
      `❌ Error en ${portPath}:`,
      error.message
    );

    if (onStatus) {
      onStatus({
        connected: false,
        connecting: false,
        port: portPath,
        error: error.message,
      });
    }
  });

  serialPort.on("close", () => {
    console.log(
      `🔴 Puerto serial cerrado: ${portPath}`
    );

    if (onStatus) {
      onStatus({
        connected: false,
        connecting: false,
        port: null,
        error: null,
      });
    }

    serialPort = null;
  });

  return serialPort;
}

/**
 * Desconecta el puerto serial actual.
 */
export function disconnectSerial() {
  if (!serialPort) {
    return;
  }

  const portPath = serialPort.path;

  console.log(
    `🔌 Desconectando ${portPath}...`
  );

  if (serialPort.isOpen) {
    serialPort.close();
  } else {
    serialPort = null;
  }
}

/**
 * Indica si existe una conexión serial abierta.
 */
export function isSerialConnected() {
  return !!(
    serialPort &&
    serialPort.isOpen
  );
}

/**
 * Devuelve el puerto actualmente conectado.
 */
export function getCurrentSerialPort() {
  if (
    serialPort &&
    serialPort.isOpen
  ) {
    return serialPort.path;
  }

  return null;
}