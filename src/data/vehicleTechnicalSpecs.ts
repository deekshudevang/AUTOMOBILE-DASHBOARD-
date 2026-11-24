// AUTOVERSE — 50 Vehicle Fleet Technical Performance & Engineering Specifications

export interface VehicleTechnicalSpecs {
  assetId: string;
  powertrain: string;
  engineDisplacement: string;
  powerHp: number;
  torqueNm: number;
  weightKg: number;
  topSpeedKmh: number;
  zeroToHundredS: number;
  dragCoefficient: number;
  downforceKg: number;
  downforceSpeedKmh: number;
  drivetrain: 'RWD' | 'AWD' | 'FWD';
  transmission: string;
  doorMechanism: 'Conventional' | 'Scissor' | 'Butterfly / Dihedral' | 'Gullwing' | 'Synchro-Helix' | 'Suicide Coach';
}

export const FLEET_TECHNICAL_SPECS: Record<string, Partial<VehicleTechnicalSpecs>> = {
  // Supercars
  'lamborghini_aventador_svj': {
    powertrain: '6.5L Naturally Aspirated V12',
    engineDisplacement: '6,498 cc',
    powerHp: 770,
    torqueNm: 720,
    weightKg: 1525,
    topSpeedKmh: 352,
    zeroToHundredS: 2.8,
    dragCoefficient: 0.36,
    downforceKg: 490,
    downforceSpeedKmh: 250,
    drivetrain: 'AWD',
    transmission: '7-Speed Independent Shifting Rods (ISR)',
    doorMechanism: 'Scissor'
  },
  'lamborghini_huracan_sto': {
    powertrain: '5.2L Naturally Aspirated V10',
    engineDisplacement: '5,204 cc',
    powerHp: 640,
    torqueNm: 565,
    weightKg: 1339,
    topSpeedKmh: 310,
    zeroToHundredS: 3.0,
    dragCoefficient: 0.38,
    downforceKg: 450,
    downforceSpeedKmh: 280,
    drivetrain: 'RWD',
    transmission: '7-Speed Dual-Clutch (LDF)',
    doorMechanism: 'Conventional'
  },
  'lamborghini_revuelto': {
    powertrain: '6.5L V12 + 3 Electric Motors (HPEV)',
    engineDisplacement: '6,498 cc',
    powerHp: 1015,
    torqueNm: 807,
    weightKg: 1772,
    topSpeedKmh: 350,
    zeroToHundredS: 2.5,
    dragCoefficient: 0.34,
    downforceKg: 610,
    downforceSpeedKmh: 280,
    drivetrain: 'AWD',
    transmission: '8-Speed Dual-Clutch Transverse',
    doorMechanism: 'Scissor'
  },
  'ferrari_488_pista': {
    powertrain: '3.9L Twin-Turbocharged V8',
    engineDisplacement: '3,902 cc',
    powerHp: 720,
    torqueNm: 770,
    weightKg: 1380,
    topSpeedKmh: 340,
    zeroToHundredS: 2.85,
    dragCoefficient: 0.35,
    downforceKg: 390,
    downforceSpeedKmh: 200,
    drivetrain: 'RWD',
    transmission: '7-Speed F1 Dual-Clutch',
    doorMechanism: 'Conventional'
  },
  'ferrari_f8_tributo': {
    powertrain: '3.9L Twin-Turbocharged V8',
    engineDisplacement: '3,902 cc',
    powerHp: 720,
    torqueNm: 770,
    weightKg: 1435,
    topSpeedKmh: 340,
    zeroToHundredS: 2.9,
    dragCoefficient: 0.34,
    downforceKg: 300,
    downforceSpeedKmh: 200,
    drivetrain: 'RWD',
    transmission: '7-Speed F1 Dual-Clutch',
    doorMechanism: 'Conventional'
  },
  'ferrari_296_gtb': {
    powertrain: '3.0L 120° Twin-Turbo V6 Hybrid',
    engineDisplacement: '2,992 cc',
    powerHp: 830,
    torqueNm: 740,
    weightKg: 1470,
    topSpeedKmh: 330,
    zeroToHundredS: 2.9,
    dragCoefficient: 0.33,
    downforceKg: 360,
    downforceSpeedKmh: 250,
    drivetrain: 'RWD',
    transmission: '8-Speed F1 Dual-Clutch',
    doorMechanism: 'Conventional'
  },
  'ferrari_sf90_stradale': {
    powertrain: '4.0L Twin-Turbo V8 + 3 Electric Motors',
    engineDisplacement: '3,990 cc',
    powerHp: 1000,
    torqueNm: 800,
    weightKg: 1570,
    topSpeedKmh: 340,
    zeroToHundredS: 2.5,
    dragCoefficient: 0.34,
    downforceKg: 390,
    downforceSpeedKmh: 250,
    drivetrain: 'AWD',
    transmission: '8-Speed F1 Dual-Clutch',
    doorMechanism: 'Conventional'
  },
  'mclaren_720s': {
    powertrain: '4.0L Twin-Turbo M840T V8',
    engineDisplacement: '3,994 cc',
    powerHp: 720,
    torqueNm: 770,
    weightKg: 1419,
    topSpeedKmh: 341,
    zeroToHundredS: 2.9,
    dragCoefficient: 0.36,
    downforceKg: 350,
    downforceSpeedKmh: 250,
    drivetrain: 'RWD',
    transmission: '7-Speed Seamless Shift Gearbox (SSG)',
    doorMechanism: 'Butterfly / Dihedral'
  },
  'mclaren_765lt': {
    powertrain: '4.0L Twin-Turbo M840T V8 Longtail',
    engineDisplacement: '3,994 cc',
    powerHp: 765,
    torqueNm: 800,
    weightKg: 1339,
    topSpeedKmh: 330,
    zeroToHundredS: 2.8,
    dragCoefficient: 0.38,
    downforceKg: 520,
    downforceSpeedKmh: 250,
    drivetrain: 'RWD',
    transmission: '7-Speed SSG Motorsport Tuned',
    doorMechanism: 'Butterfly / Dihedral'
  },
  'porsche_911_gt3_rs_2022': {
    powertrain: '4.0L High-Revving Naturally Aspirated Flat-6',
    engineDisplacement: '3,996 cc',
    powerHp: 525,
    torqueNm: 465,
    weightKg: 1450,
    topSpeedKmh: 296,
    zeroToHundredS: 3.2,
    dragCoefficient: 0.38,
    downforceKg: 860,
    downforceSpeedKmh: 285,
    drivetrain: 'RWD',
    transmission: '7-Speed Porsche Doppelkupplung (PDK)',
    doorMechanism: 'Conventional'
  },
  'porsche_911_turbo_s': {
    powertrain: '3.7L Twin-Turbo Flat-6 with VTG',
    engineDisplacement: '3,745 cc',
    powerHp: 650,
    torqueNm: 800,
    weightKg: 1640,
    topSpeedKmh: 330,
    zeroToHundredS: 2.7,
    dragCoefficient: 0.33,
    downforceKg: 170,
    downforceSpeedKmh: 300,
    drivetrain: 'AWD',
    transmission: '8-Speed Porsche Doppelkupplung (PDK)',
    doorMechanism: 'Conventional'
  },
  'porsche_cayman_gt4_rs': {
    powertrain: '4.0L Naturally Aspirated Flat-6',
    engineDisplacement: '3,996 cc',
    powerHp: 500,
    torqueNm: 450,
    weightKg: 1415,
    topSpeedKmh: 315,
    zeroToHundredS: 3.4,
    dragCoefficient: 0.37,
    downforceKg: 220,
    downforceSpeedKmh: 200,
    drivetrain: 'RWD',
    transmission: '7-Speed PDK Short-Ratio',
    doorMechanism: 'Conventional'
  },
  'chevrolet_corvette_c8_z06': {
    powertrain: '5.5L LT6 Flat-Plane Crank NA V8',
    engineDisplacement: '5,463 cc',
    powerHp: 670,
    torqueNm: 624,
    weightKg: 1560,
    topSpeedKmh: 314,
    zeroToHundredS: 2.6,
    dragCoefficient: 0.38,
    downforceKg: 333,
    downforceSpeedKmh: 300,
    drivetrain: 'RWD',
    transmission: '8-Speed Tremec Dual-Clutch',
    doorMechanism: 'Conventional'
  },

  // Hypercars
  'bugatti_chiron_super_sport': {
    powertrain: '8.0L Quad-Turbocharged W16',
    engineDisplacement: '7,993 cc',
    powerHp: 1600,
    torqueNm: 1600,
    weightKg: 1995,
    topSpeedKmh: 440,
    zeroToHundredS: 2.4,
    dragCoefficient: 0.35,
    downforceKg: 380,
    downforceSpeedKmh: 350,
    drivetrain: 'AWD',
    transmission: '7-Speed Dual-Clutch Ricardo',
    doorMechanism: 'Conventional'
  },
  'bugatti_divo': {
    powertrain: '8.0L Quad-Turbocharged W16',
    engineDisplacement: '7,993 cc',
    powerHp: 1500,
    torqueNm: 1600,
    weightKg: 1960,
    topSpeedKmh: 380,
    zeroToHundredS: 2.4,
    dragCoefficient: 0.39,
    downforceKg: 456,
    downforceSpeedKmh: 300,
    drivetrain: 'AWD',
    transmission: '7-Speed Dual-Clutch Ricardo',
    doorMechanism: 'Conventional'
  },
  'bugatti_bolide': {
    powertrain: '8.0L Quad-Turbo W16 (Track Special)',
    engineDisplacement: '7,993 cc',
    powerHp: 1850,
    torqueNm: 1850,
    weightKg: 1450,
    topSpeedKmh: 500,
    zeroToHundredS: 2.17,
    dragCoefficient: 0.41,
    downforceKg: 3000,
    downforceSpeedKmh: 320,
    drivetrain: 'AWD',
    transmission: '7-Speed Motorsport DSG',
    doorMechanism: 'Butterfly / Dihedral'
  },
  'koenigsegg_jesko_attack': {
    powertrain: '5.0L Twin-Turbo Flat-Plane V8',
    engineDisplacement: '5,065 cc',
    powerHp: 1600,
    torqueNm: 1500,
    weightKg: 1420,
    topSpeedKmh: 480,
    zeroToHundredS: 2.5,
    dragCoefficient: 0.40,
    downforceKg: 1400,
    downforceSpeedKmh: 275,
    drivetrain: 'RWD',
    transmission: '9-Speed Light Speed Transmission (LST)',
    doorMechanism: 'Synchro-Helix'
  },
  'koenigsegg_regera': {
    powertrain: '5.0L Twin-Turbo V8 + 3 YASA Electric Motors',
    engineDisplacement: '5,065 cc',
    powerHp: 1500,
    torqueNm: 2000,
    weightKg: 1590,
    topSpeedKmh: 404,
    zeroToHundredS: 2.8,
    dragCoefficient: 0.35,
    downforceKg: 450,
    downforceSpeedKmh: 250,
    drivetrain: 'RWD',
    transmission: 'Direct Drive (KDD - 1 Speed)',
    doorMechanism: 'Synchro-Helix'
  },
  'koenigsegg_gemera': {
    powertrain: '5.0L Twin-Turbo Hot-V8 + Dark Matter E-Motor',
    engineDisplacement: '5,000 cc',
    powerHp: 2300,
    torqueNm: 2750,
    weightKg: 1950,
    topSpeedKmh: 400,
    zeroToHundredS: 1.9,
    dragCoefficient: 0.36,
    downforceKg: 350,
    downforceSpeedKmh: 250,
    drivetrain: 'AWD',
    transmission: '9-Speed LST Tourbillon',
    doorMechanism: 'Synchro-Helix'
  },
  'pagani_huayra_bc': {
    powertrain: '6.0L Mercedes-AMG Twin-Turbo V12',
    engineDisplacement: '5,980 cc',
    powerHp: 800,
    torqueNm: 1050,
    weightKg: 1218,
    topSpeedKmh: 370,
    zeroToHundredS: 2.8,
    dragCoefficient: 0.37,
    downforceKg: 500,
    downforceSpeedKmh: 280,
    drivetrain: 'RWD',
    transmission: '7-Speed Xtrac Automated Sequential',
    doorMechanism: 'Gullwing'
  },
  'pagani_utopia': {
    powertrain: '6.0L Mercedes-AMG Twin-Turbo V12',
    engineDisplacement: '5,980 cc',
    powerHp: 864,
    torqueNm: 1100,
    weightKg: 1280,
    topSpeedKmh: 354,
    zeroToHundredS: 2.9,
    dragCoefficient: 0.34,
    downforceKg: 420,
    downforceSpeedKmh: 250,
    drivetrain: 'RWD',
    transmission: '7-Speed Xtrac Manual / Automated',
    doorMechanism: 'Butterfly / Dihedral'
  },
  'mclaren_p1': {
    powertrain: '3.8L Twin-Turbo V8 + Lightweight E-Motor',
    engineDisplacement: '3,799 cc',
    powerHp: 916,
    torqueNm: 900,
    weightKg: 1450,
    topSpeedKmh: 350,
    zeroToHundredS: 2.8,
    dragCoefficient: 0.34,
    downforceKg: 600,
    downforceSpeedKmh: 257,
    drivetrain: 'RWD',
    transmission: '7-Speed Dual-Clutch SSG',
    doorMechanism: 'Butterfly / Dihedral'
  },
  'porsche_918_spyder': {
    powertrain: '4.6L Naturally Aspirated V8 + 2 E-Motors',
    engineDisplacement: '4,593 cc',
    powerHp: 887,
    torqueNm: 1280,
    weightKg: 1674,
    topSpeedKmh: 345,
    zeroToHundredS: 2.6,
    dragCoefficient: 0.36,
    downforceKg: 350,
    downforceSpeedKmh: 250,
    drivetrain: 'AWD',
    transmission: '7-Speed Porsche Doppelkupplung (PDK)',
    doorMechanism: 'Conventional'
  },
  'aston_martin_valkyrie': {
    powertrain: '6.5L Cosworth Naturally Aspirated V12 + KERS',
    engineDisplacement: '6,499 cc',
    powerHp: 1160,
    torqueNm: 900,
    weightKg: 1071,
    topSpeedKmh: 355,
    zeroToHundredS: 2.5,
    dragCoefficient: 0.37,
    downforceKg: 1100,
    downforceSpeedKmh: 280,
    drivetrain: 'RWD',
    transmission: '7-Speed Ricardo Single-Clutch Automated',
    doorMechanism: 'Gullwing'
  },
  'mercedes_amg_one': {
    powertrain: '1.6L Formula 1 Turbo V6 + 4 Electric Motors',
    engineDisplacement: '1,599 cc',
    powerHp: 1063,
    torqueNm: 1000,
    weightKg: 1695,
    topSpeedKmh: 352,
    zeroToHundredS: 2.9,
    dragCoefficient: 0.38,
    downforceKg: 700,
    downforceSpeedKmh: 300,
    drivetrain: 'AWD',
    transmission: '7-Speed Automated Manual with Carbon Clutch',
    doorMechanism: 'Butterfly / Dihedral'
  },

  // Track Cars
  'mclaren_senna': {
    powertrain: '4.0L Twin-Turbo M840TR V8',
    engineDisplacement: '3,994 cc',
    powerHp: 800,
    torqueNm: 800,
    weightKg: 1198,
    topSpeedKmh: 335,
    zeroToHundredS: 2.8,
    dragCoefficient: 0.43,
    downforceKg: 800,
    downforceSpeedKmh: 250,
    drivetrain: 'RWD',
    transmission: '7-Speed Dual-Clutch SSG',
    doorMechanism: 'Butterfly / Dihedral'
  },
  'mercedes_amg_gt_black_series': {
    powertrain: '4.0L Flat-Plane Crank Biturbo V8',
    engineDisplacement: '3,982 cc',
    powerHp: 730,
    torqueNm: 800,
    weightKg: 1540,
    topSpeedKmh: 325,
    zeroToHundredS: 3.2,
    dragCoefficient: 0.41,
    downforceKg: 400,
    downforceSpeedKmh: 250,
    drivetrain: 'RWD',
    transmission: '7-Speed AMG SPEEDSHIFT DCT',
    doorMechanism: 'Conventional'
  },
  'bmw_m4_csl_g82': {
    powertrain: '3.0L S58 Twin-Turbo Inline-6',
    engineDisplacement: '2,993 cc',
    powerHp: 550,
    torqueNm: 650,
    weightKg: 1625,
    topSpeedKmh: 307,
    zeroToHundredS: 3.7,
    dragCoefficient: 0.35,
    downforceKg: 180,
    downforceSpeedKmh: 200,
    drivetrain: 'RWD',
    transmission: '8-Speed M Steptronic with Drivelogic',
    doorMechanism: 'Conventional'
  },
  'dodge_viper_acr': {
    powertrain: '8.4L Naturally Aspirated V10',
    engineDisplacement: '8,382 cc',
    powerHp: 645,
    torqueNm: 813,
    weightKg: 1530,
    topSpeedKmh: 285,
    zeroToHundredS: 3.4,
    dragCoefficient: 0.44,
    downforceKg: 900,
    downforceSpeedKmh: 240,
    drivetrain: 'RWD',
    transmission: '6-Speed Tremec TR-6060 Manual',
    doorMechanism: 'Conventional'
  },

  // JDM Performance
  'nissan_gt_r_nismo_r35': {
    powertrain: '3.8L VR38DETT Twin-Turbo V6 (GT3 Turbos)',
    engineDisplacement: '3,799 cc',
    powerHp: 600,
    torqueNm: 652,
    weightKg: 1720,
    topSpeedKmh: 330,
    zeroToHundredS: 2.7,
    dragCoefficient: 0.36,
    downforceKg: 200,
    downforceSpeedKmh: 300,
    drivetrain: 'AWD',
    transmission: '6-Speed Dual-Clutch Transaxle (ATTESA E-TS)',
    doorMechanism: 'Conventional'
  },
  'nissan_skyline_gt_r_r34_vspec_ii': {
    powertrain: '2.6L RB26DETT Twin-Turbo Inline-6',
    engineDisplacement: '2,568 cc',
    powerHp: 327,
    torqueNm: 392,
    weightKg: 1560,
    topSpeedKmh: 266,
    zeroToHundredS: 4.8,
    dragCoefficient: 0.34,
    downforceKg: 80,
    downforceSpeedKmh: 200,
    drivetrain: 'AWD',
    transmission: '6-Speed Getrag Manual (ATTESA E-TS Pro)',
    doorMechanism: 'Conventional'
  },
  'toyota_gr_supra_a90': {
    powertrain: '3.0L B58 Twin-Scroll Turbo Inline-6',
    engineDisplacement: '2,998 cc',
    powerHp: 382,
    torqueNm: 500,
    weightKg: 1500,
    topSpeedKmh: 250,
    zeroToHundredS: 3.9,
    dragCoefficient: 0.30,
    downforceKg: 90,
    downforceSpeedKmh: 200,
    drivetrain: 'RWD',
    transmission: '8-Speed ZF Sport Automatic',
    doorMechanism: 'Conventional'
  },
  'mazda_rx7_fd3s_spirit_r': {
    powertrain: '1.3L 13B-REW Sequential Twin-Turbo Rotary',
    engineDisplacement: '1,308 cc (Twin Rotor)',
    powerHp: 280,
    torqueNm: 314,
    weightKg: 1270,
    topSpeedKmh: 255,
    zeroToHundredS: 5.0,
    dragCoefficient: 0.31,
    downforceKg: 60,
    downforceSpeedKmh: 180,
    drivetrain: 'RWD',
    transmission: '5-Speed Short-Throw Manual',
    doorMechanism: 'Conventional'
  },
  'honda_nsx_type_s_nc1': {
    powertrain: '3.5L Twin-Turbo V6 + 3 Sport Hybrid Motors',
    engineDisplacement: '3,493 cc',
    powerHp: 600,
    torqueNm: 667,
    weightKg: 1770,
    topSpeedKmh: 307,
    zeroToHundredS: 2.9,
    dragCoefficient: 0.34,
    downforceKg: 190,
    downforceSpeedKmh: 250,
    drivetrain: 'AWD',
    transmission: '9-Speed Dual-Clutch (SH-AWD)',
    doorMechanism: 'Conventional'
  },
  'lexus_lfa': {
    powertrain: '4.8L 1LR-GUE Naturally Aspirated 72° V10',
    engineDisplacement: '4,805 cc',
    powerHp: 560,
    torqueNm: 480,
    weightKg: 1480,
    topSpeedKmh: 326,
    zeroToHundredS: 3.6,
    dragCoefficient: 0.31,
    downforceKg: 140,
    downforceSpeedKmh: 250,
    drivetrain: 'RWD',
    transmission: '6-Speed ASG Automated Sequential',
    doorMechanism: 'Conventional'
  },

  // Luxury & GT
  'rolls_royce_spectre': {
    powertrain: 'Dual Motor Ultra-Luxury Electric Drive (BEV)',
    engineDisplacement: '102 kWh Battery',
    powerHp: 584,
    torqueNm: 900,
    weightKg: 2890,
    topSpeedKmh: 250,
    zeroToHundredS: 4.5,
    dragCoefficient: 0.25,
    downforceKg: 110,
    downforceSpeedKmh: 200,
    drivetrain: 'AWD',
    transmission: 'Single-Speed Planer Suspension Drive',
    doorMechanism: 'Suicide Coach'
  },
  'bentley_continental_gt_speed': {
    powertrain: '6.0L Twin-Turbocharged W12 TSI',
    engineDisplacement: '5,950 cc',
    powerHp: 659,
    torqueNm: 900,
    weightKg: 2273,
    topSpeedKmh: 335,
    zeroToHundredS: 3.5,
    dragCoefficient: 0.31,
    downforceKg: 120,
    downforceSpeedKmh: 250,
    drivetrain: 'AWD',
    transmission: '8-Speed Dual-Clutch Active AWD',
    doorMechanism: 'Conventional'
  },
  'aston_martin_dbs_superleggera': {
    powertrain: '5.2L Twin-Turbocharged V12',
    engineDisplacement: '5,204 cc',
    powerHp: 725,
    torqueNm: 900,
    weightKg: 1693,
    topSpeedKmh: 340,
    zeroToHundredS: 3.4,
    dragCoefficient: 0.34,
    downforceKg: 180,
    downforceSpeedKmh: 300,
    drivetrain: 'RWD',
    transmission: '8-Speed ZF Torque Converter',
    doorMechanism: 'Conventional'
  }
};

const DEFAULT_SUPERCAR_SPECS: VehicleTechnicalSpecs = {
  assetId: 'generic_supercar',
  powertrain: '4.0L Twin-Turbo V8 Engine',
  engineDisplacement: '3,996 cc',
  powerHp: 650,
  torqueNm: 750,
  weightKg: 1480,
  topSpeedKmh: 330,
  zeroToHundredS: 3.1,
  dragCoefficient: 0.35,
  downforceKg: 280,
  downforceSpeedKmh: 250,
  drivetrain: 'RWD',
  transmission: '7-Speed Dual-Clutch Transmission',
  doorMechanism: 'Conventional'
};

export function getVehicleTechnicalSpecs(assetIdOrFileName: string): VehicleTechnicalSpecs {
  if (!assetIdOrFileName) return DEFAULT_SUPERCAR_SPECS;

  // Clean identifier
  const cleanId = assetIdOrFileName
    .replace(/^.*\//, '')
    .replace(/\.json$/, '')
    .toLowerCase();

  // 1. Direct key match
  if (FLEET_TECHNICAL_SPECS[cleanId]) {
    return {
      ...DEFAULT_SUPERCAR_SPECS,
      ...FLEET_TECHNICAL_SPECS[cleanId],
      assetId: cleanId
    };
  }

  // 2. Partial match in keys
  for (const [key, spec] of Object.entries(FLEET_TECHNICAL_SPECS)) {
    if (cleanId.includes(key) || key.includes(cleanId)) {
      return {
        ...DEFAULT_SUPERCAR_SPECS,
        ...spec,
        assetId: key
      };
    }
  }

  // 3. Fallback heuristic based on vehicle name tokens
  let doorMech: VehicleTechnicalSpecs['doorMechanism'] = 'Conventional';
  if (cleanId.includes('aventador') || cleanId.includes('countach') || cleanId.includes('murcielago') || cleanId.includes('diablo')) {
    doorMech = 'Scissor';
  } else if (cleanId.includes('mclaren') || cleanId.includes('laferrari') || cleanId.includes('valkyrie') || cleanId.includes('amg_one')) {
    doorMech = 'Butterfly / Dihedral';
  } else if (cleanId.includes('koenigsegg') || cleanId.includes('jesko')) {
    doorMech = 'Synchro-Helix';
  } else if (cleanId.includes('sls') || cleanId.includes('gullwing') || cleanId.includes('huayra')) {
    doorMech = 'Gullwing';
  } else if (cleanId.includes('spectre') || cleanId.includes('phantom') || cleanId.includes('wraith')) {
    doorMech = 'Suicide Coach';
  }

  return {
    ...DEFAULT_SUPERCAR_SPECS,
    assetId: cleanId,
    doorMechanism: doorMech
  };
}
