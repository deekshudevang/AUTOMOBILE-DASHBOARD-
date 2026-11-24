import { BrandDesignLanguage } from './types';

export const maseratiDesignLanguage: BrandDesignLanguage = {
  brandId: 'maserati',
  brandName: 'Maserati',
  silhouetteFamily: 'flowing_mid_engine',
  proportions: {
    lengthToWheelbaseRatio: 1.71,
    widthToHeightRatio: 1.62,
    frontOverhangRatio: 0.22,
    rearOverhangRatio: 0.21,
    hoodLengthRatio: 0.27,
    cabinLengthRatio: 0.42,
    tumblehomeAngleDeg: 23.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.68, 0.60, 0.51],
    rooflineArc: [1.24, 1.20, 1.03],
    rearDeckRake: [0.94, 0.86, 0.79],
    haunchCurvature: 0.105,
    noseDroop: 0.16
  },
  headlightShape: 'slim_horizontal',
  taillightShape: 'horizontal_stripes',
  grilleShape: 'shark_nose_splitter',
  shoulderLineCharacter: 'sculpted_flowing_butterfly_monocoque',
  sideIntakeDesign: 'subtle_underbody_naca_ducts_and_side_scoops',
  wheelArchStyle: 'soft_muscular_italian_haunches',
  wheelDesign: 'star_5_spoke',
  defaultWingStyle: 'integrated_ducktail',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 2,
  exhaustPosition: 'center_dual',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#2563EB',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#FFFFFF',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#60A5FA'
  },
  modelOverrides: {
    'maserati_mc20': {
      defaultWingStyle: 'integrated_ducktail'
    }
  }
};
