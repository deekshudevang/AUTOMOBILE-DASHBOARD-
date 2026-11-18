# Page Design Specification: Dashboard
**Parent:** `design-system/autoverse/MASTER.md`  
**Route:** `dashboard`  
**Purpose:** Automotive Engineering Workspace Command Center

---

## 1. Visual Hierarchy & Layout
- **Hero Section:** Active Project & Vehicle Engineering Status (Fidelity placard, current revision, save state, direct "Launch Studio" and "New Project" CTAs).
- **KPI Metrics Bar:** 4 real metrics derived from store/backend (Registered Vehicles, Verified 3D Assets, Active Projects, Completed Simulations). Never use hardcoded strings or fake 100% claims.
- **Active Vehicle Showcase:** High-resolution preview of the currently loaded model, chassis dimensions, component availability, and geometry provenance.
- **Engineering Health & Solvers:** Live truthful status of API, Database, CAD Kernel, Mesh Generator, and CFD Solver.
- **Recent Projects & Revisions:** Quick resume list with vehicle names, revision dates, and change hashes.
- **Telemetry Charts:** Project status breakdown and CFD lift/drag polar distributions using authentic application data.
- **Quick Launch Panel:** One-click shortcuts to 3D Studio, Vehicle Library, CAD Designer, Aero Studio, and CFD Wind Tunnel.
