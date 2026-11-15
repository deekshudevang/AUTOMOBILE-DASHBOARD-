export interface GTAModSlotMapping {
  slotKey: string;
  nativeModType: number;
  displayName: string;
  category: 'Aero & Bodywork' | 'Performance' | 'Interior & Cockpit' | 'Exterior Styling' | 'Wheels & Stance' | 'Cosmetic & Livery' | 'Lighting' | 'Format Specific';
  description: string;
  hasVisualMesh: boolean;
}

/**
 * Verified GTA V Native Mod Slot Mappings (mod0 to mod49)
 * Explicitly includes mod49 as Format-Specific Headlight Covers / Smoked Lenses.
 */
export const GTA_MOD_SLOT_DICTIONARY: Record<string, GTAModSlotMapping> = {
  mod0: { slotKey: "mod0", nativeModType: 0, displayName: "Rear Spoiler / Wing", category: "Aero & Bodywork", description: "GT racing downforce wings, ducktails, lip spoilers", hasVisualMesh: true },
  mod1: { slotKey: "mod1", nativeModType: 1, displayName: "Front Bumper", category: "Aero & Bodywork", description: "Front aero splitters, canards, air dams", hasVisualMesh: true },
  mod2: { slotKey: "mod2", nativeModType: 2, displayName: "Rear Bumper & Diffuser", category: "Aero & Bodywork", description: "Rear underbody diffusers and track fins", hasVisualMesh: true },
  mod3: { slotKey: "mod3", nativeModType: 3, displayName: "Side Skirts", category: "Aero & Bodywork", description: "Ground-effect rocker blades", hasVisualMesh: true },
  mod4: { slotKey: "mod4", nativeModType: 4, displayName: "Exhaust System", category: "Aero & Bodywork", description: "Dual/quad titanium tips, race mufflers", hasVisualMesh: true },
  mod5: { slotKey: "mod5", nativeModType: 5, displayName: "Rollcage & Chassis Frame", category: "Interior & Cockpit", description: "FIA track rollcage, strut braces", hasVisualMesh: true },
  mod6: { slotKey: "mod6", nativeModType: 6, displayName: "Front Grille", category: "Exterior Styling", description: "Honeycomb mesh, carbon surround", hasVisualMesh: true },
  mod7: { slotKey: "mod7", nativeModType: 7, displayName: "Hood & Bonnet", category: "Aero & Bodywork", description: "Vented carbon fiber cowl induction hoods", hasVisualMesh: true },
  mod8: { slotKey: "mod8", nativeModType: 8, displayName: "Left Fender / Widebody", category: "Aero & Bodywork", description: "Flared bolt-on widebody arches", hasVisualMesh: true },
  mod9: { slotKey: "mod9", nativeModType: 9, displayName: "Right Fender", category: "Aero & Bodywork", description: "Matching right aero fender arches", hasVisualMesh: true },
  mod10: { slotKey: "mod10", nativeModType: 10, displayName: "Roof & Scoop", category: "Exterior Styling", description: "Dry carbon roof skin, vortex generators", hasVisualMesh: true },
  mod11: { slotKey: "mod11", nativeModType: 11, displayName: "Engine Tuning (EMS)", category: "Performance", description: "ECU remap, track camshafts", hasVisualMesh: false },
  mod12: { slotKey: "mod12", nativeModType: 12, displayName: "Brake System", category: "Performance", description: "Slotted carbon-ceramic rotors, 6-piston calipers", hasVisualMesh: true },
  mod13: { slotKey: "mod13", nativeModType: 13, displayName: "Transmission", category: "Performance", description: "Sequential 7-speed dogbox", hasVisualMesh: false },
  mod14: { slotKey: "mod14", nativeModType: 14, displayName: "Horn", category: "Exterior Styling", description: "Acoustic horn tone generator", hasVisualMesh: false },
  mod15: { slotKey: "mod15", nativeModType: 15, displayName: "Suspension Stance", category: "Wheels & Stance", description: "Adjustable coilover suspension drop", hasVisualMesh: true },
  mod16: { slotKey: "mod16", nativeModType: 16, displayName: "Chassis Armor", category: "Performance", description: "Ballistic Kevlar body plating", hasVisualMesh: false },
  mod18: { slotKey: "mod18", nativeModType: 18, displayName: "Turbocharger Kit", category: "Performance", description: "Twin ceramic ball-bearing turbos", hasVisualMesh: false },
  mod20: { slotKey: "mod20", nativeModType: 20, displayName: "Tyre Smoke FX", category: "Wheels & Stance", description: "Burnout particulate emission color formulation", hasVisualMesh: false },
  mod22: { slotKey: "mod22", nativeModType: 22, displayName: "Xenon Headlights", category: "Lighting", description: "High-intensity Xenon/laser projector color", hasVisualMesh: true },
  mod23: { slotKey: "mod23", nativeModType: 23, displayName: "Front Custom Wheels", category: "Wheels & Stance", description: "Forged monolithic alloy/carbon rims", hasVisualMesh: true },
  mod24: { slotKey: "mod24", nativeModType: 24, displayName: "Rear Custom Wheels", category: "Wheels & Stance", description: "Staggered rear racing wheels (bikes/drag)", hasVisualMesh: true },
  mod25: { slotKey: "mod25", nativeModType: 25, displayName: "Plate Holder", category: "Exterior Styling", description: "Carbon frame, angled bracket, plate delete", hasVisualMesh: true },
  mod26: { slotKey: "mod26", nativeModType: 26, displayName: "Vanity Plate", category: "Exterior Styling", description: "Vanity plate badges and emblems", hasVisualMesh: false },
  mod27: { slotKey: "mod27", nativeModType: 27, displayName: "Interior Trim", category: "Interior & Cockpit", description: "Alcantara suede inserts, billet trim", hasVisualMesh: true },
  mod28: { slotKey: "mod28", nativeModType: 28, displayName: "Cabin Ornaments", category: "Interior & Cockpit", description: "Mirror charms, bobbleheads", hasVisualMesh: false },
  mod29: { slotKey: "mod29", nativeModType: 29, displayName: "Dashboard Trim", category: "Interior & Cockpit", description: "Extended carbon console wrap", hasVisualMesh: true },
  mod30: { slotKey: "mod30", nativeModType: 30, displayName: "Dial Design", category: "Interior & Cockpit", description: "Competition analog/digital telemetry cluster", hasVisualMesh: true },
  mod31: { slotKey: "mod31", nativeModType: 31, displayName: "Door Speakers", category: "Interior & Cockpit", description: "Component door cards and speaker pods", hasVisualMesh: false },
  mod32: { slotKey: "mod32", nativeModType: 32, displayName: "Racing Seats", category: "Interior & Cockpit", description: "Carbon bucket seats with 5-point harness", hasVisualMesh: true },
  mod33: { slotKey: "mod33", nativeModType: 33, displayName: "Steering Wheel", category: "Interior & Cockpit", description: "Flat-bottom Alcantara wheel with shift lights", hasVisualMesh: true },
  mod34: { slotKey: "mod34", nativeModType: 34, displayName: "Shifter Lever", category: "Interior & Cockpit", description: "Tall sequential billet shifter", hasVisualMesh: true },
  mod35: { slotKey: "mod35", nativeModType: 35, displayName: "Interior Plaque", category: "Interior & Cockpit", description: "Limited numbered production plaque", hasVisualMesh: false },
  mod36: { slotKey: "mod36", nativeModType: 36, displayName: "Speakers", category: "Interior & Cockpit", description: "Audio tweeters and rear speakers", hasVisualMesh: false },
  mod37: { slotKey: "mod37", nativeModType: 37, displayName: "Trunk Enclosure", category: "Interior & Cockpit", description: "Finished trunk liner with nitrous bottle", hasVisualMesh: false },
  mod38: { slotKey: "mod38", nativeModType: 38, displayName: "Hydraulics", category: "Wheels & Stance", description: "Electro-hydraulic accumulators", hasVisualMesh: false },
  mod39: { slotKey: "mod39", nativeModType: 39, displayName: "Engine Block Finish", category: "Exterior Styling", description: "Anodized valve covers, titanium intake", hasVisualMesh: false },
  mod40: { slotKey: "mod40", nativeModType: 40, displayName: "Air Filters", category: "Performance", description: "Open mesh cone filters, velocity stacks", hasVisualMesh: false },
  mod41: { slotKey: "mod41", nativeModType: 41, displayName: "Strut Tower Brace", category: "Performance", description: "Polished carbon front chassis stiffener", hasVisualMesh: false },
  mod42: { slotKey: "mod42", nativeModType: 42, displayName: "Arch Cover", category: "Aero & Bodywork", description: "Aerodynamic rear wheel arch spats", hasVisualMesh: true },
  mod43: { slotKey: "mod43", nativeModType: 43, displayName: "Aerials / Antennas", category: "Exterior Styling", description: "Carbon shark fin, telemetry antennas", hasVisualMesh: false },
  mod44: { slotKey: "mod44", nativeModType: 44, displayName: "Exterior Trim", category: "Exterior Styling", description: "Monochrome badges, gloss black window moldings", hasVisualMesh: true },
  mod45: { slotKey: "mod45", nativeModType: 45, displayName: "Fuel Tank Cap", category: "Exterior Styling", description: "Quick-fill dry-break Le Mans alloy cap", hasVisualMesh: false },
  mod46: { slotKey: "mod46", nativeModType: 46, displayName: "Window Louvers", category: "Exterior Styling", description: "Rear window slotted carbon louvers", hasVisualMesh: true },
  mod47: { slotKey: "mod47", nativeModType: 47, displayName: "DLC / Expansion", category: "Format Specific", description: "Unused / expansion DLC slot", hasVisualMesh: false },
  mod48: { slotKey: "mod48", nativeModType: 48, displayName: "Racing Livery & Decals", category: "Cosmetic & Livery", description: "Motorsport sponsor wraps, GT center stripes", hasVisualMesh: true },
  mod49: { slotKey: "mod49", nativeModType: 49, displayName: "Light Covers & Eyelids", category: "Format Specific", description: "Smoked headlight lenses, yellow endurance covers", hasVisualMesh: true }
};

export function resolveModSlot(slotKey: string): GTAModSlotMapping {
  return GTA_MOD_SLOT_DICTIONARY[slotKey] || {
    slotKey,
    nativeModType: parseInt(slotKey.replace('mod', '')) || 0,
    displayName: `Mod Slot #${slotKey.replace('mod', '')}`,
    category: "Format Specific",
    description: "Custom format-specific modification slot",
    hasVisualMesh: false
  };
}

