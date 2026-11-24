import { BrandDesignLanguage } from './types';

export const subaruDesignLanguage: BrandDesignLanguage = {
  brandId: 'subaru',
  brandName: 'Subaru',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.72,
    widthToHeightRatio: 1.39,
    frontOverhangRatio: 0.23,
    rearOverhangRatio: 0.22,
    hoodLengthRatio: 0.33,
    cabinLengthRatio: 0.41,
    tumblehomeAngleDeg: 18.5
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.78, 0.71, 0.62],
    rooflineArc: [1.40, 1.35, 1.16],
    rearDeckRake: [1.02, 0.94, 0.87],
    haunchCurvature: 0.089,
    noseDroop: 0.13
  },
  headlightShape: 'c_shaped',
  taillightShape: 'c_bracket',
  grilleShape: 'hexagonal_geometric',
  shoulderLineCharacter: 'rally_homologation_boxy_flares_hood_scoop',
  sideIntakeDesign: 'functional_top_mount_intercooler_hood_scoop',
  wheelArchStyle: 'blistered_rally_homologation_fenders',
  wheelDesign: 'cross_spoke_mesh',
  defaultWingStyle: 'chassis_mounted_gt',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 4,
  exhaustPosition: 'quad_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#1D4ED8',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#E2E8F0',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#EAB308'
  },
  modelOverrides: {
    'subaru_wrx_sti': {
      defaultWingStyle: 'chassis_mounted_gt'
    },
    'subaru_brz': {
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
