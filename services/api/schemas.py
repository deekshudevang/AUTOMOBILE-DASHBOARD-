"""
AutoVerse Platform — Pydantic Schemas (V2)
Input validation, serialization models, and contract definitions.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


# Health Check
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: datetime
    active_mode: str = "student"


# Vehicle Schemas
class VehicleSpecificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    length_m: float
    width_m: float
    height_m: float
    wheelbase_m: float
    front_track_m: float
    rear_track_m: float
    ground_clearance_m: float
    curb_weight_kg: float
    engine_layout: str
    horsepower_hp: int
    top_speed_kmh: float
    cd_claimed: float
    frontal_area_m2: float


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    slug: str
    display_name: str
    manufacturer: str
    model_hash: int
    model_code: str
    category: str
    quality_class: str
    specification: Optional[VehicleSpecificationResponse] = None


# Component Schemas
class ComponentMountResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    mount_datum_name: str
    x: float
    y: float
    z: float
    normal_x: float
    normal_y: float
    normal_z: float
    tolerance_mm: float


class ComponentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    vehicle_id: str
    component_name: str
    category: str
    editability: str
    slot_key: str
    mass_kg: float
    is_default: bool
    position_x: float
    position_y: float
    position_z: float
    mounts: List[ComponentMountResponse] = []


# Project & Revision Schemas
class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    base_vehicle_id: str
    description: Optional[str] = ""
    active_branch: str = "main"


class RevisionCreate(BaseModel):
    commit_message: str = Field(..., min_length=3, max_length=300)
    author_name: str = "Student Engineer"
    geometry_digest: str
    is_manifold: bool = True
    parent_revision_hash: Optional[str] = None


class RevisionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    revision_hash: str
    parent_revision_hash: Optional[str] = None
    commit_message: str
    author_name: str
    geometry_digest: str
    is_manifold: bool
    created_at: datetime


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str
    base_vehicle_id: str
    active_branch: str
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    revisions: List[RevisionResponse] = []


# CAD & Mesh Schemas
class CADJobCreate(BaseModel):
    project_id: str
    revision_id: str
    operation: str = "REGENERATE_BREP"


class CADJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    revision_id: str
    status: str
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class MeshJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    revision_id: str
    mesh_type: str
    target_y_plus: float
    cell_count: int
    orthogonal_quality_min: float
    skewness_max: float
    status: str


# CFD & Simulation Result Schemas
class CFDJobCreate(BaseModel):
    project_id: str
    revision_id: str
    solver_name: str = "simpleFoam (OpenFOAM v2406)"
    turbulence_model: str = "kOmegaSST"
    wind_speed_ms: float = 30.0
    moving_ground: bool = True
    iterations: int = 500


class SimulationResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    cfd_job_id: str
    provenance: str
    cd: float
    cl: float
    cl_front: float
    cl_rear: float
    front_balance_pct: float
    rear_balance_pct: float
    l_over_d: float
    run_duration_seconds: float


class CFDJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    revision_id: str
    solver_name: str
    turbulence_model: str
    wind_speed_ms: float
    moving_ground: bool
    iterations: int
    convergence_status: str
    force_std_dev: float
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[SimulationResultResponse] = None


# Report Schemas
class ReportCreate(BaseModel):
    project_id: str
    revision_id: str
    title: str
    report_type: str = "ACADEMIC_20_SECTION"
    content_markdown: str


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    revision_id: str
    title: str
    report_type: str
    format: str
    content_markdown: str
    created_at: datetime
