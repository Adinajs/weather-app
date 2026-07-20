# 🌦️ WeatherStation

A full-stack weather application built for the **PM Accelerator AI Engineer
Intern Technical Assessment** both tracks completed (Frontend + Backend).

Built by **Adina Saif Ullah**

---

## 📋 What this covers

| Track | Location | Status |
|---|---|---|
| **Tech Assessment #1** — Frontend | [`frontend/`](./frontend) | ✅ Complete |
| **Tech Assessment #2** — Backend | [`backend/`](./backend) | ✅ Complete |

Submitted as a full-stack (dual-role) candidate.

---

## ✨ Features

**Frontend (React + Vite)**
- Location search by city, zip/postal code, landmark, or raw `lat,lon`
- "Use my current location" via the browser Geolocation API
- Live current conditions (temperature, wind, description, icon)
- 5-day forecast, laid out as a responsive card grid
- Graceful error handling (bad location, dead API, denied geolocation permission)
- Fully responsive — reflows cleanly from desktop down to phone width, no fixed breakpoints
- Full CRUD UI for saved weather records
- One-click export to JSON, CSV, XML, Markdown, or PDF
- On-demand map, travel-video, and air-quality lookups for any searched location

**Backend (FastAPI + SQL)**
- RESTful API with full **CRUD**: create, read, update, delete weather records
- Input validation: date ranges must make sense, locations are resolved/fuzzy-matched via geocoding before anything touches the database
- **Data export** in 5 formats (JSON, CSV, XML, Markdown, PDF)
- Extra API integrations: Google Maps, YouTube, and air quality (all key-less — nothing to configure)
- Auto-generated interactive API docs at `/docs`
- SQLite by default, one env var away from PostgreSQL

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios, lucide-react |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | SQLite (dev) → PostgreSQL-ready |
| Weather/Geocoding data | [Open-Meteo](https://open-meteo.com) — free, no API key |
| PDF export | ReportLab |

---

## 🚀 Quick Start

**Requirements:** Python 3.10+, Node.js 18+

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Confirm it's up: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

That's it both servers need to be running at the same time, in separate terminals.

---

## 📁 Project Structure

```
weather-app/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entrypoint
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── database.py          # DB session/config
│   │   ├── routers/
│   │   │   ├── weather.py       # current weather + forecast
│   │   │   ├── records.py       # CRUD + export
│   │   │   └── integrations.py  # maps, videos, air quality
│   │   └── services/
│   │       ├── weather_service.py
│   │       └── export_service.py
│   ├── requirements.txt
│   └── README.md                # backend-specific details
│
├── frontend/
│   ├── src/
│   │   ├── components/          # UI building blocks
│   │   ├── pages/                # WeatherPage, RecordsPage
│   │   └── api/client.js         # API client
│   ├── package.json
│   └── README.md                 # frontend-specific details
│
└── README.md                     # you are here
```

---

## 🔌 API Reference (Backend)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/weather/current` | Current conditions + 5-day forecast |
| `POST` | `/api/records` | Create a weather record for a location + date range |
| `GET` | `/api/records` | List all saved records |
| `GET` | `/api/records/{id}` | Get one record |
| `PUT` | `/api/records/{id}` | Update a record (partial update supported) |
| `DELETE` | `/api/records/{id}` | Delete a record |
| `GET` | `/api/records/export/{fmt}` | Export all records (`json`\|`csv`\|`xml`\|`markdown`\|`pdf`) |
| `GET` | `/api/integrations/maps` | Google Maps embed for a location |
| `GET` | `/api/integrations/videos` | YouTube travel videos for a location |
| `GET` | `/api/integrations/air-quality` | Current AQI/PM2.5/PM10 for a location |

Full request/response schemas: http://localhost:8000/docs (once running).

---

## 🌍 Why Open-Meteo?

It's free, requires no signup or API key, and covers geocoding, live
forecasts, and historical weather in one place so anyone cloning this repo
can run it immediately with zero credential setup.

## 🗄️ Switching to PostgreSQL

```bash
export DATABASE_URL=postgresql://user:pass@localhost:5432/weatherdb
```

The backend is fully database-agnostic via SQLAlchemy no code changes needed.

---

## 🎥 Demo

_[Add your demo video link here before submitting]_

---

## 🏢 About PM Accelerator

The Product Manager Accelerator Program is designed to support PM
professionals through every stage of their career from students breaking
into product management, to Directors and VPs of Product. It offers 1:1
coaching, practical training, and real-world project experience.

🔗 [PM Accelerator on LinkedIn](https://www.linkedin.com/company/product-manager-accelerator/)
