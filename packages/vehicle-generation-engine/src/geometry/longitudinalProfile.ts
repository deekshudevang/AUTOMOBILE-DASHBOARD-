import * as THREE from 'three';
import { VehicleGeometryProfile } from '../templates/geometryProfiles';

export interface LongitudinalSample {
  z: number;
  yTop: number;
  yBeltline: number;
  yBottom: number;
  halfWidthBeltline: number;
  halfWidthRoof: number;
  isCabin: boolean;
  isFrontOverhang: boolean;
  isRearOverhang: boolean;
}

/**
 * Generates continuous longitudinal spine curves derived from the VehicleGeometryProfile
 */
export class LongitudinalProfileGenerator {
  private profile: VehicleGeometryProfile;

  constructor(profile: VehicleGeometryProfile) {
    this.profile = profile;
  }

  /**
   * Evaluates vehicle height, beltline, and bottom sill at normalized or metric station Z
   * Where Z = +frontOverhang + wheelbase/2 at front tip, and -rearOverhang - wheelbase/2 at rear tip
   */
  sampleStation(z: number): LongitudinalSample {
    const p = this.profile;
    const frontAxleZ = p.wheelbase / 2;
    const rearAxleZ = -p.wheelbase / 2;
    const noseZ = frontAxleZ + p.frontOverhang;
    const tailZ = rearAxleZ - p.rearOverhang;

    // Bounds clamp
    const clampedZ = Math.max(tailZ, Math.min(noseZ, z));

    // Cowl point (windshield base)
    const cowlZ = frontAxleZ - (p.bonnetLength - p.frontOverhang);
    // Windshield top / roof start
    const roofStartZ = cowlZ - (p.overallHeight - p.beltlineHeight) / Math.tan(THREE.MathUtils.degToRad(p.windshieldAngleDeg));
    // Backlight top / roof end
    const roofEndZ = rearAxleZ + 0.2;
    // Decklid / rear glass base
    const decklidZ = rearAxleZ - 0.45;

    let yTop = p.beltlineHeight;
    let yBottom = p.groundClearance;
    let halfWidthBeltline = p.overallWidth / 2;
    let halfWidthRoof = p.overallWidth * 0.38; // Tumblehome factor
    let isCabin = false;

    // A. NOSE TO COWL (Bonnet / Hood Region)
    if (clampedZ >= cowlZ) {
      const t = (clampedZ - cowlZ) / Math.max(0.001, noseZ - cowlZ); // 1 at nose, 0 at cowl
      // Smooth curvature drop towards front nose
      const noseHeight = p.groundClearance + 0.38;
      yTop = THREE.MathUtils.lerp(p.beltlineHeight * 0.92, noseHeight, Math.pow(t, 1.25));
      yBottom = p.groundClearance + (t > 0.6 ? 0.04 * (t - 0.6) : 0);
      halfWidthBeltline = THREE.MathUtils.lerp(p.overallWidth * 0.48, p.overallWidth * 0.41, t);
    }
    // B. COWL TO ROOF PEAK (Windshield)
    else if (clampedZ >= roofStartZ) {
      const t = (clampedZ - roofStartZ) / Math.max(0.001, cowlZ - roofStartZ); // 1 at cowl, 0 at roof start
      yTop = THREE.MathUtils.lerp(p.roofHeight, p.beltlineHeight * 0.92, t);
      halfWidthRoof = THREE.MathUtils.lerp(p.overallWidth * 0.38, p.overallWidth * 0.44, t);
      isCabin = true;
    }
    // C. ROOF CROWN (Greenhouse Roofline)
    else if (clampedZ >= roofEndZ) {
      const t = (clampedZ - roofEndZ) / Math.max(0.001, roofStartZ - roofEndZ);
      // Parabolic crown along roof length
      const crown = Math.sin(t * Math.PI) * 0.035;
      yTop = p.roofHeight + crown;
      halfWidthRoof = p.overallWidth * 0.37;
      isCabin = true;
    }
    // D. REAR WINDOW / BACKLIGHT
    else if (clampedZ >= decklidZ) {
      const t = (clampedZ - decklidZ) / Math.max(0.001, roofEndZ - decklidZ); // 1 at roof end, 0 at decklid
      // Pickup truck has vertical glass; sports/supercars have fastback slope
      const rearDeckHeight = p.bodyStyle === 'pickup' ? p.beltlineHeight * 0.85 : p.beltlineHeight * 0.95;
      yTop = THREE.MathUtils.lerp(rearDeckHeight, p.roofHeight, Math.pow(t, 0.9));
      halfWidthRoof = THREE.MathUtils.lerp(p.overallWidth * 0.35, p.overallWidth * 0.37, t);
      isCabin = p.bodyStyle !== 'pickup';
    }
    // E. DECKLID TO REAR TAIL (Trunk / Diffuser Region)
    else {
      const t = (clampedZ - tailZ) / Math.max(0.001, decklidZ - tailZ); // 1 at decklid, 0 at tail
      const tailHeight = p.beltlineHeight * (p.bodyStyle === 'suv' ? 1.05 : 0.88);
      yTop = THREE.MathUtils.lerp(tailHeight, p.beltlineHeight * 0.95, t);
      // Rear diffuser upsweep
      yBottom = THREE.MathUtils.lerp(p.groundClearance + 0.12, p.groundClearance, t);
      halfWidthBeltline = THREE.MathUtils.lerp(p.overallWidth * 0.44, p.overallWidth * 0.48, t);
    }

    return {
      z: clampedZ,
      yTop,
      yBeltline: p.beltlineHeight,
      yBottom,
      halfWidthBeltline,
      halfWidthRoof,
      isCabin,
      isFrontOverhang: clampedZ > frontAxleZ,
      isRearOverhang: clampedZ < rearAxleZ
    };
  }
}
