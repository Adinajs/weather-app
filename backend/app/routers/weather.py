from fastapi import APIRouter, HTTPException
from ..schemas import CurrentWeatherRequest
from ..services.weather_service import resolve_location, get_current_and_forecast, WeatherServiceError

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.post("/current")
def current_weather(payload: CurrentWeatherRequest):
    """
    Current conditions + 5-day forecast for a location.
    Accepts either a free-text location_query OR explicit latitude/longitude
    (used by the frontend's "use my current location" button).
    """
    try:
        location = resolve_location(payload.location_query, payload.latitude, payload.longitude)
        weather = get_current_and_forecast(location["latitude"], location["longitude"])
    except WeatherServiceError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"location": location, **weather}
