import { BrandDesignLanguage } from './types';

export const bmwDesignLanguage: BrandDesignLanguage = {
  brandId: 'bmw',
  brandName: 'BMW',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.68,
    widthToHeightRatio: 1.38,
    frontOverhangRatio: 0.19,
    rearOverhangRatio: 0.22,
    hoodLengthRatio: 0.35,
    cabinLengthRatio: 0.42,
    tumblehomeAngleDeg: 18.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.77, 0.70, 0.63],
    rooflineArc: [1.39, 1.34, 1.15],
    rearDeckRake: [1.02, 0.94, 0.88],
    haunchCurvature: 0.088,
    noseDroop: 0.13
  },
  headlightShape: 'l_shaped',
  taillightShape: 'l_shaped_blade',
  grilleShape: 'kidney_dual',
  shoulderLineCharacter: 'crisp_swage_line_with_hofmeister_kink',
  sideIntakeDesign: 'm_gills_side_strakes_on_front_fenders',
  wheelArchStyle: 'widened_m_fender_flares',
  wheelDesign: 'cross_spoke_mesh',
  defaultWingStyle: 'integrated_ducktail',
  defaultDiffuserStyle: 'dual_chamber',
  exhaustCount: 4,
  exhaustPosition: 'quad_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#1E40AF',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#E0E7FF',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#0284C7'
  },
  modelOverrides: {
    'bmw_m4_csl': {
      defaultWingStyle: 'integrated_ducktail'
    },
    'bmw_m8_competition': {
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
