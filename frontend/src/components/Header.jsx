import { Gauge } from "lucide-react";

export default function Header({ tab, setTab }) {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <Gauge size={26} color="var(--accent-sky)" strokeWidth={1.75} />
        <div>
          <div style={styles.title}>WEATHERSTATION</div>
          <div style={styles.subtitle}>real-time conditions &amp; trip planning</div>
        </div>
      </div>

      <nav style={styles.nav}>
        <button
          onClick={() => setTab("weather")}
          style={{ ...styles.tab, ...(tab === "weather" ? styles.tabActive : {}) }}
        >
          Current Weather
        </button>
        <button
          onClick={() => setTab("records")}
          style={{ ...styles.tab, ...(tab === "records" ? styles.tabActive : {}) }}
        >
          My Records
        </button>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 32px",
    borderBottom: "1px solid var(--border-soft)",
    flexWrap: "wrap",
    gap: 16,
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  title: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: "0.08em",
  },
  subtitle: {
    fontSize: 12,
    color: "var(--text-muted)",
    marginTop: 2,
  },
  nav: { display: "flex", gap: 4, background: "var(--bg-panel)", padding: 4, borderRadius: 10 },
  tab: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.15s ease",
  },
  tabActive: {
    background: "var(--bg-panel-raised)",
    color: "var(--text-primary)",
    boxShadow: "0 0 0 1px var(--border-soft)",
  },
};
