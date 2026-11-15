// Type definitions for AUTOVERSE 3D automotive configurator

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ModSlotConfig {
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

export interface ExtrasConfig {
  [key: string]: boolean;
}

export interface AttachmentData {
  offset: { x: number; y: number; z: number };
  parentOffset: { x: number; y: number; z: number };
  quat: { x: number; y: number; z: number; w: number };
  otherBone: number;
  myBone: number;
  flags: number;
}

export interface AttachmentEntity {
  format: string;
  type: number;
  model: number;
  baseFlags: number;
  [key: string]: any;
}

export interface VehicleAttachment {
  data: AttachmentData;
  entity: AttachmentEntity;
}

export interface CheraxVehicleConfig {
  format: string;
  type: number;
  model: number;
  baseFlags: number;
  mods: { [slotName: string]: ModSlotConfig };
  extras?: ExtrasConfig;
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
  parametricSpec?: any;
  [extraProp: string]: any; // Preserve any undocumented or future properties
}

export interface VehicleModelMetadata {
  hash: number;
  codeName: string;
  displayName: string;
  manufacturer: string;
  realWorldModel: string;
  category: 'Supercar' | 'Sports Car' | 'Tuner / Compact' | 'Muscle' | 'SUV / Offroad' | 'Special / Concept';
  configurations: VehicleFileSummary[];
}

export interface VehicleFileSummary {
  fileName: string;
  modelHash: number;
  modelCode: string;
  displayName: string;
  realWorldModel: string;
  manufacturer: string;
  category: string;
  plateText: string;
  plateTextIndex: number;
  primaryColor: number;
  secondaryColor: number;
  isPrimaryColorCustom: boolean;
  customPrimaryColor: RGBColor;
  isSecondaryColorCustom: boolean;
  customSecondaryColor: RGBColor;
  pearlescentColor: number;
  wheelType: number;
  wheelColor: number;
  windowTint: number;
  bulletproofTyres: boolean;
  driftTyres: boolean;
  neonKits: NeonKitsConfig;
  tyreSmokeColor: RGBColor;
  interiorColor: number;
  dashBoardColor: number;
  hasExtras: boolean;
  extrasCount: number;
  modsCount: number;
  activeModsCount: number;
  hasAttachments: boolean;
  attachmentsCount: number;
}

export interface VehicleDatabase {
  totalFiles: number;
  totalModels: number;
  duplicateSets: Array<{ original: string; duplicate: string }>;
  propertiesStats: { [key: string]: number };
  models: VehicleModelMetadata[];
  files: VehicleFileSummary[];
}

export type CameraPreset = 'front' | 'rear' | 'left' | 'right' | 'top' | 'isometric' | 'interior' | 'wheel' | 'wing';

export type EnvironmentPreset = 'studio-dark' | 'cyber-neon' | 'showroom' | 'desert-dawn' | 'sunset-boulevard';

export type PaintFinish = 'metallic' | 'matte' | 'gloss' | 'pearlescent';

export interface VehicleAssetBinding {
  modelHash: number;
  assetPath: string;
  assetFormat: 'glb' | 'gltf' | 'obj' | 'fbx' | 'stl' | 'ply' | 'step' | 'procedural' | 'json';
  assetName: string;
  isCustomUpload?: boolean;
  customMesh?: any;
  qualityClass?: 'CLASS_A_VERIFIED_OEM' | 'CLASS_B_VERIFIED_PRODUCTION' | 'CLASS_C_RECONSTRUCTED' | 'CLASS_D_APPROXIMATE';
  provenanceCertificate?: any;
  validationReport?: any;
  components?: any;
  parametricSpec?: any;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  offset?: [number, number, number];
  materialBindings?: {
    primaryPaint?: string;
    secondaryPaint?: string;
    glass?: string;
    wheels?: string;
    calipers?: string;
    interior?: string;
    lights?: string;
  };
}

