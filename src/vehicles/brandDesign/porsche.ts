import { BrandDesignLanguage } from './types';

export const porscheDesignLanguage: BrandDesignLanguage = {
  brandId: 'porsche',
  brandName: 'Porsche',
  silhouetteFamily: 'rear_engine_flyline',
  proportions: {
    lengthToWheelbaseRatio: 1.86,
    widthToHeightRatio: 1.44,
    frontOverhangRatio: 0.22,
    rearOverhangRatio: 0.24,
    hoodLengthRatio: 0.25,
    cabinLengthRatio: 0.44,
    tumblehomeAngleDeg: 21.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.74, 0.68, 0.62],
    rooflineArc: [1.32, 1.28, 1.05],
    rearDeckRake: [0.94, 0.86, 0.80],
    haunchCurvature: 0.085,
    noseDroop: 0.12
  },
  headlightShape: 'round_oval',
  taillightShape: 'lightbar_continuous',
  grilleShape: 'triple_bay_air_dam',
  shoulderLineCharacter: 'smooth_continuous_flyline_with_torpedo_crest',
  sideIntakeDesign: 'sculpted_rear_quarter_intercooler_duct',
  wheelArchStyle: 'muscular_flared_torpedo_fenders',
  wheelDesign: 'center_lock_y_spoke',
  defaultWingStyle: 'swan_neck_gt',
  defaultDiffuserStyle: 'deep_carbon_strakes',
  exhaustCount: 2,
  exhaustPosition: 'center_dual',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#C4C9D0',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#E2E8F0',
    taillightEmissiveColor: '#FF1133',
    accentColor: '#FF1133'
  },
  modelOverrides: {
    'porsche_911_gt3_rs': {
      defaultWingStyle: 'swan_neck_gt',
      exhaustPosition: 'center_dual'
    },
    'porsche_911_gt3': {
      defaultWingStyle: 'swan_neck_gt',
      exhaustPosition: 'center_dual'
    },
    'porsche_911_turbo_s': {
      defaultWingStyle: 'integrated_ducktail',
      exhaustPosition: 'quad_outboard'
    }
  }
};
