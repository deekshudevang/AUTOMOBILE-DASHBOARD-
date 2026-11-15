/**
 * AUTOVERSE 3D — Vehicle Geometry Profile Schema & Archetype Templates
 * Conforms to Phase 3 Specification
 */

export type BodyStyle =
  | 'sedan'
  | 'coupe'
  | 'sports_car'
  | 'supercar'
  | 'suv'
  | 'muscle_car'
  | 'pickup';

export type DrivetrainLayout = 'FMD' | 'RMD' | 'AWD' | 'FF' | 'FR' | 'MR' | 'RR';

export interface VehicleGeometryProfile {
  id: string;
  displayName: string;
  bodyStyle: BodyStyle;
  source: 'verified' | 'approximate-template';
  
  // Dimensions in metres
  wheelbase: number;
  trackFront: number;
  trackRear: number;
  overallLength: number;
  overallWidth: number;
  overallHeight: number;
  frontOverhang: number;
  rearOverhang: number;
  
  // Cabin & Bonnet (m)
  bonnetLength: number;
  cabinStartX: number; // Longitudinal start along Z relative to front axle
  cabinLength: number;
  roofHeight: number;
  roofPeakX: number; // Longitudinal peak location
  
  // Angles in degrees
  windshieldAngleDeg: number;
  rearWindowAngleDeg: number;
  
  // Wheels & Suspension (m)
  wheelRadiusFront: number;
  wheelRadiusRear: number;
  tyreSectionWidth: number;
  tyreAspectRatio: number; // e.g. 35 for 285/35R20
  wheelArchRadius: number;
  wheelArchFlare: number;
  groundClearance: number;
  beltlineHeight: number;
  drivetrainLayout: DrivetrainLayout;
}

export interface ProfileValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates vehicle geometry profile against mathematical consistency rules
 */
export function validateGeometryProfile(profile: VehicleGeometryProfile): ProfileValidationResult {
  const errors: string[] = [];

  // Rule 1: wheelbase + frontOverhang + rearOverhang ≈ overallLength (±1%)
  const calculatedLength = profile.wheelbase + profile.frontOverhang + profile.rearOverhang;
  const lengthDiff = Math.abs(calculatedLength - profile.overallLength);
  const lengthTolerance = profile.overallLength * 0.015; // 1.5% tolerance

  if (lengthDiff > lengthTolerance) {
    errors.push(
      `Length mismatch: wheelbase (${profile.wheelbase}m) + frontOverhang (${profile.frontOverhang}m) + rearOverhang (${profile.rearOverhang}m) = ${calculatedLength.toFixed(3)}m, but overallLength is ${profile.overallLength}m (exceeds tolerance of ${lengthTolerance.toFixed(3)}m).`
    );
  }

  // Rule 2: trackMax + tyreWidth <= overallWidth
  const maxTrack = Math.max(profile.trackFront, profile.trackRear);
  if (maxTrack + profile.tyreSectionWidth > profile.overallWidth + 0.05) {
    errors.push(
      `Track width violation: max track (${maxTrack}m) + tyre width (${profile.tyreSectionWidth}m) = ${(maxTrack + profile.tyreSectionWidth).toFixed(3)}m exceeds overallWidth (${profile.overallWidth}m). Wheels would protrude beyond fenders.`
    );
  }

  // Rule 3: Wheel radius, arch radius and ground clearance mutual consistency
  if (profile.wheelArchRadius <= profile.wheelRadiusFront) {
    errors.push(
      `Wheel arch radius (${profile.wheelArchRadius}m) must be larger than front wheel radius (${profile.wheelRadiusFront}m) to provide suspension travel clearance.`
    );
  }

  if (profile.groundClearance <= 0.04 || profile.groundClearance >= profile.overallHeight * 0.4) {
    errors.push(
      `Plausible ground clearance violation: ${profile.groundClearance}m is out of bounds for ${profile.bodyStyle}.`
    );
  }

  // Rule 4: Roof height and overall height consistency
  if (profile.roofHeight > profile.overallHeight) {
    errors.push(
      `Roof height (${profile.roofHeight}m) cannot exceed overallHeight (${profile.overallHeight}m).`
    );
  }

  // Rule 5: Cabin and bonnet length must fit inside length
  if (profile.bonnetLength + profile.cabinLength > profile.overallLength) {
    errors.push(
      `Bonnet length (${profile.bonnetLength}m) + cabin length (${profile.cabinLength}m) = ${(profile.bonnetLength + profile.cabinLength).toFixed(3)}m exceeds overallLength (${profile.overallLength}m).`
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 7 Archetype Templates as defined in Phase 3
 * All marked with source: "approximate-template"
 */
export const ARCHETYPE_TEMPLATES: Record<BodyStyle, VehicleGeometryProfile> = {
  // 1. SEDAN (L 4.85, W 1.85, H 1.45, Wheelbase 2.85)
  sedan: {
    id: 'archetype_sedan',
    displayName: 'Executive Sport Sedan',
    bodyStyle: 'sedan',
    source: 'approximate-template',
    wheelbase: 2.85,
    trackFront: 1.58,
    trackRear: 1.60,
    overallLength: 4.85,
    overallWidth: 1.85,
    overallHeight: 1.45,
    frontOverhang: 0.95,
    rearOverhang: 1.05,
    bonnetLength: 1.42,
    cabinStartX: 0.15,
    cabinLength: 2.25,
    roofHeight: 1.42,
    roofPeakX: -0.45,
    windshieldAngleDeg: 58.0,
    rearWindowAngleDeg: 56.0,
    wheelRadiusFront: 0.34,
    wheelRadiusRear: 0.34,
    tyreSectionWidth: 0.245,
    tyreAspectRatio: 40,
    wheelArchRadius: 0.385,
    wheelArchFlare: 0.035,
    groundClearance: 0.135,
    beltlineHeight: 0.92,
    drivetrainLayout: 'FR'
  },

  // 2. COUPE (L 4.50, W 1.82, H 1.35, Wheelbase 2.70)
  coupe: {
    id: 'archetype_coupe',
    displayName: 'Grand Touring Coupe',
    bodyStyle: 'coupe',
    source: 'approximate-template',
    wheelbase: 2.70,
    trackFront: 1.56,
    trackRear: 1.58,
    overallLength: 4.50,
    overallWidth: 1.82,
    overallHeight: 1.35,
    frontOverhang: 0.88,
    rearOverhang: 0.92,
    bonnetLength: 1.38,
    cabinStartX: 0.20,
    cabinLength: 2.05,
    roofHeight: 1.33,
    roofPeakX: -0.35,
    windshieldAngleDeg: 62.0,
    rearWindowAngleDeg: 64.0,
    wheelRadiusFront: 0.335,
    wheelRadiusRear: 0.345,
    tyreSectionWidth: 0.255,
    tyreAspectRatio: 35,
    wheelArchRadius: 0.375,
    wheelArchFlare: 0.045,
    groundClearance: 0.120,
    beltlineHeight: 0.88,
    drivetrainLayout: 'FR'
  },

  // 3. SPORTS CAR (L 4.30, W 1.80, H 1.25, Wheelbase 2.50)
  sports_car: {
    id: 'archetype_sports_car',
    displayName: 'Lightweight Track Sports Car',
    bodyStyle: 'sports_car',
    source: 'approximate-template',
    wheelbase: 2.50,
    trackFront: 1.54,
    trackRear: 1.56,
    overallLength: 4.30,
    overallWidth: 1.80,
    overallHeight: 1.25,
    frontOverhang: 0.86,
    rearOverhang: 0.94,
    bonnetLength: 1.32,
    cabinStartX: 0.25,
    cabinLength: 1.85,
    roofHeight: 1.24,
    roofPeakX: -0.25,
    windshieldAngleDeg: 64.0,
    rearWindowAngleDeg: 68.0,
    wheelRadiusFront: 0.325,
    wheelRadiusRear: 0.335,
    tyreSectionWidth: 0.265,
    tyreAspectRatio: 35,
    wheelArchRadius: 0.365,
    wheelArchFlare: 0.055,
    groundClearance: 0.110,
    beltlineHeight: 0.82,
    drivetrainLayout: 'MR'
  },

  // 4. SUPERCAR (L 4.50, W 1.95, H 1.12, Wheelbase 2.65)
  supercar: {
    id: 'archetype_supercar',
    displayName: 'Mid-Engine Hypercar',
    bodyStyle: 'supercar',
    source: 'approximate-template',
    wheelbase: 2.65,
    trackFront: 1.68,
    trackRear: 1.70,
    overallLength: 4.50,
    overallWidth: 1.95,
    overallHeight: 1.12,
    frontOverhang: 0.95,
    rearOverhang: 0.90,
    bonnetLength: 0.95, // Short nose on mid-engine car
    cabinStartX: 0.45,
    cabinLength: 1.95,
    roofHeight: 1.11,
    roofPeakX: 0.10,
    windshieldAngleDeg: 68.0,
    rearWindowAngleDeg: 72.0,
    wheelRadiusFront: 0.335,
    wheelRadiusRear: 0.355,
    tyreSectionWidth: 0.295,
    tyreAspectRatio: 30,
    wheelArchRadius: 0.380,
    wheelArchFlare: 0.075,
    groundClearance: 0.095,
    beltlineHeight: 0.74,
    drivetrainLayout: 'MR'
  },

  // 5. SUV (L 4.80, W 1.95, H 1.75, Wheelbase 2.90)
  suv: {
    id: 'archetype_suv',
    displayName: 'Luxury Performance SUV',
    bodyStyle: 'suv',
    source: 'approximate-template',
    wheelbase: 2.90,
    trackFront: 1.66,
    trackRear: 1.68,
    overallLength: 4.80,
    overallWidth: 1.95,
    overallHeight: 1.75,
    frontOverhang: 0.92,
    rearOverhang: 0.98,
    bonnetLength: 1.45,
    cabinStartX: 0.10,
    cabinLength: 2.55,
    roofHeight: 1.73,
    roofPeakX: -0.60,
    windshieldAngleDeg: 52.0,
    rearWindowAngleDeg: 48.0,
    wheelRadiusFront: 0.385,
    wheelRadiusRear: 0.385,
    tyreSectionWidth: 0.275,
    tyreAspectRatio: 50,
    wheelArchRadius: 0.445,
    wheelArchFlare: 0.045,
    groundClearance: 0.220,
    beltlineHeight: 1.15,
    drivetrainLayout: 'AWD'
  },

  // 6. MUSCLE CAR (L 4.80, W 1.90, H 1.35, Wheelbase 2.75)
  muscle_car: {
    id: 'archetype_muscle_car',
    displayName: 'American V8 Muscle Coupe',
    bodyStyle: 'muscle_car',
    source: 'approximate-template',
    wheelbase: 2.75,
    trackFront: 1.62,
    trackRear: 1.64,
    overallLength: 4.80,
    overallWidth: 1.90,
    overallHeight: 1.35,
    frontOverhang: 1.02,
    rearOverhang: 1.03,
    bonnetLength: 1.65, // Long aggressive muscle hood
    cabinStartX: 0.15,
    cabinLength: 1.95,
    roofHeight: 1.34,
    roofPeakX: -0.30,
    windshieldAngleDeg: 56.0,
    rearWindowAngleDeg: 58.0,
    wheelRadiusFront: 0.355,
    wheelRadiusRear: 0.365,
    tyreSectionWidth: 0.285,
    tyreAspectRatio: 40,
    wheelArchRadius: 0.405,
    wheelArchFlare: 0.065,
    groundClearance: 0.130,
    beltlineHeight: 0.90,
    drivetrainLayout: 'FR'
  },

  // 7. PICKUP (L 5.30, W 2.00, H 1.90, Wheelbase 3.20)
  pickup: {
    id: 'archetype_pickup',
    displayName: 'Heavy Duty Adventure Pickup',
    bodyStyle: 'pickup',
    source: 'approximate-template',
    wheelbase: 3.20,
    trackFront: 1.72,
    trackRear: 1.74,
    overallLength: 5.30,
    overallWidth: 2.00,
    overallHeight: 1.90,
    frontOverhang: 1.00,
    rearOverhang: 1.10,
    bonnetLength: 1.55,
    cabinStartX: 0.10,
    cabinLength: 2.10,
    roofHeight: 1.88,
    roofPeakX: -0.40,
    windshieldAngleDeg: 50.0,
    rearWindowAngleDeg: 10.0, // Near-vertical back glass
    wheelRadiusFront: 0.410,
    wheelRadiusRear: 0.410,
    tyreSectionWidth: 0.285,
    tyreAspectRatio: 65,
    wheelArchRadius: 0.485,
    wheelArchFlare: 0.055,
    groundClearance: 0.250,
    beltlineHeight: 1.25,
    drivetrainLayout: 'AWD'
  }
};

export class GeometryProfileRepository {
  private profiles: Map<string, VehicleGeometryProfile> = new Map();

  constructor() {
    // Register all default archetypes
    for (const [key, profile] of Object.entries(ARCHETYPE_TEMPLATES)) {
      this.registerProfile(profile);
    }
  }

  registerProfile(profile: VehicleGeometryProfile): void {
    const val = validateGeometryProfile(profile);
    if (!val.valid) {
      throw new Error(`Invalid vehicle geometry profile "${profile.id}": ${val.errors.join('; ')}`);
    }
    this.profiles.set(profile.id, { ...profile });
  }

  getProfile(id: string): VehicleGeometryProfile | undefined {
    return this.profiles.get(id);
  }

  getProfileForBodyStyle(style: BodyStyle): VehicleGeometryProfile {
    const p = this.profiles.get(`archetype_${style}`);
    if (p) return p;
    return ARCHETYPE_TEMPLATES[style] || ARCHETYPE_TEMPLATES.coupe;
  }

  listProfiles(): VehicleGeometryProfile[] {
    return Array.from(this.profiles.values());
  }
}
