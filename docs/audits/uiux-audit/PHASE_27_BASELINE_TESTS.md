# AUTOVERSE PHASE 27 — BASELINE TESTS & REGRESSION REFERENCE
**Date**: November 24, 2026  
**Base Commit**: `a2609d1993c61bb71231ae45074b73b8dc8e7fad`  
**Branch**: `uiux/phase-27`  
**Classification Policy (per C5)**:
- *Genuinely Passing*: Test passes cleanly on untouched baseline code.
- *Pre-existing Failure*: Test failed before Phase 27 modifications began (none found).
- *Cannot Execute*: Tool or test environment unavailable (none found).

---

## 1. STATIC TYPECHECKING (TSC)
- **Command**: `npx tsc --noEmit`
- **Result**: PASS (0 errors, 0 warnings)
- **Classification**: Genuinely Passing

---

## 2. PRODUCTION COMPILATION & BUNDLE SIZE
- **Command**: `npm run build` (`tsc && vite build`)
- **Result**: PASS (built in 6.86s)
- **Classification**: Genuinely Passing
- **Asset Inventory**:
  - `dist/assets/index-BMJMkGiO.js`: 311.67 kB (gzip: 77.63 kB)
  - `dist/assets/index-KsKun--J.css`: 52.01 kB (gzip: 9.33 kB)
  - `dist/assets/vendor-core-DxQty9DS.js`: 695.20 kB (gzip: 225.64 kB)
  - `dist/assets/vendor-three-Dx_GKVEX.js`: 789.88 kB (gzip: 206.16 kB)

---

## 3. VITEST FRONTEND SUITE
- **Command**: `npx vitest run`
- **Result**: 45 / 45 test files passed (100%), 288 / 288 tests passed (100%), 0 failures.
- **Classification**: Genuinely Passing

### Test Suites Breakdown:
1. `tests/ahmed-benchmark.test.ts` (7 tests) — PASS
2. `tests/cad-kernel-pipeline.test.ts` (11 tests) — PASS
3. `tests/geometry-engine.test.ts` (22 tests) — PASS
4. `tests/schema2-library.test.ts` (6 tests) — PASS
5. `tests/geometry-invariants.test.ts` (3 tests) — PASS
6. `tests/critical-car-visibility-open-everything.test.ts` (13 tests) — PASS
7. `tests/corrupted-json.test.ts` (5 tests) — PASS
8. `tests/interiors-engines-openings.test.ts` (15 tests) — PASS
9. `tests/authentic-geometry-engine.test.ts` (18 tests) — PASS
10. `tests/memory-leaks.test.ts` (2 tests) — PASS
11. `tests/apiClient.test.ts` (6 tests) — PASS
12. `tests/schema-v2-migration.test.ts` (5 tests) — PASS
13. `tests/top-tier-engineering-acceptance.test.ts` (1 test) — PASS
14. `tests/three-vehicle-modularity.test.ts` (3 tests) — PASS
15. `tests/geometry-engine-v2.test.ts` (5 tests) — PASS
16. `tests/qa-failure-paths.test.ts` (4 tests) — PASS
17. `tests/milestone1-bmw.test.ts` (7 tests) — PASS
18. `tests/cross-vehicle-similarity.test.ts` (3 tests) — PASS
19. `tests/fleet-switching-benchmark.test.ts` (2 tests) — PASS
20. `tests/brep-cad-kernel.test.ts` (10 tests) — PASS
21. `tests/pbr-visual-authenticity.test.ts` (12 tests) — PASS
22. `tests/security-reliability-stress.test.ts` (4 tests) — PASS
23. `tests/vertical-slice-workflow.test.ts` (1 test) — PASS
24. `tests/cross-car-part-swapping.test.ts` (10 tests) — PASS
25. `tests/milestone2-fleet.test.ts` (6 tests) — PASS
26. `tests/reference-library-project-forking.test.ts` (4 tests) — PASS
27. `tests/drivaer-benchmark-orchestration.test.ts` (5 tests) — PASS
28. `tests/geometry-cache-pool.test.ts` (4 tests) — PASS
29. `tests/aero-visualization-provenance.test.ts` (3 tests) — PASS
30. `tests/workflow-comparison-diff.test.ts` (4 tests) — PASS
31. `tests/component-collision.test.ts` (7 tests) — PASS
32. `tests/parametric-aero-library.test.ts` (5 tests) — PASS
33. `tests/exporter.test.ts` (6 tests) — PASS
34. `tests/parametric-geometry.test.ts` (13 tests) — PASS
35. `tests/packages.test.ts` (3 tests) — PASS
36. `tests/responsive-accessibility.test.ts` (11 tests) — PASS
37. `tests/catalog-migration-dashboard.test.ts` (2 tests) — PASS
38. `tests/parametric-feature-dag.test.ts` (6 tests) — PASS
39. `src/utils/__tests__/core.test.ts` (5 tests) — PASS
40. `tests/cfd-readiness-gates.test.ts` (4 tests) — PASS
41. `tests/vehicle-packaging-systems.test.ts` (2 tests) — PASS
42. `src/utils/__tests__/workflow.test.ts` (6 tests) — PASS
43. `tests/presentation-modes.test.ts` (3 tests) — PASS
44. `tests/wheel-rules.test.ts` (4 tests) — PASS
45. `tests/backend.test.ts` (10 tests) — PASS

---

## 4. PYTEST BACKEND SUITE
- **Command**: `python -m pytest`
- **Result**: 16 / 16 passed (100%), 0 failures, 2 benign warnings (9.06s).
- **Classification**: Genuinely Passing

### Test Suites Breakdown:
1. `tests_python/test_backend_api.py` (7 tests) — PASS
2. `tests_python/test_cfd_pipeline.py` (3 tests) — PASS
3. `tests_python/test_v1_api.py` (6 tests) — PASS

---

## 5. SUMMARY FOR PHASE 27 REGRESSION GATE
- Total baseline tests executed: 304 automated tests (288 Vitest + 16 Pytest)
- Passing: **304** (100%)
- Pre-existing Failures: **0**
- Any newly failing test in subsequent phases represents an immediate regression that must be resolved before phase sign-off.
