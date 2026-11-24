import { BrandDesignLanguage } from './types';

export const mclarenDesignLanguage: BrandDesignLanguage = {
  brandId: 'mclaren',
  brandName: 'McLaren',
  silhouetteFamily: 'flowing_mid_engine',
  proportions: {
    lengthToWheelbaseRatio: 1.72,
    widthToHeightRatio: 1.66,
    frontOverhangRatio: 0.21,
    rearOverhangRatio: 0.20,
    hoodLengthRatio: 0.23,
    cabinLengthRatio: 0.43,
    tumblehomeAngleDeg: 25.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.66, 0.56, 0.48],
    rooflineArc: [1.21, 1.17, 1.00],
    rearDeckRake: [0.93, 0.84, 0.77],
    haunchCurvature: 0.108,
    noseDroop: 0.18
  },
  headlightShape: 'slim_horizontal',
  taillightShape: 'horizontal_stripes',
  grilleShape: 'shark_nose_splitter',
  shoulderLineCharacter: 'shrink_wrapped_aerodynamic_canopy_tear_drop',
  sideIntakeDesign: 'integrated_dihedral_door_aero_channel',
  wheelArchStyle: 'tightly_tucked_composite_fenders',
  wheelDesign: 'twin_5_spoke',
  defaultWingStyle: 'retractable_aerofoil',
  defaultDiffuserStyle: 'f1_center_tunnel',
  exhaustCount: 2,
  exhaustPosition: 'high_center_dual',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#F97316',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#E0F2FE',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#F97316'
  },
  modelOverrides: {
    'mclaren_720s': {
      defaultWingStyle: 'retractable_aerofoil'
    },
    'mclaren_765lt': {
      defaultWingStyle: 'retractable_aerofoil',
      exhaustCount: 4,
      exhaustPosition: 'high_center_dual'
    },
    'mclaren_senna': {
      defaultWingStyle: 'swan_neck_gt'
    }
  }
};
