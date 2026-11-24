import { BrandDesignLanguage } from './types';

export const mercedesDesignLanguage: BrandDesignLanguage = {
  brandId: 'mercedes',
  brandName: 'Mercedes-Benz',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.76,
    widthToHeightRatio: 1.48,
    frontOverhangRatio: 0.21,
    rearOverhangRatio: 0.21,
    hoodLengthRatio: 0.38,
    cabinLengthRatio: 0.38,
    tumblehomeAngleDeg: 20.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.75, 0.67, 0.58],
    rooflineArc: [1.30, 1.25, 1.08],
    rearDeckRake: [0.97, 0.89, 0.82],
    haunchCurvature: 0.094,
    noseDroop: 0.15
  },
  headlightShape: 'slim_horizontal',
  taillightShape: 'horizontal_stripes',
  grilleShape: 'panamericana_slats',
  shoulderLineCharacter: 'sensual_purity_dropping_shoulder_line',
  sideIntakeDesign: 'front_fender_twin_fin_louvers',
  wheelArchStyle: 'smooth_sculpted_widebody_flares',
  wheelDesign: 'twin_5_spoke',
  defaultWingStyle: 'chassis_mounted_gt',
  defaultDiffuserStyle: 'deep_carbon_strakes',
  exhaustCount: 4,
  exhaustPosition: 'quad_outboard',
  materialPalette: {
    paintType: 'satin_matte',
    defaultColor: '#334155',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#F1F5F9',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#E2E8F0'
  },
  modelOverrides: {
    'mercedes_amg_gt_black_series': {
      defaultWingStyle: 'chassis_mounted_gt',
      grilleShape: 'panamericana_slats'
    },
    'mercedes_amg_one': {
      silhouetteFamily: 'wedge_monovolume',
      defaultWingStyle: 'retractable_aerofoil'
    }
  }
};
