# AUTOVERSE UI/UX AUDIT — CAR STUDIO EXPERIENCE AUDIT
**Document ID**: `docs/audits/uiux-audit/03_CAR_STUDIO_EXPERIENCE_AUDIT.md`  
**Phase**: Comprehensive UI/UX Audit & Automotive Design Identity Discovery  
**Audit Date**: November 24, 2026  
**Auditor**: Lead Product Designer, Automotive UI/UX Director, Senior Design Systems Architect  
**Evidence Reference**: Screenshots `03_car_studio_full.png`, `05_car_studio_customization_sidebar.png`, `09_car_studio_vehicle_access_panel.png`, `10_car_studio_open_everything.png`, `11_car_studio_interior_camera.png`, `12_car_studio_engine_bay_camera.png`  

---

## 1. THE ESSENCE OF A LUXURY 3D CAR CONFIGURATOR

In the automotive digital realm, the Car Studio is not just a feature — **it is the product**. 

Whether on the web or in an architectural showroom kiosk, a customer evaluating an exotic vehicle expects a visceral emotional connection. The metallic flake must catch the overhead studio softboxes as the car rotates; the satin carbon fiber weave must exhibit authentic anisotropic specular highlights; the cockpit must invite the viewer to climb inside; and every control must feel as finely weighted and satisfying as the knurled aluminum rotary switch in a Bentley or Bugatti.

---

## 2. VIEWPORT UTILIZATION & GEOMETRY CROWDING

### The Viewport Arithmetic Today (1920 × 1080 Display):

```
+-----------------------------------------------------------------------------------------+
| [256px Left Nav]  | [288px Fleet Drawer] |     [992px Viewport]      | [384px Inspector]|
|                   |                      |                           |                  |
|                   |                      |   Vehicle Squeezed Into   |                  |
|                   |                      |     51.6% Width Area      |                  |
|                   |                      |                           |                  |
|                   |                      | [Bottom Floating Bar 80px]|                  |
+-----------------------------------------------------------------------------------------+
```

- Total Screen Area: 2,073,600 px²
- Nav & Shell Overhead: 552,960 px² (26.6%)
- Customizer Sidebars Overhead: 725,760 px² (35.0%)
- Effective Vehicle 3D Stage: **794,880 px² (38.3%!)**

### The Core Problem:
More than **61% of the screen** is consumed by chrome, sidebars, borders, buttons, and footers. The user has to zoom out significantly so the front splitter and rear spoiler do not clip under the left and right panels. Because the vehicle is zoomed out to fit the narrow slit, fine details — such as brake caliper logos, tire tread siping, steering wheel stitches, and carbon weave patterns — become completely invisible.

### The Target Supercar Configurator Standard:
- **Ferrari & Porsche Standard**: **90% to 94%** of the screen dedicated to the 3D canvas.
- Controls are transparent HUD layers docked to corners or perimeter margins with subtle auto-collapse behaviors.

---

## 3. CAMERA CONTROLS & ORBIT FEEL

### Current Implementation:
`CameraRig.tsx` utilizes Three.js `OrbitControls` with custom preset transitions for `isometric`, `front`, `rear`, `left`, `right`, `top`, `cockpit`, `engine_bay`, and `boot`.

### Strengths:
- Damped camera smoothing (`dampingFactor: 0.05`) provides fluid rotation.
- Collision bounding sphere prevents camera from clipping under the ground plane.

### Critical UX Deficiencies:
1. **Target Pivot Locking During Kinematic Openings**:
   When the user clicks "OPEN EVERYTHING", the vehicle's doors open high into the air (dihedral butterfly or scissor mechanisms) and the rear engine clamshell elevates. However, the camera target pivot remains locked to the vehicle origin `[0, 0.4, 0]`. As a result, the open engine bay is positioned near the top edge of the screen, partially cropped out.
2. **Abrupt Camera Transitions**:
   Switching between "Exterior 3/4" and "Cockpit View" performs a linear camera interpolation that occasionally passes straight through the roof geometry, causing a disorienting 1-frame polygon flash before settling inside the cabin.
3. **No Dynamic Depth of Field (DoF)**:
   In real automotive photography, close-up details (wheels, headlights, engine plenum) utilize a wide aperture lens (f/1.8 to f/2.8) that blurs the background studio into a creamy bokeh. AutoVerse's camera is pinhole sharp across infinite depth, making rendered objects look computer-generated.

---

## 4. LIGHTING ENVIRONMENT & PBR AUTHENTICITY

### Current Lighting Rig:
`SceneCanvas.tsx` employs:
- 1 × Directional Light (Sun)
- 1 × Ambient Light
- 2 × Point Lights for fill
- HDRI Environment Map (`studio-dark`, `showroom`, `cyber-neon`)

### Visual Observations:
1. **Interior Cabin Darkness**:
   When switching to `cockpit` or `interior` camera view (`11_car_studio_interior_camera.png`), the interior cabin is excessively dark. Because the car body (roof, pillars, doors) physically occludes the exterior environment light, the steering wheel, sport seats, and center console are bathed in deep shadow. Without an automatic "cabin inspection fill light" that activates in interior mode, the rich procedural perforated leather and dashboard dials are almost impossible to see.
2. **Engine Bay Depth**:
   In `12_car_studio_engine_bay_camera.png`, the engine block sits deep inside the rear subframe. Because the key light shines from above at an angle, harsh geometric shadows obscure the twin turbos, intake manifold, and carbon strut brace.
3. **Ground Shadow Contact**:
   The contact shadow under the tires is rendered with a simple dark shadow plane. It lacks the realistic gradient of contact ambient occlusion where the tire meets the asphalt with zero light leak, causing the car to appear slightly detached from the floor.

---

## 5. HUD OVERLAYS & INTERACTION FLOW

### Top Floating Bar:
- Left: Vehicle name, quality badge ("V2 ENGINE", "OEM VERIFIED"), plate text.
- Right: "Select Vehicle", "Vehicle Access", "OEM Specs", "Customize", "Asset Manager".

### Issues:
- The top bar buttons are styled with opaque dark gray containers (`bg-autoverse-surface/90`) and solid borders that create visual barriers across the top of the canvas.
- The "Vehicle Access" button and "Customize" button open two different panels that fight for screen space on the right side. If both are opened or if the user switches rapidly, panels overlap or push each other out.

### Bottom Camera Toolbar:
- Displays 10 text buttons horizontally.
- On smaller laptops or narrow windows, this toolbar wraps into two lines or overflows off-screen.
- The icons and labels are small and repetitive.

---

## 6. CAR STUDIO REDESIGN BLUEPRINT

```
+-----------------------------------------------------------------------------------------+
|                                100vw × 100vh FULL-BLEED 3D STAGE                        |
|                                                                                         |
| [FLOATING HUD TOP]                                                 [COLLAPSIBLE BLADE]  |
| < PORSCHE 911 GT3 RS                                                + ACCESS & DOORS    |
|   4.0L Boxer-6 • 525 HP • 1,450 kg                                 + PAINT & LIVERY    |
|                                                                     + WHEELS & STANCE   |
|                                                                     + AERO & DOWNFORCE  |
|                                                                     + PERFORMANCE EXHAUST|
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
|                                                                                         |
| [COMPACT VERTICAL CAMERA RAIL]                                                          |
| (•) Iso  (•) Cockpit  (•) Engine  (•) Wheels                                            |
|                                                                                         |
| [REFLECTIVE ONYX STAGE WITH BAKED AMBIENT OCCLUSION CONTACT SHADOWS]                    |
+-----------------------------------------------------------------------------------------+
```

### Key Enhancements:
1. **100% Canvas Ownership**: The 3D canvas spans wall-to-wall.
2. **Right Atelier Blade**: A single, beautifully crafted 360px floating glass blade (`backdrop-blur-2xl bg-black/40 border border-white/10`) housing all customization and access controls in collapsible accordion sections.
3. **Dynamic Smart Camera Framing**:
   - When "Doors Open" is clicked: Camera smoothly pulls back 12% and tilts up 5° to keep the elevated wing doors and clamshell perfectly framed.
   - When "Interior View" is clicked: The roof mesh automatically ghosts/fades to 20% opacity and an invisible interior warm fill light activates (`3200K, intensity: 1.8`).
   - When "Engine Bay" is clicked: Camera sweeps down into the engine bay with shallow depth-of-field and targeted twin spot lights illuminating the intake plenum.
4. **Interactive Hotspots**:
   Small, pulsing, elegant hairline reticles on the 3D car body (e.g. at the door handle, wheel center cap, fuel filler door, rear wing). Clicking a hotspot directly opens that component's customization options without having to navigate menus.
