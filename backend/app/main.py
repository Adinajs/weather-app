"""
FastAPI entrypoint.

Run with:
    uvicorn app.main:app --reload --port 8000

Interactive API docs at http://localhost:8000/docs
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models  # noqa: F401  (ensures models are registered before create_all)
from .routers import weather, records, integrations

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Weather App API",
    description=(
        "Built by Adina Saif Ullah for the PM Accelerator AI Engineer Intern "
        "technical assessment (Full Stack: Tech Assessment #1 + #2).\n\n"
        "About PM Accelerator: The Product Manager Accelerator Program is "
        "designed to support PM professionals through every stage of their "
        "career, from students to VP of Product. It offers 1:1 coaching, "
        "practical training, and real-world project experience to help "
        "members break into product management or level up. "
        "Learn more: https://www.linkedin.com/company/product-manager-accelerator/"
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only -- lock down for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router)
app.include_router(records.router)
app.include_router(integrations.router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "app": "Weather App API",
        "author": "Adina Saif Ullah",
        "docs": "/docs",
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}
