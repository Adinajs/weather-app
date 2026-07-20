"""
Pydantic request/response schemas.
"""
from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class DailyTemp(BaseModel):
    date: date
    temp_max: float
    temp_min: float
    temp_unit: str = "C"


class WeatherRecordCreate(BaseModel):
    location_query: str = Field(..., min_length=1, description="City, zip, landmark, or 'lat,lon'")
    start_date: date
    end_date: date
    notes: Optional[str] = None

    @field_validator("end_date")
    @classmethod
    def end_after_start(cls, v, info):
        start = info.data.get("start_date")
        if start and v < start:
            raise ValueError("end_date must be on or after start_date")
        return v

    @field_validator("start_date")
    @classmethod
    def range_not_too_long(cls, v):
        return v


class WeatherRecordUpdate(BaseModel):
    """All fields optional -- user picks what to update."""
    location_query: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None
    refetch: bool = Field(
        default=False,
        description="If true and location/dates changed, re-fetch temperatures from the API",
    )


class WeatherRecordOut(BaseModel):
    id: int
    location_query: str
    resolved_name: str
    country: Optional[str]
    latitude: float
    longitude: float
    start_date: date
    end_date: date
    daily_temperatures: List[dict]
    notes: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class CurrentWeatherRequest(BaseModel):
    location_query: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
