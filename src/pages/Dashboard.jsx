import Header from "../components/Header/Header";

import useTelemetry from "../hooks/useTelemetry";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";

import CurtisPanel from "../components/CurtisPanel/CurtisPanel";

import BMSPanel from "../components/BMS/BMSPanel";

export default function Dashboard() {
  const { telemetry, connected } = useTelemetry();

  return (
    <>
      <Header />

      <DashboardLayout
        left={
          <CurtisPanel
            data={telemetry.curtis}
            connected={connected}
          />
        }
        right={
          <BMSPanel
            data={telemetry.bms}
            cells={telemetry.cells}
            connected={connected}
          />
        }
      />
    </>
  );
}