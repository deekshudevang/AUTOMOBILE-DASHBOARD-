export type HeadlightShape =
  | 'round_oval'           // Porsche 911 / Bentley
  | 'y_signature'          // Lamborghini Huracan / Aventador
  | 'slim_horizontal'      // Ferrari F8 / McLaren 720S / Audi R8
  | 'l_shaped'             // Lexus LC / BMW M4
  | 'c_shaped'             // Bugatti / Subaru
  | 'dual_round'           // Ferrari classic / Dodge
  | 'aggressive_slit'      // Chevrolet Corvette C8 / Nissan GT-R
  | 'matrix_quad';         // Bugatti Chiron / Koenigsegg

export type TaillightShape =
  | 'lightbar_continuous'  // Porsche 911 / Audi / Aston Martin
  | 'y_signature_hex'      // Lamborghini Huracan STO / Aventador
  | 'twin_circular_rings'  // Ferrari F8 / 488 / Nissan GT-R
  | 'l_shaped_blade'       // BMW M4 / Lexus
  | 'quad_squares'         // Chevrolet Corvette C8
  | 'horizontal_stripes'   // Ford Mustang / AMG GT
  | 'c_bracket'            // Bugatti / Koenigsegg
  | 'vertical_blades';     // Cadillac / specialized

export type GrilleIntakeShape =
  | 'triple_bay_air_dam'     // Porsche 911 GT3 RS
  | 'hexagonal_geometric'    // Lamborghini Huracan / Audi Singleframe
  | 'shark_nose_splitter'    // Ferrari F8 / 488 Pista S-Duct
  | 'kidney_dual'            // BMW M4 G82
  | 'panamericana_slats'     // Mercedes-AMG GT
  | 'singleframe_trapezoid'  // Audi R8
  | 'spindle_hourglass'      // Lexus
  | 'wide_mouth_mesh'        // Nissan GT-R / Aston Martin
  | 'c_duct_horseshoe';      // Bugatti Horseshoe

export type SilhouetteFamily =
  | 'rear_engine_flyline'      // Porsche 911
  | 'wedge_monovolume'         // Lamborghini / Koenigsegg
  | 'flowing_mid_engine'       // Ferrari / McLaren / Maserati
  | 'long_hood_short_deck'     // Front Engine GT: AMG, BMW, Supra, GT-R, Aston
  | 'cab_backward_gt'          // Classic GT: Bentley, Rolls-Royce
  | 'low_hypercar_teardrop';   // Pagani, Bugatti, Valkyrie

export type WingStyle =
  | 'swan_neck_gt'          // Porsche 911 GT3 RS
  | 'ala_active_pylon'      // Lamborghini Huracan STO / Aventador SVJ
  | 'integrated_ducktail'   // Ferrari / Porsche Touring / Toyota Supra
  | 'chassis_mounted_gt'    // AMG GT Black Series / Viper ACR
  | 'retractable_aerofoil'  // McLaren / Bugatti
  | 'none';                 // Clean GT road cars

export type DiffuserStyle =
  | 'quad_tunnel'           // Ferrari / Lamborghini
  | 'deep_carbon_strakes'   // Porsche GT3 RS / AMG GT
  | 'f1_center_tunnel'      // McLaren / Aston Valkyrie
  | 'dual_chamber'          // BMW / Audi
  | 'clean_underbody';      // Luxury GT

export type WheelSpokeDesign =
  | 'center_lock_y_spoke'   // Porsche GT3 RS / Ferrari Pista
  | 'hexagonal_5_spoke'     // Lamborghini
  | 'twin_5_spoke'          // AMG / Audi / BMW
  | 'multi_fin_turbine'     // Bugatti / Mercedes SLR
  | 'cross_spoke_mesh'      // BMW M / Porsche BBS
  | 'star_5_spoke';         // Ferrari classic

export interface BrandProportions {
  lengthToWheelbaseRatio: number;
  widthToHeightRatio: number;
  frontOverhangRatio: number;
  rearOverhangRatio: number;
  hoodLengthRatio: number;
  cabinLengthRatio: number;
  tumblehomeAngleDeg: number;
}

export interface SilhouetteCurves {
  hoodSlopeCurve: [number, number, number];
  rooflineArc: [number, number, number];
  rearDeckRake: [number, number, number];
  haunchCurvature: number;
  noseDroop: number;
}

export interface BrandDesignLanguage {
  brandId: string;
  brandName: string;
  silhouetteFamily: SilhouetteFamily;
  proportions: BrandProportions;
  silhouetteCurves: SilhouetteCurves;
  headlightShape: HeadlightShape;
  taillightShape: TaillightShape;
  grilleShape: GrilleIntakeShape;
  shoulderLineCharacter: string;
  sideIntakeDesign: string;
  wheelArchStyle: string;
  wheelDesign: WheelSpokeDesign;
  defaultWingStyle: WingStyle;
  defaultDiffuserStyle: DiffuserStyle;
  exhaustCount: number;
  exhaustPosition: 'center_dual' | 'quad_outboard' | 'center_quad' | 'high_center_dual' | 'dual_outboard';
  materialPalette: {
    paintType: 'clearcoat_metallic' | 'clearcoat_gloss' | 'satin_matte';
    defaultColor: string;
    carbonFinish: 'matte_twill' | 'gloss_forged';
    headlightEmissiveColor: string;
    taillightEmissiveColor: string;
    accentColor?: string;
  };
  modelOverrides?: Record<string, Partial<BrandDesignLanguage>>;
}
