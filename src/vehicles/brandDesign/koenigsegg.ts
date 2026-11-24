import { BrandDesignLanguage } from './types';

export const koenigseggDesignLanguage: BrandDesignLanguage = {
  brandId: 'koenigsegg',
  brandName: 'Koenigsegg',
  silhouetteFamily: 'wedge_monovolume',
  proportions: {
    lengthToWheelbaseRatio: 1.69,
    widthToHeightRatio: 1.70,
    frontOverhangRatio: 0.19,
    rearOverhangRatio: 0.21,
    hoodLengthRatio: 0.21,
    cabinLengthRatio: 0.48,
    tumblehomeAngleDeg: 28.0
  },
  silhouetteCurves: {
    hoodSlopeCurve: [0.63, 0.52, 0.43],
    rooflineArc: [1.20, 1.16, 0.99],
    rearDeckRake: [0.91, 0.81, 0.74],
    haunchCurvature: 0.120,
    noseDroop: 0.22
  },
  headlightShape: 'matrix_quad',
  taillightShape: 'c_bracket',
  grilleShape: 'hexagonal_geometric',
  shoulderLineCharacter: 'wrap_around_jet_fighter_canopy_cockpit',
  sideIntakeDesign: 'sculpted_dihedral_synchro_helix_side_intakes',
  wheelArchStyle: 'aerodynamic_tightly_shrouded_carbon_fairings',
  wheelDesign: 'multi_fin_turbine',
  defaultWingStyle: 'swan_neck_gt',
  defaultDiffuserStyle: 'f1_center_tunnel',
  exhaustCount: 1,
  exhaustPosition: 'high_center_dual',
  materialPalette: {
    paintType: 'satin_matte',
    defaultColor: '#F8FAFC',
    carbonFinish: 'matte_twill',
    headlightEmissiveColor: '#38BDF8',
    taillightEmissiveColor: '#EF4444',
    accentColor: '#F59E0B'
  },
  modelOverrides: {
    'koenigsegg_jesko': {
      defaultWingStyle: 'swan_neck_gt'
    },
    'koenigsegg_regera': {
      defaultWingStyle: 'retractable_aerofoil'
    }
  }
};
