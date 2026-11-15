import { toUnsigned32, toSigned32, toHex32 } from '@autoverse/gta-compat';

export interface VehicleIdentityRecord {
  hashUnsigned: number;
  hashSigned: number;
  hex: string;
  codeName: string;
  displayName: string;
  manufacturer: string;
  realWorldModel: string;
  category: 'Supercar' | 'Sports Car' | 'Tuner / Compact' | 'Muscle' | 'SUV / Offroad' | 'Special / Concept';
  confidence: 'VERIFIED_NATIVE' | 'ADDON_MATCH' | 'MANUAL_MAPPING' | 'UNRESOLVED';
  aliases?: string[];
}

export const KNOWN_VEHICLE_REGISTRY: Record<number, VehicleIdentityRecord> = {
  // BMW / Ubermacht
  2709293299: { hashUnsigned: 2709293299, hashSigned: -1585674000, hex: "0xA17C88F3", codeName: "sentinel5", displayName: "Sentinel GTS", manufacturer: "Ubermacht", realWorldModel: "BMW M3 Competition (G80)", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
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
  272929391: { hashUnsigned: 272929391, hashSigned: 272929391, hex: "0x1044926F", codeName: "tempesta", displayName: "Tempesta", manufacturer: "Pegassi", realWorldModel: "Lamborghini Huracán LP610-4", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  4255883207: { hashUnsigned: 4255883207, hashSigned: -39084089, hex: "0xFDAB9FC7", codeName: "polignus", displayName: "Weaponized Ignus (Pursuit)", manufacturer: "Pegassi", realWorldModel: "Lamborghini Sián FKP 37", category: "Supercar", confidence: "ADDON_MATCH" },
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
  4151380270: { hashUnsigned: 4151380270, hashSigned: -143587026, hex: "0xF771092E", codeName: "driftvorschlag", displayName: "Vorschlaghammer", manufacturer: "Benefactor", realWorldModel: "Mercedes-Benz E-Class W124 AMG Hammer", category: "Sedan" as any, confidence: "VERIFIED_NATIVE" },

  // McLaren / Progen
  1663218586: { hashUnsigned: 1663218586, hashSigned: 1663218586, hex: "0x6322B39A", codeName: "t20", displayName: "T20", manufacturer: "Progen", realWorldModel: "McLaren P1", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  3356898886: { hashUnsigned: 3356898886, hashSigned: -938068410, hex: "0xC8163646", codeName: "luiva", displayName: "Luiva", manufacturer: "Progen", realWorldModel: "McLaren Elva", category: "Supercar", confidence: "VERIFIED_NATIVE" },

  // Koenigsegg / Overflod
  1748565021: { hashUnsigned: 1748565021, hashSigned: 1748565021, hex: "0x6838FC1D", codeName: "entity3", displayName: "Entity MT", manufacturer: "Overflod", realWorldModel: "Koenigsegg Jesko Absolut", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  4017955470: { hashUnsigned: 4017955470, hashSigned: -277011826, hex: "0xEF7D228E", codeName: "horus", displayName: "Horus / 760 LH", manufacturer: "Overflod", realWorldModel: "Pagani Zonda 760 LH", category: "Supercar", confidence: "ADDON_MATCH" },
  687627128: { hashUnsigned: 687627128, hashSigned: 687627128, hex: "0x28FC5B78", codeName: "suzume", displayName: "Suzume", manufacturer: "Overflod", realWorldModel: "Koenigsegg Gemera", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  4071505793: { hashUnsigned: 4071505793, hashSigned: -223461503, hex: "0xF2AE3F81", codeName: "pipistrello", displayName: "Pipistrello", manufacturer: "Overflod", realWorldModel: "Estrema Fulminea / Lotus Evija", category: "Supercar", confidence: "VERIFIED_NATIVE" },

  // Bentley / Enus
  1532171089: { hashUnsigned: 1532171089, hashSigned: 1532171089, hex: "0x5B531351", codeName: "deity", displayName: "Deity", manufacturer: "Enus", realWorldModel: "Bentley Flying Spur Gen 3", category: "Sedan" as any, confidence: "VERIFIED_NATIVE" },
  3348919626: { hashUnsigned: 3348919626, hashSigned: -946047670, hex: "0xC79C754A", codeName: "paragon3", displayName: "Paragon S", manufacturer: "Enus", realWorldModel: "Bentley Mulliner Batur", category: "Supercar", confidence: "VERIFIED_NATIVE" },
  1416466158: { hashUnsigned: 1416466158, hashSigned: 1416466158, hex: "0x546D8EEE", codeName: "paragon2", displayName: "Paragon R (Armored)", manufacturer: "Enus", realWorldModel: "Bentley Continental GT Armored", category: "Sports Car", confidence: "VERIFIED_NATIVE" },
  330661258: { hashUnsigned: 330661258, hashSigned: 330661258, hex: "0x13B57D8A", codeName: "cogcabrio", displayName: "Cognoscenti Cabrio", manufacturer: "Enus", realWorldModel: "Bentley Continental GT Convertible", category: "Sports Car", confidence: "VERIFIED_NATIVE" },

  // Custom Land Rover
  2362851406: { hashUnsigned: 2362851406, hashSigned: -1932115890, hex: "0x8CD6404E", codeName: "defendybob", displayName: "Defendy Bob", manufacturer: "Vapid / Custom", realWorldModel: "Land Rover Defender V8", category: "SUV / Offroad", confidence: "ADDON_MATCH" }
};

export function lookupVehicleIdentity(hashInput: number | string): VehicleIdentityRecord | null {
  let hashNum: number;
  if (typeof hashInput === 'string') {
    if (hashInput.startsWith('0x') || hashInput.startsWith('0X')) {
      hashNum = parseInt(hashInput, 16) >>> 0;
    } else {
      hashNum = parseInt(hashInput, 10) >>> 0;
    }
  } else {
    hashNum = toUnsigned32(hashInput);
  }

  return KNOWN_VEHICLE_REGISTRY[hashNum] || null;
}

export class VehicleRegistry {
  resolve(hashInput: number | string): VehicleIdentityRecord | null {
    return lookupVehicleIdentity(hashInput);
  }

  listKnown(): VehicleIdentityRecord[] {
    return Object.values(KNOWN_VEHICLE_REGISTRY);
  }
}
