const TELEMETRY_HEADERS = [
  "timestamp",
  "packet_id",

  "curtis_irms",
  "curtis_rpm",
  "curtis_torque",
  "curtis_t_motor",
  "curtis_t_ctrl",
  "curtis_accel",
  "curtis_freno_regen",
  "curtis_errores",

  "bms_voltaje",
  "bms_corriente",
  "bms_soc",
  "bms_t_max",
  "bms_t_min",
  "bms_celdas",
  "bms_errores",

  "cell_1",
  "cell_2",
  "cell_3",
  "cell_4",
  "cell_5",
  "cell_6",
  "cell_7",
  "cell_8",
  "cell_9",
  "cell_10",
  "cell_11",
  "cell_12",
  "cell_13",
  "cell_14",
  "cell_15",
  "cell_16",
];

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function formatTimestamp(date) {
  return date.toISOString();
}

export function createTelemetryRecorder() {
  let recording = false;
  let rows = [];

  let latestCurtis = {};
  let latestBms = {};
  let latestCells = Array(16).fill("");

  function start() {
    rows = [];
    recording = true;
  }

  function stop() {
    recording = false;
  }

  function update(data) {
    if (!recording || !data) {
      return;
    }

    const timestamp = formatTimestamp(new Date());

    if (data.type === "T") {
      latestCurtis = data.curtis || {};
      latestBms = data.bms || {};

      rows.push({
        timestamp,
        packet_id: latestCurtis.packetId ?? data.packetId ?? "",

        curtis_irms: latestCurtis.irms ?? "",
        curtis_rpm: latestCurtis.rpm ?? "",
        curtis_torque: latestCurtis.torque ?? "",
        curtis_t_motor: latestCurtis.motorTemp ?? "",
        curtis_t_ctrl: latestCurtis.controllerTemp ?? "",
        curtis_accel: latestCurtis.acceleration ?? "",
        curtis_freno_regen: latestCurtis.regen ?? "",
        curtis_errores: latestCurtis.errors ?? "",

        bms_voltaje: latestBms.voltage ?? "",
        bms_corriente: latestBms.current ?? "",
        bms_soc: latestBms.soc ?? "",
        bms_t_max: latestBms.maxTemp ?? "",
        bms_t_min: latestBms.minTemp ?? "",
        bms_celdas: latestBms.cellsCount ?? "",
        bms_errores: latestBms.errors ?? "",

        cells: [...latestCells],
      });
    }

    if (data.type === "C") {
      latestCells = Array.isArray(data.cells)
        ? [...data.cells].slice(0, 16)
        : latestCells;
    }
  }

  function getRowCount() {
    return rows.length;
  }

  function download(filename = null) {
    if (rows.length === 0) {
      return false;
    }

    const csvRows = [];

    csvRows.push(TELEMETRY_HEADERS.join(","));

    rows.forEach((row) => {
      const values = [
        row.timestamp,
        row.packet_id,

        row.curtis_irms,
        row.curtis_rpm,
        row.curtis_torque,
        row.curtis_t_motor,
        row.curtis_t_ctrl,
        row.curtis_accel,
        row.curtis_freno_regen,
        row.curtis_errores,

        row.bms_voltaje,
        row.bms_corriente,
        row.bms_soc,
        row.bms_t_max,
        row.bms_t_min,
        row.bms_celdas,
        row.bms_errores,

        ...row.cells,
      ];

      csvRows.push(values.map(escapeCsvValue).join(","));
    });

    const csvContent = "\uFEFF" + csvRows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      filename ||
      `FENIX_telemetry_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return true;
  }

  return {
    start,
    stop,
    update,
    download,
    getRowCount,
    isRecording: () => recording,
  };
}