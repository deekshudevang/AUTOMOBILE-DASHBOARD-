import * as THREE from 'three';

/**
 * Phase 7: Four Accuracy Categories
 */
export type GeometryQualityClass =
  | 'CLASS_A_VERIFIED_OEM'
  | 'CLASS_B_VERIFIED_PRODUCTION'
  | 'CLASS_C_RECONSTRUCTED'
  | 'CLASS_D_APPROXIMATE';

export type SupportedGeometryFormat =
  | 'glb'
  | 'gltf'
  | 'obj'
  | 'fbx'
  | 'stl'
  | 'ply'
  | 'step'
  | 'stp'
  | 'json';

export type GeometryUnitSystem = 'm' | 'mm' | 'cm' | 'in' | 'ft';

export type GeometryProvenance =
  | 'Manufacturer CAD (OEM)'
  | 'Production Laser Scan'
  | 'Photogrammetric Reconstruction'
  | 'Licensed 3D Studio Mesh'
  | 'Procedural Parametric Template';

/**
 * Verified real-world manufacturer specifications
 */
export interface ManufacturerSpecifications {
  length: number;           // in metres
  width: number;            // in metres
  height: number;           // in metres
  wheelbase: number;        // in metres
  trackFront: number;       // in metres
  trackRear: number;        // in metres
  frontOverhang?: number;   // in metres
  rearOverhang?: number;    // in metres
  groundClearance?: number; // in metres
  wheelDiameter?: number;   // in metres
  roofHeight?: number;      // in metres
}

/**
 * Phase 2: Metadata Record for every vehicle
 */
export interface AuthenticVehicleMetadata {
  id: string;
  modelHash: number;
  modelCode: string;
  manufacturer: string;
  vehicleName: string;
  modelYear: number;
  generation: string;
  trim: string;
  market: 'US' | 'EU' | 'JP' | 'Global';
  sourceUrl?: string;
  license: string;
  originalDimensions: ManufacturerSpecifications;
  triangleCount: number;
  vertexCount: number;
  geometryFormat: SupportedGeometryFormat;
  unitSystem: GeometryUnitSystem;
  geometryProvenance: GeometryProvenance;
  accuracyClassification: GeometryQualityClass;
  isAuthentic: boolean;
  notes?: string;
}

/**
 * Phase 4: Recognized Vehicle Body Components
 */
export type ComponentCategory = 'exterior' | 'wheels' | 'interior' | 'chassis' | 'unassigned';

export type SemanticComponentType =
  // Exterior
  | 'main_body_shell'
  | 'front_bumper'
  | 'rear_bumper'
  | 'hood'
  | 'roof'
  | 'front_fenders'
  | 'rear_quarter_panels'
  | 'front_doors'
  | 'rear_doors'
  | 'side_mirrors'
  | 'front_grille'
  | 'headlights'
  | 'taillights'
  | 'windows'
  | 'windshield'
  | 'rear_glass'
  | 'side_skirts'
  | 'diffuser'
  | 'spoiler'
  // Wheels & Brakes
  | 'front_left_wheel'
  | 'front_right_wheel'
  | 'rear_left_wheel'
  | 'rear_right_wheel'
  | 'rims'
  | 'tyres'
  | 'brakes'
  | 'brake_calipers'
  | 'wheel_hubs'
  // Interior
  | 'dashboard'
  | 'steering_wheel'
  | 'seats'
  | 'center_console'
  | 'door_panels'
  | 'instrument_cluster'
  // Generic
  | 'generic_part';

export interface RecognizedComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  semanticType: SemanticComponentType;
  objectRef: THREE.Object3D;
  boundingBox: THREE.Box3;
  triangleCount: number;
  vertexCount: number;
  materialNames: string[];
  isSeparated: boolean;
}

export interface VehicleComponentHierarchy {
  exterior: RecognizedComponent[];
  wheels: RecognizedComponent[];
  interior: RecognizedComponent[];
  unassigned: RecognizedComponent[];
  totalComponents: number;
  totalTriangles: number;
}

/**
 * Phase 3: Mesh Topology Analysis Result
 */
export interface TopologyAnalysisResult {
  vertexCount: number;
  triangleCount: number;
  meshCount: number;
  hasNonManifoldEdges: boolean;
  nonManifoldEdgeCount: number;
  degenerateTriangleCount: number;
  hasNanOrInfinity: boolean;
  hasUnitNormals: boolean;
  nonUnitNormalCount: number;
  duplicateVertexCount: number;
  detectedUnit: GeometryUnitSystem;
  scaleFactorToMeters: number;
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
    dimensions: [number, number, number]; // [width X, height Y, length Z]
  };
}

/**
 * Phase 5: Dimensional Validation Result
 */
export interface DimensionCheck {
  metric: string;
  measured: number;
  oemExpected: number;
  deviationPercent: number;
  tolerancePercent: number;
  passed: boolean;
}

export interface GeometryValidationReport {
  vehicleId: string;
  vehicleName: string;
  classification: GeometryQualityClass;
  overallPassed: boolean;
  maxDeviationPercent: number;
  checks: DimensionCheck[];
  topology: TopologyAnalysisResult;
  timestamp: string;
}

/**
 * Phase 6: Orthographic Multi-View Camera Angle
 */
export type OrthographicViewAngle =
  | 'front'
  | 'rear'
  | 'left_side'
  | 'right_side'
  | 'top'
  | 'bottom'
  | 'front_three_quarter'
  | 'rear_three_quarter';

