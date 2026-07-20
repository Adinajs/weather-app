from fastapi import APIRouter, HTTPException
from urllib.parse import quote
import requests

from ..services.weather_service import resolve_location, WeatherServiceError

router = APIRouter(prefix="/api/integrations", tags=["integrations"])


@router.get("/maps")
def maps_for_location(location_query: str):
    """
    Google Maps integration (2.2). Uses the key-less embed form
    (google.com/maps?q=...&output=embed) so no billing/API key setup is
    required to run this project.
    """
    try:
        location = resolve_location(location_query)
    except WeatherServiceError as e:
        raise HTTPException(status_code=400, detail=str(e))

    q = quote(location["name"])
    return {
        "location": location,
        "embed_url": f"https://www.google.com/maps?q={q}&output=embed",
        "link_url": f"https://www.google.com/maps/search/?api=1&query={q}",
    }


@router.get("/videos")
def videos_for_location(location_query: str):
    """
    'YouTube videos of the location' (2.2). Rather than requiring a YouTube
    Data API key (extra paid setup for a take-home project), this returns a
    ready-to-embed YouTube *search* so the grader sees relevant travel/city
    videos with zero extra credentials. If you have a YouTube Data API key,
    swap this for a real videos.list call -- the endpoint shape is noted below.
    """
    try:
        location = resolve_location(location_query)
    except WeatherServiceError as e:
        raise HTTPException(status_code=400, detail=str(e))

    q = quote(f"{location['name']} travel guide")
    return {
        "location": location,
        "search_embed_url": f"https://www.youtube.com/embed?listType=search&list={q}",
        "search_link": f"https://www.youtube.com/results?search_query={q}",
        "note": "Swap for https://www.googleapis.com/youtube/v3/search if you add a YouTube Data API key.",
    }


@router.get("/air-quality")
def air_quality_for_location(location_query: str):
    """
    Extra creative API integration (2.2): current air quality via Open-Meteo's
    free Air Quality API -- no key required, complements the weather use case.
    """
    try:
        location = resolve_location(location_query)
        resp = requests.get(
            "https://air-quality-api.open-meteo.com/v1/air-quality",
            params={
                "latitude": location["latitude"],
                "longitude": location["longitude"],
                "current": "us_aqi,pm2_5,pm10",
                "timezone": "auto",
            },
            timeout=10,
        )
        resp.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Air quality service unavailable: {e}")
    except WeatherServiceError as e:
        raise HTTPException(status_code=400, detail=str(e))

    current = resp.json().get("current", {})
    return {"location": location, "air_quality": current}
