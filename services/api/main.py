"""
AutoVerse 3D — Complete Automotive Engineering, CAD & CFD Platform API
Production FastAPI Application.
Authoritative Backend for AutoVerse Phase 21.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .schemas import HealthResponse
from .routers import health, vehicles, components, projects, builds, cad, cfd, reports


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize relational database schemas on startup (including SavedBuild)
    init_db()
    yield


app = FastAPI(
    title="AutoVerse 3D Engineering Platform API",
    description="Integrated Automotive CAD, Parametric Assembly, CFD & Kinematics Platform",
    version="2.1.0",
    lifespan=lifespan
)

# Enable CORS for web UI and external API consumers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount Core Application Routers
app.include_router(health.router)
app.include_router(vehicles.router)
app.include_router(components.router)
app.include_router(projects.router)
app.include_router(builds.router)
app.include_router(cad.router)
app.include_router(cfd.router)
app.include_router(reports.router)


@app.get("/", response_model=HealthResponse)
def root():
    return HealthResponse(
        status="ONLINE",
        service="autoverse-api",
        version="2.1.0",
        timestamp=datetime.now(timezone.utc),
        active_mode="student",
        database_connected=True,
        details={"message": "AutoVerse Authoritative Backend API v2.1.0 active"}
    )
