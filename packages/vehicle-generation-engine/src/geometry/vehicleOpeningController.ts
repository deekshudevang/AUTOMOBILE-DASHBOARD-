import * as THREE from 'three';
import { VehicleSchema2 } from '@autoverse/shared-types';

export type DoorMechanismType =
  | 'conventional'
  | 'scissor'
  | 'butterfly'
  | 'dihedral_synchro_helix'
  | 'gullwing'
  | 'coach';

export type HoodMechanismType =
  | 'rear_hinged'
  | 'clamshell_forward'
  | 'frunk';

export type BootMechanismType =
  | 'trunk_lid'
  | 'liftback_hatch'
  | 'rear_clamshell';

export interface VehicleOpeningConfig {
  doorCount: 2 | 4;
  doorMechanism: DoorMechanismType;
  hoodMechanism: HoodMechanismType;
  bootMechanism: BootMechanismType;
  doorHingeOffsetFrontM: [number, number, number]; // [x, y, z] relative to door
  doorHingeOffsetRearM?: [number, number, number];
  hoodHingeOffsetM: [number, number, number];
  bootHingeOffsetM: [number, number, number];
}

export interface VehicleOpeningState {
  doorFrontLeft: number;  // 0.0 (closed) to 1.0 (open)
  doorFrontRight: number;
  doorRearLeft: number;
  doorRearRight: number;
  hood: number;
  boot: number;
}

export const DEFAULT_OPENING_STATE: VehicleOpeningState = {
  doorFrontLeft: 0,
  doorFrontRight: 0,
  doorRearLeft: 0,
  doorRearRight: 0,
  hood: 0,
  boot: 0
};

export class VehicleOpeningController {
  /**
   * Resolves kinematics configuration based on 50-car audit matrix
   */
  public static resolveOpeningConfig(spec: VehicleSchema2): VehicleOpeningConfig {
    const id = (spec.vehicle.id || '').toLowerCase();
    const model = (spec.vehicle.model || '').toLowerCase();
    const mfr = (spec.vehicle.manufacturer || '').toLowerCase();

    // 1. Detect 4-Door Performance Sedans (Evo IX & WRX STI)
    const isFourDoor = id.includes('lancer') || id.includes('evo') || id.includes('wrx') || id.includes('impreza');
    const doorCount = isFourDoor ? 4 : 2;

    // 2. Door Mechanism Detection
    let doorMechanism: DoorMechanismType = 'conventional';
    if (id.includes('aventador') || id.includes('revuelto') || id.includes('essenza') || id.includes('countach')) {
      doorMechanism = 'scissor';
    } else if (
      id.includes('p1') ||
      id.includes('laferrari') ||
      id.includes('fxx') ||
      id.includes('amg_one') ||
      id.includes('nevera') ||
      id.includes('720s') ||
      id.includes('765lt') ||
      id.includes('senna') ||
      id.includes('ford_gt') ||
      id.includes('mc20')
    ) {
      doorMechanism = 'butterfly';
    } else if (id.includes('jesko') || id.includes('agera') || id.includes('regera') || mfr.includes('koenigsegg')) {
      doorMechanism = 'dihedral_synchro_helix';
    } else if (id.includes('huayra') || id.includes('valkyrie') || id.includes('sls')) {
      doorMechanism = 'gullwing';
    } else if (id.includes('spectre') || id.includes('phantom') || mfr.includes('rolls')) {
      doorMechanism = 'coach';
    }

    // 3. Hood Mechanism Detection
    let hoodMechanism: HoodMechanismType = 'rear_hinged';
    if (id.includes('f-type') || id.includes('ftype') || id.includes('huracan') || id.includes('supra')) {
      hoodMechanism = 'clamshell_forward';
    } else if (
      mfr.includes('porsche') ||
      mfr.includes('ferrari') ||
      mfr.includes('mclaren') ||
      mfr.includes('lamborghini') ||
      id.includes('nevera')
    ) {
      hoodMechanism = 'frunk';
    }

    // 4. Boot Mechanism Detection
    let bootMechanism: BootMechanismType = 'trunk_lid';
    if (
      id.includes('chiron') ||
      id.includes('jesko') ||
      id.includes('p1') ||
      id.includes('laferrari') ||
      id.includes('valkyrie') ||
      id.includes('amg_one') ||
      id.includes('huayra') ||
      id.includes('revuelto') ||
      id.includes('aventador') ||
      id.includes('ford_gt') ||
      id.includes('fxx') ||
      id.includes('718') ||
      id.includes('cayman')
    ) {
      bootMechanism = 'rear_clamshell';
    } else if (
      id.includes('corvette') ||
      id.includes('supra') ||
      id.includes('z_nismo') ||
      id.includes('miata') ||
      id.includes('rx7') ||
      id.includes('amg_gt') ||
      id.includes('a110')
    ) {
      bootMechanism = 'liftback_hatch';
    }

    const dims = spec.dimensions || { length: 4.6, width: 2.0, height: 1.25 };

    return {
      doorCount,
      doorMechanism,
      hoodMechanism,
      bootMechanism,
      doorHingeOffsetFrontM: [-dims.width * 0.44, 0, dims.length * 0.18],
      doorHingeOffsetRearM: isFourDoor ? [-dims.width * 0.44, 0, -dims.length * 0.08] : undefined,
      hoodHingeOffsetM: hoodMechanism === 'clamshell_forward'
        ? [0, dims.height * 0.28, dims.length * 0.46]
        : [0, dims.height * 0.42, dims.length * 0.14],
      bootHingeOffsetM: bootMechanism === 'rear_clamshell'
        ? [0, dims.height * 0.38, -dims.length * 0.42]
        : [0, dims.height * 0.45, -dims.length * 0.18]
    };
  }

  /**
   * Applies kinematics rotations and translations to the vehicle assembly's HingePivotGroups
   */
  public static applyOpenings(
    vehicleGroup: THREE.Group,
    config: VehicleOpeningConfig,
    state: VehicleOpeningState
  ): void {
    // 1. Front Left Door
    const pivotDoorFL = vehicleGroup.getObjectByName('hinge_pivot_door_front_l');
    if (pivotDoorFL) {
      this.applyDoorKinematics(pivotDoorFL, config.doorMechanism, state.doorFrontLeft, false);
    }

    // 2. Front Right Door
    const pivotDoorFR = vehicleGroup.getObjectByName('hinge_pivot_door_front_r');
    if (pivotDoorFR) {
      this.applyDoorKinematics(pivotDoorFR, config.doorMechanism, state.doorFrontRight, true);
    }

    // 3. Rear Left Door (if 4-door)
    const pivotDoorRL = vehicleGroup.getObjectByName('hinge_pivot_door_rear_l');
    if (pivotDoorRL) {
      this.applyDoorKinematics(pivotDoorRL, 'conventional', state.doorRearLeft, false);
    }

    // 4. Rear Right Door (if 4-door)
    const pivotDoorRR = vehicleGroup.getObjectByName('hinge_pivot_door_rear_r');
    if (pivotDoorRR) {
      this.applyDoorKinematics(pivotDoorRR, 'conventional', state.doorRearRight, true);
    }

    // 5. Hood / Bonnet / Frunk
    const pivotHood = vehicleGroup.getObjectByName('hinge_pivot_hood');
    if (pivotHood) {
      this.applyHoodKinematics(pivotHood, config.hoodMechanism, state.hood);
    }

    // 6. Boot / Trunk / Rear Clamshell
    const pivotBoot = vehicleGroup.getObjectByName('hinge_pivot_boot');
    if (pivotBoot) {
      this.applyBootKinematics(pivotBoot, config.bootMechanism, state.boot);
    }
  }

  /**
   * Kinematic transformation dispatcher for doors
   */
  private static applyDoorKinematics(
    pivot: THREE.Object3D,
    mechanism: DoorMechanismType,
    factor: number,
    isRight: boolean
  ): void {
    const f = THREE.MathUtils.clamp(factor, 0, 1);
    const sideSign = isRight ? -1 : 1;

    switch (mechanism) {
      case 'scissor':
        // Rotates upward 75 deg on X/Z axis, slightly kicks out
        pivot.rotation.set(
          THREE.MathUtils.lerp(0, 0.08, f),
          THREE.MathUtils.lerp(0, -0.15 * sideSign, f),
          THREE.MathUtils.lerp(0, 1.25 * sideSign, f)
        );
        break;

      case 'butterfly':
        // Rotates along A-pillar angle: tilts up and forward
        pivot.rotation.set(
          THREE.MathUtils.lerp(0, -0.45, f),
          THREE.MathUtils.lerp(0, -0.42 * sideSign, f),
          THREE.MathUtils.lerp(0, 0.85 * sideSign, f)
        );
        break;

      case 'dihedral_synchro_helix':
        // Koenigsegg Cam: moves out 40mm then rotates 90° upright
        pivot.position.x = THREE.MathUtils.lerp(0, -0.06 * sideSign, f);
        pivot.rotation.set(
          THREE.MathUtils.lerp(0, 0, f),
          THREE.MathUtils.lerp(0, -0.05 * sideSign, f),
          THREE.MathUtils.lerp(0, 1.57 * sideSign, f)
        );
        break;

      case 'gullwing':
        // Roof hinged: swings directly upward 80°
        pivot.rotation.set(
          0,
          0,
          THREE.MathUtils.lerp(0, 1.35 * sideSign, f)
        );
        break;

      case 'coach':
        // Reverse-hinged (suicide): hinges at rear edge, sweeps outward & backward
        pivot.rotation.set(
          0,
          THREE.MathUtils.lerp(0, 1.15 * sideSign, f),
          0
        );
        break;

      case 'conventional':
      default:
        // Standard forward-hinged door: sweeps outward ~65°
        pivot.rotation.set(
          0,
          THREE.MathUtils.lerp(0, -1.15 * sideSign, f),
          0
        );
        break;
    }
  }

  /**
   * Kinematic transformation for hood / bonnet / frunk
   */
  private static applyHoodKinematics(
    pivot: THREE.Object3D,
    mechanism: HoodMechanismType,
    factor: number
  ): void {
    const f = THREE.MathUtils.clamp(factor, 0, 1);

    if (mechanism === 'clamshell_forward') {
      // Front-hinged: tilts forward 55°
      pivot.rotation.x = THREE.MathUtils.lerp(0, -0.92, f);
    } else {
      // Rear-hinged (Cowl hinge): tilts upward 52°
      pivot.rotation.x = THREE.MathUtils.lerp(0, 0.88, f);
    }
  }

  /**
   * Kinematic transformation for boot / trunk / rear clamshell
   */
  private static applyBootKinematics(
    pivot: THREE.Object3D,
    mechanism: BootMechanismType,
    factor: number
  ): void {
    const f = THREE.MathUtils.clamp(factor, 0, 1);

    if (mechanism === 'rear_clamshell') {
      // Clamshell hinged at rear tail: tilts upward and rearward 60°
      pivot.rotation.x = THREE.MathUtils.lerp(0, -1.05, f);
    } else {
      // Forward-hinged decklid / hatch: tilts upward 55°
      pivot.rotation.x = THREE.MathUtils.lerp(0, 0.95, f);
    }
  }
}
