import { useState, useEffect } from "react";

export default function RecordForm({ onSubmit, editingRecord, onCancelEdit, submitting }) {
  const [form, setForm] = useState({ location_query: "", start_date: "", end_date: "", notes: "" });

  useEffect(() => {
    if (editingRecord) {
      setForm({
        location_query: editingRecord.location_query,
        start_date: editingRecord.start_date,
        end_date: editingRecord.end_date,
        notes: editingRecord.notes || "",
      });
    } else {
      setForm({ location_query: "", start_date: "", end_date: "", notes: "" });
    }
  }, [editingRecord]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
    if (!editingRecord) setForm({ location_query: "", start_date: "", end_date: "", notes: "" });
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <label style={styles.label}>
          Location
          <input
            required
            value={form.location_query}
            onChange={(e) => update("location_query", e.target.value)}
            placeholder="e.g. Lahore, 44000, or 33.6844,73.0479"
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.row}>
        <label style={styles.label}>
          Start date
          <input
            required
            type="date"
            value={form.start_date}
            onChange={(e) => update("start_date", e.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          End date
          <input
            required
            type="date"
            value={form.end_date}
            onChange={(e) => update("end_date", e.target.value)}
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.row}>
        <label style={styles.label}>
          Notes (optional)
          <input
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="e.g. Family trip"
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.actions}>
        <button type="submit" disabled={submitting} style={styles.primaryBtn}>
          {submitting ? "Saving…" : editingRecord ? "Save changes" : "Create record"}
        </button>
        {editingRecord && (
          <button type="button" onClick={onCancelEdit} style={styles.secondaryBtn}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  form: {
    background: "var(--bg-panel)",
    border: "1px solid var(--border-soft)",
    borderRadius: "var(--radius-lg)",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  row: { display: "flex", gap: 14, flexWrap: "wrap" },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 12,
    color: "var(--text-muted)",
    flex: "1 1 200px",
  },
  input: {
    background: "var(--bg-deep)",
    border: "1px solid var(--border-soft)",
    borderRadius: 8,
    padding: "10px 12px",
    color: "var(--text-primary)",
    fontSize: 14,
  },
  actions: { display: "flex", gap: 10, marginTop: 4 },
  primaryBtn: {
    background: "var(--accent-sky)",
    color: "#04101f",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 600,
    fontSize: 14,
  },
  secondaryBtn: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "1px solid var(--border-soft)",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 14,
  },
};
