import SerialSelector from "../SerialSelector/SerialSelector";

import "./Sidebar.css";

export default function Sidebar({
  ports,
  serialConnected,
  serialConnecting,
  currentPort,
}) {
  return (
    <div className="fenix-sidebar-content">

      {/* LOGO */}

      <div className="fenix-logo-container">
        <img
          src="/logo_recortado.jpg"
          alt="Fénix"
          className="fenix-logo"
        />
      </div>

      {/* NAVEGACIÓN */}

      <nav className="fenix-navigation">

        <div className="fenix-nav-title">
          TELEMETRÍA
        </div>

        <button className="fenix-nav-item active">
          <span>▦</span>
          Dashboard
        </button>

        <button className="fenix-nav-item">
          <span>⚡</span>
          BMS
        </button>

        <button className="fenix-nav-item">
          <span>◉</span>
          Curtis
        </button>

        <button className="fenix-nav-item">
          <span>▣</span>
          Celdas
        </button>

      </nav>

      {/* SERIAL */}

      <div className="fenix-sidebar-bottom">

        <SerialSelector
          ports={ports}
          connected={serialConnected}
          connecting={serialConnecting}
          currentPort={currentPort}
        />

      </div>

    </div>
  );
}