import "./CellGrid.css";

export default function CellGrid({ cells = [] }) {
  const getCellValue = (index) => {
    const value = cells[index];

    if (value === undefined || value === null || value === "") {
      return null;
    }

    const number = Number(value);

    return Number.isNaN(number) ? null : number;
  };

  const getCellStatus = (value) => {
    if (value === null) {
      return "unknown";
    }

    /*
     * Rangos modificables
     *
     */

    if (value < 2.7 ) {
      return "critical";
    }

    if (value < 3.00 ) {
      return "warning";
    }

    return "normal";
  };

  return (
    <section className="cell-grid-panel">
      <div className="cell-grid-header">
        <div>
          <span className="cell-grid-eyebrow">
            BMS / CELL MONITOR
          </span>

          <h3>Cell Voltage</h3>
        </div>

        <span className="cell-count">
          16 CELLS
        </span>
      </div>

      <div className="cell-grid">
        {Array.from({ length: 16 }, (_, index) => {
          const value = getCellValue(index);
          const status = getCellStatus(value);

          return (
            <div
              key={index}
              className={`cell ${status}`}
            >
              <div className="cell-number">
                CELL {String(index + 1).padStart(2, "0")}
              </div>

              <div className="cell-voltage">
                {value !== null
                  ? `${value.toFixed(2)} V`
                  : "--.-- V"}
              </div>

              <div className="cell-status">
                {status === "normal" && "NORMAL"}
                {status === "warning" && "WARNING"}
                {status === "critical" && "CRITICAL"}
                {status === "unknown" && "NO DATA"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="cell-legend">
        <div>
          <span className="legend-dot normal"></span>
          NORMAL
        </div>

        <div>
          <span className="legend-dot warning"></span>
          WARNING
        </div>

        <div>
          <span className="legend-dot critical"></span>
          CRITICAL
        </div>

        <div>
          <span className="legend-dot unknown"></span>
          NO DATA
        </div>
      </div>
    </section>
  );
}