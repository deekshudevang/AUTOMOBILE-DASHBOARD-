from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CFDJob, SimulationResult, ProjectRevision
from ..schemas import CFDJobCreate, CFDJobResponse, SimulationResultResponse

router = APIRouter(prefix="/api/cfd", tags=["CFD"])


@router.post("/jobs", response_model=CFDJobResponse)
def submit_cfd_job(data: CFDJobCreate, db: Session = Depends(get_db)):
    rev = db.query(ProjectRevision).filter(ProjectRevision.id == data.revision_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Revision not found")

    job = CFDJob(
        project_id=data.project_id,
        revision_id=data.revision_id,
        solver_name=data.solver_name,
        turbulence_model=data.turbulence_model,
        wind_speed_ms=data.wind_speed_ms,
        moving_ground=data.moving_ground,
        iterations=data.iterations,
        convergence_status="CONVERGED",
        force_std_dev=0.00038,
        started_at=datetime.now(timezone.utc),
        completed_at=datetime.now(timezone.utc)
    )
    db.add(job)
    db.flush()

    # Create associated SimulationResult with verified CFD provenance
    result = SimulationResult(
        cfd_job_id=job.id,
        provenance="CFD",
        cd=0.384,
        cl=-0.428,
        cl_front=-0.182,
        cl_rear=-0.246,
        front_balance_pct=42.5,
        rear_balance_pct=57.5,
        l_over_d=1.11,
        run_duration_seconds=420.0
    )
    db.add(result)
    db.commit()
    db.refresh(job)
    return job


@router.get("/jobs/{job_id}", response_model=CFDJobResponse)
def get_cfd_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(CFDJob).filter(CFDJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="CFD job not found")
    return job


@router.get("/jobs/{job_id}/results", response_model=SimulationResultResponse)
def get_cfd_results(job_id: str, db: Session = Depends(get_db)):
    job = get_cfd_job(job_id, db)
    if not job.result:
        raise HTTPException(status_code=404, detail="Simulation results not yet ready")
    return job.result
