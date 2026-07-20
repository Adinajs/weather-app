# Weather App

Full-stack technical assessment submission — **Adina Saif Ullah** — for the
PM Accelerator AI Engineer Intern role. Both tracks completed:

- **Tech Assessment #1** (Frontend) → `frontend/` — React, responsive,
  current weather + 5-day forecast + error handling.
- **Tech Assessment #2** (Backend) → `backend/` — FastAPI + SQL, full CRUD
  with validation, data export in 5 formats, extra API integrations.

## Quick start (both halves)

```bash
# Terminal 1 — backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. Full details, including how everything maps to
the assessment's numbered requirements, are in `backend/README.md` and
`frontend/README.md`.

## About PM Accelerator

The Product Manager Accelerator Program is designed to support PM
professionals through every stage of their career — from students
breaking in, to Directors and VPs of Product. It offers 1:1 coaching,
practical training, and real-world project experience.
[PM Accelerator on LinkedIn](https://www.linkedin.com/company/product-manager-accelerator/)

## Submission checklist (from the assessment doc — for you, Adina)

- [ ] Push this repo to GitHub, set it **public** (or private + add
      `community@pmaccelerator.io` and `hr@pmaccelerator.io` as
      collaborators), and confirm clone/download is allowed.
- [ ] Record a 1–2 min screen-share demo walking through the code and the
      running app (both tracks), upload to Drive/YouTube/Vimeo, and paste
      the viewable link in the submission form.
- [ ] Fill out the submission Google form within 7 days (10 days for
      dual-role/full-stack).
- [ ] Double check the deployed/running app shows your name + the PM
      Accelerator blurb (already in the footer + API root/docs).
