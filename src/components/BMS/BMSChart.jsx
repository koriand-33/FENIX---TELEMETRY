import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import "./BMSChart.css";

export default function BMSChart({ history = [] }) {
  const lastPoint =
    history.length > 0
      ? history[history.length - 1]
      : null;

  return (
    <section className="bms-chart-panel">

      {/* HEADER */}
      <div className="bms-chart-header">
        <div>
          <span className="bms-chart-eyebrow">
            BMS / REAL TIME
          </span>

          <h3>Battery Telemetry</h3>
        </div>

        <span
          className={`bms-chart-status ${
            history.length > 0 ? "live" : "waiting"
          }`}
        >
          {history.length > 0 ? "● LIVE" : "○ WAITING"}
        </span>
      </div>

      {/* ================================
          VOLTAGE
          ================================ */}

      <div className="bms-chart">

        <div className="bms-chart-title">
          <span>PACK VOLTAGE</span>

          <strong>
            {lastPoint
              ? `${Number(lastPoint.voltage).toFixed(2)} V`
              : "--.-- V"}
          </strong>
        </div>

        <ResponsiveContainer
          width="100%"
          height={190}
        >
          <LineChart
            data={history}
            margin={{
              top: 10,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.08}
            />

            <XAxis
              dataKey="time"
              tick={{
                fontSize: 9,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 60]}
              ticks={[0, 15, 30, 45, 60]}
              tick={{
                fontSize: 9,
              }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <ReferenceLine
              y={60}
              strokeDasharray="4 4"
              opacity={0.25}
            />

            <Line
              type="monotone"
              dataKey="voltage"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* ================================
          CURRENT
          ================================ */}

      <div className="bms-chart">

        <div className="bms-chart-title">
          <span>PACK CURRENT</span>

          <strong>
            {lastPoint
              ? `${Number(lastPoint.current).toFixed(2)} A`
              : "--.-- A"}
          </strong>
        </div>

        <ResponsiveContainer
          width="100%"
          height={190}
        >
          <LineChart
            data={history}
            margin={{
              top: 10,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.08}
            />

            <XAxis
              dataKey="time"
              tick={{
                fontSize: 9,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[-220, 60]}
              ticks={[
                -220,
                -150,
                -75,
                0,
                60,
              ]}
              tick={{
                fontSize: 9,
              }}
              tickLine={false}
              axisLine={false}
            />

            <ReferenceLine
              y={0}
              strokeDasharray="4 4"
              opacity={0.3}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="current"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

    </section>
  );
}