import hashlib
from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import VehicleProject, ProjectRevision, User, Vehicle, generate_uuid
from ..schemas import ProjectCreate, ProjectResponse, RevisionCreate, RevisionResponse

router = APIRouter(prefix="/api/projects", tags=["Projects"])


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


@router.get("", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return db.query(VehicleProject).filter(VehicleProject.is_archived == False).all()


@router.post("", response_model=ProjectResponse)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    # Verify base vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == data.base_vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Base vehicle not found")

    user_id = get_default_user_id(db)

    project = VehicleProject(
        name=data.name,
        user_id=user_id,
        base_vehicle_id=data.base_vehicle_id,
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
        is_manifold=True
    )
    db.add(initial_rev)
    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(VehicleProject).filter(VehicleProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/{project_id}/revisions", response_model=List[RevisionResponse])
def list_revisions(project_id: str, db: Session = Depends(get_db)):
    project = get_project(project_id, db)
    return project.revisions


@router.post("/{project_id}/revisions", response_model=RevisionResponse)
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
        is_manifold=data.is_manifold
    )
    db.add(rev)
    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(rev)
    return rev
