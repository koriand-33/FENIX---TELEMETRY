import "./BMSPanel.css";

export default function BMSPanel({
  data,
  connected,
}) {
  const bms = data || {};

  const soc =
    bms.soc != null
      ? Number(bms.soc)
      : null;

  const voltage =
    bms.voltage != null
      ? Number(bms.voltage)
      : null;

  const current =
    bms.current != null
      ? Number(bms.current)
      : null;

  return (
    <div className="fenix-bms">

      <div className="fenix-bms-grid">

        {/* SOC */}

        <article className="bms-metric-card">

          <span className="bms-metric-title">
            SOC
          </span>

          <strong className="bms-metric-value soc-value">
            {soc != null
              ? soc.toFixed(1)
              : "--"}
            <small>%</small>
          </strong>

          <div className="bms-progress">
            <div
              className="bms-progress-fill"
              style={{
                width:
                  soc != null
                    ? `${Math.min(
                        Math.max(soc, 0),
                        100
                      )}%`
                    : "0%",
              }}
            />
          </div>

          <span className="bms-metric-caption">
            Estado de carga
          </span>

        </article>


        {/* TEMPERATURAS */}

        <article className="bms-metric-card">

          <span className="bms-metric-title">
            TEMPERATURAS BMS
          </span>

          <div className="temperature-values">

            <div>
              <span className="temperature-label max">
                MÁXIMA
              </span>

              <strong>
                {bms.maxTemp != null
                  ? `${bms.maxTemp} °C`
                  : "--"}
              </strong>
            </div>

            <div>
              <span className="temperature-label min">
                MÍNIMA
              </span>

              <strong>
                {bms.minTemp != null
                  ? `${bms.minTemp} °C`
                  : "--"}
              </strong>
            </div>

          </div>

        </article>


        {/* VOLTAJE */}

        <article className="bms-metric-card">

          <span className="bms-metric-title">
            VOLTAJE BMS
          </span>

          <strong className="bms-metric-value voltage-value">
            {voltage != null
              ? voltage.toFixed(1)
              : "--"}
            <small>V</small>
          </strong>

          <div className="bms-progress">
            <div
              className="bms-progress-fill voltage"
              style={{
                width:
                  voltage != null
                    ? `${Math.min(
                        Math.max(
                          (voltage / 60) * 100,
                          0
                        ),
                        100
                      )}%`
                    : "0%",
              }}
            />
          </div>

          <span className="bms-metric-caption">
            Rango 0 - 60 V
          </span>

        </article>


        {/* CORRIENTE */}

        <article className="bms-metric-card">

          <span className="bms-metric-title">
            CORRIENTE BMS
          </span>

          <strong className="bms-metric-value current-value">
            {current != null
              ? current.toFixed(1)
              : "--"}
            <small>A</small>
          </strong>

          <div className="current-range">

            <span>-220 A</span>
            <span>0 A</span>
            <span>60 A</span>

          </div>

        </article>

      </div>


      <div className="bms-connection-line">

        <span
          className={
            connected
              ? "bms-status-dot online"
              : "bms-status-dot"
          }
        />

        {connected
          ? "BMS ACTIVO"
          : "BMS SIN CONEXIÓN"}

      </div>

    </div>
  );
}