import { BrandDesignLanguage } from './types';

export const hondaDesignLanguage: BrandDesignLanguage = {
  brandId: 'honda',
  brandName: 'Honda',
  silhouetteFamily: 'flowing_mid_engine',
  proportions: {
    lengthToWheelbaseRatio: 1.74,
    widthToHeightRatio: 1.60,
    frontOverhangRatio: 0.21,
    rearOverhangRatio: 0.21,
    hoodLengthRatio: 0.27,
    cabinLengthRatio: 0.43,
    tumblehomeAngleDeg: 22.5
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.68, 0.60, 0.51],
    rooflineArc: [1.23, 1.19, 1.02],
    rearDeckRake: [0.94, 0.86, 0.79],
    haunchCurvature: 0.095,
    noseDroop: 0.17
  },
  headlightShape: 'slim_horizontal',
  taillightShape: 'lightbar_continuous',
  grilleShape: 'shark_nose_splitter',
  shoulderLineCharacter: 'floating_c_pillar_buttress_aero_flow',
  sideIntakeDesign: 'intercooler_intakes_integrated_in_doors',
  wheelArchStyle: 'crisp_taut_chiseled_arches',
  wheelDesign: 'twin_5_spoke',
  defaultWingStyle: 'integrated_ducktail',
  defaultDiffuserStyle: 'f1_center_tunnel',
  exhaustCount: 4,
  exhaustPosition: 'center_quad',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#475569',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#F8FAFC',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#DC2626'
  },
  modelOverrides: {
    'honda_nsx_type_s': {
      defaultWingStyle: 'integrated_ducktail'
    },
    'honda_civic_type_r': {
      silhouetteFamily: 'long_hood_short_deck',
      defaultWingStyle: 'chassis_mounted_gt'
    }
  }
};
