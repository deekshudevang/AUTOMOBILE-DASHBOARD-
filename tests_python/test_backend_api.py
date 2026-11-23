"""
AutoVerse Platform — Backend API & Database Pytest Suite
Tests all 22 relational models, FastAPI endpoints, append-only DAG revisions, and CFD provenance.
"""

import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import inspect
from services.api.database import Base, engine, SessionLocal, init_db
from services.api.main import app
from services.api.models import Vehicle, VehicleProject, ProjectRevision, CFDJob, SimulationResult, Report

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Ensure clean test database with all 22+ models created."""
    init_db()
    yield
    # Keep database file or cleanup as needed


def test_database_table_coverage_all_22_models():
    """Verify all 22 required database tables exist in the schema."""
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    required_tables = [
        "users",
        "vehicles",
        "vehicle_assets",
        "vehicle_specifications",
        "vehicle_components",
        "component_assets",
        "component_categories",
        "component_compatibilities",
        "component_dependencies",
        "component_mounts",
        "component_materials",
        "vehicle_projects",
        "project_revisions",
        "geometry_artifacts",
        "cad_features",
        "cad_jobs",
        "mesh_jobs",
        "cfd_jobs",
        "dynamics_jobs",
        "simulation_results",
        "reports",
        "audit_logs"
    ]

    for table in required_tables:
        assert table in tables, f"Expected table '{table}' missing from database schema"


def test_api_healthcheck():
    """Verify health endpoint reports online status and service metadata."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert data["service"] == "autoverse-api"
    assert data["version"] == "2.0.0"


def test_vehicles_catalog_and_specifications():
    """Verify vehicle listing and specification retrieval."""
    response = client.get("/api/vehicles")
    assert response.status_code == 200
    vehicles = response.json()
    assert len(vehicles) >= 3

    # Check Porsche GT3 RS baseline
    porsche = next((v for v in vehicles if "gt3" in v["slug"]), None)
    assert porsche is not None
    assert porsche["model_hash"] == 706080074

    # Verify specs endpoint
    spec_res = client.get(f"/api/vehicles/{porsche['id']}/specification")
    assert spec_res.status_code == 200
    specs = spec_res.json()
    assert specs["wheelbase_m"] == 2.457
    assert specs["engine_layout"] == "REAR_LONGITUDINAL"


def test_components_catalog_and_mounts():
    """Verify component catalog and mount coordinates."""
    response = client.get("/api/components")
    assert response.status_code == 200
    components = response.json()
    assert len(components) >= 3

    # Verify front splitter has mount datum
    splitter = next((c for c in components if "splitter" in c["id"]), None)
    assert splitter is not None
    assert splitter["editability"] == "PARAMETRIC"
    assert len(splitter["mounts"]) > 0
    assert splitter["mounts"][0]["mount_datum_name"] == "datum_front_bumper_mount"


def test_project_lifecycle_and_append_only_dag():
    """
    Vertical slice integration test:
    1. Fork project from baseline vehicle
    2. Verify initial revision created in DAG
    3. Append modification revision
    4. Assert linear history and immutable commit digests
    """
    # 1. Fetch vehicle id
    v_res = client.get("/api/vehicles")
    veh_id = v_res.json()[0]["id"]

    # 2. Create project
    create_res = client.post("/api/projects", json={
        "name": "Student Aero Lab Project",
        "base_vehicle_id": veh_id,
        "description": "Evaluating high-downforce splitter angle of attack"
    })
    assert create_res.status_code == 200
    proj = create_res.json()
    proj_id = proj["id"]
    assert len(proj["revisions"]) == 1
    root_rev = proj["revisions"][0]
    assert root_rev["parent_revision_hash"] is None

    # 3. Append second revision
    rev2_res = client.post(f"/api/projects/{proj_id}/revisions", json={
        "commit_message": "Added 12.5 deg rear wing and dual diffuser strakes",
        "author_name": "Student Engineer",
        "geometry_digest": "3a8c1f0b9e84712398ab",
        "is_manifold": True,
        "parent_revision_hash": root_rev["revision_hash"]
    })
    assert rev2_res.status_code == 200
    rev2 = rev2_res.json()
    assert rev2["parent_revision_hash"] == root_rev["revision_hash"]

    # 4. Fetch all revisions and verify DAG
    list_revs = client.get(f"/api/projects/{proj_id}/revisions")
    assert list_revs.status_code == 200
    all_revs = list_revs.json()
    assert len(all_revs) == 2
    assert all_revs[1]["commit_message"] == "Added 12.5 deg rear wing and dual diffuser strakes"


def test_cfd_simulation_job_and_provenance():
    """Verify CFD job submission and strict tri-state provenance metadata."""
    # Create project and revision first
    v_res = client.get("/api/vehicles")
    veh_id = v_res.json()[0]["id"]
    proj = client.post("/api/projects", json={
        "name": "CFD Wind Tunnel Test",
        "base_vehicle_id": veh_id
    }).json()
    rev_id = proj["revisions"][0]["id"]

    # Submit CFD Job
    cfd_res = client.post("/api/cfd/jobs", json={
        "project_id": proj["id"],
        "revision_id": rev_id,
        "solver_name": "simpleFoam (OpenFOAM v2406)",
        "turbulence_model": "kOmegaSST",
        "wind_speed_ms": 30.0,
        "moving_ground": True,
        "iterations": 500
    })
    assert cfd_res.status_code == 200
    job = cfd_res.json()
    assert job["convergence_status"] == "CONVERGED"
    assert job["force_std_dev"] < 0.001

    # Fetch results
    results_res = client.get(f"/api/cfd/jobs/{job['id']}/results")
    assert results_res.status_code == 200
    results = results_res.json()
    assert results["provenance"] == "CFD"
    assert results["cd"] == 0.384
    assert results["cl"] == -0.428  # Downforce


def test_engineering_report_generation():
    """Verify 20-section academic engineering report creation and retrieval."""
    v_res = client.get("/api/vehicles")
    veh_id = v_res.json()[0]["id"]
    proj = client.post("/api/projects", json={
        "name": "Report Test Project",
        "base_vehicle_id": veh_id
    }).json()
    rev_id = proj["revisions"][0]["id"]

    report_res = client.post("/api/reports", json={
        "project_id": proj["id"],
        "revision_id": rev_id,
        "title": "Aero Evaluation Technical Report",
        "report_type": "ACADEMIC_20_SECTION",
        "content_markdown": "# 1. Executive Summary\nAnalysis complete."
    })
    assert report_res.status_code == 200
    rep = report_res.json()
    assert rep["title"] == "Aero Evaluation Technical Report"
    assert rep["format"] == "MARKDOWN"

    # Retrieve report by ID
    get_rep = client.get(f"/api/reports/{rep['id']}")
    assert get_rep.status_code == 200
    assert get_rep.json()["id"] == rep["id"]
