"""
AutoVerse Platform — Vehicle Catalog & Engineering Specification API
Supports search, manufacturer and category filtering, specifications, and component hierarchy inspection.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Vehicle, VehicleSpecification, VehicleComponent, ComponentMount
from ..schemas import VehicleResponse, VehicleSpecificationResponse, ComponentResponse

router = APIRouter(tags=["Vehicles"])


def ensure_seed_vehicles(db: Session):
    """Seed certified vehicle baselines if table is empty."""
    if db.query(Vehicle).count() > 0:
        return

    vehicles_to_seed = [
        {
            "id": "veh_porsche_911_gt3rs",
            "slug": "porsche-911-gt3-rs-992",
            "display_name": "Porsche 911 GT3 RS (992, 2022)",
            "manufacturer": "Porsche",
            "model_hash": 706080074,
            "model_code": "comet_gt3rs",
            "category": "Supercar",
            "quality_class": "CLASS_A_VERIFIED",
            "specs": {
                "length_m": 4.572,
                "width_m": 1.900,
                "height_m": 1.322,
                "wheelbase_m": 2.457,
                "front_track_m": 1.630,
                "rear_track_m": 1.600,
                "ground_clearance_m": 0.105,
                "curb_weight_kg": 1450.0,
                "engine_layout": "REAR_LONGITUDINAL",
                "horsepower_hp": 525,
                "top_speed_kmh": 296.0,
                "cd_claimed": 0.384,
                "frontal_area_m2": 2.15
            }
        },
        {
            "id": "veh_bmw_m4_gt3",
            "slug": "bmw-m4-gt3-g82",
            "display_name": "BMW M4 GT3 (G82, 2022)",
            "manufacturer": "BMW",
            "model_hash": 3994326574,
            "model_code": "sentinel_m4gt3",
            "category": "GT3 Racecar",
            "quality_class": "CLASS_A_VERIFIED",
            "specs": {
                "length_m": 5.020,
                "width_m": 2.040,
                "height_m": 1.308,
                "wheelbase_m": 2.917,
                "front_track_m": 1.731,
                "rear_track_m": 1.711,
                "ground_clearance_m": 0.080,
                "curb_weight_kg": 1260.0,
                "engine_layout": "FRONT_MID_LONGITUDINAL",
                "horsepower_hp": 590,
                "top_speed_kmh": 285.0,
                "cd_claimed": 0.420,
                "frontal_area_m2": 2.22
            }
        },
        {
            "id": "veh_ahmed_body_benchmark",
            "slug": "ahmed-body-sae840300",
            "display_name": "Ahmed Body Validation Benchmark (SAE 840300)",
            "manufacturer": "SAE / Benchmark",
            "model_hash": 840300,
            "model_code": "ahmed_body_25deg",
            "category": "CFD Benchmark",
            "quality_class": "CLASS_A_VERIFIED",
            "specs": {
                "length_m": 1.044,
                "width_m": 0.389,
                "height_m": 0.288,
                "wheelbase_m": 0.800,
                "front_track_m": 0.389,
                "rear_track_m": 0.389,
                "ground_clearance_m": 0.050,
                "curb_weight_kg": 30.0,
                "engine_layout": "NONE",
                "horsepower_hp": 0,
                "top_speed_kmh": 216.0,
                "cd_claimed": 0.285,
                "frontal_area_m2": 0.112
            }
        }
    ]

    for item in vehicles_to_seed:
        specs_data = item.pop("specs")
        v = Vehicle(**item)
        db.add(v)
        db.flush()
        spec = VehicleSpecification(vehicle_id=v.id, **specs_data)
        db.add(spec)

    db.commit()


@router.get("/api/vehicles", response_model=List[VehicleResponse])
@router.get("/api/v1/vehicles", response_model=List[VehicleResponse])
def list_vehicles(
    q: Optional[str] = Query(None, description="Search term for display name or model code"),
    category: Optional[str] = Query(None, description="Filter by vehicle category"),
    manufacturer: Optional[str] = Query(None, description="Filter by manufacturer brand"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    ensure_seed_vehicles(db)
    query = db.query(Vehicle)

    if q:
        query = query.filter(
            Vehicle.display_name.ilike(f"%{q}%") |
            Vehicle.manufacturer.ilike(f"%{q}%") |
            Vehicle.model_code.ilike(f"%{q}%")
        )
    if category:
        query = query.filter(Vehicle.category.ilike(f"%{category}%"))
    if manufacturer:
        query = query.filter(Vehicle.manufacturer.ilike(f"%{manufacturer}%"))

    return query.offset(skip).limit(limit).all()


@router.get("/api/vehicles/{vehicle_id}", response_model=VehicleResponse)
@router.get("/api/v1/vehicles/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: str, db: Session = Depends(get_db)):
    ensure_seed_vehicles(db)
    query = db.query(Vehicle).filter(
        (Vehicle.id == vehicle_id) |
        (Vehicle.slug == vehicle_id)
    )
    if vehicle_id.isdigit():
        query = db.query(Vehicle).filter(Vehicle.model_hash == int(vehicle_id))

    vehicle = query.first()
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle '{vehicle_id}' not found")
    return vehicle


@router.get("/api/vehicles/{vehicle_id}/specification", response_model=VehicleSpecificationResponse)
@router.get("/api/v1/vehicles/{vehicle_id}/specification", response_model=VehicleSpecificationResponse)
def get_vehicle_specification(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = get_vehicle(vehicle_id, db)
    if not vehicle.specification:
        raise HTTPException(status_code=404, detail=f"Vehicle '{vehicle_id}' specifications not found")
    return vehicle.specification


@router.get("/api/vehicles/{vehicle_id}/components", response_model=List[ComponentResponse])
@router.get("/api/v1/vehicles/{vehicle_id}/components", response_model=List[ComponentResponse])
def get_vehicle_components(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = get_vehicle(vehicle_id, db)
    return vehicle.components
