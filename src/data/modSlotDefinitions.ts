export interface ModSlotDefinition {
  id: string;
  slotIndex: number;
  name: string;
  category: 'Aero & Bodywork' | 'Performance' | 'Interior & Cockpit' | 'Exterior Styling' | 'Wheels & Stance' | 'Cosmetic & Livery' | 'Lighting';
  description: string;
}

export const MOD_SLOT_DEFINITIONS: Record<string, ModSlotDefinition> = {
  mod0: { id: "mod0", slotIndex: 0, name: "Rear Spoiler / Wing", category: "Aero & Bodywork", description: "Aerodynamic downforce wings, ducktails, GT carbon spoilers" },
  mod1: { id: "mod1", slotIndex: 1, name: "Front Bumper & Splitter", category: "Aero & Bodywork", description: "Front air dams, carbon canards, racing splitters" },
  mod2: { id: "mod2", slotIndex: 2, name: "Rear Bumper & Diffuser", category: "Aero & Bodywork", description: "Rear aero diffusers, track aprons, bumper deletes" },
  mod3: { id: "mod3", slotIndex: 3, name: "Side Skirts", category: "Aero & Bodywork", description: "Ground-effect side aero extensions and carbon blades" },
  mod4: { id: "mod4", slotIndex: 4, name: "Exhaust System", category: "Aero & Bodywork", description: "Titanium quad tips, oval race mufflers, side exits" },
  mod5: { id: "mod5", slotIndex: 5, name: "Rollcage & Chassis Frame", category: "Interior & Cockpit", description: "Full track FIA rollcage, padded half-cage, strut braces" },
  mod6: { id: "mod6", slotIndex: 6, name: "Front Grille", category: "Exterior Styling", description: "Honeycomb mesh, carbon surround, badgeless racing grille" },
  mod7: { id: "mod7", slotIndex: 7, name: "Hood & Bonnet", category: "Aero & Bodywork", description: "Vented carbon fiber hoods, cowl inductions, hood latches" },
  mod8: { id: "mod8", slotIndex: 8, name: "Left Fender / Widebody", category: "Aero & Bodywork", description: "Flared bolt-on arches, vented track fenders" },
  mod9: { id: "mod9", slotIndex: 9, name: "Right Fender", category: "Aero & Bodywork", description: "Right matching aero fender flares and vents" },
  mod10: { id: "mod10", slotIndex: 10, name: "Roof & Scoop", category: "Exterior Styling", description: "Carbon roof skin, vortex generators, roof air scoops" },
  mod11: { id: "mod11", slotIndex: 11, name: "Engine Tuning (EMS)", category: "Performance", description: "ECU remap, upgraded cams, stage 4 race software" },
  mod12: { id: "mod12", slotIndex: 12, name: "Brake System", category: "Performance", description: "Slotted carbon-ceramic rotors, 6-piston monoblock calipers" },
  mod13: { id: "mod13", slotIndex: 13, name: "Transmission", category: "Performance", description: "Close-ratio dogbox, sequential 7-speed dual clutch" },
  mod14: { id: "mod14", slotIndex: 14, name: "Horn", category: "Exterior Styling", description: "Custom acoustic and novelty tone generators" },
  mod15: { id: "mod15", slotIndex: 15, name: "Suspension & Stance", category: "Wheels & Stance", description: "Coilover suspension drop, track camber, air ride" },
  mod16: { id: "mod16", slotIndex: 16, name: "Chassis Armor", category: "Performance", description: "Lightweight ballistic Kevlar body plating" },
  mod18: { id: "mod18", slotIndex: 18, name: "Turbocharger Kit", category: "Performance", description: "Twin ceramic ball-bearing turbos and anti-lag wastegate" },
  mod20: { id: "mod20", slotIndex: 20, name: "Tyre Smoke FX", category: "Wheels & Stance", description: "Burnout particulate emission color formulation" },
  mod22: { id: "mod22", slotIndex: 22, name: "Xenon & LED Headlights", category: "Lighting", description: "High-intensity discharge and laser projector optics" },
  mod23: { id: "mod23", slotIndex: 23, name: "Front Custom Wheels", category: "Wheels & Stance", description: "Forged monolithic alloy and carbon modular rims" },
  mod24: { id: "mod24", slotIndex: 24, name: "Rear Custom Wheels", category: "Wheels & Stance", description: "Staggered rear racing drag wheels (motorcycle/custom)" },
  mod25: { id: "mod25", slotIndex: 25, name: "Plate Holder / Surround", category: "Exterior Styling", description: "Carbon frame, angled bracket, plate delete" },
  mod26: { id: "mod26", slotIndex: 26, name: "Vanity Plates", category: "Exterior Styling", description: "Novelty vanity plate inserts and show emblems" },
  mod27: { id: "mod27", slotIndex: 27, name: "Interior Trim Design", category: "Interior & Cockpit", description: "Alcantara suede accents, carbon dash inserts, billet trim" },
  mod28: { id: "mod28", slotIndex: 28, name: "Cabin Ornaments", category: "Interior & Cockpit", description: "Rearview mirror charms, bobbleheads, cockpit badges" },
  mod29: { id: "mod29", slotIndex: 29, name: "Dashboard Trim", category: "Interior & Cockpit", description: "Extended carbon console wrap and telemetry shroud" },
  mod30: { id: "mod30", slotIndex: 30, name: "Dial Cluster Design", category: "Interior & Cockpit", description: "Analog competition tachometer and digital track telemetry" },
  mod31: { id: "mod31", slotIndex: 31, name: "Door Speaker Panels", category: "Interior & Cockpit", description: "Custom audio pods and lightened door cards with pull straps" },
  mod32: { id: "mod32", slotIndex: 32, name: "Racing Seats", category: "Interior & Cockpit", description: "Carbon bucket seats with 5-point harness restraint" },
  mod33: { id: "mod33", slotIndex: 33, name: "Steering Wheel", category: "Interior & Cockpit", description: "Flat-bottom Alcantara wheel with shift lights and quick release" },
  mod34: { id: "mod34", slotIndex: 34, name: "Gear Shifter", category: "Interior & Cockpit", description: "Sequential tall billet shifter knob and carbon stalk" },
  mod35: { id: "mod35", slotIndex: 35, name: "Interior Plaque", category: "Interior & Cockpit", description: "Limited numbered production plaque and builder badge" },
  mod36: { id: "mod36", slotIndex: 36, name: "Audio Speakers", category: "Interior & Cockpit", description: "Component acoustic enclosure and tweeters" },
  mod37: { id: "mod37", slotIndex: 37, name: "Trunk Enclosure", category: "Interior & Cockpit", description: "Finished trunk liner with nitrous bottle mounts" },
  mod38: { id: "mod38", slotIndex: 38, name: "Hydraulics Stance", category: "Wheels & Stance", description: "Electro-hydraulic accumulators and adjustable height pumps" },
  mod39: { id: "mod39", slotIndex: 39, name: "Engine Block Finish", category: "Exterior Styling", description: "Anodized valve covers, titanium intake manifold" },
  mod40: { id: "mod40", slotIndex: 40, name: "Air Filters & Velocity Stacks", category: "Performance", description: "Open mesh cone filters and exposed billet trumpets" },
  mod41: { id: "mod41", slotIndex: 41, name: "Strut Tower Brace", category: "Performance", description: "Polished carbon and titanium front chassis stiffener" },
  mod42: { id: "mod42", slotIndex: 42, name: "Arch Cover / Spats", category: "Aero & Bodywork", description: "Wheel well liners, aerodynamic rear spats" },
  mod43: { id: "mod43", slotIndex: 43, name: "Aerials & Antennas", category: "Exterior Styling", description: "Carbon shark fin, telemetry whip antennas" },
  mod44: { id: "mod44", slotIndex: 44, name: "Exterior Trim & Badges", category: "Exterior Styling", description: "Monochrome badges, gloss black window moldings" },
  mod45: { id: "mod45", slotIndex: 45, name: "Fuel Tank Cap", category: "Exterior Styling", description: "Quick-fill dry break fuel port, Le Mans alloy cap" },
  mod46: { id: "mod46", slotIndex: 46, name: "Window Louvers / Armor", category: "Exterior Styling", description: "Slotted rear window louvers, polycarbonate quarter windows" },
  mod48: { id: "mod48", slotIndex: 48, name: "Racing Livery & Decals", category: "Cosmetic & Livery", description: "Motorsport sponsor wraps, GT stripes, retro camouflage" },
  mod49: { id: "mod49", slotIndex: 49, name: "Light Covers & Eyelids", category: "Lighting", description: "Smoked headlight lenses, yellow endurance tint, rally covers" }
};

export function getModSlotName(slotKey: string): string {
  if (MOD_SLOT_DEFINITIONS[slotKey]) {
    return MOD_SLOT_DEFINITIONS[slotKey].name;
  }
  const match = slotKey.match(/\d+/);
  return match ? `Modification Slot #${match[0]}` : slotKey;
}
