import "./DashboardLayout.css";

export default function DashboardLayout({
  sidebar,
  children,
}) {
  return (
    <div className="app-layout">

      <aside className="app-sidebar">
        {sidebar}
      </aside>

      <main className="app-content">
        {children}
      </main>

    </div>
  );
}