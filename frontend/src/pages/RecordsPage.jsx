import { useState, useEffect, useCallback } from "react";
import RecordForm from "../components/RecordForm";
import RecordsTable from "../components/RecordsTable";
import ExportBar from "../components/ExportBar";
import ErrorBanner from "../components/ErrorBanner";
import { api } from "../api/client";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      setRecords(await api.listRecords());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function handleSubmit(form) {
    setSubmitting(true);
    setError("");
    try {
      if (editingRecord) {
        await api.updateRecord(editingRecord.id, { ...form, refetch: true });
        setEditingRecord(null);
      } else {
        await api.createRecord(form);
      }
      await loadRecords();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      await api.deleteRecord(id);
      await loadRecords();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Create a weather record</h2>
      <p style={styles.hint}>
        Enter a location and date range. We'll validate both, fetch the temperatures, and save them.
      </p>
      <RecordForm
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
        onCancelEdit={() => setEditingRecord(null)}
        submitting={submitting}
      />

      <ErrorBanner message={error} />

      <div style={styles.listHeader}>
        <h2 style={{ ...styles.heading, marginBottom: 0 }}>Saved records</h2>
        <ExportBar />
      </div>

      {loading ? (
        <p style={styles.hint}>Loading…</p>
      ) : (
        <RecordsTable records={records} onEdit={setEditingRecord} onDelete={handleDelete} />
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 920, margin: "0 auto", padding: "32px 24px" },
  heading: { fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 6 },
  hint: { fontSize: 13, color: "var(--text-muted)", marginBottom: 16 },
  listHeader: { marginTop: 40, marginBottom: 8 },
};
