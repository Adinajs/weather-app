# Weather App — Frontend (Tech Assessment #1)

React (Vite) app. Plain CSS-in-JS (inline styles) — no framework lock-in,
no build config beyond Vite's defaults.

## Setup

```bash
cd frontend
npm install
cp .env.example .env    # points the app at the backend; edit if needed
npm run dev
```

Open http://localhost:5173. Make sure the backend (see ../backend/README.md)
is running on port 8000 first.

## What's implemented

- **Location input**: free text (city, zip/postal code, landmark, "lat,lon")
  or a "My location" button using the browser Geolocation API.
- **Current conditions**: temperature, description, icon, wind speed,
  coordinates, timezone.
- **5-day forecast**: responsive card grid (`grid-template-columns:
  repeat(auto-fit, minmax(...))`) with a min/max temperature range bar per
  day and precipitation probability.
- **Error handling**: a dedicated banner for bad locations, unreachable API,
  geolocation denial, etc. — nothing fails silently.
- **Records tab**: full CRUD UI against the backend (create/edit form, list
  with expandable daily-temperature detail, delete with confirmation) plus
  one-click export buttons (JSON/CSV/XML/Markdown/PDF).
- **Integrations panel**: on-demand map embed, YouTube travel-video link, and
  air quality lookup for the searched location.

## Responsive design

- CSS Grid `auto-fit`/`minmax` for the forecast strip — reflows from 5
  columns down to 1 as the viewport narrows, no breakpoints needed.
- Flexbox `wrap` throughout (header nav, search bar, form rows, action
  buttons) so nothing overflows on narrow screens.
- `clamp()` for the hero temperature readout so it scales smoothly instead of
  overflowing on phones.
- A `prefers-reduced-motion` rule and a small-screen font-size adjustment in
  `index.css`.

Tested by resizing down to ~375px (iPhone SE width) during development.

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Set `VITE_API_BASE_URL` to your deployed backend URL
before building if it's not `localhost:8000`.
