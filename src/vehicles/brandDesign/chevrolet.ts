import { BrandDesignLanguage } from './types';

export const chevroletDesignLanguage: BrandDesignLanguage = {
  brandId: 'chevrolet',
  brandName: 'Chevrolet',
  silhouetteFamily: 'flowing_mid_engine',
  proportions: {
    lengthToWheelbaseRatio: 1.73,
    widthToHeightRatio: 1.63,
    frontOverhangRatio: 0.22,
    rearOverhangRatio: 0.22,
    hoodLengthRatio: 0.28,
    cabinLengthRatio: 0.42,
    tumblehomeAngleDeg: 23.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.69, 0.61, 0.51],
    rooflineArc: [1.25, 1.21, 1.04],
    rearDeckRake: [0.94, 0.86, 0.79],
    haunchCurvature: 0.112,
    noseDroop: 0.18
  },
  headlightShape: 'aggressive_slit',
  taillightShape: 'quad_squares',
  grilleShape: 'shark_nose_splitter',
  shoulderLineCharacter: 'sharp_creased_f-22_fighter_jet_side_spears',
  sideIntakeDesign: 'prominent_wishbone_side_air_scoops',
  wheelArchStyle: 'geometric_taut_chiseled_fenders',
  wheelDesign: 'star_5_spoke',
  defaultWingStyle: 'chassis_mounted_gt',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 4,
  exhaustPosition: 'center_quad',
  materialPalette: {
    paintType: 'clearcoat_gloss',
    defaultColor: '#EAB308',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#FFFFFF',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#171717'
  },
  modelOverrides: {
    'chevrolet_corvette_c8_z06': {
      exhaustPosition: 'center_quad',
      defaultWingStyle: 'chassis_mounted_gt'
    },
    'chevrolet_corvette_c8_stingray': {
      exhaustPosition: 'quad_outboard',
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
