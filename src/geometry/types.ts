import * as THREE from 'three';

export type FidelityTier = 'Tier A – Reference-verified' | 'Tier B – Spec-accurate' | 'Tier C – Approximate';

export type VehicleArchetypeId =
  | 'rear_engine_coupe'
  | 'mid_engine_supercar'
  | 'mid_engine_hypercar'
  | 'front_engine_gt_coupe'
  | 'front_engine_sports_car'
  | 'jdm_tuner_performance'
  | 'luxury_super_sedan'
  | 'super_suv_crossover'
  | 'track_special_prototype';

export type ChassisArchetype = VehicleArchetypeId;

export type ComponentSemanticType =
  | 'front_bumper'
  | 'front_splitter'
  | 'hood'
  | 'fender_front_l'
  | 'fender_front_r'
  | 'door_l'
  | 'door_r'
  | 'roof'
  | 'quarter_panel_l'
  | 'quarter_panel_r'
  | 'rear_deck'
  | 'rear_bumper'
  | 'rear_diffuser'
  | 'side_skirt_l'
  | 'side_skirt_r'
  | 'windshield'
  | 'side_glass_l'
  | 'side_glass_r'
  | 'rear_glass'
  | 'rear_window'
  | 'headlight_l'
  | 'headlight_r'
  | 'taillight_l'
  | 'taillight_r'
  | 'grille'
  | 'mirror_l'
  | 'mirror_r'
  | 'rear_wing'
  | 'wing_upright_l'
  | 'wing_upright_r'
  | 'exhaust_tip_l'
  | 'exhaust_tip_r'
  | 'wheel_fl'
  | 'wheel_fr'
  | 'wheel_rl'
  | 'wheel_rr'
  | 'underbody'
  | 'interior';

export interface StationCrossSection {
  station_z_m: number;
  width_half_m: number;
  floor_y_m: number;
  rocker_y_m: number;
  belt_y_m: number;
  roof_y_m: number;
  shoulder_flare_m?: number;
  tumblehome_m?: number;
}

export interface CoachworkDimensions {
  overall_length_m: number;
  overall_width_m: number;
  overall_height_m: number;
  wheelbase_m: number;
  front_track_m: number;
  rear_track_m: number;
  ground_clearance_m: number;
}

export interface WheelAssemblySpec {
  rimDiameterInches: number;
  rimWidthInches: number;
  nominalSectionWidthMm: number;
  aspectRatio: number;
  offsetMm: number;
  spokeStyle: 'center_lock_y_spoke' | 'gt_mesh' | '5_spoke' | 'turbofan' | 'twin_spoke';
  finish: 'satin_black' | 'silver_alloy' | 'neodyme_gold' | 'dark_titanium';
  brakeDiscType: 'carbon_ceramic' | 'drilled_steel';
  caliperColor: string;
}

export interface VehicleGeometryDefinition {
  schemaVersion: 2;
  meta: {
    id: string;
    manufacturer: string;
    model: string;
    generation?: string;
    year: number;
    archetype: VehicleArchetypeId;
    provenanceLevel?: 'verified' | 'derived' | 'estimated' | 'unverified';
  };
  geometry: {
    generatorId: string;
    generatorVersion: string;
    fidelityTier: FidelityTier;
    units: 'meters';
    origin: 'ground_center';
    dimensions: CoachworkDimensions;
    stations?: StationCrossSection[];
  };
  reference: {
    specs: Record<string, { value: any; provenance: 'verified' | 'derived' | 'estimated' | 'unknown'; source?: string; url?: string; sourceUrl?: string; retrieved_at?: string }>;
    images?: { side?: string; front?: string; rear?: string; top?: string };
  };
  wheels: {
    front: WheelAssemblySpec;
    rear: WheelAssemblySpec;
  };
  materials: Record<string, MaterialDefinition>;
  shutLineGapMm?: number;
}

export interface MaterialDefinition {
  type: 'clearcoat_paint' | 'tyre_rubber' | 'alloy_metal' | 'carbon_fiber' | 'transmissive_glass' | 'emissive_light' | 'interior_leather';
  color: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

export interface GeometryNodeMetadata {
  id: string;
  semanticType: ComponentSemanticType;
  parentId?: string;
  pivot: [number, number, number];
  attachPoint: [number, number, number];
  visible: boolean;
  triangleCount: number;
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
    size: [number, number, number];
  };
  materialId: string;
}

export interface GeometryQualityReport {
  overallDimensions: { pass: boolean; tolerance: string; deltaMm: Record<string, number> };
  groundContact: { pass: boolean; deltaYMm: number };
  symmetry: { pass: boolean; maxDeviationMm: number };
  noFloatingGeometry: { pass: boolean; orphanIslands: number; maxDetachedGapMm: number };
  manifoldBody: { pass: boolean; openEdges: number };
  normalsAndShading: { pass: boolean; facetedPanels: number };
  componentization: { pass: boolean; componentCount: number };
  triangleBudget: { pass: boolean; count: number; budget: number };
  noPrimitivePanels: { pass: boolean; primitiveBoxesFound: string[] };
  curvaturePresent: { pass: boolean; flatPanelsFound: string[]; minCurvatureMm: number };
  wheelArchFit: { pass: boolean; occludedWheels: string[] };
  spatialConnectivity: { pass: boolean; maxSeparationMm: number; unattachedComponents: string[] };
  surfaceContinuity: { pass: boolean; maxNormalAngleDeg: number; discontinuousEdges: number };
  shutLineSpacing: { pass: boolean; minGapMm: number; maxGapMm: number; collisions: string[] };
  wheelVisibility: { pass: boolean; minVisibilityPercent: number; unoccludedWheels: Record<string, number> };
  appendageAnchoring: { pass: boolean; maxAnchorGapMm: number; detachedAppendages: string[] };
  plateAttachment: { pass: boolean; frontPlateDeltaMm: number; rearPlateDeltaMm: number };
  renderSanity: { pass: boolean; estimatedLuminance: number };
  provenanceConsistency: { pass: boolean; declaredTier: string; earnedTier: string };
  distinctness?: { pass: boolean; outputHash: string; triangleCount: number };
  allPassed: boolean;
}
