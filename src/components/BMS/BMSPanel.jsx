import StatusCard from "../StatusCard/StatusCard";

export default function BMSPanel({
  data,
  cells = [],
  connected,
}) {
  const bms = data || {};

  return (
    <div className="curtis-panel">

      <h4 className="panel-title">
        Battery Management System
      </h4>

      <div className="bms-grid">

        <StatusCard
          title="Status"
          value={connected ? "Conectado" : "Desconectado"}
          color={connected ? "#22c55e" : "#ef4444"}
        />

        <StatusCard
          title="Voltaje Total"
          value={
            bms.voltage != null
              ? `${bms.voltage} V`
              : "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="Corriente"
          value={
            bms.current != null
              ? `${bms.current} A`
              : "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="% de carga (SOC)"
          value={
            bms.soc != null
              ? `${bms.soc} %`
              : "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="Temperatura Máxima"
          value={
            bms.maxTemp != null
              ? `${bms.maxTemp} °C`
              : "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="Temperatura Mínima"
          value={
            bms.minTemp != null
              ? `${bms.minTemp} °C`
              : "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="Número de celdas detectadas"
          value={
            bms.cellsCount != null
              ? bms.cellsCount
              : cells.length || "--"
          }
          color="#FFFF"
        />

        <StatusCard
          title="Errores"
          value={
            bms.errors != null
              ? bms.errors
              : "--"
          }
          color="#FFFF"
        />

      </div>

    </div>
  );
}