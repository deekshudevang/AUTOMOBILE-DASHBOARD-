"""
AutoVerse Platform — 22 Relational Database ORM Models
Conforms to Schema 2.0 & Phase 2 Architecture Standards.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Enum,
    UniqueConstraint
)
from sqlalchemy.orm import relationship
from .database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# 1. User
class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="STUDENT")  # STUDENT, ENGINEER, ADMIN
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    projects = relationship("VehicleProject", back_populates="owner")
    builds = relationship("SavedBuild", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")


# 2. Vehicle
class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    slug = Column(String(120), unique=True, nullable=False, index=True)
    display_name = Column(String(200), nullable=False)
    manufacturer = Column(String(100), nullable=False, index=True)
    model_hash = Column(Integer, unique=True, nullable=False, index=True)
    model_code = Column(String(100), nullable=False)
    category = Column(String(80), nullable=False)  # Supercar, Sports Coupe, GT, Concept
    quality_class = Column(String(50), default="CLASS_A_VERIFIED")
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    specification = relationship("VehicleSpecification", back_populates="vehicle", uselist=False)
    assets = relationship("VehicleAsset", back_populates="vehicle")
    components = relationship("VehicleComponent", back_populates="vehicle")
    projects = relationship("VehicleProject", back_populates="base_vehicle")


# 3. VehicleAsset
class VehicleAsset(Base):
    __tablename__ = "vehicle_assets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    asset_path = Column(String(500), nullable=False)
    asset_format = Column(String(20), nullable=False)  # GLB, STEP, OBJ, JSON
    file_size_bytes = Column(Integer, nullable=False)
    sha256_hash = Column(String(64), nullable=False)
    is_canonical = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    vehicle = relationship("Vehicle", back_populates="assets")


# 4. VehicleSpecification
class VehicleSpecification(Base):
    __tablename__ = "vehicle_specifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), unique=True, nullable=False)
    length_m = Column(Float, nullable=False)
    width_m = Column(Float, nullable=False)
    height_m = Column(Float, nullable=False)
    wheelbase_m = Column(Float, nullable=False)
    front_track_m = Column(Float, nullable=False)
    rear_track_m = Column(Float, nullable=False)
    ground_clearance_m = Column(Float, default=0.100)
    curb_weight_kg = Column(Float, nullable=False)
    engine_layout = Column(String(50), default="MID_LONGITUDINAL")
    horsepower_hp = Column(Integer, default=500)
    top_speed_kmh = Column(Float, default=300.0)
    cd_claimed = Column(Float, default=0.32)
    frontal_area_m2 = Column(Float, default=2.15)

    vehicle = relationship("Vehicle", back_populates="specification")


# 5. VehicleComponent
class VehicleComponent(Base):
    __tablename__ = "vehicle_components"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    component_name = Column(String(150), nullable=False)
    category = Column(String(80), nullable=False)  # Aero, Body, Chassis, Wheels, Suspension
    editability = Column(String(50), default="PARAMETRIC")  # PARAMETRIC, MESH_EDITABLE, VIEW_ONLY
    slot_key = Column(String(80), nullable=False)
    mass_kg = Column(Float, default=5.0)
    is_default = Column(Boolean, default=True)
    position_x = Column(Float, default=0.0)
    position_y = Column(Float, default=0.0)
    position_z = Column(Float, default=0.0)

    vehicle = relationship("Vehicle", back_populates="components")
    mounts = relationship("ComponentMount", back_populates="component")
    material = relationship("ComponentMaterial", back_populates="component", uselist=False)
    assets = relationship("ComponentAsset", back_populates="component")


# 6. ComponentAsset
class ComponentAsset(Base):
    __tablename__ = "component_assets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    component_id = Column(String(36), ForeignKey("vehicle_components.id"), nullable=False)
    asset_path = Column(String(500), nullable=False)
    asset_format = Column(String(20), default="STEP")
    sha256_hash = Column(String(64), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    lod_level = Column(Integer, default=0)

    component = relationship("VehicleComponent", back_populates="assets")


# 7. ComponentCategory
class ComponentCategory(Base):
    __tablename__ = "component_categories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    slug = Column(String(80), unique=True, nullable=False)
    name = Column(String(120), nullable=False)
    description = Column(Text, default="")
    icon_name = Column(String(50), default="Layers")
    sort_order = Column(Integer, default=0)


# 8. ComponentCompatibility
class ComponentCompatibility(Base):
    __tablename__ = "component_compatibilities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    component_id = Column(String(36), ForeignKey("vehicle_components.id"), nullable=False)
    target_vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    is_compatible = Column(Boolean, default=True)
    restriction_notes = Column(Text, default="")


# 9. ComponentDependency
class ComponentDependency(Base):
    __tablename__ = "component_dependencies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    parent_component_id = Column(String(36), ForeignKey("vehicle_components.id"), nullable=False)
    required_component_id = Column(String(36), ForeignKey("vehicle_components.id"), nullable=False)
    dependency_type = Column(String(50), default="REQUIRES")  # REQUIRES, EXCLUDES


# 10. ComponentMount
class ComponentMount(Base):
    __tablename__ = "component_mounts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    component_id = Column(String(36), ForeignKey("vehicle_components.id"), nullable=False)
    mount_datum_name = Column(String(120), nullable=False)
    x = Column(Float, default=0.0)
    y = Column(Float, default=0.0)
    z = Column(Float, default=0.0)
    normal_x = Column(Float, default=0.0)
    normal_y = Column(Float, default=0.0)
    normal_z = Column(Float, default=1.0)
    tolerance_mm = Column(Float, default=1.0)

    component = relationship("VehicleComponent", back_populates="mounts")


# 11. ComponentMaterial
class ComponentMaterial(Base):
    __tablename__ = "component_materials"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    component_id = Column(String(36), ForeignKey("vehicle_components.id"), unique=True, nullable=False)
    base_color_rgb = Column(String(30), default="[200, 200, 200]")
    metallic = Column(Float, default=0.8)
    roughness = Column(Float, default=0.2)
    clearcoat = Column(Float, default=1.0)
    clearcoat_roughness = Column(Float, default=0.05)
    texture_id = Column(String(100), default="carbon_twill")

    component = relationship("VehicleComponent", back_populates="material")


# 12. VehicleProject
class VehicleProject(Base):
    __tablename__ = "vehicle_projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    base_vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    active_branch = Column(String(80), default="main")
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    owner = relationship("User", back_populates="projects")
    base_vehicle = relationship("Vehicle", back_populates="projects")
    revisions = relationship("ProjectRevision", back_populates="project", cascade="all, delete-orphan")
    builds = relationship("SavedBuild", back_populates="project", cascade="all, delete-orphan")


# 13. ProjectRevision
class ProjectRevision(Base):
    __tablename__ = "project_revisions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("vehicle_projects.id"), nullable=False)
    revision_hash = Column(String(64), nullable=False, index=True)
    parent_revision_hash = Column(String(64), nullable=True)
    commit_message = Column(String(300), nullable=False)
    author_name = Column(String(100), default="Student Engineer")
    geometry_digest = Column(String(64), nullable=False)
    is_manifold = Column(Boolean, default=True)
    serialized_bundle = Column(Text, nullable=True)
    configuration_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    project = relationship("VehicleProject", back_populates="revisions")
    artifacts = relationship("GeometryArtifact", back_populates="revision")
    features = relationship("CADFeature", back_populates="revision")
    reports = relationship("Report", back_populates="revision")


# 14. GeometryArtifact
class GeometryArtifact(Base):
    __tablename__ = "geometry_artifacts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    revision_id = Column(String(36), ForeignKey("project_revisions.id"), nullable=False)
    artifact_type = Column(String(50), nullable=False)  # BREP_STEP, TRIANGLE_MESH, CFD_DOMAIN
    format = Column(String(20), nullable=False)  # STEP, STL, GLB, OBJ
    file_path = Column(String(500), nullable=False)
    sha256_hash = Column(String(64), nullable=False)
    byte_size = Column(Integer, default=0)
    vertex_count = Column(Integer, default=0)
    triangle_count = Column(Integer, default=0)

    revision = relationship("ProjectRevision", back_populates="artifacts")


# 15. CADFeature
class CADFeature(Base):
    __tablename__ = "cad_features"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    revision_id = Column(String(36), ForeignKey("project_revisions.id"), nullable=False)
    feature_type = Column(String(80), nullable=False)  # SKETCH, EXTRUDE, FILLET, LOFT, BOOLEAN
    name = Column(String(150), nullable=False)
    parameters_json = Column(Text, default="{}")
    execution_order = Column(Integer, default=0)
    is_suppressed = Column(Boolean, default=False)

    revision = relationship("ProjectRevision", back_populates="features")


# 16. CADJob
class CADJob(Base):
    __tablename__ = "cad_jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("vehicle_projects.id"), nullable=False)
    revision_id = Column(String(36), ForeignKey("project_revisions.id"), nullable=False)
    status = Column(String(40), default="PENDING")  # PENDING, RUNNING, COMPLETED, FAILED
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)


# 17. MeshJob
class MeshJob(Base):
    __tablename__ = "mesh_jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("vehicle_projects.id"), nullable=False)
    revision_id = Column(String(36), ForeignKey("project_revisions.id"), nullable=False)
    mesh_type = Column(String(50), default="HEXAHEDRAL_SNAPPY")
    target_y_plus = Column(Float, default=30.0)
    cell_count = Column(Integer, default=4850000)
    orthogonal_quality_min = Column(Float, default=0.32)
    skewness_max = Column(Float, default=0.68)
    status = Column(String(40), default="COMPLETED")
    started_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, default=utc_now)


# 18. CFDJob
class CFDJob(Base):
    __tablename__ = "cfd_jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("vehicle_projects.id"), nullable=False)
    revision_id = Column(String(36), ForeignKey("project_revisions.id"), nullable=False)
    solver_name = Column(String(80), default="simpleFoam (OpenFOAM v2406)")
    turbulence_model = Column(String(80), default="kOmegaSST")
    wind_speed_ms = Column(Float, default=30.0)
    moving_ground = Column(Boolean, default=True)
    iterations = Column(Integer, default=500)
    convergence_status = Column(String(40), default="CONVERGED")
    force_std_dev = Column(Float, default=0.00038)
    started_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, default=utc_now)

    result = relationship("SimulationResult", back_populates="cfd_job", uselist=False)


# 19. DynamicsJob
class DynamicsJob(Base):
    __tablename__ = "dynamics_jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("vehicle_projects.id"), nullable=False)
    revision_id = Column(String(36), ForeignKey("project_revisions.id"), nullable=False)
    suspension_type = Column(String(80), default="DOUBLE_WISHBONE")
    lateral_g = Column(Float, default=1.2)
    roll_angle_deg = Column(Float, default=1.8)
    status = Column(String(40), default="COMPLETED")
    started_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, default=utc_now)


# 20. SimulationResult
class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cfd_job_id = Column(String(36), ForeignKey("cfd_jobs.id"), unique=True, nullable=False)
    provenance = Column(String(40), default="CFD")  # CFD, ANALYTIC, ILLUSTRATIVE
    cd = Column(Float, nullable=False)
    cl = Column(Float, nullable=False)
    cl_front = Column(Float, nullable=False)
    cl_rear = Column(Float, nullable=False)
    front_balance_pct = Column(Float, default=42.5)
    rear_balance_pct = Column(Float, default=57.5)
    l_over_d = Column(Float, default=1.11)
    run_duration_seconds = Column(Float, default=420.0)

    cfd_job = relationship("CFDJob", back_populates="result")


# 21. Report
class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("vehicle_projects.id"), nullable=False)
    revision_id = Column(String(36), ForeignKey("project_revisions.id"), nullable=False)
    title = Column(String(255), nullable=False)
    report_type = Column(String(80), default="ACADEMIC_20_SECTION")
    format = Column(String(20), default="MARKDOWN")
    content_markdown = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    revision = relationship("ProjectRevision", back_populates="reports")


# 22. AuditLog
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(80), nullable=False)
    entity_id = Column(String(64), nullable=False)
    payload_json = Column(Text, default="{}")
    timestamp = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="audit_logs")


# 23. SavedBuild
class SavedBuild(Base):
    __tablename__ = "saved_builds"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("vehicle_projects.id"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    vehicle_id = Column(String(64), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    base_vehicle_file = Column(String(255), nullable=False)
    base_model_hash = Column(Integer, nullable=False, default=0)
    configuration_json = Column(Text, nullable=False, default="{}")
    primary_color = Column(Integer, nullable=True)
    secondary_color = Column(Integer, nullable=True)
    custom_primary_color = Column(String(50), nullable=True)
    custom_secondary_color = Column(String(50), nullable=True)
    is_primary_color_custom = Column(Boolean, default=False)
    wheel_color = Column(Integer, nullable=True)
    version = Column(String(20), default="2.0.0")
    config_version = Column(Integer, default=1, nullable=False)
    revision_id = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    project = relationship("VehicleProject", back_populates="builds")
    user = relationship("User", back_populates="builds")
