import { useEffect, useRef, useState } from "react";

import { createTelemetryRecorder } from "../services/telemetryRecorder";
import { connectWebSocket } from "../services/websocket";

export default function useTelemetry() {
  const [telemetry, setTelemetry] = useState({
    curtis: {},
    bms: {},
    cells: [],
    history: [],
  });

  const [connected, setConnected] = useState(false);

  // El recorder existe durante toda la sesión
  const recorderRef = useRef(null);

  if (!recorderRef.current) {
    recorderRef.current = createTelemetryRecorder();
  }

  useEffect(() => {
    const recorder = recorderRef.current;

    const socket = connectWebSocket({
      onOpen: () => {
        console.log("🟢 WebSocket conectado");
        setConnected(true);
      },

      onClose: () => {
        console.log("🔴 WebSocket desconectado");
        setConnected(false);
      },

      onError: (error) => {
        console.error("❌ WebSocket error:", error);
        setConnected(false);
      },

      onMessage: (data) => {
        if (!data) {
          return;
        }

        console.log("📡 DATO RECIBIDO:", data);
        console.log("📡 TYPE:", data.type);

        /*
         * ==========================================
         * GRABADOR
         * ==========================================
         *
         * Guardamos todos los paquetes:
         *
         * T → Curtis + BMS
         * C → 16 celdas
         */

        recorder.update(data);

        /*
         * ==========================================
         * PAQUETE T
         * ==========================================
         */

        if (data.type === "T") {
          const bms = data.bms || {};

          const voltage = Number(bms.voltage);
          const current = Number(bms.current);

          console.log("🔋 BMS:", {
            voltage,
            current,
            raw: bms,
          });

          const now = new Date();

          const historyPoint = {
            time: now.toLocaleTimeString([], {
              minute: "2-digit",
              second: "2-digit",
            }),

            voltage: Number.isFinite(voltage)
              ? voltage
              : null,

            current: Number.isFinite(current)
              ? current
              : null,
          };

          setTelemetry((previous) => ({
            ...previous,

            curtis: data.curtis || {},
            bms,

            history: [
              ...previous.history,
              historyPoint,
            ].slice(-120),
          }));
        }

        /*
         * ==========================================
         * PAQUETE C
         * ==========================================
         *
         * Contiene las 16 celdas.
         */

        if (data.type === "C") {
          setTelemetry((previous) => ({
            ...previous,
            cells: data.cells || [],
          }));
        }
      },
    });

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return {
    telemetry,
    connected,
    recorder: recorderRef.current,
  };
}