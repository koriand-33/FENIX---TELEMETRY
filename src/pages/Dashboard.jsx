import Header from "../components/Header/Header";

import useTelemetry from "../hooks/useTelemetry";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";

import CurtisPanel from "../components/CurtisPanel/CurtisPanel";

import BMSPanel from "../components/BMS/BMSPanel";

import BMSChart from "../components/BMS/BMSChart";

import RecorderButton from "../components/Recorder/RecorderButton";

export default function Dashboard() {
  const {
    telemetry,
    connected,
    recorder,
  } = useTelemetry();

  return (
    <>
      <Header />

      <main className="dashboard-page">

        <RecorderButton
          recorder={recorder}
          disabled={!connected}
        />

        <DashboardLayout
          left={
            <CurtisPanel
              data={telemetry.curtis}
              connected={connected}
            />
          }

          right={
            <>
              <BMSPanel
                data={telemetry.bms}
                cells={telemetry.cells}
                connected={connected}
              />

              <BMSChart
                history={telemetry.history}
              />
            </>
          }
        />

      </main>
    </>
  );
}