# AUTOVERSE 3D — REGRESSION TEST MATRIX

**Last Updated:** November 23, 2026  
**Auditor:** QA Automation Lead & Systems Auditor  

```
┌───────────────────────────────────────┬──────────────────────┬─────────────┬──────────────┬────────────────────────────┐
│ Subsystem / Workflow                  │ Test Command / Suite │ Pass Target │ Actual Pass  │ Verified Invariants        │
├───────────────────────────────────────┼──────────────────────┼─────────────┼──────────────┼────────────────────────────┤
│ 1. 50-Vehicle Parametric Library      │ npx vitest run       │ 100%        │ 50/50 Cars   │ Watertight geometry lofts  │
│ 2. Canonical Cross-Car Part Swapper   │ npx vitest run       │ 100%        │ 10/10 Tests  │ Normalized scaling & slots │
│ 3. Apertures, Hinges & Open Everything│ npx vitest run       │ 100%        │ 15/15 Tests  │ Scissor/dihedral/coach kin │
│ 4. Pacejka MF5.2 Tyre Dynamics Engine │ npx vitest run       │ 100%        │ 7/7 Tests    │ Non-linear Fy, load xfer   │
│ 5. Ahmed Body Aerodynamics Benchmark  │ npx vitest run       │ 100%        │ 7/7 Tests    │ Cd within 5.8% literature  │
│ 6. Three.js Modularity & Materials    │ npx vitest run       │ 100%        │ 22/22 Tests  │ PBR materials & instances  │
│ 7. Memory Leak Stress Cycles          │ npx vitest run       │ 100%        │ 2/2 Tests    │ 50 cycles zero leak        │
│ 8. API Client Resilient Networking    │ npx vitest run       │ 100%        │ 6/6 Tests    │ Offline 408 & sync fork    │
│ 9. Python Backend & Database APIs     │ pytest tests_python  │ 100%        │ 13/13 Tests  │ Health, Project, Build CRUD│
│ 10. TypeScript Static Typecheck       │ npx tsc --noEmit     │ 0 Errors    │ 0 Errors     │ 2,352 modules typesafe     │
│ 11. Production Bundle Build           │ npm run build        │ Exit 0      │ 11.98s       │ Clean minified artifacts   │
├───────────────────────────────────────┼──────────────────────┼─────────────┼──────────────┼────────────────────────────┤
│ TOTAL AUTOMATED REGRESSION SUITE      │ Vitest + Pytest      │ 262 Tests   │ 262 Passed   │ 100% Pass Rate             │
└───────────────────────────────────────┴──────────────────────┴─────────────┴──────────────┴────────────────────────────┘
```
