# AUTOVERSE 3D — Installation & Operational Guide
## Automotive Authentic Geometry Engine (AAGE) & Configurator Platform

**Document**: `INSTALLATION.md`  
**System**: AutoVerse 3D AAGE  
**Version**: 1.0.0  
**Date**: November 2026  

---

## 1. System Requirements

Ensure your development and runtime environment meets the following specifications:
- **Node.js**: v18.0.0 or higher (Tested on Node.js v24.19.0).
- **Package Manager**: npm v10+ or v11+.
- **Operating System**: Windows 10/11 (64-bit), macOS, or Linux.
- **Graphics Hardware**: NVIDIA GeForce RTX 3060 / 4060, AMD Radeon RX 6000+, or Intel Arc (WebGL 2.0 and hardware acceleration required).
- **Browser**: Google Chrome 120+, Microsoft Edge 120+, or Mozilla Firefox 120+.

---

## 2. Installation & Quick Start

### Step 1: Open Terminal in Project Root
```powershell
cd c:\Users\deeks\Downloads\cars
```

### Step 2: Install Node Dependencies
```powershell
npm install
```

### Step 3: Run Vitest Unit & Integration Test Suite
Verify that all 83 automated unit tests across the 9 test suites pass:
```powershell
npm test -- --run
```

Expected output:
```
 Test Files  9 passed (9)
      Tests  83 passed (83)
```

### Step 4: Launch Frontend Configurator Studio
```powershell
npm run dev
```
The application will launch on `http://localhost:5173`. Open this URL in any modern WebGL2 browser.

### Step 5 (Optional): Launch Offline SQLite Backend Server
For persistent background job queuing and vehicle database synchronization:
```powershell
npm run backend
```
The Fastify server starts on `http://127.0.0.1:3001` with local SQLite WAL database storage (`autoverse.db`).

---

## 3. Production Build & Verification

To compile the TypeScript monorepo and generate the production web bundle:
```powershell
npm run build
```
This runs `tsc && vite build`, creating the minified assets in `dist/`.

To preview the production bundle locally:
```powershell
npm run preview
```

---

## 4. Multi-Package Architecture

AutoVerse 3D is organized as a decoupled monorepo in `packages/`:
- **`@autoverse/authentic-geometry-engine`**: Universal automotive geometry engine, STEP CAD parser, topology analyzer, component recognizer, dimensional validator, quality provenance classifier, and runtime optimizer.
- **`@autoverse/shared-types`**: Canonical TypeScript contracts for vehicles, assets, tuning states, and 4-level status reports.
- **`@autoverse/gta-compat`**: 32-bit Joaat hashing, 160+ GTA color swatches, and mod0–mod49 slot dictionaries.
- **`@autoverse/json-intelligence`**: Schema detector, FiveM XML parser, and lossless JSON round-trip preservation.
- **`@autoverse/vehicle-registry`**: 74 unique models mapped with Joaat hashes and confidence scores.
- **`@autoverse/vehicle-generation-engine`**: Parametric surface lofting and procedural chassis generation (Class D).
- **`@autoverse/vehicle-asset-pipeline`**: 5-tier asset resolver and asset metadata inspector.
- **`@autoverse/vehicle-exporter`**: Cherax JSON, FiveM `vehicles.meta` XML, and fleet ZIP generator.

---

## 5. Ingesting Authentic 3D Assets

To replace procedural Class D geometry with authentic Class A / Class B geometry:
1. Open the **Asset Manager** tab in the sidebar.
2. Select your vehicle model from the dropdown (e.g. `BMW M3 Competition (G80)`).
3. Drag and drop any 3D geometry file into the upload zone:
   - Supported extensions: `.glb`, `.gltf`, `.obj`, `.fbx`, `.stl`, `.ply`, `.step`, `.stp`.
4. The AAGE engine will automatically:
   - Detect and normalize unit scaling (converting $mm$ to $m$).
   - Audit manifold topology and unit normals.
   - Decompose hierarchy into exterior panels, cockpit controls, and wheels.
   - Verify dimensions against OEM specifications.
   - Issue a digital `ProvenanceCertificate`.
5. Click **Assign & Save Asset**.
6. Switch back to the **3D Studio** to customize paints, wheels, underglow, and view the live Provenance Certificate HUD.

---

## 6. Troubleshooting & Diagnostics

- **WebGL Canvas is Blank / Black**: Verify hardware acceleration is enabled in your browser settings (`chrome://settings/system` -> "Use graphics acceleration when available").
- **Asset Appears Tiny or Enormous**: AAGE includes automatic spatial unit scale detection (`MeshTopologyAnalyzer.detectUnitScale`). If an asset uses custom non-standard units, ensure the bounding box length is greater than $1500$ for millimeters or between $1.5$ and $6.0$ for meters.
- **Mandatory Rule 6 Banner**: If a vehicle displays `APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY`, it is running the parametric procedural fallback. Ingesting an authentic CAD or high-poly production mesh will elevate it to Class A / Class B and dismiss the warning.
