import { BrandDesignLanguage } from './types';

export const mitsubishiDesignLanguage: BrandDesignLanguage = {
  brandId: 'mitsubishi',
  brandName: 'Mitsubishi',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.73,
    widthToHeightRatio: 1.40,
    frontOverhangRatio: 0.22,
    rearOverhangRatio: 0.22,
    hoodLengthRatio: 0.32,
    cabinLengthRatio: 0.42,
    tumblehomeAngleDeg: 18.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.77, 0.70, 0.61],
    rooflineArc: [1.41, 1.36, 1.17],
    rearDeckRake: [1.03, 0.95, 0.88],
    haunchCurvature: 0.087,
    noseDroop: 0.14
  },
  headlightShape: 'aggressive_slit',
  taillightShape: 'horizontal_stripes',
  grilleShape: 'wide_mouth_mesh',
  shoulderLineCharacter: 'dynamic_shield_rally_lines_vortex_generators',
  sideIntakeDesign: 'twin_bonnet_vents_with_asymmetric_heat_extractors',
  wheelArchStyle: 'pumped_rally_spec_box_arches',
  wheelDesign: 'twin_5_spoke',
  defaultWingStyle: 'chassis_mounted_gt',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 1,
  exhaustPosition: 'dual_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#DC2626',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#FFFFFF',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#1F2937'
  },
  modelOverrides: {
    'mitsubishi_lancer_evolution_x': {
      defaultWingStyle: 'chassis_mounted_gt'
    },
    'mitsubishi_lancer_evolution_ix': {
      defaultWingStyle: 'chassis_mounted_gt'
    }
  }
};
