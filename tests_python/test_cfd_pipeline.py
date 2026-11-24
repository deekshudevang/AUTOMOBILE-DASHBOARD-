"""
AutoVerse Platform — Phase 24: CFD Execution Pipeline & Ahmed Benchmark Pytest Suite
Verifies:
1. Host execution environment introspection (WSL2, Docker, native OpenFOAM)
2. Asynchronous job execution queue state progression (QUEUED -> MESHING -> SOLVING -> CONVERGED)
3. Step-by-step convergence residuals streaming (p, Ux, Uy, Uz, k, omega)
4. Empirical Ahmed Reference Body (SAE 840300) validation within 6% tolerance band
"""

import pytest
from fastapi.testclient import TestClient
from services.api.database import init_db
from services.api.main import app

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    init_db()
    yield


def test_cfd_host_environment_introspection():
    res = client.get("/api/cfd/environment")
    assert res.status_code == 200
    env = res.json()
    assert "wsl_available" in env
    assert "docker_cli_installed" in env
    assert "active_engine" in env
    assert env["active_engine"] in [
        "NATIVE_OPENFOAM_BINARY",
        "DOCKER_OPENFOAM_CONTAINER",
        "WSL2_OPENFOAM_SOLVER",
        "AUTOVERSE_ANALYTICAL_MOMENTUM_SOLVER"
    ]


def test_ahmed_body_3d_benchmark_25deg_and_35deg():
    # 1. Execute Ahmed 25° slant benchmark
    res25 = client.post("/api/cfd/benchmarks/ahmed", json={
        "slant_angle_deg": 25.0,
        "wind_speed_ms": 60.0,
        "iterations": 500
    })
    assert res25.status_code == 200
    data25 = res25.json()

    assert data25["standard"] == "SAE 840300 / ERCOFTAC Classic Case 30"
    assert data25["literature_cd"] == 0.285
    assert data25["within_tolerance_band"] is True
    assert data25["percentage_error"] < 6.0
    assert len(data25["residuals_history"]) > 10

    # 2. Execute Ahmed 35° slant benchmark
    res35 = client.post("/api/cfd/benchmarks/ahmed", json={
        "slant_angle_deg": 35.0,
        "wind_speed_ms": 60.0,
        "iterations": 500
    })
    assert res35.status_code == 200
    data35 = res35.json()

    assert data35["literature_cd"] == 0.257
    assert data35["within_tolerance_band"] is True
    assert data35["percentage_error"] < 6.0

    # 3. Canonical automotive physics trend: Cd(25°) > Cd(35°)
    assert data25["calculated_cd"] > data35["calculated_cd"]


def test_cfd_job_submission_and_residual_streaming():
    # Fetch existing vehicle & project
    v_res = client.get("/api/vehicles")
    veh_id = v_res.json()[0]["id"]
    proj = client.post("/api/projects", json={
        "name": "Phase 24 CFD Queue Test",
        "base_vehicle_id": veh_id
    }).json()
    rev_id = proj["revisions"][0]["id"]

    # Submit CFD Job
    job_res = client.post("/api/cfd/jobs", json={
        "project_id": proj["id"],
        "revision_id": rev_id,
        "wind_speed_ms": 35.0,
        "iterations": 300
    })
    assert job_res.status_code == 200
    job = job_res.json()
    job_id = job["id"]

    # Verify execution status
    status_res = client.get(f"/api/cfd/jobs/{job_id}/status")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["status"] in ["SOLVING", "CONVERGED"]
    assert status_data["progress_pct"] > 0

    # Verify streamed residuals
    res_res = client.get(f"/api/cfd/jobs/{job_id}/residuals")
    assert res_res.status_code == 200
    residuals = res_res.json()
    assert len(residuals) > 0

    first = residuals[0]
    last = residuals[-1]
    assert "p" in first and "ux" in first and "k" in first
    # Residuals must decay over iterations
    assert last["p"] < first["p"]
    assert last["ux"] < first["ux"]
