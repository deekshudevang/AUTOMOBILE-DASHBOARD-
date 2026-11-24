import { BrandDesignLanguage } from './types';

export const paganiDesignLanguage: BrandDesignLanguage = {
  brandId: 'pagani',
  brandName: 'Pagani',
  silhouetteFamily: 'low_hypercar_teardrop',
  proportions: {
    lengthToWheelbaseRatio: 1.66,
    widthToHeightRatio: 1.71,
    frontOverhangRatio: 0.21,
    rearOverhangRatio: 0.20,
    hoodLengthRatio: 0.24,
    cabinLengthRatio: 0.45,
    tumblehomeAngleDeg: 26.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.64, 0.55, 0.46],
    rooflineArc: [1.22, 1.18, 1.01],
    rearDeckRake: [0.93, 0.85, 0.78],
    haunchCurvature: 0.122,
    noseDroop: 0.19
  },
  headlightShape: 'dual_round',
  taillightShape: 'twin_circular_rings',
  grilleShape: 'shark_nose_splitter',
  shoulderLineCharacter: 'biomorphic_carbon_sculpture_leaf_mirrors',
  sideIntakeDesign: 'exposed_carbon_intercooler_side_snorkels',
  wheelArchStyle: 'sinuous_organic_aerodynamic_blisters',
  wheelDesign: 'twin_5_spoke',
  defaultWingStyle: 'chassis_mounted_gt',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 4,
  exhaustPosition: 'high_center_dual',
  materialPalette: {
    paintType: 'clearcoat_gloss',
    defaultColor: '#71717A',
    carbonFinish: 'gloss_forged',
    headlightEmissiveColor: '#FEF08A',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#F59E0B'
  },
  modelOverrides: {
    'pagani_huayra_bc': {
      defaultWingStyle: 'chassis_mounted_gt'
    },
    'pagani_zonda_cinque': {
      defaultWingStyle: 'chassis_mounted_gt'
    }
  }
};
