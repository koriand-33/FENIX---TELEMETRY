import {
  WebSocketServer,
  WebSocket,
} from "ws";

/*
=========================================
PUERTO DEL WEBSOCKET
=========================================

Local:
  8080

Railway / servidor cloud:
  Railway proporciona process.env.PORT
*/

const WEBSOCKET_PORT =
  Number(process.env.PORT) || 8080;

const WEBSOCKET_HOST =
  process.env.HOST || "0.0.0.0";


let wss = null;

let commandHandler = null;


/*
=========================================
INICIAR SERVIDOR WEBSOCKET
=========================================
*/

export function startWebSocketServer(onCommand) {

  commandHandler = onCommand;


  wss = new WebSocketServer({
    port: WEBSOCKET_PORT,
    host: WEBSOCKET_HOST,
  });


  /*
  =========================================
  SERVIDOR LISTO
  =========================================
  */

  wss.on("listening", () => {

    console.log(
      "🟢 WebSocket FENIX activo"
    );

    console.log(
      `📡 Puerto: ${WEBSOCKET_PORT}`
    );


    if (process.env.PORT) {

      console.log(
        "☁️ Modo producción / cloud"
      );

    } else {

      console.log(
        `🏠 Local: ws://localhost:${WEBSOCKET_PORT}`
      );

    }

  });


  /*
  =========================================
  NUEVO CLIENTE
  =========================================
  */

  wss.on("connection", (socket) => {

    console.log(
      "🟢 Cliente conectado al WebSocket"
    );


    /*
    Confirmamos al cliente que
    el WebSocket está funcionando.
    */

    sendToClient(
      socket,
      {
        type: "connection",
        status: "connected",
      }
    );


    /*
    =========================================
    COMANDOS DESDE EL CLIENTE
    =========================================
    */

    socket.on(
      "message",
      async (message) => {

        try {

          const command =
            JSON.parse(
              message.toString()
            );


          console.log(
            "📨 Comando recibido:",
            command
          );


          if (commandHandler) {

            await commandHandler(
              command,
              socket
            );

          }

        } catch (error) {

          console.error(
            "❌ Error procesando comando:",
            error.message
          );

        }

      }
    );


    /*
    =========================================
    CLIENTE DESCONECTADO
    =========================================
    */

    socket.on("close", () => {

      console.log(
        "🔴 Cliente desconectado del WebSocket"
      );

    });


    /*
    =========================================
    ERROR DE CLIENTE
    =========================================
    */

    socket.on(
      "error",
      (error) => {

        console.error(
          "❌ WebSocket error:",
          error.message
        );

      }
    );

  });


  /*
  =========================================
  ERROR DEL SERVIDOR
  =========================================
  */

  wss.on(
    "error",
    (error) => {

      console.error(
        "❌ Error del servidor WebSocket:",
        error.message
      );

    }
  );


  return wss;
}


/*
=========================================
BROADCAST DE TELEMETRÍA
=========================================

Envía un paquete de telemetría
a TODOS los dashboards conectados.
*/

export function broadcastTelemetry(data) {

  if (!wss) {
    return;
  }


  const message =
    JSON.stringify(data);


  wss.clients.forEach(
    (client) => {

      if (
        client.readyState ===
        WebSocket.OPEN
      ) {

        client.send(message);

      }

    }
  );

}


/*
=========================================
BROADCAST ESTADO SERIAL
=========================================
*/

export function broadcastSerialStatus(data) {

  if (!wss) {
    return;
  }


  const message =
    JSON.stringify({
      type: "serial_status",
      ...data,
    });


  wss.clients.forEach(
    (client) => {

      if (
        client.readyState ===
        WebSocket.OPEN
      ) {

        client.send(message);

      }

    }
  );

}


/*
=========================================
ENVIAR A UN SOLO CLIENTE
=========================================
*/

export function sendToClient(
  socket,
  data
) {

  if (
    !socket ||
    socket.readyState !==
      WebSocket.OPEN
  ) {

    return;

  }


  socket.send(
    JSON.stringify(data)
  );

}


/*
=========================================
OBTENER INFORMACIÓN DEL SERVIDOR
=========================================
*/

export function getWebSocketInfo() {

  return {

    port: WEBSOCKET_PORT,

    host: WEBSOCKET_HOST,

    clients:
      wss?.clients?.size || 0,

    running:
      Boolean(wss),

  };

}