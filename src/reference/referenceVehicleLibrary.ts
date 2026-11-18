export type ProvenanceConfidence = 'verified' | 'reported' | 'estimated';

export interface SourcedField<T> {
  value: T;
  source: string;
  retrievedOn: string;
  confidence: ProvenanceConfidence;
  notes?: string;
}

export interface ReferenceImagePlane {
  view: 'front' | 'rear' | 'left' | 'right' | 'top' | 'perspective_3_4';
  url: string;
  scalePixelsPerMeter: number;
  originPixel: [number, number];
  opacity: number;
  visible: boolean;
}

export interface ReferenceVehicle {
  id: string;
  isReadOnly: true;
  manufacturer: SourcedField<string>;
  model: SourcedField<string>;
  generation: SourcedField<string>;
  year: SourcedField<number>;
  variant: SourcedField<string>;
  dimensions: {
    lengthM: SourcedField<number>;
    widthM: SourcedField<number>;
    heightM: SourcedField<number>;
    wheelbaseM: SourcedField<number>;
    frontTrackM: SourcedField<number>;
    rearTrackM: SourcedField<number>;
    groundClearanceM: SourcedField<number>;
    frontalAreaM2: SourcedField<number>;
  };
  kerbWeightKg: SourcedField<number>;
  powertrain: {
    layout: SourcedField<'rear_engine_rwd' | 'mid_engine_rwd' | 'mid_engine_awd' | 'front_engine_rwd' | 'front_engine_awd'>;
    engineType: SourcedField<string>;
    powerHp: SourcedField<number>;
  };
  aeroFeatures: SourcedField<string[]>;
  referenceImages: ReferenceImagePlane[];
}

export class ReferenceVehicleReadOnlyError extends Error {
  constructor(vehicleId: string) {
    super(`Reference vehicle '${vehicleId}' is strictly READ-ONLY. Fork this vehicle to create an editable design project.`);
    this.name = 'ReferenceVehicleReadOnlyError';
  }
}

/**
 * Canonical Sourced Reference Vehicles
 * Sourced directly from manufacturer homologation and press archives
 */
const CANONICAL_REFERENCES: ReferenceVehicle[] = [
  {
    id: 'porsche_911_gt3_rs_992',
    isReadOnly: true,
    manufacturer: {
      value: 'Porsche',
      source: 'Porsche AG Press Kit 911 GT3 RS (992)',
      retrievedOn: '2024-01-15',
      confidence: 'verified'
    },
    model: {
      value: '911 GT3 RS',
      source: 'Porsche AG Technical Documentation',
      retrievedOn: '2024-01-15',
      confidence: 'verified'
    },
    generation: {
      value: '992.1',
      source: 'Porsche Homologation Sheet',
      retrievedOn: '2024-01-15',
      confidence: 'verified'
    },
    year: {
      value: 2023,
      source: 'Porsche Model Year Catalog',
      retrievedOn: '2024-01-15',
      confidence: 'verified'
    },
    variant: {
      value: 'Weissach Package',
      source: 'Porsche Configurator / Technical Data',
      retrievedOn: '2024-01-15',
      confidence: 'verified'
    },
    dimensions: {
      lengthM: { value: 4.572, source: 'Porsche Press Technical Specs', retrievedOn: '2024-01-15', confidence: 'verified' },
      widthM: { value: 1.900, source: 'Porsche Press Technical Specs', retrievedOn: '2024-01-15', confidence: 'verified' },
      heightM: { value: 1.322, source: 'Porsche Press Technical Specs', retrievedOn: '2024-01-15', confidence: 'verified' },
      wheelbaseM: { value: 2.457, source: 'Porsche Press Technical Specs', retrievedOn: '2024-01-15', confidence: 'verified' },
      frontTrackM: { value: 1.630, source: 'Porsche Press Technical Specs', retrievedOn: '2024-01-15', confidence: 'verified' },
      rearTrackM: { value: 1.588, source: 'Porsche Press Technical Specs', retrievedOn: '2024-01-15', confidence: 'verified' },
      groundClearanceM: { value: 0.100, source: 'Porsche Workshop Manual', retrievedOn: '2024-01-15', confidence: 'reported' },
      frontalAreaM2: { value: 2.12, source: 'Automotive Aero Journal / Porsche Press', retrievedOn: '2024-01-15', confidence: 'verified' }
    },
    kerbWeightKg: {
      value: 1450,
      source: 'DIN Kerb Weight Homologation',
      retrievedOn: '2024-01-15',
      confidence: 'verified'
    },
    powertrain: {
      layout: { value: 'rear_engine_rwd', source: 'Porsche Spec', retrievedOn: '2024-01-15', confidence: 'verified' },
      engineType: { value: '4.0L Naturally Aspirated Boxer-6', source: 'Porsche Spec', retrievedOn: '2024-01-15', confidence: 'verified' },
      powerHp: { value: 525, source: 'Porsche Spec', retrievedOn: '2024-01-15', confidence: 'verified' }
    },
    aeroFeatures: {
      value: [
        'Central single radiator concept with bonnet nostrils',
        'Active 2-element swan neck rear wing with hydraulic DRS',
        'Front active diffuser flaps',
        'Front wheel arch louvered cutaways with roof boundary layer fins'
      ],
      source: 'Porsche 911 GT3 RS Aero Briefing',
      retrievedOn: '2024-01-15',
      confidence: 'verified'
    },
    referenceImages: [
      { view: 'front', url: '/references/porsche_992_gt3rs/front.png', scalePixelsPerMeter: 450, originPixel: [950, 720], opacity: 0.75, visible: true },
      { view: 'rear', url: '/references/porsche_992_gt3rs/rear.png', scalePixelsPerMeter: 450, originPixel: [950, 720], opacity: 0.75, visible: true },
      { view: 'left', url: '/references/porsche_992_gt3rs/left.png', scalePixelsPerMeter: 450, originPixel: [1200, 720], opacity: 0.75, visible: true },
      { view: 'top', url: '/references/porsche_992_gt3rs/top.png', scalePixelsPerMeter: 450, originPixel: [1200, 500], opacity: 0.75, visible: true }
    ]
  },
  {
    id: 'ferrari_488_pista',
    isReadOnly: true,
    manufacturer: {
      value: 'Ferrari',
      source: 'Ferrari S.p.A. Technical Sheet 488 Pista',
      retrievedOn: '2024-01-20',
      confidence: 'verified'
    },
    model: {
      value: '488 Pista',
      source: 'Ferrari Press Kit',
      retrievedOn: '2024-01-20',
      confidence: 'verified'
    },
    generation: {
      value: 'F142M',
      source: 'Ferrari Technical Manual',
      retrievedOn: '2024-01-20',
      confidence: 'verified'
    },
    year: {
      value: 2018,
      source: 'Ferrari Release Archive',
      retrievedOn: '2024-01-20',
      confidence: 'verified'
    },
    variant: {
      value: 'Coupe',
      source: 'Ferrari Spec',
      retrievedOn: '2024-01-20',
      confidence: 'verified'
    },
    dimensions: {
      lengthM: { value: 4.605, source: 'Ferrari Technical Sheet', retrievedOn: '2024-01-20', confidence: 'verified' },
      widthM: { value: 1.975, source: 'Ferrari Technical Sheet', retrievedOn: '2024-01-20', confidence: 'verified' },
      heightM: { value: 1.206, source: 'Ferrari Technical Sheet', retrievedOn: '2024-01-20', confidence: 'verified' },
      wheelbaseM: { value: 2.650, source: 'Ferrari Technical Sheet', retrievedOn: '2024-01-20', confidence: 'verified' },
      frontTrackM: { value: 1.679, source: 'Ferrari Technical Sheet', retrievedOn: '2024-01-20', confidence: 'verified' },
      rearTrackM: { value: 1.649, source: 'Ferrari Technical Sheet', retrievedOn: '2024-01-20', confidence: 'verified' },
      groundClearanceM: { value: 0.110, source: 'Ferrari Workshop Reference', retrievedOn: '2024-01-20', confidence: 'reported' },
      frontalAreaM2: { value: 2.14, source: 'Aerodynamic Data Ferrari', retrievedOn: '2024-01-20', confidence: 'reported' }
    },
    kerbWeightKg: {
      value: 1380,
      source: 'Ferrari Homologation Weight',
      retrievedOn: '2024-01-20',
      confidence: 'verified'
    },
    powertrain: {
      layout: { value: 'mid_engine_rwd', source: 'Ferrari Spec', retrievedOn: '2024-01-20', confidence: 'verified' },
      engineType: { value: '3.9L Twin-Turbo V8 F154 CD', source: 'Ferrari Spec', retrievedOn: '2024-01-20', confidence: 'verified' },
      powerHp: { value: 720, source: 'Ferrari Spec', retrievedOn: '2024-01-20', confidence: 'verified' }
    },
    aeroFeatures: {
      value: [
        'F1-derived S-Duct in front hood',
        'Front diffuser ramp with vortex generators',
        'Blown rear spoiler with extraction slots',
        'Rear diffuser with active aerodynamic flaps'
      ],
      source: 'Ferrari Aerodynamics Department',
      retrievedOn: '2024-01-20',
      confidence: 'verified'
    },
    referenceImages: [
      { view: 'front', url: '/references/ferrari_488_pista/front.png', scalePixelsPerMeter: 430, originPixel: [900, 700], opacity: 0.75, visible: true },
      { view: 'rear', url: '/references/ferrari_488_pista/rear.png', scalePixelsPerMeter: 430, originPixel: [900, 700], opacity: 0.75, visible: true },
      { view: 'left', url: '/references/ferrari_488_pista/left.png', scalePixelsPerMeter: 430, originPixel: [1150, 700], opacity: 0.75, visible: true },
      { view: 'top', url: '/references/ferrari_488_pista/top.png', scalePixelsPerMeter: 430, originPixel: [1150, 480], opacity: 0.75, visible: true }
    ]
  },
  {
    id: 'lamborghini_aventador_svj',
    isReadOnly: true,
    manufacturer: {
      value: 'Automobili Lamborghini S.p.A.',
      source: 'Lamborghini Press Kit Aventador SVJ',
      retrievedOn: '2024-01-18',
      confidence: 'verified'
    },
    model: {
      value: 'Aventador SVJ',
      source: 'Lamborghini Press Kit',
      retrievedOn: '2024-01-18',
      confidence: 'verified'
    },
    generation: {
      value: 'LP 770-4',
      source: 'Lamborghini Homologation Documentation',
      retrievedOn: '2024-01-18',
      confidence: 'verified'
    },
    year: {
      value: 2019,
      source: 'Lamborghini Spec',
      retrievedOn: '2024-01-18',
      confidence: 'verified'
    },
    variant: {
      value: 'Coupe Superveloce Jota',
      source: 'Lamborghini Spec',
      retrievedOn: '2024-01-18',
      confidence: 'verified'
    },
    dimensions: {
      lengthM: { value: 4.943, source: 'Lamborghini Technical Specification', retrievedOn: '2024-01-18', confidence: 'verified' },
      widthM: { value: 2.098, source: 'Lamborghini Technical Specification', retrievedOn: '2024-01-18', confidence: 'verified' },
      heightM: { value: 1.136, source: 'Lamborghini Technical Specification (Body Roof)', retrievedOn: '2024-01-18', confidence: 'verified' },
      wheelbaseM: { value: 2.700, source: 'Lamborghini Technical Specification', retrievedOn: '2024-01-18', confidence: 'verified' },
      frontTrackM: { value: 1.720, source: 'Lamborghini Technical Specification', retrievedOn: '2024-01-18', confidence: 'verified' },
      rearTrackM: { value: 1.680, source: 'Lamborghini Technical Specification', retrievedOn: '2024-01-18', confidence: 'verified' },
      groundClearanceM: { value: 0.115, source: 'Lamborghini Technical Manual', retrievedOn: '2024-01-18', confidence: 'reported' },
      frontalAreaM2: { value: 2.38, source: 'Aerodynamic Assessment SVJ', retrievedOn: '2024-01-18', confidence: 'reported' }
    },
    kerbWeightKg: {
      value: 1525,
      source: 'Lamborghini Dry/Kerb Homologation',
      retrievedOn: '2024-01-18',
      confidence: 'verified'
    },
    powertrain: {
      layout: { value: 'mid_engine_awd', source: 'Lamborghini Spec', retrievedOn: '2024-01-18', confidence: 'verified' },
      engineType: { value: '6.5L Naturally Aspirated V12 L539', source: 'Lamborghini Spec', retrievedOn: '2024-01-18', confidence: 'verified' },
      powerHp: { value: 770, source: 'Lamborghini Spec', retrievedOn: '2024-01-18', confidence: 'verified' }
    },
    aeroFeatures: {
      value: [
        'ALA 2.0 (Aerodinamica Lamborghini Attiva) active aero system',
        'Active front splitter with motorized flaps',
        'Central hollow carbon wing pylon with internal airflow channeling',
        'Rear wing aero vectoring with independent left/right micro-flaps'
      ],
      source: 'Lamborghini R&D Aerodynamics',
      retrievedOn: '2024-01-18',
      confidence: 'verified'
    },
    referenceImages: [
      { view: 'front', url: '/references/lamborghini_svj/front.png', scalePixelsPerMeter: 410, originPixel: [920, 710], opacity: 0.75, visible: true },
      { view: 'rear', url: '/references/lamborghini_svj/rear.png', scalePixelsPerMeter: 410, originPixel: [920, 710], opacity: 0.75, visible: true },
      { view: 'left', url: '/references/lamborghini_svj/left.png', scalePixelsPerMeter: 410, originPixel: [1220, 710], opacity: 0.75, visible: true },
      { view: 'top', url: '/references/lamborghini_svj/top.png', scalePixelsPerMeter: 410, originPixel: [1220, 520], opacity: 0.75, visible: true }
    ]
  }
];

export class ReferenceVehicleLibrary {
  private static references: Map<string, ReferenceVehicle> = new Map(
    CANONICAL_REFERENCES.map(ref => [ref.id, Object.freeze(ref)])
  );

  /**
   * Get all available sourced reference vehicles
   */
  public static getAllReferences(): readonly ReferenceVehicle[] {
    return Array.from(this.references.values());
  }

  /**
   * Get a reference vehicle by ID (immutable/read-only)
   */
  public static getReference(id: string): Readonly<ReferenceVehicle> | undefined {
    return this.references.get(id);
  }

  /**
   * Prevent illegal write attempts on reference vehicles
   */
  public static attemptUpdate(id: string): never {
    throw new ReferenceVehicleReadOnlyError(id);
  }

  /**
   * Filter references by manufacturer or category
   */
  public static filterReferences(query: { manufacturer?: string; minYear?: number }): readonly ReferenceVehicle[] {
    return Array.from(this.references.values()).filter(ref => {
      if (query.manufacturer && ref.manufacturer.value.toLowerCase() !== query.manufacturer.toLowerCase()) {
        return false;
      }
      if (query.minYear && ref.year.value < query.minYear) {
        return false;
      }
      return true;
    });
  }
}
