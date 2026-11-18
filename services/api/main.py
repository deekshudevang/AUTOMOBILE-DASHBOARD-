"""
AutoVerse 3D — Complete Automotive Engineering, CAD & CFD Platform API
Production FastAPI Application.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .schemas import HealthResponse
from .routers import vehicles, components, projects, cad, cfd, reports


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize relational database schemas on startup
    init_db()
    yield


app = FastAPI(
    title="AutoVerse 3D Engineering Platform API",
    description="Integrated Automotive CAD, Parametric Assembly, CFD & Kinematics Platform",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for student web UI and external API consumers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount Routers
app.include_router(vehicles.router)
app.include_router(components.router)
app.include_router(projects.router)
app.include_router(cad.router)
app.include_router(cfd.router)
app.include_router(reports.router)


@app.get("/", response_model=HealthResponse)
@app.get("/api/health", response_model=HealthResponse)
def healthcheck():
    return HealthResponse(
        status="ONLINE",
        service="autoverse-api",
        version="2.0.0",
        timestamp=datetime.now(timezone.utc),
        active_mode="student"
    )
