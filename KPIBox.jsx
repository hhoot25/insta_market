import "./KPIBox.css";

export default function KPIBox({ icon, label, value, change, color = "accent" }) {
  const isPositive = change >= 0;
  return (
    <div className={`kpi-box card`}>
      <div className={`kpi-icon kpi-icon--${color}`}>{icon}</div>
      <div className="kpi-content">
        <p className="kpi-label">{label}</p>
        <p className="kpi-value">{value}</p>
        {change !== undefined && (
          <p className={`kpi-change ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(change)}% vs last week
          </p>
        )}
      </div>
    </div>
  );
}
