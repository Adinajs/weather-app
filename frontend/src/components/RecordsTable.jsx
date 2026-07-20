import { useState } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function RecordsTable({ records, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!records.length) {
    return <div style={styles.empty}>No records yet. Create one above to get started.</div>;
  }

  return (
    <div style={styles.wrap}>
      {records.map((r) => {
        const isOpen = expandedId === r.id;
        return (
          <div key={r.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.location}>{r.resolved_name}</div>
                <div style={styles.dates}>
                  {r.start_date} → {r.end_date}
                  {r.notes ? ` · ${r.notes}` : ""}
                </div>
              </div>
              <div style={styles.actions}>
                <button
                  style={styles.iconBtn}
                  onClick={() => setExpandedId(isOpen ? null : r.id)}
                  title="Toggle daily temperatures"
                >
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button style={styles.iconBtn} onClick={() => onEdit(r)} title="Edit">
                  <Pencil size={16} />
                </button>
                <button
                  style={{ ...styles.iconBtn, color: "var(--accent-danger)" }}
                  onClick={() => onDelete(r.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {isOpen && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Max</th>
                    <th style={styles.th}>Min</th>
                  </tr>
                </thead>
                <tbody>
                  {r.daily_temperatures.map((d) => (
                    <tr key={d.date}>
                      <td style={styles.td}>{d.date}</td>
                      <td style={styles.td}>{d.temp_max}°C</td>
                      <td style={styles.td}>{d.temp_min}°C</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", gap: 10, marginTop: 16 },
  empty: {
    marginTop: 20,
    textAlign: "center",
    color: "var(--text-faint)",
    padding: 30,
    border: "1px dashed var(--border-soft)",
    borderRadius: 12,
  },
  card: {
    background: "var(--bg-panel)",
    border: "1px solid var(--border-soft)",
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  location: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 },
  dates: { fontSize: 12, color: "var(--text-muted)", marginTop: 4, fontFamily: "var(--font-mono)" },
  actions: { display: "flex", gap: 6, flexShrink: 0 },
  iconBtn: {
    background: "var(--bg-panel-raised)",
    border: "1px solid var(--border-soft)",
    borderRadius: 8,
    padding: 8,
    color: "var(--text-primary)",
    display: "flex",
  },
  table: { width: "100%", marginTop: 14, borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left",
    color: "var(--text-faint)",
    fontWeight: 500,
    padding: "6px 8px",
    borderBottom: "1px solid var(--border-soft)",
    fontFamily: "var(--font-mono)",
  },
  td: { padding: "6px 8px", borderBottom: "1px solid var(--border-soft)", fontFamily: "var(--font-mono)" },
};
