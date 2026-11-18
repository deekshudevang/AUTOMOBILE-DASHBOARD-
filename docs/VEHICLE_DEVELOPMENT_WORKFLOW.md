# AutoVerse 3D v2 — Vehicle Development & Comparison Workflow Guide

**Workflow Specification:** End-to-End Vehicle Conception, Reconstruction, Parametric Editing, Aero Packaging, and CFD Comparison  
**Modules:** `src/workflow/vehicleDevelopmentWorkflow.ts`, `src/workflow/engineeringComparisonDiff.ts`, `src/projects/projectManager.ts`  

---

## 1. Guided Non-Linear Development Flow

AutoVerse 3D provides a structured 9-stage engineering pipeline:

```
[1. Select Reference] ---> [2. Fork Project] ---> [3. Parametric Dimensions]
                                                            |
[6. Packaging Checks] <--- [5. Aero Components] <--- [4. Body Surfacing]
         |
[7. OpenFOAM CFD]     ---> [8. Engineering Diff] ---> [9. STEP / STL Export]
```

### Stage Summary:
1. **Select Reference Vehicle**: Browse verified manufacturer reference catalog (read-only).
2. **Fork Independent Project**: Non-destructive fork creates unique project UUID, preserves lineage pointer, and unlocks editing.
3. **Parametric Dimensions**: Adjust wheelbase, track, overhangs, and ground clearance via the constraint solver.
4. **Class-A Body Surfacing**: Modify loft cross sections, examine G0/G1/G2 continuity with zebra striping.
5. **Aerodynamic Development**: Select airfoil profiles, parameterize splitters, diffusers, and wings.
6. **Vehicle Systems Packaging**: Run clearance sweeps (tire-to-arch, ground clearance, powertrain hood envelope).
7. **OpenFOAM Simulation**: Execute CFD-readiness gate checks, generate case bundle, monitor residuals and force convergence.
8. **Engineering Comparison Diff**: Compute verified-equivalent dimensional, mass, and aerodynamic deltas.
9. **Export & Report Generation**: Export STEP AP214 B-rep solids, watertight STLs, OpenFOAM cases, and reproducible Markdown reports.

---

## 2. Comparison Mode & Equivalence Guard Rules

Under Master Prompt v2 §15, AutoVerse 3D **refuses to compute deltas** if simulation conditions differ:

- **Solver Equivalence**: Both baseline and modified variants must use the identical numerical solver.
- **Provenance Category Match**: A `[CFD]` run cannot be compared directly with an `[ANALYTIC]` estimate.
- **Convergence Proof**: Unconverged runs ($\sigma_{C_d} \ge 0.001$) cannot be used to declare drag reduction.
- **Statistical Significance**: Drag changes smaller than the numerical noise threshold ($\pm 0.003$) are flagged as statistically insignificant.

---

## 3. Project File Bundle Standard (§6)

Saved and exported project packages follow a modular JSON + Geometry directory layout:
```
vehicle_project/
  project.json            (UUID, name, schemaVersion, lineage, timestamps)
  vehicle_identity.json   (manufacturer, model, generation, year, category)
  dimensions.json         (overall dimensions, wheelbase, track, ground clearance)
  geometry_manifest.json  (file inventory, SHA-256 hashes, ISO 8855 SAE coordinates)
  components.json         (component tree, attachment points, mass estimates)
  constraints.json        (parametric driving vs driven dimension rules)
  materials.json          (PBR paint, carbon fiber, glass, rubber bindings)
  aerodynamics.json       (airfoil codes, wing angles, diffuser expansion)
  simulation_config.json  (speeds, mesh refinement settings, solver parameters)
  validation.json         (quality gate check results, issue logs)
  references.json         (source press kits, homologation data, retrieval dates)
  history.json            (immutable feature DAG serialization)
```
