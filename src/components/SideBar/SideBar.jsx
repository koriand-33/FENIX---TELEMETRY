import SerialSelector from "../SerialSelector/SerialSelector";
import RecorderButton from "../Recorder/RecorderButton";

import "./SideBar.css";

export default function SideBar({
  ports,
  serialConnected,
  serialConnecting,
  currentPort,
  recorder,
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

      {/* PARTE INFERIOR */}
      <div className="fenix-sidebar-bottom">

        {/* RECOPILACIÓN */}
        <div className="fenix-recorder-section">

          <div className="fenix-sidebar-section-title">
            RECOPILACIÓN
          </div>

          {recorder ? (
            <RecorderButton recorder={recorder} />
          ) : (
            <div className="fenix-recorder-loading">
              Cargando grabador...
            </div>
          )}

        </div>

        {/* PUERTO SERIAL */}
        <div className="fenix-serial-section">

          <div className="fenix-sidebar-section-title">
            PUERTO SERIAL
          </div>
          

          <SerialSelector
            ports={ports}
            connected={serialConnected}
            connecting={serialConnecting}
            currentPort={currentPort}
          />

        </div>

      </div>

    </div>
  );
}