import * as THREE from 'three';
import { VehicleGeometryProfile } from '../templates/geometryProfiles';
import { LongitudinalProfileGenerator, LongitudinalSample } from './longitudinalProfile';

export interface CrossSectionPoint {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  uv: THREE.Vector2;
  isCrease: boolean; // Flag to split normal for sharp shut lines or rocker crease
  zone: 'underbody' | 'sill' | 'door_lower' | 'beltline' | 'shoulder' | 'window_base' | 'roof_rail' | 'roof_center';
}

export interface StationCrossSection {
  z: number;
  stationIndex: number;
  pointsLeft: CrossSectionPoint[];
  pointsRight: CrossSectionPoint[];
  sample: LongitudinalSample;
  hasWheelArchCutout: boolean;
}

/**
 * Generates transverse cross-sections sampled at >= 24 stations along the length of the vehicle.
 * Implements tumblehome, shoulder lines, rocker sill tuck-in, and integrated wheel arch flares.
 */
export class CrossSectionGenerator {
  private profile: VehicleGeometryProfile;
  private longitudinalGen: LongitudinalProfileGenerator;

  constructor(profile: VehicleGeometryProfile) {
    this.profile = profile;
    this.longitudinalGen = new LongitudinalProfileGenerator(profile);
  }

  /**
   * Generates N transverse cross-sections along the entire vehicle length
   */
  generateAllStations(stationCount: number = 28): StationCrossSection[] {
    const p = this.profile;
    const frontAxleZ = p.wheelbase / 2;
    const rearAxleZ = -p.wheelbase / 2;
    const noseZ = frontAxleZ + p.frontOverhang;
    const tailZ = rearAxleZ - p.rearOverhang;
    const totalLength = noseZ - tailZ;

    const stations: StationCrossSection[] = [];

    // Ensure at least 24 stations
    const count = Math.max(24, stationCount);

    for (let i = 0; i < count; i++) {
      // Fraction 0 (tail) to 1 (nose)
      const u = i / (count - 1);
      const z = THREE.MathUtils.lerp(tailZ, noseZ, u);
      const sample = this.longitudinalGen.sampleStation(z);

      // Check if this station intersects front or rear wheel arches
      const distFrontAxle = Math.abs(z - frontAxleZ);
      const distRearAxle = Math.abs(z - rearAxleZ);
      const isFrontArch = distFrontAxle < p.wheelArchRadius;
      const isRearArch = distRearAxle < p.wheelArchRadius;
      const hasWheelArchCutout = isFrontArch || isRearArch;

      // Wheel arch cutout calculation
      let archClearanceY = 0;
      let archFlareX = 0;

      if (isFrontArch) {
        const radFront = p.wheelArchRadius;
        const dz = distFrontAxle;
        const dy = Math.sqrt(Math.max(0, radFront * radFront - dz * dz));
        archClearanceY = p.wheelRadiusFront + dy * 0.92;
        archFlareX = p.wheelArchFlare * (1 - Math.pow(dz / radFront, 2));
      } else if (isRearArch) {
        const radRear = p.wheelArchRadius;
        const dz = distRearAxle;
        const dy = Math.sqrt(Math.max(0, radRear * radRear - dz * dz));
        archClearanceY = p.wheelRadiusRear + dy * 0.92;
        archFlareX = p.wheelArchFlare * (1 - Math.pow(dz / radRear, 2));
      }

      const pointsLeft = this.buildHalfSection(z, sample, archClearanceY, archFlareX, -1);
      const pointsRight = this.buildHalfSection(z, sample, archClearanceY, archFlareX, 1);

      stations.push({
        z,
        stationIndex: i,
        pointsLeft,
        pointsRight,
        sample,
        hasWheelArchCutout
      });
    }

    return stations;
  }

  private buildHalfSection(
    z: number,
    sample: LongitudinalSample,
    archClearanceY: number,
    archFlareX: number,
    side: number // -1 for Left, +1 for Right
  ): CrossSectionPoint[] {
    const p = this.profile;
    const points: CrossSectionPoint[] = [];

    // Effective sill and lower door heights (cut out if wheel arch present)
    const effectiveSillY = archClearanceY > 0 ? Math.max(sample.yBottom, archClearanceY) : sample.yBottom;
    const effectiveSillX = archClearanceY > 0
      ? (sample.halfWidthBeltline + archFlareX) * side
      : (sample.halfWidthBeltline * 0.88) * side;

    const beltlineX = (sample.halfWidthBeltline + archFlareX) * side;
    const shoulderX = beltlineX * 0.96;
    const roofX = sample.halfWidthRoof * side;

    // 1. Underbody Center (Y = groundClearance * 0.95, X = 0)
    points.push({
      position: new THREE.Vector3(0, sample.yBottom * 0.92, z),
      normal: new THREE.Vector3(0, -1, 0),
      uv: new THREE.Vector2(0.5, 0.0),
      isCrease: false,
      zone: 'underbody'
    });

    // 2. Rocker Sill Outer Edge (sharp crease)
    points.push({
      position: new THREE.Vector3(effectiveSillX, effectiveSillY, z),
      normal: new THREE.Vector3(side * 0.7, -0.3, 0).normalize(),
      uv: new THREE.Vector2(side > 0 ? 0.9 : 0.1, 0.15),
      isCrease: true,
      zone: 'sill'
    });

    // 3. Lower Door Swell / Flare
    const midDoorY = (effectiveSillY + sample.yBeltline) * 0.52;
    const midDoorX = (beltlineX * 0.98 + (archFlareX * side * 0.5));
    points.push({
      position: new THREE.Vector3(midDoorX, midDoorY, z),
      normal: new THREE.Vector3(side, 0.1, 0).normalize(),
      uv: new THREE.Vector2(side > 0 ? 0.95 : 0.05, 0.4),
      isCrease: false,
      zone: 'door_lower'
    });

    // 4. Beltline Shoulder Crease
    points.push({
      position: new THREE.Vector3(beltlineX, sample.yBeltline, z),
      normal: new THREE.Vector3(side * 0.85, 0.25, 0).normalize(),
      uv: new THREE.Vector2(side > 0 ? 1.0 : 0.0, 0.6),
      isCrease: true,
      zone: 'beltline'
    });

    if (sample.isCabin) {
      // 5. Greenhouse Tumblehome (inward lean) / Window Base
      const windowBaseY = sample.yBeltline + 0.04;
      const windowBaseX = shoulderX * 0.92;
      points.push({
        position: new THREE.Vector3(windowBaseX, windowBaseY, z),
        normal: new THREE.Vector3(side * 0.6, 0.75, 0).normalize(),
        uv: new THREE.Vector2(side > 0 ? 0.85 : 0.15, 0.7),
        isCrease: true,
        zone: 'window_base'
      });

      // 6. Roof Rail (cantrail)
      points.push({
        position: new THREE.Vector3(roofX, sample.yTop, z),
        normal: new THREE.Vector3(side * 0.5, 0.85, 0).normalize(),
        uv: new THREE.Vector2(side > 0 ? 0.7 : 0.3, 0.9),
        isCrease: false,
        zone: 'roof_rail'
      });

      // 7. Roof Center Crown
      points.push({
        position: new THREE.Vector3(0, sample.yTop + 0.02, z),
        normal: new THREE.Vector3(0, 1, 0),
        uv: new THREE.Vector2(0.5, 1.0),
        isCrease: false,
        zone: 'roof_center'
      });
    } else {
      // Hood or Decklid Center line
      points.push({
        position: new THREE.Vector3(0, sample.yTop, z),
        normal: new THREE.Vector3(0, 1, 0),
        uv: new THREE.Vector2(0.5, 1.0),
        isCrease: false,
        zone: 'roof_center'
      });
    }

    return points;
  }
}
