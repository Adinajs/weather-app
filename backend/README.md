# Weather App — Backend (Tech Assessment #2)

FastAPI + SQLAlchemy (SQLite by default) + [Open-Meteo](https://open-meteo.com)
(free, no API key needed).

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Interactive docs (Swagger UI): http://localhost:8000/docs

## What's implemented

- **CREATE** `POST /api/records` — validates the date range (`end >= start`,
  ≤366 days) and the location (via geocoding; rejects unresolvable input,
  accepts fuzzy city/zip/landmark names or `"lat,lon"`), fetches temperatures
  for the range, and stores everything.
- **READ** `GET /api/records`, `GET /api/records/{id}` — no row-level
  security, per the assessment spec (any user can read any record).
- **UPDATE** `PUT /api/records/{id}` — partial update of location, dates, or
  notes, with the same validation as create; pass `"refetch": true` to
  re-pull temperatures if location/dates changed.
- **DELETE** `DELETE /api/records/{id}`.
- **Export** `GET /api/records/export/{fmt}` — `fmt` = `json`, `csv`, `xml`,
  `markdown`, or `pdf`.
- **Current weather + 5-day forecast** `POST /api/weather/current` — accepts
  either `location_query` or `latitude`/`longitude` (used for "my current
  location" in the frontend).
- **Extra API integrations** (`/api/integrations/*`):
  - `/maps` — Google Maps embed URL for the resolved location (key-less embed
    form, so no billing setup required to run this project)
  - `/videos` — YouTube search link/embed for travel videos of the location
    (avoids requiring a YouTube Data API key; swap-in point documented in
    the code if you have one)
  - `/air-quality` — current AQI/PM2.5/PM10 via Open-Meteo's free Air Quality
    API, as the "be creative with additional APIs" option

## Why Open-Meteo

It's free, requires no signup/API key, and covers geocoding + forecast +
historical weather in one place — so anyone cloning this repo can run it
immediately with zero credential setup.

## Switching to PostgreSQL

Set the `DATABASE_URL` env var, e.g.:

```bash
export DATABASE_URL=postgresql://user:pass@localhost:5432/weatherdb
```

The code is fully DB-agnostic via SQLAlchemy; no other changes needed.

## Tests

A quick manual smoke test (mocks the outbound HTTP calls, uses a real SQLite
DB) is what was used to verify all CRUD + export endpoints during
development. Feel free to ask me for the test script if you want to rerun it.
