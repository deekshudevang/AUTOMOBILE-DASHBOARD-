from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report, ProjectRevision
from ..schemas import ReportCreate, ReportResponse

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.post("", response_model=ReportResponse)
def create_report(data: ReportCreate, db: Session = Depends(get_db)):
    rev = db.query(ProjectRevision).filter(ProjectRevision.id == data.revision_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Revision not found")

    rep = Report(
        project_id=data.project_id,
        revision_id=data.revision_id,
        title=data.title,
        report_type=data.report_type,
        format="MARKDOWN",
        content_markdown=data.content_markdown
    )
    db.add(rep)
    db.commit()
    db.refresh(rep)
    return rep


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: str, db: Session = Depends(get_db)):
    rep = db.query(Report).filter(Report.id == report_id).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")
    return rep


@router.get("/project/{project_id}", response_model=List[ReportResponse])
def list_project_reports(project_id: str, db: Session = Depends(get_db)):
    return db.query(Report).filter(Report.project_id == project_id).all()
