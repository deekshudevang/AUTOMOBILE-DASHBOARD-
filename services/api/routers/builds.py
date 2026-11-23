"""
AutoVerse Platform — Saved Builds & Vehicle Customization API
Full persistent CRUD for customized vehicle configurations, component overrides, and paint/wheel settings.
"""

from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SavedBuild, VehicleProject, User, generate_uuid
from ..schemas import SavedBuildCreate, SavedBuildUpdate, SavedBuildResponse

router = APIRouter(tags=["Saved Builds"])


def get_default_user_id(db: Session) -> str:
    user = db.query(User).first()
    if not user:
        user = User(
            id="usr_student_default",
            email="student@autoverse.edu",
            username="student_engineer",
            hashed_password="mock_password_hash",
            role="STUDENT"
        )
        db.add(user)
        db.commit()
    return user.id


@router.get("/api/builds", response_model=List[SavedBuildResponse])
@router.get("/api/v1/builds", response_model=List[SavedBuildResponse])
def list_builds(
    project_id: Optional[str] = Query(None, description="Filter builds by Project ID"),
    vehicle_id: Optional[str] = Query(None, description="Filter builds by Vehicle ID/Slug"),
    db: Session = Depends(get_db)
):
    query = db.query(SavedBuild)
    if project_id:
        query = query.filter(SavedBuild.project_id == project_id)
    if vehicle_id:
        query = query.filter(SavedBuild.vehicle_id == vehicle_id)
    return query.order_by(SavedBuild.updated_at.desc()).all()


@router.post("/api/builds", response_model=SavedBuildResponse, status_code=status.HTTP_201_CREATED)
@router.post("/api/v1/builds", response_model=SavedBuildResponse, status_code=status.HTTP_201_CREATED)
def create_build(data: SavedBuildCreate, db: Session = Depends(get_db)):
    user_id = get_default_user_id(db)

    # If project_id provided, verify project exists
    if data.project_id:
        proj = db.query(VehicleProject).filter(VehicleProject.id == data.project_id).first()
        if not proj:
            raise HTTPException(status_code=404, detail=f"Project '{data.project_id}' not found")

    build = SavedBuild(
        user_id=user_id,
        project_id=data.project_id,
        vehicle_id=data.vehicle_id,
        name=data.name,
        base_vehicle_file=data.base_vehicle_file,
        base_model_hash=data.base_model_hash or 0,
        configuration_json=data.configuration_json or "{}",
        primary_color=data.primary_color,
        secondary_color=data.secondary_color,
        custom_primary_color=data.custom_primary_color,
        custom_secondary_color=data.custom_secondary_color,
        is_primary_color_custom=data.is_primary_color_custom or False,
        wheel_color=data.wheel_color,
        version=data.version or "2.0.0",
        config_version=data.config_version or 1,
        revision_id=data.revision_id
    )
    db.add(build)
    db.commit()
    db.refresh(build)
    return build


@router.get("/api/builds/{build_id}", response_model=SavedBuildResponse)
@router.get("/api/v1/builds/{build_id}", response_model=SavedBuildResponse)
def get_build(build_id: str, db: Session = Depends(get_db)):
    build = db.query(SavedBuild).filter(SavedBuild.id == build_id).first()
    if not build:
        raise HTTPException(status_code=404, detail=f"Build '{build_id}' not found")
    return build


@router.put("/api/builds/{build_id}", response_model=SavedBuildResponse)
@router.put("/api/v1/builds/{build_id}", response_model=SavedBuildResponse)
def update_build(build_id: str, data: SavedBuildUpdate, db: Session = Depends(get_db)):
    build = db.query(SavedBuild).filter(SavedBuild.id == build_id).first()
    if not build:
        raise HTTPException(status_code=404, detail=f"Build '{build_id}' not found")

    # Optimistic concurrency & version conflict detection
    if data.expected_version is not None and data.expected_version != build.config_version:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error": "CONFLICT",
                "message": f"Conflict detected: Provided version {data.expected_version} does not match server version {build.config_version}.",
                "server_version": build.config_version,
                "server_updated_at": build.updated_at.isoformat() if build.updated_at else None
            }
        )

    update_fields = data.model_dump(exclude_unset=True)
    update_fields.pop("expected_version", None)
    for field, val in update_fields.items():
        setattr(build, field, val)

    # Increment configuration version upon modification
    build.config_version = (build.config_version or 1) + 1
    build.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(build)
    return build


@router.delete("/api/builds/{build_id}")
@router.delete("/api/v1/builds/{build_id}")
def delete_build(build_id: str, db: Session = Depends(get_db)):
    build = db.query(SavedBuild).filter(SavedBuild.id == build_id).first()
    if not build:
        raise HTTPException(status_code=404, detail=f"Build '{build_id}' not found")

    db.delete(build)
    db.commit()
    return {"success": True, "deleted_id": build_id}


@router.post("/api/builds/{build_id}/duplicate", response_model=SavedBuildResponse, status_code=status.HTTP_201_CREATED)
@router.post("/api/v1/builds/{build_id}/duplicate", response_model=SavedBuildResponse, status_code=status.HTTP_201_CREATED)
def duplicate_build(build_id: str, db: Session = Depends(get_db)):
    original = db.query(SavedBuild).filter(SavedBuild.id == build_id).first()
    if not original:
        raise HTTPException(status_code=404, detail=f"Build '{build_id}' not found")

    duplicate = SavedBuild(
        user_id=original.user_id,
        project_id=original.project_id,
        vehicle_id=original.vehicle_id,
        name=f"{original.name} (Copy)",
        base_vehicle_file=original.base_vehicle_file,
        base_model_hash=original.base_model_hash,
        configuration_json=original.configuration_json,
        primary_color=original.primary_color,
        secondary_color=original.secondary_color,
        custom_primary_color=original.custom_primary_color,
        custom_secondary_color=original.custom_secondary_color,
        is_primary_color_custom=original.is_primary_color_custom,
        wheel_color=original.wheel_color,
        version=original.version,
        config_version=1,
        revision_id=original.revision_id
    )
    db.add(duplicate)
    db.commit()
    db.refresh(duplicate)
    return duplicate
