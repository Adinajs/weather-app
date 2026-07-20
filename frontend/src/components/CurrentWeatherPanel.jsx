import { Wind, MapPin } from "lucide-react";

export default function CurrentWeatherPanel({ data }) {
  if (!data) return null;
  const { location, current, timezone } = data;

  return (
    <div style={styles.panel}>
      <div style={styles.locationRow}>
        <MapPin size={16} color="var(--accent-sky)" />
        <span style={styles.locationName}>{location.name}</span>
        {timezone && <span style={styles.timezone}>{timezone}</span>}
      </div>

      <div style={styles.readoutRow}>
        <div style={styles.iconBlock}>
          <span style={styles.icon}>{current.icon}</span>
          <span style={styles.description}>{current.description}</span>
        </div>

        <div style={styles.tempBlock}>
          <span style={styles.tempValue}>{Math.round(current.temperature)}</span>
          <span style={styles.tempUnit}>°C</span>
        </div>

        <div style={styles.metaBlock}>
          <div style={styles.metaItem}>
            <Wind size={14} color="var(--text-faint)" />
            <span>{current.windspeed} km/h wind</span>
          </div>
          <div style={styles.metaItem}>
            <span style={{ color: "var(--text-faint)" }}>Lat/Lon</span>
            <span style={{ fontFamily: "var(--font-mono)" }}>
              {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    background: "var(--bg-panel)",
    border: "1px solid var(--border-soft)",
    borderRadius: "var(--radius-lg)",
    padding: 28,
  },
  locationRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 },
  locationName: { fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 },
  timezone: {
    marginLeft: "auto",
    fontSize: 12,
    color: "var(--text-faint)",
    fontFamily: "var(--font-mono)",
  },
  readoutRow: { display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" },
  iconBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 100 },
  icon: { fontSize: "clamp(40px, 8vw, 56px)", lineHeight: 1 },
  description: { fontSize: 13, color: "var(--text-muted)" },
  tempBlock: { display: "flex", alignItems: "flex-start" },
  tempValue: {
    fontFamily: "var(--font-mono)",
    fontSize: "clamp(52px, 12vw, 88px)",
    fontWeight: 600,
    lineHeight: 1,
    color: "var(--accent-amber)",
  },
  tempUnit: {
    fontFamily: "var(--font-mono)",
    fontSize: "clamp(18px, 3vw, 28px)",
    color: "var(--text-muted)",
    marginTop: 8,
  },
  metaBlock: { display: "flex", flexDirection: "column", gap: 10, marginLeft: "auto" },
  metaItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-primary)" },
};
