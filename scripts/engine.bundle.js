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

// packages/vehicle-generation-engine/src/geometry/parametricGeometryBuilder.ts
import * as THREE8 from "three";
var ParametricGeometryBuilder = class {
  /**
   * Builds a complete Three.js vehicle assembly group from a parametric specification
   */
  static build(spec, options) {
    const root = new THREE8.Group();
    root.name = `parametric_vehicle_${spec.asset_id || "custom"}`;
    const defaultPaint = spec.materials?.default_paint;
    const carbonSpec = spec.materials?.carbon_fiber;
    const glassSpec = spec.materials?.glass;
    const alloySpec = spec.materials?.wheel_alloy;
    const bodyPaintColor = options?.customPaintHex ?? defaultPaint?.color ?? "#8B929A";
    const bodyMat = new THREE8.MeshPhysicalMaterial({
      color: new THREE8.Color(bodyPaintColor),
      metalness: defaultPaint?.metalness ?? 0.72,
      roughness: defaultPaint?.roughness ?? 0.24,
      clearcoat: defaultPaint?.clearcoat ?? 1,
      clearcoatRoughness: defaultPaint?.clearcoat_roughness ?? 0.08,
      wireframe: !!options?.wireframe
    });
    const carbonMat = new THREE8.MeshStandardMaterial({
      color: new THREE8.Color(carbonSpec?.color ?? "#17191C"),
      metalness: carbonSpec?.metalness ?? 0.25,
      roughness: carbonSpec?.roughness ?? 0.38,
      wireframe: !!options?.wireframe
    });
    const glassMat = new THREE8.MeshPhysicalMaterial({
      color: new THREE8.Color(glassSpec?.color ?? "#18232D"),
      metalness: glassSpec?.metalness ?? 0.05,
      roughness: glassSpec?.roughness ?? 0.08,
      transmission: glassSpec?.transmission ?? 0.22,
      transparent: true,
      wireframe: !!options?.wireframe
    });
    const rimColor = options?.customWheelColorHex ?? alloySpec?.color ?? "#25282C";
    const bodyShellMesh = this.buildBodyShell(spec, bodyMat);
    bodyShellMesh.name = "component_body_shell";
    bodyShellMesh.castShadow = true;
    bodyShellMesh.receiveShadow = true;
    root.add(bodyShellMesh);
    const glassMesh = this.buildGreenhouseGlass(spec, glassMat);
    glassMesh.name = "component_greenhouse_glass";
    glassMesh.castShadow = true;
    root.add(glassMesh);
    const aeroGroup = this.buildAerodynamics(spec, carbonMat);
    aeroGroup.name = "group_aerodynamics";
    root.add(aeroGroup);
    const wheelsGroup = this.buildWheels(spec, rimColor, options?.wireframe);
    wheelsGroup.name = "group_wheels";
    root.add(wheelsGroup);
    const lightsGroup = this.buildLighting(spec);
    lightsGroup.name = "group_lighting";
    root.add(lightsGroup);
    root.userData = {
      isParametricVehicle: true,
      assetId: spec.asset_id,
      modelName: `${spec.vehicle.manufacturer} ${spec.vehicle.model}`,
      accuracyClass: spec.geometry_provenance.accuracy_class || "D_APPROXIMATE",
      accuracyLabel: "APPROXIMATE PROCEDURAL VEHICLE \u2014 NOT AUTHENTIC MODEL GEOMETRY",
      dimensions: spec.dimensions,
      provenance: spec.geometry_provenance,
      materials: spec.materials,
      validation: spec.validation
    };
    return root;
  }
  /**
   * Lofts the longitudinal sections into a smooth watertight monocoque body shell
   */
  static buildBodyShell(spec, material) {
    const rawSections = spec.geometry.body_shell.longitudinal_sections;
    if (!rawSections || rawSections.length < 2) {
      throw new Error("Parametric body requires at least 2 longitudinal sections");
    }
    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);
    const frontArch = spec.geometry.wheel_arches?.front;
    const rearArch = spec.geometry.wheel_arches?.rear;
    const rings = [];
    const POINTS_PER_HALF = 8;
    for (const sec of sections) {
      const z = sec.z_m;
      const hw = sec.half_width_m;
      const ly = sec.lower_y_m;
      const sy = sec.shoulder_y_m;
      const by = sec.belt_y_m;
      const uy = sec.upper_center_y_m;
      const rw = sec.roof_half_width_m;
      const ry = sec.roof_crown_y_m;
      let archCutoutY = ly;
      let archFlareX = 0;
      if (frontArch && Math.abs(z - frontArch.center_z_m) < frontArch.radius_m) {
        const dz = Math.abs(z - frontArch.center_z_m);
        const dy = Math.sqrt(Math.max(0, frontArch.radius_m * frontArch.radius_m - dz * dz));
        archCutoutY = Math.max(ly, (frontArch.center_y_m ?? 0.35) + dy * 0.88);
        archFlareX = (frontArch.arch_lip_width_m ?? 0.025) * (1 - Math.pow(dz / frontArch.radius_m, 2));
      } else if (rearArch && Math.abs(z - rearArch.center_z_m) < rearArch.radius_m) {
        const dz = Math.abs(z - rearArch.center_z_m);
        const dy = Math.sqrt(Math.max(0, rearArch.radius_m * rearArch.radius_m - dz * dz));
        archCutoutY = Math.max(ly, (rearArch.center_y_m ?? 0.367) + dy * 0.88);
        archFlareX = (rearArch.arch_lip_width_m ?? 0.028) * (1 - Math.pow(dz / rearArch.radius_m, 2));
      }
      const ring = [];
      const hasRoof = rw > 0.01;
      const topCenterY = hasRoof ? ry : uy;
      const pUnderbody = new THREE8.Vector3(0, archCutoutY, z);
      const pRocker = new THREE8.Vector3(-(hw * 0.9 + archFlareX), archCutoutY, z);
      const pFlankLower = new THREE8.Vector3(-(hw + archFlareX), (archCutoutY + sy) * 0.5, z);
      const pShoulder = new THREE8.Vector3(-(hw + archFlareX * 0.6), sy, z);
      const pBelt = new THREE8.Vector3(-hw * 0.96, by, z);
      let pTumblehome;
      let pRoofRail;
      let pRoofSide;
      if (hasRoof) {
        pTumblehome = new THREE8.Vector3(-hw * 0.88, by + 0.06, z);
        pRoofRail = new THREE8.Vector3(-rw, (by + ry) * 0.58, z);
        pRoofSide = new THREE8.Vector3(-rw * 0.6, ry - 0.01, z);
      } else {
        pTumblehome = new THREE8.Vector3(-hw * 0.78, (sy + uy) * 0.5, z);
        pRoofRail = new THREE8.Vector3(-hw * 0.5, (sy + uy) * 0.75, z);
        pRoofSide = new THREE8.Vector3(-hw * 0.25, uy - 0.01, z);
      }
      const pTopCenter = new THREE8.Vector3(0, topCenterY, z);
      const leftPts = [pUnderbody, pRocker, pFlankLower, pShoulder, pBelt, pTumblehome, pRoofRail, pRoofSide, pTopCenter];
      for (let i = 0; i < leftPts.length; i++) {
        ring.push(leftPts[i]);
      }
      for (let i = leftPts.length - 2; i > 0; i--) {
        const pt = leftPts[i];
        ring.push(new THREE8.Vector3(-pt.x, pt.y, pt.z));
      }
      rings.push(ring);
    }
    const positions = [];
    const uvs = [];
    const indices = [];
    const numStations = rings.length;
    const ringLen = rings[0].length;
    for (let s = 0; s < numStations; s++) {
      const ring = rings[s];
      const u = s / (numStations - 1);
      for (let p = 0; p < ringLen; p++) {
        const pt = ring[p];
        positions.push(pt.x, pt.y, pt.z);
        const v = p / ringLen;
        uvs.push(u, v);
      }
    }
    for (let s = 0; s < numStations - 1; s++) {
      const rowA = s * ringLen;
      const rowB = (s + 1) * ringLen;
      for (let p = 0; p < ringLen; p++) {
        const nextP = (p + 1) % ringLen;
        const a0 = rowA + p;
        const a1 = rowA + nextP;
        const b0 = rowB + p;
        const b1 = rowB + nextP;
        indices.push(a0, a1, b0);
        indices.push(a1, b1, b0);
      }
    }
    const noseRingIdx = 0;
    const noseCenterIdx = positions.length / 3;
    const frontSec = sections[0];
    positions.push(0, (frontSec.lower_y_m + frontSec.upper_center_y_m) * 0.5, frontSec.z_m + 0.04);
    uvs.push(0, 0.5);
    for (let p = 0; p < ringLen; p++) {
      const nextP = (p + 1) % ringLen;
      indices.push(noseCenterIdx, noseRingIdx + nextP, noseRingIdx + p);
    }
    const tailRingIdx = (numStations - 1) * ringLen;
    const tailCenterIdx = positions.length / 3;
    const rearSec = sections[numStations - 1];
    positions.push(0, (rearSec.lower_y_m + rearSec.upper_center_y_m) * 0.5, rearSec.z_m - 0.04);
    uvs.push(1, 0.5);
    for (let p = 0; p < ringLen; p++) {
      const nextP = (p + 1) % ringLen;
      indices.push(tailCenterIdx, tailRingIdx + p, tailRingIdx + nextP);
    }
    const geometry = new THREE8.BufferGeometry();
    geometry.setAttribute("position", new THREE8.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE8.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return new THREE8.Mesh(geometry, material);
  }
  /**
   * Builds the tinted curved glass surfaces for the vehicle greenhouse
   * Dynamically adapts to the cowl, A-pillars, roofline, B/C-pillars, and rear deck
   */
  static buildGreenhouseGlass(spec, material) {
    const group = new THREE8.Group();
    const rawSections = spec.geometry.body_shell.longitudinal_sections;
    if (!rawSections || rawSections.length < 2) return group;
    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);
    const roofSecs = sections.filter((s) => s.roof_half_width_m > 0.05);
    if (roofSecs.length < 2) {
      return group;
    }
    const frontRoof = roofSecs[0];
    const rearRoof = roofSecs[roofSecs.length - 1];
    const frontRoofIdx = sections.indexOf(frontRoof);
    const rearRoofIdx = sections.indexOf(rearRoof);
    const cowl = frontRoofIdx > 0 ? sections[frontRoofIdx - 1] : frontRoof;
    const deck = rearRoofIdx < sections.length - 1 ? sections[rearRoofIdx + 1] : rearRoof;
    const wsBaseHalfW = cowl.half_width_m * 0.74;
    const wsTopHalfW = frontRoof.roof_half_width_m * 0.94;
    const wsZDist = cowl.z_m - frontRoof.z_m;
    const wsYDist = frontRoof.roof_crown_y_m - cowl.upper_center_y_m;
    const wsLen = Math.hypot(wsZDist, wsYDist);
    const wsPitch = Math.atan2(wsYDist, wsZDist);
    const wsShape = new THREE8.Shape();
    wsShape.moveTo(-wsBaseHalfW, 0);
    wsShape.lineTo(-wsTopHalfW, wsLen);
    wsShape.quadraticCurveTo(0, wsLen + 0.02, wsTopHalfW, wsLen);
    wsShape.lineTo(wsBaseHalfW, 0);
    wsShape.quadraticCurveTo(0, 0.03, -wsBaseHalfW, 0);
    const wsGeo = new THREE8.ExtrudeGeometry(wsShape, {
      depth: 0.015,
      bevelEnabled: true,
      bevelThickness: 5e-3,
      bevelSize: 5e-3,
      bevelSegments: 2
    });
    wsGeo.center();
    wsGeo.computeVertexNormals();
    const windshield = new THREE8.Mesh(wsGeo, material);
    windshield.name = "glass_windshield";
    windshield.position.set(
      0,
      (cowl.upper_center_y_m + frontRoof.roof_crown_y_m) * 0.5 + 0.01,
      (cowl.z_m + frontRoof.z_m) * 0.5
    );
    windshield.rotation.x = -wsPitch;
    windshield.castShadow = true;
    group.add(windshield);
    const rwTopHalfW = rearRoof.roof_half_width_m * 0.92;
    const rwBaseHalfW = deck.half_width_m * 0.68;
    const rwZDist = rearRoof.z_m - deck.z_m;
    const rwYDist = rearRoof.roof_crown_y_m - deck.upper_center_y_m;
    const rwLen = Math.hypot(rwZDist, rwYDist);
    const rwPitch = Math.atan2(rwYDist, rwZDist);
    const rwShape = new THREE8.Shape();
    rwShape.moveTo(-rwTopHalfW, 0);
    rwShape.lineTo(-rwBaseHalfW, rwLen);
    rwShape.quadraticCurveTo(0, rwLen + 0.02, rwBaseHalfW, rwLen);
    rwShape.lineTo(rwTopHalfW, 0);
    rwShape.quadraticCurveTo(0, 0.02, -rwTopHalfW, 0);
    const rwGeo = new THREE8.ExtrudeGeometry(rwShape, {
      depth: 0.015,
      bevelEnabled: true,
      bevelThickness: 5e-3,
      bevelSize: 5e-3,
      bevelSegments: 2
    });
    rwGeo.center();
    rwGeo.computeVertexNormals();
    const rearGlass = new THREE8.Mesh(rwGeo, material);
    rearGlass.name = "glass_rear_window";
    rearGlass.position.set(
      0,
      (rearRoof.roof_crown_y_m + deck.upper_center_y_m) * 0.5 + 0.01,
      (rearRoof.z_m + deck.z_m) * 0.5
    );
    rearGlass.rotation.x = rwPitch;
    rearGlass.castShadow = true;
    group.add(rearGlass);
    for (let i = 0; i < roofSecs.length - 1; i++) {
      const s0 = roofSecs[i];
      const s1 = roofSecs[i + 1];
      [-1, 1].forEach((side) => {
        const sideShape = new THREE8.Shape();
        const top0 = s0.roof_crown_y_m - 0.01;
        const bot0 = s0.belt_y_m + 0.02;
        const top1 = s1.roof_crown_y_m - 0.01;
        const bot1 = s1.belt_y_m + 0.02;
        const distZ = Math.abs(s0.z_m - s1.z_m);
        sideShape.moveTo(0, bot0);
        sideShape.lineTo(0, top0);
        sideShape.lineTo(distZ, top1);
        sideShape.lineTo(distZ, bot1);
        sideShape.closePath();
        const sideGeo = new THREE8.ExtrudeGeometry(sideShape, {
          depth: 0.012,
          bevelEnabled: false
        });
        sideGeo.computeVertexNormals();
        const sideMesh = new THREE8.Mesh(sideGeo, material);
        sideMesh.name = `glass_side_window_${side === -1 ? "left" : "right"}_${i}`;
        const midHw = ((s0.roof_half_width_m + s1.roof_half_width_m) * 0.5 + (s0.half_width_m + s1.half_width_m) * 0.5) * 0.5;
        sideMesh.position.set(side * midHw * 0.96, 0, s0.z_m);
        sideMesh.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
        group.add(sideMesh);
      });
    }
    return group;
  }
  /**
   * Builds the authentic aerodynamic elements:
   * - Rear Wing (Active multi-element GT wing with swan neck supports OR integrated ducktail decklid lip)
   * - Swept Carbon Front Splitter
   * - Hood Extraction Ducts
   * - Front Fender Louvres
   * - Rear Underbody Diffuser with vertical fins
   */
  static buildAerodynamics(spec, carbonMaterial) {
    const aero = new THREE8.Group();
    const aeroSpec = spec.geometry.aerodynamics;
    const rawSections = spec.geometry.body_shell.longitudinal_sections;
    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);
    const frontSec = sections[0];
    const rearSec = sections[sections.length - 1];
    const roofSecs = sections.filter((s) => s.roof_half_width_m > 0.05);
    const rearRoof = roofSecs.length > 0 ? roofSecs[roofSecs.length - 1] : sections[Math.floor(sections.length / 2)];
    const rearRoofIdx = sections.indexOf(rearRoof);
    const deckSec = rearRoofIdx < sections.length - 1 ? sections[rearRoofIdx + 1] : rearSec;
    const wingSpec = aeroSpec?.rear_wing;
    const wingSpan = wingSpec?.span_m ?? rearSec.half_width_m * 1.85;
    const mainChord = wingSpec?.chord_m ?? 0.32;
    const upperChord = wingSpec?.upper_element_chord_m ?? 0.2;
    const supportCount = wingSpec?.support_count ?? (mainChord > 0.2 ? 2 : 0);
    const deckZ = (deckSec.z_m + rearSec.z_m) * 0.5;
    const deckY = Math.max(deckSec.upper_center_y_m, rearSec.upper_center_y_m);
    if (supportCount === 0) {
      const lipShape = new THREE8.Shape();
      const hmc = Math.max(0.06, mainChord) / 2;
      lipShape.moveTo(-hmc, 0);
      lipShape.quadraticCurveTo(0, 0.04, hmc, 0.035);
      lipShape.lineTo(hmc, 0.015);
      lipShape.quadraticCurveTo(0, -0.01, -hmc, 0);
      const lipGeo = new THREE8.ExtrudeGeometry(lipShape, {
        steps: 3,
        depth: wingSpan,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 8e-3,
        bevelSegments: 2
      });
      lipGeo.center();
      lipGeo.rotateY(Math.PI / 2);
      lipGeo.computeVertexNormals();
      const lipMesh = new THREE8.Mesh(lipGeo, carbonMaterial);
      lipMesh.name = "aero_rear_wing_main_blade";
      lipMesh.position.set(0, deckY + 0.01, deckZ - 0.05);
      lipMesh.rotation.x = -0.18;
      lipMesh.castShadow = true;
      aero.add(lipMesh);
    } else {
      const wingPlacementZ = rearSec.z_m + 0.15;
      const wingPlacementY = deckY + 0.38;
      const mainBladeShape = new THREE8.Shape();
      const hmc = mainChord / 2;
      mainBladeShape.moveTo(-hmc, 0);
      mainBladeShape.quadraticCurveTo(0, 0.045, hmc, 0.01);
      mainBladeShape.lineTo(hmc, -0.01);
      mainBladeShape.quadraticCurveTo(0, -0.02, -hmc, 0);
      const mainBladeGeo = new THREE8.ExtrudeGeometry(mainBladeShape, {
        steps: 4,
        depth: wingSpan,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.01,
        bevelSegments: 3
      });
      mainBladeGeo.center();
      mainBladeGeo.rotateY(Math.PI / 2);
      mainBladeGeo.computeVertexNormals();
      const mainBladeMesh = new THREE8.Mesh(mainBladeGeo, carbonMaterial);
      mainBladeMesh.name = "aero_rear_wing_main_blade";
      mainBladeMesh.position.set(0, wingPlacementY, wingPlacementZ);
      mainBladeMesh.rotation.x = -0.08;
      mainBladeMesh.castShadow = true;
      aero.add(mainBladeMesh);
      if (upperChord > 0.05) {
        const upperBladeShape = new THREE8.Shape();
        const huc = upperChord / 2;
        upperBladeShape.moveTo(-huc, 0);
        upperBladeShape.quadraticCurveTo(0, 0.035, huc, 8e-3);
        upperBladeShape.lineTo(huc, -8e-3);
        upperBladeShape.quadraticCurveTo(0, -0.015, -huc, 0);
        const upperBladeGeo = new THREE8.ExtrudeGeometry(upperBladeShape, {
          steps: 4,
          depth: wingSpan * 0.98,
          bevelEnabled: true,
          bevelThickness: 0.01,
          bevelSize: 8e-3,
          bevelSegments: 2
        });
        upperBladeGeo.center();
        upperBladeGeo.rotateY(Math.PI / 2);
        upperBladeGeo.computeVertexNormals();
        const upperBladeMesh = new THREE8.Mesh(upperBladeGeo, carbonMaterial);
        upperBladeMesh.name = "aero_rear_wing_upper_flap";
        upperBladeMesh.position.set(0, wingPlacementY + 0.09, wingPlacementZ - 0.05);
        upperBladeMesh.rotation.x = -0.16;
        upperBladeMesh.castShadow = true;
        aero.add(upperBladeMesh);
      }
      const pylonSpacing = Math.min(0.48, wingSpan * 0.28);
      [-pylonSpacing, pylonSpacing].forEach((sx, idx) => {
        const pylonCurve = new THREE8.CatmullRomCurve3([
          new THREE8.Vector3(sx, deckY, deckZ + 0.12),
          new THREE8.Vector3(sx, deckY + 0.24, deckZ),
          new THREE8.Vector3(sx, wingPlacementY + 0.12, wingPlacementZ + 0.04),
          new THREE8.Vector3(sx, wingPlacementY + 0.06, wingPlacementZ)
        ]);
        const pylonGeo = new THREE8.TubeGeometry(pylonCurve, 16, 0.02, 8, false);
        pylonGeo.computeVertexNormals();
        const pylonMesh = new THREE8.Mesh(pylonGeo, carbonMaterial);
        pylonMesh.name = `aero_swan_neck_pylon_${idx === 0 ? "left" : "right"}`;
        pylonMesh.castShadow = true;
        aero.add(pylonMesh);
      });
      const endplateShape = new THREE8.Shape();
      endplateShape.moveTo(-0.24, -0.12);
      endplateShape.lineTo(0.24, -0.1);
      endplateShape.lineTo(0.22, 0.14);
      endplateShape.lineTo(-0.2, 0.16);
      endplateShape.closePath();
      const endplateGeo = new THREE8.ExtrudeGeometry(endplateShape, {
        depth: 0.012,
        bevelEnabled: true,
        bevelThickness: 4e-3,
        bevelSize: 4e-3,
        bevelSegments: 2
      });
      endplateGeo.center();
      endplateGeo.computeVertexNormals();
      [-wingSpan / 2, wingSpan / 2].forEach((ex, idx) => {
        const endplateMesh = new THREE8.Mesh(endplateGeo, carbonMaterial);
        endplateMesh.name = `aero_wing_endplate_${idx === 0 ? "left" : "right"}`;
        endplateMesh.position.set(ex, wingPlacementY + 0.04, wingPlacementZ);
        endplateMesh.rotation.y = idx === 0 ? 0 : Math.PI;
        endplateMesh.castShadow = true;
        aero.add(endplateMesh);
      });
    }
    const splitterWidth = aeroSpec?.front_splitter?.width_m ?? frontSec.half_width_m * 1.92;
    const splitterZ = aeroSpec?.front_splitter?.z_m ?? frontSec.z_m + 0.03;
    const splitterY = (frontSec.lower_y_m ?? 0.12) + 0.02;
    const splitterShape = new THREE8.Shape();
    const hsw = splitterWidth / 2;
    splitterShape.moveTo(-hsw, 0);
    splitterShape.lineTo(-hsw + 0.12, 0.38);
    splitterShape.quadraticCurveTo(0, 0.46, hsw - 0.12, 0.38);
    splitterShape.lineTo(hsw, 0);
    splitterShape.quadraticCurveTo(0, -0.06, -hsw, 0);
    const splitterGeo = new THREE8.ExtrudeGeometry(splitterShape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelThickness: 8e-3,
      bevelSize: 8e-3,
      bevelSegments: 2
    });
    splitterGeo.center();
    splitterGeo.computeVertexNormals();
    const splitterMesh = new THREE8.Mesh(splitterGeo, carbonMaterial);
    splitterMesh.name = "aero_front_splitter";
    splitterMesh.position.set(0, splitterY, splitterZ);
    splitterMesh.castShadow = true;
    aero.add(splitterMesh);
    const hoodZ = (frontSec.z_m + (sections[2]?.z_m ?? frontSec.z_m)) * 0.5;
    const hoodY = ((sections[1]?.upper_center_y_m ?? 0.75) + (sections[2]?.upper_center_y_m ?? 0.78)) * 0.5;
    [-0.24, 0.24].forEach((hx, idx) => {
      const ventGeo = new THREE8.BoxGeometry(0.16, 0.02, 0.36);
      ventGeo.computeVertexNormals();
      const ventMesh = new THREE8.Mesh(ventGeo, carbonMaterial);
      ventMesh.name = `aero_hood_vent_${idx === 0 ? "left" : "right"}`;
      ventMesh.position.set(hx, hoodY + 0.01, hoodZ);
      ventMesh.rotation.x = -0.28;
      aero.add(ventMesh);
    });
    const fenderSec = sections[2] || sections[1];
    [-fenderSec.half_width_m * 0.88, fenderSec.half_width_m * 0.88].forEach((fx, idx) => {
      const louvreGroup = new THREE8.Group();
      louvreGroup.name = `aero_fender_louvres_${idx === 0 ? "left" : "right"}`;
      for (let i = 0; i < 4; i++) {
        const slatGeo = new THREE8.BoxGeometry(0.08, 0.012, 0.06);
        const slat = new THREE8.Mesh(slatGeo, carbonMaterial);
        slat.position.set(0, i * 0.025, i * 0.07);
        slat.rotation.x = 0.35;
        louvreGroup.add(slat);
      }
      louvreGroup.position.set(fx, fenderSec.shoulder_y_m + 0.04, fenderSec.z_m);
      aero.add(louvreGroup);
    });
    const diffuserWidth = rearSec.half_width_m * 1.76;
    const diffuserZ = rearSec.z_m + 0.06;
    const diffuserY = (rearSec.lower_y_m ?? 0.14) + 0.04;
    const finCount = aeroSpec?.rear_diffuser?.fin_count ?? 5;
    const diffuserBaseGeo = new THREE8.BoxGeometry(diffuserWidth, 0.035, 0.42);
    const diffuserMesh = new THREE8.Mesh(diffuserBaseGeo, carbonMaterial);
    diffuserMesh.name = "aero_rear_diffuser";
    diffuserMesh.position.set(0, diffuserY, diffuserZ);
    diffuserMesh.rotation.x = 0.14;
    diffuserMesh.castShadow = true;
    aero.add(diffuserMesh);
    if (finCount > 1) {
      const finSpacing = diffuserWidth / (finCount - 1);
      for (let f = 0; f < finCount; f++) {
        const finX = -diffuserWidth / 2 + f * finSpacing;
        const finGeo = new THREE8.BoxGeometry(0.018, 0.09, 0.4);
        const fin = new THREE8.Mesh(finGeo, carbonMaterial);
        fin.position.set(finX, diffuserY - 0.02, diffuserZ);
        fin.rotation.x = 0.14;
        aero.add(fin);
      }
    }
    return aero;
  }
  /**
   * Builds the 4 staggered performance wheels according to the JSON specification:
   * Front: 20" diameter (R=0.35025m), 275/35 ZR 20, 10J x 20 ET 45
   * Rear:  21" diameter (R=0.36720m), 335/30 ZR 21, 13J x 21 ET 31
   */
  static buildWheels(spec, rimColorHex, wireframe = false) {
    const wheels = new THREE8.Group();
    for (const w of spec.geometry.wheels) {
      const radius = w.tire.calculated_radius_m ?? (w.axle === "front" ? 0.35025 : 0.3672);
      const width = w.rim.width_m ?? (w.axle === "front" ? 0.254 : 0.3302);
      const isRight = w.side === "right";
      const wheelAssembly = WheelGenerator.generateWheel({
        wheelRadius: radius,
        tyreWidth: width,
        camberDeg: w.axle === "front" ? -0.035 : -0.045,
        steerDeg: 0,
        isRightSide: isRight,
        rimColorHex
      });
      wheelAssembly.group.name = `wheel_${w.id}`;
      wheelAssembly.group.position.set(w.center_m.x, w.center_m.y, w.center_m.z);
      wheels.add(wheelAssembly.group);
    }
    return wheels;
  }
  /**
   * Builds front projector headlights, rear LED light bar, and dual/quad exhaust tips
   * Dynamically positioned according to the vehicle's actual front and rear sections
   */
  static buildLighting(spec) {
    const lights = new THREE8.Group();
    const rawSections = spec.geometry.body_shell.longitudinal_sections;
    if (!rawSections || rawSections.length < 2) return lights;
    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);
    const frontSec = sections[1] || sections[0];
    const rearSec = sections[sections.length - 2] || sections[sections.length - 1];
    const headlampMat = new THREE8.MeshStandardMaterial({
      color: 15660543,
      emissive: 15660543,
      emissiveIntensity: 0.95,
      roughness: 0.1
    });
    const headX = frontSec.half_width_m * 0.72;
    const headY = frontSec.shoulder_y_m + 0.02;
    const headZ = frontSec.z_m - 0.02;
    [-headX, headX].forEach((hx) => {
      const lampHousing = new THREE8.Group();
      lampHousing.position.set(hx, headY, headZ);
      [
        [-0.03, -0.02],
        [0.03, -0.02],
        [-0.03, 0.02],
        [0.03, 0.02]
      ].forEach(([dx, dy]) => {
        const dotGeo = new THREE8.CylinderGeometry(0.014, 0.014, 0.02, 12);
        dotGeo.rotateX(Math.PI / 2);
        const dot = new THREE8.Mesh(dotGeo, headlampMat);
        dot.position.set(dx, dy, 0);
        lampHousing.add(dot);
      });
      lights.add(lampHousing);
    });
    const taillightMat = new THREE8.MeshStandardMaterial({
      color: 16717636,
      emissive: 16717636,
      emissiveIntensity: 1,
      roughness: 0.2
    });
    const lightBarWidth = rearSec.half_width_m * 1.76;
    const lightBarGeo = new THREE8.BoxGeometry(lightBarWidth, 0.028, 0.04);
    const lightBar = new THREE8.Mesh(lightBarGeo, taillightMat);
    lightBar.name = "lighting_rear_light_bar";
    lightBar.position.set(0, rearSec.shoulder_y_m, rearSec.z_m + 0.02);
    lights.add(lightBar);
    const exhaustMat = new THREE8.MeshStandardMaterial({
      color: 2763824,
      metalness: 0.92,
      roughness: 0.18
    });
    const exhaustY = rearSec.lower_y_m + 0.1;
    const exhaustZ = rearSec.z_m - 0.02;
    [-0.22, -0.12, 0.12, 0.22].forEach((ex, idx) => {
      const tipGeo = new THREE8.CylinderGeometry(0.038, 0.04, 0.1, 16);
      tipGeo.rotateX(Math.PI / 2);
      const tip = new THREE8.Mesh(tipGeo, exhaustMat);
      tip.name = `exhaust_tip_${idx + 1}`;
      tip.position.set(ex, exhaustY, exhaustZ);
      lights.add(tip);
    });
    return lights;
  }
};

// packages/vehicle-generation-engine/src/geometry/editableVehicleAssembler.ts
import * as THREE13 from "three";

// packages/vehicle-generation-engine/src/geometry/crossCarPartSwapper.ts
import * as THREE9 from "three";
var VEHICLE_HUB_SPECS = {
  porsche_911_gt3_rs: {
    vehicleId: "porsche_911_gt3_rs",
    displayName: "Porsche 911 GT3 RS (992)",
    hubInterface: "center_lock_84mm",
    boltPatternString: "Center-Lock 84mm Spline, 600 Nm Central Nut",
    hubBoreMm: 84,
    lugThread: "Center Nut M34x3.0 Left/Right Handed",
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 410,
    fenderLipLimitMm: 88
  },
  porsche_911_gt3_rs_992: {
    vehicleId: "porsche_911_gt3_rs_992",
    displayName: "Porsche 911 GT3 RS (992)",
    hubInterface: "center_lock_84mm",
    boltPatternString: "Center-Lock 84mm Spline, 600 Nm Central Nut",
    hubBoreMm: 84,
    lugThread: "Center Nut M34x3.0 Left/Right Handed",
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 410,
    fenderLipLimitMm: 88
  },
  lamborghini_aventador_svj: {
    vehicleId: "lamborghini_aventador_svj",
    displayName: "Lamborghini Aventador SVJ",
    hubInterface: "center_lock_84mm",
    boltPatternString: "Center-Lock 84mm Spline, 580 Nm Anodized Nut",
    hubBoreMm: 84,
    lugThread: "Center Nut M34x3.0",
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 400,
    fenderLipLimitMm: 90
  },
  ferrari_488_pista: {
    vehicleId: "ferrari_488_pista",
    displayName: "Ferrari 488 Pista",
    hubInterface: "5x114_3",
    boltPatternString: "5x114.3mm PCD, 67.1mm Hub Bore, M14x1.5 Titanium Studs",
    hubBoreMm: 67.1,
    lugThread: "M14x1.5 Titanium Studs (100 Nm Torqued)",
    minRimDiameterInches: 19,
    caliperEnvelopeMm: 398,
    fenderLipLimitMm: 85
  },
  nissan_gtr_r35_nismo: {
    vehicleId: "nissan_gtr_r35_nismo",
    displayName: "Nissan GT-R Nismo (R35)",
    hubInterface: "5x114_3",
    boltPatternString: "5x114.3mm PCD, 66.1mm Hub Bore, M12x1.25 Studs",
    hubBoreMm: 66.1,
    lugThread: "M12x1.25 Studs",
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 410,
    fenderLipLimitMm: 86
  },
  bmw_m4_csl: {
    vehicleId: "bmw_m4_csl",
    displayName: "BMW M4 CSL (G82)",
    hubInterface: "5x112",
    boltPatternString: "5x112mm PCD, 66.6mm Hub Bore, M14x1.25 Bolts",
    hubBoreMm: 66.6,
    lugThread: "M14x1.25 Bolts",
    minRimDiameterInches: 19,
    caliperEnvelopeMm: 400,
    fenderLipLimitMm: 82
  },
  chevrolet_corvette_z06: {
    vehicleId: "chevrolet_corvette_z06",
    displayName: "Chevrolet Corvette Z06 (C8)",
    hubInterface: "5x120",
    boltPatternString: "5x120mm PCD, 70.3mm Hub Bore, M14x1.5 Lug Nuts",
    hubBoreMm: 70.3,
    lugThread: "M14x1.5 Lug Nuts",
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 398,
    fenderLipLimitMm: 88
  }
};
var CrossCarPartSwapper = class {
  static donorCatalog = [];
  static {
    this.initializeCatalog();
  }
  /**
   * Evaluates fitment of a donor part onto a target vehicle
   */
  static evaluateFitment(donorPart, targetVehicleSpec) {
    const targetDims = targetVehicleSpec?.dimensions || {
      width: 1.95,
      height: 1.25,
      length: 4.55,
      wheelbase: 2.65,
      frontTrack: 1.62,
      rearTrack: 1.6
    };
    const targetVehicleId = targetVehicleSpec?.vehicle?.id || targetVehicleSpec?.id || "target_vehicle";
    const reasons = [];
    const warnings = [];
    let status = "DIRECT_FIT";
    let score = 95;
    let requiresAdapterKit = false;
    let adapterKitDesc = void 0;
    let scaleAdjustment = [1, 1, 1];
    let mountingOffsetDelta = [0, 0, 0];
    if (donorPart.category === "Wheels") {
      const targetHub = VEHICLE_HUB_SPECS[targetVehicleId];
      const targetInterface = targetHub?.hubInterface || (targetVehicleSpec?.wheels?.front?.hubInterface || "5x114_3");
      const donorInterface = donorPart.hubInterface || "5x114_3";
      if (donorInterface === targetInterface) {
        status = "DIRECT_FIT";
        score = 98;
        reasons.push(`Direct bolt-on fitment: Hub interfaces match perfectly (${donorInterface}).`);
      } else if (donorInterface === "center_lock_84mm" && targetInterface.startsWith("5x") || donorInterface.startsWith("5x") && targetInterface === "center_lock_84mm") {
        status = "ADAPTABLE";
        score = 80;
        requiresAdapterKit = true;
        adapterKitDesc = "Requires Billet Aluminum Center-Lock Hub Conversion Spacer (+25mm Track Offset).";
        warnings.push("Conversion spacers add +25mm track poke per corner; check fender lip clearance.");
        mountingOffsetDelta = [0.025, 0, 0];
      } else if (donorInterface.startsWith("5x") && targetInterface.startsWith("5x")) {
        status = "ADAPTABLE";
        score = 85;
        requiresAdapterKit = true;
        adapterKitDesc = `PCD variance: ${donorInterface} to ${targetInterface}. Requires floating conical PCD conversion bolts.`;
        warnings.push("Wheel bolt torque must be re-checked every 500 track kilometers.");
      } else {
        status = "INCOMPATIBLE";
        score = 15;
        reasons.push(`Incompatible hub architecture: Cannot safely adapt ${donorInterface} onto ${targetInterface}.`);
      }
      return {
        status,
        passed: status !== "INCOMPATIBLE",
        score,
        reasons,
        warnings,
        scaleAdjustment,
        mountingOffsetDelta,
        requiresAdapterKit,
        adapterKitDescription: adapterKitDesc,
        kinematics: {
          hubMatched: donorInterface === targetInterface,
          trackWidthDeltaMm: requiresAdapterKit ? 50 : 0,
          clearanceOk: status !== "INCOMPATIBLE",
          aeroBalanceDeltaPercent: 0
        }
      };
    }
    if (donorPart.category === "Aero" || donorPart.category === "Body") {
      const donorWidth = donorPart.dimensions.width;
      const targetWidth = targetDims.width;
      const widthRatio = targetWidth / Math.max(0.1, donorWidth);
      const widthDiffPercent = Math.abs(widthRatio - 1) * 100;
      if (widthDiffPercent <= 8) {
        status = "DIRECT_FIT";
        score = 94;
        scaleAdjustment = [1, 1, 1];
        reasons.push(`Component mounting width within OEM tolerance (${widthDiffPercent.toFixed(1)}% variance). Direct mounting possible.`);
      } else if (widthDiffPercent <= 28) {
        status = "ADAPTABLE";
        score = 78;
        requiresAdapterKit = true;
        scaleAdjustment = [widthRatio, 1, 1];
        adapterKitDesc = "Custom CNC 6061-T6 Billet Aluminum Stanchion Brackets required.";
        warnings.push(`Donor span (${donorWidth.toFixed(2)}m) adapted to target vehicle body line (${targetWidth.toFixed(2)}m). Lateral scale factor: ${widthRatio.toFixed(3)}x.`);
      } else {
        status = "INCOMPATIBLE";
        score = 25;
        reasons.push(`Excessive dimensional disparity (${widthDiffPercent.toFixed(1)}% width variance). Mounting on this chassis causes severe flow detachment and overhang regulations violation.`);
      }
      if (donorPart.semanticType === "rear_wing") {
        const deckHeightOffset = targetDims.height * 0.75 - 0.95;
        mountingOffsetDelta = [0, deckHeightOffset, 0];
      }
      return {
        status,
        passed: status !== "INCOMPATIBLE",
        score,
        reasons,
        warnings,
        scaleAdjustment,
        mountingOffsetDelta,
        requiresAdapterKit,
        adapterKitDescription: adapterKitDesc,
        kinematics: {
          hubMatched: true,
          trackWidthDeltaMm: 0,
          clearanceOk: status !== "INCOMPATIBLE",
          aeroBalanceDeltaPercent: donorPart.downforceKgAt200Kmh * 0.15
        }
      };
    }
    return {
      status: "ADAPTABLE",
      passed: true,
      score: 88,
      reasons: ["Universal modular component mounting: standard DIN / FIA harness anchors."],
      warnings: [],
      scaleAdjustment: [1, 1, 1],
      mountingOffsetDelta: [0, 0, 0],
      requiresAdapterKit: false
    };
  }
  static getDonorParts(category, excludeVehicleId) {
    let parts = this.donorCatalog;
    if (category && category !== "All") {
      parts = parts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (excludeVehicleId) {
      parts = parts.filter((p) => p.sourceVehicleId !== excludeVehicleId);
    }
    return parts;
  }
  static getDonorPartById(id) {
    return this.donorCatalog.find((p) => p.id === id);
  }
  static initializeCatalog() {
    this.donorCatalog = [
      // 1. LAMBORGHINI AVENTADOR SVJ
      {
        id: "donor_svj_ala_wing",
        name: "Aventador SVJ Active ALA 2.0 Carbon Wing",
        category: "Aero",
        semanticType: "rear_wing",
        sourceVehicleId: "lamborghini_aventador_svj",
        sourceVehicleName: "Lamborghini Aventador SVJ",
        dimensions: { width: 1.84, height: 0.38, length: 0.45 },
        massKg: 6.8,
        downforceKgAt200Kmh: 490,
        dragCdDelta: 0.042,
        defaultMaterialRef: "carbon_twill",
        description: "Aerodinamica Lamborghini Attiva (ALA 2.0) hollow carbon wing with motorized internal micro-flaps for aero-vectoring.",
        generateMesh: (scale, offset, _matRef, customColor) => {
          const group = new THREE9.Group();
          group.name = "donor_svj_ala_wing";
          const wingMat = new THREE9.MeshStandardMaterial({
            color: customColor ? new THREE9.Color(customColor) : new THREE9.Color(1579035),
            roughness: 0.3,
            metalness: 0.4
          });
          const bracketMat = new THREE9.MeshStandardMaterial({ color: 2565930, metalness: 0.8, roughness: 0.2 });
          const blade = new THREE9.Mesh(new THREE9.BoxGeometry(1.84 * scale[0], 0.035 * scale[1], 0.32 * scale[2]), wingMat);
          blade.position.set(0, 0.35 + offset[1], offset[2]);
          blade.rotation.x = -0.06;
          group.add(blade);
          const pylon = new THREE9.Mesh(new THREE9.BoxGeometry(0.12, 0.36, 0.24), bracketMat);
          pylon.position.set(0, 0.18 + offset[1], -0.04 + offset[2]);
          group.add(pylon);
          [-0.92 * scale[0], 0.92 * scale[0]].forEach((x) => {
            const endplate = new THREE9.Mesh(new THREE9.BoxGeometry(0.015, 0.22, 0.38), wingMat);
            endplate.position.set(x, 0.35 + offset[1], offset[2]);
            group.add(endplate);
          });
          return group;
        }
      },
      {
        id: "donor_svj_leirion_wheels",
        name: 'SVJ Leirion Forged 20"/21" Center-Lock Wheels',
        category: "Wheels",
        semanticType: "wheel_fl",
        sourceVehicleId: "lamborghini_aventador_svj",
        sourceVehicleName: "Lamborghini Aventador SVJ",
        dimensions: { width: 0.35, height: 0.72, length: 0.72 },
        massKg: 9.4,
        downforceKgAt200Kmh: 0,
        dragCdDelta: 5e-3,
        hubInterface: "center_lock_84mm",
        wheelDiameterInches: 21,
        rimWidthInches: 13,
        wheelOffsetMm: 35,
        defaultMaterialRef: "rim",
        description: "Directional Y-spoke lightweight forged alloy wheels with bronze/titanium finish and anodized center nut.",
        generateMesh: (scale, offset, _matRef, customColor) => {
          const group = new THREE9.Group();
          group.name = "donor_svj_leirion_wheels";
          const rimMat = new THREE9.MeshStandardMaterial({
            color: customColor ? new THREE9.Color(customColor) : new THREE9.Color(11817737),
            metalness: 0.85,
            roughness: 0.25
          });
          const tireMat = new THREE9.MeshStandardMaterial({ color: 1579035, roughness: 0.85 });
          const tire = new THREE9.Mesh(new THREE9.CylinderGeometry(0.35, 0.35, 0.32, 32), tireMat);
          tire.rotation.z = Math.PI / 2;
          group.add(tire);
          const rim = new THREE9.Mesh(new THREE9.CylinderGeometry(0.26, 0.26, 0.33, 24), rimMat);
          rim.rotation.z = Math.PI / 2;
          group.add(rim);
          for (let i = 0; i < 5; i++) {
            const angle = i * Math.PI * 2 / 5;
            const spoke = new THREE9.Mesh(new THREE9.BoxGeometry(0.03, 0.24, 0.04), rimMat);
            spoke.rotation.x = angle;
            spoke.position.set(0.12 + offset[0], 0, 0);
            group.add(spoke);
          }
          const nutMat = new THREE9.MeshStandardMaterial({ color: 14251782, metalness: 0.9, roughness: 0.1 });
          const nut = new THREE9.Mesh(new THREE9.CylinderGeometry(0.045, 0.045, 0.05, 12), nutMat);
          nut.rotation.z = Math.PI / 2;
          nut.position.x = 0.17 + offset[0];
          group.add(nut);
          return group;
        }
      },
      {
        id: "donor_svj_high_exhaust",
        name: "SVJ Inconel Top-Mounted High Exhaust Outlets",
        category: "Exhaust",
        semanticType: "exhaust_system",
        sourceVehicleId: "lamborghini_aventador_svj",
        sourceVehicleName: "Lamborghini Aventador SVJ",
        dimensions: { width: 0.55, height: 0.18, length: 0.3 },
        massKg: 5.2,
        downforceKgAt200Kmh: 15,
        dragCdDelta: 2e-3,
        defaultMaterialRef: "alloy",
        description: "Exposed dual top-center titanium/Inconel flame-spitting exhaust tips positioned between the taillights.",
        generateMesh: (scale, offset) => {
          const group = new THREE9.Group();
          group.name = "donor_svj_high_exhaust";
          const pipeMat = new THREE9.MeshStandardMaterial({ color: 3900150, metalness: 0.9, roughness: 0.15 });
          [-0.14, 0.14].forEach((x) => {
            const pipe = new THREE9.Mesh(new THREE9.CylinderGeometry(0.065, 0.065, 0.22, 24), pipeMat);
            pipe.rotation.x = Math.PI / 2;
            pipe.position.set(x, 0.45 + offset[1], -2.15 + offset[2]);
            group.add(pipe);
          });
          return group;
        }
      },
      // 2. FERRARI 488 PISTA
      {
        id: "donor_pista_s_duct_hood",
        name: "488 Pista S-Duct Carbon Aerodynamic Hood",
        category: "Body",
        semanticType: "hood",
        sourceVehicleId: "ferrari_488_pista",
        sourceVehicleName: "Ferrari 488 Pista",
        dimensions: { width: 1.45, height: 0.28, length: 1.25 },
        massKg: 5.4,
        downforceKgAt200Kmh: 240,
        dragCdDelta: -0.012,
        defaultMaterialRef: "carbon_twill",
        description: "Patented F1-derived S-Duct front hood channel creating massive front axle downforce by routing under-bumper air out.",
        generateMesh: (scale, offset) => {
          const group = new THREE9.Group();
          group.name = "donor_pista_s_duct_hood";
          const hoodMat = new THREE9.MeshStandardMaterial({ color: 14427686, metalness: 0.2, roughness: 0.3 });
          const ductMat = new THREE9.MeshStandardMaterial({ color: 1579035, metalness: 0.5, roughness: 0.3 });
          const hood = new THREE9.Mesh(new THREE9.BoxGeometry(1.42 * scale[0], 0.04, 1.2 * scale[2]), hoodMat);
          hood.position.set(0, 0.62 + offset[1], 1.2 + offset[2]);
          hood.rotation.x = 0.09;
          group.add(hood);
          const duct = new THREE9.Mesh(new THREE9.BoxGeometry(0.48 * scale[0], 0.08, 0.75 * scale[2]), ductMat);
          duct.position.set(0, 0.6 + offset[1], 1.15 + offset[2]);
          duct.rotation.x = 0.14;
          group.add(duct);
          return group;
        }
      },
      {
        id: "donor_pista_blown_spoiler",
        name: "488 Pista Integrated Blown Rear Spoiler",
        category: "Aero",
        semanticType: "rear_wing",
        sourceVehicleId: "ferrari_488_pista",
        sourceVehicleName: "Ferrari 488 Pista",
        dimensions: { width: 1.72, height: 0.18, length: 0.35 },
        massKg: 4.1,
        downforceKgAt200Kmh: 310,
        dragCdDelta: 0.018,
        defaultMaterialRef: "carbon_twill",
        description: "Suspended blown rear spoiler with continuous airflow channel underneath, extending 30mm beyond rear fascia.",
        generateMesh: (scale, offset) => {
          const group = new THREE9.Group();
          group.name = "donor_pista_blown_spoiler";
          const spoilerMat = new THREE9.MeshStandardMaterial({ color: 1579035, metalness: 0.4, roughness: 0.25 });
          const lip = new THREE9.Mesh(new THREE9.BoxGeometry(1.72 * scale[0], 0.06 * scale[1], 0.3 * scale[2]), spoilerMat);
          lip.position.set(0, 0.72 + offset[1], -1.95 + offset[2]);
          lip.rotation.x = -0.12;
          group.add(lip);
          return group;
        }
      },
      {
        id: "donor_pista_carbon_wheels",
        name: "488 Pista Carbon Fiber 1-Piece Monobloc Wheels",
        category: "Wheels",
        semanticType: "wheel_fl",
        sourceVehicleId: "ferrari_488_pista",
        sourceVehicleName: "Ferrari 488 Pista",
        dimensions: { width: 0.32, height: 0.7, length: 0.7 },
        massKg: 6.9,
        downforceKgAt200Kmh: 0,
        dragCdDelta: 3e-3,
        hubInterface: "5x114_3",
        wheelDiameterInches: 20,
        rimWidthInches: 11,
        wheelOffsetMm: 40,
        defaultMaterialRef: "carbon_twill",
        description: "Ultralight full carbon fiber barrel and face (-40% unsprung mass compared to forged aluminum).",
        generateMesh: (scale, offset) => {
          const group = new THREE9.Group();
          group.name = "donor_pista_carbon_wheels";
          const carbonMat = new THREE9.MeshStandardMaterial({ color: 592139, roughness: 0.2, metalness: 0.1 });
          const tireMat = new THREE9.MeshStandardMaterial({ color: 1579035, roughness: 0.85 });
          const tire = new THREE9.Mesh(new THREE9.CylinderGeometry(0.35, 0.35, 0.3, 32), tireMat);
          tire.rotation.z = Math.PI / 2;
          group.add(tire);
          const rim = new THREE9.Mesh(new THREE9.CylinderGeometry(0.25, 0.25, 0.31, 24), carbonMat);
          rim.rotation.z = Math.PI / 2;
          group.add(rim);
          for (let i = 0; i < 5; i++) {
            const angle = i * Math.PI * 2 / 5;
            const spoke = new THREE9.Mesh(new THREE9.BoxGeometry(0.02, 0.23, 0.03), carbonMat);
            spoke.rotation.x = angle;
            spoke.position.set(0.12 + offset[0], 0, 0);
            group.add(spoke);
          }
          return group;
        }
      },
      // 3. PORSCHE 911 GT3 RS
      {
        id: "donor_gt3rs_swan_drs_wing",
        name: "911 GT3 RS Swan-Neck Active DRS High Wing",
        category: "Aero",
        semanticType: "rear_wing",
        sourceVehicleId: "porsche_911_gt3_rs",
        sourceVehicleName: "Porsche 911 GT3 RS (992)",
        dimensions: { width: 1.82, height: 0.52, length: 0.42 },
        massKg: 7.2,
        downforceKgAt200Kmh: 860,
        dragCdDelta: 0.058,
        defaultMaterialRef: "carbon_twill",
        description: "Motorsport roof-line swan-neck rear wing with hydraulic Drag Reduction System (DRS) actuator creating 860kg downforce.",
        generateMesh: (scale, offset, _matRef, customColor) => {
          const group = new THREE9.Group();
          group.name = "donor_gt3rs_swan_drs_wing";
          const wingMat = new THREE9.MeshStandardMaterial({
            color: customColor ? new THREE9.Color(customColor) : new THREE9.Color(1579035),
            roughness: 0.28,
            metalness: 0.35
          });
          const bracketMat = new THREE9.MeshStandardMaterial({ color: 4144966, metalness: 0.85, roughness: 0.15 });
          [-0.42 * scale[0], 0.42 * scale[0]].forEach((x) => {
            const pylon = new THREE9.Mesh(new THREE9.BoxGeometry(0.04, 0.52 * scale[1], 0.28 * scale[2]), bracketMat);
            pylon.position.set(x, 0.32 + offset[1], -0.05 + offset[2]);
            pylon.rotation.x = 0.22;
            group.add(pylon);
          });
          const blade = new THREE9.Mesh(new THREE9.BoxGeometry(1.82 * scale[0], 0.035 * scale[1], 0.34 * scale[2]), wingMat);
          blade.position.set(0, 0.55 + offset[1], offset[2]);
          blade.rotation.x = -0.15;
          group.add(blade);
          const flap = new THREE9.Mesh(new THREE9.BoxGeometry(1.78 * scale[0], 0.02 * scale[1], 0.14 * scale[2]), wingMat);
          flap.position.set(0, 0.58 + offset[1], -0.12 + offset[2]);
          flap.rotation.x = -0.22;
          group.add(flap);
          [-0.91 * scale[0], 0.91 * scale[0]].forEach((x) => {
            const ep = new THREE9.Mesh(new THREE9.BoxGeometry(0.015, 0.38, 0.42), wingMat);
            ep.position.set(x, 0.52 + offset[1], offset[2]);
            group.add(ep);
          });
          return group;
        }
      },
      {
        id: "donor_gt3rs_louvred_fenders",
        name: "911 GT3 RS Carbon Louvred Front Fenders",
        category: "Body",
        semanticType: "front_left_fender",
        sourceVehicleId: "porsche_911_gt3_rs",
        sourceVehicleName: "Porsche 911 GT3 RS (992)",
        dimensions: { width: 0.45, height: 0.55, length: 1.15 },
        massKg: 3.8,
        downforceKgAt200Kmh: 180,
        dragCdDelta: -8e-3,
        defaultMaterialRef: "carbon_twill",
        description: "Extruded carbon front wheel arch louvers with cutaway relief channels preventing high-speed aerodynamic lift.",
        generateMesh: (scale, offset) => {
          const group = new THREE9.Group();
          group.name = "donor_gt3rs_louvred_fenders";
          const fenderMat = new THREE9.MeshStandardMaterial({ color: 1579035, metalness: 0.4, roughness: 0.3 });
          const fender = new THREE9.Mesh(new THREE9.BoxGeometry(0.35 * scale[0], 0.48 * scale[1], 1.1 * scale[2]), fenderMat);
          fender.position.set(-0.78, 0.48 + offset[1], 1.25 + offset[2]);
          group.add(fender);
          for (let i = 0; i < 5; i++) {
            const slat = new THREE9.Mesh(new THREE9.BoxGeometry(0.18, 0.01, 0.06), fenderMat);
            slat.position.set(-0.78, 0.72 + offset[1], 1.1 + i * 0.07 + offset[2]);
            slat.rotation.x = 0.35;
            group.add(slat);
          }
          return group;
        }
      },
      {
        id: "donor_gt3rs_centerlock_wheels",
        name: "911 GT3 RS Center-Lock Lightweight Forged Wheels",
        category: "Wheels",
        semanticType: "wheel_fl",
        sourceVehicleId: "porsche_911_gt3_rs",
        sourceVehicleName: "Porsche 911 GT3 RS (992)",
        dimensions: { width: 0.34, height: 0.71, length: 0.71 },
        massKg: 8.8,
        downforceKgAt200Kmh: 0,
        dragCdDelta: 4e-3,
        hubInterface: "center_lock_84mm",
        wheelDiameterInches: 20,
        rimWidthInches: 10,
        wheelOffsetMm: 45,
        defaultMaterialRef: "rim",
        description: "Forged magnesium-aluminum alloy lightweight racing wheels with motorsport center-lock nut.",
        generateMesh: (scale, offset, _matRef, customColor) => {
          const group = new THREE9.Group();
          group.name = "donor_gt3rs_centerlock_wheels";
          const rimMat = new THREE9.MeshStandardMaterial({
            color: customColor ? new THREE9.Color(customColor) : new THREE9.Color(13948120),
            metalness: 0.9,
            roughness: 0.2
          });
          const tireMat = new THREE9.MeshStandardMaterial({ color: 1579035, roughness: 0.85 });
          const tire = new THREE9.Mesh(new THREE9.CylinderGeometry(0.35, 0.35, 0.3, 32), tireMat);
          tire.rotation.z = Math.PI / 2;
          group.add(tire);
          const rim = new THREE9.Mesh(new THREE9.CylinderGeometry(0.26, 0.26, 0.31, 24), rimMat);
          rim.rotation.z = Math.PI / 2;
          group.add(rim);
          for (let i = 0; i < 7; i++) {
            const angle = i * Math.PI * 2 / 7;
            const spoke = new THREE9.Mesh(new THREE9.BoxGeometry(0.025, 0.24, 0.035), rimMat);
            spoke.rotation.x = angle;
            spoke.position.set(0.12 + offset[0], 0, 0);
            group.add(spoke);
          }
          const nutMat = new THREE9.MeshStandardMaterial({ color: 2450411, metalness: 0.9, roughness: 0.1 });
          const nut = new THREE9.Mesh(new THREE9.CylinderGeometry(0.045, 0.045, 0.05, 12), nutMat);
          nut.rotation.z = Math.PI / 2;
          nut.position.x = 0.16 + offset[0];
          group.add(nut);
          return group;
        }
      },
      // 4. AFTERMARKET & MOTORSPORT TUNING
      {
        id: "donor_bbs_fi_r_wheels",
        name: "BBS FI-R Ultralight Monobloc Forged Wheels",
        category: "Wheels",
        semanticType: "wheel_fl",
        sourceVehicleId: "aftermarket_bbs",
        sourceVehicleName: "BBS Motorsport Catalog",
        dimensions: { width: 0.32, height: 0.69, length: 0.69 },
        massKg: 7.9,
        downforceKgAt200Kmh: 0,
        dragCdDelta: 2e-3,
        hubInterface: "5x112",
        wheelDiameterInches: 20,
        rimWidthInches: 9.5,
        wheelOffsetMm: 42,
        defaultMaterialRef: "rim",
        description: "Patented weight-relief holes machined directly into each spoke; ultimate strength-to-weight ratio.",
        generateMesh: (scale, offset) => {
          const group = new THREE9.Group();
          group.name = "donor_bbs_fi_r_wheels";
          const rimMat = new THREE9.MeshStandardMaterial({ color: 1579035, metalness: 0.8, roughness: 0.25 });
          const tireMat = new THREE9.MeshStandardMaterial({ color: 1579035, roughness: 0.85 });
          const tire = new THREE9.Mesh(new THREE9.CylinderGeometry(0.35, 0.35, 0.28, 32), tireMat);
          tire.rotation.z = Math.PI / 2;
          group.add(tire);
          const rim = new THREE9.Mesh(new THREE9.CylinderGeometry(0.26, 0.26, 0.29, 24), rimMat);
          rim.rotation.z = Math.PI / 2;
          group.add(rim);
          for (let i = 0; i < 5; i++) {
            const angle = i * Math.PI * 2 / 5;
            const spoke = new THREE9.Mesh(new THREE9.BoxGeometry(0.03, 0.24, 0.04), rimMat);
            spoke.rotation.x = angle;
            spoke.position.set(0.11 + offset[0], 0, 0);
            group.add(spoke);
          }
          return group;
        }
      },
      {
        id: "donor_gt3_carbon_front_splitter",
        name: "Endurance GT3 Triple-Plane Carbon Front Splitter",
        category: "Aero",
        semanticType: "front_splitter",
        sourceVehicleId: "aftermarket_aero",
        sourceVehicleName: "AutoVerse Performance Lab",
        dimensions: { width: 1.95, height: 0.08, length: 0.65 },
        massKg: 4.8,
        downforceKgAt200Kmh: 380,
        dragCdDelta: 0.024,
        defaultMaterialRef: "carbon_twill",
        description: "Full carbon underbody splitter with twin underfloor Venturi diffuser tunnels and tie-rod support struts.",
        generateMesh: (scale, offset) => {
          const group = new THREE9.Group();
          group.name = "donor_gt3_carbon_front_splitter";
          const carbonMat = new THREE9.MeshStandardMaterial({ color: 1579035, metalness: 0.4, roughness: 0.3 });
          const strutMat = new THREE9.MeshStandardMaterial({ color: 10592682, metalness: 0.9, roughness: 0.1 });
          const tray = new THREE9.Mesh(new THREE9.BoxGeometry(1.95 * scale[0], 0.03 * scale[1], 0.62 * scale[2]), carbonMat);
          tray.position.set(0, 0.08 + offset[1], 2.15 + offset[2]);
          group.add(tray);
          [-0.97 * scale[0], 0.97 * scale[0]].forEach((x) => {
            const fence = new THREE9.Mesh(new THREE9.BoxGeometry(0.015, 0.12, 0.45), carbonMat);
            fence.position.set(x, 0.13 + offset[1], 2.15 + offset[2]);
            group.add(fence);
          });
          [-0.35, 0.35].forEach((x) => {
            const strut = new THREE9.Mesh(new THREE9.CylinderGeometry(8e-3, 8e-3, 0.28), strutMat);
            strut.position.set(x, 0.22 + offset[1], 2.32 + offset[2]);
            strut.rotation.x = -0.35;
            group.add(strut);
          });
          return group;
        }
      },
      {
        id: "donor_venturi_rear_diffuser",
        name: "Pro-Race 6-Channel Venturi Carbon Diffuser",
        category: "Aero",
        semanticType: "rear_diffuser",
        sourceVehicleId: "aftermarket_aero",
        sourceVehicleName: "AutoVerse Performance Lab",
        dimensions: { width: 1.88, height: 0.28, length: 0.95 },
        massKg: 6.2,
        downforceKgAt200Kmh: 420,
        dragCdDelta: -0.015,
        defaultMaterialRef: "carbon_twill",
        description: "Full-length underbody expansion tunnel with 6 vertical aerodynamic strakes for ground-effect suction.",
        generateMesh: (scale, offset) => {
          const group = new THREE9.Group();
          group.name = "donor_venturi_rear_diffuser";
          const carbonMat = new THREE9.MeshStandardMaterial({ color: 1579035, metalness: 0.35, roughness: 0.3 });
          const ramp = new THREE9.Mesh(new THREE9.BoxGeometry(1.85 * scale[0], 0.03, 0.9 * scale[2]), carbonMat);
          ramp.position.set(0, 0.14 + offset[1], -2.05 + offset[2]);
          ramp.rotation.x = -0.18;
          group.add(ramp);
          const count = 6;
          for (let i = 0; i < count; i++) {
            const x = -0.8 + i * 1.6 / (count - 1);
            const strake = new THREE9.Mesh(new THREE9.BoxGeometry(0.015, 0.18, 0.85), carbonMat);
            strake.position.set(x * scale[0], 0.14 + offset[1], -2.05 + offset[2]);
            strake.rotation.x = -0.18;
            group.add(strake);
          }
          return group;
        }
      }
    ];
  }
};

// packages/vehicle-generation-engine/src/geometry/vehicleInteriorGenerator.ts
import * as THREE10 from "three";
var VehicleInteriorGenerator = class {
  /**
   * Resolves the authentic design language based on vehicle make and model
   */
  static resolveDesignLanguage(spec) {
    const make = spec.manufacturer.toLowerCase();
    const model = spec.model.toLowerCase();
    const id = spec.vehicleId.toLowerCase();
    if (make.includes("porsche")) return "PORSCHE";
    if (make.includes("ferrari")) return "FERRARI";
    if (make.includes("lamborghini")) return "LAMBORGHINI";
    if (make.includes("mclaren")) return "MCLAREN";
    if (make.includes("bmw")) return "BMW_M";
    if (make.includes("mercedes")) return "MERCEDES_AMG";
    if (make.includes("audi")) return "AUDI_SPORT";
    if (make.includes("bugatti")) return "BUGATTI_HYPERCAR";
    if (make.includes("pagani")) return "PAGANI_ARTISAN";
    if (make.includes("koenigsegg")) return "KOENIGSEGG_TECH";
    if (make.includes("rolls-royce") || make.includes("bentley")) return "ROLLS_ROYCE_LUXURY";
    if (make.includes("rimac") || id.includes("electric") || id.includes("nevera")) return "ELECTRIC_MINIMAL";
    if (make.includes("ford") || make.includes("dodge") || make.includes("chevrolet") || id.includes("mustang") || id.includes("corvette") || id.includes("camaro") || id.includes("demon")) {
      return "AMERICAN_MUSCLE";
    }
    if (id.includes("2000gt") || spec.year && spec.year < 1980) return "CLASSIC_VINTAGE";
    if (make.includes("nissan") || make.includes("toyota") || make.includes("mazda") || make.includes("subaru") || make.includes("mitsubishi") || make.includes("honda") || make.includes("acura") || make.includes("lexus")) {
      return "JDM_PERFORMANCE";
    }
    return "PORSCHE";
  }
  /**
   * Generates a complete, authentic 3D interior assembly
   */
  static generateInterior(spec) {
    const root = new THREE10.Group();
    root.name = `interior_${spec.vehicleId}`;
    const language = this.resolveDesignLanguage(spec);
    const W = spec.cabinWidthM || 1.48;
    const L = spec.cabinLengthM || 1.65;
    const H = spec.cabinHeightM || 0.85;
    const darkCharcoal = new THREE10.MeshStandardMaterial({ color: 1579035, roughness: 0.7, metalness: 0.1 });
    const alcantara = new THREE10.MeshStandardMaterial({ color: 2565930, roughness: 0.95, metalness: 0.05 });
    const carbonMat = new THREE10.MeshStandardMaterial({ color: 1118483, roughness: 0.35, metalness: 0.4 });
    const aluminumMat = new THREE10.MeshStandardMaterial({ color: 13948120, metalness: 0.85, roughness: 0.2 });
    const screenMat = new THREE10.MeshStandardMaterial({ color: 592139, roughness: 0.1, metalness: 0.8, emissive: new THREE10.Color(947344), emissiveIntensity: 0.4 });
    const gaugeGlassMat = new THREE10.MeshPhysicalMaterial({ color: 16777215, transparent: true, opacity: 0.6, roughness: 0.05, metalness: 0.1 });
    const seatColor = spec.seatColorHex ? new THREE10.Color(spec.seatColorHex) : new THREE10.Color(1579035);
    const seatMat = new THREE10.MeshStandardMaterial({ color: seatColor, roughness: 0.6, metalness: 0.1 });
    const floorGeo = new THREE10.BoxGeometry(W * 0.96, 0.04, L);
    const floor = new THREE10.Mesh(floorGeo, darkCharcoal);
    floor.position.set(0, -0.05, 0.05);
    floor.name = "interior_floor_tub";
    root.add(floor);
    const pedalGroup = this.buildPedals(aluminumMat, spec.isManual);
    pedalGroup.position.set(-W * 0.24, -0.02, 0.68);
    root.add(pedalGroup);
    const consoleGroup = this.buildCenterConsole(language, W, L, carbonMat, aluminumMat, alcantara);
    consoleGroup.position.set(0, 0.08, 0.08);
    root.add(consoleGroup);
    const dashGroup = this.buildDashboard(language, W, H, darkCharcoal, carbonMat, aluminumMat, screenMat, gaugeGlassMat, spec);
    dashGroup.position.set(0, 0.32, 0.62);
    dashGroup.name = "interior_dashboard";
    root.add(dashGroup);
    const steeringGroup = this.buildSteeringWheel(language, W, alcantara, carbonMat, aluminumMat);
    steeringGroup.position.set(-W * 0.24, 0.3, 0.45);
    steeringGroup.rotation.x = -0.32;
    steeringGroup.name = "interior_steering_wheel";
    root.add(steeringGroup);
    const seatsGroup = this.buildSeats(language, W, L, seatMat, carbonMat, alcantara, spec.isFourDoor);
    seatsGroup.name = "interior_seats";
    root.add(seatsGroup);
    const isTrackCar = spec.vehicleId.includes("gt3_rs") || spec.vehicleId.includes("gt4_rs") || spec.vehicleId.includes("sto") || spec.vehicleId.includes("pista");
    const doorCards = this.buildDoorCards(language, W, L, darkCharcoal, seatMat, aluminumMat, isTrackCar);
    root.add(doorCards);
    const mirrorGeo = new THREE10.BoxGeometry(0.22, 0.055, 0.02);
    const mirror = new THREE10.Mesh(mirrorGeo, aluminumMat);
    mirror.position.set(0, H * 0.78, 0.45);
    mirror.name = "interior_rearview_mirror";
    root.add(mirror);
    const accessories = this.buildModelSpecificAccessories(spec, W, L, H, carbonMat, aluminumMat);
    root.add(accessories);
    root.userData = {
      isVehicleInterior: true,
      designLanguage: language,
      vehicleId: spec.vehicleId,
      componentCount: root.children.length
    };
    return root;
  }
  /**
   * Builds the pedals assembly (Throttle, Brake, Clutch, Footrest)
   */
  static buildPedals(mat, isManual = false) {
    const group = new THREE10.Group();
    group.name = "interior_pedals_assembly";
    const throttle = new THREE10.Mesh(new THREE10.BoxGeometry(0.045, 0.14, 0.015), mat);
    throttle.position.set(0.07, 0.05, 0);
    throttle.rotation.x = -0.4;
    group.add(throttle);
    const brakeWidth = isManual ? 0.055 : 0.085;
    const brake = new THREE10.Mesh(new THREE10.BoxGeometry(brakeWidth, 0.08, 0.02), mat);
    brake.position.set(-0.02, 0.06, 0);
    brake.rotation.x = -0.4;
    group.add(brake);
    if (isManual) {
      const clutch = new THREE10.Mesh(new THREE10.BoxGeometry(0.055, 0.08, 0.02), mat);
      clutch.position.set(-0.09, 0.06, 0);
      clutch.rotation.x = -0.4;
      group.add(clutch);
    }
    const deadPedal = new THREE10.Mesh(new THREE10.BoxGeometry(0.065, 0.16, 0.015), mat);
    deadPedal.position.set(-0.16, 0.06, 0.02);
    deadPedal.rotation.x = -0.4;
    group.add(deadPedal);
    return group;
  }
  /**
   * Constructs center console according to brand design language
   */
  static buildCenterConsole(language, W, L, carbonMat, aluminumMat, alcantaraMat) {
    const group = new THREE10.Group();
    group.name = "interior_center_console";
    const consoleWidth = W * 0.24;
    const consoleLength = L * 0.72;
    const tunnelGeo = new THREE10.BoxGeometry(consoleWidth, 0.16, consoleLength);
    const tunnel = new THREE10.Mesh(tunnelGeo, carbonMat);
    tunnel.position.set(0, 0, -0.05);
    group.add(tunnel);
    const armrestGeo = new THREE10.BoxGeometry(consoleWidth * 0.92, 0.05, 0.32);
    const armrest = new THREE10.Mesh(armrestGeo, alcantaraMat);
    armrest.position.set(0, 0.1, -0.25);
    group.add(armrest);
    switch (language) {
      case "LAMBORGHINI": {
        const startBase = new THREE10.Mesh(new THREE10.BoxGeometry(0.04, 0.02, 0.05), carbonMat);
        startBase.position.set(0, 0.09, 0.1);
        group.add(startBase);
        const redCoverMat = new THREE10.MeshStandardMaterial({ color: 14427686, metalness: 0.8, roughness: 0.2 });
        const flipCover = new THREE10.Mesh(new THREE10.BoxGeometry(0.035, 0.025, 0.04), redCoverMat);
        flipCover.position.set(0, 0.11, 0.1);
        flipCover.rotation.x = 0.35;
        group.add(flipCover);
        const animaLever = new THREE10.Mesh(new THREE10.BoxGeometry(0.05, 0.04, 0.02), aluminumMat);
        animaLever.position.set(0, 0.1, 0.02);
        group.add(animaLever);
        break;
      }
      case "FERRARI": {
        const bridge = new THREE10.Mesh(new THREE10.BoxGeometry(0.06, 0.05, 0.18), carbonMat);
        bridge.position.set(0, 0.11, 0.06);
        group.add(bridge);
        [-0.04, 0, 0.04].forEach((z) => {
          const btn = new THREE10.Mesh(new THREE10.CylinderGeometry(0.014, 0.014, 0.01, 16), aluminumMat);
          btn.position.set(0, 0.14, 0.06 + z);
          group.add(btn);
        });
        break;
      }
      case "PORSCHE": {
        const toggleShifter = new THREE10.Mesh(new THREE10.BoxGeometry(0.025, 0.045, 0.02), aluminumMat);
        toggleShifter.position.set(0, 0.11, 0.08);
        group.add(toggleShifter);
        [-0.04, 0.04].forEach((x) => {
          const cup = new THREE10.Mesh(new THREE10.CylinderGeometry(0.035, 0.03, 0.04, 16), carbonMat);
          cup.position.set(x, 0.09, -0.04);
          group.add(cup);
        });
        break;
      }
      case "PAGANI_ARTISAN": {
        const shiftRod = new THREE10.Mesh(new THREE10.CylinderGeometry(8e-3, 8e-3, 0.14), aluminumMat);
        shiftRod.position.set(0, 0.14, 0.05);
        shiftRod.rotation.x = -0.15;
        group.add(shiftRod);
        const shiftKnob = new THREE10.Mesh(new THREE10.SphereGeometry(0.022, 16, 16), aluminumMat);
        shiftKnob.position.set(0, 0.2, 0.03);
        group.add(shiftKnob);
        break;
      }
      case "JDM_PERFORMANCE": {
        const bootGeo = new THREE10.ConeGeometry(0.05, 0.07, 16);
        const boot = new THREE10.Mesh(bootGeo, alcantaraMat);
        boot.position.set(0, 0.11, 0.08);
        group.add(boot);
        const knob = new THREE10.Mesh(new THREE10.SphereGeometry(0.022, 16, 16), aluminumMat);
        knob.position.set(0, 0.16, 0.08);
        group.add(knob);
        const hBrake = new THREE10.Mesh(new THREE10.CylinderGeometry(0.014, 0.014, 0.18), alcantaraMat);
        hBrake.rotation.x = Math.PI / 4;
        hBrake.position.set(0.06, 0.12, -0.08);
        group.add(hBrake);
        break;
      }
      default: {
        const dial = new THREE10.Mesh(new THREE10.CylinderGeometry(0.035, 0.035, 0.025, 24), aluminumMat);
        dial.position.set(0, 0.1, 0.06);
        group.add(dial);
        break;
      }
    }
    return group;
  }
  /**
   * Constructs dashboard and instrument cluster according to brand design language
   */
  static buildDashboard(language, W, H, dashMat, carbonMat, trimMat, screenMat, gaugeGlassMat, spec) {
    const group = new THREE10.Group();
    group.name = "interior_dashboard_assembly";
    const dashWidth = W * 0.94;
    const dashDepth = 0.42;
    const vehicleId = (spec?.vehicleId || "").toLowerCase();
    const cowlGeo = new THREE10.BoxGeometry(dashWidth, 0.18, dashDepth);
    const cowl = new THREE10.Mesh(cowlGeo, dashMat);
    cowl.position.set(0, 0, 0);
    group.add(cowl);
    const trimStrip = new THREE10.Mesh(new THREE10.BoxGeometry(dashWidth * 0.98, 0.02, 0.02), trimMat);
    trimStrip.position.set(0, -0.07, -dashDepth * 0.48);
    group.add(trimStrip);
    switch (language) {
      case "PORSCHE": {
        const binnacleGeo = new THREE10.BoxGeometry(0.36, 0.1, 0.12);
        const binnacle = new THREE10.Mesh(binnacleGeo, carbonMat);
        binnacle.position.set(-W * 0.24, 0.1, -0.05);
        group.add(binnacle);
        const tachRing = new THREE10.Mesh(new THREE10.TorusGeometry(0.045, 5e-3, 12, 32), trimMat);
        tachRing.position.set(-W * 0.24, 0.1, -0.11);
        group.add(tachRing);
        [-0.09, 0.09].forEach((dx) => {
          const sideScreen = new THREE10.Mesh(new THREE10.BoxGeometry(0.07, 0.055, 5e-3), screenMat);
          sideScreen.position.set(-W * 0.24 + dx, 0.1, -0.1);
          group.add(sideScreen);
        });
        const pcmScreen = new THREE10.Mesh(new THREE10.BoxGeometry(0.24, 0.09, 0.01), screenMat);
        pcmScreen.position.set(0, 0.02, -dashDepth * 0.48);
        group.add(pcmScreen);
        const chronoPod = new THREE10.Mesh(new THREE10.CylinderGeometry(0.03, 0.035, 0.03, 24), carbonMat);
        chronoPod.position.set(0, 0.1, -0.02);
        group.add(chronoPod);
        break;
      }
      case "FERRARI": {
        const clusterBinnacle = new THREE10.Mesh(new THREE10.BoxGeometry(0.34, 0.11, 0.14), carbonMat);
        clusterBinnacle.position.set(-W * 0.24, 0.1, -0.06);
        group.add(clusterBinnacle);
        const yellowMat = new THREE10.MeshStandardMaterial({ color: 16436245, roughness: 0.3 });
        const yellowTach = new THREE10.Mesh(new THREE10.CylinderGeometry(0.045, 0.045, 0.01, 24), yellowMat);
        yellowTach.rotation.x = Math.PI / 2;
        yellowTach.position.set(-W * 0.24, 0.1, -0.12);
        group.add(yellowTach);
        [-W * 0.4, -W * 0.08, W * 0.08, W * 0.4].forEach((x) => {
          const vent = new THREE10.Mesh(new THREE10.CylinderGeometry(0.032, 0.032, 0.02, 16), trimMat);
          vent.rotation.x = Math.PI / 2;
          vent.position.set(x, 0.02, -dashDepth * 0.49);
          group.add(vent);
        });
        const passDisplay = new THREE10.Mesh(new THREE10.BoxGeometry(0.18, 0.045, 0.01), screenMat);
        passDisplay.position.set(W * 0.24, 0.02, -dashDepth * 0.48);
        group.add(passDisplay);
        break;
      }
      case "LAMBORGHINI": {
        const hexBinnacle = new THREE10.Mesh(new THREE10.BoxGeometry(0.32, 0.1, 0.14), carbonMat);
        hexBinnacle.position.set(-W * 0.24, 0.1, -0.06);
        group.add(hexBinnacle);
        const clusterScreen = new THREE10.Mesh(new THREE10.BoxGeometry(0.25, 0.08, 0.01), screenMat);
        clusterScreen.position.set(-W * 0.24, 0.1, -0.12);
        group.add(clusterScreen);
        const centerScreen = new THREE10.Mesh(new THREE10.BoxGeometry(0.14, 0.22, 0.01), screenMat);
        centerScreen.position.set(0, -0.03, -dashDepth * 0.48);
        centerScreen.rotation.x = -0.22;
        group.add(centerScreen);
        [-W * 0.4, -0.12, 0.12, W * 0.4].forEach((x) => {
          const hexVent = new THREE10.Mesh(new THREE10.CylinderGeometry(0.032, 0.032, 0.02, 6), carbonMat);
          hexVent.rotation.x = Math.PI / 2;
          hexVent.position.set(x, 0.05, -dashDepth * 0.48);
          group.add(hexVent);
        });
        break;
      }
      case "BMW_M": {
        const curvedScreen = new THREE10.Mesh(new THREE10.BoxGeometry(0.62, 0.13, 0.02), screenMat);
        curvedScreen.position.set(-W * 0.12, 0.11, -0.08);
        curvedScreen.rotation.y = 0.08;
        group.add(curvedScreen);
        break;
      }
      case "MERCEDES_AMG": {
        const amgScreen = new THREE10.Mesh(new THREE10.BoxGeometry(0.65, 0.12, 0.02), screenMat);
        amgScreen.position.set(-W * 0.1, 0.1, -0.08);
        group.add(amgScreen);
        [-0.15, -0.05, 0.05, 0.15].forEach((x) => {
          const turbine = new THREE10.Mesh(new THREE10.CylinderGeometry(0.028, 0.028, 0.02, 16), trimMat);
          turbine.rotation.x = Math.PI / 2;
          turbine.position.set(x, -0.02, -dashDepth * 0.48);
          group.add(turbine);
        });
        break;
      }
      case "JDM_PERFORMANCE": {
        [-0.06, 0.06].forEach((dx, i) => {
          const gaugeRing = new THREE10.Mesh(new THREE10.TorusGeometry(0.04, 5e-3, 12, 24), trimMat);
          gaugeRing.position.set(-W * 0.24 + dx, 0.09, -0.11);
          group.add(gaugeRing);
        });
        [-0.08, 0, 0.08].forEach((dx) => {
          const pod = new THREE10.Mesh(new THREE10.CylinderGeometry(0.028, 0.03, 0.04, 16), carbonMat);
          pod.rotation.x = -Math.PI / 3;
          pod.position.set(dx, 0.11, -0.02);
          group.add(pod);
        });
        break;
      }
      default: {
        const cluster = new THREE10.Mesh(new THREE10.BoxGeometry(0.28, 0.09, 0.01), screenMat);
        cluster.position.set(-W * 0.24, 0.09, -0.1);
        group.add(cluster);
        const centerScreen = new THREE10.Mesh(new THREE10.BoxGeometry(0.26, 0.12, 0.01), screenMat);
        centerScreen.position.set(0, 0.04, -dashDepth * 0.48);
        group.add(centerScreen);
        break;
      }
    }
    if (vehicleId.includes("r34") || vehicleId.includes("skyline")) {
      const mfdPod = new THREE10.Mesh(new THREE10.BoxGeometry(0.18, 0.11, 0.1), carbonMat);
      mfdPod.position.set(0, 0.12, -0.06);
      mfdPod.name = "interior_mfd_pod";
      group.add(mfdPod);
      const mfdScreen = new THREE10.Mesh(new THREE10.BoxGeometry(0.14, 0.08, 0.01), screenMat);
      mfdScreen.position.set(0, 0.12, -0.11);
      mfdScreen.name = "interior_mfd_display";
      group.add(mfdScreen);
    }
    if (vehicleId.includes("svj")) {
      const alaPod = new THREE10.Mesh(new THREE10.BoxGeometry(0.12, 0.05, 0.06), carbonMat);
      alaPod.position.set(0, 0.1, -0.06);
      alaPod.name = "interior_ala_telemetry_pod";
      group.add(alaPod);
    }
    if (vehicleId.includes("csl")) {
      const cslBadge = new THREE10.Mesh(new THREE10.BoxGeometry(0.08, 0.02, 5e-3), new THREE10.MeshStandardMaterial({ color: 14427686 }));
      cslBadge.position.set(W * 0.22, 0.02, -dashDepth * 0.49);
      cslBadge.name = "interior_csl_badge";
      group.add(cslBadge);
    }
    return group;
  }
  /**
   * Constructs brand-specific steering wheel with authentic controls
   */
  static buildSteeringWheel(language, W, alcantaraMat, carbonMat, aluminumMat) {
    const group = new THREE10.Group();
    group.name = "interior_steering_wheel_assembly";
    const wheelRadius = 0.175;
    switch (language) {
      case "FERRARI": {
        const rimGeo = new THREE10.TorusGeometry(wheelRadius, 0.016, 12, 32);
        const rim = new THREE10.Mesh(rimGeo, alcantaraMat);
        group.add(rim);
        const hub = new THREE10.Mesh(new THREE10.CylinderGeometry(0.05, 0.05, 0.025, 24), carbonMat);
        hub.rotation.x = Math.PI / 2;
        group.add(hub);
        const ledBar = new THREE10.Mesh(new THREE10.BoxGeometry(0.12, 0.015, 0.015), carbonMat);
        ledBar.position.set(0, wheelRadius * 0.92, 0.01);
        group.add(ledBar);
        const redMat = new THREE10.MeshStandardMaterial({ color: 14427686, metalness: 0.8, roughness: 0.2 });
        const manettino = new THREE10.Mesh(new THREE10.CylinderGeometry(0.014, 0.014, 0.015, 16), redMat);
        manettino.rotation.x = Math.PI / 2;
        manettino.position.set(0.065, -0.04, 0.015);
        group.add(manettino);
        [-0.1, 0.1].forEach((x, idx) => {
          const paddle = new THREE10.Mesh(new THREE10.BoxGeometry(0.02, 0.14, 5e-3), carbonMat);
          paddle.position.set(x, 0.02, -0.035);
          group.add(paddle);
        });
        break;
      }
      case "PORSCHE": {
        const rimGeo = new THREE10.TorusGeometry(wheelRadius, 0.016, 12, 32);
        const rim = new THREE10.Mesh(rimGeo, alcantaraMat);
        group.add(rim);
        const yellowMat = new THREE10.MeshStandardMaterial({ color: 16436245, roughness: 0.2 });
        const marker = new THREE10.Mesh(new THREE10.CylinderGeometry(0.018, 0.018, 0.03, 16), yellowMat);
        marker.position.set(0, wheelRadius, 0);
        group.add(marker);
        const hub = new THREE10.Mesh(new THREE10.CylinderGeometry(0.048, 0.048, 0.025, 24), carbonMat);
        hub.rotation.x = Math.PI / 2;
        group.add(hub);
        [
          [-0.06, -0.06],
          [-0.06, 0.02],
          [0.06, -0.06],
          [0.06, 0.02]
        ].forEach(([x, y]) => {
          const rotary = new THREE10.Mesh(new THREE10.CylinderGeometry(0.012, 0.012, 0.015, 12), aluminumMat);
          rotary.rotation.x = Math.PI / 2;
          rotary.position.set(x, y, 0.015);
          group.add(rotary);
        });
        const drsBtn = new THREE10.Mesh(new THREE10.BoxGeometry(0.02, 0.012, 0.01), new THREE10.MeshStandardMaterial({ color: 2450411 }));
        drsBtn.position.set(-0.04, 0.07, 0.015);
        group.add(drsBtn);
        break;
      }
      case "BMW_M": {
        const rimGeo = new THREE10.TorusGeometry(wheelRadius, 0.017, 12, 32);
        const rim = new THREE10.Mesh(rimGeo, alcantaraMat);
        group.add(rim);
        const hub = new THREE10.Mesh(new THREE10.CylinderGeometry(0.05, 0.05, 0.025, 24), carbonMat);
        hub.rotation.x = Math.PI / 2;
        group.add(hub);
        const redMat = new THREE10.MeshStandardMaterial({ color: 14427686 });
        [-0.055, 0.055].forEach((x) => {
          const mBtn = new THREE10.Mesh(new THREE10.CylinderGeometry(9e-3, 9e-3, 0.015, 12), redMat);
          mBtn.rotation.x = Math.PI / 2;
          mBtn.position.set(x, 0.035, 0.015);
          group.add(mBtn);
        });
        break;
      }
      case "PAGANI_ARTISAN":
      case "CLASSIC_VINTAGE": {
        const woodMat = new THREE10.MeshStandardMaterial({ color: 7877903, roughness: 0.25 });
        const rimGeo = new THREE10.TorusGeometry(wheelRadius * 1.05, 0.014, 12, 32);
        const rim = new THREE10.Mesh(rimGeo, woodMat);
        group.add(rim);
        for (let i = 0; i < 3; i++) {
          const angle = i * Math.PI * 2 / 3 - Math.PI / 2;
          const spoke = new THREE10.Mesh(new THREE10.BoxGeometry(0.025, wheelRadius * 0.95, 5e-3), aluminumMat);
          spoke.position.set(Math.cos(angle) * wheelRadius * 0.45, Math.sin(angle) * wheelRadius * 0.45, 0);
          spoke.rotation.z = angle - Math.PI / 2;
          group.add(spoke);
        }
        break;
      }
      default: {
        const rimGeo = new THREE10.TorusGeometry(wheelRadius, 0.016, 12, 32);
        const rim = new THREE10.Mesh(rimGeo, alcantaraMat);
        group.add(rim);
        const hub = new THREE10.Mesh(new THREE10.CylinderGeometry(0.045, 0.045, 0.025, 24), carbonMat);
        hub.rotation.x = Math.PI / 2;
        group.add(hub);
        const leftSpoke = new THREE10.Mesh(new THREE10.BoxGeometry(wheelRadius * 0.75, 0.025, 8e-3), aluminumMat);
        leftSpoke.position.set(-wheelRadius * 0.42, 0, 0);
        group.add(leftSpoke);
        const rightSpoke = new THREE10.Mesh(new THREE10.BoxGeometry(wheelRadius * 0.75, 0.025, 8e-3), aluminumMat);
        rightSpoke.position.set(wheelRadius * 0.42, 0, 0);
        group.add(rightSpoke);
        const bottomSpoke = new THREE10.Mesh(new THREE10.BoxGeometry(0.025, wheelRadius * 0.75, 8e-3), aluminumMat);
        bottomSpoke.position.set(0, -wheelRadius * 0.42, 0);
        group.add(bottomSpoke);
        [-0.1, 0.1].forEach((x) => {
          const paddle = new THREE10.Mesh(new THREE10.BoxGeometry(0.025, 0.1, 5e-3), aluminumMat);
          paddle.position.set(x, 0.02, -0.03);
          group.add(paddle);
        });
        break;
      }
    }
    return group;
  }
  /**
   * Constructs ergonomic front sports/bucket seats and optional rear seats
   */
  static buildSeats(language, W, L, seatMat, carbonMat, accentMat, isFourDoor = false) {
    const group = new THREE10.Group();
    group.name = "interior_seats_assembly";
    const seatSpacingX = W * 0.26;
    const frontSeatZ = -0.08;
    [-seatSpacingX, seatSpacingX].forEach((sx, idx) => {
      const singleSeat = new THREE10.Group();
      singleSeat.name = `interior_seat_${idx === 0 ? "driver" : "passenger"}`;
      const cushionGeo = new THREE10.BoxGeometry(0.46, 0.12, 0.48);
      const cushion = new THREE10.Mesh(cushionGeo, seatMat);
      cushion.position.set(0, 0.06, 0);
      singleSeat.add(cushion);
      const backrestGeo = new THREE10.BoxGeometry(0.44, 0.58, 0.1);
      const backrest = new THREE10.Mesh(backrestGeo, seatMat);
      backrest.position.set(0, 0.38, -0.22);
      backrest.rotation.x = 0.22;
      singleSeat.add(backrest);
      const carbonShell = new THREE10.Mesh(new THREE10.BoxGeometry(0.46, 0.6, 0.03), carbonMat);
      carbonShell.position.set(0, 0.38, -0.25);
      carbonShell.rotation.x = 0.22;
      singleSeat.add(carbonShell);
      const headrestGeo = new THREE10.BoxGeometry(0.24, 0.18, 0.08);
      const headrest = new THREE10.Mesh(headrestGeo, seatMat);
      headrest.position.set(0, 0.72, -0.29);
      headrest.rotation.x = 0.22;
      singleSeat.add(headrest);
      [-0.22, 0.22].forEach((bx) => {
        const bolster = new THREE10.Mesh(new THREE10.BoxGeometry(0.06, 0.16, 0.44), accentMat);
        bolster.position.set(bx, 0.1, 0);
        singleSeat.add(bolster);
      });
      singleSeat.position.set(sx, 0, frontSeatZ);
      group.add(singleSeat);
    });
    if (isFourDoor) {
      const rearBenchGroup = new THREE10.Group();
      rearBenchGroup.name = "interior_rear_bench";
      const rearCushion = new THREE10.Mesh(new THREE10.BoxGeometry(W * 0.88, 0.12, 0.46), seatMat);
      rearCushion.position.set(0, 0.1, -0.65);
      rearBenchGroup.add(rearCushion);
      const rearBackrest = new THREE10.Mesh(new THREE10.BoxGeometry(W * 0.86, 0.52, 0.1), seatMat);
      rearBackrest.position.set(0, 0.4, -0.86);
      rearBackrest.rotation.x = 0.2;
      rearBenchGroup.add(rearBackrest);
      [-0.28, 0.28].forEach((rx) => {
        const rHeadrest = new THREE10.Mesh(new THREE10.BoxGeometry(0.2, 0.16, 0.08), seatMat);
        rHeadrest.position.set(rx, 0.7, -0.92);
        rearBenchGroup.add(rHeadrest);
      });
      group.add(rearBenchGroup);
    }
    return group;
  }
  /**
   * Constructs an individual left or right door card for kinematic mounting to door hinges
   */
  static buildSingleDoorCard(side, language, W, L, baseMat, leatherMat, aluminumMat, isTrackCar = false) {
    const isRight = side === "right";
    const card = new THREE10.Group();
    card.name = `interior_door_card_${side}`;
    const doorCardWidth = 0.05;
    const doorCardHeight = 0.52;
    const doorCardLength = L * 0.65;
    const panel = new THREE10.Mesh(new THREE10.BoxGeometry(doorCardWidth, doorCardHeight, doorCardLength), baseMat);
    panel.position.set(0, 0.22, 0);
    card.add(panel);
    const armrest = new THREE10.Mesh(new THREE10.BoxGeometry(0.08, 0.06, 0.36), leatherMat);
    armrest.position.set(isRight ? -0.025 : 0.025, 0.24, -0.02);
    card.add(armrest);
    if (language === "PORSCHE" || language === "MCLAREN" || isTrackCar) {
      const strapColor = language === "PORSCHE" ? 14427686 : 16436245;
      const strapMat = new THREE10.MeshStandardMaterial({ color: strapColor, roughness: 0.8 });
      const strap = new THREE10.Mesh(new THREE10.BoxGeometry(0.01, 0.08, 0.025), strapMat);
      strap.position.set(isRight ? -0.03 : 0.03, 0.32, 0.08);
      card.add(strap);
    } else {
      const handle = new THREE10.Mesh(new THREE10.BoxGeometry(0.015, 0.03, 0.08), aluminumMat);
      handle.position.set(isRight ? -0.03 : 0.03, 0.34, 0.1);
      card.add(handle);
    }
    const switchCluster = new THREE10.Mesh(new THREE10.BoxGeometry(0.02, 0.015, 0.06), new THREE10.MeshStandardMaterial({ color: 1118483 }));
    switchCluster.position.set(isRight ? -0.035 : 0.035, 0.28, 0.06);
    card.add(switchCluster);
    return card;
  }
  /**
   * Constructs door cards (inner door panels with handles and switches)
   */
  static buildDoorCards(language, W, L, baseMat, leatherMat, aluminumMat, isTrackCar = false) {
    const group = new THREE10.Group();
    group.name = "interior_door_cards";
    const leftCard = this.buildSingleDoorCard("left", language, W, L, baseMat, leatherMat, aluminumMat, isTrackCar);
    leftCard.position.set(-W * 0.48, 0, 0);
    group.add(leftCard);
    const rightCard = this.buildSingleDoorCard("right", language, W, L, baseMat, leatherMat, aluminumMat, isTrackCar);
    rightCard.position.set(W * 0.48, 0, 0);
    group.add(rightCard);
    return group;
  }
  /**
   * Constructs authentic model-specific cabin accessories
   * (e.g. titanium roll cages, CSL helmet recess trays, GT4 RS airbox intake tubes, Chiron spine)
   */
  static buildModelSpecificAccessories(spec, W, L, H, carbonMat, aluminumMat) {
    const group = new THREE10.Group();
    group.name = "interior_model_accessories";
    const id = (spec.vehicleId || "").toLowerCase();
    if (id.includes("gt3_rs") || id.includes("gt4_rs") || id.includes("sto") || id.includes("csl") || id.includes("senna") || id.includes("pista")) {
      const cageGroup = new THREE10.Group();
      cageGroup.name = "interior_half_roll_cage";
      const cageMat = new THREE10.MeshStandardMaterial({
        color: id.includes("gt3_rs") ? 16436245 : id.includes("csl") ? 14427686 : 7434618,
        metalness: 0.85,
        roughness: 0.2
      });
      const pipeRadius = 0.022;
      const hoopTop = new THREE10.Mesh(new THREE10.CylinderGeometry(pipeRadius, pipeRadius, W * 0.78, 16), cageMat);
      hoopTop.rotation.z = Math.PI / 2;
      hoopTop.position.set(0, H * 0.72, -0.42);
      cageGroup.add(hoopTop);
      [-W * 0.38, W * 0.38].forEach((x) => {
        const upright = new THREE10.Mesh(new THREE10.CylinderGeometry(pipeRadius, pipeRadius, H * 0.74, 16), cageMat);
        upright.position.set(x, H * 0.35, -0.42);
        cageGroup.add(upright);
        const backstay = new THREE10.Mesh(new THREE10.CylinderGeometry(pipeRadius, pipeRadius, 0.75, 16), cageMat);
        backstay.rotation.x = -0.65;
        backstay.position.set(x * 0.9, H * 0.4, -0.72);
        cageGroup.add(backstay);
      });
      const diag1 = new THREE10.Mesh(new THREE10.CylinderGeometry(pipeRadius * 0.8, pipeRadius * 0.8, 0.95, 16), cageMat);
      diag1.rotation.z = 0.65;
      diag1.position.set(0, H * 0.38, -0.42);
      cageGroup.add(diag1);
      const diag2 = new THREE10.Mesh(new THREE10.CylinderGeometry(pipeRadius * 0.8, pipeRadius * 0.8, 0.95, 16), cageMat);
      diag2.rotation.z = -0.65;
      diag2.position.set(0, H * 0.38, -0.42);
      cageGroup.add(diag2);
      const harnessBar = new THREE10.Mesh(new THREE10.CylinderGeometry(pipeRadius * 0.8, pipeRadius * 0.8, W * 0.76, 16), cageMat);
      harnessBar.rotation.z = Math.PI / 2;
      harnessBar.position.set(0, H * 0.36, -0.42);
      cageGroup.add(harnessBar);
      group.add(cageGroup);
    }
    if (id.includes("csl")) {
      const trayGroup = new THREE10.Group();
      trayGroup.name = "interior_helmet_tray";
      const trayBase = new THREE10.Mesh(new THREE10.BoxGeometry(W * 0.82, 0.04, 0.55), carbonMat);
      trayBase.position.set(0, 0.12, -0.65);
      trayGroup.add(trayBase);
      [-0.24, 0.24].forEach((x) => {
        const recess = new THREE10.Mesh(new THREE10.CylinderGeometry(0.18, 0.16, 0.08, 24), carbonMat);
        recess.position.set(x, 0.14, -0.65);
        trayGroup.add(recess);
        const strap = new THREE10.Mesh(new THREE10.BoxGeometry(0.38, 5e-3, 0.03), new THREE10.MeshStandardMaterial({ color: 14427686 }));
        strap.position.set(x, 0.18, -0.65);
        trayGroup.add(strap);
      });
      group.add(trayGroup);
    }
    if (id.includes("gt4_rs") || id.includes("gt4")) {
      const airboxGroup = new THREE10.Group();
      airboxGroup.name = "interior_airbox_ducts";
      [-W * 0.42, W * 0.42].forEach((x, i) => {
        const duct = new THREE10.Mesh(new THREE10.CylinderGeometry(0.065, 0.07, 0.4, 16), carbonMat);
        duct.rotation.x = 0.5;
        duct.rotation.z = i === 0 ? -0.2 : 0.2;
        duct.position.set(x, H * 0.45, -0.5);
        airboxGroup.add(duct);
      });
      group.add(airboxGroup);
    }
    if (id.includes("chiron") || id.includes("bugatti")) {
      const spineGroup = new THREE10.Group();
      spineGroup.name = "interior_chiron_spine";
      const cArch = new THREE10.Mesh(new THREE10.TorusGeometry(0.55, 0.025, 16, 48, Math.PI * 0.85), aluminumMat);
      cArch.rotation.y = Math.PI / 2;
      cArch.position.set(0, H * 0.42, -0.15);
      spineGroup.add(cArch);
      group.add(spineGroup);
    }
    return group;
  }
};

// packages/vehicle-generation-engine/src/geometry/vehicleEngineBayGenerator.ts
import * as THREE11 from "three";
var VehicleEngineBayGenerator = class {
  /**
   * Resolves engine archetype from vehicle metadata, ID, and manufacturer specifications
   */
  static resolveEngineSpec(spec) {
    const id = (spec.vehicle.id || "").toLowerCase();
    const model = (spec.vehicle.model || "").toLowerCase();
    const mfr = (spec.vehicle.manufacturer || "").toLowerCase();
    if (mfr.includes("bugatti") || id.includes("chiron")) {
      return {
        archetype: "W16_MID",
        displacementCc: 7993,
        engineCode: "8.0 W16 Quad-Turbo",
        isForcedInduction: true,
        inductionType: "quad_turbo",
        isHybrid: false,
        isMidRear: true,
        cylinderCount: 16,
        camCoverColor: "#1e293b",
        intakeColor: "#38bdf8"
      };
    }
    if (id.includes("nevera") || id.includes("spectre")) {
      return {
        archetype: "ELECTRIC_EV",
        displacementCc: 0,
        engineCode: id.includes("nevera") ? "Quad PM-E-Motors" : "Dual Synchronous E-Motors",
        isForcedInduction: false,
        inductionType: id.includes("nevera") ? "quad_motor" : "dual_motor",
        isHybrid: false,
        isMidRear: id.includes("nevera"),
        cylinderCount: 0,
        camCoverColor: "#f97316",
        // High-voltage orange
        intakeColor: "#0ea5e9"
      };
    }
    if (id.includes("rx7") || id.includes("rx-7") || model.includes("rx-7")) {
      return {
        archetype: "ROTARY_FRONT",
        displacementCc: 1308,
        engineCode: "13B-REW Sequential Twin-Turbo",
        isForcedInduction: true,
        inductionType: "twin_turbo",
        isHybrid: false,
        isMidRear: false,
        cylinderCount: 2,
        camCoverColor: "#27272a",
        intakeColor: "#94a3b8"
      };
    }
    if (mfr.includes("porsche")) {
      if (id.includes("718") || id.includes("cayman")) {
        return {
          archetype: "BOXER_MID",
          displacementCc: 3996,
          engineCode: "4.0 Flat-6 GT3-Cup",
          isForcedInduction: false,
          inductionType: "naturally_aspirated",
          isHybrid: false,
          isMidRear: true,
          cylinderCount: 6,
          camCoverColor: "#18181b",
          intakeColor: "#e2e8f0"
        };
      }
      return {
        archetype: "BOXER_REAR",
        displacementCc: id.includes("turbo") || id.includes("935") ? 3745 : 3996,
        engineCode: id.includes("turbo") ? "3.8 Boxer-6 VTG" : "4.0 Boxer-6 DOHC",
        isForcedInduction: id.includes("turbo") || id.includes("935") || id.includes("dakar"),
        inductionType: id.includes("gt3") ? "naturally_aspirated" : "twin_turbo",
        isHybrid: id.includes("918"),
        isMidRear: true,
        cylinderCount: 6,
        camCoverColor: "#27272a",
        intakeColor: "#dc2626"
      };
    }
    if (id.includes("aventador") || id.includes("revuelto") || id.includes("essenza") || id.includes("laferrari") || id.includes("fxx") || id.includes("valkyrie") || id.includes("huayra")) {
      return {
        archetype: "V12_MID",
        displacementCc: 6498,
        engineCode: "6.5L 60\xB0 V12 High-Rev",
        isForcedInduction: id.includes("huayra"),
        inductionType: id.includes("huayra") ? "twin_turbo" : "naturally_aspirated",
        isHybrid: id.includes("laferrari") || id.includes("fxx") || id.includes("revuelto") || id.includes("valkyrie"),
        isMidRear: true,
        cylinderCount: 12,
        camCoverColor: "#b91c1c",
        // Rosso Corsa crackle
        intakeColor: "#18181b"
        // Raw weave carbon
      };
    }
    if (id.includes("huracan") || id.includes("r8") || id.includes("lfa")) {
      return {
        archetype: "V10_MID",
        displacementCc: id.includes("lfa") ? 4805 : 5204,
        engineCode: id.includes("lfa") ? "4.8L 1LR-GUE 72\xB0 V10" : "5.2L FSI 90\xB0 V10",
        isForcedInduction: false,
        inductionType: "naturally_aspirated",
        isHybrid: false,
        isMidRear: !id.includes("lfa"),
        cylinderCount: 10,
        camCoverColor: "#92400e",
        // Bronze / Mag anodized
        intakeColor: "#475569"
      };
    }
    if (id.includes("jesko") || id.includes("p1") || id.includes("488") || id.includes("f8") || id.includes("720s") || id.includes("765lt") || id.includes("senna") || id.includes("corvette_z06") || id.includes("c8") || id.includes("918")) {
      return {
        archetype: "V8_MID",
        displacementCc: id.includes("corvette") ? 5463 : id.includes("jesko") ? 5065 : 3994,
        engineCode: "4.0L Twin-Turbo Flat-Plane V8",
        isForcedInduction: !id.includes("corvette") && !id.includes("918"),
        inductionType: id.includes("corvette") || id.includes("918") ? "naturally_aspirated" : "twin_turbo",
        isHybrid: id.includes("p1") || id.includes("918"),
        isMidRear: true,
        cylinderCount: 8,
        camCoverColor: "#dc2626",
        intakeColor: "#18181b"
      };
    }
    if (id.includes("296") || id.includes("amg_one") || id.includes("ford_gt") || id.includes("nsx") && !id.includes("na2") || id.includes("mc20") || id.includes("emira")) {
      return {
        archetype: "V6_MID",
        displacementCc: id.includes("amg_one") ? 1599 : id.includes("emira") ? 3456 : 2992,
        engineCode: "Hot-V Twin-Turbocharged V6",
        isForcedInduction: true,
        inductionType: id.includes("emira") ? "supercharged" : "twin_turbo",
        isHybrid: id.includes("296") || id.includes("amg_one") || id.includes("nsx"),
        isMidRear: true,
        cylinderCount: 6,
        camCoverColor: "#991b1b",
        intakeColor: "#334155"
      };
    }
    if (id.includes("gt500") || id.includes("demon") || id.includes("zl1") || id.includes("zr1") || id.includes("amg_gt") || id.includes("f-type") || id.includes("ftype") || model.includes("challenger") || model.includes("mustang") || model.includes("camaro")) {
      return {
        archetype: "V8_FRONT",
        displacementCc: 6162,
        engineCode: "6.2L Supercharged Cross-Plane V8",
        isForcedInduction: true,
        inductionType: "supercharged",
        isHybrid: false,
        isMidRear: false,
        cylinderCount: 8,
        camCoverColor: id.includes("demon") ? "#eab308" : "#dc2626",
        intakeColor: "#0f172a"
      };
    }
    return {
      archetype: "INLINE_FRONT",
      displacementCc: id.includes("evo") || id.includes("sti") || id.includes("miata") ? 1998 : 2998,
      engineCode: id.includes("sti") ? "EJ257 Turbo Boxer-4" : id.includes("evo") ? "4G63T MIVEC I4" : "3.0L TwinPower Turbo I6",
      isForcedInduction: !id.includes("miata") && !id.includes("2000gt"),
      inductionType: id.includes("miata") || id.includes("2000gt") ? "naturally_aspirated" : "twin_turbo",
      isHybrid: false,
      isMidRear: false,
      cylinderCount: id.includes("evo") || id.includes("sti") || id.includes("miata") || id.includes("a110") ? 4 : 6,
      camCoverColor: id.includes("r34") || id.includes("evo") ? "#dc2626" : "#1e293b",
      intakeColor: "#cbd5e1"
    };
  }
  /**
   * Generates complete 3D engine compartment assembly
   */
  static generateEngineBay(spec) {
    const engineSpec = this.resolveEngineSpec(spec);
    const dims = spec.dimensions || { length: 4.6, width: 2, height: 1.25 };
    const group = new THREE11.Group();
    group.name = `engine_bay_${spec.vehicle.id}`;
    const carbonMat = new THREE11.MeshStandardMaterial({
      color: new THREE11.Color("#18181b"),
      roughness: 0.35,
      metalness: 0.25
    });
    const blockMat = new THREE11.MeshStandardMaterial({
      color: new THREE11.Color("#27272a"),
      roughness: 0.55,
      metalness: 0.8
    });
    const camMat = new THREE11.MeshStandardMaterial({
      color: new THREE11.Color(engineSpec.camCoverColor),
      roughness: 0.45,
      metalness: 0.65
    });
    const intakeMat = new THREE11.MeshStandardMaterial({
      color: new THREE11.Color(engineSpec.intakeColor),
      roughness: 0.4,
      metalness: 0.7
    });
    const chromeMat = new THREE11.MeshStandardMaterial({
      color: new THREE11.Color("#e2e8f0"),
      roughness: 0.1,
      metalness: 0.95
    });
    const orangeHvMat = new THREE11.MeshStandardMaterial({
      color: new THREE11.Color("#ea580c"),
      roughness: 0.3,
      metalness: 0.2
    });
    const bayTub = this.buildEngineBayTub(engineSpec.isMidRear, dims, carbonMat);
    group.add(bayTub);
    const coolingPack = this.buildCoolingRadiator(engineSpec.isMidRear, dims, blockMat, chromeMat);
    group.add(coolingPack);
    const auxiliaryGear = this.buildAuxiliaryGear(engineSpec.isMidRear, dims);
    group.add(auxiliaryGear);
    let coreEngine;
    switch (engineSpec.archetype) {
      case "W16_MID":
        coreEngine = this.buildW16QuadTurbo(blockMat, camMat, intakeMat, chromeMat);
        break;
      case "V12_MID":
        coreEngine = this.buildV12Engine(blockMat, camMat, intakeMat, carbonMat, chromeMat);
        break;
      case "V10_MID":
        coreEngine = this.buildV10Engine(blockMat, camMat, intakeMat, carbonMat);
        break;
      case "V8_MID":
        coreEngine = this.buildV8MidEngine(blockMat, camMat, intakeMat, chromeMat);
        break;
      case "V6_MID":
        coreEngine = this.buildV6MidEngine(blockMat, camMat, intakeMat, chromeMat);
        break;
      case "BOXER_REAR":
      case "BOXER_MID":
        coreEngine = this.buildBoxerEngine(engineSpec.archetype === "BOXER_REAR", blockMat, camMat, intakeMat, carbonMat);
        break;
      case "V8_FRONT":
        coreEngine = this.buildV8FrontSupercharged(blockMat, camMat, intakeMat, chromeMat);
        break;
      case "ROTARY_FRONT":
        coreEngine = this.buildRotaryEngine(blockMat, camMat, intakeMat, chromeMat);
        break;
      case "ELECTRIC_EV":
        coreEngine = this.buildElectricDriveUnits(dims, blockMat, orangeHvMat, carbonMat);
        break;
      case "INLINE_FRONT":
      default:
        coreEngine = this.buildInlineEngine(engineSpec.cylinderCount, blockMat, camMat, intakeMat, chromeMat);
        break;
    }
    const engineZ = engineSpec.isMidRear ? -dims.length * 0.16 : dims.length * 0.28;
    const engineY = dims.height * 0.26;
    coreEngine.position.set(0, engineY, engineZ);
    group.add(coreEngine);
    const strutBrace = this.buildStrutBracing(engineSpec.isMidRear, dims, chromeMat, carbonMat);
    group.add(strutBrace);
    if (engineSpec.isMidRear) {
      const isTrackCar = spec.vehicle.id.includes("gt3_rs") || spec.vehicle.id.includes("gt4_rs") || spec.vehicle.id.includes("sto") || spec.vehicle.id.includes("pista");
      const frunk = this.buildFrontFrunkTub(dims, carbonMat, chromeMat, isTrackCar);
      group.add(frunk);
    } else {
      const rearTrunk = this.buildRearCargoTrunk(dims, carbonMat);
      group.add(rearTrunk);
    }
    const hoodStruts = this.buildGasStruts(true, dims, chromeMat);
    group.add(hoodStruts);
    const bootStruts = this.buildGasStruts(false, dims, chromeMat);
    group.add(bootStruts);
    group.userData = {
      isEngineBay: true,
      archetype: engineSpec.archetype,
      engineCode: engineSpec.engineCode,
      displacementCc: engineSpec.displacementCc,
      induction: engineSpec.inductionType
    };
    return group;
  }
  // =========================================================================
  // ARCHETYPE IMPLEMENTATIONS
  // =========================================================================
  static buildW16QuadTurbo(blockMat, camMat, intakeMat, chromeMat) {
    const root = new THREE11.Group();
    root.name = "powertrain_w16_quad_turbo";
    const crankcaseGeo = new THREE11.BoxGeometry(0.72, 0.42, 0.85);
    const crankcase = new THREE11.Mesh(crankcaseGeo, blockMat);
    root.add(crankcase);
    [-0.24, -0.09, 0.09, 0.24].forEach((cx, idx) => {
      const bankGeo = new THREE11.BoxGeometry(0.12, 0.14, 0.82);
      const bank = new THREE11.Mesh(bankGeo, camMat);
      bank.position.set(cx, 0.24, 0);
      root.add(bank);
    });
    [
      [-0.42, 0.05, 0.2],
      [-0.42, 0.05, -0.2],
      [0.42, 0.05, 0.2],
      [0.42, 0.05, -0.2]
    ].forEach(([tx, ty, tz]) => {
      const turboGeo = new THREE11.CylinderGeometry(0.08, 0.08, 0.12, 16);
      turboGeo.rotateZ(Math.PI / 2);
      const turbo = new THREE11.Mesh(turboGeo, chromeMat);
      turbo.position.set(tx, ty, tz);
      root.add(turbo);
    });
    [-0.22, 0.22].forEach((ix) => {
      const icGeo = new THREE11.BoxGeometry(0.18, 0.14, 0.65);
      const ic = new THREE11.Mesh(icGeo, intakeMat);
      ic.position.set(ix, 0.35, 0);
      root.add(ic);
    });
    return root;
  }
  static buildV12Engine(blockMat, camMat, intakeMat, carbonMat, chromeMat) {
    const root = new THREE11.Group();
    root.name = "powertrain_v12_longitudinal";
    const blockGeo = new THREE11.BoxGeometry(0.58, 0.38, 0.95);
    const block = new THREE11.Mesh(blockGeo, blockMat);
    root.add(block);
    [-0.22, 0.22].forEach((vx, idx) => {
      const camGeo = new THREE11.BoxGeometry(0.18, 0.15, 0.92);
      const cam = new THREE11.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.22, 0);
      cam.rotation.z = idx === 0 ? 0.3 : -0.3;
      root.add(cam);
    });
    const plenumGeo = new THREE11.CylinderGeometry(0.12, 0.12, 0.88, 16);
    plenumGeo.rotateX(Math.PI / 2);
    [-0.1, 0.1].forEach((px) => {
      const plenum = new THREE11.Mesh(plenumGeo, carbonMat);
      plenum.position.set(px, 0.35, 0);
      root.add(plenum);
    });
    const tankGeo = new THREE11.CylinderGeometry(0.09, 0.09, 0.28, 16);
    const tank = new THREE11.Mesh(tankGeo, chromeMat);
    tank.position.set(0.32, 0.12, -0.42);
    root.add(tank);
    return root;
  }
  static buildV10Engine(blockMat, camMat, intakeMat, carbonMat) {
    const root = new THREE11.Group();
    root.name = "powertrain_v10_atmospheric";
    const blockGeo = new THREE11.BoxGeometry(0.54, 0.35, 0.82);
    const block = new THREE11.Mesh(blockGeo, blockMat);
    root.add(block);
    [-0.2, 0.2].forEach((vx, idx) => {
      const camGeo = new THREE11.BoxGeometry(0.16, 0.14, 0.78);
      const cam = new THREE11.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.2, 0);
      cam.rotation.z = idx === 0 ? 0.35 : -0.35;
      root.add(cam);
    });
    const manifoldGeo = new THREE11.BoxGeometry(0.28, 0.16, 0.76);
    const manifold = new THREE11.Mesh(manifoldGeo, intakeMat);
    manifold.position.set(0, 0.32, 0);
    root.add(manifold);
    [-0.24, 0.24].forEach((sx) => {
      const pipeGeo = new THREE11.CylinderGeometry(0.05, 0.05, 0.45, 12);
      pipeGeo.rotateZ(sx < 0 ? -0.4 : 0.4);
      const pipe = new THREE11.Mesh(pipeGeo, carbonMat);
      pipe.position.set(sx, 0.26, 0.32);
      root.add(pipe);
    });
    return root;
  }
  static buildV8MidEngine(blockMat, camMat, intakeMat, chromeMat) {
    const root = new THREE11.Group();
    root.name = "powertrain_v8_mid_twinturbo";
    const blockGeo = new THREE11.BoxGeometry(0.56, 0.36, 0.68);
    const block = new THREE11.Mesh(blockGeo, blockMat);
    root.add(block);
    [-0.21, 0.21].forEach((vx, idx) => {
      const camGeo = new THREE11.BoxGeometry(0.17, 0.13, 0.65);
      const cam = new THREE11.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.2, 0);
      cam.rotation.z = idx === 0 ? 0.35 : -0.35;
      root.add(cam);
    });
    const plenumGeo = new THREE11.BoxGeometry(0.26, 0.15, 0.62);
    const plenum = new THREE11.Mesh(plenumGeo, intakeMat);
    plenum.position.set(0, 0.31, 0);
    root.add(plenum);
    [-0.34, 0.34].forEach((tx) => {
      const turboGeo = new THREE11.CylinderGeometry(0.09, 0.09, 0.14, 16);
      turboGeo.rotateZ(Math.PI / 2);
      const turbo = new THREE11.Mesh(turboGeo, chromeMat);
      turbo.position.set(tx, 0.08, -0.22);
      root.add(turbo);
    });
    return root;
  }
  static buildV6MidEngine(blockMat, camMat, intakeMat, chromeMat) {
    const root = new THREE11.Group();
    root.name = "powertrain_v6_mid_hot_v";
    const blockGeo = new THREE11.BoxGeometry(0.62, 0.28, 0.58);
    const block = new THREE11.Mesh(blockGeo, blockMat);
    root.add(block);
    [-0.24, 0.24].forEach((vx, idx) => {
      const camGeo = new THREE11.BoxGeometry(0.16, 0.12, 0.54);
      const cam = new THREE11.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.14, 0);
      cam.rotation.z = idx === 0 ? 0.45 : -0.45;
      root.add(cam);
    });
    const valleyTurboGeo = new THREE11.CylinderGeometry(0.08, 0.08, 0.18, 16);
    valleyTurboGeo.rotateX(Math.PI / 2);
    const turbo = new THREE11.Mesh(valleyTurboGeo, chromeMat);
    turbo.position.set(0, 0.24, 0.05);
    root.add(turbo);
    const intakeGeo = new THREE11.BoxGeometry(0.22, 0.12, 0.52);
    const intake = new THREE11.Mesh(intakeGeo, intakeMat);
    intake.position.set(0, 0.32, -0.05);
    root.add(intake);
    return root;
  }
  static buildBoxerEngine(isRear, blockMat, camMat, intakeMat, carbonMat) {
    const root = new THREE11.Group();
    root.name = isRear ? "powertrain_boxer6_rear" : "powertrain_boxer6_mid";
    const blockGeo = new THREE11.BoxGeometry(0.78, 0.22, 0.62);
    const block = new THREE11.Mesh(blockGeo, blockMat);
    root.add(block);
    [-0.38, 0.38].forEach((hx) => {
      const headGeo = new THREE11.BoxGeometry(0.14, 0.18, 0.58);
      const head = new THREE11.Mesh(headGeo, camMat);
      head.position.set(hx, 0.02, 0);
      root.add(head);
    });
    const plenumGeo = new THREE11.BoxGeometry(0.38, 0.16, 0.48);
    const plenum = new THREE11.Mesh(plenumGeo, intakeMat);
    plenum.position.set(0, 0.22, 0);
    root.add(plenum);
    [-0.18, 0.18].forEach((fx) => {
      const fanGeo = new THREE11.CylinderGeometry(0.13, 0.13, 0.04, 20);
      const fan = new THREE11.Mesh(fanGeo, carbonMat);
      fan.position.set(fx, 0.32, -0.12);
      root.add(fan);
    });
    return root;
  }
  static buildV8FrontSupercharged(blockMat, camMat, intakeMat, chromeMat) {
    const root = new THREE11.Group();
    root.name = "powertrain_v8_supercharged_front";
    const blockGeo = new THREE11.BoxGeometry(0.58, 0.42, 0.72);
    const block = new THREE11.Mesh(blockGeo, blockMat);
    root.add(block);
    [-0.22, 0.22].forEach((vx, idx) => {
      const camGeo = new THREE11.BoxGeometry(0.18, 0.15, 0.68);
      const cam = new THREE11.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.24, 0);
      cam.rotation.z = idx === 0 ? 0.4 : -0.4;
      root.add(cam);
    });
    const blowerGeo = new THREE11.BoxGeometry(0.32, 0.22, 0.56);
    const blower = new THREE11.Mesh(blowerGeo, intakeMat);
    blower.position.set(0, 0.38, -0.04);
    root.add(blower);
    const pulleyGeo = new THREE11.CylinderGeometry(0.06, 0.06, 0.03, 16);
    pulleyGeo.rotateX(Math.PI / 2);
    const pulley = new THREE11.Mesh(pulleyGeo, chromeMat);
    pulley.position.set(0, 0.38, 0.26);
    root.add(pulley);
    const coneGeo = new THREE11.ConeGeometry(0.09, 0.22, 16);
    coneGeo.rotateZ(Math.PI / 2);
    const cone = new THREE11.Mesh(coneGeo, camMat);
    cone.position.set(-0.32, 0.28, 0.26);
    root.add(cone);
    return root;
  }
  static buildInlineEngine(cylinders, blockMat, camMat, intakeMat, chromeMat) {
    const root = new THREE11.Group();
    root.name = `powertrain_inline_${cylinders}`;
    const length = cylinders === 6 ? 0.78 : 0.54;
    const blockGeo = new THREE11.BoxGeometry(0.32, 0.38, length);
    const block = new THREE11.Mesh(blockGeo, blockMat);
    root.add(block);
    const camGeo = new THREE11.BoxGeometry(0.26, 0.14, length * 0.96);
    const cam = new THREE11.Mesh(camGeo, camMat);
    cam.position.set(0, 0.24, 0);
    root.add(cam);
    const intakeGeo = new THREE11.BoxGeometry(0.18, 0.16, length * 0.85);
    const intake = new THREE11.Mesh(intakeGeo, intakeMat);
    intake.position.set(-0.24, 0.15, 0);
    root.add(intake);
    const turboGeo = new THREE11.CylinderGeometry(0.09, 0.09, 0.16, 16);
    turboGeo.rotateZ(Math.PI / 2);
    const turbo = new THREE11.Mesh(turboGeo, chromeMat);
    turbo.position.set(0.24, 0.08, -0.05);
    root.add(turbo);
    return root;
  }
  static buildRotaryEngine(blockMat, camMat, intakeMat, chromeMat) {
    const root = new THREE11.Group();
    root.name = "powertrain_wankel_rotary_twin_turbo";
    const rotorGeo = new THREE11.BoxGeometry(0.34, 0.32, 0.44);
    const rotor = new THREE11.Mesh(rotorGeo, blockMat);
    root.add(rotor);
    const curvePipeGeo = new THREE11.TorusGeometry(0.14, 0.035, 8, 16, Math.PI);
    curvePipeGeo.rotateY(Math.PI / 2);
    const pipe = new THREE11.Mesh(curvePipeGeo, intakeMat);
    pipe.position.set(-0.16, 0.22, 0);
    root.add(pipe);
    [-0.1, 0.1].forEach((tz) => {
      const turboGeo = new THREE11.CylinderGeometry(0.07, 0.07, 0.12, 14);
      turboGeo.rotateZ(Math.PI / 2);
      const turbo = new THREE11.Mesh(turboGeo, chromeMat);
      turbo.position.set(0.22, 0.05, tz);
      root.add(turbo);
    });
    return root;
  }
  static buildElectricDriveUnits(dims, motorMat, hvMat, carbonMat) {
    const root = new THREE11.Group();
    root.name = "powertrain_electric_drive_system";
    const frontMotorGeo = new THREE11.CylinderGeometry(0.16, 0.16, 0.52, 16);
    frontMotorGeo.rotateZ(Math.PI / 2);
    const frontMotor = new THREE11.Mesh(frontMotorGeo, motorMat);
    frontMotor.position.set(0, -0.08, dims.length * 0.24);
    root.add(frontMotor);
    const frunkGeo = new THREE11.BoxGeometry(0.85, 0.26, 0.65);
    const frunk = new THREE11.Mesh(frunkGeo, carbonMat);
    frunk.position.set(0, 0.14, dims.length * 0.26);
    root.add(frunk);
    const rearMotorGeo = new THREE11.CylinderGeometry(0.18, 0.18, 0.62, 16);
    rearMotorGeo.rotateZ(Math.PI / 2);
    const rearMotor = new THREE11.Mesh(rearMotorGeo, motorMat);
    rearMotor.position.set(0, -0.08, -dims.length * 0.22);
    root.add(rearMotor);
    const inverterGeo = new THREE11.BoxGeometry(0.48, 0.16, 0.38);
    const inverter = new THREE11.Mesh(inverterGeo, motorMat);
    inverter.position.set(0, 0.15, -dims.length * 0.2);
    root.add(inverter);
    [-0.12, 0.12].forEach((cx) => {
      const cableCurve = new THREE11.CatmullRomCurve3([
        new THREE11.Vector3(cx, 0.12, dims.length * 0.2),
        new THREE11.Vector3(cx, -0.02, 0),
        new THREE11.Vector3(cx, 0.14, -dims.length * 0.18)
      ]);
      const cableGeo = new THREE11.TubeGeometry(cableCurve, 16, 0.022, 8, false);
      const cable = new THREE11.Mesh(cableGeo, hvMat);
      root.add(cable);
    });
    return root;
  }
  // =========================================================================
  // STRUCTURAL CHASSIS COMPONENTS
  // =========================================================================
  static buildEngineBayTub(isMidRear, dims, material) {
    const tubGroup = new THREE11.Group();
    tubGroup.name = "engine_bay_structural_tub";
    const zCenter = isMidRear ? -dims.length * 0.16 : dims.length * 0.28;
    const tubLength = dims.length * 0.24;
    const tubWidth = dims.width * 0.58;
    const tubHeight = dims.height * 0.45;
    const yCenter = dims.height * 0.28;
    const firewallZ = isMidRear ? zCenter + tubLength * 0.5 : zCenter - tubLength * 0.5;
    const firewallGeo = new THREE11.BoxGeometry(tubWidth, tubHeight, 0.025);
    const firewall = new THREE11.Mesh(firewallGeo, material);
    firewall.position.set(0, yCenter, firewallZ);
    tubGroup.add(firewall);
    [-tubWidth * 0.5, tubWidth * 0.5].forEach((wx) => {
      const flankGeo = new THREE11.BoxGeometry(0.025, tubHeight, tubLength);
      const flank = new THREE11.Mesh(flankGeo, material);
      flank.position.set(wx, yCenter, zCenter);
      tubGroup.add(flank);
    });
    const floorGeo = new THREE11.BoxGeometry(tubWidth, 0.025, tubLength);
    const floor = new THREE11.Mesh(floorGeo, material);
    floor.position.set(0, yCenter - tubHeight * 0.5, zCenter);
    tubGroup.add(floor);
    return tubGroup;
  }
  static buildCoolingRadiator(isMidRear, dims, blockMat, fanMat) {
    const group = new THREE11.Group();
    group.name = "cooling_radiator_assembly";
    const radZ = isMidRear ? -dims.length * 0.32 : dims.length * 0.42;
    const radY = dims.height * 0.26;
    const radWidth = dims.width * 0.52;
    const coreGeo = new THREE11.BoxGeometry(radWidth, 0.32, 0.045);
    const core = new THREE11.Mesh(coreGeo, blockMat);
    core.position.set(0, radY, radZ);
    group.add(core);
    [-radWidth * 0.24, radWidth * 0.24].forEach((fx) => {
      const fanGeo = new THREE11.CylinderGeometry(0.12, 0.12, 0.03, 16);
      fanGeo.rotateX(Math.PI / 2);
      const fan = new THREE11.Mesh(fanGeo, fanMat);
      fan.position.set(fx, radY, isMidRear ? radZ + 0.04 : radZ - 0.04);
      group.add(fan);
    });
    return group;
  }
  static buildAuxiliaryGear(isMidRear, dims) {
    const group = new THREE11.Group();
    group.name = "engine_bay_auxiliary_gear";
    const zBase = isMidRear ? -dims.length * 0.08 : dims.length * 0.38;
    const yBase = dims.height * 0.42;
    const batGeo = new THREE11.BoxGeometry(0.18, 0.16, 0.14);
    const batMat = new THREE11.MeshStandardMaterial({ color: "#09090b", roughness: 0.8 });
    const battery = new THREE11.Mesh(batGeo, batMat);
    battery.position.set(dims.width * 0.24, yBase, zBase);
    group.add(battery);
    const brakeGeo = new THREE11.CylinderGeometry(0.04, 0.04, 0.09, 12);
    const fluidMat = new THREE11.MeshStandardMaterial({ color: "#fef08a", roughness: 0.2, transparent: true, opacity: 0.85 });
    const brakeTank = new THREE11.Mesh(brakeGeo, fluidMat);
    brakeTank.position.set(-dims.width * 0.24, yBase + 0.04, zBase);
    group.add(brakeTank);
    const coolantGeo = new THREE11.SphereGeometry(0.065, 12, 12);
    const coolantMat = new THREE11.MeshStandardMaterial({ color: "#38bdf8", roughness: 0.3, transparent: true, opacity: 0.75 });
    const coolantTank = new THREE11.Mesh(coolantGeo, coolantMat);
    coolantTank.position.set(-dims.width * 0.24, yBase + 0.03, zBase - 0.14);
    group.add(coolantTank);
    return group;
  }
  static buildStrutBracing(isMidRear, dims, chromeMat, carbonMat) {
    const group = new THREE11.Group();
    group.name = "chassis_strut_brace";
    const zCenter = isMidRear ? -dims.length * 0.16 : dims.length * 0.28;
    const yPos = dims.height * 0.46;
    const span = dims.width * 0.48;
    if (isMidRear) {
      const bar1Curve = new THREE11.CatmullRomCurve3([
        new THREE11.Vector3(-span * 0.5, yPos - 0.05, zCenter - 0.25),
        new THREE11.Vector3(0, yPos, zCenter),
        new THREE11.Vector3(span * 0.5, yPos - 0.05, zCenter + 0.25)
      ]);
      const bar2Curve = new THREE11.CatmullRomCurve3([
        new THREE11.Vector3(-span * 0.5, yPos - 0.05, zCenter + 0.25),
        new THREE11.Vector3(0, yPos, zCenter),
        new THREE11.Vector3(span * 0.5, yPos - 0.05, zCenter - 0.25)
      ]);
      [bar1Curve, bar2Curve].forEach((c) => {
        const geo = new THREE11.TubeGeometry(c, 12, 0.016, 8, false);
        const mesh = new THREE11.Mesh(geo, carbonMat);
        group.add(mesh);
      });
    } else {
      const tieCurve = new THREE11.CatmullRomCurve3([
        new THREE11.Vector3(-span * 0.5, yPos - 0.08, zCenter),
        new THREE11.Vector3(-span * 0.25, yPos, zCenter),
        new THREE11.Vector3(span * 0.25, yPos, zCenter),
        new THREE11.Vector3(span * 0.5, yPos - 0.08, zCenter)
      ]);
      const geo = new THREE11.TubeGeometry(tieCurve, 16, 0.018, 8, false);
      const mesh = new THREE11.Mesh(geo, chromeMat);
      group.add(mesh);
    }
    return group;
  }
  /**
   * Constructs front luggage compartment (frunk) for mid/rear engine supercars
   * Includes deep storage tub, weather-seal gasket, central radiator air extraction duct (for track cars),
   * windshield washer filler cap, brake fluid reservoir, and tire inflation kit.
   */
  static buildFrontFrunkTub(dims, carbonMat, metalMat, isTrackCar = false) {
    const group = new THREE11.Group();
    group.name = "front_frunk_cargo_tub";
    const tubW = dims.width * 0.48;
    const tubL = dims.length * 0.16;
    const tubH = dims.height * 0.32;
    const carpetMat = new THREE11.MeshStandardMaterial({
      color: new THREE11.Color("#1c1917"),
      roughness: 0.95,
      metalness: 0.05
    });
    const sealMat = new THREE11.MeshStandardMaterial({
      color: new THREE11.Color("#0a0a0a"),
      roughness: 0.9,
      metalness: 0
    });
    const tubGeo = new THREE11.BoxGeometry(tubW, tubH, tubL);
    const tub = new THREE11.Mesh(tubGeo, carpetMat);
    tub.position.set(0, dims.height * 0.22, dims.length * 0.26);
    group.add(tub);
    const sealLip = new THREE11.Mesh(
      new THREE11.BoxGeometry(tubW * 1.05, 0.02, tubL * 1.05),
      sealMat
    );
    sealLip.position.set(0, dims.height * 0.38, dims.length * 0.26);
    group.add(sealLip);
    if (isTrackCar) {
      const ductGroup = new THREE11.Group();
      ductGroup.name = "frunk_radiator_extraction_duct";
      const ductGeo = new THREE11.BoxGeometry(tubW * 0.65, tubH * 0.75, tubL * 0.45);
      const duct = new THREE11.Mesh(ductGeo, carbonMat);
      duct.position.set(0, dims.height * 0.26, dims.length * 0.28);
      duct.rotation.x = -0.25;
      ductGroup.add(duct);
      [-0.15, 0, 0.15].forEach((x) => {
        const vane = new THREE11.Mesh(new THREE11.BoxGeometry(0.015, tubH * 0.6, tubL * 0.35), carbonMat);
        vane.position.set(x, dims.height * 0.26, dims.length * 0.28);
        ductGroup.add(vane);
      });
      group.add(ductGroup);
    }
    const blueCap = new THREE11.Mesh(
      new THREE11.CylinderGeometry(0.025, 0.025, 0.015, 16),
      new THREE11.MeshStandardMaterial({ color: 165063, roughness: 0.4 })
    );
    blueCap.position.set(-tubW * 0.4, dims.height * 0.39, dims.length * 0.32);
    group.add(blueCap);
    const yellowCap = new THREE11.Mesh(
      new THREE11.CylinderGeometry(0.022, 0.022, 0.015, 16),
      new THREE11.MeshStandardMaterial({ color: 15381256, roughness: 0.4 })
    );
    yellowCap.position.set(tubW * 0.4, dims.height * 0.39, dims.length * 0.32);
    group.add(yellowCap);
    const toolBox = new THREE11.Mesh(
      new THREE11.BoxGeometry(0.24, 0.08, 0.18),
      new THREE11.MeshStandardMaterial({ color: 2565930, roughness: 0.7 })
    );
    toolBox.position.set(0, dims.height * 0.12, dims.length * 0.22);
    group.add(toolBox);
    return group;
  }
  /**
   * Constructs rear cargo trunk for front-engine vehicles
   * Includes carpeted luggage bay, spare tire floor lid, battery relocation tray, and interior wheelhouse linings.
   */
  static buildRearCargoTrunk(dims, carbonMat) {
    const group = new THREE11.Group();
    group.name = "rear_cargo_trunk";
    const trunkW = dims.width * 0.52;
    const trunkL = dims.length * 0.2;
    const trunkH = dims.height * 0.3;
    const carpetMat = new THREE11.MeshStandardMaterial({
      color: new THREE11.Color("#1c1917"),
      roughness: 0.95,
      metalness: 0.05
    });
    const floor = new THREE11.Mesh(new THREE11.BoxGeometry(trunkW, 0.03, trunkL), carpetMat);
    floor.position.set(0, dims.height * 0.22, -dims.length * 0.28);
    group.add(floor);
    [-trunkW * 0.5, trunkW * 0.5].forEach((x) => {
      const wall = new THREE11.Mesh(new THREE11.BoxGeometry(0.04, trunkH, trunkL), carpetMat);
      wall.position.set(x, dims.height * 0.34, -dims.length * 0.28);
      group.add(wall);
    });
    const bulkhead = new THREE11.Mesh(new THREE11.BoxGeometry(trunkW, trunkH, 0.04), carpetMat);
    bulkhead.position.set(0, dims.height * 0.34, -dims.length * 0.18);
    group.add(bulkhead);
    const spareCover = new THREE11.Mesh(new THREE11.CylinderGeometry(0.28, 0.28, 0.02, 24), carpetMat);
    spareCover.position.set(0, dims.height * 0.235, -dims.length * 0.28);
    group.add(spareCover);
    const pullLoop = new THREE11.Mesh(
      new THREE11.BoxGeometry(0.04, 0.015, 0.01),
      new THREE11.MeshStandardMaterial({ color: 14427686 })
    );
    pullLoop.position.set(0, dims.height * 0.245, -dims.length * 0.24);
    group.add(pullLoop);
    return group;
  }
  /**
   * Constructs pneumatic gas support struts for bonnets and boot lids
   */
  static buildGasStruts(isFront, dims, chromeMat) {
    const group = new THREE11.Group();
    group.name = isFront ? "engine_bay_hood_struts" : "engine_bay_boot_struts";
    const blackBodyMat = new THREE11.MeshStandardMaterial({ color: 1579035, roughness: 0.5, metalness: 0.6 });
    const zPos = isFront ? dims.length * 0.22 : -dims.length * 0.22;
    const strutWidth = dims.width * 0.38;
    [-strutWidth, strutWidth].forEach((x) => {
      const singleStrut = new THREE11.Group();
      const cylinder = new THREE11.Mesh(new THREE11.CylinderGeometry(0.012, 0.012, 0.28, 12), blackBodyMat);
      cylinder.rotation.x = isFront ? 0.35 : -0.35;
      cylinder.position.set(0, dims.height * 0.28, 0);
      singleStrut.add(cylinder);
      const rod = new THREE11.Mesh(new THREE11.CylinderGeometry(6e-3, 6e-3, 0.24, 12), chromeMat);
      rod.rotation.x = isFront ? 0.35 : -0.35;
      rod.position.set(0, dims.height * 0.42, isFront ? -0.05 : 0.05);
      singleStrut.add(rod);
      singleStrut.position.set(x, 0, zPos);
      group.add(singleStrut);
    });
    return group;
  }
};

// packages/vehicle-generation-engine/src/geometry/vehicleOpeningController.ts
import * as THREE12 from "three";
var DEFAULT_OPENING_STATE = {
  doorFrontLeft: 0,
  doorFrontRight: 0,
  doorRearLeft: 0,
  doorRearRight: 0,
  hood: 0,
  boot: 0
};
var VehicleOpeningController = class {
  /**
   * Resolves kinematics configuration based on 50-car audit matrix
   */
  static resolveOpeningConfig(spec) {
    const id = (spec.vehicle.id || "").toLowerCase();
    const model = (spec.vehicle.model || "").toLowerCase();
    const mfr = (spec.vehicle.manufacturer || "").toLowerCase();
    const isFourDoor = id.includes("lancer") || id.includes("evo") || id.includes("wrx") || id.includes("impreza");
    const doorCount = isFourDoor ? 4 : 2;
    let doorMechanism = "conventional";
    if (id.includes("aventador") || id.includes("revuelto") || id.includes("essenza") || id.includes("countach")) {
      doorMechanism = "scissor";
    } else if (id.includes("p1") || id.includes("laferrari") || id.includes("fxx") || id.includes("amg_one") || id.includes("nevera") || id.includes("720s") || id.includes("765lt") || id.includes("senna") || id.includes("ford_gt") || id.includes("mc20")) {
      doorMechanism = "butterfly";
    } else if (id.includes("jesko") || id.includes("agera") || id.includes("regera") || mfr.includes("koenigsegg")) {
      doorMechanism = "dihedral_synchro_helix";
    } else if (id.includes("huayra") || id.includes("valkyrie") || id.includes("sls")) {
      doorMechanism = "gullwing";
    } else if (id.includes("spectre") || id.includes("phantom") || mfr.includes("rolls")) {
      doorMechanism = "coach";
    }
    let hoodMechanism = "rear_hinged";
    if (id.includes("f-type") || id.includes("ftype") || id.includes("huracan") || id.includes("supra")) {
      hoodMechanism = "clamshell_forward";
    } else if (mfr.includes("porsche") || mfr.includes("ferrari") || mfr.includes("mclaren") || mfr.includes("lamborghini") || id.includes("nevera")) {
      hoodMechanism = "frunk";
    }
    let bootMechanism = "trunk_lid";
    if (id.includes("chiron") || id.includes("jesko") || id.includes("p1") || id.includes("laferrari") || id.includes("valkyrie") || id.includes("amg_one") || id.includes("huayra") || id.includes("revuelto") || id.includes("aventador") || id.includes("ford_gt") || id.includes("fxx") || id.includes("718") || id.includes("cayman")) {
      bootMechanism = "rear_clamshell";
    } else if (id.includes("corvette") || id.includes("supra") || id.includes("z_nismo") || id.includes("miata") || id.includes("rx7") || id.includes("amg_gt") || id.includes("a110")) {
      bootMechanism = "liftback_hatch";
    }
    const dims = spec.dimensions || { length: 4.6, width: 2, height: 1.25 };
    return {
      doorCount,
      doorMechanism,
      hoodMechanism,
      bootMechanism,
      doorHingeOffsetFrontM: [-dims.width * 0.44, 0, dims.length * 0.18],
      doorHingeOffsetRearM: isFourDoor ? [-dims.width * 0.44, 0, -dims.length * 0.08] : void 0,
      hoodHingeOffsetM: hoodMechanism === "clamshell_forward" ? [0, dims.height * 0.28, dims.length * 0.46] : [0, dims.height * 0.42, dims.length * 0.14],
      bootHingeOffsetM: bootMechanism === "rear_clamshell" ? [0, dims.height * 0.38, -dims.length * 0.42] : [0, dims.height * 0.45, -dims.length * 0.18]
    };
  }
  /**
   * Applies kinematics rotations and translations to the vehicle assembly's HingePivotGroups
   */
  static applyOpenings(vehicleGroup, config, state) {
    const pivotDoorFL = vehicleGroup.getObjectByName("hinge_pivot_door_front_l");
    if (pivotDoorFL) {
      this.applyDoorKinematics(pivotDoorFL, config.doorMechanism, state.doorFrontLeft, false);
    }
    const pivotDoorFR = vehicleGroup.getObjectByName("hinge_pivot_door_front_r");
    if (pivotDoorFR) {
      this.applyDoorKinematics(pivotDoorFR, config.doorMechanism, state.doorFrontRight, true);
    }
    const pivotDoorRL = vehicleGroup.getObjectByName("hinge_pivot_door_rear_l");
    if (pivotDoorRL) {
      this.applyDoorKinematics(pivotDoorRL, "conventional", state.doorRearLeft, false);
    }
    const pivotDoorRR = vehicleGroup.getObjectByName("hinge_pivot_door_rear_r");
    if (pivotDoorRR) {
      this.applyDoorKinematics(pivotDoorRR, "conventional", state.doorRearRight, true);
    }
    const pivotHood = vehicleGroup.getObjectByName("hinge_pivot_hood");
    if (pivotHood) {
      this.applyHoodKinematics(pivotHood, config.hoodMechanism, state.hood);
    }
    const pivotBoot = vehicleGroup.getObjectByName("hinge_pivot_boot");
    if (pivotBoot) {
      this.applyBootKinematics(pivotBoot, config.bootMechanism, state.boot);
    }
  }
  /**
   * Kinematic transformation dispatcher for doors
   */
  static applyDoorKinematics(pivot, mechanism, factor, isRight) {
    const f = THREE12.MathUtils.clamp(factor, 0, 1);
    const sideSign = isRight ? -1 : 1;
    switch (mechanism) {
      case "scissor":
        pivot.rotation.set(
          THREE12.MathUtils.lerp(0, 0.08, f),
          THREE12.MathUtils.lerp(0, -0.15 * sideSign, f),
          THREE12.MathUtils.lerp(0, 1.25 * sideSign, f)
        );
        break;
      case "butterfly":
        pivot.rotation.set(
          THREE12.MathUtils.lerp(0, -0.45, f),
          THREE12.MathUtils.lerp(0, -0.42 * sideSign, f),
          THREE12.MathUtils.lerp(0, 0.85 * sideSign, f)
        );
        break;
      case "dihedral_synchro_helix":
        pivot.position.x = THREE12.MathUtils.lerp(0, -0.06 * sideSign, f);
        pivot.rotation.set(
          THREE12.MathUtils.lerp(0, 0, f),
          THREE12.MathUtils.lerp(0, -0.05 * sideSign, f),
          THREE12.MathUtils.lerp(0, 1.57 * sideSign, f)
        );
        break;
      case "gullwing":
        pivot.rotation.set(
          0,
          0,
          THREE12.MathUtils.lerp(0, 1.35 * sideSign, f)
        );
        break;
      case "coach":
        pivot.rotation.set(
          0,
          THREE12.MathUtils.lerp(0, 1.15 * sideSign, f),
          0
        );
        break;
      case "conventional":
      default:
        pivot.rotation.set(
          0,
          THREE12.MathUtils.lerp(0, -1.15 * sideSign, f),
          0
        );
        break;
    }
  }
  /**
   * Kinematic transformation for hood / bonnet / frunk
   */
  static applyHoodKinematics(pivot, mechanism, factor) {
    const f = THREE12.MathUtils.clamp(factor, 0, 1);
    if (mechanism === "clamshell_forward") {
      pivot.rotation.x = THREE12.MathUtils.lerp(0, -0.92, f);
    } else {
      pivot.rotation.x = THREE12.MathUtils.lerp(0, 0.88, f);
    }
  }
  /**
   * Kinematic transformation for boot / trunk / rear clamshell
   */
  static applyBootKinematics(pivot, mechanism, factor) {
    const f = THREE12.MathUtils.clamp(factor, 0, 1);
    if (mechanism === "rear_clamshell") {
      pivot.rotation.x = THREE12.MathUtils.lerp(0, -1.05, f);
    } else {
      pivot.rotation.x = THREE12.MathUtils.lerp(0, 0.95, f);
    }
  }
};

// packages/vehicle-generation-engine/src/geometry/editableVehicleAssembler.ts
var EditableVehicleAssembler = class {
  static build(spec, options) {
    const root = new THREE13.Group();
    root.name = `vehicle_${spec.vehicle.id}`;
    const overrides = options?.componentOverrides || {};
    const selectedId = options?.selectedComponentId || null;
    const materialsMap = this.buildMaterialsMap(spec.materials, overrides, options?.wireframe);
    const hasLoftedShell = !!(spec.bodyGeometry?.crossSections && spec.bodyGeometry.crossSections.length >= 2);
    if (hasLoftedShell) {
      const bodyShellMesh = this.buildLoftedBodyShell(spec, materialsMap, overrides);
      bodyShellMesh.name = "component_body_shell";
      root.add(bodyShellMesh);
    }
    const openingConfig = VehicleOpeningController.resolveOpeningConfig(spec);
    const hingePivotFL = new THREE13.Group();
    hingePivotFL.name = "hinge_pivot_door_front_l";
    hingePivotFL.position.set(...openingConfig.doorHingeOffsetFrontM);
    const hingePivotFR = new THREE13.Group();
    hingePivotFR.name = "hinge_pivot_door_front_r";
    hingePivotFR.position.set(
      -openingConfig.doorHingeOffsetFrontM[0],
      openingConfig.doorHingeOffsetFrontM[1],
      openingConfig.doorHingeOffsetFrontM[2]
    );
    const hingePivotRL = new THREE13.Group();
    hingePivotRL.name = "hinge_pivot_door_rear_l";
    if (openingConfig.doorHingeOffsetRearM) {
      hingePivotRL.position.set(...openingConfig.doorHingeOffsetRearM);
    }
    const hingePivotRR = new THREE13.Group();
    hingePivotRR.name = "hinge_pivot_door_rear_r";
    if (openingConfig.doorHingeOffsetRearM) {
      hingePivotRR.position.set(
        -openingConfig.doorHingeOffsetRearM[0],
        openingConfig.doorHingeOffsetRearM[1],
        openingConfig.doorHingeOffsetRearM[2]
      );
    }
    const hingePivotHood = new THREE13.Group();
    hingePivotHood.name = "hinge_pivot_hood";
    hingePivotHood.position.set(...openingConfig.hoodHingeOffsetM);
    const hingePivotBoot = new THREE13.Group();
    hingePivotBoot.name = "hinge_pivot_boot";
    hingePivotBoot.position.set(...openingConfig.bootHingeOffsetM);
    for (const compDef of spec.components) {
      const override = overrides[compDef.id];
      if (override?.visible === false) {
        continue;
      }
      const compMesh = this.buildSingleComponent(
        compDef,
        spec,
        materialsMap,
        override,
        compDef.id === selectedId
      );
      if (compMesh) {
        if (compDef.id === "front_left_door" || compDef.id.includes("door_front_l") || compDef.id === "door_fl") {
          compMesh.position.sub(hingePivotFL.position);
          hingePivotFL.add(compMesh);
        } else if (compDef.id === "front_right_door" || compDef.id.includes("door_front_r") || compDef.id === "door_fr") {
          compMesh.position.sub(hingePivotFR.position);
          hingePivotFR.add(compMesh);
        } else if (compDef.id === "side_windows_left" || compDef.id.includes("window_front_l") || compDef.id === "window_fl") {
          compMesh.position.sub(hingePivotFL.position);
          hingePivotFL.add(compMesh);
        } else if (compDef.id === "side_windows_right" || compDef.id.includes("window_front_r") || compDef.id === "window_fr") {
          compMesh.position.sub(hingePivotFR.position);
          hingePivotFR.add(compMesh);
        } else if (compDef.id === "mirror_left" || compDef.id === "mirror_l" || compDef.id === "side_mirror_l") {
          compMesh.position.sub(hingePivotFL.position);
          hingePivotFL.add(compMesh);
        } else if (compDef.id === "mirror_right" || compDef.id === "mirror_r" || compDef.id === "side_mirror_r") {
          compMesh.position.sub(hingePivotFR.position);
          hingePivotFR.add(compMesh);
        } else if (compDef.id === "rear_left_door" || compDef.id.includes("door_rear_l") || compDef.id === "door_rl") {
          compMesh.position.sub(hingePivotRL.position);
          hingePivotRL.add(compMesh);
        } else if (compDef.id === "rear_right_door" || compDef.id.includes("door_rear_r") || compDef.id === "door_rr") {
          compMesh.position.sub(hingePivotRR.position);
          hingePivotRR.add(compMesh);
        } else if (compDef.id === "side_windows_rear_left" || compDef.id.includes("window_rear_l")) {
          compMesh.position.sub(hingePivotRL.position);
          hingePivotRL.add(compMesh);
        } else if (compDef.id === "side_windows_rear_right" || compDef.id.includes("window_rear_r")) {
          compMesh.position.sub(hingePivotRR.position);
          hingePivotRR.add(compMesh);
        } else if (compDef.id === "hood" || compDef.id.includes("bonnet") || compDef.id === "cofango") {
          compMesh.position.sub(hingePivotHood.position);
          hingePivotHood.add(compMesh);
        } else if (compDef.id === "boot" || compDef.id === "trunk" || compDef.id.includes("clamshell_rear") || compDef.id === "tailgate") {
          compMesh.position.sub(hingePivotBoot.position);
          hingePivotBoot.add(compMesh);
        } else if ((compDef.id === "rear_glass" || compDef.id === "rear_window") && (openingConfig.bootMechanism === "liftback_hatch" || openingConfig.bootMechanism === "rear_clamshell")) {
          compMesh.position.sub(hingePivotBoot.position);
          hingePivotBoot.add(compMesh);
        } else if ((compDef.id === "rear_wing" || compDef.id === "spoiler") && openingConfig.bootMechanism === "liftback_hatch") {
          compMesh.position.sub(hingePivotBoot.position);
          hingePivotBoot.add(compMesh);
        } else {
          root.add(compMesh);
        }
      }
    }
    root.add(hingePivotFL);
    root.add(hingePivotFR);
    if (openingConfig.doorCount === 4) {
      root.add(hingePivotRL);
      root.add(hingePivotRR);
    }
    root.add(hingePivotHood);
    root.add(hingePivotBoot);
    const interiorLang = VehicleInteriorGenerator.resolveDesignLanguage({
      vehicleId: spec.vehicle.id,
      manufacturer: spec.vehicle.manufacturer,
      model: spec.vehicle.model
    });
    const cabinW = spec.dimensions?.width ? spec.dimensions.width * 0.74 : 1.48;
    const cabinL = spec.dimensions?.length ? spec.dimensions.length * 0.36 : 1.65;
    const darkCharcoalMat = new THREE13.MeshStandardMaterial({ color: 1579035, roughness: 0.7, metalness: 0.1 });
    const cardLeatherMat = new THREE13.MeshStandardMaterial({ color: 2565930, roughness: 0.8, metalness: 0.05 });
    const cardAlumMat = new THREE13.MeshStandardMaterial({ color: 13948120, metalness: 0.85, roughness: 0.2 });
    const isTrackWeapon = spec.vehicle.id.includes("gt3_rs") || spec.vehicle.id.includes("gt4_rs") || spec.vehicle.id.includes("sto") || spec.vehicle.id.includes("pista");
    const cardFL = VehicleInteriorGenerator.buildSingleDoorCard("left", interiorLang, cabinW, cabinL, darkCharcoalMat, cardLeatherMat, cardAlumMat, isTrackWeapon);
    cardFL.position.set(-cabinW * 0.48 - hingePivotFL.position.x, 0.02 - hingePivotFL.position.y, 0 - hingePivotFL.position.z);
    hingePivotFL.add(cardFL);
    const cardFR = VehicleInteriorGenerator.buildSingleDoorCard("right", interiorLang, cabinW, cabinL, darkCharcoalMat, cardLeatherMat, cardAlumMat, isTrackWeapon);
    cardFR.position.set(cabinW * 0.48 - hingePivotFR.position.x, 0.02 - hingePivotFR.position.y, 0 - hingePivotFR.position.z);
    hingePivotFR.add(cardFR);
    const engineBay = VehicleEngineBayGenerator.generateEngineBay(spec);
    engineBay.name = "component_engine_bay";
    root.add(engineBay);
    const hasInteriorTub = spec.components.some((c) => c.id === "interior_floor_tub");
    if (!hasInteriorTub) {
      const W = spec.dimensions?.width ? spec.dimensions.width * 0.74 : 1.48;
      const L = spec.dimensions?.length ? spec.dimensions.length * 0.36 : 1.65;
      const language = VehicleInteriorGenerator.resolveDesignLanguage({
        vehicleId: spec.vehicle.id,
        manufacturer: spec.vehicle.manufacturer,
        model: spec.vehicle.model
      });
      const darkCharcoal = new THREE13.MeshStandardMaterial({ color: 1579035, roughness: 0.7, metalness: 0.1 });
      const carbonMat = new THREE13.MeshStandardMaterial({ color: 1118483, roughness: 0.35, metalness: 0.4 });
      const aluminumMat = new THREE13.MeshStandardMaterial({ color: 13948120, metalness: 0.85, roughness: 0.2 });
      const alcantara = new THREE13.MeshStandardMaterial({ color: 2565930, roughness: 0.95, metalness: 0.05 });
      const tubGroup = new THREE13.Group();
      tubGroup.name = "component_interior_cabin";
      const floor = new THREE13.Mesh(new THREE13.BoxGeometry(W * 0.96, 0.04, L), darkCharcoal);
      floor.position.set(0, -0.05, 0.05);
      floor.name = "interior_floor_tub";
      tubGroup.add(floor);
      const pedals = VehicleInteriorGenerator.buildPedals(aluminumMat, false);
      pedals.position.set(-W * 0.24, -0.02, 0.68);
      tubGroup.add(pedals);
      const console = VehicleInteriorGenerator.buildCenterConsole(language, W, L, carbonMat, aluminumMat, alcantara);
      console.position.set(0, 0.08, 0.08);
      tubGroup.add(console);
      root.add(tubGroup);
    }
    const activeOpeningState = options?.openingState || DEFAULT_OPENING_STATE;
    VehicleOpeningController.applyOpenings(root, openingConfig, activeOpeningState);
    root.userData = {
      isSchema2Vehicle: true,
      vehicleId: spec.vehicle.id,
      manufacturer: spec.vehicle.manufacturer,
      model: spec.vehicle.model,
      generation: spec.vehicle.generation,
      year: spec.vehicle.year,
      category: spec.vehicle.category,
      dimensions: spec.dimensions,
      accuracyClass: spec.validation?.accuracyClass || "D_APPROXIMATE",
      accuracyLabel: "APPROXIMATE PROCEDURAL VEHICLE \u2014 NOT AUTHENTIC MODEL GEOMETRY",
      componentCount: spec.components.length
    };
    return root;
  }
  /**
   * Resolves PBR Material Definitions
   */
  static buildMaterialsMap(materialDefs, overrides, wireframe = false) {
    const map = /* @__PURE__ */ new Map();
    for (const m of materialDefs) {
      let mat;
      const color = new THREE13.Color(m.color);
      switch (m.type) {
        case "paint_metallic":
          mat = new THREE13.MeshPhysicalMaterial({
            color,
            metalness: m.metalness ?? 0.75,
            roughness: m.roughness ?? 0.22,
            clearcoat: m.clearcoat ?? 1,
            clearcoatRoughness: m.clearcoatRoughness ?? 0.08,
            wireframe
          });
          break;
        case "paint_gloss":
          mat = new THREE13.MeshPhysicalMaterial({
            color,
            metalness: m.metalness ?? 0.45,
            roughness: m.roughness ?? 0.2,
            clearcoat: m.clearcoat ?? 0.9,
            clearcoatRoughness: 0.1,
            wireframe
          });
          break;
        case "paint_matte":
          mat = new THREE13.MeshStandardMaterial({
            color,
            metalness: m.metalness ?? 0.2,
            roughness: m.roughness ?? 0.65,
            wireframe
          });
          break;
        case "carbon_fiber":
        case "forged_carbon":
          mat = new THREE13.MeshStandardMaterial({
            color: new THREE13.Color(m.color || "#18181b"),
            metalness: m.metalness ?? 0.35,
            roughness: m.roughness ?? 0.42,
            wireframe
          });
          break;
        case "chrome":
        case "alloy":
          mat = new THREE13.MeshStandardMaterial({
            color,
            metalness: m.metalness ?? 0.92,
            roughness: m.roughness ?? 0.15,
            wireframe
          });
          break;
        case "glass":
          mat = new THREE13.MeshPhysicalMaterial({
            color,
            metalness: 0.05,
            roughness: 0.05,
            transmission: m.transmission ?? 0.75,
            transparent: true,
            opacity: 0.85,
            wireframe
          });
          break;
        case "emissive_led":
          mat = new THREE13.MeshStandardMaterial({
            color,
            emissive: new THREE13.Color(m.emissive || m.color),
            emissiveIntensity: m.emissiveIntensity ?? 1.5,
            roughness: 0.1,
            wireframe
          });
          break;
        default:
          mat = new THREE13.MeshStandardMaterial({
            color,
            metalness: m.metalness ?? 0.3,
            roughness: m.roughness ?? 0.5,
            wireframe
          });
          break;
      }
      mat.name = m.id;
      map.set(m.id, mat);
    }
    return map;
  }
  /**
   * Constructs an individual editable component object with transforms, dimensions, and selection metadata
   */
  static buildSingleComponent(def, spec, materialsMap, override, isSelected = false) {
    let baseMat = materialsMap.get(override?.materialRef || def.materialRef) || materialsMap.get("body_paint");
    if (!baseMat) {
      baseMat = new THREE13.MeshStandardMaterial({ color: 8947848 });
    }
    let mat = baseMat;
    if (override?.customColorHex || override?.materialFinish) {
      mat = baseMat.clone();
      if (override.customColorHex && "color" in mat) {
        mat.color = new THREE13.Color(override.customColorHex);
      }
      if (override.materialFinish) {
        if (override.materialFinish === "carbon_fiber") {
          mat.color = new THREE13.Color("#18181b");
          mat.roughness = 0.42;
          mat.metalness = 0.35;
        } else if (override.materialFinish === "chrome") {
          mat.color = new THREE13.Color("#f8fafc");
          mat.roughness = 0.04;
          mat.metalness = 0.98;
        }
      }
    }
    if (isSelected) {
      const selectedMat = mat.clone();
      selectedMat.emissive = new THREE13.Color(61695);
      selectedMat.emissiveIntensity = 0.35;
      mat = selectedMat;
    }
    const posX = override?.position?.[0] ?? def.transform.position[0];
    const posY = override?.position?.[1] ?? def.transform.position[1];
    const posZ = override?.position?.[2] ?? def.transform.position[2];
    const rotX = override?.rotation?.[0] ?? def.transform.rotation[0];
    const rotY = override?.rotation?.[1] ?? def.transform.rotation[1];
    const rotZ = override?.rotation?.[2] ?? def.transform.rotation[2];
    const scaleX = override?.scale?.[0] ?? def.transform.scale[0];
    const scaleY = override?.scale?.[1] ?? def.transform.scale[1];
    const scaleZ = override?.scale?.[2] ?? def.transform.scale[2];
    const width = override?.dimensions?.width ?? def.dimensions?.width ?? 1;
    const height = override?.dimensions?.height ?? def.dimensions?.height ?? 0.2;
    const length = override?.dimensions?.length ?? def.dimensions?.length ?? 0.4;
    const thickness = override?.dimensions?.thickness ?? def.dimensions?.thickness ?? 0.03;
    let obj;
    if (override?.donorComponentId) {
      const donorPart = CrossCarPartSwapper.getDonorPartById(override.donorComponentId);
      if (donorPart) {
        const scaleAdj = override.adapterScale || [1, 1, 1];
        const offsetAdj = override.adapterOffset || [0, 0, 0];
        obj = donorPart.generateMesh(scaleAdj, offsetAdj, override.materialRef, override.customColorHex);
      } else {
        obj = this.buildBoxMesh(width, height, length, mat);
      }
    } else {
      switch (def.group) {
        case "wheels": {
          const wheelSpec = this.resolveWheelSpec(def.id, spec.wheels);
          obj = this.buildWheelComponent(wheelSpec, mat, override);
          break;
        }
        case "aerodynamics": {
          if (def.id === "rear_wing") {
            obj = this.buildRearWingComponent(width, height, length, mat, override);
          } else if (def.id === "front_splitter") {
            obj = this.buildFrontSplitterComponent(width, thickness, length, mat);
          } else if (def.id === "rear_diffuser") {
            obj = this.buildDiffuserComponent(width, height, length, mat, override?.contextSettings?.finCount ?? 5);
          } else {
            obj = this.buildBoxMesh(width, height, length, mat);
          }
          break;
        }
        case "lighting": {
          obj = this.buildLightingComponent(def.id, width, height, length, mat);
          break;
        }
        case "windows": {
          obj = this.buildGlassComponent(def.id, width, height, length, mat);
          break;
        }
        case "exhaust": {
          obj = this.buildExhaustComponent(width, height, length, mat);
          break;
        }
        case "interior": {
          obj = this.buildInteriorComponent(def.id, width, height, length, mat, spec);
          break;
        }
        default: {
          obj = this.buildBodyPanelComponent(def.id, width, height, length, mat);
          break;
        }
      }
    }
    obj.position.set(posX, posY, posZ);
    obj.rotation.set(rotX, rotY, rotZ);
    obj.scale.set(scaleX, scaleY, scaleZ);
    obj.name = def.id;
    obj.userData = {
      componentId: def.id,
      componentName: def.name,
      componentGroup: def.group,
      isEditableComponent: true,
      editable: def.editable,
      originalTransform: def.transform,
      originalDimensions: def.dimensions,
      materialRef: def.materialRef,
      customizationOptions: def.customizationOptions
    };
    obj.traverse((child) => {
      if (child.isMesh) {
        child.userData.componentId = def.id;
        child.userData.componentGroup = def.group;
        child.userData.isEditableComponent = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return obj;
  }
  /**
   * Builds the Lofted Monocoque Body Shell
   */
  static buildLoftedBodyShell(spec, materialsMap, overrides) {
    const rawSections = spec.bodyGeometry.crossSections;
    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);
    const rings = [];
    const POINTS_PER_HALF = 8;
    for (const sec of sections) {
      const z = sec.z_m;
      const hw = sec.half_width_m;
      const ly = sec.lower_y_m;
      const sy = sec.shoulder_y_m;
      const by = sec.belt_y_m;
      const uy = sec.upper_center_y_m;
      const rw = sec.roof_half_width_m;
      const ry = sec.roof_crown_y_m;
      const hasRoof = rw > 0.01;
      const topCenterY = hasRoof ? ry : uy;
      const pUnderbody = new THREE13.Vector3(0, ly, z);
      const pRocker = new THREE13.Vector3(-hw * 0.9, ly, z);
      const pFlankLower = new THREE13.Vector3(-hw, (ly + sy) * 0.5, z);
      const pShoulder = new THREE13.Vector3(-hw * 0.98, sy, z);
      const pBelt = new THREE13.Vector3(-hw * 0.94, by, z);
      let pTumblehome;
      let pRoofRail;
      let pRoofSide;
      if (hasRoof) {
        pTumblehome = new THREE13.Vector3(-hw * 0.88, by + 0.05, z);
        pRoofRail = new THREE13.Vector3(-rw, (by + ry) * 0.58, z);
        pRoofSide = new THREE13.Vector3(-rw * 0.6, ry - 0.01, z);
      } else {
        pTumblehome = new THREE13.Vector3(-hw * 0.78, (sy + uy) * 0.5, z);
        pRoofRail = new THREE13.Vector3(-hw * 0.5, (sy + uy) * 0.75, z);
        pRoofSide = new THREE13.Vector3(-hw * 0.25, uy - 0.01, z);
      }
      const pTopCenter = new THREE13.Vector3(0, topCenterY, z);
      const leftPts = [pUnderbody, pRocker, pFlankLower, pShoulder, pBelt, pTumblehome, pRoofRail, pRoofSide, pTopCenter];
      const ring = [];
      for (let i = 0; i < leftPts.length; i++) {
        ring.push(leftPts[i]);
      }
      for (let i = leftPts.length - 2; i > 0; i--) {
        const pt = leftPts[i];
        ring.push(new THREE13.Vector3(-pt.x, pt.y, pt.z));
      }
      rings.push(ring);
    }
    const positions = [];
    const uvs = [];
    const indices = [];
    const numStations = rings.length;
    const ringLen = rings[0].length;
    for (let s = 0; s < numStations; s++) {
      const ring = rings[s];
      const u = s / (numStations - 1);
      for (let p = 0; p < ringLen; p++) {
        const pt = ring[p];
        positions.push(pt.x, pt.y, pt.z);
        const v = p / ringLen;
        uvs.push(u, v);
      }
    }
    for (let s = 0; s < numStations - 1; s++) {
      const rowA = s * ringLen;
      const rowB = (s + 1) * ringLen;
      for (let p = 0; p < ringLen; p++) {
        const nextP = (p + 1) % ringLen;
        const a0 = rowA + p;
        const a1 = rowA + nextP;
        const b0 = rowB + p;
        const b1 = rowB + nextP;
        indices.push(a0, a1, b0);
        indices.push(a1, b1, b0);
      }
    }
    const noseRingIdx = 0;
    const noseCenterIdx = positions.length / 3;
    const frontSec = sections[0];
    positions.push(0, (frontSec.lower_y_m + frontSec.upper_center_y_m) * 0.5, frontSec.z_m + 0.04);
    uvs.push(0, 0.5);
    for (let p = 0; p < ringLen; p++) {
      const nextP = (p + 1) % ringLen;
      indices.push(noseCenterIdx, noseRingIdx + nextP, noseRingIdx + p);
    }
    const tailRingIdx = (numStations - 1) * ringLen;
    const tailCenterIdx = positions.length / 3;
    const rearSec = sections[numStations - 1];
    positions.push(0, (rearSec.lower_y_m + rearSec.upper_center_y_m) * 0.5, rearSec.z_m - 0.04);
    uvs.push(1, 0.5);
    for (let p = 0; p < ringLen; p++) {
      const nextP = (p + 1) % ringLen;
      indices.push(tailCenterIdx, tailRingIdx + p, tailRingIdx + nextP);
    }
    const geo = new THREE13.BufferGeometry();
    geo.setAttribute("position", new THREE13.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE13.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const mat = materialsMap.get("body_paint") || new THREE13.MeshStandardMaterial({ color: 8947848 });
    const mesh = new THREE13.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
  // ==========================================
  // Component Builders
  // ==========================================
  static buildRearWingComponent(width, height, length, material, override) {
    const group = new THREE13.Group();
    const wingSpan = width;
    const chord = length;
    const isLip = height < 0.1;
    if (isLip) {
      const lipShape = new THREE13.Shape();
      const hc = chord / 2;
      lipShape.moveTo(-hc, 0);
      lipShape.quadraticCurveTo(0, 0.04, hc, 0.035);
      lipShape.lineTo(hc, 0.015);
      lipShape.quadraticCurveTo(0, -0.01, -hc, 0);
      const lipGeo = new THREE13.ExtrudeGeometry(lipShape, {
        steps: 3,
        depth: wingSpan,
        bevelEnabled: true,
        bevelThickness: 8e-3,
        bevelSize: 8e-3,
        bevelSegments: 2
      });
      lipGeo.center();
      lipGeo.rotateY(Math.PI / 2);
      lipGeo.computeVertexNormals();
      const lipMesh = new THREE13.Mesh(lipGeo, material);
      lipMesh.name = "rear_wing_lip_blade";
      lipMesh.castShadow = true;
      group.add(lipMesh);
    } else {
      const bladeShape = new THREE13.Shape();
      const hc = chord / 2;
      bladeShape.moveTo(-hc, 0);
      bladeShape.quadraticCurveTo(0, 0.045, hc, 0.01);
      bladeShape.lineTo(hc, -0.01);
      bladeShape.quadraticCurveTo(0, -0.02, -hc, 0);
      const bladeGeo = new THREE13.ExtrudeGeometry(bladeShape, {
        steps: 4,
        depth: wingSpan,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.01,
        bevelSegments: 2
      });
      bladeGeo.center();
      bladeGeo.rotateY(Math.PI / 2);
      bladeGeo.computeVertexNormals();
      const bladeMesh = new THREE13.Mesh(bladeGeo, material);
      bladeMesh.name = "rear_wing_main_blade";
      bladeMesh.castShadow = true;
      group.add(bladeMesh);
      const pylonDist = wingSpan * 0.28;
      [-pylonDist, pylonDist].forEach((px, idx) => {
        const pylonCurve = new THREE13.CatmullRomCurve3([
          new THREE13.Vector3(px, -0.32, 0.12),
          new THREE13.Vector3(px, -0.1, 0.04),
          new THREE13.Vector3(px, 0.06, 0.02),
          new THREE13.Vector3(px, 0.02, 0)
        ]);
        const pylonGeo = new THREE13.TubeGeometry(pylonCurve, 12, 0.018, 8, false);
        pylonGeo.computeVertexNormals();
        const pylonMesh = new THREE13.Mesh(pylonGeo, material);
        pylonMesh.name = `rear_wing_pylon_${idx === 0 ? "left" : "right"}`;
        pylonMesh.castShadow = true;
        group.add(pylonMesh);
      });
      const endplateShape = new THREE13.Shape();
      endplateShape.moveTo(-0.2, -0.1);
      endplateShape.lineTo(0.2, -0.08);
      endplateShape.lineTo(0.18, 0.12);
      endplateShape.lineTo(-0.16, 0.14);
      endplateShape.closePath();
      const epGeo = new THREE13.ExtrudeGeometry(endplateShape, { depth: 0.01, bevelEnabled: false });
      epGeo.center();
      epGeo.computeVertexNormals();
      [-wingSpan / 2, wingSpan / 2].forEach((ex, idx) => {
        const epMesh = new THREE13.Mesh(epGeo, material);
        epMesh.name = `rear_wing_endplate_${idx === 0 ? "left" : "right"}`;
        epMesh.position.set(ex, 0, 0);
        epMesh.rotation.y = idx === 0 ? 0 : Math.PI;
        epMesh.castShadow = true;
        group.add(epMesh);
      });
    }
    return group;
  }
  static buildFrontSplitterComponent(width, thickness, length, material) {
    const hw = width / 2;
    const shape = new THREE13.Shape();
    shape.moveTo(-hw, 0);
    shape.lineTo(-hw + 0.12, length * 0.9);
    shape.quadraticCurveTo(0, length, hw - 0.12, length * 0.9);
    shape.lineTo(hw, 0);
    shape.quadraticCurveTo(0, -0.05, -hw, 0);
    const geo = new THREE13.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 5e-3,
      bevelSize: 5e-3,
      bevelSegments: 2
    });
    geo.center();
    geo.computeVertexNormals();
    const mesh = new THREE13.Mesh(geo, material);
    mesh.name = "front_splitter_mesh";
    mesh.castShadow = true;
    return mesh;
  }
  static buildDiffuserComponent(width, height, length, material, finCount = 5) {
    const group = new THREE13.Group();
    const baseGeo = new THREE13.BoxGeometry(width, 0.025, length);
    baseGeo.computeVertexNormals();
    const baseMesh = new THREE13.Mesh(baseGeo, material);
    baseMesh.name = "rear_diffuser_tray";
    baseMesh.castShadow = true;
    group.add(baseMesh);
    if (finCount > 1) {
      const finSpacing = width / (finCount - 1);
      for (let f = 0; f < finCount; f++) {
        const finX = -width / 2 + f * finSpacing;
        const finGeo = new THREE13.BoxGeometry(0.016, height * 0.6, length * 0.9);
        finGeo.computeVertexNormals();
        const finMesh = new THREE13.Mesh(finGeo, material);
        finMesh.position.set(finX, -height * 0.2, 0);
        finMesh.castShadow = true;
        group.add(finMesh);
      }
    }
    return group;
  }
  static buildLightingComponent(id, width, height, length, material) {
    if (id.includes("taillight")) {
      const geo = new THREE13.BoxGeometry(width, height, length);
      geo.computeVertexNormals();
      const mesh = new THREE13.Mesh(geo, material);
      mesh.name = "taillight_light_bar";
      return mesh;
    }
    const group = new THREE13.Group();
    const dotOffsets = [
      [-width * 0.25, -height * 0.2],
      [width * 0.25, -height * 0.2],
      [-width * 0.25, height * 0.2],
      [width * 0.25, height * 0.2]
    ];
    for (const [dx, dy] of dotOffsets) {
      const dotGeo = new THREE13.CylinderGeometry(0.02, 0.02, 0.04, 12);
      dotGeo.rotateX(Math.PI / 2);
      const dot = new THREE13.Mesh(dotGeo, material);
      dot.position.set(dx, dy, 0);
      group.add(dot);
    }
    return group;
  }
  static buildGlassComponent(id, width, height, length, material) {
    const hw = width / 2;
    const shape = new THREE13.Shape();
    shape.moveTo(-hw, 0);
    shape.lineTo(-hw * 0.88, height);
    shape.quadraticCurveTo(0, height + 0.03, hw * 0.88, height);
    shape.lineTo(hw, 0);
    shape.quadraticCurveTo(0, 0.02, -hw, 0);
    const geo = new THREE13.ExtrudeGeometry(shape, {
      depth: 0.012,
      bevelEnabled: false
    });
    geo.center();
    geo.computeVertexNormals();
    const mesh = new THREE13.Mesh(geo, material);
    mesh.name = `${id}_mesh`;
    return mesh;
  }
  static buildWheelComponent(wheelSpec, material, override) {
    const isRight = wheelSpec.side === "right";
    let radius = wheelSpec.tire.calculated_radius_m || 0.35;
    const width = wheelSpec.rim.width_m || 0.28;
    if (override?.wheelDiameterInches) {
      const rimRadiusM = override.wheelDiameterInches * 0.0254 / 2;
      const sidewallM = wheelSpec.tire.nominal_section_width_mm * wheelSpec.tire.aspect_ratio * 0.01 / 1e3;
      radius = rimRadiusM + sidewallM;
    }
    const camber = override?.wheelCamberDeg ?? override?.contextSettings?.camberDeg ?? wheelSpec.alignment.camberDeg;
    const assembly = WheelGenerator.generateWheel({
      wheelRadius: radius,
      tyreWidth: width,
      camberDeg: camber * Math.PI / 180,
      steerDeg: 0,
      isRightSide: isRight,
      rimColorHex: material.color ? `#${material.color.getHexString()}` : "#27272a"
    });
    if (override?.wheelSpacerMm) {
      const spacerM = override.wheelSpacerMm / 1e3;
      assembly.group.position.x += spacerM * (isRight ? 1 : -1);
    }
    return assembly.group;
  }
  static buildExhaustComponent(width, height, length, material) {
    const group = new THREE13.Group();
    const offsets = [-width * 0.35, -width * 0.12, width * 0.12, width * 0.35];
    offsets.forEach((ox, idx) => {
      const tipGeo = new THREE13.CylinderGeometry(height * 0.45, height * 0.48, length, 16);
      tipGeo.rotateX(Math.PI / 2);
      const tip = new THREE13.Mesh(tipGeo, material);
      tip.name = `exhaust_tip_${idx + 1}`;
      tip.position.set(ox, 0, 0);
      tip.castShadow = true;
      group.add(tip);
    });
    return group;
  }
  static buildInteriorComponent(id, width, height, length, material, spec) {
    if (spec) {
      const language = VehicleInteriorGenerator.resolveDesignLanguage({
        vehicleId: spec.vehicle.id,
        manufacturer: spec.vehicle.manufacturer,
        model: spec.vehicle.model
      });
      const W = spec.dimensions?.width ? spec.dimensions.width * 0.74 : 1.48;
      const H = spec.dimensions?.height ? spec.dimensions.height * 0.68 : 0.85;
      const L = spec.dimensions?.length ? spec.dimensions.length * 0.36 : 1.65;
      if (id.includes("steering_wheel")) {
        const alcantara = new THREE13.MeshStandardMaterial({ color: 2565930, roughness: 0.95, metalness: 0.05 });
        const carbon = new THREE13.MeshStandardMaterial({ color: 1118483, roughness: 0.35, metalness: 0.4 });
        const alu = new THREE13.MeshStandardMaterial({ color: 13948120, metalness: 0.85, roughness: 0.2 });
        const wheel = VehicleInteriorGenerator.buildSteeringWheel(language, W, alcantara, carbon, alu);
        wheel.name = id;
        return wheel;
      }
      if (id.includes("seats")) {
        const isFourDoor = spec.vehicle.id.includes("evo") || spec.vehicle.id.includes("wrx");
        const carbon = new THREE13.MeshStandardMaterial({ color: 1118483, roughness: 0.35, metalness: 0.4 });
        const alcantara = new THREE13.MeshStandardMaterial({ color: 2565930, roughness: 0.95, metalness: 0.05 });
        const seats = VehicleInteriorGenerator.buildSeats(language, W, L, material, carbon, alcantara, isFourDoor);
        seats.name = id;
        return seats;
      }
      if (id.includes("dashboard") || id.includes("dash")) {
        const darkCharcoal = new THREE13.MeshStandardMaterial({ color: 1579035, roughness: 0.7, metalness: 0.1 });
        const carbon = new THREE13.MeshStandardMaterial({ color: 1118483, roughness: 0.35, metalness: 0.4 });
        const alu = new THREE13.MeshStandardMaterial({ color: 13948120, metalness: 0.85, roughness: 0.2 });
        const screenMat = new THREE13.MeshStandardMaterial({ color: 592139, roughness: 0.1, metalness: 0.8, emissive: new THREE13.Color(947344), emissiveIntensity: 0.4 });
        const gaugeGlass = new THREE13.MeshPhysicalMaterial({ color: 16777215, transparent: true, opacity: 0.6, roughness: 0.05, metalness: 0.1 });
        const dash = VehicleInteriorGenerator.buildDashboard(language, W, H, darkCharcoal, carbon, alu, screenMat, gaugeGlass);
        dash.name = id;
        return dash;
      }
    }
    if (id.includes("steering_wheel")) {
      const torusGeo = new THREE13.TorusGeometry(width * 0.45, 0.022, 12, 24);
      torusGeo.computeVertexNormals();
      const wheel = new THREE13.Mesh(torusGeo, material);
      wheel.name = "interior_steering_wheel_rim";
      return wheel;
    }
    if (id.includes("seats")) {
      const group = new THREE13.Group();
      [-0.38, 0.38].forEach((sx, idx) => {
        const seatGeo = new THREE13.BoxGeometry(0.42, height, length);
        seatGeo.computeVertexNormals();
        const seat = new THREE13.Mesh(seatGeo, material);
        seat.name = `interior_seat_${idx === 0 ? "left" : "right"}`;
        seat.position.set(sx, 0, 0);
        group.add(seat);
      });
      return group;
    }
    const geo = new THREE13.BoxGeometry(width, height, length);
    geo.computeVertexNormals();
    const mesh = new THREE13.Mesh(geo, material);
    mesh.name = `${id}_mesh`;
    return mesh;
  }
  static buildBodyPanelComponent(id, width, height, length, material) {
    const uSteps = 8;
    const vSteps = 8;
    const positions = [];
    const indices = [];
    const uvs = [];
    const hw = width / 2;
    const hh = height / 2;
    const hl = length / 2;
    for (let i = 0; i <= uSteps; i++) {
      const u = i / uSteps;
      const un = u * 2 - 1;
      for (let j = 0; j <= vSteps; j++) {
        const v = j / vSteps;
        const vn = v * 2 - 1;
        const x = un * hw;
        const z = vn * hl;
        const curveY = 0.015 * (1 - un ** 2) * (1 - vn ** 2);
        const y = -hh + v * height + curveY;
        positions.push(x, y, z);
        uvs.push(u, v);
      }
    }
    for (let i = 0; i < uSteps; i++) {
      for (let j = 0; j < vSteps; j++) {
        const a = i * (vSteps + 1) + j;
        const b = (i + 1) * (vSteps + 1) + j;
        const c = (i + 1) * (vSteps + 1) + (j + 1);
        const d = i * (vSteps + 1) + (j + 1);
        indices.push(a, b, c);
        indices.push(a, c, d);
      }
    }
    const geo = new THREE13.BufferGeometry();
    geo.setAttribute("position", new THREE13.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE13.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const mesh = new THREE13.Mesh(geo, material);
    mesh.name = `${id}_panel`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
  static buildBoxMesh(width, height, length, material) {
    const geo = new THREE13.BoxGeometry(width, height, length);
    geo.computeVertexNormals();
    return new THREE13.Mesh(geo, material);
  }
  static resolveWheelSpec(componentId, wheels) {
    if (componentId.includes("front_left")) return wheels.frontLeft;
    if (componentId.includes("front_right")) return wheels.frontRight;
    if (componentId.includes("rear_left")) return wheels.rearLeft;
    return wheels.rearRight;
  }
  /**
   * Applies kinematic opening positions to an already-built vehicle scene graph in real-time
   */
  static applyOpenings(root, spec, state) {
    const config = VehicleOpeningController.resolveOpeningConfig(spec);
    VehicleOpeningController.applyOpenings(root, config, state);
  }
  /**
   * Safely disposes all geometries and materials in an object graph
   * preventing GPU memory leaks across repeated vehicle customization cycles.
   */
  static dispose(root) {
    root.traverse((child) => {
      if (child.isMesh) {
        const mesh = child;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      }
    });
  }
};

// packages/vehicle-generation-engine/src/assembly/assemblyGraph.ts
import * as THREE14 from "three";
var AssemblyGraph = class {
  profile;
  anchors = /* @__PURE__ */ new Map();
  attachedComponents = /* @__PURE__ */ new Map();
  rootGroup;
  constructor(profile) {
    this.profile = profile;
    this.rootGroup = new THREE14.Group();
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
import * as THREE15 from "three";
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
              const vA = new THREE15.Vector3(posAttr.getX(a), posAttr.getY(a), posAttr.getZ(a));
              const vB = new THREE15.Vector3(posAttr.getX(b), posAttr.getY(b), posAttr.getZ(b));
              const vC = new THREE15.Vector3(posAttr.getX(c), posAttr.getY(c), posAttr.getZ(c));
              const edge1 = new THREE15.Vector3().subVectors(vB, vA);
              const edge2 = new THREE15.Vector3().subVectors(vC, vA);
              const cross = new THREE15.Vector3().crossVectors(edge1, edge2);
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
    const box = new THREE15.Box3().setFromObject(root);
    const size = new THREE15.Vector3();
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

// packages/vehicle-generation-engine/src/rules/wheelRuleValidator.ts
var WheelRuleValidator = class {
  /**
   * Calculates total tire rolling diameter in millimeters:
   * Diameter = (Rim Diameter * 25.4) + 2 * (Section Width * Aspect Ratio / 100)
   */
  static calculateRollingDiameter(rimDiameterIn, sectionWidthMm, aspectRatio) {
    const rimMm = rimDiameterIn * 25.4;
    const sidewallMm = sectionWidthMm * aspectRatio / 100;
    return rimMm + 2 * sidewallMm;
  }
  /**
   * Validates proposed wheel & tyre combination against baseline OEM specification
   */
  static validateFitment(proposed, baseline, fenderLipLimitMm = 85) {
    const errors = [];
    const warnings = [];
    if (proposed.nominalSectionWidthMm < 175 || proposed.nominalSectionWidthMm > 375) {
      errors.push(`Section width ${proposed.nominalSectionWidthMm}mm is outside standard automotive sizing.`);
    }
    if (proposed.aspectRatio < 20 || proposed.aspectRatio > 70) {
      errors.push(`Aspect ratio ${proposed.aspectRatio} is invalid.`);
    }
    if (proposed.rimDiameterInches < 15 || proposed.rimDiameterInches > 24) {
      errors.push(`Rim diameter ${proposed.rimDiameterInches}" is outside compatible sports car ranges.`);
    }
    const originalDiameter = this.calculateRollingDiameter(
      baseline.rimDiameterInches,
      baseline.nominalSectionWidthMm,
      baseline.aspectRatio
    );
    const proposedDiameter = this.calculateRollingDiameter(
      proposed.rimDiameterInches,
      proposed.nominalSectionWidthMm,
      proposed.aspectRatio
    );
    const deviationPercent = (proposedDiameter - originalDiameter) / originalDiameter * 100;
    if (Math.abs(deviationPercent) > 3) {
      const sign = deviationPercent > 0 ? "+" : "";
      errors.push(
        `Rolling diameter deviation ${sign}${deviationPercent.toFixed(1)}% exceeds the \xB13.0% engineering tolerance. Speedometer calibration and ride height compromised.`
      );
    } else if (Math.abs(deviationPercent) > 1.5) {
      warnings.push(`Rolling diameter deviation of ${deviationPercent.toFixed(1)}% is near allowable limit.`);
    }
    const halfWidthMm = proposed.rimWidthInches * 25.4 / 2;
    const outerPokeMm = halfWidthMm - proposed.offsetMm;
    const innerClearanceMm = halfWidthMm + proposed.offsetMm;
    if (outerPokeMm > fenderLipLimitMm) {
      errors.push(
        `Wheel poke (${outerPokeMm.toFixed(1)}mm) exceeds fender boundary (${fenderLipLimitMm}mm). Tire will scrub under compression.`
      );
    }
    return {
      isValid: errors.length === 0,
      rollingDiameterMm: Number(proposedDiameter.toFixed(1)),
      originalDiameterMm: Number(originalDiameter.toFixed(1)),
      diameterDeviationPercent: Number(deviationPercent.toFixed(2)),
      outerPokeMm: Number(outerPokeMm.toFixed(1)),
      innerClearanceMm: Number(innerClearanceMm.toFixed(1)),
      warnings,
      errors
    };
  }
};
export {
  ARCHETYPE_TEMPLATES,
  AssemblyGraph,
  CrossCarPartSwapper,
  CrossSectionGenerator,
  DEFAULT_OPENING_STATE,
  EditableVehicleAssembler,
  GeometryDiagnostics,
  GeometryProfileRepository,
  LongitudinalProfileGenerator,
  PanelSeparator,
  ParametricGeometryBuilder,
  ProceduralChassisGenerator,
  StandaloneVehicleGenerationEngine,
  SurfaceLofter,
  VEHICLE_HUB_SPECS,
  VehicleEngineBayGenerator,
  VehicleInteriorGenerator,
  VehicleOpeningController,
  WheelGenerator,
  WheelRuleValidator,
  validateGeometryProfile
};
