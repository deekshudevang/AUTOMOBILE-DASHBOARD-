"""
AutoVerse Platform — Version 1 API & Persistent Workspace Pytest Suite
Verifies all Phase 21 deliverables:
- Health & System Diagnostics (/api/v1/health, /api/v1/health/ready, /api/v1/system/info)
- Vehicle Library Search & Filter (/api/v1/vehicles, components)
- Persistent Project CRUD (POST, GET, PUT, DELETE /api/v1/projects)
- Project Revision DAG & Snapshot Restore (/api/v1/revisions/{id}/restore)
- Saved Builds CRUD & Duplication (/api/v1/builds, /api/v1/builds/{id}/duplicate)
"""

import json
import pytest
from fastapi.testclient import TestClient
from services.api.database import init_db
from services.api.main import app

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    init_db()
    yield


# --- 1. Health & System Info Tests ---

def test_v1_health_reporting_real_db_connectivity():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["ONLINE", "DEGRADED"]
    assert data["service"] == "autoverse-api"
    assert data["database_connected"] is True
    assert "details" in data
    assert data["details"]["database_engine"] in ["sqlite", "postgresql"]


def test_v1_readiness_probe():
    res = client.get("/api/v1/health/ready")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "READY"


def test_v1_system_info_telemetry():
    res = client.get("/api/v1/system/info")
    assert res.status_code == 200
    data = res.json()
    assert data["service"] == "autoverse-api"
    assert data["database_connected"] is True
    assert data["vehicle_count"] >= 3
    assert data["uptime_seconds"] >= 0.0


# --- 2. Vehicle Catalog, Search & Filtering Tests ---

def test_v1_vehicles_search_and_category_filter():
    # Filter by category
    res = client.get("/api/v1/vehicles?category=Supercar")
    assert res.status_code == 200
    vehicles = res.json()
    assert len(vehicles) >= 1
    assert any("gt3" in v["slug"] for v in vehicles)

    # Search by keyword
    search_res = client.get("/api/v1/vehicles?q=BMW")
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert len(search_data) >= 1
    assert "BMW" in search_data[0]["manufacturer"]

    # Vehicle components
    first_veh_id = vehicles[0]["id"]
    comp_res = client.get(f"/api/v1/vehicles/{first_veh_id}/components")
    assert comp_res.status_code == 200
    assert isinstance(comp_res.json(), list)


# --- 3. Project CRUD & Revision Restore Tests ---

def test_v1_project_crud_and_revision_restore():
    # 1. Create project
    create_res = client.post("/api/v1/projects", json={
        "name": "Phase 21 Track Setup Project",
        "base_vehicle_id": "veh_porsche_911_gt3rs",
        "description": "Testing persistent project management"
    })
    assert create_res.status_code == 200
    proj = create_res.json()
    project_id = proj["id"]
    assert proj["name"] == "Phase 21 Track Setup Project"
    assert len(proj["revisions"]) >= 1
    initial_rev_hash = proj["revisions"][0]["revision_hash"]

    # 2. Update project
    update_res = client.put(f"/api/v1/projects/{project_id}", json={
        "name": "Phase 21 Track Setup Project (Updated)",
        "description": "Updated aerodynamic study"
    })
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "Phase 21 Track Setup Project (Updated)"

    # 3. Create second revision
    rev2_res = client.post(f"/api/v1/projects/{project_id}/revisions", json={
        "commit_message": "Added swan-neck rear wing with +12 deg AoA",
        "author_name": "Chief Aerodynamicist",
        "geometry_digest": "digest_aero_wing_v2",
        "parent_revision_hash": initial_rev_hash,
        "serialized_bundle": json.dumps({"wingAngle": 12, "downforceN": 4200})
    })
    assert rev2_res.status_code == 200
    rev2 = rev2_res.json()
    rev2_hash = rev2["revision_hash"]
    assert rev2["parent_revision_hash"] == initial_rev_hash

    # 4. List revisions
    list_revs = client.get(f"/api/v1/projects/{project_id}/revisions")
    assert list_revs.status_code == 200
    assert len(list_revs.json()) >= 2

    # 5. Restore initial revision
    restore_res = client.post(f"/api/v1/revisions/{initial_rev_hash}/restore")
    assert restore_res.status_code == 200
    restored = restore_res.json()
    assert "Restored" in restored["commit_message"]
    assert restored["parent_revision_hash"] == initial_rev_hash

    # 6. Delete project
    del_res = client.delete(f"/api/v1/projects/{project_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True


# --- 4. Saved Builds Persistence & Cross-Car Overrides Tests ---

def test_v1_saved_builds_lifecycle():
    # 1. Create a customized build with component overrides & colorways
    overrides = {
        "front_splitter": {
            "componentId": "front_splitter_track",
            "donorVehicleId": "veh_bmw_m4_gt3",
            "scale": [1.02, 1.0, 1.05],
            "fitmentScore": 92.5
        },
        "rear_wing": {
            "componentId": "rear_wing_jesko_synchro",
            "donorVehicleId": "veh_koenigsegg_jesko",
            "scale": [1.0, 1.0, 1.0],
            "fitmentScore": 88.0
        }
    }

    build_payload = {
        "name": "GT3 RS Nurburgring Record Spec",
        "vehicle_id": "porsche_911_gt3_rs_992_2022",
        "base_vehicle_file": "porsche_911_gt3_rs_992_2022.json",
        "base_model_hash": 706080074,
        "configuration_json": json.dumps(overrides),
        "primary_color": 12,
        "secondary_color": 0,
        "custom_primary_color": "[255, 60, 0]",
        "is_primary_color_custom": True,
        "wheel_color": 156
    }

    create_res = client.post("/api/v1/builds", json=build_payload)
    assert create_res.status_code == 201
    build = create_res.json()
    build_id = build["id"]
    assert build["name"] == "GT3 RS Nurburgring Record Spec"
    assert build["is_primary_color_custom"] is True

    # 2. Retrieve build
    get_res = client.get(f"/api/v1/builds/{build_id}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    stored_overrides = json.loads(retrieved["configuration_json"])
    assert "front_splitter" in stored_overrides
    assert stored_overrides["front_splitter"]["donorVehicleId"] == "veh_bmw_m4_gt3"

    # 3. Duplicate build
    dup_res = client.post(f"/api/v1/builds/{build_id}/duplicate")
    assert dup_res.status_code == 201
    duplicated = dup_res.json()
    assert "(Copy)" in duplicated["name"]
    assert duplicated["id"] != build_id

    # 4. Update original build with version tracking
    update_res = client.put(f"/api/v1/builds/{build_id}", json={
        "name": "GT3 RS Nurburgring Record Spec (Polished)",
        "expected_version": 1
    })
    assert update_res.status_code == 200
    updated_build = update_res.json()
    assert updated_build["name"] == "GT3 RS Nurburgring Record Spec (Polished)"
    assert updated_build["config_version"] == 2

    # 4b. Test Optimistic Concurrency Conflict (stale expected_version = 1 vs current = 2)
    conflict_res = client.put(f"/api/v1/builds/{build_id}", json={
        "name": "Should Fail Stale Overwrite",
        "expected_version": 1
    })
    assert conflict_res.status_code == 409
    assert conflict_res.json()["detail"]["error"] == "CONFLICT"
    assert conflict_res.json()["detail"]["server_version"] == 2

    # 5. List all builds
    list_res = client.get("/api/v1/builds")
    assert list_res.status_code == 200
    all_builds = list_res.json()
    assert len(all_builds) >= 2

    # 6. Delete duplicated build
    del_res = client.delete(f"/api/v1/builds/{duplicated['id']}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True
