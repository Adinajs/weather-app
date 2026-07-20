import { Download } from "lucide-react";
import { api } from "../api/client";

const FORMATS = ["json", "csv", "xml", "markdown", "pdf"];

export default function ExportBar() {
  return (
    <div style={styles.wrap}>
      <span style={styles.label}>
        <Download size={14} /> Export all records:
      </span>
      {FORMATS.map((fmt) => (
        <a key={fmt} href={api.exportUrl(fmt)} style={styles.btn}>
          {fmt.toUpperCase()}
        </a>
      ))}
    </div>
  );
}

const styles = {
  wrap: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 20 },
  label: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "var(--text-faint)",
    marginRight: 4,
  },
  btn: {
    background: "var(--bg-panel-raised)",
    border: "1px solid var(--border-soft)",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    color: "var(--accent-sky)",
    textDecoration: "none",
  },
};
