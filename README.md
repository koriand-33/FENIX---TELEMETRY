# FENIX TELEMETRY

Sistema de telemetría para Escudería Fénix.

## Requisitos

- Node.js 20 o superior
- ESP32
- Cable USB de datos
- Navegador web compatible con WebSocket

## Instalación

Clonar el repositorio:

git clone https://github.com/koriand-33/FENIX---TELEMETRY.git

Entrar al proyecto:

cd FENIX---TELEMETRY

Instalar dependencias:

npm install

## Ejecución

El proyecto utiliza dos procesos:

### 1. Backend

En una terminal:

npm run server

El backend inicia el servidor WebSocket en:

ws://localhost:8080

También busca dispositivos seriales cada 3 segundos.

### 2. Frontend

En otra terminal:

npm run dev

Abrir la dirección que indique Vite, normalmente:

http://localhost:5173

## Conexión de ESP32

1. Conectar la ESP32 mediante USB.
2. Instalar el driver USB correspondiente si Windows no reconoce el dispositivo.
3. Ejecutar:

npm run server

4. El backend detectará el puerto serial disponible.
5. La ESP32 debe transmitir los paquetes de telemetría a 115200 baudios.

## Formato de paquetes

### Paquete T

T,paqueteId,curtis_irms,curtis_rpm,curtis_torque,curtis_t_motor,curtis_t_ctrl,curtis_accel,curtis_freno_regen,curtis_errores,bms_voltaje,bms_corriente,bms_soc,bms_t_max,bms_t_min,bms_celdas,bms_errores

### Paquete C

C,celda1,celda2,celda3,...,celda16

## Arquitectura

ESP32
 ↓
Serial
 ↓
SerialManager
 ↓
TelemetryParser
 ↓
WebSocket
 ↓
React Dashboard

## Puertos

Serial:
115200 baudios

WebSocket:
8080

Frontend:
5173