import { ComponentDefinition } from './componentManager';

export interface ClearanceWarning {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  componentA: string;
  componentB: string;
  clearanceMm: number;
  thresholdMm: number;
  location: [number, number, number]; // SAE coordinate [x, y, z] in meters
  description: string;
  suggestedFix: string;
  blocksCFD: boolean;
}

export interface DynamicSuspensionState {
  bumpTravelM: number; // e.g. +0.050m bump
  reboundTravelM: number; // e.g. -0.030m rebound
  steeringAngleDeg: number; // e.g. +35 deg front lock
}

export interface AssemblyAuditResult {
  passed: boolean;
  canProceedToCFD: boolean;
  warnings: ClearanceWarning[];
  criticalCount: number;
  warningCount: number;
  infoCount: number;
}

export class CollisionDetector {
  /**
   * Compute axis-aligned bounding box clearance between two AABBs in SAE coordinates.
   * If clearance is negative, the boxes intersect (overlap depth = -clearance).
   */
  public static computeAABBClearance(
    boxA: { min: [number, number, number]; max: [number, number, number] },
    boxB: { min: [number, number, number]; max: [number, number, number] }
  ): { clearanceM: number; contactPoint: [number, number, number] } {
    let dx = 0;
    let dy = 0;
    let dz = 0;

    // SAE: X=forward, Y=left, Z=up
    if (boxA.max[0] < boxB.min[0]) dx = boxB.min[0] - boxA.max[0];
    else if (boxB.max[0] < boxA.min[0]) dx = boxA.min[0] - boxB.max[0];

    if (boxA.max[1] < boxB.min[1]) dy = boxB.min[1] - boxA.max[1];
    else if (boxB.max[1] < boxA.min[1]) dy = boxA.min[1] - boxB.max[1];

    if (boxA.max[2] < boxB.min[2]) dz = boxB.min[2] - boxA.max[2];
    else if (boxB.max[2] < boxA.min[2]) dz = boxA.min[2] - boxB.max[2];

    const isOverlapping = (
      boxA.min[0] <= boxB.max[0] && boxA.max[0] >= boxB.min[0] &&
      boxA.min[1] <= boxB.max[1] && boxA.max[1] >= boxB.min[1] &&
      boxA.min[2] <= boxB.max[2] && boxA.max[2] >= boxB.min[2]
    );

    let clearanceM: number;
    if (isOverlapping) {
      // Overlap depth: negative distance along minimum penetration axis
      const ox = Math.min(boxA.max[0] - boxB.min[0], boxB.max[0] - boxA.min[0]);
      const oy = Math.min(boxA.max[1] - boxB.min[1], boxB.max[1] - boxA.min[1]);
      const oz = Math.min(boxA.max[2] - boxB.min[2], boxB.max[2] - boxA.min[2]);
      clearanceM = -Math.min(ox, oy, oz);
    } else {
      clearanceM = Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Midpoint between the two bounding boxes in the contact zone
    const contactPoint: [number, number, number] = [
      (Math.max(boxA.min[0], boxB.min[0]) + Math.min(boxA.max[0], boxB.max[0])) / 2,
      (Math.max(boxA.min[1], boxB.min[1]) + Math.min(boxA.max[1], boxB.max[1])) / 2,
      (Math.max(boxA.min[2], boxB.min[2]) + Math.min(boxA.max[2], boxB.max[2])) / 2
    ];

    return { clearanceM, contactPoint };
  }

  /**
   * Dynamic wheel arch clearance sweep across suspension travel and steering lock
   */
  public static checkWheelArchClearance(
    wheelComp: ComponentDefinition,
    archComp: ComponentDefinition,
    dynamics: DynamicSuspensionState = { bumpTravelM: 0.05, reboundTravelM: -0.03, steeringAngleDeg: 35 }
  ): ClearanceWarning[] {
    const warnings: ClearanceWarning[] = [];
    if (!wheelComp.bounds || !archComp.bounds) return warnings;

    const isFrontWheel = wheelComp.id.includes('fl') || wheelComp.id.includes('fr') || wheelComp.id.includes('front');
    const steeringSweepDeg = isFrontWheel ? [0, dynamics.steeringAngleDeg, -dynamics.steeringAngleDeg] : [0];
    const travelSweepM = [0, dynamics.bumpTravelM, dynamics.reboundTravelM];

    const wheelWidth = wheelComp.bounds.max[1] - wheelComp.bounds.min[1];
    const wheelRadius = (wheelComp.bounds.max[2] - wheelComp.bounds.min[2]) / 2;
    const center: [number, number, number] = [
      (wheelComp.bounds.min[0] + wheelComp.bounds.max[0]) / 2,
      (wheelComp.bounds.min[1] + wheelComp.bounds.max[1]) / 2,
      (wheelComp.bounds.min[2] + wheelComp.bounds.max[2]) / 2
    ];

    const THRESHOLD_MM = 15; // 15mm clearance minimum

    for (const travel of travelSweepM) {
      for (const steer of steeringSweepDeg) {
        const steerRad = (steer * Math.PI) / 180;
        // Bounding box inflation during steering rotation
        const effRadiusX = wheelRadius * Math.abs(Math.cos(steerRad)) + (wheelWidth / 2) * Math.abs(Math.sin(steerRad));
        const effWidthY = (wheelWidth / 2) * Math.abs(Math.cos(steerRad)) + wheelRadius * Math.abs(Math.sin(steerRad));

        const sweptWheelBox = {
          min: [center[0] - effRadiusX, center[1] - effWidthY, center[2] + travel - wheelRadius] as [number, number, number],
          max: [center[0] + effRadiusX, center[1] + effWidthY, center[2] + travel + wheelRadius] as [number, number, number]
        };

        const { clearanceM, contactPoint } = this.computeAABBClearance(sweptWheelBox, archComp.bounds);
        const clearanceMm = clearanceM * 1000;

        if (clearanceMm < THRESHOLD_MM) {
          const isInterpenetration = clearanceMm < 0;
          warnings.push({
            id: `CLR-WHL-${wheelComp.id}-${travel > 0 ? 'BUMP' : travel < 0 ? 'REBOUND' : 'STATIC'}-ST${steer}`,
            severity: isInterpenetration ? 'CRITICAL' : 'WARNING',
            componentA: wheelComp.id,
            componentB: archComp.id,
            clearanceMm: Math.round(clearanceMm * 10) / 10,
            thresholdMm: THRESHOLD_MM,
            location: contactPoint,
            description: isInterpenetration
              ? `Tire collision detected with ${archComp.name} under ${travel > 0 ? 'bump travel (+50mm)' : 'steering lock'} (overlap ${Math.abs(Math.round(clearanceMm))} mm).`
              : `Insufficient wheel arch clearance under dynamic travel: ${Math.round(clearanceMm)} mm (min requirement ${THRESHOLD_MM} mm).`,
            suggestedFix: isInterpenetration
              ? `Increase arch radius, reduce tire section width/diameter, or increase negative wheel offset.`
              : `Flaring fender arches or adding 5mm bump stop limiting will prevent tire rubbing.`,
            blocksCFD: isInterpenetration
          });
          // Avoid flooding duplicate warnings for the same pair
          break;
        }
      }
      if (warnings.length > 0 && warnings[0].severity === 'CRITICAL') break;
    }

    return warnings;
  }

  /**
   * Check ground clearance for low aero components (splitter, underbody, side skirts)
   */
  public static checkGroundClearance(comp: ComponentDefinition, minGroundClearanceMm: number = 30): ClearanceWarning[] {
    const warnings: ClearanceWarning[] = [];
    if (!comp.bounds) return warnings;

    // Ground is Z=0 in SAE coordinates when vehicle is standing on its wheels
    const lowestZ = comp.bounds.min[2];
    const clearanceMm = lowestZ * 1000;

    if (clearanceMm < minGroundClearanceMm) {
      const isGroundCollision = clearanceMm <= 0;
      warnings.push({
        id: `CLR-GND-${comp.id}`,
        severity: isGroundCollision ? 'CRITICAL' : 'WARNING',
        componentA: comp.id,
        componentB: 'ground_plane',
        clearanceMm: Math.round(clearanceMm * 10) / 10,
        thresholdMm: minGroundClearanceMm,
        location: [(comp.bounds.min[0] + comp.bounds.max[0]) / 2, 0, lowestZ],
        description: isGroundCollision
          ? `${comp.name} penetrates ground plane by ${Math.abs(Math.round(clearanceMm))} mm.`
          : `${comp.name} has extremely low ground clearance (${Math.round(clearanceMm)} mm vs min ${minGroundClearanceMm} mm). High risk of track scrape and aerodynamic stall.`,
        suggestedFix: `Raise ride height or adjust component vertical mount position by +${Math.ceil(minGroundClearanceMm - clearanceMm)} mm.`,
        blocksCFD: isGroundCollision
      });
    }

    return warnings;
  }

  /**
   * Check engine/powertrain envelope against hood/bonnet clearance
   */
  public static checkEngineHoodClearance(
    engineComp: ComponentDefinition,
    hoodComp: ComponentDefinition,
    minClearanceMm: number = 15
  ): ClearanceWarning[] {
    const warnings: ClearanceWarning[] = [];
    if (!engineComp.bounds || !hoodComp.bounds) return warnings;

    const { clearanceM, contactPoint } = this.computeAABBClearance(engineComp.bounds, hoodComp.bounds);
    const clearanceMm = clearanceM * 1000;

    if (clearanceMm < minClearanceMm) {
      const isInterpenetration = clearanceMm < 0;
      warnings.push({
        id: `CLR-ENG-HOOD-${engineComp.id}`,
        severity: isInterpenetration ? 'CRITICAL' : 'WARNING',
        componentA: engineComp.id,
        componentB: hoodComp.id,
        clearanceMm: Math.round(clearanceMm * 10) / 10,
        thresholdMm: minClearanceMm,
        location: contactPoint,
        description: isInterpenetration
          ? `Engine packaging envelope collides with ${hoodComp.name} by ${Math.abs(Math.round(clearanceMm))} mm.`
          : `Engine envelope clearance to ${hoodComp.name} is insufficient (${Math.round(clearanceMm)} mm vs required ${minClearanceMm} mm). Thermal soak hazard.`,
        suggestedFix: `Increase hood power dome height or lower engine block mounting hardpoints by ${Math.ceil(minClearanceMm - clearanceMm)} mm.`,
        blocksCFD: false // Packaging warning does not invalidate external aerodynamics unless hood surface is penetrated
      });
    }

    return warnings;
  }

  /**
   * Audit all registered components in an assembly for clearances, collisions, and mounting integrity
   */
  public static auditAssemblyClearances(
    components: ComponentDefinition[],
    dynamics?: DynamicSuspensionState
  ): AssemblyAuditResult {
    const warnings: ClearanceWarning[] = [];
    const compMap = new Map<string, ComponentDefinition>();
    for (const c of components) {
      compMap.set(c.id, c);
    }

    // 1. Check wheel vs arch clearances
    const wheelIds = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];
    const archIds = [
      ['wheel_fl', 'fender_front_l'],
      ['wheel_fr', 'fender_front_r'],
      ['wheel_rl', 'quarter_panel_l'],
      ['wheel_rr', 'quarter_panel_r']
    ];

    for (const [wId, aId] of archIds) {
      const wheel = compMap.get(wId);
      const arch = compMap.get(aId);
      if (wheel && arch) {
        warnings.push(...this.checkWheelArchClearance(wheel, arch, dynamics));
      }
    }

    // 2. Check aero components ground clearance
    const lowAeroIds = ['front_splitter', 'rear_diffuser', 'side_skirt_l', 'side_skirt_r', 'underbody'];
    for (const aeroId of lowAeroIds) {
      const aeroComp = compMap.get(aeroId);
      if (aeroComp) {
        warnings.push(...this.checkGroundClearance(aeroComp, aeroId.includes('splitter') ? 30 : 25));
      }
    }

    // 3. Check engine vs hood if both present
    const engine = compMap.get('powertrain_envelope') || compMap.get('engine_block');
    const hood = compMap.get('hood') || compMap.get('bonnet');
    if (engine && hood) {
      warnings.push(...this.checkEngineHoodClearance(engine, hood, 15));
    }

    // 4. Check attachment anchors integrity
    for (const comp of components) {
      if (comp.parentId && !compMap.has(comp.parentId)) {
        warnings.push({
          id: `MNT-MISSING-PARENT-${comp.id}`,
          severity: 'CRITICAL',
          componentA: comp.id,
          componentB: comp.parentId,
          clearanceMm: 0,
          thresholdMm: 0,
          location: [0, 0, 0],
          description: `Component '${comp.name}' specifies parent '${comp.parentId}', which does not exist in the assembly.`,
          suggestedFix: `Re-anchor '${comp.id}' to an existing component or remove parent dependency.`,
          blocksCFD: true
        });
      }
    }

    let criticalCount = 0;
    let warningCount = 0;
    let infoCount = 0;

    for (const w of warnings) {
      if (w.severity === 'CRITICAL') criticalCount++;
      else if (w.severity === 'WARNING') warningCount++;
      else infoCount++;
    }

    const canProceedToCFD = !warnings.some(w => w.blocksCFD);
    const passed = criticalCount === 0;

    return {
      passed,
      canProceedToCFD,
      warnings,
      criticalCount,
      warningCount,
      infoCount
    };
  }
}
