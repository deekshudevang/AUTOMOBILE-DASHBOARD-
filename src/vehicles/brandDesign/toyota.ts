import { BrandDesignLanguage } from './types';

export const toyotaDesignLanguage: BrandDesignLanguage = {
  brandId: 'toyota',
  brandName: 'Toyota',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.77,
    widthToHeightRatio: 1.45,
    frontOverhangRatio: 0.20,
    rearOverhangRatio: 0.18,
    hoodLengthRatio: 0.36,
    cabinLengthRatio: 0.39,
    tumblehomeAngleDeg: 21.5
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.73, 0.65, 0.56],
    rooflineArc: [1.31, 1.27, 1.07],
    rearDeckRake: [0.95, 0.88, 0.81],
    haunchCurvature: 0.118,
    noseDroop: 0.17
  },
  headlightShape: 'c_shaped',
  taillightShape: 'horizontal_stripes',
  grilleShape: 'wide_mouth_mesh',
  shoulderLineCharacter: 'condensed_extreme_coke_bottle_double_bubble',
  sideIntakeDesign: 'door_crest_mock_brake_ducts',
  wheelArchStyle: 'high_tension_bulbous_rear_haunches',
  wheelDesign: 'twin_5_spoke',
  defaultWingStyle: 'integrated_ducktail',
  defaultDiffuserStyle: 'f1_center_tunnel',
  exhaustCount: 2,
  exhaustPosition: 'dual_outboard',
  materialPalette: {
    paintType: 'clearcoat_gloss',
    defaultColor: '#E11D48',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#FFFFFF',
    taillightEmissiveColor: '#E11D48',
    accentColor: '#111827'
  },
  modelOverrides: {
    'toyota_gr_supra': {
      defaultWingStyle: 'integrated_ducktail'
    },
    'toyota_gr86': {
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
