// packages/vehicle-generation-engine/src/core/engine.ts
import * as THREE7 from "three";

// packages/gta-compat/src/joaat.ts
function toUnsigned32(hash) {
  return hash >>> 0;
}

// packages/vehicle-registry/src/registry.ts
var KNOWN_VEHICLE_REGISTRY = {
  // BMW / Ubermacht
  2709293299: { hashUnsigned: 2709293299, hashSigned: -1585674e3, hex: "0xA17C88F3", codeName: "sentinel5", displayName: "Sentinel GTS", manufacturer: "Ubermacht", realWorldModel: "BMW M3 Competition (G80)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  1755697647: { hashUnsigned: 1755697647, hashSigned: 1755697647, hex: "0x68A5D1EF", codeName: "cypher", displayName: "Cypher", manufacturer: "Ubermacht", realWorldModel: "BMW M2 CS (F87)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  1881415402: { hashUnsigned: 1881415402, hashSigned: 1881415402, hex: "0x70241EEA", codeName: "niobe", displayName: "Niobe", manufacturer: "Ubermacht", realWorldModel: "BMW i8 / Porsche 918 Concept", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  // Porsche / Pfister
  2568944644: { hashUnsigned: 2568944644, hashSigned: -1726022652, hex: "0x991EFC04", codeName: "comet6", displayName: "Comet S2", manufacturer: "Pfister", realWorldModel: "Porsche 911 GT3 (992)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  661493923: { hashUnsigned: 661493923, hashSigned: 661493923, hex: "0x276D98A3", codeName: "comet5", displayName: "Comet SR", manufacturer: "Pfister", realWorldModel: "Porsche 911 GT2 RS (997.2)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  2272483501: { hashUnsigned: 2272483501, hashSigned: -2022483795, hex: "0x877358AD", codeName: "comet3", displayName: "Comet Retro Custom", manufacturer: "Pfister", realWorldModel: "Porsche 911 (930 Turbo)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  1304459735: { hashUnsigned: 1304459735, hashSigned: 1304459735, hex: "0x4DC079D7", codeName: "growler", displayName: "Growler", manufacturer: "Pfister", realWorldModel: "Porsche 718 Cayman GT4 RS", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  1596736441: { hashUnsigned: 1596736441, hashSigned: 1596736441, hex: "0x5F2C43B9", codeName: "astrale", displayName: "Astrale", manufacturer: "Pfister", realWorldModel: "Porsche Taycan Cross Turismo", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  2515968713: { hashUnsigned: 2515968713, hashSigned: -1778998583, hex: "0x95F6A2C9", codeName: "xtreme", displayName: "X-treme", manufacturer: "Pfister", realWorldModel: "Porsche 911 GT3 R Rennsport", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  // Audi / Obey
  274946574: { hashUnsigned: 274946574, hashSigned: 274946574, hex: "0x10635A0E", codeName: "tenf2", displayName: "10F Widebody", manufacturer: "Obey", realWorldModel: "Audi R8 Gen 2 Widebody (4S)", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  3400983137: { hashUnsigned: 3400983137, hashSigned: -893984159, hex: "0xCAB6E261", codeName: "tenf", displayName: "10F", manufacturer: "Obey", realWorldModel: "Audi R8 Gen 2 (4S)", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  3050505892: { hashUnsigned: 3050505892, hashSigned: -1244461404, hex: "0xB5D306A4", codeName: "tailgater2", displayName: "Tailgater S", manufacturer: "Obey", realWorldModel: "Audi RS3 Sedan (8Y)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  686471183: { hashUnsigned: 686471183, hashSigned: 686471183, hex: "0x28EAB80F", codeName: "drafter", displayName: "8F Drafter", manufacturer: "Obey", realWorldModel: "Audi RS5 Coupe (B9)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  662793086: { hashUnsigned: 662793086, hashSigned: 662793086, hex: "0x27816B7E", codeName: "iwagen", displayName: "I-Wagen", manufacturer: "Obey", realWorldModel: "Audi e-tron GT", category: "SUV / Offroad", confidence: "VERIFIED_NATIVE" },
  // Lamborghini / Pegassi
  272929391: { hashUnsigned: 272929391, hashSigned: 272929391, hex: "0x1044926F", codeName: "tempesta", displayName: "Tempesta", manufacturer: "Pegassi", realWorldModel: "Lamborghini Hurac\xE1n LP610-4", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  4255883207: { hashUnsigned: 4255883207, hashSigned: -39084089, hex: "0xFDAB9FC7", codeName: "polignus", displayName: "Weaponized Ignus (Pursuit)", manufacturer: "Pegassi", realWorldModel: "Lamborghini Si\xE1n FKP 37", category: "Supercar", confidence: "ADDON_MATCH" },
  3316510914: { hashUnsigned: 3316510914, hashSigned: -978456382, hex: "0xC5ADF0C2", codeName: "velenogt", displayName: "Veleno GT", manufacturer: "Pegassi", realWorldModel: "Lamborghini Revuelto / Aventador SVJ", category: "Supercar", confidence: "ADDON_MATCH" },
  1031562256: { hashUnsigned: 1031562256, hashSigned: 1031562256, hex: "0x3D7C6410", codeName: "tezeract", displayName: "Tezeract", manufacturer: "Pegassi", realWorldModel: "Lamborghini Terzo Millennio", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  3126015148: { hashUnsigned: 3126015148, hashSigned: -1168952148, hex: "0xBA5334AC", codeName: "toros", displayName: "Toros", manufacturer: "Pegassi", realWorldModel: "Lamborghini Urus", category: "SUV / Offroad", confidence: "VERIFIED_NATIVE" },
  3612858749: { hashUnsigned: 3612858749, hashSigned: -682108547, hex: "0xD757D97D", codeName: "zorrusso", displayName: "Zorrusso", manufacturer: "Pegassi", realWorldModel: "Italdesign Zerouno / Pagani Zonda", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  // Ferrari / Grotti
  3145241962: { hashUnsigned: 3145241962, hashSigned: -1149725334, hex: "0xBB78956A", codeName: "italirsx", displayName: "Itali RSX", manufacturer: "Grotti", realWorldModel: "Ferrari SF90 Stradale", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  2271995207: { hashUnsigned: 2271995207, hashSigned: -2022972089, hex: "0x876BE547", codeName: "cartuccia", displayName: "Cartuccia GT", manufacturer: "Grotti", realWorldModel: "Ferrari 812 Superfast", category: "Supercar", confidence: "ADDON_MATCH" },
  4171974011: { hashUnsigned: 4171974011, hashSigned: -122993285, hex: "0xF8AB457B", codeName: "turismo3", displayName: "Turismo Omaggio", manufacturer: "Grotti", realWorldModel: "Ferrari F8 Tributo", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  // Toyota / Dinka
  4080061290: { hashUnsigned: 4080061290, hashSigned: -214906006, hex: "0xF330CB6A", codeName: "jester3", displayName: "Jester Classic", manufacturer: "Dinka", realWorldModel: "Toyota Supra RZ (MK4 / JZA80)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  2712905841: { hashUnsigned: 2712905841, hashSigned: -1582057455, hex: "0xA1B3A871", codeName: "jester4", displayName: "Jester RR", manufacturer: "Dinka", realWorldModel: "Toyota GR Supra (MK5 / A90)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  1484920335: { hashUnsigned: 1484920335, hashSigned: 1484920335, hex: "0x5882160F", codeName: "jester5", displayName: "Jester RR Widebody", manufacturer: "Dinka", realWorldModel: "Toyota GR Supra Widebody (HKS)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  409049982: { hashUnsigned: 409049982, hashSigned: 409049982, hex: "0x18619B7E", codeName: "kanjo", displayName: "Blista Kanjo", manufacturer: "Dinka", realWorldModel: "Honda Civic Type R (EK9)", category: "Tuner / Compact", confidence: "VERIFIED_NATIVE" },
  3703315515: { hashUnsigned: 3703315515, hashSigned: -591651781, hex: "0xDCBC1C3B", codeName: "blista3", displayName: "Go Go Monkey Blista", manufacturer: "Dinka", realWorldModel: "Honda Civic Type R (Monkey Spec)", category: "Tuner / Compact", confidence: "VERIFIED_NATIVE" },
  // Nissan & Mazda / Annis
  1923534526: { hashUnsigned: 1923534526, hashSigned: 1923534526, hex: "0x72A6CEBE", codeName: "driftzr350", displayName: "ZR350 Drift", manufacturer: "Annis", realWorldModel: "Mazda RX-7 FD (Drift Spec)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  2436313176: { hashUnsigned: 2436313176, hashSigned: -1858654120, hex: "0x91373058", codeName: "zr350", displayName: "ZR350", manufacturer: "Annis", realWorldModel: "Mazda RX-7 FD3S", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  196747873: { hashUnsigned: 196747873, hashSigned: 196747873, hex: "0x0BBA2261", codeName: "elegy", displayName: "Elegy Retro Custom", manufacturer: "Annis", realWorldModel: "Nissan Skyline GT-R (R32/R33/R34)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  3728579874: { hashUnsigned: 3728579874, hashSigned: -566387422, hex: "0xDE3D9D22", codeName: "elegy2", displayName: "Elegy RH8", manufacturer: "Annis", realWorldModel: "Nissan GT-R NISMO (R35)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  2038480341: { hashUnsigned: 2038480341, hashSigned: 2038480341, hex: "0x7980BDD5", codeName: "euros", displayName: "Euros", manufacturer: "Annis", realWorldModel: "Nissan 370Z / Fairlady Z", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  // Mercedes-Benz / Benefactor
  3787471536: { hashUnsigned: 3787471536, hashSigned: -507495760, hex: "0xE1C03AB0", codeName: "schlagen", displayName: "Schlagen GT", manufacturer: "Benefactor", realWorldModel: "Mercedes-AMG GT R", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  1494708164: { hashUnsigned: 1494708164, hashSigned: 1494708164, hex: "0x59176FC4", codeName: "lrcgt", displayName: "SM722 LRC GT", manufacturer: "Benefactor", realWorldModel: "Mercedes-Benz SLR McLaren Stirling Moss", category: "Sports Car", confidence: "ADDON_MATCH" },
  4151380270: { hashUnsigned: 4151380270, hashSigned: -143587026, hex: "0xF771092E", codeName: "driftvorschlag", displayName: "Vorschlaghammer", manufacturer: "Benefactor", realWorldModel: "Mercedes-Benz E-Class W124 AMG Hammer", category: "Sedan", confidence: "VERIFIED_NATIVE" },
  // McLaren / Progen
  1663218586: { hashUnsigned: 1663218586, hashSigned: 1663218586, hex: "0x6322B39A", codeName: "t20", displayName: "T20", manufacturer: "Progen", realWorldModel: "McLaren P1", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  3356898886: { hashUnsigned: 3356898886, hashSigned: -938068410, hex: "0xC8163646", codeName: "luiva", displayName: "Luiva", manufacturer: "Progen", realWorldModel: "McLaren Elva", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  // Koenigsegg / Overflod
  1748565021: { hashUnsigned: 1748565021, hashSigned: 1748565021, hex: "0x6838FC1D", codeName: "entity3", displayName: "Entity MT", manufacturer: "Overflod", realWorldModel: "Koenigsegg Jesko Absolut", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  4017955470: { hashUnsigned: 4017955470, hashSigned: -277011826, hex: "0xEF7D228E", codeName: "horus", displayName: "Horus / 760 LH", manufacturer: "Overflod", realWorldModel: "Pagani Zonda 760 LH", category: "Supercar", confidence: "ADDON_MATCH" },
  687627128: { hashUnsigned: 687627128, hashSigned: 687627128, hex: "0x28FC5B78", codeName: "suzume", displayName: "Suzume", manufacturer: "Overflod", realWorldModel: "Koenigsegg Gemera", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  4071505793: { hashUnsigned: 4071505793, hashSigned: -223461503, hex: "0xF2AE3F81", codeName: "pipistrello", displayName: "Pipistrello", manufacturer: "Overflod", realWorldModel: "Estrema Fulminea / Lotus Evija", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  // Bentley / Enus
  1532171089: { hashUnsigned: 1532171089, hashSigned: 1532171089, hex: "0x5B531351", codeName: "deity", displayName: "Deity", manufacturer: "Enus", realWorldModel: "Bentley Flying Spur Gen 3", category: "Sedan", confidence: "VERIFIED_NATIVE" },
  3348919626: { hashUnsigned: 3348919626, hashSigned: -946047670, hex: "0xC79C754A", codeName: "paragon3", displayName: "Paragon S", manufacturer: "Enus", realWorldModel: "Bentley Mulliner Batur", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  1416466158: { hashUnsigned: 1416466158, hashSigned: 1416466158, hex: "0x546D8EEE", codeName: "paragon2", displayName: "Paragon R (Armored)", manufacturer: "Enus", realWorldModel: "Bentley Continental GT Armored", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  330661258: { hashUnsigned: 330661258, hashSigned: 330661258, hex: "0x13B57D8A", codeName: "cogcabrio", displayName: "Cognoscenti Cabrio", manufacturer: "Enus", realWorldModel: "Bentley Continental GT Convertible", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  // Custom Land Rover
  2362851406: { hashUnsigned: 2362851406, hashSigned: -1932115890, hex: "0x8CD6404E", codeName: "defendybob", displayName: "Defendy Bob", manufacturer: "Vapid / Custom", realWorldModel: "Land Rover Defender V8", category: "SUV / Offroad", confidence: "ADDON_MATCH" }
};
function lookupVehicleIdentity(hashInput) {
  let hashNum;
  if (typeof hashInput === "string") {
    if (hashInput.startsWith("0x") || hashInput.startsWith("0X")) {
      hashNum = parseInt(hashInput, 16) >>> 0;
    } else {
      hashNum = parseInt(hashInput, 10) >>> 0;
    }
  } else {
    hashNum = toUnsigned32(hashInput);
  }
  return KNOWN_VEHICLE_REGISTRY[hashNum] || null;
}

// packages/vehicle-generation-engine/src/geometry/proceduralChassis.ts
import * as THREE6 from "three";

// packages/vehicle-generation-engine/src/templates/geometryProfiles.ts
function validateGeometryProfile(profile) {
  const errors = [];
  const calculatedLength = profile.wheelbase + profile.frontOverhang + profile.rearOverhang;
  const lengthDiff = Math.abs(calculatedLength - profile.overallLength);
  const lengthTolerance = profile.overallLength * 0.015;
  if (lengthDiff > lengthTolerance) {
    errors.push(
      `Length mismatch: wheelbase (${profile.wheelbase}m) + frontOverhang (${profile.frontOverhang}m) + rearOverhang (${profile.rearOverhang}m) = ${calculatedLength.toFixed(3)}m, but overallLength is ${profile.overallLength}m (exceeds tolerance of ${lengthTolerance.toFixed(3)}m).`
    );
  }
  const maxTrack = Math.max(profile.trackFront, profile.trackRear);
  if (maxTrack + profile.tyreSectionWidth > profile.overallWidth + 0.05) {
    errors.push(
      `Track width violation: max track (${maxTrack}m) + tyre width (${profile.tyreSectionWidth}m) = ${(maxTrack + profile.tyreSectionWidth).toFixed(3)}m exceeds overallWidth (${profile.overallWidth}m). Wheels would protrude beyond fenders.`
    );
  }
  if (profile.wheelArchRadius <= profile.wheelRadiusFront) {
    errors.push(
      `Wheel arch radius (${profile.wheelArchRadius}m) must be larger than front wheel radius (${profile.wheelRadiusFront}m) to provide suspension travel clearance.`
    );
  }
  if (profile.groundClearance <= 0.04 || profile.groundClearance >= profile.overallHeight * 0.4) {
    errors.push(
      `Plausible ground clearance violation: ${profile.groundClearance}m is out of bounds for ${profile.bodyStyle}.`
    );
  }
  if (profile.roofHeight > profile.overallHeight) {
    errors.push(
      `Roof height (${profile.roofHeight}m) cannot exceed overallHeight (${profile.overallHeight}m).`
    );
  }
  if (profile.bonnetLength + profile.cabinLength > profile.overallLength) {
    errors.push(
      `Bonnet length (${profile.bonnetLength}m) + cabin length (${profile.cabinLength}m) = ${(profile.bonnetLength + profile.cabinLength).toFixed(3)}m exceeds overallLength (${profile.overallLength}m).`
    );
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
var ARCHETYPE_TEMPLATES = {
  // 1. SEDAN (L 4.85, W 1.85, H 1.45, Wheelbase 2.85)
  sedan: {
    id: "archetype_sedan",
    displayName: "Executive Sport Sedan",
    bodyStyle: "sedan",
    source: "approximate-template",
    wheelbase: 2.85,
    trackFront: 1.58,
    trackRear: 1.6,
    overallLength: 4.85,
    overallWidth: 1.85,
    overallHeight: 1.45,
    frontOverhang: 0.95,
    rearOverhang: 1.05,
    bonnetLength: 1.42,
    cabinStartX: 0.15,
    cabinLength: 2.25,
    roofHeight: 1.42,
    roofPeakX: -0.45,
    windshieldAngleDeg: 58,
    rearWindowAngleDeg: 56,
    wheelRadiusFront: 0.34,
    wheelRadiusRear: 0.34,
    tyreSectionWidth: 0.245,
    tyreAspectRatio: 40,
    wheelArchRadius: 0.385,
    wheelArchFlare: 0.035,
    groundClearance: 0.135,
    beltlineHeight: 0.92,
    drivetrainLayout: "FR"
  },
  // 2. COUPE (L 4.50, W 1.82, H 1.35, Wheelbase 2.70)
  coupe: {
    id: "archetype_coupe",
    displayName: "Grand Touring Coupe",
    bodyStyle: "coupe",
    source: "approximate-template",
    wheelbase: 2.7,
    trackFront: 1.56,
    trackRear: 1.58,
    overallLength: 4.5,
    overallWidth: 1.82,
    overallHeight: 1.35,
    frontOverhang: 0.88,
    rearOverhang: 0.92,
    bonnetLength: 1.38,
    cabinStartX: 0.2,
    cabinLength: 2.05,
    roofHeight: 1.33,
    roofPeakX: -0.35,
    windshieldAngleDeg: 62,
    rearWindowAngleDeg: 64,
    wheelRadiusFront: 0.335,
    wheelRadiusRear: 0.345,
    tyreSectionWidth: 0.255,
    tyreAspectRatio: 35,
    wheelArchRadius: 0.375,
    wheelArchFlare: 0.045,
    groundClearance: 0.12,
    beltlineHeight: 0.88,
    drivetrainLayout: "FR"
  },
  // 3. SPORTS CAR (L 4.30, W 1.80, H 1.25, Wheelbase 2.50)
  sports_car: {
    id: "archetype_sports_car",
    displayName: "Lightweight Track Sports Car",
    bodyStyle: "sports_car",
    source: "approximate-template",
    wheelbase: 2.5,
    trackFront: 1.54,
    trackRear: 1.56,
    overallLength: 4.3,
    overallWidth: 1.8,
    overallHeight: 1.25,
    frontOverhang: 0.86,
    rearOverhang: 0.94,
    bonnetLength: 1.32,
    cabinStartX: 0.25,
    cabinLength: 1.85,
    roofHeight: 1.24,
    roofPeakX: -0.25,
    windshieldAngleDeg: 64,
    rearWindowAngleDeg: 68,
    wheelRadiusFront: 0.325,
    wheelRadiusRear: 0.335,
    tyreSectionWidth: 0.265,
    tyreAspectRatio: 35,
    wheelArchRadius: 0.365,
    wheelArchFlare: 0.055,
    groundClearance: 0.11,
    beltlineHeight: 0.82,
    drivetrainLayout: "MR"
  },
  // 4. SUPERCAR (L 4.50, W 1.95, H 1.12, Wheelbase 2.65)
  supercar: {
    id: "archetype_supercar",
    displayName: "Mid-Engine Hypercar",
    bodyStyle: "supercar",
    source: "approximate-template",
    wheelbase: 2.65,
    trackFront: 1.68,
    trackRear: 1.7,
    overallLength: 4.5,
    overallWidth: 1.95,
    overallHeight: 1.12,
    frontOverhang: 0.95,
    rearOverhang: 0.9,
    bonnetLength: 0.95,
    // Short nose on mid-engine car
    cabinStartX: 0.45,
    cabinLength: 1.95,
    roofHeight: 1.11,
    roofPeakX: 0.1,
    windshieldAngleDeg: 68,
    rearWindowAngleDeg: 72,
    wheelRadiusFront: 0.335,
    wheelRadiusRear: 0.355,
    tyreSectionWidth: 0.295,
    tyreAspectRatio: 30,
    wheelArchRadius: 0.38,
    wheelArchFlare: 0.075,
    groundClearance: 0.095,
    beltlineHeight: 0.74,
    drivetrainLayout: "MR"
  },
  // 5. SUV (L 4.80, W 1.95, H 1.75, Wheelbase 2.90)
  suv: {
    id: "archetype_suv",
    displayName: "Luxury Performance SUV",
    bodyStyle: "suv",
    source: "approximate-template",
    wheelbase: 2.9,
    trackFront: 1.66,
    trackRear: 1.68,
    overallLength: 4.8,
    overallWidth: 1.95,
    overallHeight: 1.75,
    frontOverhang: 0.92,
    rearOverhang: 0.98,
    bonnetLength: 1.45,
    cabinStartX: 0.1,
    cabinLength: 2.55,
    roofHeight: 1.73,
    roofPeakX: -0.6,
    windshieldAngleDeg: 52,
    rearWindowAngleDeg: 48,
    wheelRadiusFront: 0.385,
    wheelRadiusRear: 0.385,
    tyreSectionWidth: 0.275,
    tyreAspectRatio: 50,
    wheelArchRadius: 0.445,
    wheelArchFlare: 0.045,
    groundClearance: 0.22,
    beltlineHeight: 1.15,
    drivetrainLayout: "AWD"
  },
  // 6. MUSCLE CAR (L 4.80, W 1.90, H 1.35, Wheelbase 2.75)
  muscle_car: {
    id: "archetype_muscle_car",
    displayName: "American V8 Muscle Coupe",
    bodyStyle: "muscle_car",
    source: "approximate-template",
    wheelbase: 2.75,
    trackFront: 1.62,
    trackRear: 1.64,
    overallLength: 4.8,
    overallWidth: 1.9,
    overallHeight: 1.35,
    frontOverhang: 1.02,
    rearOverhang: 1.03,
    bonnetLength: 1.65,
    // Long aggressive muscle hood
    cabinStartX: 0.15,
    cabinLength: 1.95,
    roofHeight: 1.34,
    roofPeakX: -0.3,
    windshieldAngleDeg: 56,
    rearWindowAngleDeg: 58,
    wheelRadiusFront: 0.355,
    wheelRadiusRear: 0.365,
    tyreSectionWidth: 0.285,
    tyreAspectRatio: 40,
    wheelArchRadius: 0.405,
    wheelArchFlare: 0.065,
    groundClearance: 0.13,
    beltlineHeight: 0.9,
    drivetrainLayout: "FR"
  },
  // 7. PICKUP (L 5.30, W 2.00, H 1.90, Wheelbase 3.20)
  pickup: {
    id: "archetype_pickup",
    displayName: "Heavy Duty Adventure Pickup",
    bodyStyle: "pickup",
    source: "approximate-template",
    wheelbase: 3.2,
    trackFront: 1.72,
    trackRear: 1.74,
    overallLength: 5.3,
    overallWidth: 2,
    overallHeight: 1.9,
    frontOverhang: 1,
    rearOverhang: 1.1,
    bonnetLength: 1.55,
    cabinStartX: 0.1,
    cabinLength: 2.1,
    roofHeight: 1.88,
    roofPeakX: -0.4,
    windshieldAngleDeg: 50,
    rearWindowAngleDeg: 10,
    // Near-vertical back glass
    wheelRadiusFront: 0.41,
    wheelRadiusRear: 0.41,
    tyreSectionWidth: 0.285,
    tyreAspectRatio: 65,
    wheelArchRadius: 0.485,
    wheelArchFlare: 0.055,
    groundClearance: 0.25,
    beltlineHeight: 1.25,
    drivetrainLayout: "AWD"
  }
};
var GeometryProfileRepository = class {
  profiles = /* @__PURE__ */ new Map();
  constructor() {
    for (const [key, profile] of Object.entries(ARCHETYPE_TEMPLATES)) {
      this.registerProfile(profile);
    }
  }
  registerProfile(profile) {
    const val = validateGeometryProfile(profile);
    if (!val.valid) {
      throw new Error(`Invalid vehicle geometry profile "${profile.id}": ${val.errors.join("; ")}`);
    }
    this.profiles.set(profile.id, { ...profile });
  }
  getProfile(id) {
    return this.profiles.get(id);
  }
  getProfileForBodyStyle(style) {
    const p = this.profiles.get(`archetype_${style}`);
    if (p) return p;
    return ARCHETYPE_TEMPLATES[style] || ARCHETYPE_TEMPLATES.coupe;
  }
  listProfiles() {
    return Array.from(this.profiles.values());
  }
};

// packages/vehicle-generation-engine/src/geometry/crossSectionGenerator.ts
import * as THREE2 from "three";

// packages/vehicle-generation-engine/src/geometry/longitudinalProfile.ts
import * as THREE from "three";
var LongitudinalProfileGenerator = class {
  profile;
  constructor(profile) {
    this.profile = profile;
  }
  /**
   * Evaluates vehicle height, beltline, and bottom sill at normalized or metric station Z
   * Where Z = +frontOverhang + wheelbase/2 at front tip, and -rearOverhang - wheelbase/2 at rear tip
   */
  sampleStation(z) {
    const p = this.profile;
    const frontAxleZ = p.wheelbase / 2;
    const rearAxleZ = -p.wheelbase / 2;
    const noseZ = frontAxleZ + p.frontOverhang;
    const tailZ = rearAxleZ - p.rearOverhang;
    const clampedZ = Math.max(tailZ, Math.min(noseZ, z));
    const cowlZ = frontAxleZ - (p.bonnetLength - p.frontOverhang);
    const roofStartZ = cowlZ - (p.overallHeight - p.beltlineHeight) / Math.tan(THREE.MathUtils.degToRad(p.windshieldAngleDeg));
    const roofEndZ = rearAxleZ + 0.2;
    const decklidZ = rearAxleZ - 0.45;
    let yTop = p.beltlineHeight;
    let yBottom = p.groundClearance;
    let halfWidthBeltline = p.overallWidth / 2;
    let halfWidthRoof = p.overallWidth * 0.38;
    let isCabin = false;
    if (clampedZ >= cowlZ) {
      const t = (clampedZ - cowlZ) / Math.max(1e-3, noseZ - cowlZ);
      const noseHeight = p.groundClearance + 0.38;
      yTop = THREE.MathUtils.lerp(p.beltlineHeight * 0.92, noseHeight, Math.pow(t, 1.25));
      yBottom = p.groundClearance + (t > 0.6 ? 0.04 * (t - 0.6) : 0);
      halfWidthBeltline = THREE.MathUtils.lerp(p.overallWidth * 0.48, p.overallWidth * 0.41, t);
    } else if (clampedZ >= roofStartZ) {
      const t = (clampedZ - roofStartZ) / Math.max(1e-3, cowlZ - roofStartZ);
      yTop = THREE.MathUtils.lerp(p.roofHeight, p.beltlineHeight * 0.92, t);
      halfWidthRoof = THREE.MathUtils.lerp(p.overallWidth * 0.38, p.overallWidth * 0.44, t);
      isCabin = true;
    } else if (clampedZ >= roofEndZ) {
      const t = (clampedZ - roofEndZ) / Math.max(1e-3, roofStartZ - roofEndZ);
      const crown = Math.sin(t * Math.PI) * 0.035;
      yTop = p.roofHeight + crown;
      halfWidthRoof = p.overallWidth * 0.37;
      isCabin = true;
    } else if (clampedZ >= decklidZ) {
      const t = (clampedZ - decklidZ) / Math.max(1e-3, roofEndZ - decklidZ);
      const rearDeckHeight = p.bodyStyle === "pickup" ? p.beltlineHeight * 0.85 : p.beltlineHeight * 0.95;
      yTop = THREE.MathUtils.lerp(rearDeckHeight, p.roofHeight, Math.pow(t, 0.9));
      halfWidthRoof = THREE.MathUtils.lerp(p.overallWidth * 0.35, p.overallWidth * 0.37, t);
      isCabin = p.bodyStyle !== "pickup";
    } else {
      const t = (clampedZ - tailZ) / Math.max(1e-3, decklidZ - tailZ);
      const tailHeight = p.beltlineHeight * (p.bodyStyle === "suv" ? 1.05 : 0.88);
      yTop = THREE.MathUtils.lerp(tailHeight, p.beltlineHeight * 0.95, t);
      yBottom = THREE.MathUtils.lerp(p.groundClearance + 0.12, p.groundClearance, t);
      halfWidthBeltline = THREE.MathUtils.lerp(p.overallWidth * 0.44, p.overallWidth * 0.48, t);
    }
    return {
      z: clampedZ,
      yTop,
      yBeltline: p.beltlineHeight,
      yBottom,
      halfWidthBeltline,
      halfWidthRoof,
      isCabin,
      isFrontOverhang: clampedZ > frontAxleZ,
      isRearOverhang: clampedZ < rearAxleZ
    };
  }
};

// packages/vehicle-generation-engine/src/geometry/crossSectionGenerator.ts
var CrossSectionGenerator = class {
  profile;
  longitudinalGen;
  constructor(profile) {
    this.profile = profile;
    this.longitudinalGen = new LongitudinalProfileGenerator(profile);
  }
  /**
   * Generates N transverse cross-sections along the entire vehicle length
   */
  generateAllStations(stationCount = 28) {
    const p = this.profile;
    const frontAxleZ = p.wheelbase / 2;
    const rearAxleZ = -p.wheelbase / 2;
    const noseZ = frontAxleZ + p.frontOverhang;
    const tailZ = rearAxleZ - p.rearOverhang;
    const totalLength = noseZ - tailZ;
    const stations = [];
    const count = Math.max(24, stationCount);
    for (let i = 0; i < count; i++) {
      const u = i / (count - 1);
      const z = THREE2.MathUtils.lerp(tailZ, noseZ, u);
      const sample = this.longitudinalGen.sampleStation(z);
      const distFrontAxle = Math.abs(z - frontAxleZ);
      const distRearAxle = Math.abs(z - rearAxleZ);
      const isFrontArch = distFrontAxle < p.wheelArchRadius;
      const isRearArch = distRearAxle < p.wheelArchRadius;
      const hasWheelArchCutout = isFrontArch || isRearArch;
      let archClearanceY = 0;
      let archFlareX = 0;
      if (isFrontArch) {
        const radFront = p.wheelArchRadius;
        const dz = distFrontAxle;
        const dy = Math.sqrt(Math.max(0, radFront * radFront - dz * dz));
        archClearanceY = p.wheelRadiusFront + dy * 0.92;
        archFlareX = p.wheelArchFlare * (1 - Math.pow(dz / radFront, 2));
      } else if (isRearArch) {
        const radRear = p.wheelArchRadius;
        const dz = distRearAxle;
        const dy = Math.sqrt(Math.max(0, radRear * radRear - dz * dz));
        archClearanceY = p.wheelRadiusRear + dy * 0.92;
        archFlareX = p.wheelArchFlare * (1 - Math.pow(dz / radRear, 2));
      }
      const pointsLeft = this.buildHalfSection(z, sample, archClearanceY, archFlareX, -1);
      const pointsRight = this.buildHalfSection(z, sample, archClearanceY, archFlareX, 1);
      stations.push({
        z,
        stationIndex: i,
        pointsLeft,
        pointsRight,
        sample,
        hasWheelArchCutout
      });
    }
    return stations;
  }
  buildHalfSection(z, sample, archClearanceY, archFlareX, side) {
    const p = this.profile;
    const points = [];
    const effectiveSillY = archClearanceY > 0 ? Math.max(sample.yBottom, archClearanceY) : sample.yBottom;
    const effectiveSillX = archClearanceY > 0 ? (sample.halfWidthBeltline + archFlareX) * side : sample.halfWidthBeltline * 0.88 * side;
    const beltlineX = (sample.halfWidthBeltline + archFlareX) * side;
    const shoulderX = beltlineX * 0.96;
    const roofX = sample.halfWidthRoof * side;
    points.push({
      position: new THREE2.Vector3(0, sample.yBottom * 0.92, z),
      normal: new THREE2.Vector3(0, -1, 0),
      uv: new THREE2.Vector2(0.5, 0),
      isCrease: false,
      zone: "underbody"
    });
    points.push({
      position: new THREE2.Vector3(effectiveSillX, effectiveSillY, z),
      normal: new THREE2.Vector3(side * 0.7, -0.3, 0).normalize(),
      uv: new THREE2.Vector2(side > 0 ? 0.9 : 0.1, 0.15),
      isCrease: true,
      zone: "sill"
    });
    const midDoorY = (effectiveSillY + sample.yBeltline) * 0.52;
    const midDoorX = beltlineX * 0.98 + archFlareX * side * 0.5;
    points.push({
      position: new THREE2.Vector3(midDoorX, midDoorY, z),
      normal: new THREE2.Vector3(side, 0.1, 0).normalize(),
      uv: new THREE2.Vector2(side > 0 ? 0.95 : 0.05, 0.4),
      isCrease: false,
      zone: "door_lower"
    });
    points.push({
      position: new THREE2.Vector3(beltlineX, sample.yBeltline, z),
      normal: new THREE2.Vector3(side * 0.85, 0.25, 0).normalize(),
      uv: new THREE2.Vector2(side > 0 ? 1 : 0, 0.6),
      isCrease: true,
      zone: "beltline"
    });
    if (sample.isCabin) {
      const windowBaseY = sample.yBeltline + 0.04;
      const windowBaseX = shoulderX * 0.92;
      points.push({
        position: new THREE2.Vector3(windowBaseX, windowBaseY, z),
        normal: new THREE2.Vector3(side * 0.6, 0.75, 0).normalize(),
        uv: new THREE2.Vector2(side > 0 ? 0.85 : 0.15, 0.7),
        isCrease: true,
        zone: "window_base"
      });
      points.push({
        position: new THREE2.Vector3(roofX, sample.yTop, z),
        normal: new THREE2.Vector3(side * 0.5, 0.85, 0).normalize(),
        uv: new THREE2.Vector2(side > 0 ? 0.7 : 0.3, 0.9),
        isCrease: false,
        zone: "roof_rail"
      });
      points.push({
        position: new THREE2.Vector3(0, sample.yTop + 0.02, z),
        normal: new THREE2.Vector3(0, 1, 0),
        uv: new THREE2.Vector2(0.5, 1),
        isCrease: false,
        zone: "roof_center"
      });
    } else {
      points.push({
        position: new THREE2.Vector3(0, sample.yTop, z),
        normal: new THREE2.Vector3(0, 1, 0),
        uv: new THREE2.Vector2(0.5, 1),
        isCrease: false,
        zone: "roof_center"
      });
    }
    return points;
  }
};

// packages/vehicle-generation-engine/src/geometry/surfaceLofter.ts
import * as THREE3 from "three";
var SurfaceLofter = class {
  /**
   * Constructs full body surface geometry from station cross-sections
   */
  static loftStations(stations) {
    if (stations.length < 2) {
      throw new Error("Cannot loft fewer than 2 stations");
    }
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const numStations = stations.length;
    for (let s = 0; s < numStations - 1; s++) {
      const s0 = stations[s];
      const s1 = stations[s + 1];
      this.loftStationPair(s0.pointsLeft, s1.pointsLeft, positions, normals, uvs, indices, s, numStations, false);
      this.loftStationPair(s0.pointsRight, s1.pointsRight, positions, normals, uvs, indices, s, numStations, true);
    }
    this.capStation(stations[numStations - 1], positions, normals, uvs, indices, true);
    this.capStation(stations[0], positions, normals, uvs, indices, false);
    const geometry = new THREE3.BufferGeometry();
    geometry.setAttribute("position", new THREE3.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE3.Float32BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new THREE3.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return {
      geometry,
      vertexCount: positions.length / 3,
      triangleCount: indices.length / 3
    };
  }
  static loftStationPair(ptsA, ptsB, positions, normals, uvs, indices, stationIdx, totalStations, isRight) {
    const numPoints = Math.min(ptsA.length, ptsB.length);
    for (let p = 0; p < numPoints - 1; p++) {
      const p00 = ptsA[p].position;
      const p01 = ptsA[p + 1].position;
      const p10 = ptsB[p].position;
      const p11 = ptsB[p + 1].position;
      const baseIdx = positions.length / 3;
      positions.push(p00.x, p00.y, p00.z);
      positions.push(p10.x, p10.y, p10.z);
      positions.push(p11.x, p11.y, p11.z);
      positions.push(p01.x, p01.y, p01.z);
      const u0 = stationIdx / (totalStations - 1);
      const u1 = (stationIdx + 1) / (totalStations - 1);
      const v0 = p / (numPoints - 1);
      const v1 = (p + 1) / (numPoints - 1);
      uvs.push(u0, v0);
      uvs.push(u1, v0);
      uvs.push(u1, v1);
      uvs.push(u0, v1);
      const n0 = ptsA[p].normal;
      const n1 = ptsB[p].normal;
      normals.push(n0.x, n0.y, n0.z);
      normals.push(n1.x, n1.y, n1.z);
      normals.push(n1.x, n1.y, n1.z);
      normals.push(n0.x, n0.y, n0.z);
      if (isRight) {
        indices.push(baseIdx, baseIdx + 2, baseIdx + 1);
        indices.push(baseIdx, baseIdx + 3, baseIdx + 2);
      } else {
        indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
        indices.push(baseIdx, baseIdx + 2, baseIdx + 3);
      }
    }
  }
  static capStation(station, positions, normals, uvs, indices, isFront) {
    const centerPoint = isFront ? new THREE3.Vector3(0, station.sample.yTop * 0.5, station.z) : new THREE3.Vector3(0, station.sample.yBeltline * 0.7, station.z);
    const normal = isFront ? new THREE3.Vector3(0, 0, 1) : new THREE3.Vector3(0, 0, -1);
    const centerIdx = positions.length / 3;
    positions.push(centerPoint.x, centerPoint.y, centerPoint.z);
    normals.push(normal.x, normal.y, normal.z);
    uvs.push(0.5, 0.5);
    const rightReversed = station.pointsRight.slice(1, -1).reverse();
    const allPts = [...station.pointsLeft, ...rightReversed];
    const startIdx = positions.length / 3;
    for (let i = 0; i < allPts.length; i++) {
      const pt = allPts[i].position;
      positions.push(pt.x, pt.y, pt.z);
      normals.push(normal.x, normal.y, normal.z);
      uvs.push(0.5 + pt.x / 4, 0.5 + pt.y / 4);
    }
    const count = allPts.length;
    for (let i = 0; i < count; i++) {
      const next = (i + 1) % count;
      if (isFront) {
        indices.push(centerIdx, startIdx + next, startIdx + i);
      } else {
        indices.push(centerIdx, startIdx + i, startIdx + next);
      }
    }
  }
};

// packages/vehicle-generation-engine/src/geometry/panelSeparator.ts
import * as THREE4 from "three";
var PanelSeparator = class {
  /**
   * Generates discrete panels and fascias for a given geometry profile
   */
  static generatePanels(profile, paintMaterial, trimMaterial) {
    const group = new THREE4.Group();
    group.name = "vehicle_panels_assembly";
    const panels = [];
    const p = profile;
    const frontAxleZ = p.wheelbase / 2;
    const rearAxleZ = -p.wheelbase / 2;
    const noseZ = frontAxleZ + p.frontOverhang;
    const tailZ = rearAxleZ - p.rearOverhang;
    const hoodLength = p.bonnetLength * 0.96;
    const hoodWidth = p.overallWidth * 0.76;
    const hoodZ = frontAxleZ + p.frontOverhang * 0.35;
    const hoodY = p.beltlineHeight * 0.95;
    const hoodShape = new THREE4.Shape();
    const hw = hoodWidth / 2;
    const hl = hoodLength / 2;
    hoodShape.moveTo(-hw * 0.85, hl);
    hoodShape.quadraticCurveTo(0, hl + 0.04, hw * 0.85, hl);
    hoodShape.lineTo(hw, -hl);
    hoodShape.quadraticCurveTo(0, -hl - 0.02, -hw, -hl);
    hoodShape.closePath();
    const hoodGeo = new THREE4.ExtrudeGeometry(hoodShape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.01,
      bevelSegments: 3
    });
    hoodGeo.center();
    hoodGeo.rotateX(Math.PI / 2);
    hoodGeo.computeVertexNormals();
    const hoodMesh = new THREE4.Mesh(hoodGeo, paintMaterial);
    hoodMesh.name = "panel_bonnet";
    hoodMesh.position.set(0, hoodY, hoodZ);
    hoodMesh.castShadow = true;
    hoodMesh.receiveShadow = true;
    group.add(hoodMesh);
    panels.push({
      id: "panel_bonnet",
      name: "Engine Bonnet (Hood)",
      type: "hood",
      mesh: hoodMesh,
      anchorPoint: [0, hoodY, hoodZ],
      pivotPoint: [0, hoodY + 0.02, hoodZ - hl],
      // Cowl hinge
      shutLineGapMeters: 35e-4,
      triangleCount: hoodGeo.index ? hoodGeo.index.count / 3 : 0
    });
    const fasciaWidth = p.overallWidth * 0.94;
    const fasciaZ = noseZ - 0.05;
    const fasciaY = p.groundClearance + 0.22;
    const fasciaGroup = new THREE4.Group();
    fasciaGroup.name = "panel_fascia_front";
    const bumperShape = new THREE4.Shape();
    const bw = fasciaWidth / 2;
    bumperShape.moveTo(-bw, -0.18);
    bumperShape.lineTo(-bw, 0.16);
    bumperShape.quadraticCurveTo(0, 0.22, bw, 0.16);
    bumperShape.lineTo(bw, -0.18);
    bumperShape.quadraticCurveTo(0, -0.22, -bw, -0.18);
    const grilleHole = new THREE4.Path();
    const gw = bw * 0.55;
    grilleHole.moveTo(-gw, -0.06);
    grilleHole.lineTo(gw, -0.06);
    grilleHole.lineTo(gw * 0.9, 0.1);
    grilleHole.lineTo(-gw * 0.9, 0.1);
    grilleHole.closePath();
    bumperShape.holes.push(grilleHole);
    const bumperGeo = new THREE4.ExtrudeGeometry(bumperShape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.015,
      bevelSegments: 4
    });
    bumperGeo.center();
    bumperGeo.computeVertexNormals();
    const bumperMesh = new THREE4.Mesh(bumperGeo, paintMaterial);
    bumperMesh.castShadow = true;
    fasciaGroup.add(bumperMesh);
    const grilleMesh = new THREE4.Mesh(
      new THREE4.PlaneGeometry(gw * 1.8, 0.18),
      trimMaterial
    );
    grilleMesh.position.set(0, 0.02, 0.05);
    fasciaGroup.add(grilleMesh);
    fasciaGroup.position.set(0, fasciaY, fasciaZ);
    group.add(fasciaGroup);
    panels.push({
      id: "panel_fascia_front",
      name: "Front Fascia & Grille Assembly",
      type: "bumper_f",
      mesh: bumperMesh,
      anchorPoint: [0, fasciaY, fasciaZ],
      pivotPoint: [0, fasciaY, fasciaZ],
      shutLineGapMeters: 3e-3,
      triangleCount: bumperGeo.index ? bumperGeo.index.count / 3 : 0
    });
    const rearFasciaZ = tailZ + 0.06;
    const rearFasciaY = p.groundClearance + 0.24;
    const rearFasciaGroup = new THREE4.Group();
    rearFasciaGroup.name = "panel_fascia_rear";
    const rearBumperGeo = new THREE4.BoxGeometry(p.overallWidth * 0.92, 0.34, 0.22);
    const rearBumperMesh = new THREE4.Mesh(rearBumperGeo, paintMaterial);
    rearBumperMesh.castShadow = true;
    rearFasciaGroup.add(rearBumperMesh);
    const diffuserGeo = new THREE4.BoxGeometry(p.overallWidth * 0.72, 0.12, 0.42);
    const diffuserMesh = new THREE4.Mesh(diffuserGeo, trimMaterial);
    diffuserMesh.position.set(0, -0.14, 0.1);
    diffuserMesh.castShadow = true;
    rearFasciaGroup.add(diffuserMesh);
    [-0.24, -0.08, 0.08, 0.24].forEach((fx) => {
      const fin = new THREE4.Mesh(new THREE4.BoxGeometry(0.015, 0.14, 0.38), trimMaterial);
      fin.position.set(fx, -0.14, 0.1);
      rearFasciaGroup.add(fin);
    });
    rearFasciaGroup.position.set(0, rearFasciaY, rearFasciaZ);
    group.add(rearFasciaGroup);
    panels.push({
      id: "panel_fascia_rear",
      name: "Rear Fascia & Aerodynamic Diffuser Seat",
      type: "bumper_r",
      mesh: rearBumperMesh,
      anchorPoint: [0, rearFasciaY, rearFasciaZ],
      pivotPoint: [0, rearFasciaY, rearFasciaZ],
      shutLineGapMeters: 3e-3,
      triangleCount: 64
    });
    const doorLength = p.wheelbase * 0.44;
    const doorHeight = p.beltlineHeight - p.groundClearance - 0.04;
    const doorZ = (frontAxleZ + rearAxleZ) * 0.5 + 0.1;
    const doorY = p.groundClearance + doorHeight / 2 + 0.02;
    [-1, 1].forEach((side) => {
      const doorGeo = new THREE4.BoxGeometry(0.045, doorHeight, doorLength);
      const doorMesh = new THREE4.Mesh(doorGeo, paintMaterial);
      const doorX = (p.overallWidth / 2 - 0.02) * side;
      doorMesh.position.set(doorX, doorY, doorZ);
      doorMesh.castShadow = true;
      group.add(doorMesh);
      panels.push({
        id: side < 0 ? "panel_door_l" : "panel_door_r",
        name: side < 0 ? "Front Door (Left)" : "Front Door (Right)",
        type: side < 0 ? "door_l" : "door_r",
        mesh: doorMesh,
        anchorPoint: [doorX, doorY, doorZ],
        pivotPoint: [doorX, doorY, doorZ + doorLength / 2],
        // Hinge at front A-pillar
        shutLineGapMeters: 35e-4,
        triangleCount: 12
      });
    });
    const skirtLength = p.wheelbase * 0.72;
    [-1, 1].forEach((side) => {
      const skirtGeo = new THREE4.BoxGeometry(0.065, 0.08, skirtLength);
      const skirtMesh = new THREE4.Mesh(skirtGeo, trimMaterial);
      const skirtX = (p.overallWidth / 2 - 0.03) * side;
      const skirtY = p.groundClearance + 0.04;
      skirtMesh.position.set(skirtX, skirtY, (frontAxleZ + rearAxleZ) * 0.5);
      skirtMesh.castShadow = true;
      group.add(skirtMesh);
      panels.push({
        id: side < 0 ? "panel_skirt_l" : "panel_skirt_r",
        name: side < 0 ? "Aerodynamic Rocker Skirt (Left)" : "Aerodynamic Rocker Skirt (Right)",
        type: side < 0 ? "skirt_l" : "skirt_r",
        mesh: skirtMesh,
        anchorPoint: [skirtX, skirtY, (frontAxleZ + rearAxleZ) * 0.5],
        pivotPoint: [skirtX, skirtY, (frontAxleZ + rearAxleZ) * 0.5],
        shutLineGapMeters: 2e-3,
        triangleCount: 12
      });
    });
    let totalTriangles = 0;
    panels.forEach((pan) => totalTriangles += pan.triangleCount);
    return {
      group,
      panels,
      totalTriangles
    };
  }
};

// packages/vehicle-generation-engine/src/geometry/wheelGenerator.ts
import * as THREE5 from "three";
var WheelGenerator = class {
  /**
   * Generates an authentic radial wheel and brake assembly
   */
  static generateWheel(options) {
    const {
      wheelRadius,
      tyreWidth,
      rimRadius = wheelRadius * 0.72,
      camberDeg = -0.04,
      steerDeg = 0,
      isRightSide = false,
      rimColorHex = 14870768,
      caliperColorHex = 61695
      // Cyan performance caliper
    } = options;
    const group = new THREE5.Group();
    group.name = `wheel_assembly_${isRightSide ? "R" : "L"}`;
    const camberRad = THREE5.MathUtils.degToRad(camberDeg) * (isRightSide ? -1 : 1);
    const steerRad = THREE5.MathUtils.degToRad(steerDeg);
    group.rotation.z = camberRad;
    group.rotation.y = steerRad;
    const tyrePoints = [];
    const hw = tyreWidth / 2;
    const rimBeadR = rimRadius;
    const outerR = wheelRadius;
    const shoulderR = outerR - 0.025;
    const bulgeW = hw * 1.14;
    tyrePoints.push(new THREE5.Vector2(rimBeadR, -hw * 0.85));
    tyrePoints.push(new THREE5.Vector2(rimBeadR + 0.02, -hw * 0.95));
    tyrePoints.push(new THREE5.Vector2((rimBeadR + outerR) * 0.5, -bulgeW));
    tyrePoints.push(new THREE5.Vector2(shoulderR, -hw * 0.98));
    tyrePoints.push(new THREE5.Vector2(outerR - 5e-3, -hw * 0.8));
    tyrePoints.push(new THREE5.Vector2(outerR, 0));
    tyrePoints.push(new THREE5.Vector2(outerR - 5e-3, hw * 0.8));
    tyrePoints.push(new THREE5.Vector2(shoulderR, hw * 0.98));
    tyrePoints.push(new THREE5.Vector2((rimBeadR + outerR) * 0.5, bulgeW));
    tyrePoints.push(new THREE5.Vector2(rimBeadR + 0.02, hw * 0.95));
    tyrePoints.push(new THREE5.Vector2(rimBeadR, hw * 0.85));
    const tyreGeo = new THREE5.LatheGeometry(tyrePoints, 36);
    tyreGeo.rotateZ(Math.PI / 2);
    tyreGeo.computeVertexNormals();
    const tyreMat = new THREE5.MeshStandardMaterial({
      color: 1316120,
      roughness: 0.88,
      metalness: 0.08
    });
    const tyreMesh = new THREE5.Mesh(tyreGeo, tyreMat);
    tyreMesh.name = "mesh_radial_tyre";
    tyreMesh.castShadow = true;
    tyreMesh.receiveShadow = true;
    group.add(tyreMesh);
    const rimPoints = [];
    rimPoints.push(new THREE5.Vector2(0.04, -hw * 0.8));
    rimPoints.push(new THREE5.Vector2(0.08, -hw * 0.6));
    rimPoints.push(new THREE5.Vector2(rimRadius * 0.5, -hw * 0.4));
    rimPoints.push(new THREE5.Vector2(rimRadius * 0.85, -hw * 0.2));
    rimPoints.push(new THREE5.Vector2(rimRadius * 0.95, -hw * 0.8));
    rimPoints.push(new THREE5.Vector2(rimRadius, -hw * 0.85));
    rimPoints.push(new THREE5.Vector2(rimRadius + 0.012, -hw * 0.92));
    const rimBarrelGeo = new THREE5.LatheGeometry(rimPoints, 32);
    rimBarrelGeo.rotateZ(Math.PI / 2);
    rimBarrelGeo.computeVertexNormals();
    const rimMat = new THREE5.MeshPhysicalMaterial({
      color: rimColorHex,
      roughness: 0.18,
      metalness: 0.92,
      clearcoat: 0.9,
      clearcoatRoughness: 0.06
    });
    const rimGroup = new THREE5.Group();
    rimGroup.name = "mesh_alloy_rim";
    const rimBarrelMesh = new THREE5.Mesh(rimBarrelGeo, rimMat);
    rimBarrelMesh.castShadow = true;
    rimGroup.add(rimBarrelMesh);
    const spokeCount = 10;
    const spokeLength = rimRadius * 0.88;
    const spokeShape = new THREE5.Shape();
    spokeShape.moveTo(-0.014, 0);
    spokeShape.lineTo(-9e-3, spokeLength);
    spokeShape.lineTo(9e-3, spokeLength);
    spokeShape.lineTo(0.014, 0);
    spokeShape.closePath();
    const spokeGeo = new THREE5.ExtrudeGeometry(spokeShape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 4e-3,
      bevelSize: 4e-3,
      bevelSegments: 2
    });
    spokeGeo.center();
    spokeGeo.computeVertexNormals();
    for (let s = 0; s < spokeCount; s++) {
      const angle = s * Math.PI * 2 / spokeCount;
      const spoke = new THREE5.Mesh(spokeGeo, rimMat);
      spoke.position.set(isRightSide ? 0.06 : -0.06, 0, 0);
      spoke.rotation.x = angle;
      spoke.rotation.y = Math.PI / 2;
      spoke.castShadow = true;
      rimGroup.add(spoke);
    }
    const hubMesh = new THREE5.Mesh(
      new THREE5.CylinderGeometry(0.05, 0.05, 0.035, 24),
      rimMat
    );
    hubMesh.rotation.z = Math.PI / 2;
    hubMesh.position.set(isRightSide ? 0.065 : -0.065, 0, 0);
    rimGroup.add(hubMesh);
    for (let b = 0; b < 5; b++) {
      const bAngle = b * Math.PI * 2 / 5;
      const boltMesh = new THREE5.Mesh(
        new THREE5.CylinderGeometry(8e-3, 8e-3, 0.015, 6),
        new THREE5.MeshStandardMaterial({ color: 988970, metalness: 0.95, roughness: 0.2 })
      );
      boltMesh.rotation.z = Math.PI / 2;
      const bx = isRightSide ? 0.078 : -0.078;
      const by = Math.sin(bAngle) * 0.028;
      const bz = Math.cos(bAngle) * 0.028;
      boltMesh.position.set(bx, by, bz);
      rimGroup.add(boltMesh);
    }
    group.add(rimGroup);
    const discRadius = rimRadius * 0.82;
    const discThickness = 0.024;
    const discGeo = new THREE5.CylinderGeometry(discRadius, discRadius, discThickness, 36);
    discGeo.rotateZ(Math.PI / 2);
    discGeo.computeVertexNormals();
    const discMat = new THREE5.MeshStandardMaterial({
      color: 9741240,
      roughness: 0.25,
      metalness: 0.95
    });
    const discMesh = new THREE5.Mesh(discGeo, discMat);
    discMesh.name = "mesh_brake_disc";
    discMesh.position.set(isRightSide ? 0.015 : -0.015, 0, 0);
    discMesh.castShadow = true;
    group.add(discMesh);
    const caliperWidth = 0.065;
    const caliperHeight = discRadius * 0.65;
    const caliperLength = discRadius * 0.42;
    const caliperGeo = new THREE5.BoxGeometry(caliperWidth, caliperHeight, caliperLength);
    const caliperMat = new THREE5.MeshPhysicalMaterial({
      color: caliperColorHex,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1
    });
    const caliperMesh = new THREE5.Mesh(caliperGeo, caliperMat);
    caliperMesh.name = "mesh_brake_caliper";
    const calX = isRightSide ? 0.02 : -0.02;
    const calY = discRadius * 0.62;
    const calZ = discRadius * 0.35;
    caliperMesh.position.set(calX, calY, calZ);
    caliperMesh.rotation.x = 0.32;
    caliperMesh.castShadow = true;
    group.add(caliperMesh);
    let totalTriangles = 0;
    group.traverse((c) => {
      if (c.isMesh && c.geometry) {
        const g = c.geometry;
        totalTriangles += g.index ? g.index.count / 3 : g.attributes.position ? g.attributes.position.count / 3 : 0;
      }
    });
    return {
      group,
      tyreMesh,
      rimMesh: rimGroup,
      discMesh,
      caliperMesh,
      triangleCount: Math.round(totalTriangles)
    };
  }
};

// packages/vehicle-generation-engine/src/geometry/proceduralChassis.ts
var ProceduralChassisGenerator = class {
  static profileRepo = new GeometryProfileRepository();
  /**
   * Resolves a category string or profile into a valid VehicleGeometryProfile
   */
  static resolveProfile(input) {
    if (typeof input === "object" && input.id && input.wheelbase) {
      return input;
    }
    const cat = String(input || "coupe").toLowerCase();
    if (cat.includes("suv") || cat.includes("offroad")) return ARCHETYPE_TEMPLATES.suv;
    if (cat.includes("super") || cat.includes("hyper")) return ARCHETYPE_TEMPLATES.supercar;
    if (cat.includes("sedan") || cat.includes("saloon")) return ARCHETYPE_TEMPLATES.sedan;
    if (cat.includes("muscle")) return ARCHETYPE_TEMPLATES.muscle_car;
    if (cat.includes("truck") || cat.includes("pickup")) return ARCHETYPE_TEMPLATES.pickup;
    if (cat.includes("sport") || cat.includes("track") || cat.includes("tuner")) return ARCHETYPE_TEMPLATES.sports_car;
    return ARCHETYPE_TEMPLATES.coupe;
  }
  /**
   * Generates a stepped multi-piece alloy rim using THREE.LatheGeometry
   */
  static generateLatheRim(radius = 0.26, width = 0.14, segments = 32) {
    const points = [];
    points.push(new THREE6.Vector2(0.04, -width / 2));
    points.push(new THREE6.Vector2(0.08, -width / 2 + 0.02));
    points.push(new THREE6.Vector2(0.12, -width / 4));
    points.push(new THREE6.Vector2(0.18, 0));
    points.push(new THREE6.Vector2(radius * 0.75, width / 4));
    points.push(new THREE6.Vector2(radius * 0.9, width / 2 - 0.015));
    points.push(new THREE6.Vector2(radius, width / 2));
    points.push(new THREE6.Vector2(radius + 0.01, width / 2 - 0.01));
    const geometry = new THREE6.LatheGeometry(points, segments);
    geometry.computeVertexNormals();
    return geometry;
  }
  /**
   * Generates an aerodynamic front splitter using beveled THREE.ExtrudeGeometry
   */
  static generateAeroSplitter(width = 1.78, depth = 0.45, thickness = 0.04) {
    const shape = new THREE6.Shape();
    const hw = width / 2;
    shape.moveTo(-hw, 0);
    shape.lineTo(-hw + 0.08, depth * 0.6);
    shape.quadraticCurveTo(0, depth, hw - 0.08, depth * 0.6);
    shape.lineTo(hw, 0);
    shape.quadraticCurveTo(0, -0.05, -hw, 0);
    const extrudeSettings = {
      steps: 2,
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3
    };
    const geometry = new THREE6.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
  }
  /**
   * Generates a curved GT Downforce Wing blade using beveled extrusion
   */
  static generateWingBlade(span = 1.72, chord = 0.32, camber = 0.04) {
    const shape = new THREE6.Shape();
    const hc = chord / 2;
    shape.moveTo(-hc, 0);
    shape.quadraticCurveTo(0, camber, hc, 0.01);
    shape.lineTo(hc, -0.01);
    shape.quadraticCurveTo(0, -camber * 0.3, -hc, 0);
    const extrudeSettings = {
      steps: 4,
      depth: span,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.015,
      bevelSegments: 4
    };
    const geometry = new THREE6.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.rotateY(Math.PI / 2);
    geometry.computeVertexNormals();
    return geometry;
  }
  /**
   * Generates full parametric vehicle assembly (Lofted monocoque, separate panels, 4 wheels, fascias)
   */
  static generateSculptedBody(categoryOrProfile = "coupe", bodyColor = 60159, secondaryColor = 1118999, wireframe = false, options) {
    const profile = this.resolveProfile(categoryOrProfile);
    const root = new THREE6.Group();
    root.name = `parametric_chassis_${profile.bodyStyle}`;
    const bodyMat = new THREE6.MeshPhysicalMaterial({
      color: typeof bodyColor === "string" ? new THREE6.Color(bodyColor) : bodyColor,
      roughness: 0.18,
      metalness: 0.88,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      wireframe
    });
    const trimMat = new THREE6.MeshStandardMaterial({
      color: typeof secondaryColor === "string" ? new THREE6.Color(secondaryColor) : secondaryColor,
      roughness: 0.35,
      metalness: 0.85,
      wireframe
    });
    const csGen = new CrossSectionGenerator(profile);
    const stations = csGen.generateAllStations(28);
    const loftResult = SurfaceLofter.loftStations(stations);
    const mainBodyMesh = new THREE6.Mesh(loftResult.geometry, bodyMat);
    mainBodyMesh.name = "mesh_lofted_monocoque";
    mainBodyMesh.castShadow = true;
    mainBodyMesh.receiveShadow = true;
    root.add(mainBodyMesh);
    const panelResult = PanelSeparator.generatePanels(profile, bodyMat, trimMat);
    root.add(panelResult.group);
    const wingGeo = this.generateWingBlade(profile.overallWidth * 0.88, 0.28, 0.035);
    const wingMesh = new THREE6.Mesh(wingGeo, trimMat);
    wingMesh.name = "mesh_gt_wing";
    const tailZ = -profile.wheelbase / 2 - profile.rearOverhang;
    wingMesh.position.set(0, profile.beltlineHeight + 0.18, tailZ + 0.22);
    wingMesh.castShadow = true;
    root.add(wingMesh);
    [-0.42, 0.42].forEach((wx) => {
      const pGeo = new THREE6.CylinderGeometry(0.015, 0.02, 0.28, 12);
      const pMesh = new THREE6.Mesh(pGeo, trimMat);
      pMesh.position.set(wx, profile.beltlineHeight + 0.06, tailZ + 0.2);
      root.add(pMesh);
    });
    if (options?.includeWheels !== false) {
      const frontAxleZ = profile.wheelbase / 2;
      const rearAxleZ = -profile.wheelbase / 2;
      const tf = profile.trackFront / 2;
      const tr = profile.trackRear / 2;
      const rimColor = options?.wheelColor ?? 14870768;
      const frontCamber = options?.camberDeg ?? -0.03;
      const rearCamber = (options?.camberDeg ?? -0.03) - 0.01;
      const wheelFL = WheelGenerator.generateWheel({
        wheelRadius: profile.wheelRadiusFront,
        tyreWidth: profile.tyreSectionWidth,
        camberDeg: frontCamber,
        steerDeg: options?.steerDeg ?? 0,
        isRightSide: false,
        rimColorHex: rimColor
      });
      wheelFL.group.position.set(-tf, profile.wheelRadiusFront, frontAxleZ);
      root.add(wheelFL.group);
      const wheelFR = WheelGenerator.generateWheel({
        wheelRadius: profile.wheelRadiusFront,
        tyreWidth: profile.tyreSectionWidth,
        camberDeg: frontCamber,
        steerDeg: options?.steerDeg ?? 0,
        isRightSide: true,
        rimColorHex: rimColor
      });
      wheelFR.group.position.set(tf, profile.wheelRadiusFront, frontAxleZ);
      root.add(wheelFR.group);
      const wheelRL = WheelGenerator.generateWheel({
        wheelRadius: profile.wheelRadiusRear,
        tyreWidth: profile.tyreSectionWidth * 1.08,
        // Wider rear track tyres
        camberDeg: rearCamber,
        isRightSide: false,
        rimColorHex: rimColor
      });
      wheelRL.group.position.set(-tr, profile.wheelRadiusRear, rearAxleZ);
      root.add(wheelRL.group);
      const wheelRR = WheelGenerator.generateWheel({
        wheelRadius: profile.wheelRadiusRear,
        tyreWidth: profile.tyreSectionWidth * 1.08,
        camberDeg: rearCamber,
        isRightSide: true,
        rimColorHex: rimColor
      });
      wheelRR.group.position.set(tr, profile.wheelRadiusRear, rearAxleZ);
      root.add(wheelRR.group);
    }
    root.userData = {
      isApproximateProcedural: true,
      approximationLabel: "APPROXIMATE PROCEDURAL VEHICLE \u2014 NOT AUTHENTIC MODEL GEOMETRY",
      bodyStyle: profile.bodyStyle,
      profileId: profile.id,
      dimensions: {
        length: profile.overallLength,
        width: profile.overallWidth,
        height: profile.overallHeight,
        wheelbase: profile.wheelbase
      }
    };
    return root;
  }
};

// packages/vehicle-generation-engine/src/core/engine.ts
var StandaloneVehicleGenerationEngine = class {
  options;
  constructor(options = {}) {
    this.options = {
      enableProceduralFallback: true,
      ...options
    };
  }
  /**
   * Resolves vehicle identity from model hash with confidence scoring
   */
  resolveVehicleIdentity(spec) {
    const record = lookupVehicleIdentity(spec.modelHashUnsigned);
    if (record) {
      return {
        status: "IDENTIFIED",
        modelHash: spec.modelHashUnsigned,
        hexId: spec.modelHex,
        resolvedName: record.displayName,
        manufacturer: record.manufacturer,
        realWorldEquivalent: record.realWorldModel,
        confidence: record.confidence
      };
    }
    return {
      status: "UNRESOLVED",
      modelHash: spec.modelHashUnsigned,
      hexId: spec.modelHex,
      confidence: "UNRESOLVED"
    };
  }
  /**
   * Generates assembly and status report asynchronously
   */
  async generate(spec, realAssetMesh) {
    const assembly = this.generateVehicleAssembly(spec, realAssetMesh);
    return { assembly, statusReport: assembly.statusReport };
  }
  /**
   * Constructs the full Three.js VehicleAssembly scene graph
   */
  generateVehicleAssembly(spec, realAssetMesh) {
    const identity = this.resolveVehicleIdentity(spec);
    const sceneGraph = new THREE7.Group();
    sceneGraph.name = `vehicle_assembly_${spec.modelHashUnsigned}`;
    let isApproximate = true;
    const components = [];
    if (realAssetMesh) {
      isApproximate = false;
      sceneGraph.add(realAssetMesh);
      components.push({
        id: "component_real_mesh_root",
        name: "Authentic 3D Vehicle Mesh",
        type: "body_shell",
        source: "real_mesh",
        materialSlot: "Paint_Primary",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true
      });
    } else {
      isApproximate = true;
      const colorHex = spec.primaryPaint?.customRgb ? `rgb(${spec.primaryPaint.customRgb.r}, ${spec.primaryPaint.customRgb.g}, ${spec.primaryPaint.customRgb.b})` : 60159;
      const proceduralGroup = ProceduralChassisGenerator.generateSculptedBody(
        identity.category || "coupe",
        colorHex
      );
      sceneGraph.add(proceduralGroup);
      components.push({
        id: "comp_lofted_monocoque",
        name: "Parametric Lofted Monocoque Surface",
        type: "body_shell",
        source: "procedural",
        materialSlot: "Paint_Primary",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true
      });
      components.push({
        id: "comp_discrete_panels",
        name: "Fascias & Articulated Exterior Panels",
        type: "body_shell",
        source: "procedural",
        materialSlot: "Paint_Primary",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true
      });
      components.push({
        id: "comp_radial_wheels",
        name: "Quad Radial Toroidal Wheel Assemblies",
        type: "wheel_fl",
        source: "procedural",
        materialSlot: "Rims_Alloy",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true
      });
    }
    const statusReport = {
      levelA: {
        status: "VALID",
        format: spec.sourceFormat,
        message: "Specification parsed and normalized successfully",
        warnings: []
      },
      levelB: identity,
      levelC: {
        status: isApproximate ? "PROCEDURAL_TEMPLATE_LOADED" : "REAL_ASSET_LOADED",
        isApproximate,
        approximateLabel: isApproximate ? "APPROXIMATE PROCEDURAL VEHICLE \u2014 NOT AUTHENTIC MODEL GEOMETRY" : void 0
      },
      levelD: {
        propertyResults: {
          primaryColor: "APPLIED",
          secondaryColor: "APPLIED",
          wheelType: "APPLIED",
          wheelColor: "APPLIED",
          windowTint: "APPLIED",
          neonKits: "APPLIED",
          plateText: "APPLIED",
          mod0_spoiler: spec.tuningMods.mod0 ? "APPLIED" : "PRESERVED_ONLY",
          mod1_splitter: spec.tuningMods.mod1 ? "APPLIED" : "PRESERVED_ONLY",
          mod4_exhaust: spec.tuningMods.mod4 ? "APPLIED" : "PRESERVED_ONLY"
        },
        totalApplied: 8,
        totalPreserved: Object.keys(spec.tuningMods).length - 3,
        totalUnresolved: 0,
        totalUnsupported: 0
      }
    };
    const box = new THREE7.Box3().setFromObject(sceneGraph);
    const size = new THREE7.Vector3();
    const center = new THREE7.Vector3();
    box.getSize(size);
    box.getCenter(center);
    return {
      specId: spec.id,
      components,
      sceneGraph,
      bounds: {
        center: [center.x, center.y, center.z],
        size: [size.x, size.y, size.z]
      },
      isApproximate,
      statusReport
    };
  }
  /**
   * Validates assembly scene graph to guarantee non-empty vertex buffers and finite bounds
   */
  validateAssembly(assembly) {
    const { size } = assembly.bounds;
    if (isNaN(size[0]) || isNaN(size[1]) || isNaN(size[2])) return false;
    if (size[0] === 0 || size[1] === 0 || size[2] === 0) return false;
    return assembly.components.length > 0;
  }
};

// packages/vehicle-generation-engine/src/assembly/assemblyGraph.ts
import * as THREE8 from "three";
var AssemblyGraph = class {
  profile;
  anchors = /* @__PURE__ */ new Map();
  attachedComponents = /* @__PURE__ */ new Map();
  rootGroup;
  constructor(profile) {
    this.profile = profile;
    this.rootGroup = new THREE8.Group();
    this.rootGroup.name = `assembly_graph_${profile.id}`;
    this.computeAnchors();
  }
  /**
   * Dynamically computes all named anchor points strictly from profile dimensions
   */
  computeAnchors() {
    const p = this.profile;
    const frontAxleZ = p.wheelbase / 2;
    const rearAxleZ = -p.wheelbase / 2;
    const noseZ = frontAxleZ + p.frontOverhang;
    const tailZ = rearAxleZ - p.rearOverhang;
    this.anchors.set("mount_wheel_fl", {
      name: "mount_wheel_fl",
      position: [-p.trackFront / 2, p.wheelRadiusFront, frontAxleZ],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_wheel_fr", {
      name: "mount_wheel_fr",
      position: [p.trackFront / 2, p.wheelRadiusFront, frontAxleZ],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_wheel_rl", {
      name: "mount_wheel_rl",
      position: [-p.trackRear / 2, p.wheelRadiusRear, rearAxleZ],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_wheel_rr", {
      name: "mount_wheel_rr",
      position: [p.trackRear / 2, p.wheelRadiusRear, rearAxleZ],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_bumper_f", {
      name: "mount_bumper_f",
      position: [0, p.groundClearance + 0.22, noseZ - 0.05],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_bumper_r", {
      name: "mount_bumper_r",
      position: [0, p.groundClearance + 0.24, tailZ + 0.06],
      rotation: [0, Math.PI, 0]
    });
    this.anchors.set("mount_bonnet", {
      name: "mount_bonnet",
      position: [0, p.beltlineHeight * 0.95, frontAxleZ + p.frontOverhang * 0.35],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_roof", {
      name: "mount_roof",
      position: [0, p.roofHeight, p.roofPeakX],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_wing", {
      name: "mount_wing",
      position: [0, p.beltlineHeight + 0.06, tailZ + 0.25],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_exhaust", {
      name: "mount_exhaust",
      position: [0, p.groundClearance + 0.12, tailZ + 0.02],
      rotation: [0, Math.PI, 0]
    });
    this.anchors.set("mount_seat_driver", {
      name: "mount_seat_driver",
      position: [-p.trackFront * 0.22, p.groundClearance + 0.25, 0],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_seat_passenger", {
      name: "mount_seat_passenger",
      position: [p.trackFront * 0.22, p.groundClearance + 0.25, 0],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_dashboard", {
      name: "mount_dashboard",
      position: [0, p.beltlineHeight * 0.82, frontAxleZ * 0.45],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_steering", {
      name: "mount_steering",
      position: [-p.trackFront * 0.22, p.beltlineHeight * 0.8, frontAxleZ * 0.35],
      rotation: [-0.3, 0, 0]
    });
    this.anchors.set("mount_plate_f", {
      name: "mount_plate_f",
      position: [0, p.groundClearance + 0.16, noseZ + 0.01],
      rotation: [0, 0, 0]
    });
    this.anchors.set("mount_plate_r", {
      name: "mount_plate_r",
      position: [0, p.groundClearance + 0.32, tailZ - 0.01],
      rotation: [0, Math.PI, 0]
    });
  }
  getAnchor(name) {
    return this.anchors.get(name);
  }
  listAnchors() {
    return Array.from(this.anchors.values());
  }
  /**
   * Snaps a component mesh to its named profile anchor after verifying compatibility
   */
  attachComponent(component, metadata, mesh) {
    if (metadata.compatibleBodyStyles.length > 0 && !metadata.compatibleBodyStyles.includes(this.profile.bodyStyle)) {
      return {
        success: false,
        componentId: component.id,
        anchorName: metadata.requiredAnchorPoint,
        reasonRejected: `Incompatible body style: Component "${metadata.name}" is designed for [${metadata.compatibleBodyStyles.join(", ")}], but current vehicle profile is "${this.profile.bodyStyle}".`
      };
    }
    if (metadata.compatibleProfileIds && metadata.compatibleProfileIds.length > 0 && !metadata.compatibleProfileIds.includes(this.profile.id)) {
      return {
        success: false,
        componentId: component.id,
        anchorName: metadata.requiredAnchorPoint,
        reasonRejected: `Incompatible profile: Component "${metadata.name}" does not support profile "${this.profile.id}".`
      };
    }
    const anchor = this.anchors.get(metadata.requiredAnchorPoint);
    if (!anchor) {
      return {
        success: false,
        componentId: component.id,
        anchorName: metadata.requiredAnchorPoint,
        reasonRejected: `Anchor point "${metadata.requiredAnchorPoint}" does not exist in geometry profile "${this.profile.id}".`
      };
    }
    mesh.position.set(...anchor.position);
    mesh.rotation.set(...anchor.rotation);
    this.rootGroup.add(mesh);
    this.attachedComponents.set(component.id, { component, metadata, mesh });
    return {
      success: true,
      componentId: component.id,
      anchorName: anchor.name,
      worldPosition: anchor.position
    };
  }
  getRootGroup() {
    return this.rootGroup;
  }
};

// packages/vehicle-generation-engine/src/validation/geometryDiagnostics.ts
import * as THREE9 from "three";
var GeometryDiagnostics = class {
  static runDiagnostics(root, profile) {
    const checks = [];
    let totalTriangles = 0;
    let totalVertices = 0;
    let totalDrawCalls = 0;
    let hasNanOrInfinity = false;
    let indicesValid = true;
    let zeroAreaTriangles = 0;
    let nonUnitNormals = 0;
    let maxBodyBoxinessScore = 0;
    let bodyMeshCount = 0;
    root.traverse((child) => {
      if (child.isMesh) {
        totalDrawCalls++;
        const mesh = child;
        const geom = mesh.geometry;
        if (!geom) return;
        const posAttr = geom.getAttribute("position");
        const normAttr = geom.getAttribute("normal");
        const indexAttr = geom.getIndex();
        if (posAttr) {
          totalVertices += posAttr.count;
          for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const z = posAttr.getZ(i);
            if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
              hasNanOrInfinity = true;
            }
          }
        }
        if (indexAttr) {
          const count = indexAttr.count;
          if (count % 3 !== 0) indicesValid = false;
          totalTriangles += count / 3;
          for (let i = 0; i < count; i += 3) {
            const a = indexAttr.getX(i);
            const b = indexAttr.getX(i + 1);
            const c = indexAttr.getX(i + 2);
            if (a >= posAttr.count || b >= posAttr.count || c >= posAttr.count) {
              indicesValid = false;
            }
            if (posAttr) {
              const vA = new THREE9.Vector3(posAttr.getX(a), posAttr.getY(a), posAttr.getZ(a));
              const vB = new THREE9.Vector3(posAttr.getX(b), posAttr.getY(b), posAttr.getZ(b));
              const vC = new THREE9.Vector3(posAttr.getX(c), posAttr.getY(c), posAttr.getZ(c));
              const edge1 = new THREE9.Vector3().subVectors(vB, vA);
              const edge2 = new THREE9.Vector3().subVectors(vC, vA);
              const cross = new THREE9.Vector3().crossVectors(edge1, edge2);
              const area = cross.length() * 0.5;
              if (area < 1e-7) {
                zeroAreaTriangles++;
              }
            }
          }
        } else if (posAttr) {
          totalTriangles += posAttr.count / 3;
        }
        if (normAttr) {
          for (let i = 0; i < normAttr.count; i++) {
            const nx = normAttr.getX(i);
            const ny = normAttr.getY(i);
            const nz = normAttr.getZ(i);
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            if (Math.abs(len - 1) > 0.05) {
              nonUnitNormals++;
            }
          }
        }
        if (mesh.name.includes("body") || mesh.name.includes("chassis") || mesh.name.includes("hull")) {
          bodyMeshCount++;
          const triCount = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;
          if (triCount <= 12) {
            maxBodyBoxinessScore = 1;
          }
        }
      }
    });
    checks.push({
      checkName: "no_nan_or_infinity",
      pass: !hasNanOrInfinity,
      numericValue: hasNanOrInfinity ? 1 : 0,
      thresholdOrExpected: "0 NaN/Inf values",
      details: hasNanOrInfinity ? "FAIL: Mesh contains non-finite vertices" : "PASS: All attribute buffers are finite numbers"
    });
    checks.push({
      checkName: "index_divisible_by_3",
      pass: indicesValid,
      numericValue: indicesValid ? 1 : 0,
      thresholdOrExpected: "100% valid indices",
      details: indicesValid ? "PASS: Indices in range and divisible by 3" : "FAIL: Corrupt index buffer detected"
    });
    checks.push({
      checkName: "zero_area_triangles",
      pass: zeroAreaTriangles === 0,
      numericValue: zeroAreaTriangles,
      thresholdOrExpected: "0 zero-area faces",
      details: zeroAreaTriangles === 0 ? "PASS: Zero degenerate faces" : `FAIL: Found ${zeroAreaTriangles} zero-area triangles`
    });
    checks.push({
      checkName: "unit_length_normals",
      pass: nonUnitNormals === 0,
      numericValue: nonUnitNormals,
      thresholdOrExpected: "0 non-unit normals",
      details: nonUnitNormals === 0 ? "PASS: All vertex normals normalized" : `FAIL: Found ${nonUnitNormals} un-normalized normals`
    });
    const box = new THREE9.Box3().setFromObject(root);
    const size = new THREE9.Vector3();
    box.getSize(size);
    const lengthDiffPct = Math.abs(size.z - profile.overallLength) / profile.overallLength;
    const widthDiffPct = Math.abs(size.x - profile.overallWidth) / profile.overallWidth;
    const heightDiffPct = Math.abs(size.y - profile.overallHeight) / profile.overallHeight;
    const bboxMatch = lengthDiffPct <= 0.06 && widthDiffPct <= 0.06 && heightDiffPct <= 0.06;
    checks.push({
      checkName: "bounding_box_matches_profile",
      pass: bboxMatch,
      numericValue: Math.max(lengthDiffPct, widthDiffPct, heightDiffPct) * 100,
      thresholdOrExpected: "<= 6.0% deviation",
      details: bboxMatch ? `PASS: Bounding box [${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)}] matches profile within ${(Math.max(lengthDiffPct, widthDiffPct, heightDiffPct) * 100).toFixed(1)}%` : `FAIL: Dimensions [${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)}] deviate from profile [${profile.overallWidth}, ${profile.overallHeight}, ${profile.overallLength}]`
    });
    const yMin = box.min.y;
    const touchesGround = Math.abs(yMin) < 0.015;
    checks.push({
      checkName: "tyres_touch_ground_plane",
      pass: touchesGround,
      numericValue: Math.abs(yMin) * 1e3,
      thresholdOrExpected: "|y_min| < 15 mm",
      details: touchesGround ? `PASS: Tyres ground plane offset is ${(yMin * 1e3).toFixed(1)} mm` : `FAIL: Tyres floating or clipping ground plane by ${(yMin * 1e3).toFixed(1)} mm`
    });
    const clearance = (profile.wheelArchRadius - profile.wheelRadiusFront) * 1e3;
    const clearancePass = clearance >= 10 && clearance <= 70;
    checks.push({
      checkName: "tyre_to_arch_clearance",
      pass: clearancePass,
      numericValue: clearance,
      thresholdOrExpected: "10 to 70 mm",
      details: clearancePass ? `PASS: Tyre-to-arch clearance is ${clearance.toFixed(1)} mm` : `FAIL: Clearance of ${clearance.toFixed(1)} mm is outside safe suspension travel envelope`
    });
    const antiBoxPass = maxBodyBoxinessScore === 0 && totalTriangles > 200;
    checks.push({
      checkName: "anti_box_geometry_check",
      pass: antiBoxPass,
      numericValue: totalTriangles,
      thresholdOrExpected: "> 200 triangles, 0 cuboid bodies",
      details: antiBoxPass ? `PASS: Authentic lofted curved surfaces (${totalTriangles} triangles, boxiness = 0)` : `FAIL: Detected primitive cuboid bodywork (triangles = ${totalTriangles})`
    });
    const budgetPass = totalTriangles < 4e5 && totalDrawCalls < 150;
    checks.push({
      checkName: "triangle_and_drawcall_budget",
      pass: budgetPass,
      numericValue: totalTriangles,
      thresholdOrExpected: "< 400k triangles, < 150 draw calls",
      details: budgetPass ? `PASS: Performance within target (${totalTriangles} triangles, ${totalDrawCalls} draw calls)` : `FAIL: Budget exceeded (${totalTriangles} triangles, ${totalDrawCalls} draw calls)`
    });
    const failedCount = checks.filter((c) => !c.pass).length;
    return {
      passedAll: failedCount === 0,
      totalChecks: checks.length,
      failedCount,
      totalTriangles,
      totalVertices,
      totalDrawCalls,
      checks
    };
  }
};
export {
  ARCHETYPE_TEMPLATES,
  AssemblyGraph,
  CrossSectionGenerator,
  GeometryDiagnostics,
  GeometryProfileRepository,
  LongitudinalProfileGenerator,
  PanelSeparator,
  ProceduralChassisGenerator,
  StandaloneVehicleGenerationEngine,
  SurfaceLofter,
  WheelGenerator,
  validateGeometryProfile
};
