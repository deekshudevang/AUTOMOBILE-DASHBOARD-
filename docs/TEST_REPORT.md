# AutoVerse — Comprehensive Test & Verification Report (TEST_REPORT.md)

**Test Frameworks:** Vitest 3.2.7 (Frontend & Geometric Core), Pytest 9.1.1 (Python Backend API & Adapters)  
**Total Test Files:** 58 (55 Vitest + 3 Pytest)  
**Total Tests Passing:** 379 / 379 (363 Vitest + 16 Pytest, 100% Pass Rate)  
**Total Failures:** 0  
**CI Verification:** Verified Green on GitHub Actions (Commit cbdd816)  

---

## 1. Verified Vitest Test Suites Breakdown (55 Files, 363 Tests)

| Test Suite File | Tests | Status | Domain |
| :--- | :--- | :--- | :--- |
| src/utils/__tests__/core.test.ts | 5 | PASSED | Automated test suite |
| src/utils/__tests__/workflow.test.ts | 6 | PASSED | Automated test suite |
| tests/advanced-customization-phone-landscape.test.ts | 13 | PASSED | Automated test suite |
| tests/aero-visualization-provenance.test.ts | 3 | PASSED | Automated test suite |
| tests/ahmed-benchmark.test.ts | 7 | PASSED | Automated test suite |
| tests/apiClient.test.ts | 6 | PASSED | Automated test suite |
| tests/authentic-geometry-engine.test.ts | 18 | PASSED | Automated test suite |
| tests/brep-cad-kernel.test.ts | 10 | PASSED | Automated test suite |
| tests/cad-kernel-pipeline.test.ts | 11 | PASSED | Automated test suite |
| tests/car-studio-overhaul-27-3a.test.ts | 4 | PASSED | Automated test suite |
| tests/car-studio-overhaul-27-3b.test.ts | 5 | PASSED | Automated test suite |
| tests/car-studio-overhaul-27-3c.test.ts | 6 | PASSED | Automated test suite |
| tests/catalog-migration-dashboard.test.ts | 2 | PASSED | Automated test suite |
| tests/cfd-readiness-gates.test.ts | 4 | PASSED | Automated test suite |
| tests/component-collision.test.ts | 7 | PASSED | Automated test suite |
| tests/corrupted-json.test.ts | 5 | PASSED | Automated test suite |
| tests/critical-car-visibility-open-everything.test.ts | 13 | PASSED | Automated test suite |
| tests/cross-car-part-swapping.test.ts | 10 | PASSED | Automated test suite |
| tests/cross-vehicle-similarity.test.ts | 3 | PASSED | Automated test suite |
| tests/design-system-foundation.test.ts | 9 | PASSED | Automated test suite |
| tests/drivaer-benchmark-orchestration.test.ts | 5 | PASSED | Automated test suite |
| tests/engineering-workspaces-27-4.test.ts | 7 | PASSED | Automated test suite |
| tests/exporter.test.ts | 6 | PASSED | Automated test suite |
| tests/fleet-switching-benchmark.test.ts | 2 | PASSED | Automated test suite |
| tests/geometry-cache-pool.test.ts | 4 | PASSED | Automated test suite |
| tests/geometry-engine-v2.test.ts | 5 | PASSED | Automated test suite |
| tests/geometry-engine.test.ts | 22 | PASSED | Automated test suite |
| tests/geometry-invariants.test.ts | 3 | PASSED | Automated test suite |
| tests/interiors-engines-openings.test.ts | 15 | PASSED | Automated test suite |
| tests/memory-leaks.test.ts | 2 | PASSED | Automated test suite |
| tests/milestone1-bmw.test.ts | 7 | PASSED | Automated test suite |
| tests/milestone2-fleet.test.ts | 6 | PASSED | Automated test suite |
| tests/motion-audio-visual-sweep-27-7.test.ts | 10 | PASSED | Automated test suite |
| tests/multi-viewport-accessibility-27-6.test.ts | 14 | PASSED | Automated test suite |
| tests/packages.test.ts | 3 | PASSED | Automated test suite |
| tests/parametric-aero-library.test.ts | 5 | PASSED | Automated test suite |
| tests/parametric-feature-dag.test.ts | 6 | PASSED | Automated test suite |
| tests/parametric-geometry.test.ts | 13 | PASSED | Automated test suite |
| tests/pbr-visual-authenticity.test.ts | 12 | PASSED | Automated test suite |
| tests/presentation-modes.test.ts | 3 | PASSED | Automated test suite |
| tests/projects-persistence-27-5.test.ts | 7 | PASSED | Automated test suite |
| tests/qa-failure-paths.test.ts | 4 | PASSED | Automated test suite |
| tests/reference-library-project-forking.test.ts | 4 | PASSED | Automated test suite |
| tests/responsive-accessibility.test.ts | 11 | PASSED | Automated test suite |
| tests/schema-v2-migration.test.ts | 5 | PASSED | Automated test suite |
| tests/schema2-library.test.ts | 6 | PASSED | Automated test suite |
| tests/security-reliability-stress.test.ts | 4 | PASSED | Automated test suite |
| tests/three-vehicle-modularity.test.ts | 3 | PASSED | Automated test suite |
| tests/top-tier-engineering-acceptance.test.ts | 1 | PASSED | Automated test suite |
| tests/vehicle-gallery-redesign.test.ts | 6 | PASSED | Automated test suite |
| tests/vehicle-packaging-systems.test.ts | 2 | PASSED | Automated test suite |
| tests/vertical-slice-workflow.test.ts | 1 | PASSED | Automated test suite |
| tests/view-map-deep-links.test.ts | 4 | PASSED | Automated test suite |
| tests/wheel-rules.test.ts | 4 | PASSED | Automated test suite |
| tests/workflow-comparison-diff.test.ts | 4 | PASSED | Automated test suite |

---

## 2. Verified Pytest Backend Test Suites Breakdown (3 Files, 16 Tests)

| Test Suite File | Tests | Status | Domain |
| :--- | :--- | :--- | :--- |
| 	ests_python/test_backend_api.py | 7 | PASSED | Relational database schema, 22 tables, and FastAPI CRUD |
| 	ests_python/test_cfd_pipeline.py | 3 | PASSED | CFD host environment, Ahmed body endpoints, and residual streams |
| 	ests_python/test_v1_api.py | 6 | PASSED | Version 1 API, health probes, project revisions, and saved builds |

---

## 3. Benchmark CLI Commands (ANALYTIC Estimates)

- 
pm run benchmark:ahmed: Reproduces 25°  = 0.289$ (error 1.40% vs literature) and 35°  = 0.268$ (error 4.28% vs literature) via closed-form ANALYTIC formulation.
- 
pm run benchmark:drivaer: Reproduces Fastback  = 0.245$ (error 0.82% vs literature), Notchback  = 0.258$ (error 1.57% vs literature), and Estate  = 0.285$ (error 1.06% vs literature) via component-buildup ANALYTIC formulation.
- 
pm run check:provenance: Enforces honest benchmark labeling (prohibits false 'VERIFIED' status on ANALYTIC provenance).
- 
pm run validate:assets: Enforces manifest asset resolution and honest 'not_available' procedural labeling.
