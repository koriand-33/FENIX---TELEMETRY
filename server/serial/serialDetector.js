import { SerialPort } from "serialport";

/**
 * Obtiene todos los puertos seriales disponibles.
 */
export async function getSerialPorts() {
  try {
    const ports = await SerialPort.list();

    return ports.map((port) => ({
      path: port.path,
      manufacturer: port.manufacturer || "Desconocido",
      serialNumber: port.serialNumber || "Desconocido",
      vendorId: port.vendorId || "Desconocido",
      productId: port.productId || "Desconocido",
    }));
  } catch (error) {
    console.error("❌ Error obteniendo puertos seriales:", error.message);
    return [];
  }
}

/**
 * Muestra los puertos seriales disponibles en consola.
 */
export async function printSerialPorts() {
  const ports = await getSerialPorts();

  console.log("\n=================================");
  console.log("     FENIX TELEMETRY - SERIAL");
  console.log("=================================\n");

  if (ports.length === 0) {
    console.log("❌ No se encontraron puertos seriales.");
    return ports;
  }

  ports.forEach((port, index) => {
    console.log(`[${index + 1}] ${port.path}`);
    console.log(`    Fabricante : ${port.manufacturer}`);
    console.log(`    Serial     : ${port.serialNumber}`);
    console.log(`    Vendor ID  : ${port.vendorId}`);
    console.log(`    Product ID : ${port.productId}`);
    console.log("---------------------------------");
  });

  return ports;
}