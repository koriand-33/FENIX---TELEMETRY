import { useEffect, useRef, useState } from "react";

import { createTelemetryRecorder } from "../services/telemetryRecorder";

import {
  connectWebSocket,
  requestSerialPorts,
  requestSerialStatus,
} from "../services/websocket";

export default function useTelemetry() {
  /*
   * ==========================================
   * TELEMETRÍA
   * ==========================================
   */

  const [telemetry, setTelemetry] = useState({
    curtis: {},
    bms: {},
    cells: [],
    history: [],
  });

  /*
   * ==========================================
   * WEBSOCKET
   * ==========================================
   */

  const [connected, setConnected] = useState(false);

  /*
   * ==========================================
   * PUERTO SERIAL
   * ==========================================
   */

  const [serialPorts, setSerialPorts] = useState([]);

  const [serialConnected, setSerialConnected] =
    useState(false);

  const [serialConnecting, setSerialConnecting] =
    useState(false);

  const [currentPort, setCurrentPort] =
    useState(null);

  /*
   * ==========================================
   * RECORDER
   * ==========================================
   */

  const recorderRef = useRef(null);

  if (!recorderRef.current) {
    recorderRef.current =
      createTelemetryRecorder();
  }

  /*
   * ==========================================
   * WEBSOCKET
   * ==========================================
   */

  useEffect(() => {
    const recorder = recorderRef.current;

    const socket = connectWebSocket({
      /*
       * WebSocket conectado
       */
      onOpen: () => {
        console.log(
          "🟢 WebSocket conectado"
        );

        setConnected(true);

        // Pedimos inmediatamente los puertos
        // disponibles al servidor.
        requestSerialPorts();

        // También pedimos el estado actual.
        requestSerialStatus();
      },

      /*
       * WebSocket desconectado
       */
      onClose: () => {
        console.log(
          "🔴 WebSocket desconectado"
        );

        setConnected(false);
      },

      /*
       * Error WebSocket
       */
      onError: (error) => {
        console.error(
          "❌ WebSocket error:",
          error
        );

        setConnected(false);
      },

      /*
       * ==========================================
       * MENSAJES DEL SERVIDOR
       * ==========================================
       */
      onMessage: (data) => {
        if (!data) {
          return;
        }

        console.log(
          "📡 DATO RECIBIDO:",
          data
        );

        console.log(
          "📡 TYPE:",
          data.type
        );

        /*
         * ==========================================
         * LISTA DE PUERTOS SERIALES
         * ==========================================
         */

        if (data.type === "serial_ports") {
          console.log(
            "🔌 Puertos seriales:",
            data.ports
          );

          setSerialPorts(
            data.ports || []
          );

          return;
        }

        /*
         * ==========================================
         * ESTADO DEL PUERTO SERIAL
         * ==========================================
         */

        if (data.type === "serial_status") {
          console.log(
            "🔌 Estado serial:",
            data
          );

          setSerialConnected(
            Boolean(data.connected)
          );

          setSerialConnecting(
            Boolean(data.connecting)
          );

          setCurrentPort(
            data.port || null
          );

          return;
        }

        /*
         * ==========================================
         * ERROR SERIAL
         * ==========================================
         */

        if (data.type === "serial_error") {
          console.error(
            "❌ Error serial:",
            data.message
          );

          setSerialConnecting(false);

          return;
        }

        /*
         * ==========================================
         * GRABADOR
         * ==========================================
         *
         * Solo guardamos paquetes reales de
         * telemetría T y C.
         */

        if (
          data.type === "T" ||
          data.type === "C"
        ) {
          recorder.update(data);
        }

        /*
         * ==========================================
         * PAQUETE T
         * ==========================================
         *
         * Curtis + BMS
         */

        if (data.type === "T") {
          const bms =
            data.bms || {};

          const voltage =
            Number(bms.voltage);

          const current =
            Number(bms.current);

          console.log(
            "🔋 BMS:",
            {
              voltage,
              current,
              raw: bms,
            }
          );

          const now = new Date();

          const historyPoint = {
            time:
              now.toLocaleTimeString(
                [],
                {
                  minute: "2-digit",
                  second: "2-digit",
                }
              ),

            voltage:
              Number.isFinite(voltage)
                ? voltage
                : null,

            current:
              Number.isFinite(current)
                ? current
                : null,
          };

          setTelemetry(
            (previous) => ({
              ...previous,

              curtis:
                data.curtis || {},

              bms,

              history: [
                ...previous.history,
                historyPoint,
              ].slice(-120),
            })
          );

          return;
        }

        /*
         * ==========================================
         * PAQUETE C
         * ==========================================
         *
         * 16 celdas del BMS.
         */

        if (data.type === "C") {
          setTelemetry(
            (previous) => ({
              ...previous,

              cells:
                data.cells || [],
            })
          );
        }
      },
    });

    /*
     * ==========================================
     * CLEANUP
     * ==========================================
     */

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  /*
   * ==========================================
   * DATOS DISPONIBLES PARA DASHBOARD
   * ==========================================
   */

  return {
    telemetry,

    connected,

    recorder:
      recorderRef.current,

    serialPorts,

    serialConnected,

    serialConnecting,

    currentPort,
  };
}