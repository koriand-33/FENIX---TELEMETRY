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

export default function BMSChart({
  history = [],
  mode = "voltage",
}) {
  const isVoltage =
    mode === "voltage";

  const dataKey =
    isVoltage
      ? "voltage"
      : "current";

  const unit =
    isVoltage
      ? "V"
      : "A";

  const domain =
    isVoltage
      ? [0, 60]
      : [-220, 60];

  const ticks =
    isVoltage
      ? [0, 15, 30, 45, 60]
      : [-220, -150, -75, 0, 60];

  const lastPoint =
    history.length > 0
      ? history[
          history.length - 1
        ]
      : null;

  const lastValue =
    lastPoint
      ? Number(
          lastPoint[dataKey]
        )
      : null;

  return (
    <div className="fenix-chart">

      <div className="fenix-chart-value">

        {Number.isFinite(lastValue)
          ? `${lastValue.toFixed(
              isVoltage ? 1 : 1
            )} ${unit}`
          : `-- ${unit}`}

      </div>

      <div className="fenix-chart-container">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={history}
            margin={{
              top: 8,
              right: 14,
              left: 0,
              bottom: 4,
            }}
          >

            <CartesianGrid
              strokeDasharray="4 4"
              opacity={0.1}
            />

            <XAxis
              dataKey="time"
              tick={{
                fontSize: 9,
                fill: "#64748b",
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={domain}
              ticks={ticks}
              width={38}
              tick={{
                fontSize: 9,
                fill: "#64748b",
              }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            {!isVoltage && (
              <ReferenceLine
                y={0}
                opacity={0.35}
              />
            )}

            <Line
              type="monotone"
              dataKey={dataKey}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}