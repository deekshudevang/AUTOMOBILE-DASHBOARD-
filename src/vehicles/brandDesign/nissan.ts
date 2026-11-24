import { BrandDesignLanguage } from './types';

export const nissanDesignLanguage: BrandDesignLanguage = {
  brandId: 'nissan',
  brandName: 'Nissan',
  silhouetteFamily: 'long_hood_short_deck',
  proportions: {
    lengthToWheelbaseRatio: 1.70,
    widthToHeightRatio: 1.40,
    frontOverhangRatio: 0.22,
    rearOverhangRatio: 0.23,
    hoodLengthRatio: 0.32,
    cabinLengthRatio: 0.40,
    tumblehomeAngleDeg: 19.5
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.76, 0.69, 0.61],
    rooflineArc: [1.37, 1.32, 1.12],
    rearDeckRake: [0.99, 0.91, 0.85],
    haunchCurvature: 0.098,
    noseDroop: 0.14
  },
  headlightShape: 'aggressive_slit',
  taillightShape: 'twin_circular_rings',
  grilleShape: 'wide_mouth_mesh',
  shoulderLineCharacter: 'muscular_stepped_crease_with_pillar_kink',
  sideIntakeDesign: 'fender_extractor_vents_behind_front_wheels',
  wheelArchStyle: 'blistered_muscular_tuner_arches',
  wheelDesign: 'twin_5_spoke',
  defaultWingStyle: 'chassis_mounted_gt',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 4,
  exhaustPosition: 'quad_outboard',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#3B82F6',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#E2E8F0',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#DC2626'
  },
  modelOverrides: {
    'nissan_gtr_r35': {
      taillightShape: 'twin_circular_rings',
      exhaustCount: 4
    },
    'nissan_z_nismo': {
      headlightShape: 'c_shaped',
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
