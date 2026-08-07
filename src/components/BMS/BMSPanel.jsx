import TelemetryCard from "../TelemetryCard/TelemetryCard";
import StatusCard from "../StatusCard/StatusCard";

export default function BMSPanel() {
  return (
    <div className="curtis-panel">

      <h4 className="panel-title" >Battery Management System</h4>

      <div className="bms-grid">


        <StatusCard
                title="Status"
                value="Encendido"
                color="#22c55e"
            />

        <StatusCard
          title="Voltaje Total"
          value="51.8 V"
          color="#FFFF"
        />

        <StatusCard
          title="Corriente"
          value="-18.6 A"
          color="#FFFF"
        />

        <StatusCard
          title="% de carga (SOC)"
          value="86 %"
          color="#FFFF"
        />

        <StatusCard
          title="Temperatura Máxima"
          value="97°C"
          color="#FFFF"
        />

        <StatusCard
          title="Temperatura Mínima"
          value="31 °C"
          color="#FFFF"
        />

        <StatusCard
          title="Número de celdas detectadas"
          value="1"
          color="#FFFF"
        />

        <StatusCard
          title="Errores"
          value="0"
          color="#FFFF"
        />

      </div>

    </div>
  );
}