export default function ForecastStrip({ forecast }) {
  if (!forecast?.length) return null;

  const allMax = forecast.map((d) => d.temp_max);
  const allMin = forecast.map((d) => d.temp_min);
  const globalMax = Math.max(...allMax);
  const globalMin = Math.min(...allMin);
  const span = Math.max(globalMax - globalMin, 1);

  return (
    <div style={styles.wrap}>
      <div style={styles.heading}>5-DAY FORECAST</div>
      <div style={styles.grid}>
        {forecast.map((day, i) => {
          const dayLabel = new Date(day.date + "T00:00:00").toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          const barLeft = ((day.temp_min - globalMin) / span) * 100;
          const barWidth = Math.max(((day.temp_max - day.temp_min) / span) * 100, 6);

          return (
            <div key={i} style={styles.card}>
              <div style={styles.day}>{dayLabel}</div>
              <div style={styles.icon}>{day.icon}</div>
              <div style={styles.desc}>{day.description}</div>
              <div style={styles.tempRow}>
                <span style={styles.tempMax}>{Math.round(day.temp_max)}°</span>
                <span style={styles.tempMin}>{Math.round(day.temp_min)}°</span>
              </div>
              <div style={styles.track}>
                <div
                  style={{
                    ...styles.trackFill,
                    marginLeft: `${barLeft}%`,
                    width: `${barWidth}%`,
                  }}
                />
              </div>
              {day.precipitation_probability != null && (
                <div style={styles.precip}>💧 {day.precipitation_probability}%</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap: { marginTop: 24 },
  heading: {
    fontSize: 12,
    letterSpacing: "0.12em",
    color: "var(--text-faint)",
    marginBottom: 12,
    fontFamily: "var(--font-mono)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: 12,
  },
  card: {
    background: "var(--bg-panel)",
    border: "1px solid var(--border-soft)",
    borderRadius: "var(--radius-md)",
    padding: "16px 14px",
    textAlign: "center",
  },
  day: { fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 },
  icon: { fontSize: 32 },
  desc: { fontSize: 11, color: "var(--text-faint)", height: 28, marginTop: 4 },
  tempRow: { display: "flex", justifyContent: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: 15 },
  tempMax: { color: "var(--accent-amber)", fontWeight: 600 },
  tempMin: { color: "var(--text-faint)" },
  track: {
    height: 4,
    background: "var(--border-soft)",
    borderRadius: 2,
    marginTop: 10,
    position: "relative",
    overflow: "hidden",
  },
  trackFill: {
    position: "absolute",
    top: 0,
    height: "100%",
    background: "linear-gradient(90deg, var(--accent-rain), var(--accent-amber))",
    borderRadius: 2,
  },
  precip: { marginTop: 8, fontSize: 11, color: "var(--accent-rain)" },
};
