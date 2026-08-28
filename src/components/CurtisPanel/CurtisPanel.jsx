import GaugeComponent from "react-gauge-component";

import "./CurtisPanel.css";


export default function CurtisPanel({
  data,
  connected,
}) {

  const curtis = data || {};


  function display(
    value,
    unit = "",
    decimals = 0
  ) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "--";
    }

    return `${number.toFixed(decimals)}${unit}`;
  }


  /* =====================================
     ACELERACIÓN REAL: 0 - 100 %
  ===================================== */

  const acceleration =
    Number(curtis.acceleration ?? 0);


  const safeAcceleration =
    Number.isFinite(acceleration)
      ? Math.min(
          Math.max(acceleration, 0),
          100
        )
      : 0;


  /*
    La ruedita visual usa escala 0 - 5000
    para conservar exactamente el diseño.

    0%   -> 0
    25%  -> 1250
    50%  -> 2500
    75%  -> 3750
    100% -> 5000
  */

  const accelerationGaugeValue =
    safeAcceleration * 50;


  const hasErrors =
    curtis.errors != null &&
    Number(curtis.errors) !== 0;


  return (

    <div className="fenix-curtis">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="curtis-header">

        <div>

          <h2>
            CURTIS - PARÁMETROS PRINCIPALES
          </h2>

          <span>
            Controlador de motor
          </span>

        </div>


        <div
          className={
            connected
              ? "curtis-status online"
              : "curtis-status"
          }
        >

          <span className="curtis-status-dot" />

          {connected
            ? "ACTIVO"
            : "SIN CONEXIÓN"}

        </div>

      </div>



      {/* =====================================
          CONTENIDO
      ===================================== */}

      <div className="curtis-layout">


        {/* =====================================
            DATOS
        ===================================== */}

        <div className="curtis-data-grid">


          <article className="curtis-value">

            <span className="curtis-value-title">
              IRMS
            </span>

            <strong className="blue">

              {display(
                curtis.irms,
                " A",
                1
              )}

            </strong>

            <small>
              Corriente RMS
            </small>

          </article>



          <article className="curtis-value">

            <span className="curtis-value-title">
              RPM
            </span>

            <strong className="blue">

              {display(
                curtis.rpm,
                "",
                0
              )}

            </strong>

            <small>
              Revoluciones
            </small>

          </article>



          <article className="curtis-value">

            <span className="curtis-value-title">
              TORQUE
            </span>

            <strong className="blue">

              {display(
                curtis.torque,
                " Nm",
                0
              )}

            </strong>

            <small>
              Par motor
            </small>

          </article>



          <article className="curtis-value">

            <span className="curtis-value-title">
              REGEN
            </span>

            <strong className="blue">

              {display(
                curtis.regen,
                " %",
                1
              )}

            </strong>

            <small>
              Frenado regenerativo
            </small>

          </article>



          <article className="curtis-value">

            <span className="curtis-value-title">
              TEMP MOTOR
            </span>

            <strong className="orange">

              {display(
                curtis.motorTemp,
                " °C",
                1
              )}

            </strong>

            <small>
              Temperatura
            </small>

          </article>



          <article className="curtis-value">

            <span className="curtis-value-title">
              TEMP CTRL
            </span>

            <strong className="orange">

              {display(
                curtis.controllerTemp,
                " °C",
                1
              )}

            </strong>

            <small>
              Controlador
            </small>

          </article>



          <article className="curtis-value">

            <span className="curtis-value-title">
              ERRORES
            </span>

            <strong
              className={
                curtis.errors == null
                  ? ""
                  : hasErrors
                    ? "red"
                    : "green"
              }
            >

              {curtis.errors != null
                ? curtis.errors
                : "--"}

            </strong>

            <small>

              {curtis.errors == null
                ? "Sin información"
                : hasErrors
                  ? "Revisar sistema"
                  : "Sin fallos"}

            </small>

          </article>



          <article className="curtis-value">

            <span className="curtis-value-title">
              ESTADO
            </span>

            <strong
              className={
                connected
                  ? "green"
                  : ""
              }
            >

              {connected
                ? "OK"
                : "--"}

            </strong>

            <small>
              Comunicación
            </small>

          </article>


        </div>



        {/* =====================================
            ACELERACIÓN
        ===================================== */}

        <div className="curtis-gauge-area">


          <div className="curtis-gauge-title">

            ACELERACIÓN

          </div>


          <div className="curtis-radial-gauge">


            <GaugeComponent

              value={accelerationGaugeValue}

              type="radial"

              minValue={0}

              maxValue={5000}

              arc={{
                width: 0.18,

                padding: 0.015,

                cornerRadius: 0,

                subArcs: [

                  {
                    limit: 3500,
                    color: "#16476a",
                  },

                  {
                    limit: 4500,
                    color: "#ffd000",
                  },

                  {
                    limit: 5000,
                    color: "#ff4048",
                  },

                ],
              }}

              pointer={{
                color: "#ff3138",

                length: 0.72,

                width: 7,
              }}

              labels={{

                valueLabel: {
                  hide: true,
                },


                tickLabels: {

                  type: "outer",

                  defaultTickValueConfig: {

                    formatTextValue:
                      (value) =>
                        `${value}`,

                    style: {

                      fontSize: "10px",

                      fill: "#ffffff",

                    },

                  },


                  ticks: [

                    {
                      value: 1250,
                    },

                    {
                      value: 2500,
                    },

                    {
                      value: 3750,
                    },

                  ],

                },

              }}

            />


            {/* TEXTO CENTRAL */}

            <div className="curtis-gauge-center">

              <strong>
                {safeAcceleration.toFixed(1)}
              </strong>

              <span>
                %
              </span>

            </div>


          </div>


        </div>


      </div>


    </div>

  );

}