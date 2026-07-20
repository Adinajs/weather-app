"""
Weather + geocoding service.

Uses Open-Meteo (https://open-meteo.com) because it is free, requires no API
key/signup, and offers geocoding, forecast, and historical archive endpoints
-- everything this assessment needs from a single provider.

Location input handling (per assessment: "you have autonomy to determine how
the user should enter their location"):
  - "lat,lon" strings (e.g. "33.6844,73.0479") are detected and used directly
  - everything else (city, zip/postal code, landmark, town) is sent to the
    geocoding endpoint, which fuzzy-matches names and returns candidates
"""
import re
from datetime import date, timedelta
from typing import Optional

import requests

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"

LATLON_RE = re.compile(r"^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$")

# WMO weather codes -> (description, emoji icon)
WMO_CODES = {
    0: ("Clear sky", "☀️"),
    1: ("Mainly clear", "🌤️"),
    2: ("Partly cloudy", "⛅"),
    3: ("Overcast", "☁️"),
    45: ("Fog", "🌫️"),
    48: ("Depositing rime fog", "🌫️"),
    51: ("Light drizzle", "🌦️"),
    53: ("Moderate drizzle", "🌦️"),
    55: ("Dense drizzle", "🌧️"),
    56: ("Light freezing drizzle", "🌧️"),
    57: ("Dense freezing drizzle", "🌧️"),
    61: ("Slight rain", "🌦️"),
    63: ("Moderate rain", "🌧️"),
    65: ("Heavy rain", "🌧️"),
    66: ("Light freezing rain", "🌧️"),
    67: ("Heavy freezing rain", "🌧️"),
    71: ("Slight snow fall", "🌨️"),
    73: ("Moderate snow fall", "🌨️"),
    75: ("Heavy snow fall", "❄️"),
    77: ("Snow grains", "❄️"),
    80: ("Slight rain showers", "🌦️"),
    81: ("Moderate rain showers", "🌧️"),
    82: ("Violent rain showers", "⛈️"),
    85: ("Slight snow showers", "🌨️"),
    86: ("Heavy snow showers", "❄️"),
    95: ("Thunderstorm", "⛈️"),
    96: ("Thunderstorm with slight hail", "⛈️"),
    99: ("Thunderstorm with heavy hail", "⛈️"),
}


class WeatherServiceError(Exception):
    """Raised for user-facing errors (bad location, API failure, bad range)."""


def describe_code(code: Optional[int]):
    if code is None:
        return {"description": "Unknown", "icon": "❓"}
    desc, icon = WMO_CODES.get(int(code), ("Unknown", "❓"))
    return {"description": desc, "icon": icon}


def resolve_location(location_query: Optional[str], latitude: Optional[float] = None,
                      longitude: Optional[float] = None):
    """
    Returns dict: {name, country, latitude, longitude}
    Raises WeatherServiceError if it can't find/validate the location.
    """
    if latitude is not None and longitude is not None:
        return {"name": f"{latitude:.4f}, {longitude:.4f}", "country": None,
                "latitude": latitude, "longitude": longitude}

    if not location_query or not location_query.strip():
        raise WeatherServiceError("Please provide a location.")

    m = LATLON_RE.match(location_query)
    if m:
        lat, lon = float(m.group(1)), float(m.group(3))
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            raise WeatherServiceError("Coordinates out of range.")
        return {"name": f"{lat:.4f}, {lon:.4f}", "country": None,
                "latitude": lat, "longitude": lon}

    try:
        resp = requests.get(GEOCODE_URL, params={"name": location_query.strip(),
                                                   "count": 1, "language": "en"}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as e:
        raise WeatherServiceError(f"Geocoding service unavailable: {e}") from e

    data = resp.json()
    results = data.get("results")
    if not results:
        raise WeatherServiceError(
            f"Could not find a location matching '{location_query}'. "
            "Try a nearby major city, a postal code, or 'lat,lon'."
        )

    top = results[0]
    return {
        "name": ", ".join(filter(None, [top.get("name"), top.get("admin1"), top.get("country")])),
        "country": top.get("country"),
        "latitude": top["latitude"],
        "longitude": top["longitude"],
    }


def get_current_and_forecast(latitude: float, longitude: float, days: int = 5):
    """Current conditions + N-day forecast (default 5, per 1.1)."""
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current_weather": "true",
        "daily": "weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        "timezone": "auto",
        "forecast_days": days,
    }
    try:
        resp = requests.get(FORECAST_URL, params=params, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as e:
        raise WeatherServiceError(f"Weather service unavailable: {e}") from e

    data = resp.json()
    current = data.get("current_weather", {})
    daily = data.get("daily", {})

    forecast = []
    dates = daily.get("time", [])
    for i, d in enumerate(dates):
        code = daily.get("weathercode", [None] * len(dates))[i]
        forecast.append({
            "date": d,
            "temp_max": daily.get("temperature_2m_max", [None])[i],
            "temp_min": daily.get("temperature_2m_min", [None])[i],
            "precipitation_probability": daily.get("precipitation_probability_max", [None])[i],
            **describe_code(code),
        })

    return {
        "current": {
            "temperature": current.get("temperature"),
            "windspeed": current.get("windspeed"),
            "time": current.get("time"),
            **describe_code(current.get("weathercode")),
        },
        "forecast": forecast,
        "timezone": data.get("timezone"),
    }


def get_temperatures_for_range(latitude: float, longitude: float, start: date, end: date):
    """
    Returns list of {date, temp_max, temp_min, temp_unit} covering [start, end].
    Splits the request across the historical archive API (past dates) and the
    forecast API (today/future, up to ~16 days ahead) as needed.
    """
    if end < start:
        raise WeatherServiceError("end_date must be on or after start_date")
    if (end - start).days > 366:
        raise WeatherServiceError("Please request a range of 366 days or fewer.")

    today = date.today()
    results = []

    past_end = min(end, today - timedelta(days=1))
    if start <= past_end:
        try:
            resp = requests.get(ARCHIVE_URL, params={
                "latitude": latitude, "longitude": longitude,
                "start_date": start.isoformat(), "end_date": past_end.isoformat(),
                "daily": "temperature_2m_max,temperature_2m_min",
                "timezone": "auto",
            }, timeout=15)
            resp.raise_for_status()
            daily = resp.json().get("daily", {})
            for i, d in enumerate(daily.get("time", [])):
                results.append({
                    "date": d,
                    "temp_max": daily.get("temperature_2m_max", [None])[i],
                    "temp_min": daily.get("temperature_2m_min", [None])[i],
                    "temp_unit": "C",
                })
        except requests.RequestException as e:
            raise WeatherServiceError(f"Historical weather service unavailable: {e}") from e

    future_start = max(start, today)
    if future_start <= end:
        forecast_days = min((end - today).days + 1, 16)
        if forecast_days > 0:
            try:
                resp = requests.get(FORECAST_URL, params={
                    "latitude": latitude, "longitude": longitude,
                    "daily": "temperature_2m_max,temperature_2m_min",
                    "timezone": "auto", "forecast_days": forecast_days,
                }, timeout=15)
                resp.raise_for_status()
                daily = resp.json().get("daily", {})
                for i, d in enumerate(daily.get("time", [])):
                    d_date = date.fromisoformat(d)
                    if future_start <= d_date <= end:
                        results.append({
                            "date": d,
                            "temp_max": daily.get("temperature_2m_max", [None])[i],
                            "temp_min": daily.get("temperature_2m_min", [None])[i],
                            "temp_unit": "C",
                        })
            except requests.RequestException as e:
                raise WeatherServiceError(f"Forecast service unavailable: {e}") from e

    if not results:
        raise WeatherServiceError(
            "Could not retrieve temperatures for that range. Forecasts are only "
            "available up to ~16 days ahead; further future dates aren't supported."
        )

    return sorted(results, key=lambda r: r["date"])
