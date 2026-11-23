# AUTOVERSE — ONE-CLICK "OPEN EVERYTHING" & "CLOSE EVERYTHING" SPECIFICATION

**Feature**: Global Master Aperture Kinematics Controller  
**Engine**: Three.js, React Three Fiber, Zustande Store, AutoVerse Kinematics Solver  
**Status**: VERIFIED & DEPLOYED  

---

## 1. ARCHITECTURAL OVERVIEW

The "Open Everything" feature allows engineers and users to reveal the entire mechanical and interior architecture of any car with a single action. Rather than manipulating half a dozen separate sliders, clicking **OPEN EVERYTHING** triggers coordinated kinematic rotations across all moving body components while aligning the viewport camera to an expansive full-inspection perspective.

```
                                  +-----------------------+
                                  |    USER INTERFACE     |
                                  |   [OPEN EVERYTHING]   |
                                  +-----------+-----------+
                                              |
                                              v
                              +-------------------------------+
                              |    REQUEST ANIMATION FRAME    |
                              |   Cubic Ease-Out (750ms arc)  |
                              +---------------+---------------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
                     v                                                 v
         +-----------------------+                         +-----------------------+
         |    useVehicleStore    |                         |       CameraRig       |
         |  openingState: 1.0    |                         |  Preset:              |
         |  (2-door / 4-door)    |                         |  'full_inspection'    |
         +-----------+-----------+                         +-----------------------+
                     |
                     v
+------------------------------------------+
|      EditableVehicleAssembler.build      |
|  - Front Left Hinge Group Rotation       |
|  - Front Right Hinge Group Rotation      |
|  - Rear Doors (if doorCount === 4)       |
|  - Hood / Clamshell Hinge Group Rotation |
|  - Boot / Engine Cover Hinge Rotation    |
+------------------------------------------+
                     |
                     v
+------------------------------------------+
|           PHYSICAL 3D SCENE              |
|  - Cockpit & Instrument Cluster Exposed  |
|  - Engine Block, Cam Covers & Turbos Seen|
|  - Sills, Door Cards & Glass Raised      |
+------------------------------------------+
```

---

## 2. KINEMATIC RESOLUTION ENGINE

### 2.1 Door Count Delineation
Vehicles are rigorously evaluated for door count to avoid activating phantom hinges:
```ts
const is4Door =
  rawSpec?.kinematics?.opening?.doorCount === 4 ||
  rawSpec?.dimensions?.doors === 4 ||
  vehicleId.includes('evolution') ||
  vehicleId.includes('evo') ||
  vehicleId.includes('wrx') ||
  vehicleId.includes('sti') ||
  vehicleId.includes('s_class') ||
  vehicleId.includes('7_series') ||
  vehicleId.includes('flying_spur') ||
  vehicleId.includes('panamera');
```
* **For 2-Door Vehicles**: `doorFrontLeft = 1.0`, `doorFrontRight = 1.0`, `doorRearLeft = 0.0`, `doorRearRight = 0.0`.
* **For 4-Door Vehicles**: `doorFrontLeft = 1.0`, `doorFrontRight = 1.0`, `doorRearLeft = 1.0`, `doorRearRight = 1.0`.
* **For All Vehicles**: `hood = 1.0`, `boot = 1.0`.

### 2.2 Door Mechanisms Supported
The kinematic engine executes distinct matrix transforms based on `openingConfig.doorMechanism`:
1. **Conventional**: Rotates outward around the vertical Y-axis anchor near the front fender (`rotation.y = +/- angle * openingState`).
2. **Scissor (Lamborghini V12)**: Rotates strictly upward around the forward horizontal X/Z axis along the base of the A-pillar (`rotation.x = angle * openingState`).
3. **Dihedral Butterfly (McLaren, LaFerrari)**: Compound rotation swinging outward and upward simultaneously.
4. **Dihedral Synchro-Helix (Koenigsegg)**: Pushes out laterally by 80mm before rotating 90 degrees upward into vertical clearance.
5. **Coach / Suicide (Rolls-Royce Spectre)**: Reverse-hinged at the rear B/C-pillar, swinging backwards.
6. **Roof Gullwing (SLS AMG)**: Rotates upward around roof-mounted longitudinal hinges.

### 2.3 Hood & Boot Mechanisms Supported
1. **Rear-Hinged Conventional Hood**: Lifts upward from the front, pivoting near the cowl.
2. **Forward-Tilting Clamshell (Cofango - Huracan STO / GT40)**: Entire nose cone and front fenders hinge at the front bumper, tilting forward to reveal suspension and radiator ducting.
3. **Full Rear Clamshell (Ferrari F40 / Group C)**: Complete rear deck, glass, and rear quarter panels lift backward and upward, revealing the engine block, turbos, transaxle, and suspension subframe.
4. **Trunk / Frunk Lid**: Compact cargo lid pivoting on standard internal gooseneck hinges.

---

## 3. CAMERA RIG INTEGRATION: FULL INSPECTION VIEW

When **OPEN EVERYTHING** is engaged, the camera preset automatically transitions to `'full_inspection'`:
* In `src/types/vehicle.ts`: Added `'full_inspection'` to `CameraPreset`.
* In `src/components/3d/CameraRig.tsx`:
  ```ts
  case 'full_inspection': {
    targetPos.set(distIso * 0.82, H * 1.75, distIso * 0.82);
    targetLook.set(0, H * 0.45, 0);
    break;
  }
  ```
* This positions the camera higher and slightly wider than standard isometric view, framing open scissor doors, raised rear clamshells, and front frunk lids without clipping any geometry.

---

## 4. RESET & "CLOSE EVERYTHING"

Triggering **CLOSE EVERYTHING**:
1. Eases all open values smoothly back to `0.0`.
2. Restores `DEFAULT_OPENING_STATE`.
3. Returns `cameraPreset` to `'isometric'`.
4. Updates the UI status pill to `Everything Closed`.
