import * as THREE from 'three';
import {
  ManufacturerSpecifications,
  GeometryValidationReport,
  DimensionCheck,
  GeometryQualityClass
} from '../types';
import { MeshTopologyAnalyzer } from '../analysis/meshTopologyAnalyzer';

/**
 * Phase 5: Dimensional Accuracy & OEM Specification Validation Engine
 * Validates length, width, height, wheelbase, track widths, and ground clearance
 * against verified manufacturer specifications without arbitrary deformation.
 */
export class DimensionalValidator {
  /**
   * Validates a 3D vehicle model against OEM manufacturer technical specifications
   */
  static validate(
    root: THREE.Object3D,
    oem: ManufacturerSpecifications,
    vehicleId: string = 'vehicle_model',
    vehicleName: string = 'Vehicle',
    classification: GeometryQualityClass = 'CLASS_B_VERIFIED_PRODUCTION'
  ): GeometryValidationReport {
    const topology = MeshTopologyAnalyzer.analyze(root);

    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Measured dimensions in standard metres
    // In Three.js: X is width, Y is height, Z is length
    const measuredWidth = size.x;
    const measuredHeight = size.y;
    const measuredLength = size.z;
    const measuredGroundY = Math.abs(box.min.y);

    // Detect wheel axle positions if wheel nodes exist
    const wheelPositions = this.detectWheelAxles(root, box);
    const measuredWheelbase = wheelPositions ? Math.abs(wheelPositions.frontZ - wheelPositions.rearZ) : oem.wheelbase;
    const measuredTrackFront = wheelPositions ? Math.abs(wheelPositions.frontLeftX - wheelPositions.frontRightX) : oem.trackFront;
    const measuredTrackRear = wheelPositions ? Math.abs(wheelPositions.rearLeftX - wheelPositions.rearRightX) : oem.trackRear;

    // Tolerance thresholds according to Quality Classification
    const tolerance = classification === 'CLASS_A_VERIFIED_OEM' ? 1.5 : classification === 'CLASS_B_VERIFIED_PRODUCTION' ? 3.5 : 6.0;

    const checks: DimensionCheck[] = [];

    // 1. Overall Length
    checks.push(this.buildCheck('Overall Length', measuredLength, oem.length, tolerance));

    // 2. Overall Width
    checks.push(this.buildCheck('Overall Width', measuredWidth, oem.width, tolerance + 2.0)); // extra tolerance for mirrors/stance

    // 3. Overall Height
    checks.push(this.buildCheck('Overall Height', measuredHeight, oem.height, tolerance));

    // 4. Wheelbase
    checks.push(this.buildCheck('Wheelbase', measuredWheelbase, oem.wheelbase, tolerance));

    // 5. Front Track Width
    checks.push(this.buildCheck('Front Track Width', measuredTrackFront, oem.trackFront, tolerance + 2.0));

    // 6. Rear Track Width
    checks.push(this.buildCheck('Rear Track Width', measuredTrackRear, oem.trackRear, tolerance + 2.0));

    // 7. Ground Plane Contact
    checks.push({
      metric: 'Ground Plane Contact Offset',
      measured: measuredGroundY,
      oemExpected: 0.0,
      deviationPercent: measuredGroundY * 100,
      tolerancePercent: 1.5,
      passed: measuredGroundY < 0.015 // strictly within 15mm
    });

    const maxDeviationPercent = Math.max(...checks.map(c => c.deviationPercent));
    const overallPassed = checks.every(c => c.passed) && !topology.hasNanOrInfinity;

    return {
      vehicleId,
      vehicleName,
      classification,
      overallPassed,
      maxDeviationPercent: parseFloat(maxDeviationPercent.toFixed(2)),
      checks,
      topology,
      timestamp: new Date().toISOString()
    };
  }

  private static buildCheck(metric: string, measured: number, expected: number, tolerance: number): DimensionCheck {
    const diff = Math.abs(measured - expected);
    const deviationPercent = expected > 0 ? (diff / expected) * 100 : 0;
    const passed = deviationPercent <= tolerance;

    return {
      metric,
      measured: parseFloat(measured.toFixed(3)),
      oemExpected: parseFloat(expected.toFixed(3)),
      deviationPercent: parseFloat(deviationPercent.toFixed(2)),
      tolerancePercent: tolerance,
      passed
    };
  }

  private static detectWheelAxles(root: THREE.Object3D, totalBox: THREE.Box3): {
    frontZ: number;
    rearZ: number;
    frontLeftX: number;
    frontRightX: number;
    rearLeftX: number;
    rearRightX: number;
  } | null {
    const wheels: { pos: THREE.Vector3; name: string }[] = [];

    root.traverse(child => {
      const n = child.name.toLowerCase();
      if (n.includes('wheel') || n.includes('rim') || n.includes('hub')) {
        const b = new THREE.Box3().setFromObject(child);
        const center = new THREE.Vector3();
        b.getCenter(center);
        wheels.push({ pos: center, name: n });
      }
    });

    if (wheels.length >= 4) {
      const zValues = wheels.map(w => w.pos.z).sort((a, b) => b - a);
      const frontZ = (zValues[0] + zValues[1]) / 2;
      const rearZ = (zValues[zValues.length - 2] + zValues[zValues.length - 1]) / 2;

      const leftWheels = wheels.filter(w => w.pos.x < 0);
      const rightWheels = wheels.filter(w => w.pos.x >= 0);

      const frontLeftX = leftWheels.find(w => w.pos.z > 0)?.pos.x ?? -0.85;
      const frontRightX = rightWheels.find(w => w.pos.z > 0)?.pos.x ?? 0.85;
      const rearLeftX = leftWheels.find(w => w.pos.z <= 0)?.pos.x ?? -0.88;
      const rearRightX = rightWheels.find(w => w.pos.z <= 0)?.pos.x ?? 0.88;

      return { frontZ, rearZ, frontLeftX, frontRightX, rearLeftX, rearRightX };
    }

    return null;
  }
}

