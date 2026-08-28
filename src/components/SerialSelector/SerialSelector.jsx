import { useEffect, useState } from "react";

import {
  requestSerialPorts,
  connectSerialPort,
  disconnectSerialPort,
} from "../../services/websocket";

import "./SerialSelector.css";

export default function SerialSelector({
  ports = [],
  connected = false,
  connecting = false,
  currentPort = null,
}) {

  const [selectedPort, setSelectedPort] =
    useState("");

  useEffect(() => {
    if (currentPort) {
      setSelectedPort(
        currentPort
      );
    }
  }, [currentPort]);

  function handleConnect() {
    if (!selectedPort) {
      return;
    }

    connectSerialPort(
      selectedPort
    );
  }

  function handleDisconnect() {
    disconnectSerialPort();
  }

  return (
    <div className="serial-selector">

      <div className="serial-title">
        PUERTO SERIAL
      </div>

      <div className="serial-controls">

        <select
          value={selectedPort}
          onChange={(event) =>
            setSelectedPort(
              event.target.value
            )
          }
          disabled={
            connected ||
            connecting
          }
        >
          <option value="">
            Seleccionar puerto
          </option>

          {ports.map((port) => (
            <option
              key={port.path}
              value={port.path}
            >
              {port.path}
            </option>
          ))}
        </select>

        <button
          onClick={
            connected
              ? handleDisconnect
              : handleConnect
          }
          disabled={
            !selectedPort &&
            !connected
          }
        >
          {connected
            ? "DESCONECTAR"
            : connecting
              ? "CONECTANDO..."
              : "CONECTAR"}
        </button>

        <button
          className="refresh-button"
          onClick={
            requestSerialPorts
          }
          title="Actualizar puertos"
        >
          ↻
        </button>

      </div>

      <div className="serial-status">

        <span
          className={
            connected
              ? "status-dot connected"
              : "status-dot"
          }
        />

        <span>
          {connected
            ? `Conectado — ${currentPort}`
            : connecting
              ? `Conectando — ${currentPort}`
              : "ESP32 desconectada"}
        </span>

      </div>

    </div>
  );
}