import "./TelemetryCard.css";

export default function TelemetryCard({
    title,
    value,
    unit,
    icon
}) {

    return (

        <div className="telemetry-card">

            <i className={`bi bi-${icon} telemetry-icon`}></i>

            <h5>{title}</h5>

            <h2>{value}</h2>

            <span>{unit}</span>

        </div>

    );

}