import { BrandDesignLanguage } from './types';

export const bugattiDesignLanguage: BrandDesignLanguage = {
  brandId: 'bugatti',
  brandName: 'Bugatti',
  silhouetteFamily: 'low_hypercar_teardrop',
  proportions: {
    lengthToWheelbaseRatio: 1.67,
    widthToHeightRatio: 1.68,
    frontOverhangRatio: 0.22,
    rearOverhangRatio: 0.21,
    hoodLengthRatio: 0.25,
    cabinLengthRatio: 0.44,
    tumblehomeAngleDeg: 24.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.67, 0.59, 0.50],
    rooflineArc: [1.24, 1.20, 1.03],
    rearDeckRake: [0.96, 0.88, 0.81],
    haunchCurvature: 0.130,
    noseDroop: 0.17
  },
  headlightShape: 'matrix_quad',
  taillightShape: 'lightbar_continuous',
  grilleShape: 'c_duct_horseshoe',
  shoulderLineCharacter: 'iconic_continuous_c_shaped_bugatti_side_line',
  sideIntakeDesign: 'swept_carbon_horseshoe_air_inlets',
  wheelArchStyle: 'heavy_sculpted_grand_sport_haunches',
  wheelDesign: 'multi_fin_turbine',
  defaultWingStyle: 'retractable_aerofoil',
  defaultDiffuserStyle: 'quad_tunnel',
  exhaustCount: 4,
  exhaustPosition: 'center_quad',
  materialPalette: {
    paintType: 'clearcoat_metallic',
    defaultColor: '#1E3A8A',
    carbonFinish: 'gloss_forged',
    headlightEmissiveColor: '#E0F2FE',
    taillightEmissiveColor: '#DC2626',
    accentColor: '#38BDF8'
  },
  modelOverrides: {
    'bugatti_chiron_super_sport': {
      defaultWingStyle: 'retractable_aerofoil'
    },
    'bugatti_bolide': {
      defaultWingStyle: 'swan_neck_gt'
    }
  }
};
