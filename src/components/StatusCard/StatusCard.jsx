import "./StatusCard.css";

export default function StatusCard({ title, value, color = "#3B82F6" }) {
  return (
    <div className="status-card">
      <span className="status-title">{title}</span>

      <span
        className="status-value"
        style={{ color: color }}
      >
        {value}
      </span>
    </div>
  );
}