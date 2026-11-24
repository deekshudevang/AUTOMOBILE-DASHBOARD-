import { BrandDesignLanguage } from './types';

export const dodgeDesignLanguage: BrandDesignLanguage = {
  brandId: 'dodge',
  brandName: 'Dodge',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.78,
    widthToHeightRatio: 1.36,
    frontOverhangRatio: 0.24,
    rearOverhangRatio: 0.25,
    hoodLengthRatio: 0.39,
    cabinLengthRatio: 0.37,
    tumblehomeAngleDeg: 17.5
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.81, 0.74, 0.66],
    rooflineArc: [1.41, 1.36, 1.18],
    rearDeckRake: [1.03, 0.96, 0.90],
    haunchCurvature: 0.124,
    noseDroop: 0.11
  },
  headlightShape: 'dual_round',
  taillightShape: 'horizontal_stripes',
  grilleShape: 'wide_mouth_mesh',
  shoulderLineCharacter: 'slab_sided_aggressive_coke_bottle_muscle',
  sideIntakeDesign: 'dual_hood_snorkel_heat_extractors',
  wheelArchStyle: 'extreme_widebody_bolt_on_flares',
  wheelDesign: 'star_5_spoke',
  defaultWingStyle: 'chassis_mounted_gt',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 2,
  exhaustPosition: 'dual_outboard',
  materialPalette: {
    paintType: 'clearcoat_gloss',
    defaultColor: '#7C3AED',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#FEF08A',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#171717'
  },
  modelOverrides: {
    'dodge_viper_acr': {
      defaultWingStyle: 'chassis_mounted_gt',
      exhaustPosition: 'dual_outboard'
    },
    'dodge_challenger_hellcat': {
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
