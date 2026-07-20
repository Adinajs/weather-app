from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.weather_service import resolve_location, get_temperatures_for_range, WeatherServiceError
from ..services.export_service import EXPORTERS

router = APIRouter(prefix="/api/records", tags=["records"])


def _record_to_dict(rec: models.WeatherRecord):
    return {
        "id": rec.id,
        "location_query": rec.location_query,
        "resolved_name": rec.resolved_name,
        "country": rec.country,
        "latitude": rec.latitude,
        "longitude": rec.longitude,
        "start_date": rec.start_date,
        "end_date": rec.end_date,
        "daily_temperatures": rec.daily_temperatures,
        "notes": rec.notes,
    }


@router.post("", response_model=schemas.WeatherRecordOut, status_code=201)
def create_record(payload: schemas.WeatherRecordCreate, db: Session = Depends(get_db)):
    """CREATE (2.1): validates location + date range, fetches temps, persists."""
    try:
        location = resolve_location(payload.location_query)
        temps = get_temperatures_for_range(location["latitude"], location["longitude"],
                                            payload.start_date, payload.end_date)
    except WeatherServiceError as e:
        raise HTTPException(status_code=400, detail=str(e))

    rec = models.WeatherRecord(
        location_query=payload.location_query,
        resolved_name=location["name"],
        country=location["country"],
        latitude=location["latitude"],
        longitude=location["longitude"],
        start_date=payload.start_date,
        end_date=payload.end_date,
        daily_temperatures=temps,
        notes=payload.notes,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


@router.get("", response_model=list[schemas.WeatherRecordOut])
def list_records(db: Session = Depends(get_db)):
    """READ (2.1): all records -- no row-level security per assessment spec."""
    return db.query(models.WeatherRecord).order_by(models.WeatherRecord.id.desc()).all()


@router.get("/{record_id}", response_model=schemas.WeatherRecordOut)
def get_record(record_id: int, db: Session = Depends(get_db)):
    rec = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")
    return rec


@router.put("/{record_id}", response_model=schemas.WeatherRecordOut)
def update_record(record_id: int, payload: schemas.WeatherRecordUpdate, db: Session = Depends(get_db)):
    """UPDATE (2.1): partial update; optionally re-fetches temps if location/dates change."""
    rec = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")

    new_start = payload.start_date or rec.start_date
    new_end = payload.end_date or rec.end_date
    if new_end < new_start:
        raise HTTPException(status_code=400, detail="end_date must be on or after start_date")

    location_changed = payload.location_query is not None and payload.location_query != rec.location_query
    dates_changed = new_start != rec.start_date or new_end != rec.end_date

    if payload.location_query is not None:
        try:
            location = resolve_location(payload.location_query)
        except WeatherServiceError as e:
            raise HTTPException(status_code=400, detail=str(e))
        rec.location_query = payload.location_query
        rec.resolved_name = location["name"]
        rec.country = location["country"]
        rec.latitude = location["latitude"]
        rec.longitude = location["longitude"]

    rec.start_date = new_start
    rec.end_date = new_end
    if payload.notes is not None:
        rec.notes = payload.notes

    if payload.refetch and (location_changed or dates_changed):
        try:
            rec.daily_temperatures = get_temperatures_for_range(
                rec.latitude, rec.longitude, rec.start_date, rec.end_date
            )
        except WeatherServiceError as e:
            raise HTTPException(status_code=400, detail=str(e))

    db.commit()
    db.refresh(rec)
    return rec


@router.delete("/{record_id}", status_code=204)
def delete_record(record_id: int, db: Session = Depends(get_db)):
    """DELETE (2.1)."""
    rec = db.query(models.WeatherRecord).filter(models.WeatherRecord.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(rec)
    db.commit()
    return Response(status_code=204)


@router.get("/export/{fmt}")
def export_records(fmt: str, db: Session = Depends(get_db)):
    """Data export (2.3): json | csv | xml | markdown | pdf."""
    fmt = fmt.lower()
    if fmt not in EXPORTERS:
        raise HTTPException(status_code=400,
                             detail=f"Unsupported format '{fmt}'. Choose from: {list(EXPORTERS)}")

    records = [_record_to_dict(r) for r in db.query(models.WeatherRecord).all()]
    exporter, media_type, ext = EXPORTERS[fmt]
    content = exporter(records)
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="weather_records.{ext}"'},
    )
