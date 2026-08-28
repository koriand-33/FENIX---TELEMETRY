/**
 * Convierte un valor recibido por Serial a número.
 */
function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

/**
 * Procesa un paquete de telemetría.
 *
 * Tipos:
 * T -> Curtis + BMS
 * C -> Celdas individuales
 */
export function parseTelemetryPacket(rawPacket) {
  if (!rawPacket || typeof rawPacket !== "string") {
    return {
      valid: false,
      error: "Paquete vacío o inválido",
    };
  }

  const packet = rawPacket.trim();

  if (!packet) {
    return {
      valid: false,
      error: "Paquete vacío",
    };
  }

  const values = packet.split(",");

  const packetType = values[0];

  if (packetType === "T") {
    return parseTelemetryT(values);
  }

  if (packetType === "C") {
    return parseTelemetryC(values);
  }

  return {
    valid: false,
    type: packetType,
    error: `Tipo de paquete desconocido: ${packetType}`,
  };
}

/**
 * Procesa paquete T.
 *
 * T,
 * paqueteId,
 * curtis_irms,
 * curtis_rpm,
 * curtis_torque,
 * curtis_t_motor,
 * curtis_t_ctrl,
 * curtis_accel,
 * curtis_freno_regen,
 * curtis_errores,
 * bms_voltaje,
 * bms_corriente,
 * bms_soc,
 * bms_t_max,
 * bms_t_min,
 * bms_celdas,
 * bms_errores
 */
function parseTelemetryT(values) {
  if (values.length !== 17) {
    return {
      valid: false,
      type: "T",
      error: `Paquete T inválido. Se esperaban 17 valores y llegaron ${values.length}.`,
    };
  }

  return {
    valid: true,
    type: "T",

    packetId: toNumber(values[1]),

    curtis: {
      irms: toNumber(values[2]) / 10,
      rpm: toNumber(values[3]),
      torque: toNumber(values[4]),
      motorTemp: toNumber(values[5]) / 10,
      controllerTemp: toNumber(values[6]) / 10,
      acceleration: toNumber(values[7]) / 10,
      regen: toNumber(values[8]) / 10,
      errors: toNumber(values[9]),
    },

    bms: {
      voltage: toNumber(values[10]) / 10,
      current: toNumber(values[11]) / 10,
      soc: toNumber(values[12]) / 10,
      maxTemp: toNumber(values[13]),
      minTemp: toNumber(values[14]),
      cellsCount: toNumber(values[15]),
      errors: toNumber(values[16]),
    },
  };
}

/**
 * Procesa paquete C.
 
 */
function parseTelemetryC(values) {
  const cellValues = values.slice(1);

  if (cellValues.length !== 16) {
    return {
      valid: false,
      type: "C",
      error: `Paquete C inválido. Se esperaban 16 celdas y llegaron ${cellValues.length}.`,
    };
  }

 const cells = cellValues.map((cell) => {
  const value = toNumber(cell);

  return value !== null ? value / 1000 : null;
});

return {
  valid : true,
  type: "C",
  cells,
};
 }