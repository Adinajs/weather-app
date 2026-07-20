import { useState } from "react";
import { Search, LocateFixed } from "lucide-react";

export default function LocationInput({ onSearch, onUseCurrentLocation, loading }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputWrap}>
        <Search size={16} color="var(--text-faint)" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="City, zip/postal code, landmark, or lat,lon"
          style={styles.input}
        />
      </div>
      <button type="submit" disabled={loading} style={styles.primaryBtn}>
        {loading ? "Searching…" : "Get Weather"}
      </button>
      <button
        type="button"
        onClick={onUseCurrentLocation}
        disabled={loading}
        style={styles.secondaryBtn}
        title="Use my current location"
      >
        <LocateFixed size={16} />
        My location
      </button>
    </form>
  );
}

const styles = {
  form: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--bg-deep)",
    border: "1px solid var(--border-soft)",
    borderRadius: 10,
    padding: "10px 14px",
    flex: "1 1 280px",
  },
  input: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text-primary)",
    fontSize: 14,
    width: "100%",
  },
  primaryBtn: {
    background: "var(--accent-sky)",
    color: "#04101f",
    border: "none",
    borderRadius: 10,
    padding: "11px 18px",
    fontWeight: 600,
    fontSize: 14,
  },
  secondaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "var(--bg-panel-raised)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-soft)",
    borderRadius: 10,
    padding: "11px 16px",
    fontSize: 14,
  },
};
