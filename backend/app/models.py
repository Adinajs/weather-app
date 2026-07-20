"""
ORM models.

WeatherRecord is the core CRUD entity required by Tech Assessment #2 (2.1):
a saved location + date range + the temperatures the API returned for that
range, so it can be created, read, updated, and deleted later.
"""
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, JSON
from sqlalchemy.sql import func
from .database import Base


class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)

    # What the user typed in (zip, city, "lat,lon", landmark, etc.)
    location_query = Column(String, nullable=False)

    # Resolved/canonical location info (from geocoding, used for fuzzy match)
    resolved_name = Column(String, nullable=False)
    country = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    # List of {"date": "...", "temp_max": .., "temp_min": .., "temp_unit": "C"}
    daily_temperatures = Column(JSON, nullable=False)

    notes = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
