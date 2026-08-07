import Gauge from "../Gauge/Gauge";
import "./CurtisPanel.css";
import StatusCard from "../StatusCard/StatusCard";
export default function CurtisPanel() {
  return (
    <div className="curtis-panel">
      <h4 className="panel-title">Curtis Controller</h4>

     <div className="gauges">

    <Gauge title="RPM" value={72} />

    <Gauge title="Torque" value={65} />

    <Gauge title="Corriente del motor" value={30}/>

    <Gauge title="% del Acelerador" value={45} />

    </div>
    <div className="status-section">

    <StatusCard
        title="Status"
        value="Encendido"
        color="#22c55e"
    />

    <StatusCard
    
        title="Velocidad"
        value="24 km/h"
        color="#FFFF"
    />

    <StatusCard
        title="Temperatura Motor"
        value="38 °C"
        color="#FFFF"
    />
    <StatusCard
        title="Temperatura Controlador"
        value="67 °C"
        color="#FFFF"
    />

    

    <StatusCard
        title="% Acelerador"
        value="51.8 V"
        color="#FFFF"
    />

    <StatusCard
        title="% Freno regenerativo"
        value="Ninguno"
        color="#22c55e"
    />

    <StatusCard
        title="Errores (Bitfield de estado)"
        value="Mapa de bits"
        color="#22c55e"
    />

</div>

    </div>
  );
}