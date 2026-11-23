"""
AutoVerse Platform — Project Management & Revision DAG API
Handles project lifecycle, branch forks, immutable snapshot revisions, and revision restoration.
"""

import hashlib
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import VehicleProject, ProjectRevision, User, Vehicle, SavedBuild, generate_uuid
from ..schemas import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    RevisionCreate,
    RevisionResponse,
    SavedBuildCreate,
    SavedBuildResponse
)

router = APIRouter(tags=["Projects & Revisions"])


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


def get_or_create_default_vehicle(db: Session) -> Vehicle:
    veh = db.query(Vehicle).first()
    if veh:
        return veh
    veh = Vehicle(
        id="veh_porsche_911_gt3rs",
        slug="porsche-911-gt3-rs-992",
        display_name="Porsche 911 GT3 RS (992, 2022)",
        manufacturer="Porsche",
        model_hash=706080074,
        model_code="comet_gt3rs",
        category="Supercar",
        quality_class="CLASS_A_VERIFIED"
    )
    db.add(veh)
    db.commit()
    db.refresh(veh)
    return veh


# --- Project CRUD ---

@router.get("/api/projects", response_model=List[ProjectResponse])
@router.get("/api/v1/projects", response_model=List[ProjectResponse])
def list_projects(include_archived: bool = False, db: Session = Depends(get_db)):
    query = db.query(VehicleProject)
    if not include_archived:
        query = query.filter(VehicleProject.is_archived == False)
    return query.order_by(VehicleProject.updated_at.desc()).all()


@router.post("/api/projects", response_model=ProjectResponse)
@router.post("/api/v1/projects", response_model=ProjectResponse)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    # Find or fallback base vehicle
    base_vehicle_id = data.base_vehicle_id
    vehicle = db.query(Vehicle).filter(
        (Vehicle.id == base_vehicle_id) | (Vehicle.slug == base_vehicle_id)
    ).first()

    if not vehicle:
        vehicle = get_or_create_default_vehicle(db)
        base_vehicle_id = vehicle.id

    user_id = get_default_user_id(db)

    project = VehicleProject(
        name=data.name,
        user_id=user_id,
        base_vehicle_id=base_vehicle_id,
        description=data.description or "",
        active_branch=data.active_branch
    )
    db.add(project)
    db.flush()

    # Create root initial revision
    root_hash = hashlib.sha256(f"{project.id}_initial_{datetime.now(timezone.utc).isoformat()}".encode()).hexdigest()[:8]
    initial_rev = ProjectRevision(
        project_id=project.id,
        revision_hash=root_hash,
        parent_revision_hash=None,
        commit_message="Initial project baseline fork",
        author_name="Student Engineer",
        geometry_digest=hashlib.sha256(b"initial_geometry").hexdigest(),
        is_manifold=True,
        serialized_bundle=f'{{"projectId": "{project.id}", "baseline": "{vehicle.display_name}"}}',
        configuration_json="{}"
    )
    db.add(initial_rev)
    db.commit()
    db.refresh(project)
    return project


@router.get("/api/projects/{project_id}", response_model=ProjectResponse)
@router.get("/api/v1/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(VehicleProject).filter(VehicleProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")
    return project


@router.put("/api/projects/{project_id}", response_model=ProjectResponse)
@router.put("/api/v1/projects/{project_id}", response_model=ProjectResponse)
def update_project(project_id: str, data: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(VehicleProject).filter(VehicleProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")

    update_fields = data.model_dump(exclude_unset=True)
    for field, val in update_fields.items():
        setattr(project, field, val)

    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/api/projects/{project_id}")
@router.delete("/api/v1/projects/{project_id}")
def delete_project(project_id: str, hard_delete: bool = False, db: Session = Depends(get_db)):
    project = db.query(VehicleProject).filter(VehicleProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")

    if hard_delete:
        db.delete(project)
    else:
        project.is_archived = True
        project.updated_at = datetime.now(timezone.utc)

    db.commit()
    return {"success": True, "deleted_id": project_id, "hard_deleted": hard_delete}


# --- Project Revisions ---

@router.get("/api/projects/{project_id}/revisions", response_model=List[RevisionResponse])
@router.get("/api/v1/projects/{project_id}/revisions", response_model=List[RevisionResponse])
def list_revisions(project_id: str, db: Session = Depends(get_db)):
    project = get_project(project_id, db)
    return project.revisions


@router.post("/api/projects/{project_id}/revisions", response_model=RevisionResponse)
@router.post("/api/v1/projects/{project_id}/revisions", response_model=RevisionResponse)
def create_revision(project_id: str, data: RevisionCreate, db: Session = Depends(get_db)):
    project = get_project(project_id, db)

    # Calculate deterministic revision hash
    rev_hash = hashlib.sha256(
        f"{project_id}_{data.geometry_digest}_{datetime.now(timezone.utc).isoformat()}".encode()
    ).hexdigest()[:8]

    # Append immutable revision
    rev = ProjectRevision(
        project_id=project.id,
        revision_hash=rev_hash,
        parent_revision_hash=data.parent_revision_hash,
        commit_message=data.commit_message,
        author_name=data.author_name,
        geometry_digest=data.geometry_digest,
        is_manifold=data.is_manifold,
        serialized_bundle=data.serialized_bundle,
        configuration_json=data.configuration_json
    )
    db.add(rev)
    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(rev)
    return rev


@router.get("/api/revisions/{revision_id}", response_model=RevisionResponse)
@router.get("/api/v1/revisions/{revision_id}", response_model=RevisionResponse)
def get_revision(revision_id: str, db: Session = Depends(get_db)):
    rev = db.query(ProjectRevision).filter(
        (ProjectRevision.id == revision_id) | (ProjectRevision.revision_hash == revision_id)
    ).first()
    if not rev:
        raise HTTPException(status_code=404, detail=f"Revision '{revision_id}' not found")
    return rev


@router.post("/api/revisions/{revision_id}/restore", response_model=RevisionResponse)
@router.post("/api/v1/revisions/{revision_id}/restore", response_model=RevisionResponse)
def restore_revision(revision_id: str, db: Session = Depends(get_db)):
    target_rev = get_revision(revision_id, db)
    project = target_rev.project

    # Create a new revision that restores the target snapshot
    new_hash = hashlib.sha256(
        f"{project.id}_restore_{target_rev.revision_hash}_{datetime.now(timezone.utc).isoformat()}".encode()
    ).hexdigest()[:8]

    restored_rev = ProjectRevision(
        project_id=project.id,
        revision_hash=new_hash,
        parent_revision_hash=target_rev.revision_hash,
        commit_message=f"Restored project snapshot from #{target_rev.revision_hash}: {target_rev.commit_message}",
        author_name="Student Engineer (Restore)",
        geometry_digest=target_rev.geometry_digest,
        is_manifold=target_rev.is_manifold,
        serialized_bundle=target_rev.serialized_bundle,
        configuration_json=target_rev.configuration_json
    )
    db.add(restored_rev)
    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(restored_rev)
    return restored_rev


# --- Nested Builds in Project ---

@router.get("/api/projects/{project_id}/builds", response_model=List[SavedBuildResponse])
@router.get("/api/v1/projects/{project_id}/builds", response_model=List[SavedBuildResponse])
def list_project_builds(project_id: str, db: Session = Depends(get_db)):
    project = get_project(project_id, db)
    return project.builds


@router.post("/api/projects/{project_id}/builds", response_model=SavedBuildResponse, status_code=status.HTTP_201_CREATED)
@router.post("/api/v1/projects/{project_id}/builds", response_model=SavedBuildResponse, status_code=status.HTTP_201_CREATED)
def create_project_build(project_id: str, data: SavedBuildCreate, db: Session = Depends(get_db)):
    project = get_project(project_id, db)
    user_id = get_default_user_id(db)

    build = SavedBuild(
        user_id=user_id,
        project_id=project.id,
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
        version=data.version or "2.0.0"
    )
    db.add(build)
    db.commit()
    db.refresh(build)
    return build
