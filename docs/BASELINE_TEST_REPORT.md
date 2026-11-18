# AUTOVERSE 3D — BASELINE TEST REPORT

## 1. Test Suite Execution Summary
- **Test Command**: `npm test`
- **Runner**: Vitest v3.2.7
- **Results**: **19 passed (19 files), 133 passed (133 tests), 0 failures**.
- **Execution Time**: 2.77 seconds.

## 2. Tested Modules & Coverage
1. `src/utils/__tests__/core.test.ts`: Vector and numeric utility tests (5 tests)
2. `src/utils/__tests__/workflow.test.ts`: Workflow state machines (6 tests)
3. `tests/presentation-modes.test.ts`: Studio, Engineering, Showroom modes (3 tests)
4. `tests/packages.test.ts`: Package exports and typings (3 tests)
5. `tests/corrupted-json.test.ts`: Malformed, empty, and corrupted JSON resilience (5 tests)
6. `tests/exporter.test.ts`: GLTF and JSON export verification (6 tests)
7. `tests/schema2-library.test.ts`: Schema 2.0 vehicle model integrity (6 tests)
8. `tests/schema-v2-migration.test.ts`: Schema migration pipeline (5 tests)
9. `tests/geometry-engine-v2.test.ts`: Phase C AAGE V2 architecture & 18 quality gates (5 tests)
10. `tests/wheel-rules.test.ts`: Wheel fitment, aspect ratio, and clearance validation (4 tests)
11. `tests/geometry-engine.test.ts`: Geometry generation, materials, and disposal (22 tests)
12. `tests/geometry-invariants.test.ts`: Wheelbase, track width, ground clearance invariants (3 tests)
13. `tests/milestone1-bmw.test.ts`: BMW M4 G82 reference validation (7 tests)
14. `tests/authentic-geometry-engine.test.ts`: Quality gates and classification badges (18 tests)
15. `tests/qa-failure-paths.test.ts`: Rapid parallel loading, WebGL context loss recovery (4 tests)
16. `tests/memory-leaks.test.ts`: 50-cycle vehicle switching leak test (2 tests)
17. `tests/milestone2-fleet.test.ts`: Multi-vehicle fleet verification (6 tests)
18. `tests/backend.test.ts`: Fastify API endpoints and mock database (10 tests)
19. `tests/parametric-geometry.test.ts`: AutoVerse 50 vehicle parametric audit (13 tests)

## 3. Production Build Validation
- **Command**: `npm run build` (`tsc && vite build`)
- **Status**: **PASS (0 errors, 6.69s build time)**.
