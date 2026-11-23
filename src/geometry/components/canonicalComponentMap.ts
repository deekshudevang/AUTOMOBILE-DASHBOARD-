/**
 * AUTOVERSE 3D — Canonical Vehicle Component Mapping Dictionary
 * Resolves the naming schism between Schema 2.0 component identifiers
 * (e.g. 'front_left_fender', 'rear_wing', 'wheel_front_left')
 * and V2 Engine internal panel identifiers
 * (e.g. 'fender_front_l', 'wing_rear', 'wheel_fl').
 */

export interface ComponentMetadataEntry {
  schema2Id: string;
  v2EngineId: string;
  displayName: string;
  category: 'Aero' | 'Body' | 'Wheels' | 'Lighting' | 'Windows' | 'Exhaust' | 'Interior';
  isSwappable: boolean;
  defaultMaterialRef: string;
}

export const CANONICAL_COMPONENT_MAP: ComponentMetadataEntry[] = [
  // --- Aerodynamics ---
  {
    schema2Id: 'rear_wing',
    v2EngineId: 'wing_rear',
    displayName: 'Rear Wing / Spoiler',
    category: 'Aero',
    isSwappable: true,
    defaultMaterialRef: 'carbon_twill'
  },
  {
    schema2Id: 'front_splitter',
    v2EngineId: 'splitter_front',
    displayName: 'Front Splitter & Air Dam',
    category: 'Aero',
    isSwappable: true,
    defaultMaterialRef: 'carbon_twill'
  },
  {
    schema2Id: 'rear_diffuser',
    v2EngineId: 'diffuser_rear',
    displayName: 'Venturi Rear Diffuser',
    category: 'Aero',
    isSwappable: true,
    defaultMaterialRef: 'carbon_twill'
  },
  {
    schema2Id: 'canards_dive_planes',
    v2EngineId: 'canards',
    displayName: 'Front Dive Planes / Canards',
    category: 'Aero',
    isSwappable: true,
    defaultMaterialRef: 'carbon_twill'
  },

  // --- Body Panels ---
  {
    schema2Id: 'hood',
    v2EngineId: 'hood',
    displayName: 'Front Hood / Bonnet',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'body_paint'
  },
  {
    schema2Id: 'front_bumper',
    v2EngineId: 'bumper_front',
    displayName: 'Front Bumper Fascia',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'body_paint'
  },
  {
    schema2Id: 'rear_bumper',
    v2EngineId: 'bumper_rear',
    displayName: 'Rear Bumper Fascia',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'body_paint'
  },
  {
    schema2Id: 'roof',
    v2EngineId: 'roof',
    displayName: 'Roof Panel',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'carbon_twill'
  },
  {
    schema2Id: 'front_left_fender',
    v2EngineId: 'fender_front_l',
    displayName: 'Front Left Fender',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'body_paint'
  },
  {
    schema2Id: 'front_right_fender',
    v2EngineId: 'fender_front_r',
    displayName: 'Front Right Fender',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'body_paint'
  },
  {
    schema2Id: 'rear_left_fender',
    v2EngineId: 'fender_rear_l',
    displayName: 'Rear Left Quarter Panel',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'body_paint'
  },
  {
    schema2Id: 'rear_right_fender',
    v2EngineId: 'fender_rear_r',
    displayName: 'Rear Right Quarter Panel',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'body_paint'
  },
  {
    schema2Id: 'front_left_door',
    v2EngineId: 'door_fl',
    displayName: 'Left Door Assembly',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'body_paint'
  },
  {
    schema2Id: 'front_right_door',
    v2EngineId: 'door_fr',
    displayName: 'Right Door Assembly',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'body_paint'
  },
  {
    schema2Id: 'side_skirt_left',
    v2EngineId: 'skirt_l',
    displayName: 'Left Rocker Panel / Skirt',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'carbon_twill'
  },
  {
    schema2Id: 'side_skirt_right',
    v2EngineId: 'skirt_r',
    displayName: 'Right Rocker Panel / Skirt',
    category: 'Body',
    isSwappable: true,
    defaultMaterialRef: 'carbon_twill'
  },
  {
    schema2Id: 'body_shell',
    v2EngineId: 'body_shell',
    displayName: 'Monocoque Body Shell',
    category: 'Body',
    isSwappable: false,
    defaultMaterialRef: 'body_paint'
  },

  // --- Wheels & Stance ---
  {
    schema2Id: 'wheel_front_left',
    v2EngineId: 'wheel_fl',
    displayName: 'Front Left Wheel Assembly',
    category: 'Wheels',
    isSwappable: true,
    defaultMaterialRef: 'rim'
  },
  {
    schema2Id: 'wheel_front_right',
    v2EngineId: 'wheel_fr',
    displayName: 'Front Right Wheel Assembly',
    category: 'Wheels',
    isSwappable: true,
    defaultMaterialRef: 'rim'
  },
  {
    schema2Id: 'wheel_rear_left',
    v2EngineId: 'wheel_rl',
    displayName: 'Rear Left Wheel Assembly',
    category: 'Wheels',
    isSwappable: true,
    defaultMaterialRef: 'rim'
  },
  {
    schema2Id: 'wheel_rear_right',
    v2EngineId: 'wheel_rr',
    displayName: 'Rear Right Wheel Assembly',
    category: 'Wheels',
    isSwappable: true,
    defaultMaterialRef: 'rim'
  },

  // --- Lighting ---
  {
    schema2Id: 'headlights_housing',
    v2EngineId: 'headlight_l',
    displayName: 'Headlights Matrix System',
    category: 'Lighting',
    isSwappable: true,
    defaultMaterialRef: 'emissive_led'
  },
  {
    schema2Id: 'taillights_bar',
    v2EngineId: 'taillight_l',
    displayName: 'Full-Width Taillights Assembly',
    category: 'Lighting',
    isSwappable: true,
    defaultMaterialRef: 'emissive_led'
  },

  // --- Windows & Glass ---
  {
    schema2Id: 'front_windshield',
    v2EngineId: 'windshield_front',
    displayName: 'Front Windshield',
    category: 'Windows',
    isSwappable: false,
    defaultMaterialRef: 'glass'
  },
  {
    schema2Id: 'rear_windshield',
    v2EngineId: 'windshield_rear',
    displayName: 'Rear Window / Engine Cover',
    category: 'Windows',
    isSwappable: false,
    defaultMaterialRef: 'glass'
  },
  {
    schema2Id: 'side_windows',
    v2EngineId: 'window_side_l',
    displayName: 'Side Windows Glass',
    category: 'Windows',
    isSwappable: false,
    defaultMaterialRef: 'glass'
  },

  // --- Exhaust ---
  {
    schema2Id: 'exhaust_system',
    v2EngineId: 'exhaust',
    displayName: 'Performance Exhaust System',
    category: 'Exhaust',
    isSwappable: true,
    defaultMaterialRef: 'alloy'
  },

  // --- Interior ---
  {
    schema2Id: 'interior_cockpit',
    v2EngineId: 'interior',
    displayName: 'Cockpit Dashboard & Center Console',
    category: 'Interior',
    isSwappable: false,
    defaultMaterialRef: 'leather'
  },
  {
    schema2Id: 'steering_wheel',
    v2EngineId: 'steering_wheel',
    displayName: 'Motorsport Steering Wheel',
    category: 'Interior',
    isSwappable: true,
    defaultMaterialRef: 'leather'
  },
  {
    schema2Id: 'seats_assembly',
    v2EngineId: 'seats',
    displayName: 'Racing Bucket Seats',
    category: 'Interior',
    isSwappable: true,
    defaultMaterialRef: 'leather'
  },
  {
    schema2Id: 'roll_cage',
    v2EngineId: 'roll_cage',
    displayName: 'FIA / Clubsport Roll Cage',
    category: 'Interior',
    isSwappable: true,
    defaultMaterialRef: 'alloy'
  }
];

// Lookup caches for O(1) translation
const SCHEMA2_TO_ENTRY = new Map<string, ComponentMetadataEntry>();
const V2_TO_ENTRY = new Map<string, ComponentMetadataEntry>();

CANONICAL_COMPONENT_MAP.forEach(entry => {
  SCHEMA2_TO_ENTRY.set(entry.schema2Id, entry);
  V2_TO_ENTRY.set(entry.v2EngineId, entry);
});

/**
 * Normalizes any component ID (Schema 2.0, V2 engine, or alias) to its Schema 2.0 ID
 */
export function toCanonicalSchema2Id(rawId: string): string {
  if (SCHEMA2_TO_ENTRY.has(rawId)) return rawId;
  const match = V2_TO_ENTRY.get(rawId);
  if (match) return match.schema2Id;

  // Handle common variants
  if (rawId === 'wing' || rawId === 'spoiler') return 'rear_wing';
  if (rawId === 'splitter') return 'front_splitter';
  if (rawId === 'diffuser') return 'rear_diffuser';
  if (rawId === 'wheel_fl' || rawId === 'wheel_0') return 'wheel_front_left';
  if (rawId === 'wheel_fr' || rawId === 'wheel_1') return 'wheel_front_right';
  if (rawId === 'wheel_rl' || rawId === 'wheel_2') return 'wheel_rear_left';
  if (rawId === 'wheel_rr' || rawId === 'wheel_3') return 'wheel_rear_right';

  return rawId;
}

/**
 * Normalizes any component ID to the V2 Engine node name
 */
export function toCanonicalV2Id(rawId: string): string {
  if (V2_TO_ENTRY.has(rawId)) return rawId;
  const match = SCHEMA2_TO_ENTRY.get(rawId);
  if (match) return match.v2EngineId;

  // Common variants
  if (rawId === 'rear_wing') return 'wing_rear';
  if (rawId === 'front_splitter') return 'splitter_front';
  if (rawId === 'rear_diffuser') return 'diffuser_rear';
  if (rawId === 'wheel_front_left') return 'wheel_fl';
  if (rawId === 'wheel_front_right') return 'wheel_fr';
  if (rawId === 'wheel_rear_left') return 'wheel_rl';
  if (rawId === 'wheel_rear_right') return 'wheel_rr';

  return rawId;
}

/**
 * Returns user-facing display name for any component ID
 */
export function getComponentDisplayName(rawId: string): string {
  const s2 = toCanonicalSchema2Id(rawId);
  const entry = SCHEMA2_TO_ENTRY.get(s2);
  if (entry) return entry.displayName;

  return rawId
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Returns category for any component ID
 */
export function getComponentCategory(rawId: string): string {
  const s2 = toCanonicalSchema2Id(rawId);
  const entry = SCHEMA2_TO_ENTRY.get(s2);
  return entry ? entry.category : 'Body';
}
