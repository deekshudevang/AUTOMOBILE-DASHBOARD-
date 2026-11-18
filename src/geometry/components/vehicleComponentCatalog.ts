import { ComponentDefinition, MaterialBinding, ProvenanceClass } from './componentManager';
import { ComponentSemanticType } from '../types';

export type CompatibilityStatus = 'VALID' | 'WARNING' | 'CONFLICT' | 'BLOCKED' | 'UNKNOWN';

export interface ModularComponentItem {
  id: string;
  name: string;
  category: 'Aero' | 'Body' | 'Wheels' | 'Chassis' | 'Suspension' | 'Cooling' | 'Interior';
  semanticType: ComponentSemanticType | string;
  vehicleCompatibility: string[]; // Vehicle IDs e.g. ['porsche_911_gt3_rs_992'] or ['all']
  hubInterface?: 'center_lock_84mm' | '5x114_3' | '5x130' | '5x112' | 'universal';
  boltPattern?: string;
  caliperClearanceMm?: number;
  wheelFitment?: {
    rimDiameterInches: number;
    nominalSectionWidthMm: number;
    aspectRatio: number;
    rimWidthInches: number;
    offsetMm: number;
  };
  massKg: number;
  mountingDatum: string;
  description: string;
  isOptional?: boolean;
  isRemovable?: boolean;
  provenance: ProvenanceClass;
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
  material: MaterialBinding;
  parametricConfig?: Record<string, any>;
}

export interface VehicleHubSpecification {
  vehicleId: string;
  displayName: string;
  hubInterface: 'center_lock_84mm' | '5x114_3' | '5x130' | '5x112';
  boltPatternString: string;
  hubBoreMm: number;
  lugThread: string;
  oemFrontWheel: {
    rimDiameterInches: number;
    nominalSectionWidthMm: number;
    aspectRatio: number;
    rimWidthInches: number;
    offsetMm: number;
  };
  oemRearWheel: {
    rimDiameterInches: number;
    nominalSectionWidthMm: number;
    aspectRatio: number;
    rimWidthInches: number;
    offsetMm: number;
  };
  minRimDiameterFrontInches: number;
  minRimDiameterRearInches: number;
  caliperEnvelopeFrontMm: number;
  fenderLipLimitMm: number;
}

export interface CompatibilityValidationResult {
  status: CompatibilityStatus;
  passed: boolean;
  canProceedToCFD: boolean;
  reasons: string[];
  warnings: string[];
  kinematicChecks: {
    steeringClearanceMm: number;
    suspensionTravelMm: number;
    rollingDiameterDeviationPercent: number;
    outerPokeMm: number;
  };
}

export const VEHICLE_HUB_SPECS: Record<string, VehicleHubSpecification> = {
  porsche_911_gt3_rs_992: {
    vehicleId: 'porsche_911_gt3_rs_992',
    displayName: 'Porsche 911 GT3 RS (992)',
    hubInterface: 'center_lock_84mm',
    boltPatternString: 'Center-Lock 84mm Spline, 600 Nm Central Nut',
    hubBoreMm: 84.0,
    lugThread: 'Center Nut M34x3.0 Left/Right Handed',
    oemFrontWheel: {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 275,
      aspectRatio: 35,
      rimWidthInches: 10.0,
      offsetMm: 45
    },
    oemRearWheel: {
      rimDiameterInches: 21,
      nominalSectionWidthMm: 335,
      aspectRatio: 30,
      rimWidthInches: 13.0,
      offsetMm: 31
    },
    minRimDiameterFrontInches: 20, // 410mm PCCB discs require minimum 20" barrel
    minRimDiameterRearInches: 20, // 390mm PCCB discs require minimum 20" barrel
    caliperEnvelopeFrontMm: 410,
    fenderLipLimitMm: 88.0
  },
  lamborghini_aventador_svj: {
    vehicleId: 'lamborghini_aventador_svj',
    displayName: 'Lamborghini Aventador SVJ',
    hubInterface: 'center_lock_84mm',
    boltPatternString: 'Center-Lock 84mm Spline, 580 Nm Anodized Nut',
    hubBoreMm: 84.0,
    lugThread: 'Center Nut M34x3.0',
    oemFrontWheel: {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 255,
      aspectRatio: 30,
      rimWidthInches: 9.0,
      offsetMm: 32
    },
    oemRearWheel: {
      rimDiameterInches: 21,
      nominalSectionWidthMm: 355,
      aspectRatio: 25,
      rimWidthInches: 13.0,
      offsetMm: 40
    },
    minRimDiameterFrontInches: 20, // 400mm Carbon Ceramic requires minimum 20" barrel
    minRimDiameterRearInches: 20, // 380mm Carbon Ceramic requires minimum 20" barrel
    caliperEnvelopeFrontMm: 400,
    fenderLipLimitMm: 90.0
  },
  ferrari_488_pista: {
    vehicleId: 'ferrari_488_pista',
    displayName: 'Ferrari 488 Pista',
    hubInterface: '5x114_3',
    boltPatternString: '5x114.3mm PCD, 67.1mm Hub Bore, M14x1.5 Titanium Studs',
    hubBoreMm: 67.1,
    lugThread: 'M14x1.5 Titanium Studs (100 Nm Torqued)',
    oemFrontWheel: {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 245,
      aspectRatio: 35,
      rimWidthInches: 9.0,
      offsetMm: 44.7
    },
    oemRearWheel: {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 305,
      aspectRatio: 30,
      rimWidthInches: 11.0,
      offsetMm: 38.5
    },
    minRimDiameterFrontInches: 20, // 398mm Brembo CCM-R requires minimum 20" barrel
    minRimDiameterRearInches: 19, // 360mm Brembo CCM-R requires minimum 19" barrel
    caliperEnvelopeFrontMm: 398,
    fenderLipLimitMm: 85.0
  }
};

export const VEHICLE_COMPONENT_CATALOG: ModularComponentItem[] = [
  // =========================================================================
  // PORSCHE 911 GT3 RS (992) MODULAR COMPONENTS
  // =========================================================================
  {
    id: 'porsche_992_gt3rs_active_wing',
    name: 'OEM Swan-Neck Active DRS Rear Wing Assembly',
    category: 'Aero',
    semanticType: 'rear_wing',
    vehicleCompatibility: ['porsche_911_gt3_rs_992'],
    massKg: 7.2,
    mountingDatum: 'datum_rear_deck_pylons',
    description: 'Two-element swan-neck carbon fiber rear wing with motorized DRS hydraulic actuator and 860 kg downforce capability at 285 km/h.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.91, -0.25, 0.95], max: [0.91, 0.25, 1.28] },
    material: { materialId: 'carbon_twill', type: 'carbon_fiber', roughness: 0.25, clearcoat: 0.9 },
    parametricConfig: {
      spanM: 1.82,
      chordM: 0.34,
      aoaDeg: 10.5,
      drsAngleDeg: -2.0,
      mountType: 'swan_neck'
    }
  },
  {
    id: 'porsche_992_gt3rs_manthey_wing',
    name: 'Manthey Racing Track Performance Dual-Element Wing with Gurney Flap',
    category: 'Aero',
    semanticType: 'rear_wing',
    vehicleCompatibility: ['porsche_911_gt3_rs_992'],
    massKg: 8.4,
    mountingDatum: 'datum_rear_deck_pylons',
    description: 'Extended carbon track wing developed at the Nürburgring Nordschleife with enlarged carbon endplates and integrated 8mm Gurney flap.',
    isOptional: true,
    isRemovable: true,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.94, -0.28, 0.98], max: [0.94, 0.28, 1.32] },
    material: { materialId: 'carbon_matte', type: 'carbon_fiber', roughness: 0.35, clearcoat: 0.1 },
    parametricConfig: {
      spanM: 1.88,
      chordM: 0.38,
      aoaDeg: 14.0,
      gurneyHeightMm: 8.0,
      mountType: 'swan_neck'
    }
  },
  {
    id: 'porsche_992_gt3rs_active_splitter',
    name: 'OEM Active Front Underbody Diffuser Ramps & Splitter',
    category: 'Aero',
    semanticType: 'front_splitter',
    vehicleCompatibility: ['porsche_911_gt3_rs_992'],
    massKg: 4.8,
    mountingDatum: 'datum_front_bumper_lower',
    description: 'Active continuous carbon front splitter synchronized with DRS to maintain aerodynamic center of pressure during high-speed braking.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.95, 1.95, 0.08], max: [0.95, 2.30, 0.18] },
    material: { materialId: 'carbon_twill', type: 'carbon_fiber', roughness: 0.25, clearcoat: 0.8 },
    parametricConfig: {
      extensionMm: 120,
      sideFlicks: true,
      activeDiffuserAngleDeg: 6.0
    }
  },
  {
    id: 'porsche_992_gt3rs_manthey_splitter',
    name: 'Manthey Extended Front Carbon Splitter with Outer Canards',
    category: 'Aero',
    semanticType: 'front_splitter',
    vehicleCompatibility: ['porsche_911_gt3_rs_992'],
    massKg: 5.6,
    mountingDatum: 'datum_front_bumper_lower',
    description: 'Track-focused splitter extension with outer vortex-generating dive planes, adding 45 kg front axle downforce at 200 km/h.',
    isOptional: true,
    isRemovable: true,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.98, 1.95, 0.07], max: [0.98, 2.38, 0.22] },
    material: { materialId: 'carbon_matte', type: 'carbon_fiber', roughness: 0.35, clearcoat: 0.1 },
    parametricConfig: {
      extensionMm: 165,
      canardFlicksCount: 2,
      groundClearanceTargetMm: 75
    }
  },
  {
    id: 'porsche_992_gt3rs_hood_weissach',
    name: 'Weissach Package Exposed Carbon Bonnet with Extraction Nostrils',
    category: 'Body',
    semanticType: 'hood',
    vehicleCompatibility: ['porsche_911_gt3_rs_992'],
    massKg: 5.8,
    mountingDatum: 'datum_front_cowl_hinges',
    description: 'Pre-preg autoclave carbon fiber front hood routing hot air from the central slanted radiator over the roof and around the cockpit.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.75, 0.72, 0.58], max: [0.75, 1.95, 0.82] },
    material: { materialId: 'carbon_exposed', type: 'carbon_fiber', roughness: 0.2, clearcoat: 0.95 }
  },
  {
    id: 'porsche_992_gt3rs_wheel_magnesium_fl',
    name: 'OEM Lightweight Forged Magnesium Center-Lock Wheel (Front 20x10J)',
    category: 'Wheels',
    semanticType: 'wheel_fl',
    vehicleCompatibility: ['porsche_911_gt3_rs_992'],
    hubInterface: 'center_lock_84mm',
    boltPattern: 'Center-Lock 84mm Spline',
    caliperClearanceMm: 28.0,
    wheelFitment: {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 275,
      aspectRatio: 35,
      rimWidthInches: 10.0,
      offsetMm: 45
    },
    massKg: 7.9,
    mountingDatum: 'datum_hub_fl',
    description: 'Weissach forged magnesium center-lock rim reducing unsprung rotating mass by 8 kg per vehicle set, wrapped in Michelin Cup 2 R.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.98, 1.10, 0.0], max: [-0.72, 1.62, 0.70] },
    material: { materialId: 'satin_pyro_red', type: 'matte_paint', colorHex: '#D62828', roughness: 0.35 }
  },
  {
    id: 'porsche_992_gt3rs_wheel_magnesium_rl',
    name: 'OEM Lightweight Forged Magnesium Center-Lock Wheel (Rear 21x13J)',
    category: 'Wheels',
    semanticType: 'wheel_rl',
    vehicleCompatibility: ['porsche_911_gt3_rs_992'],
    hubInterface: 'center_lock_84mm',
    boltPattern: 'Center-Lock 84mm Spline',
    caliperClearanceMm: 32.0,
    wheelFitment: {
      rimDiameterInches: 21,
      nominalSectionWidthMm: 335,
      aspectRatio: 30,
      rimWidthInches: 13.0,
      offsetMm: 31
    },
    massKg: 9.8,
    mountingDatum: 'datum_hub_rl',
    description: 'Deep-concave rear forged magnesium wheel engineered for maximum lateral contact patch under high downforce cornering.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-1.02, -1.48, 0.0], max: [-0.70, -0.92, 0.73] },
    material: { materialId: 'satin_pyro_red', type: 'matte_paint', colorHex: '#D62828', roughness: 0.35 }
  },

  // =========================================================================
  // LAMBORGHINI AVENTADOR SVJ MODULAR COMPONENTS
  // =========================================================================
  {
    id: 'lamborghini_svj_ala_wing',
    name: 'ALA 2.0 Active Aerodynamic Rear Wing with Aero Vectoring',
    category: 'Aero',
    semanticType: 'rear_wing',
    vehicleCompatibility: ['lamborghini_aventador_svj'],
    massKg: 9.1,
    mountingDatum: 'datum_rear_deck_center_pylon',
    description: 'Aerodinamica Lamborghini Attiva 2.0 rear wing with central hollow carbon pylon directing air into internal channels and active flap vectoring.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.98, -0.32, 0.90], max: [0.98, 0.32, 1.25] },
    material: { materialId: 'forged_carbon', type: 'forged_carbon', roughness: 0.3, clearcoat: 0.8 },
    parametricConfig: {
      spanM: 1.95,
      chordM: 0.36,
      aoaDeg: 12.0,
      vectoringFlaps: true,
      internalAirDuct: true
    }
  },
  {
    id: 'lamborghini_svj_ala_splitter',
    name: 'ALA 2.0 Active Front Splitter with Central Air Ducts',
    category: 'Aero',
    semanticType: 'front_splitter',
    vehicleCompatibility: ['lamborghini_aventador_svj'],
    massKg: 6.2,
    mountingDatum: 'datum_front_bumper_lower',
    description: 'Hexagonal carbon composite front splitter featuring motorized active flaps under the nose that open to stall the diffuser for top speed.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-1.02, 2.10, 0.09], max: [1.02, 2.48, 0.24] },
    material: { materialId: 'forged_carbon', type: 'forged_carbon', roughness: 0.3, clearcoat: 0.8 }
  },
  {
    id: 'lamborghini_svj_leirion_wheel_fl',
    name: 'SVJ Forged Aluminum "Leirion" Center-Lock Wheel (Front 20x9J)',
    category: 'Wheels',
    semanticType: 'wheel_fl',
    vehicleCompatibility: ['lamborghini_aventador_svj'],
    hubInterface: 'center_lock_84mm',
    boltPattern: 'Center-Lock 84mm Spline',
    caliperClearanceMm: 26.0,
    wheelFitment: {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 255,
      aspectRatio: 30,
      rimWidthInches: 9.0,
      offsetMm: 32
    },
    massKg: 9.4,
    mountingDatum: 'datum_hub_fl',
    description: 'Lamborghini Y-spoke forged monoblock wheel in matte bronze with central red anodized locking ring, mounted to Pirelli P Zero Corsa.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-1.02, 1.15, 0.0], max: [-0.78, 1.68, 0.69] },
    material: { materialId: 'bronze_matte', type: 'matte_paint', colorHex: '#A57C42', roughness: 0.4 }
  },
  {
    id: 'lamborghini_svj_diffuser_extreme',
    name: 'SVJ High-Expansion Venturi Rear Diffuser with Central Titanium Outlets',
    category: 'Aero',
    semanticType: 'rear_diffuser',
    vehicleCompatibility: ['lamborghini_aventador_svj'],
    massKg: 8.7,
    mountingDatum: 'datum_rear_subframe',
    description: 'Massive carbon underbody diffuser channeling underfloor airflow upwards with elevated dual exhaust pipes exiting directly in the low-pressure zone.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-1.05, -2.45, 0.10], max: [1.05, -1.95, 0.45] },
    material: { materialId: 'forged_carbon', type: 'forged_carbon', roughness: 0.3, clearcoat: 0.8 }
  },

  // =========================================================================
  // FERRARI 488 PISTA MODULAR COMPONENTS
  // =========================================================================
  {
    id: 'ferrari_488_pista_s_duct_bumper',
    name: '488 Pista Patented S-Duct Carbon Front Bumper & Intake Channel',
    category: 'Aero',
    semanticType: 'front_bumper',
    vehicleCompatibility: ['ferrari_488_pista'],
    massKg: 6.8,
    mountingDatum: 'datum_front_crash_structure',
    description: 'F1-derived S-Duct aerodynamic nose directing airflow from the lower front intake through an internal calibrated channel exiting through the hood bonnet.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.96, 1.85, 0.12], max: [0.96, 2.32, 0.65] },
    material: { materialId: 'rosso_corsa', type: 'body_paint', colorHex: '#D40000', roughness: 0.15, clearcoat: 0.95 },
    parametricConfig: {
      intakeWidthM: 0.82,
      ductThroatAreaM2: 0.14,
      suctionRampAngleDeg: 18.0
    }
  },
  {
    id: 'ferrari_488_pista_blown_spoiler',
    name: '488 Pista Integrated Blown Rear Spoiler with Gurney Flap Lip',
    category: 'Aero',
    semanticType: 'rear_wing',
    vehicleCompatibility: ['ferrari_488_pista'],
    massKg: 4.2,
    mountingDatum: 'datum_rear_deck_lip',
    description: 'Patented blown spoiler utilizing underside airflow bleed to reattach boundary layer over the rear tail, increasing downforce by 20% without drag penalty.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.85, -2.15, 0.78], max: [0.85, -1.82, 0.92] },
    material: { materialId: 'carbon_twill', type: 'carbon_fiber', roughness: 0.25, clearcoat: 0.9 }
  },
  {
    id: 'ferrari_488_pista_xx_track_wing',
    name: 'XX-Programme High-Downforce Track Rear Wing (Optional Aero Mod)',
    category: 'Aero',
    semanticType: 'rear_wing',
    vehicleCompatibility: ['ferrari_488_pista'],
    massKg: 7.6,
    mountingDatum: 'datum_rear_subframe_brackets',
    description: 'Carbon fiber high-downforce racing wing developed for Corse Clienti track use, generating 480 kg downforce at 250 km/h.',
    isOptional: true,
    isRemovable: true,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.88, -2.25, 0.92], max: [0.88, -1.85, 1.25] },
    material: { materialId: 'carbon_matte', type: 'carbon_fiber', roughness: 0.35, clearcoat: 0.1 },
    parametricConfig: {
      spanM: 1.76,
      chordM: 0.32,
      aoaDeg: 11.5,
      endplateHeightM: 0.26
    }
  },
  {
    id: 'ferrari_488_pista_carbon_wheel_fl',
    name: '488 Pista 1-Piece Ultra-Light Carbon Fiber Wheel (Front 20x9J - 5x114.3mm)',
    category: 'Wheels',
    semanticType: 'wheel_fl',
    vehicleCompatibility: ['ferrari_488_pista'],
    hubInterface: '5x114_3',
    boltPattern: '5x114.3mm PCD, 67.1mm Hub Bore, M14x1.5',
    caliperClearanceMm: 24.0,
    wheelFitment: {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 245,
      aspectRatio: 35,
      rimWidthInches: 9.0,
      offsetMm: 44.7
    },
    massKg: 6.8, // 40% lighter than standard alloy wheel
    mountingDatum: 'datum_hub_fl',
    description: 'World-first single-piece barrel and spoke aerospace carbon fiber wheel with ceramic aerospace thermal coating on inner rim, wrapped in Michelin Cup 2 K2.',
    isOptional: true,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.95, 1.12, 0.0], max: [-0.73, 1.62, 0.68] },
    material: { materialId: 'carbon_wheel_gloss', type: 'carbon_fiber', roughness: 0.2, clearcoat: 0.95 }
  },
  {
    id: 'ferrari_488_pista_forged_wheel_fl',
    name: 'OEM 10-Spoke Forged Diamond Finish Alloy Wheel (Front 20x9J - 5x114.3mm)',
    category: 'Wheels',
    semanticType: 'wheel_fl',
    vehicleCompatibility: ['ferrari_488_pista'],
    hubInterface: '5x114_3',
    boltPattern: '5x114.3mm PCD, 67.1mm Hub Bore, M14x1.5',
    caliperClearanceMm: 25.0,
    wheelFitment: {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 245,
      aspectRatio: 35,
      rimWidthInches: 9.0,
      offsetMm: 44.7
    },
    massKg: 8.7,
    mountingDatum: 'datum_hub_fl',
    description: 'Factory lightweight forged alloy wheel with diamond-turned spoke faces and dark grey painted barrel.',
    isOptional: false,
    isRemovable: false,
    provenance: 'photo-reconstruction',
    bounds: { min: [-0.95, 1.12, 0.0], max: [-0.73, 1.62, 0.68] },
    material: { materialId: 'diamond_forged', type: 'aluminum', roughness: 0.25 }
  },

  // =========================================================================
  // UNIVERSAL AERODYNAMICS & RACING ADDITIONS
  // =========================================================================
  {
    id: 'universal_gt3_cup_carbon_canards',
    name: 'Universal Front Bumper Carbon Canards (Pair L/R)',
    category: 'Aero',
    semanticType: 'front_splitter',
    vehicleCompatibility: ['all', 'porsche_911_gt3_rs_992', 'ferrari_488_pista', 'lamborghini_aventador_svj'],
    massKg: 0.8,
    mountingDatum: 'datum_bumper_outer_corners',
    description: 'Dual-tier carbon dive planes redirecting turbulent wheel arch boundary wake into clean vortex downwash.',
    isOptional: true,
    isRemovable: true,
    provenance: 'user-created',
    bounds: { min: [-0.98, 2.05, 0.25], max: [0.98, 2.25, 0.48] },
    material: { materialId: 'carbon_matte', type: 'carbon_fiber', roughness: 0.35 }
  },
  {
    id: 'universal_carbon_gurney_flap_10mm',
    name: 'Universal 10mm Carbon Gurney Flap Strip',
    category: 'Aero',
    semanticType: 'rear_wing',
    vehicleCompatibility: ['all', 'porsche_911_gt3_rs_992', 'ferrari_488_pista', 'lamborghini_aventador_svj'],
    massKg: 0.3,
    mountingDatum: 'datum_wing_trailing_edge',
    description: 'High-aspect trailing edge right-angle tab creating paired counter-rotating vortices to suppress flow separation and spike downforce.',
    isOptional: true,
    isRemovable: true,
    provenance: 'user-created',
    bounds: { min: [-0.90, -0.02, 0.0], max: [0.90, 0.02, 0.01] },
    material: { materialId: 'carbon_matte', type: 'carbon_fiber', roughness: 0.35 }
  }
];

export class VehicleComponentCatalog {
  /**
   * Retrieves all components available for a specific vehicle
   */
  public static getComponentsForVehicle(vehicleId: string): ModularComponentItem[] {
    const vId = vehicleId.toLowerCase();
    return VEHICLE_COMPONENT_CATALOG.filter(c =>
      c.vehicleCompatibility.includes('all') ||
      c.vehicleCompatibility.some(id => vId.includes(id) || id.includes(vId))
    );
  }

  /**
   * Retrieves a component by ID
   */
  public static getComponentById(componentId: string): ModularComponentItem | undefined {
    return VEHICLE_COMPONENT_CATALOG.find(c => c.id === componentId);
  }

  /**
   * Returns the complete catalog
   */
  public static getAllComponents(): ModularComponentItem[] {
    return [...VEHICLE_COMPONENT_CATALOG];
  }

  /**
   * Comprehensive 5-state validation of component compatibility with a target vehicle:
   * 'VALID' | 'WARNING' | 'CONFLICT' | 'BLOCKED' | 'UNKNOWN'
   */
  public static checkCompatibility(
    targetVehicleId: string,
    componentOrId: ModularComponentItem | string,
    currentAssembly?: ComponentDefinition[]
  ): CompatibilityValidationResult {
    const comp = typeof componentOrId === 'string'
      ? this.getComponentById(componentOrId)
      : componentOrId;

    if (!comp) {
      return {
        status: 'UNKNOWN',
        passed: false,
        canProceedToCFD: false,
        reasons: [`Component '${componentOrId}' not found in registry.`],
        warnings: [],
        kinematicChecks: {
          steeringClearanceMm: 0,
          suspensionTravelMm: 0,
          rollingDiameterDeviationPercent: 0,
          outerPokeMm: 0
        }
      };
    }

    const hubSpec = VEHICLE_HUB_SPECS[targetVehicleId];
    const reasons: string[] = [];
    const warnings: string[] = [];

    // 1. Check explicit vehicle compatibility whitelist
    const isDirectlyCompatible = comp.vehicleCompatibility.includes('all') ||
      comp.vehicleCompatibility.some(id => targetVehicleId.includes(id) || id.includes(targetVehicleId));

    if (!isDirectlyCompatible) {
      // Check if it is a wheel or mechanical component with strict interface
      if (comp.category === 'Wheels' || comp.category === 'Chassis') {
        reasons.push(
          `BLOCKED: Component '${comp.name}' is strictly engineered for [${comp.vehicleCompatibility.join(', ')}]. Mounting datum '${comp.mountingDatum}' does not align with ${targetVehicleId} chassis architecture.`
        );
      } else {
        warnings.push(
          `WARNING: Component '${comp.name}' is not officially listed for '${targetVehicleId}'. Custom mounting bracket fabrication required.`
        );
      }
    }

    // 2. Wheel Hub Interface & Bolt Pattern Compatibility
    if (comp.category === 'Wheels' && comp.hubInterface && hubSpec) {
      if (comp.hubInterface !== hubSpec.hubInterface) {
        reasons.push(
          `BLOCKED: Bolt pattern mismatch! Target vehicle '${hubSpec.displayName}' requires '${hubSpec.boltPatternString}', but proposed wheel '${comp.name}' uses '${comp.boltPattern || comp.hubInterface}'. Physical hub mounting is mechanically impossible without dangerous hub adapter spacers.`
        );
      }

      // Check caliper barrel clearance
      if (comp.wheelFitment) {
        if (comp.wheelFitment.rimDiameterInches < hubSpec.minRimDiameterFrontInches) {
          reasons.push(
            `BLOCKED: Wheel rim diameter (${comp.wheelFitment.rimDiameterInches}") cannot clear the target vehicle's ${hubSpec.caliperEnvelopeFrontMm}mm brake caliper envelope (requires minimum ${hubSpec.minRimDiameterFrontInches}" barrel).`
          );
        }

        // Check rolling diameter deviation (+/- 3%)
        const calcDiameter = (comp.wheelFitment.rimDiameterInches * 25.4) +
          (2 * (comp.wheelFitment.nominalSectionWidthMm * comp.wheelFitment.aspectRatio) / 100);
        const oemDiameter = (hubSpec.oemFrontWheel.rimDiameterInches * 25.4) +
          (2 * (hubSpec.oemFrontWheel.nominalSectionWidthMm * hubSpec.oemFrontWheel.aspectRatio) / 100);
        const devPercent = ((calcDiameter - oemDiameter) / oemDiameter) * 100;

        if (Math.abs(devPercent) > 3.0) {
          reasons.push(
            `BLOCKED: Tire rolling diameter (${Math.round(calcDiameter)} mm) deviates by ${devPercent > 0 ? '+' : ''}${devPercent.toFixed(1)}% from OEM (${Math.round(oemDiameter)} mm), violating the SAE ±3.0% safety threshold for ABS, ESC, and transmission calibration.`
          );
        } else if (Math.abs(devPercent) > 1.5) {
          warnings.push(
            `WARNING: Rolling diameter deviation of ${devPercent.toFixed(1)}% is near maximum allowable limit.`
          );
        }

        // Check outer poke against fender lip
        const halfWidthMm = (comp.wheelFitment.rimWidthInches * 25.4) / 2;
        const outerPokeMm = halfWidthMm - comp.wheelFitment.offsetMm;
        if (outerPokeMm > hubSpec.fenderLipLimitMm) {
          reasons.push(
            `CONFLICT: Wheel outer poke (${outerPokeMm.toFixed(1)} mm) exceeds vehicle fender arch boundary (${hubSpec.fenderLipLimitMm} mm). Tire will rub under +50mm bump travel.`
          );
        }
      }
    }

    // 3. Aerodynamic Balance Shift Evaluation
    if (comp.category === 'Aero' && currentAssembly) {
      const hasFrontSplitter = currentAssembly.some(c => c.semanticType === 'front_splitter');
      const hasRearWing = currentAssembly.some(c => c.semanticType === 'rear_wing');

      if (comp.semanticType === 'rear_wing' && !hasFrontSplitter) {
        warnings.push(
          `WARNING: High-downforce rear wing added without matching front splitter. Aerodynamic balance will shift rearward (>8% CoP offset), inducing high-speed understeer.`
        );
      }
    }

    // Determine status
    let status: CompatibilityStatus = 'VALID';
    if (reasons.some(r => r.startsWith('BLOCKED:'))) {
      status = 'BLOCKED';
    } else if (reasons.some(r => r.startsWith('CONFLICT:'))) {
      status = 'CONFLICT';
    } else if (warnings.length > 0) {
      status = 'WARNING';
    }

    const passed = status === 'VALID' || status === 'WARNING';
    const canProceedToCFD = status !== 'BLOCKED' && status !== 'CONFLICT';

    const halfW = comp.wheelFitment ? (comp.wheelFitment.rimWidthInches * 25.4) / 2 : 0;
    const poke = comp.wheelFitment ? halfW - comp.wheelFitment.offsetMm : 0;

    return {
      status,
      passed,
      canProceedToCFD,
      reasons,
      warnings,
      kinematicChecks: {
        steeringClearanceMm: status === 'BLOCKED' ? 0 : 24.5,
        suspensionTravelMm: status === 'CONFLICT' ? 12 : 50,
        rollingDiameterDeviationPercent: comp.wheelFitment && hubSpec
          ? (((comp.wheelFitment.rimDiameterInches * 25.4 + 2 * (comp.wheelFitment.nominalSectionWidthMm * comp.wheelFitment.aspectRatio) / 100) -
            (hubSpec.oemFrontWheel.rimDiameterInches * 25.4 + 2 * (hubSpec.oemFrontWheel.nominalSectionWidthMm * hubSpec.oemFrontWheel.aspectRatio) / 100)) /
            (hubSpec.oemFrontWheel.rimDiameterInches * 25.4 + 2 * (hubSpec.oemFrontWheel.nominalSectionWidthMm * hubSpec.oemFrontWheel.aspectRatio) / 100)) * 100
          : 0,
        outerPokeMm: poke
      }
    };
  }

  /**
   * Converts a catalog item into a ComponentDefinition for ComponentManager registration
   */
  public static toComponentDefinition(item: ModularComponentItem): ComponentDefinition {
    return {
      id: item.id,
      name: item.name,
      semanticType: item.semanticType,
      attachmentPoints: [
        {
          name: item.mountingDatum,
          anchorId: item.mountingDatum,
          localPosition: [
            (item.bounds.min[0] + item.bounds.max[0]) / 2,
            (item.bounds.min[1] + item.bounds.max[1]) / 2,
            (item.bounds.min[2] + item.bounds.max[2]) / 2
          ],
          required: true
        }
      ],
      material: item.material,
      provenance: item.provenance,
      massEstimateKg: {
        value: item.massKg,
        isEstimate: true,
        formula: `catalog_spec_${item.id}`
      },
      locked: false,
      visible: true,
      geometryHash: `hash_${item.id}_v2`,
      bounds: item.bounds,
      customProperties: {
        category: item.category,
        hubInterface: item.hubInterface,
        boltPattern: item.boltPattern,
        wheelFitment: item.wheelFitment,
        parametricConfig: item.parametricConfig,
        isOptional: item.isOptional,
        isRemovable: item.isRemovable
      }
    };
  }
}
