import { BrandDesignLanguage } from './types';

export const fordDesignLanguage: BrandDesignLanguage = {
  brandId: 'ford',
  brandName: 'Ford',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.75,
    widthToHeightRatio: 1.42,
    frontOverhangRatio: 0.23,
    rearOverhangRatio: 0.23,
    hoodLengthRatio: 0.35,
    cabinLengthRatio: 0.40,
    tumblehomeAngleDeg: 19.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.79, 0.72, 0.64],
    rooflineArc: [1.38, 1.33, 1.14],
    rearDeckRake: [1.01, 0.93, 0.86],
    haunchCurvature: 0.104,
    noseDroop: 0.12
  },
  headlightShape: 'aggressive_slit',
  taillightShape: 'horizontal_stripes',
  grilleShape: 'wide_mouth_mesh',
  shoulderLineCharacter: 'muscular_fastback_haunches_with_shark_nose',
  sideIntakeDesign: 'sculpted_lower_sill_intakes',
  wheelArchStyle: 'chiseled_prominent_wheel_lips',
  wheelDesign: 'cross_spoke_mesh',
  defaultWingStyle: 'chassis_mounted_gt',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 4,
  exhaustPosition: 'quad_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#1D4ED8',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#F8FAFC',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#F8FAFC'
  },
  modelOverrides: {
    'ford_gt': {
      silhouetteFamily: 'flowing_mid_engine',
      defaultWingStyle: 'retractable_aerofoil',
      exhaustPosition: 'high_center_dual'
    },
    'ford_mustang_shelby_gt500': {
      defaultWingStyle: 'chassis_mounted_gt'
    }
  }
};
