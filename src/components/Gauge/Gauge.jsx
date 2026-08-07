import GaugeComponent from "react-gauge-component";
import "./Gauge.css";

export default function Gauge({ title, value }) {

  // Convierte "70%" o "20A" a número
  const numericValue = parseFloat(value);

  return (
    <div className="gauge">

      <GaugeComponent
        value={numericValue}
        type="radial"

        arc={{
          colorArray: ["#3B82F6", "#2563EB", "#1D4ED8"],
          subArcs: [
            { limit: 33 },
            { limit: 66 },
            { limit: 100 }
          ],
          padding: 0.02,
          width: 0.18
        }}

        pointer={{
          elastic: true
        }}

        labels={{
          valueLabel: {
            hide: true
          },
          tickLabels: {
            hideMinMax: true
          }
        }}

      />

      <h3>{title}</h3>

      <p>{value}</p>

    </div>
  );
}