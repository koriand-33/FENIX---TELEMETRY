export default function CurrentChart({ data = [] }) {
  /*
   * Rango REAL de corriente del BMS
   */
  const MIN_CURRENT = -220;
  const MAX_CURRENT = 60;

  /*
   * Si todavía no hay datos
   */
  if (!data.length) {
    return (
      <section className="current-chart-section">
        <div className="section-header">
          <div>
            <h5>CORRIENTE BMS</h5>

            <span className="chart-subtitle">
              Rango: -220 A a +60 A
            </span>
          </div>

          <div className="current-value">
            --
            <small> A</small>
          </div>
        </div>

        <div className="chart-empty">
          Esperando datos de corriente...
        </div>
      </section>
    );
  }

  /*
   * Último valor recibido
   */
  const current = Number(
    data[data.length - 1]?.value
  );

  /*
   * Convertimos el valor a un número seguro
   */
  const safeCurrent = Number.isFinite(current)
    ? Math.min(
        Math.max(current, MIN_CURRENT),
        MAX_CURRENT
      )
    : 0;

  /*
   * Dimensiones del SVG
   */
  const width = 600;
  const height = 220;

  const paddingX = 25;
  const paddingY = 25;

  /*
   * Convertimos corriente → coordenada X
   */
  const getX = (index) => {
    if (data.length <= 1) {
      return width / 2;
    }

    return (
      paddingX +
      (index / (data.length - 1)) *
        (width - paddingX * 2)
    );
  };

  /*
   * Convertimos corriente → coordenada Y
   *
   * -220 A = abajo
   * +60 A  = arriba
   */
  const getY = (value) => {
    const clampedValue = Math.min(
      Math.max(Number(value), MIN_CURRENT),
      MAX_CURRENT
    );

    const normalized =
      (clampedValue - MIN_CURRENT) /
      (MAX_CURRENT - MIN_CURRENT);

    return (
      height -
      paddingY -
      normalized *
        (height - paddingY * 2)
    );
  };

  /*
   * Puntos de la gráfica
   */
  const points = data
    .map((item, index) => {
      const value = Number(item.value);

      if (!Number.isFinite(value)) {
        return null;
      }

      return `${getX(index)},${getY(value)}`;
    })
    .filter(Boolean)
    .join(" ");

  /*
   * Posición de 0 A
   *
   * Esto es MUY importante porque nuestro
   * rango no es simétrico.
   */
  const zeroY = getY(0);

  return (
    <section className="current-chart-section">

      {/* ================================= */}
      {/* HEADER                            */}
      {/* ================================= */}

      <div className="section-header">

        <div>
          <h5>
            CORRIENTE BMS
          </h5>

          <span className="chart-subtitle">
            Últimas {data.length} lecturas
          </span>
        </div>

        <div className="current-value">

          {Number.isFinite(current)
            ? current.toFixed(1)
            : "--"}

          <small>
            {" "}A
          </small>

        </div>

      </div>


      {/* ================================= */}
      {/* GRÁFICA                           */}
      {/* ================================= */}

      <div className="chart-container">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >

          {/* ============================= */}
          {/* LÍNEA +60 A                    */}
          {/* ============================= */}

          <line
            x1={paddingX}
            y1={getY(MAX_CURRENT)}
            x2={width - paddingX}
            y2={getY(MAX_CURRENT)}
            className="limit-line"
          />


          {/* ============================= */}
          {/* LÍNEA 0 A                      */}
          {/* ============================= */}

          <line
            x1={paddingX}
            y1={zeroY}
            x2={width - paddingX}
            y2={zeroY}
            className="zero-line"
          />


          {/* ============================= */}
          {/* LÍNEA -220 A                   */}
          {/* ============================= */}

          <line
            x1={paddingX}
            y1={getY(MIN_CURRENT)}
            x2={width - paddingX}
            y2={getY(MIN_CURRENT)}
            className="limit-line"
          />


          {/* ============================= */}
          {/* DATOS                          */}
          {/* ============================= */}

          <polyline
            points={points}
            fill="none"
            className="current-line"
          />


          {/* ============================= */}
          {/* PUNTO ACTUAL                   */}
          {/* ============================= */}

          <circle
            cx={getX(data.length - 1)}
            cy={getY(safeCurrent)}
            r="5"
            className="current-point"
          />

        </svg>


        {/* ================================= */}
        {/* ETIQUETAS DEL EJE Y               */}
        {/* ================================= */}

        <div className="chart-y-label max">
          +60 A
        </div>

        <div
          className="chart-y-label zero"
          style={{
            top: `${(zeroY / height) * 100}%`,
          }}
        >
          0 A
        </div>

        <div className="chart-y-label min">
          -220 A
        </div>

      </div>


      {/* ================================= */}
      {/* TIEMPO                            */}
      {/* ================================= */}

      <div className="chart-labels">

        <span>
          {data[0]?.time ?? "--"}
        </span>

        <span>
          {data[data.length - 1]?.time ?? "--"}
        </span>

      </div>

    </section>
  );
}