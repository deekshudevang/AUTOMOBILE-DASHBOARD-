from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CADJob, ProjectRevision, GeometryArtifact
from ..schemas import CADJobCreate, CADJobResponse

router = APIRouter(prefix="/api/cad", tags=["CAD"])


@router.post("/jobs", response_model=CADJobResponse)
def submit_cad_job(data: CADJobCreate, db: Session = Depends(get_db)):
    rev = db.query(ProjectRevision).filter(ProjectRevision.id == data.revision_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Revision not found")

    job = CADJob(
        project_id=data.project_id,
        revision_id=data.revision_id,
        status="COMPLETED",
        started_at=datetime.now(timezone.utc),
        completed_at=datetime.now(timezone.utc)
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/jobs/{job_id}", response_model=CADJobResponse)
def get_cad_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(CADJob).filter(CADJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="CAD job not found")
    return job
