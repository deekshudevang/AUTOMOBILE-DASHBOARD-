import { BrandDesignLanguage } from './types';

export const rollsRoyceDesignLanguage: BrandDesignLanguage = {
  brandId: 'rolls_royce',
  brandName: 'Rolls-Royce',
  silhouetteFamily: 'cab_backward_gt',
  proportions: {
    lengthToWheelbaseRatio: 1.65,
    widthToHeightRatio: 1.34,
    frontOverhangRatio: 0.19,
    rearOverhangRatio: 0.25,
    hoodLengthRatio: 0.40,
    cabinLengthRatio: 0.41,
    tumblehomeAngleDeg: 16.5
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.82, 0.77, 0.71],
    rooflineArc: [1.44, 1.40, 1.20],
    rearDeckRake: [1.05, 0.98, 0.91],
    haunchCurvature: 0.082,
    noseDroop: 0.08
  },
  headlightShape: 'slim_horizontal',
  taillightShape: 'vertical_blades',
  grilleShape: 'panamericana_slats',
  shoulderLineCharacter: 'waft_line_formal_pantheon_stature',
  sideIntakeDesign: 'formal_smooth_flanks_with_suicide_coach_doors',
  wheelArchStyle: 'dignified_unbroken_architectural_arches',
  wheelDesign: 'multi_fin_turbine',
  defaultWingStyle: 'none',
  defaultDiffuserStyle: 'clean_underbody',
  exhaustCount: 2,
  exhaustPosition: 'dual_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#09090B',
    carbonFinish: 'gloss_forged',
    headlightEmissiveColor: '#FFFFFF',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#F8FAFC'
  },
  modelOverrides: {
    'rolls_royce_spectre': {
      headlightShape: 'slim_horizontal'
    }
  }
};
