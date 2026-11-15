/**
 * AUTOVERSE 3D — Universal TypeScript Shared Types & System Contracts
 */

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export type FourLevelStatusLevelA = 'VALID' | 'INVALID' | 'WARNINGS';
export type FourLevelStatusLevelB = 'IDENTIFIED' | 'UNRESOLVED' | 'AMBIGUOUS';
export type FourLevelStatusLevelC = 'REAL_ASSET_LOADED' | 'PROCEDURAL_TEMPLATE_LOADED' | 'MISSING_ASSET';
export type PropertyStatusResult = 'APPLIED' | 'PRESERVED_ONLY' | 'UNRESOLVED' | 'UNSUPPORTED';

export interface FourLevelStatusReport {
  levelA: {
    status: FourLevelStatusLevelA;
    format: string;
    message: string;
    warnings: string[];
  };
  levelB: {
    status: FourLevelStatusLevelB;
    modelHash: number;
    hexId: string;
    resolvedName?: string;
    manufacturer?: string;
    realWorldEquivalent?: string;
    confidence: 'VERIFIED_NATIVE' | 'ADDON_MATCH' | 'MANUAL_MAPPING' | 'UNRESOLVED';
  };
  levelC: {
    status: FourLevelStatusLevelC;
    assetPath?: string;
    assetFormat?: 'glb' | 'gltf' | 'obj' | 'fbx' | 'procedural';
    isApproximate: boolean;
    approximateLabel?: string;
  };
  levelD: {
    propertyResults: Record<string, PropertyStatusResult>;
    totalApplied: number;
    totalPreserved: number;
    totalUnresolved: number;
    totalUnsupported: number;
  };
}

export interface ModSlotOption {
  index: number;
  variation?: boolean;
}

export interface NeonKitsConfig {
  left: boolean;
  right: boolean;
  front: boolean;
  back: boolean;
  color: RGBColor;
}

export interface AttachmentData {
  offset: { x: number; y: number; z: number };
  parentOffset: { x: number; y: number; z: number };
  quat: { x: number; y: number; z: number; w: number };
  otherBone: number;
  myBone: number;
  flags: number;
}

export interface AttachedEntity {
  format: string;
  type: number;
  model: number;
  baseFlags: number;
  [key: string]: any;
}

export interface VehicleAttachment {
  data: AttachmentData;
  entity: AttachedEntity;
}

export interface CheraxVehicleConfig {
  format: string;
  type: number;
  model: number;
  baseFlags: number;
  mods: Record<string, ModSlotOption>;
  extras?: Record<string, boolean>;
  wheelType: number;
  tyreSmokeColor: RGBColor;
  neonKits: NeonKitsConfig;
  primaryColor: number;
  secondaryColor: number;
  pearlescentColor: number;
  isPrimaryColorCustom: boolean;
  customPrimaryColor: RGBColor;
  isSecondaryColorCustom: boolean;
  customSecondaryColor: RGBColor;
  windowTint: number;
  wheelColor: number;
  interiorColor: number;
  dashBoardColor: number;
  plateText: string;
  plateTextIndex: number;
  bulletproofTyres?: boolean;
  driftTyres?: boolean;
  attachments?: VehicleAttachment[];
  _creatorSignature?: string;
  [extraProp: string]: any; // Lossless unknown property preservation bag
}

export interface NormalizedPaint {
  colorIndex: number;
  isCustom: boolean;
  customRgb: RGBColor;
  finish: 'metallic' | 'matte' | 'gloss' | 'chrome' | 'pearlescent';
  pearlescentIndex: number;
}

export interface VehicleSpecification {
  id: string;
  sourceFilename: string;
  sourceFormat: 'Cherax Entity' | 'FiveM XML' | 'Generic Vehicle';
  rawByteReferencePath?: string;
  
  // Normalized Identity
  modelHashUnsigned: number;
  modelHashSigned: number;
  modelHex: string;
  baseFlags: number;

  // Visual Properties
  primaryPaint: NormalizedPaint;
  secondaryPaint: NormalizedPaint;
  wheels: {
    type: number;
    colorIndex: number;
    driftTyres: boolean;
    bulletproofTyres: boolean;
  };
  lighting: {
    neonKits: NeonKitsConfig;
    xenonHeadlightMod: number;
  };
  glass: {
    tintIndex: number;
    tintName: string;
    opacity: number;
  };
  interior: {
    interiorColorIndex: number;
    dashboardColorIndex: number;
  };
  licensePlate: {
    text: string;
    styleIndex: number;
    styleName: string;
  };
  effects: {
    tyreSmokeRgb: RGBColor;
  };
  tuningMods: Record<string, ModSlotOption>;
  extras: Record<string, boolean>;
  attachments: VehicleAttachment[];

  // Lossless preservation bag
  losslessUnknownProps: Record<string, any>;
}

export interface GeometryProfile {
  modelHash: number;
  wheelbase: number;
  trackWidthFront: number;
  trackWidthRear: number;
  wheelRadius: number;
  groundClearance: number;
  bodyDimensions: [number, number, number]; // width, height, length
  mountPoints: Record<string, [number, number, number]>;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  type: 'chassis' | 'body_shell' | 'hood' | 'bumper_f' | 'bumper_r' | 'wing' | 'skirt_l' | 'skirt_r' | 'wheel_fl' | 'wheel_fr' | 'wheel_rl' | 'wheel_rr' | 'exhaust' | 'glass_windshield' | 'glass_rear' | 'glass_side' | 'seat_l' | 'seat_r' | 'steering_wheel' | 'rollcage' | 'plate_f' | 'plate_r';
  source: 'real_mesh' | 'procedural' | 'imported_mod';
  materialSlot: string;
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  visible: boolean;
  metadata?: Record<string, any>;
}

export interface VehicleAssembly {
  specId: string;
  components: ComponentDefinition[];
  sceneGraph: any; // Three.js Group / Object3D
  bounds: {
    center: [number, number, number];
    size: [number, number, number];
  };
  isApproximate: boolean;
  statusReport: FourLevelStatusReport;
}

export interface VehicleAssetBinding {
  modelHash: number;
  assetPath: string;
  assetFormat: 'glb' | 'gltf' | 'obj' | 'fbx' | 'procedural';
  assetName: string;
  isCustomUpload?: boolean;
  materialBindings?: Record<string, string>;
  wheelAttachmentPoints?: {
    frontLeft: [number, number, number];
    frontRight: [number, number, number];
    rearLeft: [number, number, number];
    rearRight: [number, number, number];
  };
}

export type CameraPreset = 'front' | 'rear' | 'left' | 'right' | 'top' | 'isometric' | 'interior' | 'wheel';
export type EnvironmentPreset = 'studio-dark' | 'cyber-neon' | 'showroom' | 'desert-dawn' | 'sunset-boulevard';

export * from './schema2';
