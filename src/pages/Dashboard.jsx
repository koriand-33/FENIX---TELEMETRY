import { useEffect, useState } from "react";

import Sidebar from "../components/SideBar/SideBar";import DashboardLayout from "../components/DashboardLayout/DashboardLayout";

import BMSChart from "../components/BMS/BMSChart";
import BMSPanel from "../components/BMS/BMSPanel";
import CurtisPanel from "../components/CurtisPanel/CurtisPanel";

import useTelemetry from "../hooks/useTelemetry";

import "./Dashboard.css";


export default function Dashboard() {

  const {
    telemetry,
    connected,
    recorder,

    serialPorts,
    serialConnected,
    serialConnecting,
    currentPort,
  } = useTelemetry();


  const cells = telemetry.cells || [];


  function getCellStatus(value) {

    const voltage = Number(value);


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
  }


  return (

    <DashboardLayout
      sidebar={

        <Sidebar
          ports={serialPorts}
          serialConnected={serialConnected}
          serialConnecting={serialConnecting}
          currentPort={currentPort}
          recorder={recorder}
        />

      }
    >

      <div className="fenix-dashboard">


        {/* =========================
            TOP BAR
        ========================== */}

        <header className="dashboard-topbar">


          <div
            className={
              serialConnected
                ? "dashboard-status connected"
                : "dashboard-status"
            }
          >

            <span className="status-dot" />


            {serialConnected
              ? "CONECTADO"
              : "DESCONECTADO"}

          </div>


          <div className="dashboard-ws">

            <span>
              WS:
            </span>


            <strong>

              {connected
                ? "ws://localhost:8080"
                : "Sin conexión"}

            </strong>

          </div>


          <DashboardClock />


        </header>


        {/* =========================
            CONTENIDO PRINCIPAL
        ========================== */}

        <main className="dashboard-grid">


          {/* =========================
              VOLTAJE
          ========================== */}

          <section className="dashboard-panel voltage-panel">


            <div className="panel-title">

              <h2>
                VOLTAJE EN TIEMPO REAL
              </h2>


              <span className="panel-live-value voltage">

                {telemetry.bms?.voltage != null
                  ? `${Number(
                      telemetry.bms.voltage
                    ).toFixed(1)} V`
                  : "-- V"}

              </span>

            </div>


            <BMSChart
              history={telemetry.history}
              mode="voltage"
            />


          </section>


          {/* =========================
              CORRIENTE
          ========================== */}

          <section className="dashboard-panel current-panel">


            <div className="panel-title">

              <h2>
                CORRIENTE EN TIEMPO REAL
              </h2>


              <span className="panel-live-value current">

                {telemetry.bms?.current != null
                  ? `${Number(
                      telemetry.bms.current
                    ).toFixed(1)} A`
                  : "-- A"}

              </span>

            </div>


            <BMSChart
              history={telemetry.history}
              mode="current"
            />


          </section>


          {/* =========================
              BMS
          ========================== */}

          <section className="dashboard-panel bms-panel">


            <div className="panel-title">

              <h2>
                BMS
              </h2>

            </div>


            <BMSPanel
              data={telemetry.bms}
              connected={serialConnected}
            />


          </section>


          {/* =========================
              CURTIS
          ========================== */}

          <section className="dashboard-panel curtis-panel">


            <CurtisPanel
              data={telemetry.curtis}
              connected={serialConnected}
            />


          </section>


          {/* =========================
              CELDAS
          ========================== */}

          <section className="dashboard-panel cells-panel">


            <div className="panel-title">

              <h2>
                VOLTAJE DE CELDAS (16)
              </h2>

            </div>


            <div className="dashboard-cells-grid">


              {Array.from({
                length: 16,
              }).map((_, index) => {


                const value =
                  cells[index];


                const status =
                  getCellStatus(value);


                return (

                  <article
                    key={index}
                    className={
                      `dashboard-cell ${status}`
                    }
                  >


                    <span className="cell-name">

                      C{String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}

                    </span>


                    <strong className="cell-voltage">

                      {value != null
                        ? `${Number(
                            value
                          ).toFixed(3)} V`
                        : "-- V"}

                    </strong>


                    <span className="cell-indicator" />


                  </article>

                );

              })}


            </div>


          </section>


        </main>


      </div>


    </DashboardLayout>

  );

}



/* =========================
   RELOJ DEL DASHBOARD
========================= */

function DashboardClock() {

  const [now, setNow] =
    useState(
      new Date()
    );


  useEffect(() => {

    const interval =
      setInterval(
        () => {

          setNow(
            new Date()
          );

        },
        1000
      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, []);


  const time =
    now.toLocaleTimeString(
      "es-MX",
      {
        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",
      }
    );


  const date =
    now.toLocaleDateString(
      "es-MX"
    );


  return (

    <div className="dashboard-clock">


      <strong>

        {time}

      </strong>


      <span>

        {date}

      </span>


    </div>

  );

}