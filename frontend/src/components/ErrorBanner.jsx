import { AlertTriangle } from "lucide-react";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div style={styles.banner}>
      <AlertTriangle size={18} color="var(--accent-danger)" />
      <span>{message}</span>
    </div>
  );
}

const styles = {
  banner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255, 129, 119, 0.1)",
    border: "1px solid rgba(255, 129, 119, 0.35)",
    color: "#ffb3ab",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 14,
    margin: "16px 0",
  },
};
