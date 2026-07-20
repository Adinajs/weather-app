import { useState } from "react";
import { Map, Video, Wind } from "lucide-react";
import { api } from "../api/client";

export default function IntegrationsPanel({ locationQuery }) {
  const [maps, setMaps] = useState(null);
  const [videos, setVideos] = useState(null);
  const [air, setAir] = useState(null);
  const [loadingKey, setLoadingKey] = useState(null);
  const [error, setError] = useState("");

  async function loadMaps() {
    setLoadingKey("maps");
    setError("");
    try {
      setMaps(await api.getMaps(locationQuery));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingKey(null);
    }
  }

  async function loadVideos() {
    setLoadingKey("videos");
    setError("");
    try {
      setVideos(await api.getVideos(locationQuery));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingKey(null);
    }
  }

  async function loadAir() {
    setLoadingKey("air");
    setError("");
    try {
      setAir(await api.getAirQuality(locationQuery));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.heading}>MORE ABOUT THIS LOCATION</div>
      <div style={styles.buttonRow}>
        <button style={styles.btn} onClick={loadMaps} disabled={loadingKey === "maps"}>
          <Map size={15} /> {maps ? "Refresh map" : "Show map"}
        </button>
        <button style={styles.btn} onClick={loadVideos} disabled={loadingKey === "videos"}>
          <Video size={15} /> {videos ? "Refresh videos" : "Find travel videos"}
        </button>
        <button style={styles.btn} onClick={loadAir} disabled={loadingKey === "air"}>
          <Wind size={15} /> {air ? "Refresh air quality" : "Check air quality"}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {maps && (
        <div style={styles.embedBlock}>
          <iframe
            title="map"
            src={maps.embed_url}
            style={styles.iframe}
            loading="lazy"
          />
        </div>
      )}

      {videos && (
        <div style={styles.linkBlock}>
          <a href={videos.search_link} target="_blank" rel="noreferrer">
            Watch travel videos for {videos.location.name} on YouTube ↗
          </a>
        </div>
      )}

      {air && (
        <div style={styles.airCard}>
          <span>US AQI: <strong>{air.air_quality.us_aqi ?? "n/a"}</strong></span>
          <span>PM2.5: {air.air_quality.pm2_5 ?? "n/a"} µg/m³</span>
          <span>PM10: {air.air_quality.pm10 ?? "n/a"} µg/m³</span>
        </div>
      )}
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
  buttonRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  btn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "var(--bg-panel)",
    border: "1px solid var(--border-soft)",
    color: "var(--text-primary)",
    borderRadius: 10,
    padding: "9px 14px",
    fontSize: 13,
  },
  error: { color: "var(--accent-danger)", fontSize: 13, marginTop: 10 },
  embedBlock: { marginTop: 14, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-soft)" },
  iframe: { width: "100%", height: 280, border: "none" },
  linkBlock: { marginTop: 14, fontSize: 14 },
  airCard: {
    marginTop: 14,
    display: "flex",
    gap: 20,
    background: "var(--bg-panel)",
    border: "1px solid var(--border-soft)",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 13,
    fontFamily: "var(--font-mono)",
  },
};
