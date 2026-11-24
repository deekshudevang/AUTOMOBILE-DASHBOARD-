import { BrandDesignLanguage } from './types';

export const mazdaDesignLanguage: BrandDesignLanguage = {
  brandId: 'mazda',
  brandName: 'Mazda',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.76,
    widthToHeightRatio: 1.41,
    frontOverhangRatio: 0.20,
    rearOverhangRatio: 0.19,
    hoodLengthRatio: 0.35,
    cabinLengthRatio: 0.38,
    tumblehomeAngleDeg: 21.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.71, 0.63, 0.54],
    rooflineArc: [1.29, 1.25, 1.06],
    rearDeckRake: [0.94, 0.86, 0.79],
    haunchCurvature: 0.106,
    noseDroop: 0.15
  },
  headlightShape: 'slim_horizontal',
  taillightShape: 'horizontal_stripes',
  grilleShape: 'wide_mouth_mesh',
  shoulderLineCharacter: 'pure_kodo_organic_curvature_double_wave',
  sideIntakeDesign: 'seamless_flowing_aerodynamic_flank_cavity',
  wheelArchStyle: 'clean_sculpted_fluidic_surfaces',
  wheelDesign: 'star_5_spoke',
  defaultWingStyle: 'integrated_ducktail',
  defaultDiffuserStyle: 'clean_underbody',
  exhaustCount: 2,
  exhaustPosition: 'dual_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#991B1B',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#FFFFFF',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#B91C1C'
  },
  modelOverrides: {
    'mazda_rx7_fd': {
      defaultWingStyle: 'integrated_ducktail'
    },
    'mazda_mx5': {
      defaultWingStyle: 'none'
    }
  }
};
