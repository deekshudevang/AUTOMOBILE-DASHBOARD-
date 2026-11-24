# AUTOVERSE UI/UX AUDIT — SCREEN-BY-SCREEN AUDIT (SCREENS A–K)
**Document ID**: `docs/audits/uiux-audit/02_SCREEN_BY_SCREEN_AUDIT.md`  
**Phase**: Comprehensive UI/UX Audit & Automotive Design Identity Discovery  
**Audit Date**: November 24, 2026  
**Auditor**: Lead Product Designer, Automotive UI/UX Director, Senior Design Systems Architect  
**Evidence Reference**: Screenshots `01_dashboard.png` through `23_settings_view.png`  

---

## SCREEN A: DASHBOARD & SHELL ARCHITECTURE
- **Component Source**: `src/components/dashboard/DashboardView.tsx`, `src/components/shell/TopContextBar.tsx`, `src/components/shell/EngineeringStatusBar.tsx`, `src/components/sidebar/NavigationSidebar.tsx`
- **Screenshot Evidence**: `01_dashboard.png`
- **Current UX Rating**: **4.5 / 10**

### Strengths:
- Clean modular grid; high information density.
- Real-time metrics connection to fleet size (50 Schema 2.0 supercars) and system status.
- Quick navigation search input filters 19 views instantaneously.

### Critical Weaknesses:
1. **Lack of Automotive Emotion**: The dashboard looks like a Datadog server monitoring console or AWS billing dashboard. There is no large visual hero car rendering, no "Vehicle of the Day", no quick-resume card for the user's last custom build, and no high-contrast telemetry dials.
2. **Top Bar / Status Bar Redundancy**: `TopContextBar.tsx` displays the active vehicle name and dirty state, while `EngineeringStatusBar.tsx` at the bottom displays memory, FPS, and backend status. These two horizontal bars consume 96px of vertical height continuously, compressing content.
3. **Sidebar Search Placement**: The search bar inside `NavigationSidebar.tsx` is cramped at 12px font size; searching for modules does not offer keyboard shortcut hints (`Ctrl+K`).

### Redesign Directives:
- Replace static stat cards with an **Interactive Showroom Stage**: a live rotatable 3D hero vehicle taking center stage with floating telemetry HUD widgets (Downforce, 0-100 km/h, Power-to-Weight, Engine Code).
- Consolidate TopContextBar and EngineeringStatusBar into a single floating glass header with status pill indicators.

---

## SCREEN B: VEHICLE LIBRARY / FLEET GALLERY
- **Component Source**: `src/components/library/VehicleLibraryView.tsx`
- **Screenshot Evidence**: `02_vehicle_gallery.png`
- **Current UX Rating**: **5.2 / 10**

### Strengths:
- Comprehensive 50 Schema 2.0 vehicle catalog with accurate OEM specifications (chassis codes, engine types, curb weights, aero Cd).
- Instant category filter chips (Supercar, Hypercar, Track, GT, Classic).

### Critical Weaknesses:
1. **Card Clutter & Lack of Visual Hierarchy**: Each car card displays 8 separate text metadata fields (hash, manufacturer, layout, engine, power, weight, top speed, acceleration). The eye has no anchor point.
2. **Missing OEM Brand Crests**: Ferrari, Porsche, Lamborghini, McLaren, Koenigsegg cards look completely identical except for plain text strings. There are no high-resolution SVG manufacturer badges or signature brand colors.
3. **Generic Thumbnail Placeholders**: Several cards use generic silhouette icons instead of high-fidelity pre-rendered studio beauty shots or live 3D thumbnail previews.

### Redesign Directives:
- Design a **Paddock Fleet Selector**: Large widescreen horizontal carousel cards with authentic OEM manufacturer emblems, signature color badges (e.g. Rosso Corsa stripe for Ferrari, Guards Red for Porsche, Papaya Orange for McLaren), and a one-click "Launch into Atelier" action.

---

## SCREEN C: 3D CAR STUDIO & VIEWPORT
- **Component Source**: `src/components/studio/StudioView.tsx`, `src/components/3d/SceneCanvas.tsx`
- **Screenshot Evidence**: `03_car_studio_full.png`, `10_car_studio_open_everything.png`
- **Current UX Rating**: **5.8 / 10**

### Strengths:
- Three.js WebGL rendering of high-poly 50-car fleet; procedural PBR textures (metallic flake, carbon twill, tire siping, perforated leather).
- Animated aperture opening with authentic kinematics (dihedral butterfly doors on McLaren, scissor doors on Aventador, synchro-helix on Jesko).

### Critical Weaknesses:
1. **Severe Viewport Constriction**: 256px left navigation sidebar + top context bar + bottom camera dock squeeze the vehicle. The car does not feel grand or cinematic.
2. **Overlapping Ground Grid**: The CAD Three.js grid lines cut awkwardly through the vehicle tires, destroying the illusion of a luxury automotive photography studio.
3. **Floating Controls Colliding with Vehicle**: The bottom camera preset toolbar (`CAMERA_PRESETS`) hovers directly below the car; when orbiting the camera to a low three-quarter angle, the toolbar completely blocks the front splitter and front wheels.

### Redesign Directives:
- Expand canvas to **true 100vw × 100vh full-bleed**. 
- Replace harsh wireframe grid with a **Reflective Studio Dark Stage** with baked soft contact shadows under tires.
- Dock camera controls to a sleek, semi-transparent vertical rail on the left or auto-hide them during orbit gestures.

---

## SCREEN D: CUSTOMIZATION SIDEBAR & INSPECTOR
- **Component Source**: `src/components/customizer/CustomizationPanel.tsx`
- **Screenshot Evidence**: `05_car_studio_customization_sidebar.png`, `07_car_studio_paint_studio.png`, `08_car_studio_wheel_studio.png`
- **Current UX Rating**: **4.0 / 10**

### Strengths:
- 10 capability-driven tabs (Access, Exterior, Paint, Wheels, Tyres, Brakes, Aero, Interior, Lighting, Advanced).
- Real-time fitment calculation with WheelRuleValidator.
- Direct component slot swapping.

### Critical Weaknesses:
1. **The Double-Sidebar Nightmare**: A 288px left drawer displays the car fleet list while a 384px right panel displays customization controls. The user is trapped between two massive gray monoliths.
2. **Flat Button Lists**: In the Exterior tab, swappable components are rendered as a dense text list of flat buttons with generic icons. There are no visual previews of what the upgraded front bumper or rear wing looks like before clicking.
3. **Paint & Finish Disconnect**: Color swatches are tiny 24px circles with flat hex colors. Metallic vs Gloss vs Matte finishes are separate radio pills that don't visually reflect their material sheen in the UI.

### Redesign Directives:
- Collapse the left drawer entirely inside the Studio; vehicle switching belongs in a floating modal or top switcher.
- Redesign the right inspector as a **Floating Ergonomic Atelier Blade**: translucent frosted glass (`backdrop-blur-xl bg-black/60`), 3D material preview spheres, and visual component upgrade cards with thumbnail renders.

---

## SCREEN E: GLOBAL PARTS LIBRARY & CROSS-CAR SWAPPER
- **Component Source**: `src/components/gallery/GlobalPartsLibraryModal.tsx`
- **Screenshot Evidence**: `06_car_studio_global_parts_library.png`
- **Current UX Rating**: **4.9 / 10**

### Strengths:
- Deep cross-car compatibility engine; allows installing GT3 RS wing on Huracan or Aventador SVJ wheels on 488 Pista.
- Real-time compatibility checking and slot filtering.

### Critical Weaknesses:
1. **Full-Screen Blindfold**: The modal centers on screen and completely covers the car. The user cannot see how the part looks on the vehicle while browsing.
2. **Dense Data-Table Aesthetic**: Parts are presented in dense text rows with technical IDs (`aero_wing_porsche_992_gt3rs`) rather than high-resolution 3D thumbnail previews with manufacturer provenance.

### Redesign Directives:
- Convert the modal into a **Bottom Swapper Drawer / Carousel**: The car remains 100% visible in the upper viewport while parts slide horizontally along the bottom with live real-time hover preview directly on the 3D car.

---

## SCREEN F: VEHICLE ACCESS PANEL & KINEMATICS
- **Component Source**: `src/components/customizer/VehicleAccessPanel.tsx`
- **Screenshot Evidence**: `09_car_studio_vehicle_access_panel.png`, `10_car_studio_open_everything.png`
- **Current UX Rating**: **6.4 / 10**

### Strengths:
- Outstanding kinematic engineering; authentic OEM door mechanisms (scissor, butterfly, gullwing, synchro-helix, coach).
- "OPEN EVERYTHING" and "CLOSE EVERYTHING" master animated buttons.
- Direct linkage to procedural interior and engine bay generation.

### Critical Weaknesses:
1. **Sci-Fi Cyberpunk Button Styling**: The "OPEN EVERYTHING" button uses an electric cyan gradient with glowing cyan text that looks like a video game arcade button rather than a precision vehicle telemetry switch.
2. **Slider Clutter**: 6 individual aperture sliders create visual noise; users primarily want 1-click open/close or intuitive 3D gizmo dragging directly on the car door handles.

### Redesign Directives:
- Redesign master switches as **Motorsport Cockpit Toggles**: Satin anodized aluminum rocker switches with tactile click sound feedback and mechanical detents.
- Support direct 3D viewport interaction: clicking a door handle in 3D smoothly swings the door open.

---

## SCREEN G: CAD DESIGNER & B-REP SOLID MODELER
- **Component Source**: `src/components/views/CadDesignerView.tsx`
- **Screenshot Evidence**: `14_cad_designer.png`, `15_cad_properties_panel.png`
- **Current UX Rating**: **4.2 / 10**

### Strengths:
- Genuine analytical B-Rep geometry with STEP AP214 export.
- G0, G1, G2 surface continuity analysis with zebra stripe reflection shader.

### Critical Weaknesses:
1. **Complete Disconnection from the Car**: When entering CAD Designer, the user's active car disappears. They are presented with an isolated gray box or cylinder primitive.
2. **Cluttered Engineering Sliders**: G0/G1/G2 tolerances are plain numeric sliders without visual curvature comb diagrams or color-coded surface error heatmaps.

### Redesign Directives:
- Integrate CAD directly into the Car Studio: Allow selecting any component on the vehicle (e.g. Rear Wing or Front Splitter) and entering **"CAD Inspection Mode"** where the selected part isolates into high-precision B-Rep wireframe with zebra analysis while ghosting the vehicle chassis around it.

---

## SCREEN H: AERODYNAMICS STUDIO
- **Component Source**: `src/components/views/AeroStudioView.tsx`
- **Screenshot Evidence**: `16_aerodynamics_studio.png`
- **Current UX Rating**: **4.6 / 10**

### Strengths:
- Downforce, drag coeff (Cd), frontal area, and aero balance percentage calculations.
- Speed-dependent aero load slider (80 km/h to 350 km/h).

### Critical Weaknesses:
1. **Static 2D Feeling**: The screen presents static SVG streamline overlays rather than an interactive 3D particle wind tunnel.
2. **Data Presentation**: Metrics are locked in rigid dark boxes without dynamic motorsport telemetry gauges (e.g. MoTeC or Bosch aero balance dials).

### Redesign Directives:
- Transform into an **Interactive Virtual Wind Tunnel**: 3D smoke streamlines rushing over the vehicle body with velocity color gradients (blue to red), live downforce arrows pressing down on front and rear axles, and real-time drag force vectors.

---

## SCREEN I: CFD LAB & OPENFOAM WIND TUNNEL
- **Component Source**: `src/components/views/CfdLabView.tsx`
- **Screenshot Evidence**: `17_cfd_lab_queue.png`, `18_cfd_lab_residuals.png`
- **Current UX Rating**: **5.0 / 10**

### Strengths:
- Real OpenFOAM CFD execution with WSL2 / Docker worker backend.
- Empirical Ahmed body benchmark validation; live residual convergence tracking.

### Critical Weaknesses:
1. **Plain Terminal / Form Layout**: Looks like a server configuration page. Parameter inputs are plain HTML boxes with minimal visual feedback.
2. **Residual Plots Lack Interactivity**: SVG residual curves lack hover tooltips, logarithmic scale toggles, and convergence threshold guidelines.

### Redesign Directives:
- Redesign as a **Formula 1 Supercomputing Terminal**: High-density engineering HUD with dark titanium textures, live CPU/cluster utilization meters, real-time slice planes across the car, and interactive logarithmic convergence charts.

---

## SCREEN J: VEHICLE DYNAMICS & TELEMETRY
- **Component Source**: `src/components/views/VehicleDynamicsView.tsx`
- **Screenshot Evidence**: `19_vehicle_dynamics.png`, `20_vehicle_dynamics_telemetry.png`
- **Current UX Rating**: **4.8 / 10**

### Strengths:
- True aero-dynamics coupling (downforce compressing suspension, altering ride height, which alters underbody ground-effect diffuser aero).
- Dynamic roll center, lateral load transfer, and scrub radius calculations.

### Critical Weaknesses:
1. **Zero Mechanical Visuals**: No suspension geometry diagram, no double-wishbone / multi-link kinematic schematic, no tire contact patch load visualization. Everything is presented in raw text tables.

### Redesign Directives:
- Add a **Dynamic Chassis & Suspension Rig Visualizer**: An interactive 3D/2D suspension kinematic schematic showing roll center migration, camber gain curves under 1.2G lateral load, and tire contact patch heatmaps.

---

## SCREEN K: SETTINGS, ASSET MANAGER & SAVED BUILDS
- **Component Source**: `src/components/settings/SettingsView.tsx`, `src/components/assetManager/AssetManagerView.tsx`, `src/components/customizer/SavedBuildsModal.tsx`
- **Screenshot Evidence**: `21_projects_view.png`, `22_saved_builds_modal.png`, `23_settings_view.png`
- **Current UX Rating**: **4.7 / 10**

### Strengths:
- Backend persistence verification with cloud sync status pills; graphics quality controls.

### Critical Weaknesses:
- Utility views styled as plain admin tables. Saved builds lack visual thumbnail cards of the customized car.

### Redesign Directives:
- Saved builds must be displayed as **Collector Garage Slots**: 3D vehicle snapshot cards with custom paint swatches, total build cost/spec sheet, and 1-click cloud sharing links.
