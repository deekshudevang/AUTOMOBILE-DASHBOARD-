/**
 * AUTOVERSE 3D — Schema 2.0 Vehicle Specification Contracts
 * Defines individual editable components, body geometry cross-sections,
 * independent 4-wheel assemblies, PBR materials, and real-time customization options.
 */

export type VehicleCategory2 =
  | 'supercar'
  | 'hypercar'
  | 'sports_car'
  | 'luxury_car'
  | 'track_car'
  | 'jdm_car'
  | 'muscle_car'
  | 'concept_car'
  | 'special_edition';

export type ComponentGroup =
  | 'body_panels'
  | 'aerodynamics'
  | 'lighting'
  | 'windows'
  | 'wheels'
  | 'exhaust'
  | 'interior';

export type MaterialFinishType =
  | 'paint_metallic'
  | 'paint_gloss'
  | 'paint_matte'
  | 'carbon_fiber'
  | 'forged_carbon'
  | 'chrome'
  | 'alloy'
  | 'glass'
  | 'rubber'
  | 'emissive_led'
  | 'leather';

export interface ComponentTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface ComponentDimensions {
  width?: number;
  height?: number;
  length?: number;
  thickness?: number;
}

export interface ComponentCustomizationOptions {
  allowPosition?: boolean;
  allowRotation?: boolean;
  allowScale?: boolean;
  allowDimensions?: boolean;
  allowMaterial?: boolean;
  allowColor?: boolean;
  ranges?: {
    positionX?: [number, number];
    positionY?: [number, number];
    positionZ?: [number, number];
    rotationX?: [number, number];
    rotationY?: [number, number];
    rotationZ?: [number, number];
    scale?: [number, number];
    width?: [number, number];
    height?: [number, number];
    length?: [number, number];
    thickness?: [number, number];
  };
  specificOptions?: Record<string, any>;
}

export interface VehicleComponentDef {
  id: string;
  name: string;
  group: ComponentGroup;
  parentId?: string;
  transform: ComponentTransform;
  dimensions?: ComponentDimensions;
  materialRef: string;
  editable: boolean;
  geometryType: string;
  customizationOptions: ComponentCustomizationOptions;
}

export interface WheelComponentSpec {
  id: string;
  axle: 'front' | 'rear';
  side: 'left' | 'right';
  center_m: { x: number; y: number; z: number };
  tire: {
    size: string;
    nominal_section_width_mm: number;
    aspect_ratio: number;
    rim_diameter_in: number;
    calculated_outer_diameter_mm: number;
    calculated_radius_m: number;
    treadPattern?: 'slick' | 'semi-slick' | 'performance_tread' | 'all_season';
  };
  rim: {
    size: string;
    width_m: number;
    diameter_m: number;
    style: string;
    spokeCount: number;
    offset_mm: number;
  };
  brakes: {
    discDiameter_m: number;
    caliperColor: string;
    pistonCount: number;
  };
  alignment: {
    camberDeg: number;
    toeDeg: number;
  };
}

export interface LongitudinalCrossSection {
  z_m: number;
  half_width_m: number;
  lower_y_m: number;
  shoulder_y_m: number;
  belt_y_m: number;
  upper_center_y_m: number;
  roof_half_width_m: number;
  roof_crown_y_m: number;
}

export interface MaterialDef {
  id: string;
  name: string;
  type: MaterialFinishType;
  color: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  transparent?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
}

export type FitmentClassification = 'DIRECT_FIT' | 'ADAPTABLE' | 'INCOMPATIBLE';

export interface FitmentEvaluation {
  status: FitmentClassification;
  passed: boolean;
  score: number; // 0 - 100
  reasons: string[];
  warnings: string[];
  scaleAdjustment: [number, number, number];
  mountingOffsetDelta: [number, number, number];
  requiresAdapterKit: boolean;
  adapterKitDescription?: string;
  kinematics?: {
    hubMatched: boolean;
    trackWidthDeltaMm: number;
    clearanceOk: boolean;
    aeroBalanceDeltaPercent: number;
  };
}

export interface ComponentOverride {
  componentId: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  dimensions?: ComponentDimensions;
  materialRef?: string;
  customColorHex?: string;
  materialFinish?: MaterialFinishType;
  visible?: boolean;
  locked?: boolean;
  contextSettings?: Record<string, any>;
  // Cross-Car Part Swapping & Modular Customization
  donorVehicleId?: string;
  donorVehicleName?: string;
  donorComponentId?: string;
  donorComponentName?: string;
  fitmentType?: FitmentClassification;
  fitmentNotes?: string;
  adapterScale?: [number, number, number];
  adapterOffset?: [number, number, number];
  replacementMeshId?: string;
  wheelStyle?: string;
  wheelDiameterInches?: number;
  wheelCamberDeg?: number;
  wheelSpacerMm?: number;
  wheelFrontCamberDeg?: number;
  wheelRearCamberDeg?: number;
  tireCompound?: 'street' | 'cup2r' | 'trofeo' | 'slick';
  caliperColorHex?: string;
  clearcoatRoughness?: number;
  metallicFlakeDensity?: number;
  clearcoatStrength?: number;
  wingAngleDeg?: number;
  splitterExtensionMm?: number;
  divePlanesEnabled?: boolean;
  exhaustTipStyle?: 'burnt_titanium' | 'quad_black' | 'center_inconel' | 'chrome_dual';
  exhaustValvesOpen?: boolean;
  drlColorTemp?: 'ice_blue' | 'yellow' | 'white';
  interiorTrim?: 'matte_carbon' | 'gloss_carbon' | 'aluminum';
  upholsteryTheme?: 'alcantara' | 'nappa' | 'carbon_bucket' | 'clubsport';
  stitchingColorHex?: string;
}

export interface VehicleSchema2 {
  schemaVersion: '2.0';
  vehicle: {
    id: string;
    manufacturer: string;
    model: string;
    generation: string;
    year: number;
    category: VehicleCategory2;
    geometryClass: 'procedural' | 'authentic_cad' | 'hybrid';
    geometrySource: 'original_autoverse_parametric_design';
    units: 'meters';
    bodyStyle?: string;
    driveLayout?: string;
    engineDescription?: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
    frontTrack: number;
    rearTrack: number;
    frontOverhang: number;
    rearOverhang: number;
    groundClearance?: number;
  };
  bodyGeometry: {
    crossSections: LongitudinalCrossSection[];
    surfaceProfiles?: any[];
    controlPoints?: any[];
    curves?: any[];
    panels?: string[];
  };
  components: VehicleComponentDef[];
  wheels: {
    frontLeft: WheelComponentSpec;
    frontRight: WheelComponentSpec;
    rearLeft: WheelComponentSpec;
    rearRight: WheelComponentSpec;
  };
  materials: MaterialDef[];
  customization: {
    editableComponents: string[];
    supportedTransforms: string[];
    factoryConfiguration: Record<string, any>;
    presets?: Array<{
      name: string;
      description: string;
      overrides: Record<string, Partial<ComponentOverride>>;
    }>;
  };
  renderSettings: {
    ambientOcclusion?: boolean;
    shadowCast?: boolean;
    reflectionProbe?: string;
    defaultPaintColor: string;
  };
  validation: {
    oemGeometryVerified: boolean;
    accuracyClass: 'A_CAD' | 'B_SCAN' | 'C_MESH' | 'D_APPROXIMATE';
    accuracyNotice: string;
    watertight: boolean;
    componentCount: number;
  };
}

