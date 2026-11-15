# AUTOVERSE 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver AUTOVERSE 3D — an enterprise-grade 3D automotive customization application that imports multiple vehicle JSON configuration files (specifically Cherax Entity format and generic vehicle JSONs), maps them to compatible vehicle 3D assets, renders interactive WebGL 3D cars with metallic/clearcoat PBR shaders, provides complete body/wheel/neon/mod customization, multi-car comparison studio, bidirectional JSON explorer, asset manager, and export capabilities.

**Architecture:** A Vite + React + TypeScript single-page application utilizing Three.js and React Three Fiber / Drei for GPU-accelerated 3D vehicle rendering, Zustand for unified reactive state management with two-way JSON synchronization, and Tailwind CSS adhering to the Unslop design standard (graphite neutral ramp, electric cyan accents, zero AI fluff).

**Tech Stack:** React 18/19, TypeScript, Vite, Three.js, @react-three/fiber, @react-three/drei, Zustand, Tailwind CSS, Lucide React, JSZip, Canvas API.

**Spec:** MASTER ENGINEERING PROMPT: AUTOVERSE 3D (Phases 1 through 14).

## Global Constraints
- Target 60 FPS smooth rendering on Windows 11 PC with NVIDIA RTX 4060 GPU.
- Strictly adhere to the Unslop Design Standard: graphite background (`#0B0D10`), charcoal panels (`#13171F`), electric cyan accents (`#00F0FF`), clean typography, 4px spacing scale, single tinted neutral ramp.
- Zero fabrication rule: Never label an approximate model as the exact vehicle; show explicit Missing-Asset states with custom model import options.
- Preserve 100% of unknown JSON properties and original formatting on round-trip export.
- Working code only with full automated testing and verification before completion.

## Review Focus
1. Model resolution failures: When an unknown joaat hash is encountered, the app must gracefully render the diagnostic missing-asset card and allow binding custom GLB/GLTF models.
2. Two-way sync race conditions: Modifying JSON in raw editor must update 3D scene without cyclical infinite loops; slider/color changes in 3D must update JSON text immediately.
3. WebGL memory leaks: Switching rapidly between vehicles or comparison modes must dispose of geometries, materials, and textures cleanly.
4. Custom RGB vs Palette Color index: Vehicle configs with `isPrimaryColorCustom: false` must look up the exact GTA color index; when `true`, must use `customPrimaryColor`.
5. Missing or optional JSON properties: Handle files without `extras`, `driftTyres`, `bulletproofTyres`, or `attachments` without throwing undefined errors.

---

### Task 1: Project Scaffolding & Foundation
- Setup Vite + React + TypeScript project with Tailwind CSS and core dependencies.
- Configure path aliases and build scripts.
- **Verification**: `npm run build` succeeds without warnings.

### Task 2: Data Models & Core Utilities
- Implement Joaat hashing, GTA 160-color palette, mod slot mappings (mod0..mod49), and wheel types.
- Build schema-flexible JSON parser with Cherax Entity adapter, validator, and round-trip serializer.
- Include the pre-compiled `vehicleDatabase.json` containing all 108 configurations and 74 unique models.
- **Verification**: Unit tests pass verifying Joaat resolution, color conversions, and JSON parsing.

### Task 3: Zustand Store & Two-Way State Synchronization
- Build `useVehicleStore` with active vehicle, configuration state, dirty tracking, history stack (undo/redo), and preset camera triggers.
- Build `useComparisonStore` for multi-vehicle comparison mode.
- Build `useAssetRegistryStore` for runtime GLB/GLTF model bindings and custom user uploads.
- **Verification**: Store actions mutate state immutably; history undo/redo operates reliably.

### Task 4: 3D Graphics Engine & Automotive Shader Pipeline
- Build `SceneCanvas` with WebGL renderer, studio lighting, HDR environment reflections, soft contact shadows, and ground plane grid.
- Implement camera controller with smooth transitions for presets: Front, Rear, Left, Right, Top, Isometric, Interior, and 360 Spin.
- Build high-fidelity PBR automotive materials: Metallic/Clearcoat paint, tinted glass, reflective chrome rims, rubber tires, LED headlights, glowing taillights, and neon underglow point lights.
- Provide authentic 3D vehicle geometries (BMW M3, Porsche 911, Audi R8, Lamborghini Huracán, Ferrari SF90, Toyota Supra MK4, Nissan RX-7, Mercedes-AMG GT) and support for loading external GLB/GLTF/OBJ/FBX assets.
- **Verification**: Canvas renders at target FPS; paint clearcoat, glass opacity, and neon lights respond dynamically to store state changes.

### Task 5: Premium Dark Automotive UI & Sidebar Layout
- Implement `NavigationSidebar` with 10 modules: Dashboard, Library, 3D Studio, JSON Explorer, Customization, Comparison, Asset Manager, History, Export Center, Settings.
- Implement responsive layout with status badges, vehicle summary pills, and crisp Lucide icons.
- Implement Unslop theme styling with zero AI clichés.
- **Verification**: Switching modules renders correct views with smooth transitions.

### Task 6: Dashboard & Fleet Overview Module
- Display fleet metrics: Total JSONs (108), Unique Models (74), 3D Model Assets Available, Missing Assets, Category Breakdown.
- Display recent vehicles, manufacturer distribution cards, and quick actions.
- **Verification**: Metrics match `JSON_SCHEMA_REPORT.md` exactly.

### Task 7: Searchable Vehicle Library Module
- Implement grid and list view with search by vehicle name, GTA code, real-world model, or hash.
- Multi-filter by Manufacturer (BMW, Audi, Porsche, Lamborghini, Ferrari, Toyota, Nissan, Mercedes, etc.) and Category (Supercar, Sports, Tuner, SUV, Muscle, Special).
- Multi-configuration drawer: clicking a vehicle with multiple configs (e.g. BMW M3 has 8 configs) allows choosing or comparing specific tunes.
- Duplicate configuration badge with side-by-side diff launcher.
- **Verification**: Filter results update accurately; selecting any vehicle loads it into 3D Studio.

### Task 8: 3D Studio & Fullscreen Viewport
- Integrated 3D viewport with floating camera presets, studio lighting controls (Studio Dark, Neon Night, Daylight, Showroom), wireframe toggle, and high-res screenshot capture button.
- Missing Asset diagnostic card overlay with drag-and-drop 3D asset binder when an asset is unassigned.
- **Verification**: Camera controls orbit smoothly; screenshot generates high-res PNG download with config metadata.

### Task 9: Comprehensive Customization Suite
- Tabbed customization panel:
  - **Body Paint**: Primary & Secondary color (GTA palette swatches + custom RGB Hex picker), finish type (Metallic, Matte, Gloss, Pearlescent), clearcoat roughness.
  - **Wheels**: Wheel type selector, wheel color palette, rim finish, drift tyres, bulletproof tyres.
  - **Body Modifications**: mod0 through mod49 interactive list with human-friendly slot names, current value, option stepper, and preview.
  - **Lighting & Neons**: Front, Rear, Left, Right neon toggles, custom neon RGB picker, Xenon headlight switch.
  - **Glass & Cabin**: Window tint index (None, Dark Smoke, Light Smoke, Limo, Pure Black), interior leather color, dashboard color.
  - **Extras & Plates**: extra0..extra15 toggles, license plate custom text input, plate style selector (Blue/White, Yellow/Black, Yankton).
- **Verification**: Every control immediately updates the 3D model and the active JSON configuration.

### Task 10: JSON Explorer & Bi-Directional Synchronizer
- Tree view with collapsible objects, type tags, and key-value search.
- Raw JSON code editor with Monaco/custom syntax highlighter, linting, error indicators, and format button.
- Two-way live synchronization: edits in 3D update JSON editor; typing in JSON updates 3D scene in real-time with debounce.
- Side-by-side JSON Diff viewer comparing any two vehicle configurations with line diff highlights.
- **Verification**: Bi-directional edits sync without infinite loops; JSON diff viewer correctly highlights altered keys.

### Task 11: Multi-Vehicle Comparison Studio
- Support 2, 3, or 4 synchronized 3D viewports.
- Synchronized orbit camera so inspecting one rotates all vehicles in lockstep.
- Side-by-side property diff matrix (paint, wheel type, tint, active mods, plate text).
- Multi-car screenshot capture.
- **Verification**: Multiple 3D canvases render smoothly without WebGL context loss.

### Task 12: Asset Manager & Modular Mesh Importer
- Drag-and-drop uploader for `.glb`, `.gltf`, `.obj`, `.fbx`, textures, and `.hdr` environments.
- 3D asset inspection: vertex count, triangle count, material slots, bounding box dimensions.
- Model-to-Hash binding: assign uploaded 3D mesh to any of the 74 vehicle hashes or create custom vehicle entries.
- Persistent local asset registry using IndexedDB / LocalStorage.
- **Verification**: Uploading a `.glb` binds to the selected vehicle and renders in 3D Studio.

### Task 13: Export Center & History Stack
- Single JSON export (formatted, original vs edited diff).
- Batch JSON export: download all 108 vehicle configurations or selected subset as a structured `.zip` archive.
- Configuration backup & restore (import backup `.json` or `.zip`).
- Undo/redo action timeline with timestamped modification log.
- **Verification**: Exported JSON parses identically to original, preserving all custom and unknown keys.

### Task 14: Automated Testing & Verification Suite
- Write Vitest unit tests for:
  - Joaat hash resolver
  - GTA color palette converter
  - Cherax Entity schema validator
  - Two-way JSON serialization & unknown key preservation
- Run build and test suites to verify zero errors or broken imports.
- **Verification**: All unit tests pass with 100% success.

### Task 15: Documentation & Handover
- Produce complete documentation: `README.md`, `ARCHITECTURE.md`, `VEHICLE_ASSET_GUIDE.md`, `MOD_MAPPING_GUIDE.md`, `INSTALLATION.md`, `TEST_REPORT.md`.
- Update `TASK.md` to reflect all completed phases.
- Final instructions for launching and testing the application.

