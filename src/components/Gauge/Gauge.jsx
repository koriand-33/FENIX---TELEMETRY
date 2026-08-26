import GaugeComponent from "react-gauge-component";
import "./Gauge.css";

export default function Gauge({
  title,
  value,
  min = 0,
  max = 100,
  unit = "",
  ticks = 5,
}) {
  const numericValue = Number(value);
  const hasValue = Number.isFinite(numericValue);

  const safeValue = hasValue
    ? Math.min(Math.max(numericValue, min), max)
    : min;

  /*
   * Generamos las marcas del gauge.
   */
  const tickValues = Array.from(
    { length: ticks },
    (_, index) =>
      min + ((max - min) / (ticks - 1)) * index
  );

  /*
   * Si 0 está dentro del rango,
   * lo agregamos como marca importante.
   *
   * Ejemplo:
   *
   * -220 ─────── 0 ───────── 60
   */
  if (min < 0 && max > 0 && !tickValues.includes(0)) {
    tickValues.push(0);
    tickValues.sort((a, b) => a - b);
  }

  /*
   * Evitamos duplicados.
   */
  const uniqueTicks = [...new Set(
    tickValues.map((tick) => Number(tick.toFixed(2)))
  )];

  /*
   * Para el gauge de corriente:
   *
   * -220 A → zona de descarga
   * 0 A    → punto de referencia
   * +60 A  → carga
   *
   * El color amarillo/rojo NO significa aquí
   * necesariamente una falla eléctrica.
   *
   * Por eso mantenemos el arco neutro.
   */
  const isAsymmetricRange = min < 0 && max > 0;

  return (
    <div className="gauge">

      <div className="gauge-title">
        {title}
      </div>

      <div className="gauge-wrapper">

        <GaugeComponent
          type="radial"

          value={safeValue}

          minValue={min}
          maxValue={max}

          arc={{
            width: 0.16,
            padding: 0.015,
            cornerRadius: 2,

            subArcs: isAsymmetricRange
              ? [
                  {
                    limit: 0,
                    color: "#334155",
                  },
                  {
                    color: "#64748b",
                  },
                ]
              : [
                  {
                    limit:
                      min + (max - min) * 0.70,
                    color: "#334155",
                  },
                  {
                    limit:
                      min + (max - min) * 0.90,
                    color: "#facc15",
                  },
                  {
                    color: "#ef4444",
                  },
                ],
          }}

          pointer={{
            type: "needle",
            color: "#ef4444",
            baseColor: "#ffffff",
            length: 0.78,
            width: 10,
            elastic: false,
            animate: true,
            animationDuration: 700,
          }}

          labels={{
            valueLabel: {
              hide: true,
            },

            tickLabels: {
              type: "outer",

              ticks: uniqueTicks.map((tick) => ({
                value: tick,
              })),

              defaultTickValueConfig: {
                style: {
                  fontSize: 10,
                  fill: "#e5e7eb",
                  fontWeight: "600",
                },

                maxDecimalDigits:
                  unit === "V" ? 1 : 0,
              },

              defaultTickLineConfig: {
                width: 2,
                length: 8,
                color: "#9ca3af",
                distanceFromArc: 2,
              },
            },
          }}
        />

        <div className="gauge-center">

          <span className="gauge-value">
            {hasValue
              ? numericValue.toFixed(
                  unit === "V" ? 1 : 0
                )
              : "--"}
          </span>

          {unit && (
            <span className="gauge-unit">
              {unit}
            </span>
          )}

        </div>

      </div>

    </div>
  );
}