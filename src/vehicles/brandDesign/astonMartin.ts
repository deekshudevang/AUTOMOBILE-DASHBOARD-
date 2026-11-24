import { BrandDesignLanguage } from './types';

export const astonMartinDesignLanguage: BrandDesignLanguage = {
  brandId: 'aston_martin',
  brandName: 'Aston Martin',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.79,
    widthToHeightRatio: 1.54,
    frontOverhangRatio: 0.21,
    rearOverhangRatio: 0.21,
    hoodLengthRatio: 0.37,
    cabinLengthRatio: 0.39,
    tumblehomeAngleDeg: 20.5
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.72, 0.64, 0.55],
    rooflineArc: [1.28, 1.23, 1.05],
    rearDeckRake: [0.95, 0.87, 0.80],
    haunchCurvature: 0.116,
    noseDroop: 0.16
  },
  headlightShape: 'slim_horizontal',
  taillightShape: 'lightbar_continuous',
  grilleShape: 'wide_mouth_mesh',
  shoulderLineCharacter: 'swan_feather_shoulder_with_side_strake',
  sideIntakeDesign: 'aerobladed_curved_fender_side_strakes',
  wheelArchStyle: 'muscular_flared_tapering_to_cowl',
  wheelDesign: 'multi_fin_turbine',
  defaultWingStyle: 'integrated_ducktail',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 4,
  exhaustPosition: 'quad_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#065F46',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#E2E8F0',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#10B981'
  },
  modelOverrides: {
    'aston_martin_valkyrie': {
      silhouetteFamily: 'wedge_monovolume',
      defaultWingStyle: 'chassis_mounted_gt'
    },
    'aston_martin_vantage': {
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
