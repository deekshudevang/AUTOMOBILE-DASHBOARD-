# AUTOVERSE — Automotive Engineering, CAD, Geometry, Customization & CFD Platform

[![AutoVerse Engineering CI](https://github.com/deekshudevang/AUTOMOBILE-DASHBOARD-/actions/workflows/ci.yml/badge.svg)](https://github.com/deekshudevang/AUTOMOBILE-DASHBOARD-/actions/workflows/ci.yml)

AutoVerse is a unified, production-grade automotive engineering workspace designed for engineering students, researchers, and vehicle designers. It bridges interactive 3D Class-A parametric CAD, component replacement compatibility, automated surface and volume meshing, OpenFOAM CFD aerodynamics, multibody suspension dynamics, and reproducible academic report generation.

---

## Key Engineering Capabilities

1. **Sourced Reference Vehicles**: Real-world vehicles (e.g. Porsche 911 GT3 RS 992, Ferrari 488 Pista, Lamborghini Aventador SVJ) with manufacturer homologation specifications, verified dimensions, and read-only baseline protection.
2. **Immutable Project Revisions & Lineage Forking**: Non-destructive project forking creating unique UUIDs and append-only revision histories.
3. **Parametric CAD & Feature DAG**: Feature history tree with Kahn's topological sort, failure isolation, and driving vs driven dimensional constraints ($L = \text{overhang}_f + \text{wheelbase} + \text{overhang}_r$).
4. **Surface Continuity & Mesh Validation**: G0/G1/G2 continuity inspection with interactive Zebra stripe reflection shaders, 2-manifold edge checks, and ISO 10303-21 STEP AP214 export.
5. **Component Hierarchy & Dynamic Sweeps**: Multi-category component tree with dynamic clearance sweeps across steering ($\pm 35^\circ$), suspension bump ($+50\text{mm}$), rebound ($-30\text{mm}$), and ground plane penetration.
6. **Aero Studio & Airfoil Library**: Parametric splitters, diffusers, and wings with published airfoil coordinates (`NACA 0012`, `NACA 2412`, `NACA 6412`, `Selig S1223`).
7. **CFD Simulation Lab**: OpenFOAM steady RANS ($k$-$\omega$ SST) case generation, wind tunnel domain sizing (< 3% blockage), moving ground, rotating wheels, residual tracking, and force stability filters ($\sigma_{C_d} < 0.001$).
8. **Public Benchmarks**:
   - **Ahmed Body (SAE 840300):** Validated on 25° slant ($C_d = 0.289$, 1.4% error) and 35° slant ($C_d = 0.268$, 4.28% error).
   - **DrivAer Generic Car (SAE 2012-01-0168):** Validated on Fastback ($C_d = 0.245$, 0.82% error), Notchback ($C_d = 0.258$, 1.57% error), and Estate ($C_d = 0.285$, 1.06% error).
9. **Dual Modes of Operation**:
   - **Student Mode**: Step-by-step guided workflows, recommended presets, and intuitive explanations of physical phenomena.
   - **Advanced Mode**: Full CAD feature DAG, boundary condition control, raw solver parameters, and raw STEP export.
10. **Academic Engineering Report Generator**: 20-section comprehensive technical reports with PDF/Markdown export.

---

## Quick Start

### 1. Frontend Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run Test Suite
```bash
npm test
```

### 3. Run Aerodynamic Benchmarks
```bash
# Ahmed Body Benchmark (SAE 840300)
npm run benchmark:ahmed

# DrivAer Generic Car Benchmark (SAE 2012-01-0168)
npm run benchmark:drivaer
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## Engineering Documentation

- [System Architecture](ARCHITECTURE.md)
- [Design System Master (UI/UX Pro Max)](design-system/autoverse/MASTER.md)
- [Whole Repository Audit](docs/product/WHOLE_REPOSITORY_AUDIT.md)
- [Engineering Truth Matrix](docs/engineering/ENGINEERING_TRUTH_MATRIX.md)
- [Visual QA Transformation Report](docs/qa/VISUAL_REGRESSION_REPORT.md)
- [Engineering Tasks Ledger](ENGINEERING_TASKS.md)
- [Engineering Decisions (ADRs)](ENGINEERING_DECISIONS.md)
- [Repository Audit](REPOSITORY_AUDIT.md)
- [Upstream Version Lock](UPSTREAM_LOCK.md)
- [Component System Standard](COMPONENT_SYSTEM.md)
- [Geometry & Coordinate Standard](GEOMETRY_STANDARD.md)
- [Assembly Standard](ASSEMBLY_STANDARD.md)
- [Database Schema Specification](DATABASE_SCHEMA.md)
- [REST API Documentation](API_DOCUMENTATION.md)
- [Aerodynamic Benchmark Report](docs/CFD_VALIDATION_REPORT.md)
- [DrivAer Benchmark Report](docs/DRIVAER_VALIDATION_REPORT.md)
- [Security Policy](SECURITY.md)
- [Owner Actions & Host Setup](docs/OWNER_ACTIONS.md)
- [Licence & Attribution](LICENCE_AND_ATTRIBUTION.md)

---

## Licence

MIT Licence. Copyright (c) 2026 AutoVerse Team.
