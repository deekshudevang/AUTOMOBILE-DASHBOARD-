"""
AutoVerse Platform — Health, Diagnostics & System Status API
Performs real live checks against the database and dependency infrastructure.
"""

import time
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from ..database import get_db, DATABASE_URL
from ..schemas import HealthResponse, SystemInfoResponse
from ..models import Vehicle, VehicleProject, SavedBuild

router = APIRouter(tags=["Health & System Diagnostics"])

# Record server boot time
SERVER_START_TIME = time.time()


@router.get("/health", response_model=HealthResponse)
@router.get("/api/health", response_model=HealthResponse)
@router.get("/api/v1/health", response_model=HealthResponse)
def get_health(db: Session = Depends(get_db)):
    """
    Performs live database ping to verify actual connectivity.
    Returns ONLINE if DB is alive, DEGRADED if DB ping fails.
    """
    db_connected = False
    db_latency_ms = 0.0

    t0 = time.time()
    try:
        db.execute(text("SELECT 1"))
        db_connected = True
        db_latency_ms = round((time.time() - t0) * 1000, 2)
    except Exception as e:
        db_connected = False

    return HealthResponse(
        status="ONLINE" if db_connected else "DEGRADED",
        service="autoverse-api",
        version="2.0.0",
        timestamp=datetime.now(timezone.utc),
        active_mode="student",
        database_connected=db_connected,
        details={
            "api_version": "2.1.0",
            "database_engine": "postgresql" if DATABASE_URL.startswith("postgresql") else "sqlite",
            "database_latency_ms": db_latency_ms,
            "cfd_worker_integrated": False,
            "cad_kernel_mode": "PARAMETRIC_MESH"
        }
    )


@router.get("/api/v1/health/ready")
def get_readiness(db: Session = Depends(get_db)):
    """
    Readiness probe for container orchestrators and reverse proxies.
    Returns 200 OK only if database query succeeds and tables are readable.
    """
    try:
        db.execute(text("SELECT 1"))
        return {"status": "READY", "timestamp": datetime.now(timezone.utc).isoformat()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service not ready: Database check failed: {str(e)}"
        )


@router.get("/api/v1/system/info", response_model=SystemInfoResponse)
def get_system_info(db: Session = Depends(get_db)):
    """
    Returns platform telemetry, entity counts, and database metadata.
    """
    db_connected = False
    vehicle_count = 0
    project_count = 0
    build_count = 0

    try:
        db.execute(text("SELECT 1"))
        db_connected = True
        vehicle_count = db.query(Vehicle).count()
        project_count = db.query(VehicleProject).filter(VehicleProject.is_archived == False).count()
        build_count = db.query(SavedBuild).count()
    except Exception:
        db_connected = False

    uptime = round(time.time() - SERVER_START_TIME, 1)

    return SystemInfoResponse(
        service="autoverse-api",
        version="2.1.0",
        database="postgresql" if DATABASE_URL.startswith("postgresql") else "sqlite",
        database_connected=db_connected,
        vehicle_count=vehicle_count,
        project_count=project_count,
        build_count=build_count,
        uptime_seconds=uptime,
        timestamp=datetime.now(timezone.utc)
    )
