# AUTOVERSE UI/UX AUDIT — NAVIGATION & INFORMATION ARCHITECTURE
**Document ID**: `docs/audits/uiux-audit/07_NAVIGATION_AND_INFORMATION_ARCHITECTURE.md`  
**Phase**: Comprehensive UI/UX Audit & Automotive Design Identity Discovery  
**Audit Date**: November 24, 2026  
**Auditor**: Lead Product Designer, Automotive UI/UX Director, Senior Design Systems Architect  

---

## 1. THE 19-MODULE INFORMATION ARCHITECTURE PROBLEM

AutoVerse currently organizes its capabilities into 19 individual full-screen views registered in `src/App.tsx` and `src/components/sidebar/NavigationSidebar.tsx`:

```
Workspace:          CAD & Components:        Simulation & Aero:     Knowledge & System:
1. Dashboard        5. Component Library     11. Aero Studio        16. Engineering Reports
2. Vehicle Library  6. Parametric Editor     12. Mesh Generator     17. Learning Centre
3. Projects DAG     7. Assembly Validation   13. CFD Wind Tunnel    18. Asset Manager
4. 3D Studio        8. CAD Designer          14. Vehicle Dynamics   19. Settings
                    9. Geometry & Mesh       15. Results Analyzer
                   10. Material Studio
```

### Architectural Defect: "The Silo Maze"
Having 19 separate top-level views creates cognitive fatigue:
- A user customizing an exotic supercar frequently gets lost trying to figure out whether "Wheels" belongs in `3D Studio`, `Customizer`, `Component Library`, or `Parametric Editor`.
- Switching views causes a full re-mount and context rupture. When moving from `3D Studio` to `Aero Studio` or `CAD Designer`, the active car is frequently re-initialized or completely replaced by an abstract demo model.
- The sidebar consumes 256px of horizontal space on desktop displays, forcing the primary 3D car viewport to be continuously squeezed.

---

## 2. THE PROPOSED CONSOLIDATED INFORMATION ARCHITECTURE

Instead of 19 disconnected silos, AutoVerse should consolidate into **3 Core Operational Workstation Contexts**, anchored by a persistent, uninterrupted 3D vehicle canvas.

```
+=========================================================================================+
|                                     AUTOVERSE WORKSPACE                                 |
+=========================================================================================+
| [CONTEXT 1: FLEET PADDOCK]                                                              |
|   Explore 50 Schema 2.0 Supercars • OEM Specifications • Saved Builds Garage            |
|                                                                                         |
| [CONTEXT 2: 3D CAR ATELIER] (Primary Showroom & Customization)                          |
|   ├── Exterior & Aero Swapping (Global Parts Library)                                   |
|   ├── Bespoke Paint, Carbon & Finishes (Material Studio)                                |
|   ├── Stance, Wheels & Fitment (WheelRuleValidator)                                     |
|   ├── Cockpit & Interior Bespoke Trim (Procedural Interior Generator)                   |
|   └── Kinematic Access (One-Click Door, Bonnet & Clamshell Servos)                      |
|                                                                                         |
| [CONTEXT 3: ENGINEERING LAB] (Deep Technical Simulation & Verification)                 |
|   ├── Virtual Wind Tunnel (Live Aero Streamlines & Axle Downforce Balance)              |
|   ├── OpenFOAM CFD Cluster (Supercomputing Execution, Slices & Residuals)               |
|   ├── B-Rep Solid Modeler (STEP AP214 Export, G0/G1/G2 Continuity Analysis)            |
|   └── Vehicle Dynamics (Suspension Kinematics, Roll Centers, Telemetry)                |
+=========================================================================================+
```

---

## 3. MODE SWITCHING: "STUDENT" VS "ADVANCED ENGINEERING"

AutoVerse already possesses a foundational concept: `engineeringMode` ('student' vs 'advanced') in `useVehicleStore.ts`. However, currently this toggle only changes minor badge text in the header.

### Redesigned Role-Based Modes:

```
+-----------------------------------------------------------------------------------------+
| MODE                 | TARGET USER                   | INTERFACE BEHAVIOR               |
+----------------------+-------------------------------+----------------------------------+
| SHOWROOM / ATELIER   | Supercar Enthusiast,          | Minimalist luxury chrome;        |
|                      | Collector, Creative Modeler   | floating glass cards; full-bleed |
|                      |                               | 3D canvas; sound effects on;     |
|                      |                               | plain-English tooltips.          |
+----------------------+-------------------------------+----------------------------------+
| MOTORSPORT TELEMETRY | Performance Tuner, Track Day  | High-density MoTeC telemetry;    |
|                      | Driver, Aerodynamicist        | live downforce dials; tire slip  |
|                      |                               | angle heatmaps; roll center HUD. |
+----------------------+-------------------------------+----------------------------------+
| CAD & CFD WORKSTATION| Mechanical Engineer, Formula  | CATIA-style feature tree; wire-  |
|                      | Student, Aero Researcher      | frame mesh inspection; OpenFOAM  |
|                      |                               | boundary conditions; STEP export.|
+----------------------+-------------------------------+----------------------------------+
```

### Hotkey Switching:
The user can effortlessly switch between these three workstation layouts using the **`Tab`** key or a dedicated floating mode dock located in the top center of the screen:
- `[ 1 ] Atelier`
- `[ 2 ] Telemetry`
- `[ 3 ] CAD / CFD`

---

## 4. TOP BAR & SIDEBAR CONSOLIDATION

### Current Layout:
- Left Persistent Sidebar: 256px wide, 19 text buttons.
- Top Context Bar: 48px tall, displays active file, model hash, and dirty badge.
- Bottom Status Bar: 32px tall, displays FPS and memory.

### Redesigned Architecture:
1. **Collapsible 64px Icon Rail**:
   On desktop, the left sidebar automatically collapses into a sleek 64px vertical icon rail (`w-16`). Hovering over any icon smoothly reveals a flyout menu with keyboard shortcut badges.
2. **Auto-Hiding HUD Header**:
   The top context bar becomes a floating pill (`h-12`) positioned at top center, housing:
   - Vehicle Brand Logo + Model Name (e.g. *Ferrari 488 Pista*)
   - Mode Switcher (`Atelier` / `Telemetry` / `Engineering`)
   - Cloud Sync Status Dot (Green / Yellow)
   - Quick Actions: `Save Build (Ctrl+S)`, `Share (Ctrl+Shift+S)`, `Export GLB/STEP`
3. **Telemetry Status Footer**:
   The bottom status bar is integrated into the bottom-right corner of the canvas as a subtle, unobtrusive micro-pill (`FPS: 60 • Mem: 48MB • API: Online`).
