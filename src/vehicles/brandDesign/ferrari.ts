import { BrandDesignLanguage } from './types';

export const ferrariDesignLanguage: BrandDesignLanguage = {
  brandId: 'ferrari',
  brandName: 'Ferrari',
  silhouetteFamily: 'flowing_mid_engine',
  proportions: {
    lengthToWheelbaseRatio: 1.78,
    widthToHeightRatio: 1.64,
    frontOverhangRatio: 0.23,
    rearOverhangRatio: 0.21,
    hoodLengthRatio: 0.26,
    cabinLengthRatio: 0.41,
    tumblehomeAngleDeg: 23.5
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.68, 0.60, 0.52],
    rooflineArc: [1.25, 1.21, 1.06],
    rearDeckRake: [0.96, 0.88, 0.81],
    haunchCurvature: 0.125,
    noseDroop: 0.16
  },
  headlightShape: 'slim_horizontal',
  taillightShape: 'twin_circular_rings',
  grilleShape: 'shark_nose_splitter',
  shoulderLineCharacter: 'flowing_curvaceous_muscular_haunches',
  sideIntakeDesign: 'sculpted_scalloped_side_intercooler_air_intake',
  wheelArchStyle: 'smooth_flowing_arches_tapering_to_cowl',
  wheelDesign: 'star_5_spoke',
  defaultWingStyle: 'integrated_ducktail',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 2,
  exhaustPosition: 'center_dual',
  materialPalette: {
    paintType: 'clearcoat_gloss',
    defaultColor: '#DC2626',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#FFFFFF',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#FBBF24'
  },
  modelOverrides: {
    'ferrari_f8_tributo': {
      headlightShape: 'slim_horizontal',
      taillightShape: 'twin_circular_rings',
      defaultWingStyle: 'integrated_ducktail'
    },
    'ferrari_488_pista': {
      grilleShape: 'shark_nose_splitter',
      defaultWingStyle: 'integrated_ducktail'
    },
    'ferrari_sf90': {
      headlightShape: 'c_shaped',
      taillightShape: 'horizontal_stripes',
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
