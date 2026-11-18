from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import VehicleComponent, ComponentMount, ComponentCategory, ComponentCompatibility, Vehicle
from ..schemas import ComponentResponse

router = APIRouter(prefix="/api/components", tags=["Components"])


def ensure_seed_components(db: Session):
    """Seed certified components if table is empty."""
    if db.query(VehicleComponent).count() > 0:
        return

    # Seed categories
    cats = [
        {"slug": "aero", "name": "Aerodynamics", "icon_name": "Wind", "sort_order": 1},
        {"slug": "body", "name": "Body Panels", "icon_name": "Box", "sort_order": 2},
        {"slug": "wheels", "name": "Wheels & Tyres", "icon_name": "Circle", "sort_order": 3},
        {"slug": "suspension", "name": "Suspension & Kinematics", "icon_name": "Activity", "sort_order": 4},
        {"slug": "chassis", "name": "Chassis & Monocoque", "icon_name": "Shield", "sort_order": 5}
    ]
    for c in cats:
        db.add(ComponentCategory(**c))
    db.flush()

    # Get seed vehicle id
    porsche = db.query(Vehicle).filter(Vehicle.slug == "porsche-911-gt3-rs-992").first()
    v_id = porsche.id if porsche else "veh_porsche_911_gt3rs"

    components_to_seed = [
        {
            "id": "comp_splitter_gt3rs",
            "vehicle_id": v_id,
            "component_name": "Front Carbon Splitter with Dual Endplates",
            "category": "Aero",
            "editability": "PARAMETRIC",
            "slot_key": "front_splitter",
            "mass_kg": 4.8,
            "position_x": 2.1,
            "position_y": 0.0,
            "position_z": 0.12,
            "mounts": [
                {"mount_datum_name": "datum_front_bumper_mount", "x": 2.05, "y": 0.0, "z": 0.12, "tolerance_mm": 1.0}
            ]
        },
        {
            "id": "comp_rear_wing_gt3rs",
            "vehicle_id": v_id,
            "component_name": "Active Swan-Neck Dual-Element Rear Wing",
            "category": "Aero",
            "editability": "PARAMETRIC",
            "slot_key": "rear_wing",
            "mass_kg": 7.2,
            "position_x": -2.1,
            "position_y": 0.0,
            "position_z": 1.15,
            "mounts": [
                {"mount_datum_name": "datum_rear_deck_mount", "x": -1.95, "y": 0.0, "z": 0.95, "tolerance_mm": 0.5}
            ]
        },
        {
            "id": "comp_wheel_fl_gt3rs",
            "vehicle_id": v_id,
            "component_name": "Forged Monoblock Center-Lock 20in Wheel (FL)",
            "category": "Wheels",
            "editability": "PARAMETRIC",
            "slot_key": "wheel_fl",
            "mass_kg": 8.9,
            "position_x": 1.228,
            "position_y": 0.815,
            "position_z": 0.350,
            "mounts": [
                {"mount_datum_name": "datum_hub_fl", "x": 1.228, "y": 0.815, "z": 0.350, "tolerance_mm": 0.1}
            ]
        }
    ]

    for item in components_to_seed:
        mounts_data = item.pop("mounts")
        comp = VehicleComponent(**item)
        db.add(comp)
        db.flush()
        for m in mounts_data:
            db.add(ComponentMount(component_id=comp.id, **m))

    db.commit()


@router.get("", response_model=List[ComponentResponse])
def list_components(
    category: Optional[str] = None,
    editability: Optional[str] = None,
    db: Session = Depends(get_db)
):
    ensure_seed_components(db)
    query = db.query(VehicleComponent)
    if category:
        query = query.filter(VehicleComponent.category.ilike(category))
    if editability:
        query = query.filter(VehicleComponent.editability == editability.upper())
    return query.all()


@router.get("/{component_id}", response_model=ComponentResponse)
def get_component(component_id: str, db: Session = Depends(get_db)):
    ensure_seed_components(db)
    comp = db.query(VehicleComponent).filter(VehicleComponent.id == component_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Component not found")
    return comp
