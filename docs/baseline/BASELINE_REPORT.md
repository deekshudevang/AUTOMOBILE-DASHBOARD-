# AUTOVERSE 3D — Baseline Pre-Configurator Report
**Date:** 2026-11-15T14:20:16.018Z  
**Git Branch:** `feat/autoverse-configurator`  
**Git Baseline Tag:** `pre-configurator-baseline`  

---

## 1. Environment & Tooling
- **Node.js Version:** v24.19.0
- **npm Version:** 11.4.1
- **Platform:** Windows 11 (x64)
- **UI/UX Pro Max Skill Preflight:** Checked. Skill is NOT globally installed. Design brief will be applied directly as specified in Section 1.4.

---

## 2. Test Suite Baseline
```
> autoverse-3d@1.0.0 test
> vitest run --run


[1m[46m RUN [49m[22m [36mv3.2.7 [39m[90mC:/Users/deeks/Downloads/cars[39m

 [32m✓[39m src/utils/__tests__/core.test.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/utils/__tests__/workflow.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/packages.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/exporter.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/schema2-library.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 202[2mms[22m[39m
 [32m✓[39m tests/geometry-engine.test.ts [2m([22m[2m22 tests[22m[2m)[22m[32m 102[2mms[22m[39m
 [32m✓[39m tests/authentic-geometry-engine.test.ts [2m([22m[2m18 tests[22m[2m)[22m[32m 36[2mms[22m[39m
 [32m✓[39m tests/milestone1-bmw.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 40[2mms[22m[39m
 [32m✓[39m tests/milestone2-fleet.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 229[2mms[22m[39m
 [32m✓[39m tests/backend.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 206[2mms[22m[39m
 [32m✓[39m tests/parametric-geometry.test.ts [2m([22m[2m13 tests[22m[2m)[22m[33m 656[2mms[22m[39m
   [33m[2m✓[22m[39m AutoVerse 3D — Parametric Vehicle Geometry Engine Suite[2m > [22mAutoVerse 50-Vehicle Parametric Supercar Library Audit[2m > [22mverifies all 50 vehicle files parse and generate valid 3D geometry without errors [33m 561[2mms[22m[39m

[2m Test Files [22m [1m[32m11 passed[39m[22m[90m (11)[39m
[2m      Tests [22m [1m[32m102 passed[39m[22m[90m (102)[39m
[2m   Start at [22m 19:50:03
[2m   Duration [22m 2.07s[2m (transform 1.11s, setup 0ms, collect 4.31s, tests 1.50s, environment 2ms, prepare 1.56s)[22m
```

---

## 3. Production Build Baseline
```
> autoverse-3d@1.0.0 build
> tsc && vite build

[36mvite v6.4.6 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2293 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m    0.90 kB[22m[1m[22m[2m │ gzip:   0.53 kB[22m
[2mdist/[22m[35massets/index-Vgk2WDxR.css  [39m[1m[2m   27.90 kB[22m[1m[22m[2m │ gzip:   5.51 kB[22m
[2mdist/[22m[36massets/index-E7V3fJBq.js   [39m[1m[33m1,803.38 kB[39m[22m[2m │ gzip: 467.91 kB[22m
[32m✓ built in 6.68s[39m
```

---

## 4. Visual Baseline Screenshots
Screenshots stored in `docs/baseline/screenshots/`:
- `customizer_view.png`
- `schema2_aventador_customizer.png`
- `studio_view.png`

---

## 5. Golden Fixtures Set
- **Location:** `tests/fixtures/vehicles/`
- **Count:** 109 vehicle JSON configurations preserved as immutable backwards-compatibility contract.
