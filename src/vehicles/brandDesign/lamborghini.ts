import { BrandDesignLanguage } from './types';

export const lamborghiniDesignLanguage: BrandDesignLanguage = {
  brandId: 'lamborghini',
  brandName: 'Lamborghini',
  silhouetteFamily: 'wedge_monovolume',
  proportions: {
    lengthToWheelbaseRatio: 1.74,
    widthToHeightRatio: 1.72,
    frontOverhangRatio: 0.20,
    rearOverhangRatio: 0.22,
    hoodLengthRatio: 0.22,
    cabinLengthRatio: 0.46,
    tumblehomeAngleDeg: 26.5
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.65, 0.54, 0.44],
    rooflineArc: [1.22, 1.18, 1.02],
    rearDeckRake: [0.92, 0.82, 0.76],
    haunchCurvature: 0.115,
    noseDroop: 0.21
  },
  headlightShape: 'y_signature',
  taillightShape: 'y_signature_hex',
  grilleShape: 'hexagonal_geometric',
  shoulderLineCharacter: 'sharp_origami_creases_with_gandini_arch',
  sideIntakeDesign: 'massive_hexagonal_nacelle_intercooler_scoop',
  wheelArchStyle: 'angular_trapezoidal_wheel_cutouts',
  wheelDesign: 'hexagonal_5_spoke',
  defaultWingStyle: 'ala_active_pylon',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 2,
  exhaustPosition: 'high_center_dual',
  materialPalette: {
    paintType: 'clearcoat_gloss',
    defaultColor: '#10B981',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#F8FAFC',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#F59E0B'
  },
  modelOverrides: {
    'lamborghini_huracan_sto': {
      defaultWingStyle: 'ala_active_pylon',
      exhaustPosition: 'high_center_dual'
    },
    'lamborghini_huracan_evo': {
      defaultWingStyle: 'integrated_ducktail',
      exhaustPosition: 'high_center_dual'
    },
    'lamborghini_aventador_svj': {
      defaultWingStyle: 'ala_active_pylon',
      exhaustPosition: 'high_center_dual'
    }
  }
};
