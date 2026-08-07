import "./DashboardLayout.css";

export default function DashboardLayout({ left, right }) {
  return (
    <main className="dashboard-container">

      <section className="dashboard-column">
        {left}
      </section>

      <section className="dashboard-column">
        {right}
      </section>

    </main>
  );
}