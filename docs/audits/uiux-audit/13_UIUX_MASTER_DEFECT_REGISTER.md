# AUTOVERSE UI/UX AUDIT — MASTER DEFECT REGISTER (TOP 20 CRITICAL ISSUES)
**Document ID**: `docs/audits/uiux-audit/13_UIUX_MASTER_DEFECT_REGISTER.md`  
**Phase**: Comprehensive UI/UX Audit & Automotive Design Identity Discovery  
**Audit Date**: November 24, 2026  
**Auditor**: Lead Product Designer, Automotive UI/UX Director, Senior Design Systems Architect  

---

## 1. DEFECT SEVERITY CLASSIFICATION

- **P0 — CRITICAL**: Blocks primary user workflows, severely degrades core value proposition, causes severe visual claustrophobia or disorientation.
- **P1 — HIGH**: Degrades brand credibility, violates accessibility standards, creates cognitive friction or interaction lag.
- **P2 — MEDIUM**: Visual inconsistency, spacing misalignment, lack of tactile micro-interactions.

---

## 2. THE TOP 20 CRITICAL UI/UX DEFECTS

| # | Severity | Component / Area | File & Line References | Root Cause & Description | User Impact & Recommended Remediation |
| :- | :--- | :--- | :--- | :--- | :--- |
| **01** | **P0** | Car Studio Viewport | `src/components/customizer/CustomizationPanel.tsx:500-600` | Left car drawer (288px) and right inspector (384px) squeeze the 3D canvas down to < 50% width. | Vehicle is claustrophobically squeezed. Squeeze removed by converting sidebars into floating, auto-collapsing glass blades. |
| **02** | **P0** | Camera Framing on Kinematics | `src/components/3d/CameraRig.tsx:120-180`, `src/components/customizer/VehicleAccessPanel.tsx:290-318` | Camera pivot remains locked to vehicle center when doors and clamshell open high into air. | Open doors and engine bay are cropped off top of screen. Camera must pull back 12% and tilt up 5° smoothly upon opening. |
| **03** | **P0** | Cockpit View Dark Cabin | `src/components/3d/SceneCanvas.tsx:140-200`, `src/components/studio/StudioView.tsx:48-51` | Roof and pillars occlude exterior environment light; no cabin interior fill light is mounted. | Cabin interior is almost black. Add dynamic interior warm spot fill light (`3200K, intensity 1.8`) when cockpit camera active. |
| **04** | **P1** | Global Parts Library Blindfold | `src/components/gallery/GlobalPartsLibraryModal.tsx:40-120` | Modal centers on screen with opaque backdrop, completely blocking the 3D vehicle behind it. | User cannot see the car while browsing parts. Convert modal into a bottom sliding carousel with live 3D hover preview. |
| **05** | **P1** | Cyan Accent Overuse | `src/index.css:12-25`, `tailwind.config.js:30-45` | `#00F0FF` is used everywhere (buttons, borders, icons, badges, active tabs, slider tracks). | Looks like a generic cyberpunk crypto app. Replace with Obsidian neutrals and semantic Motorsport Red (`#E53935`). |
| **06** | **P1** | Text Contrast Failure (WCAG) | `src/components/sidebar/NavigationSidebar.tsx:130-160`, `src/components/studio/StudioView.tsx:220-238` | `text-[#64748B]` on `#11141C` yields contrast ratio of 3.8:1 (< 4.5:1 required by WCAG AA). | Eye strain and accessibility violation. Promote secondary text token to `#94A3B8` (6.8:1 contrast). |
| **07** | **P1** | Non-Tabular Digit Jitter | `src/components/customizer/VehicleAccessPanel.tsx:400-488`, `src/components/views/VehicleDynamicsView.tsx:180-260` | Telemetry readouts and aperture percentages render in standard proportional sans-serif font. | Numbers wobble horizontally when values change. Enforce `font-mono tabular-nums` across all telemetry. |
| **08** | **P1** | Flat 2D Paint Swatches | `src/components/customizer/CustomizationPanel.tsx:900-980` | Color swatches are flat 28px circles with plain hex fills; finish types are separate text radio pills. | Fails to show metallic flake, gloss sheen, or matte satin depth. Replace with 3D sculpted speedform swatches. |
| **09** | **P1** | Mobile Header Button Overflow | `src/components/studio/StudioView.tsx:240-288` | 5 action buttons crowd horizontally in top bar, clipping off-screen on viewports < 400px. | Broken mobile layout. Consolidate into a single floating action menu pill (`...`) on mobile breakpoints. |
| **10** | **P1** | Sub-Standard Mobile Touch Targets | `src/components/customizer/VehicleAccessPanel.tsx:415-425` | Aperture percentage buttons measure 28px × 24px (< 44px minimum touch target). | High error rate when tapping with human thumbs. Increase interactive tap area to 44px × 44px with transparent padding. |
| **11** | **P1** | Fragmented CAD Experience | `src/components/views/CadDesignerView.tsx:25-60` | Entering CAD Designer unmounts the active car and displays an isolated 3D box or cylinder. | Mental model rupture. Embed B-Rep CAD inspection directly into Car Studio for selected components. |
| **12** | **P1** | 19-Module Navigation Fatigue | `src/components/sidebar/NavigationSidebar.tsx:60-100` | 19 separate views in sidebar create confusion regarding where customization vs simulation lives. | Consolidate into 3 core contexts: Fleet Paddock, 3D Atelier, and Engineering Lab. |
| **13** | **P2** | Ground Grid Visual Intrusion | `src/components/3d/SceneCanvas.tsx:110-130` | Three.js `GridHelper` lines cut awkwardly through vehicle tires in showroom views. | Looks like a wireframe CAD tool. Replace with reflective onyx studio floor and baked tire ambient occlusion shadows. |
| **14** | **P2** | Camera Toolbar Collision | `src/components/studio/StudioView.tsx:296-330` | Bottom camera toolbar floats directly below car, clipping front splitter when camera orbits low. | Auto-hide camera dock during user orbit drag gestures or reposition to a sleek left vertical rail. |
| **15** | **P2** | Abrupt Camera Orbit Cuts | `src/components/3d/CameraRig.tsx:190-240` | Fast preset switching linearly interpolates camera through vehicle roof and body panels. | Disorienting polygon clipping. Implement curved bezier camera flypaths that swing around exterior bodywork. |
| **16** | **P2** | Generic HTML Range Sliders | `src/components/customizer/CustomizationPanel.tsx:1020-1100` | Native browser `<input type="range">` with plain round thumb and zero detent calibration marks. | Lacks tactile feel. Build custom machined-slot track with knurled rectangular slider thumb and floating tooltip. |
| **17** | **P2** | Vehicle Fleet Missing OEM Crests | `src/components/library/VehicleLibraryView.tsx:80-140` | 50 car cards show plain text names without authentic manufacturer crests or heritage colors. | Cheapens perception of exotic brands (Ferrari, Porsche, McLaren). Add authentic SVG crests and brand color tags. |
| **18** | **P2** | Non-Interactive CFD Residuals | `src/components/views/CfdLabView.tsx:320-380` | SVG residual plot curves lack hover crosshairs, logarithmic zoom, and coordinate tooltips. | Engineering frustration. Upgrade to interactive SVG/Canvas telemetry chart with synchronous value readout. |
| **19** | **P2** | Ultrawide Perimeter Isolation | `src/components/shell/TopContextBar.tsx:30-70`, `src/components/sidebar/NavigationSidebar.tsx:115-135` | On 3440px displays, UI elements anchor to extreme bezels, forcing neck strain. | Constrain floating HUD elements to a max-width container (`max-w-[2560px] mx-auto`) with undockable widgets. |
| **20** | **P2** | Missing Audio Feedback | Entire codebase | Zero sound design for mechanical door opening, toggle switches, or high-revving supercar engines. | Flat, sterile web app feeling. Introduce toggleable authentic mechanical switch clicks and engine rev audio clips. |
