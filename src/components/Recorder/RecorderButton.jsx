import { useEffect, useState } from "react";
import "./RecorderButton.css";

export default function RecorderButton({ recorder, disabled = false }) {
  const [recording, setRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [samples, setSamples] = useState(0);

  useEffect(() => {
    if (!recording) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime((previous) => previous + 1);

      if (recorder) {
        setSamples(recorder.getRowCount());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [recording, recorder]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (!recorder || disabled) {
      return;
    }

    recorder.start();

    setRecording(true);
    setElapsedTime(0);
    setSamples(0);
  };

  const handleStop = () => {
    if (!recorder) {
      return;
    }

    recorder.stop();

    recorder.download();

    setRecording(false);
  };

  return (
    <div className={`recorder ${recording ? "recording" : ""}`}>
      {recording ? (
        <>
          <div className="recorder-info">
            <span className="recording-indicator"></span>

            <div>
              <strong>GRABANDO</strong>

              <span className="recorder-time">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>

          <div className="recorder-samples">
            {samples} muestras
          </div>

          <button
            className="recorder-button stop"
            onClick={handleStop}
          >
            <span className="stop-icon"></span>

            DETENER Y GUARDAR
          </button>
        </>
      ) : (
        <>
          <div className="recorder-info">
            <span className="ready-indicator"></span>

            <div>
              <strong>RECOPILACIÓN</strong>

              <span className="recorder-status">
                Lista para iniciar
              </span>
            </div>
          </div>

          <button
            className="recorder-button start"
            onClick={handleStart}
            disabled={disabled}
          >
            <span className="play-icon">▶</span>

            INICIAR RECOPILACIÓN
          </button>
        </>
      )}
    </div>
  );
}