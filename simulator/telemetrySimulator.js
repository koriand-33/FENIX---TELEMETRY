import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let simulatorInterval = null;
let currentLine = 0;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(
  __dirname,
  "data",
  "Prueba2.txt"
);

export function startSimulator(onData) {
  if (simulatorInterval) {
    console.log("⚠️ El simulador ya está corriendo");
    return;
  }

  if (!fs.existsSync(DATA_FILE)) {
    console.error(
      "❌ No se encontró el archivo:",
      DATA_FILE
    );
    return;
  }

  const fileContent = fs.readFileSync(
    DATA_FILE,
    "utf8"
  );

  const lines = fileContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.startsWith("T,") ||
        line.startsWith("C,")
    );

  if (lines.length === 0) {
    console.error(
      "❌ No se encontraron paquetes T o C"
    );
    return;
  }

  console.log(
    `🟠 Simulador FENIX iniciado con ${lines.length} paquetes`
  );

  currentLine = 0;

  simulatorInterval = setInterval(() => {
    const packet = lines[currentLine];

    if (!packet) {
      currentLine = 0;
      return;
    }

    console.log(
      `📡 SIM [${currentLine + 1}/${lines.length}]:`,
      packet
    );

    onData(packet);

    currentLine++;

    // Cuando llega al final,
    // vuelve a comenzar desde arriba.
    if (currentLine >= lines.length) {
      console.log(
        "🔁 Fin del archivo. Reiniciando simulación..."
      );

      currentLine = 0;
    }
  }, 250);
}

export function stopSimulator() {
  if (!simulatorInterval) {
    return;
  }

  clearInterval(simulatorInterval);

  simulatorInterval = null;

  currentLine = 0;

  console.log(
    "⚫ Simulador FENIX detenido"
  );
}

export function isSimulatorRunning() {
  return simulatorInterval !== null;
}