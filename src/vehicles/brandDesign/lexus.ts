import { BrandDesignLanguage } from './types';

export const lexusDesignLanguage: BrandDesignLanguage = {
  brandId: 'lexus',
  brandName: 'Lexus',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.76,
    widthToHeightRatio: 1.43,
    frontOverhangRatio: 0.21,
    rearOverhangRatio: 0.20,
    hoodLengthRatio: 0.36,
    cabinLengthRatio: 0.40,
    tumblehomeAngleDeg: 21.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.73, 0.65, 0.56],
    rooflineArc: [1.32, 1.27, 1.07],
    rearDeckRake: [0.96, 0.88, 0.81],
    haunchCurvature: 0.114,
    noseDroop: 0.16
  },
  headlightShape: 'l_shaped',
  taillightShape: 'l_shaped_blade',
  grilleShape: 'spindle_hourglass',
  shoulderLineCharacter: 'sharp_origami_l-finesse_creases_with_spindle',
  sideIntakeDesign: 'sculpted_rocker_aero_ducts_ahead_of_rear_wheels',
  wheelArchStyle: 'chiseled_origami_creased_fenders',
  wheelDesign: 'multi_fin_turbine',
  defaultWingStyle: 'retractable_aerofoil',
  defaultDiffuserStyle: 'f1_center_tunnel',
  exhaustCount: 4,
  exhaustPosition: 'quad_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#D97706',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#F8FAFC',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#1E293B'
  },
  modelOverrides: {
    'lexus_lfa': {
      exhaustPosition: 'center_quad',
      defaultWingStyle: 'retractable_aerofoil'
    },
    'lexus_lc500': {
      defaultWingStyle: 'retractable_aerofoil'
    }
  }
};
