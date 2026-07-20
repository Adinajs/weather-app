import { useState } from "react";
import LocationInput from "../components/LocationInput";
import ErrorBanner from "../components/ErrorBanner";
import CurrentWeatherPanel from "../components/CurrentWeatherPanel";
import ForecastStrip from "../components/ForecastStrip";
import IntegrationsPanel from "../components/IntegrationsPanel";
import { api } from "../api/client";

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSearch({ locationQuery: q, latitude, longitude }) {
    setLoading(true);
    setError("");
    try {
      const data = await api.getCurrentWeather({ locationQuery: q, latitude, longitude });
      setWeatherData(data);
      setLocationQuery(q || data.location.name);
    } catch (e) {
      setError(e.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported by this browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => runSearch({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => {
        setError("Couldn't access your location. Check your browser's location permission.");
        setLoading(false);
      }
    );
  }

  return (
    <div style={styles.page}>
      <LocationInput
        onSearch={(q) => runSearch({ locationQuery: q })}
        onUseCurrentLocation={handleUseCurrentLocation}
        loading={loading}
      />

      <ErrorBanner message={error} />

      {!weatherData && !error && !loading && (
        <div style={styles.empty}>
          Search a city, zip code, landmark, or use your current location to see live conditions.
        </div>
      )}

      {weatherData && (
        <>
          <div style={{ marginTop: 20 }}>
            <CurrentWeatherPanel data={weatherData} />
          </div>
          <ForecastStrip forecast={weatherData.forecast} />
          <IntegrationsPanel locationQuery={locationQuery} />
        </>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 920, margin: "0 auto", padding: "32px 24px" },
  empty: {
    marginTop: 40,
    textAlign: "center",
    color: "var(--text-faint)",
    fontSize: 14,
    padding: 40,
    border: "1px dashed var(--border-soft)",
    borderRadius: 12,
  },
};
