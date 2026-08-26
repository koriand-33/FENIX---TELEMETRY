import Gauge from "../Gauge/Gauge";
import StatusCard from "../StatusCard/StatusCard";

import CellGrid from "./CellGrid";

import "./BMSPanel.css";

export default function BMSPanel({
  data,
  cells = [],
  currentHistory = [],
  connected,
}) {
  /*
   * Si todavía no recibimos datos del BMS,
   * usamos un objeto vacío para evitar errores.
   */
  const bms = data || {};

  return (
    <div className="bms-panel">

      {/* ================================= */}
      {/* TÍTULO                            */}
      {/* ================================= */}

      <h4 className="panel-title">
        Battery Management System
      </h4>


      {/* ================================= */}
      {/* GAUGES                            */}
      {/* ================================= */}

      <div className="bms-gauges">

        {/* VOLTAJE BMS
            Rango real: 0 → 60 V
        */}
        <Gauge
          title="Voltaje"
          value={bms.voltage}
          min={0}
          max={60}
          unit="V"
        />

        {/* CORRIENTE BMS
            Rango real: -220 → +60 A
        */}
        <Gauge
          title="Corriente"
          value={bms.current}
          min={-220}
          max={60}
          unit="A"
        />

        {/* SOC
            Rango: 0 → 100 %
        */}
        <Gauge
          title="Estado de carga"
          value={bms.soc}
          min={0}
          max={100}
          unit="%"
        />

      </div>


      {/* ================================= */}
      {/* INFORMACIÓN DEL BMS               */}
      {/* ================================= */}

      <div className="bms-status-grid">

        {/* CONEXIÓN */}

        <StatusCard
          title="Status"
          value={
            connected
              ? "Conectado"
              : "Desconectado"
          }
          color={
            connected
              ? "#22c55e"
              : "#ef4444"
          }
        />


        {/* TEMPERATURA MÁXIMA */}

        <StatusCard
          title="Temperatura Máxima"
          value={
            bms.maxTemp != null
              ? `${bms.maxTemp} °C`
              : "--"
          }
        />


        {/* TEMPERATURA MÍNIMA */}

        <StatusCard
          title="Temperatura Mínima"
          value={
            bms.minTemp != null
              ? `${bms.minTemp} °C`
              : "--"
          }
        />


        {/* CELDAS */}

        <StatusCard
          title="Celdas detectadas"
          value={
            bms.cellsCount != null
              ? bms.cellsCount
              : cells.length || "--"
          }
        />


        {/* ERRORES */}

        <StatusCard
          title="Errores"
          value={
            bms.errors != null
              ? bms.errors
              : "--"
          }
          color={
            bms.errors
              ? "#ef4444"
              : "#22c55e"
          }
        />

      </div>


      {/* ================================= */}
      {/* GRÁFICA DE CORRIENTE              */}
      {/* ================================= */}

     


      {/* ================================= */}
      {/* 16 CELDAS                         */}
      {/* ================================= */}

      <CellGrid
        cells={cells}
      />

    </div>
  );
}

