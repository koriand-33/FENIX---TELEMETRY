import { useEffect, useState } from "react";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../services/websocket";

export default function useTelemetry() {
  const [telemetry, setTelemetry] = useState({
    curtis: null,
    bms: null,
    cells: [],
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = connectWebSocket({
      onOpen: () => {
        setConnected(true);
      },

      onClose: () => {
        setConnected(false);
      },

      onMessage: (data) => {
        if (data.type === "connection") {
          return;
        }

        if (data.type === "T") {
          setTelemetry((previous) => ({
            ...previous,

            curtis: data.curtis,
            bms: data.bms,
          }));
        }

        if (data.type === "C") {
          setTelemetry((previous) => ({
            ...previous,

            cells: data.cells,
          }));
        }
      },
    });

    return () => {
      if (socket) {
        disconnectWebSocket();
      }
    };
  }, []);

  return {
    telemetry,
    connected,
  };
}