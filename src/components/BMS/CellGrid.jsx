export default function CellGrid({ cells = [] }) {

  const getCellVoltage = (cell) => {
    if (typeof cell === "object" && cell !== null) {
      return Number(cell.voltage);
    }

    return Number(cell);
  };

  const getCellStatus = (voltage) => {

    if (!Number.isFinite(voltage)) {
      return "unknown";
    }

    if (voltage < 2.7) {
      return "critical";
    }

    if (voltage < 3.0) {
      return "warning";
    }

    return "normal";
  };

  return (
    <section className="cell-section">

      <div className="section-header">

        <div>
          <h5>
            VOLTAJE DE CELDAS
          </h5>

          <span className="cell-range">
            Umbral de advertencia: 3.00 V
            &nbsp; | &nbsp;
            Crítico: 2.70 V
          </span>
        </div>

        <div className="cell-legend">

          <span>
            <i className="legend-dot normal" />
            ≥ 3.00 V
          </span>

          <span>
            <i className="legend-dot warning" />
            &lt; 3.00 V
          </span>

          <span>
            <i className="legend-dot critical" />
            &lt; 2.70 V
          </span>

        </div>

      </div>


      <div className="cell-grid">

        {Array.from(
          { length: 16 },
          (_, index) => {

            const voltage =
              getCellVoltage(cells[index]);

            const status =
              getCellStatus(voltage);

            return (
              <div
                key={index}
                className={`cell-card ${status}`}
              >

                <div className="cell-header">

                  <span className="cell-name">
                    C{String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`cell-status-dot ${status}`}
                  />

                </div>

                <span className="cell-voltage">

                  {Number.isFinite(voltage)
                    ? voltage.toFixed(2)
                    : "--"}

                  <small>
                    V
                  </small>

                </span>

              </div>
            );
          }
        )}

      </div>

    </section>
  );
}