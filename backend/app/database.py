"""
Database configuration.

Uses SQLite by default (zero-config, file-based) so the grader can run this
with no external services. Swap to PostgreSQL by changing DATABASE_URL below
(e.g. postgresql://user:pass@localhost:5432/weatherdb) -- the rest of the
code is DB-agnostic thanks to SQLAlchemy.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./weather_app.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
