import Gauge from "../Gauge/Gauge";
import "./CurtisPanel.css";
import StatusCard from "../StatusCard/StatusCard";

export default function CurtisPanel({ data, connected }) {
  const curtis = data || {};

  return (
    <div className="curtis-panel">
      <h4 className="panel-title">Curtis Controller</h4>

      <div className="gauges">

        <Gauge
          title="RPM"
          value={curtis.rpm ?? "--"}
        />

        <Gauge
          title="Torque"
          value={curtis.torque ?? "--"}
        />

        <Gauge
          title="Corriente del motor"
          value={curtis.irms ?? "--"}
        />

        <Gauge
          title="% del Acelerador"
          value={curtis.acceleration ?? "--"}
        />

      </div>

      <div className="status-section">

        <StatusCard
          title="Status"
          value={connected ? "Conectado" : "Desconectado"}
          color={connected ? "#22c55e" : "#ef4444"}
        />

        <StatusCard
          title="Velocidad"
          value={
            curtis.rpm != null
              ? `${curtis.rpm} RPM`
              : "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="Temperatura Motor"
          value={
            curtis.motorTemp != null
              ? `${curtis.motorTemp} °C`
              : "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="Temperatura Controlador"
          value={
            curtis.controllerTemp != null
              ? `${curtis.controllerTemp} °C`
              : "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="% Acelerador"
          value={
            curtis.acceleration != null
              ? `${curtis.acceleration}`
              : "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="% Freno regenerativo"
          value={
            curtis.regen != null
              ? `${curtis.regen}`
              : "--"
          }
          color="#22c55e"
        />

        <StatusCard
          title="Errores (Bitfield de estado)"
          value={
            curtis.errors != null
              ? curtis.errors
              : "--"
          }
          color="#22c55e"
        />

      </div>
    </div>
  );
}