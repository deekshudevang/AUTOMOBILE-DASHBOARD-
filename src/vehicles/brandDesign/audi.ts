import { BrandDesignLanguage } from './types';

export const audiDesignLanguage: BrandDesignLanguage = {
  brandId: 'audi',
  brandName: 'Audi',
  silhouetteFamily: 'flowing_mid_engine',
  proportions: {
    lengthToWheelbaseRatio: 1.71,
    widthToHeightRatio: 1.58,
    frontOverhangRatio: 0.22,
    rearOverhangRatio: 0.21,
    hoodLengthRatio: 0.27,
    cabinLengthRatio: 0.43,
    tumblehomeAngleDeg: 22.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.70, 0.62, 0.53],
    rooflineArc: [1.26, 1.22, 1.05],
    rearDeckRake: [0.95, 0.87, 0.80],
    haunchCurvature: 0.092,
    noseDroop: 0.17
  },
  headlightShape: 'slim_horizontal',
  taillightShape: 'lightbar_continuous',
  grilleShape: 'singleframe_trapezoid',
  shoulderLineCharacter: 'quattro_blister_lines_over_all_four_wheels',
  sideIntakeDesign: 'vertical_sideblades_behind_doors',
  wheelArchStyle: 'geometric_quattro_blistered_fenders',
  wheelDesign: 'twin_5_spoke',
  defaultWingStyle: 'retractable_aerofoil',
  defaultDiffuserStyle: 'dual_chamber',
  exhaustCount: 2,
  exhaustPosition: 'dual_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#64748B',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#E2E8F0',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#0284C7'
  },
  modelOverrides: {
    'audi_r8_v10': {
      sideIntakeDesign: 'vertical_sideblades_behind_doors'
    },
    'audi_rs6_avant': {
      silhouetteFamily: 'long_hood_short_deck',
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
