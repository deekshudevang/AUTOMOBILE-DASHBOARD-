import { BrandDesignLanguage } from './types';

export const bentleyDesignLanguage: BrandDesignLanguage = {
  brandId: 'bentley',
  brandName: 'Bentley',
  silhouetteFamily: 'cab_backward_gt',
  proportions: {
    lengthToWheelbaseRatio: 1.70,
    widthToHeightRatio: 1.41,
    frontOverhangRatio: 0.20,
    rearOverhangRatio: 0.24,
    hoodLengthRatio: 0.38,
    cabinLengthRatio: 0.40,
    tumblehomeAngleDeg: 19.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.77, 0.70, 0.61],
    rooflineArc: [1.36, 1.31, 1.12],
    rearDeckRake: [0.98, 0.90, 0.83],
    haunchCurvature: 0.126,
    noseDroop: 0.13
  },
  headlightShape: 'round_oval',
  taillightShape: 'horizontal_stripes',
  grilleShape: 'wide_mouth_mesh',
  shoulderLineCharacter: 'powerline_and_haunch_with_flying_b',
  sideIntakeDesign: 'subtle_front_wing_b_vent_in_chrome',
  wheelArchStyle: 'monumental_swelling_power_haunches',
  wheelDesign: 'twin_5_spoke',
  defaultWingStyle: 'retractable_aerofoil',
  defaultDiffuserStyle: 'dual_chamber',
  exhaustCount: 2,
  exhaustPosition: 'dual_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#0F766E',
    carbonFinish: 'gloss_forged',
    headlightEmissiveColor: '#FEF08A',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#E2E8F0'
  },
  modelOverrides: {
    'bentley_continental_gt': {
      defaultWingStyle: 'retractable_aerofoil'
    }
  }
};
