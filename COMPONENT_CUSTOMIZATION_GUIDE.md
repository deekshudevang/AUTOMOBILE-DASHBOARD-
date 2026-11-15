# AUTOVERSE 3D — Component Customization Guide

## 1. Introduction

AutoVerse 3D enables real-time, parametric editing of automotive 3D components. Unlike static polygon models where the car is a single fused mesh, AutoVerse Schema 2.0 vehicles are built as an assembly of discrete, interactive components.

This guide walks through selecting, transforming, restyling, and exporting customized vehicle configurations.

---

## 2. Component Selection Workflow

There are two synchronized ways to select a component in the AutoVerse Studio:

### 2.1 Direct 3D Viewport Raycasting
- Simply click directly on any body part in the 3D viewport (e.g. the front splitter, rear wing, brake caliper, or hood).
- The engine uses Three.js raycasting to detect the clicked mesh, traverses upward to find the registered `componentId`, highlights the object with an electric cyan emissive outline, and opens its controls in the Inspector.

### 2.2 Component Hierarchy Tree
- The left sidebar displays an expandable hierarchy tree organized into:
  - **Body Panels** (bumpers, hood, roof, doors, fenders, side skirts)
  - **Aerodynamics** (splitters, wings, spoilers, diffusers)
  - **Lighting** (projector headlights, LED lightbars)
  - **Glazing / Windows** (windshield, rear glass, quarter windows)
  - **Wheels** (4 independent corners)
  - **Exhaust Outlets**
  - **Interior Cockpit**
- Clicking any component in the tree highlights it in the 3D scene and centers the inspector.

---

## 3. Parametric Modification Capabilities

### 3.1 Position, Rotation, and Scaling
In the **Component Inspector** (right panel), adjusting sliders applies instant real-time matrix updates:
- **Position ($X, Y, Z$):** Fine-step translation in metric units.
  - $X$: Lateral offset (outward/inward stance).
  - $Y$: Height offset (chassis clearance).
  - $Z$: Longitudinal offset (forward/backward placement).
- **Rotation (Pitch, Yaw, Roll):** Rotational angles in degrees with full gimbal-safe rotation matrices.
- **Scale:** Uniform and non-uniform scaling multipliers ($0.5\times$ to $2.0\times$).

### 3.2 Material Finishes and Color Tuning
AutoVerse supports 9 physically-based automotive materials:
1. **Metallic Paint:** High specular clearcoat ($1.0$), low roughness ($0.22$), high metalness ($0.75$).
2. **Gloss Paint:** Wet-look clearcoat layer ($0.90$), moderate metalness ($0.45$).
3. **Matte Paint:** Satin finish, zero clearcoat, high diffuse micro-roughness ($0.65$).
4. **Carbon Fiber:** $2\times2$ twill weave styling with specular anisotropy.
5. **Forged Carbon:** Marbled carbon composite with multi-directional reflections.
6. **Chrome:** Conductor reflection with $0.98$ metalness and $0.04$ roughness.
7. **Billet Alloy:** Brushed metallic look for wheels, suspension arms, and intakes.
8. **Automotive Glass:** High transmission, index of refraction (IOR) of $1.52$.
9. **Interior Leather:** Supple matte finish with realistic organic diffuse absorption.

Users can pick any color using the visual color picker or select from race-heritage presets (Rosso Corsa, Miami Blue, Racing Yellow, British Racing Green, Stealth Satin Black).

---

## 4. Context-Specific Component Controls

When specialized aerodynamic or stance components are selected, the inspector unlocks dedicated engineering controls:

### 4.1 Wheel Corners (`wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr`)
- **Negative Camber Angle:** Adjust wheel camber from $-7.0^\circ$ (aggressive track stance) to $+1.0^\circ$.
- **Tire Width & Aspect Ratio:** Alter tire footprint width and sidewall profile.
- **Brake Caliper Customizer:** Set caliper paint (e.g. Acid Green, Brembo Red, Carbon Gold, or Cyan).

### 4.2 Aerodynamic Rear Wings (`rear_wing`, `spoiler`)
- **Angle of Attack (AoA):** Adjust blade pitch angle from $-5^\circ$ to $+25^\circ$.
- **Wing Span:** Increase or decrease wing width to align with rear fender flares.
- **Pylon Height:** Raise or slam the wing relative to the rear deck lid.

### 4.3 Front Splitters & Rear Diffusers
- **Splitter Projection:** Extend the front aerodynamic lip for downforce tuning.
- **Diffuser Fins:** Configure the number of vertical underbody fins (2 to 8 fins) and rake angle.

---

## 5. Exporting Custom Builds

Once customization is complete:
1. **Save Configuration:** Persists changes locally in the browser's persistent storage.
2. **Export JSON:** Generates a complete Schema 2.0 JSON configuration including the original vehicle specification alongside the full `componentOverrides` ledger.
3. **Export GLB (3D Model):** Compiles the live Three.js scene graph, converts geometry buffers and PBR materials into binary `.glb` format, and downloads the model ready for import into Blender, Unreal Engine 5, Unity, or WebGL viewers.

