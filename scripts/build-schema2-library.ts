import fs from 'fs';
import path from 'path';
import { VehicleSchema2, LongitudinalCrossSection, VehicleComponentDef, WheelComponentSpec, MaterialDef } from '../packages/shared-types/src/schema2';

interface VehicleRawMeta {
  id: string;
  category: 'supercars' | 'hypercars' | 'sports_cars' | 'luxury_cars' | 'track_cars' | 'jdm_cars' | 'muscle_cars' | 'concept_cars' | 'special_edition';
  make: string;
  model: string;
  generation: string;
  year: number;
  length: number;
  width: number;
  height: number;
  wheelbase: number;
  frontTrack: number;
  rearTrack: number;
  bodyStyle: string;
  engine: string;
  aeroType: 'massive_wing' | 'swan_neck_gt' | 'active_wing' | 'decklid_lip' | 'longtail_moby' | 'twin_fin_track' | 'rally_wing' | 'drag_ducktail' | 'luxury_flush';
  primaryColorHex: string;
  secondaryColorHex: string;
  wheelFinishHex: string;
  caliperColorHex: string;
  cowlRatio: number; // Cowl position as ratio of wheelbase (0.15 = cab forward, 0.40 = long hood GT)
  roofPeakRatio: number; // Roof peak position (-0.1 to -0.3)
  rearDeckRatio: number; // Rear deck transition ratio (-0.5 to -0.7)
  tumblehome: number; // Inward slope of greenhouse (0.75 = upright, 0.55 = aggressive slope)
  finCount: number;
  hasRoofScoop: boolean;
  hasFenderVents: boolean;
  hasHoodScoop: boolean;
  spokeCount: number;
  rimDiameterFrontIn: number;
  rimDiameterRearIn: number;
  tireWidthFrontMm: number;
  tireWidthRearMm: number;
}

const VEHICLES_ROSTER: VehicleRawMeta[] = [
  // 1-10 SUPERCARS
  {
    id: 'lamborghini_aventador_svj',
    category: 'supercars',
    make: 'Lamborghini',
    model: 'Aventador SVJ',
    generation: 'LP 770-4',
    year: 2019,
    length: 4.943,
    width: 2.098,
    height: 1.136,
    wheelbase: 2.700,
    frontTrack: 1.720,
    rearTrack: 1.680,
    bodyStyle: 'Mid-engine V12 supercar coupe',
    engine: '6.5L naturally aspirated V12 (770 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#4ade80', // Verde Alceo satin green
    secondaryColorHex: '#18181b', // Carbon fiber
    wheelFinishHex: '#18181b',
    caliperColorHex: '#e11d48',
    cowlRatio: 0.18,
    roofPeakRatio: -0.15,
    rearDeckRatio: -0.62,
    tumblehome: 0.58,
    finCount: 6,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 7,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 355
  },
  {
    id: 'lamborghini_huracan_sto',
    category: 'supercars',
    make: 'Lamborghini',
    model: 'Huracan STO',
    generation: 'Super Trofeo Omologata',
    year: 2021,
    length: 4.549,
    width: 1.945,
    height: 1.220,
    wheelbase: 2.620,
    frontTrack: 1.688,
    rearTrack: 1.647,
    bodyStyle: 'Track-focused V10 supercar',
    engine: '5.2L naturally aspirated V10 (640 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#38bdf8', // Blu Laufey
    secondaryColorHex: '#f97316', // Arancio California
    wheelFinishHex: '#18181b',
    caliperColorHex: '#f97316',
    cowlRatio: 0.20,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.60,
    tumblehome: 0.60,
    finCount: 5,
    hasRoofScoop: true,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 5,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 305
  },
  {
    id: 'lamborghini_revuelto',
    category: 'supercars',
    make: 'Lamborghini',
    model: 'Revuelto',
    generation: 'LB744',
    year: 2024,
    length: 4.947,
    width: 2.080,
    height: 1.160,
    wheelbase: 2.779,
    frontTrack: 1.720,
    rearTrack: 1.701,
    bodyStyle: 'V12 plug-in hybrid HPEV coupe',
    engine: '6.5L V12 + 3 electric motors (1015 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#f97316', // Arancio Apodis
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#27272a',
    caliperColorHex: '#f97316',
    cowlRatio: 0.19,
    roofPeakRatio: -0.16,
    rearDeckRatio: -0.62,
    tumblehome: 0.58,
    finCount: 6,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 5,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 265,
    tireWidthRearMm: 345
  },
  {
    id: 'ferrari_488_pista',
    category: 'supercars',
    make: 'Ferrari',
    model: '488 Pista',
    generation: 'F142M',
    year: 2019,
    length: 4.605,
    width: 1.975,
    height: 1.206,
    wheelbase: 2.650,
    frontTrack: 1.679,
    rearTrack: 1.649,
    bodyStyle: 'Mid-engine V8 track special coupe',
    engine: '3.9L twin-turbo V8 (720 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#dc2626', // Rosso Corsa
    secondaryColorHex: '#2563eb', // Blue Nart racing stripe
    wheelFinishHex: '#18181b',
    caliperColorHex: '#eab308',
    cowlRatio: 0.22,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.58,
    tumblehome: 0.62,
    finCount: 5,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: true, // S-Duct
    spokeCount: 10,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 305
  },
  {
    id: 'ferrari_f8_tributo',
    category: 'supercars',
    make: 'Ferrari',
    model: 'F8 Tributo',
    generation: 'F142M Tributo',
    year: 2020,
    length: 4.611,
    width: 1.979,
    height: 1.206,
    wheelbase: 2.650,
    frontTrack: 1.677,
    rearTrack: 1.646,
    bodyStyle: 'Mid-engine berlinetta coupe',
    engine: '3.9L twin-turbo V8 (720 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#b91c1c', // Rosso Scuderia
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#71717a',
    caliperColorHex: '#eab308',
    cowlRatio: 0.22,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.58,
    tumblehome: 0.62,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 5,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 305
  },
  {
    id: 'ferrari_296_gtb',
    category: 'supercars',
    make: 'Ferrari',
    model: '296 GTB',
    generation: 'F171',
    year: 2022,
    length: 4.565,
    width: 1.958,
    height: 1.187,
    wheelbase: 2.600,
    frontTrack: 1.665,
    rearTrack: 1.632,
    bodyStyle: 'Mid-engine V6 plug-in hybrid berlinetta',
    engine: '3.0L 120-deg twin-turbo V6 + MGU-K (830 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#dc2626',
    secondaryColorHex: '#eab308', // Assetto Fiorano yellow
    wheelFinishHex: '#27272a',
    caliperColorHex: '#18181b',
    cowlRatio: 0.23,
    roofPeakRatio: -0.19,
    rearDeckRatio: -0.58,
    tumblehome: 0.61,
    finCount: 5,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 5,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 305
  },
  {
    id: 'ferrari_sf90_stradale',
    category: 'supercars',
    make: 'Ferrari',
    model: 'SF90 Stradale',
    generation: 'F173',
    year: 2021,
    length: 4.710,
    width: 1.972,
    height: 1.186,
    wheelbase: 2.650,
    frontTrack: 1.679,
    rearTrack: 1.652,
    bodyStyle: 'All-wheel drive plug-in hybrid flagship supercar',
    engine: '4.0L twin-turbo V8 + 3 electric motors (1000 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#991b1b', // Rosso Fuoco
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#18181b',
    caliperColorHex: '#eab308',
    cowlRatio: 0.21,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.60,
    tumblehome: 0.59,
    finCount: 6,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 315
  },
  {
    id: 'mclaren_720s',
    category: 'supercars',
    make: 'McLaren',
    model: '720S',
    generation: 'P14',
    year: 2018,
    length: 4.543,
    width: 1.930,
    height: 1.196,
    wheelbase: 2.670,
    frontTrack: 1.674,
    rearTrack: 1.629,
    bodyStyle: 'Carbon Monocage II mid-engine supercar',
    engine: '4.0L twin-turbo V8 (720 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#ea580c', // McLaren Orange
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#3f3f46',
    caliperColorHex: '#ea580c',
    cowlRatio: 0.22,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.58,
    tumblehome: 0.58,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 305
  },
  {
    id: 'mclaren_765lt',
    category: 'supercars',
    make: 'McLaren',
    model: '765LT',
    generation: 'P14 LT',
    year: 2021,
    length: 4.600,
    width: 1.930,
    height: 1.157,
    wheelbase: 2.670,
    frontTrack: 1.656,
    rearTrack: 1.612,
    bodyStyle: 'Extended Longtail carbon track supercar',
    engine: '4.0L twin-turbo V8 (765 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#84cc16', // Lime Green
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#18181b',
    caliperColorHex: '#84cc16',
    cowlRatio: 0.21,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.63,
    tumblehome: 0.57,
    finCount: 6,
    hasRoofScoop: true,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 305
  },
  {
    id: 'mclaren_artura',
    category: 'supercars',
    make: 'McLaren',
    model: 'Artura',
    generation: 'P16',
    year: 2023,
    length: 4.539,
    width: 1.913,
    height: 1.193,
    wheelbase: 2.640,
    frontTrack: 1.650,
    rearTrack: 1.613,
    bodyStyle: 'MCLA carbon architecture hybrid supercar',
    engine: '3.0L twin-turbo V6 + axial flux motor (680 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#06b6d4', // Flux Green / Teal
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#27272a',
    caliperColorHex: '#06b6d4',
    cowlRatio: 0.23,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.58,
    tumblehome: 0.60,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: false,
    spokeCount: 7,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 235,
    tireWidthRearMm: 295
  },

  // 11-20 HYPERCARS
  {
    id: 'bugatti_chiron',
    category: 'hypercars',
    make: 'Bugatti',
    model: 'Chiron',
    generation: 'Chiron Base',
    year: 2017,
    length: 4.544,
    width: 2.038,
    height: 1.212,
    wheelbase: 2.711,
    frontTrack: 1.749,
    rearTrack: 1.675,
    bodyStyle: 'Quad-turbo W16 luxury hypercar',
    engine: '8.0L quad-turbocharged W16 (1500 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#1d4ed8', // French Racing Blue
    secondaryColorHex: '#0f172a', // Deep Atlantic Blue
    wheelFinishHex: '#e2e8f0',
    caliperColorHex: '#1d4ed8',
    cowlRatio: 0.22,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.60,
    tumblehome: 0.60,
    finCount: 5,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 5,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 285,
    tireWidthRearMm: 355
  },
  {
    id: 'bugatti_bolide',
    category: 'hypercars',
    make: 'Bugatti',
    model: 'Bolide',
    generation: 'Bolide Track-Only',
    year: 2024,
    length: 4.756,
    width: 1.998,
    height: 0.995,
    wheelbase: 2.750,
    frontTrack: 1.720,
    rearTrack: 1.680,
    bodyStyle: 'Ultra-lightweight track hypercar with morphable skin',
    engine: '8.0L quad-turbo W16 (1850 hp)',
    aeroType: 'massive_wing',
    primaryColorHex: '#0284c7', // French Racing Blue
    secondaryColorHex: '#09090b', // Exposed matte carbon
    wheelFinishHex: '#09090b',
    caliperColorHex: '#0284c7',
    cowlRatio: 0.19,
    roofPeakRatio: -0.16,
    rearDeckRatio: -0.65,
    tumblehome: 0.55,
    finCount: 8,
    hasRoofScoop: true,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 18,
    rimDiameterRearIn: 18,
    tireWidthFrontMm: 300,
    tireWidthRearMm: 340
  },
  {
    id: 'koenigsegg_jesko',
    category: 'hypercars',
    make: 'Koenigsegg',
    model: 'Jesko',
    generation: 'Jesko Attack',
    year: 2021,
    length: 4.610,
    width: 2.030,
    height: 1.210,
    wheelbase: 2.700,
    frontTrack: 1.698,
    rearTrack: 1.659,
    bodyStyle: 'Megacar with Light Speed Transmission & top-mount wing',
    engine: '5.0L twin-turbo flat-plane V8 (1600 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#f8fafc', // Crystal White
    secondaryColorHex: '#0284c7', // Anodized Cyan accents
    wheelFinishHex: '#0f172a',
    caliperColorHex: '#0284c7',
    cowlRatio: 0.20,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.60,
    tumblehome: 0.58,
    finCount: 6,
    hasRoofScoop: true,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 7,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 265,
    tireWidthRearMm: 345
  },
  {
    id: 'koenigsegg_regera',
    category: 'hypercars',
    make: 'Koenigsegg',
    model: 'Regera',
    generation: 'Direct Drive',
    year: 2018,
    length: 4.560,
    width: 2.050,
    height: 1.110,
    wheelbase: 2.662,
    frontTrack: 1.700,
    rearTrack: 1.650,
    bodyStyle: 'Koenigsegg Direct Drive hybrid luxury megacar',
    engine: '5.0L twin-turbo V8 + 3 electric motors (1500 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#475569', // Slate Gray
    secondaryColorHex: '#e2e8f0', // Striping
    wheelFinishHex: '#1e293b',
    caliperColorHex: '#1e293b',
    cowlRatio: 0.21,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.59,
    tumblehome: 0.60,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 9,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 275,
    tireWidthRearMm: 345
  },
  {
    id: 'pagani_huayra',
    category: 'hypercars',
    make: 'Pagani',
    model: 'Huayra',
    generation: 'Huayra BC',
    year: 2016,
    length: 4.605,
    width: 2.036,
    height: 1.169,
    wheelbase: 2.795,
    frontTrack: 1.654,
    rearTrack: 1.624,
    bodyStyle: 'Carbon-Titanium active aerodynamic hypercar',
    engine: '6.0L Mercedes-AMG bi-turbo V12 (789 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#e2e8f0', // Silver / Grigio
    secondaryColorHex: '#18181b', // Carbon fiber
    wheelFinishHex: '#eab308', // Gold wheels
    caliperColorHex: '#18181b',
    cowlRatio: 0.22,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.61,
    tumblehome: 0.58,
    finCount: 5,
    hasRoofScoop: true,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 7,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 355
  },
  {
    id: 'pagani_utopia',
    category: 'hypercars',
    make: 'Pagani',
    model: 'Utopia',
    generation: 'C10',
    year: 2023,
    length: 4.640,
    width: 2.060,
    height: 1.165,
    wheelbase: 2.795,
    frontTrack: 1.680,
    rearTrack: 1.630,
    bodyStyle: 'Sculpted lightweight manual-transmission hypercar',
    engine: '6.0L Mercedes-AMG twin-turbo V12 (864 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#f8fafc', // Rinascimento Pearl
    secondaryColorHex: '#78350f', // Cuoio leather & titanium
    wheelFinishHex: '#a1a1aa',
    caliperColorHex: '#78350f',
    cowlRatio: 0.23,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.59,
    tumblehome: 0.60,
    finCount: 4,
    hasRoofScoop: true,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 8,
    rimDiameterFrontIn: 21,
    rimDiameterRearIn: 22,
    tireWidthFrontMm: 265,
    tireWidthRearMm: 325
  },
  {
    id: 'mclaren_p1',
    category: 'hypercars',
    make: 'McLaren',
    model: 'P1',
    generation: 'Ultimate Series P1',
    year: 2014,
    length: 4.588,
    width: 1.946,
    height: 1.188,
    wheelbase: 2.670,
    frontTrack: 1.658,
    rearTrack: 1.604,
    bodyStyle: 'MonoCage hybrid hypercar with hydraulic race wing',
    engine: '3.8L twin-turbo V8 + electric motor (916 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#eab308', // Volcano Yellow
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#18181b',
    caliperColorHex: '#eab308',
    cowlRatio: 0.22,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.61,
    tumblehome: 0.58,
    finCount: 6,
    hasRoofScoop: true,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 315
  },
  {
    id: 'ferrari_laferrari',
    category: 'hypercars',
    make: 'Ferrari',
    model: 'LaFerrari',
    generation: 'F150',
    year: 2014,
    length: 4.702,
    width: 1.992,
    height: 1.116,
    wheelbase: 2.650,
    frontTrack: 1.634,
    rearTrack: 1.672,
    bodyStyle: 'HY-KERS composite monocoque hypercar',
    engine: '6.3L naturally aspirated V12 + HY-KERS (963 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#dc2626', // Rosso Corsa
    secondaryColorHex: '#09090b', // Gloss Nero roof
    wheelFinishHex: '#71717a',
    caliperColorHex: '#eab308',
    cowlRatio: 0.21,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.62,
    tumblehome: 0.57,
    finCount: 6,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 5,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 265,
    tireWidthRearMm: 345
  },
  {
    id: 'porsche_918_spyder',
    category: 'hypercars',
    make: 'Porsche',
    model: '918 Spyder',
    generation: '918',
    year: 2015,
    length: 4.643,
    width: 1.940,
    height: 1.167,
    wheelbase: 2.730,
    frontTrack: 1.664,
    rearTrack: 1.612,
    bodyStyle: 'Carbon monocoque plug-in hybrid spyder',
    engine: '4.6L naturally aspirated V8 + 2 electric motors (887 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#94a3b8', // Liquid Metal Silver
    secondaryColorHex: '#84cc16', // Acid Green accents
    wheelFinishHex: '#e2e8f0',
    caliperColorHex: '#84cc16',
    cowlRatio: 0.23,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.60,
    tumblehome: 0.60,
    finCount: 5,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 5,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 265,
    tireWidthRearMm: 325
  },
  {
    id: 'aston_martin_valkyrie',
    category: 'hypercars',
    make: 'Aston Martin',
    model: 'Valkyrie',
    generation: 'AM-RB 001',
    year: 2022,
    length: 4.500,
    width: 1.980,
    height: 1.070,
    wheelbase: 2.770,
    frontTrack: 1.680,
    rearTrack: 1.620,
    bodyStyle: 'Formula One inspired full venturi-tunnel hypercar',
    engine: '6.5L Cosworth naturally aspirated V12 (1160 hp @ 11,100 rpm)',
    aeroType: 'massive_wing',
    primaryColorHex: '#047857', // Aston Martin Racing Green
    secondaryColorHex: '#18181b', // Carbon fiber
    wheelFinishHex: '#09090b',
    caliperColorHex: '#047857',
    cowlRatio: 0.18,
    roofPeakRatio: -0.15,
    rearDeckRatio: -0.63,
    tumblehome: 0.54,
    finCount: 8,
    hasRoofScoop: true,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 265,
    tireWidthRearMm: 325
  },

  // 21-30 SPORTS CARS
  {
    id: 'porsche_911_gt3_rs',
    category: 'sports_cars',
    make: 'Porsche',
    model: '911 GT3 RS',
    generation: '992',
    year: 2023,
    length: 4.572,
    width: 1.900,
    height: 1.322,
    wheelbase: 2.457,
    frontTrack: 1.630,
    rearTrack: 1.582,
    bodyStyle: 'Rear-engine track-focused aerodynamic coupe',
    engine: '4.0L naturally aspirated flat-six (525 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#94a3b8', // GT Silver
    secondaryColorHex: '#dc2626', // Pyro Red livery
    wheelFinishHex: '#dc2626',
    caliperColorHex: '#eab308',
    cowlRatio: 0.28,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.58,
    tumblehome: 0.64,
    finCount: 5,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 275,
    tireWidthRearMm: 335
  },
  {
    id: 'porsche_911_turbo_s',
    category: 'sports_cars',
    make: 'Porsche',
    model: '911 Turbo S',
    generation: '992',
    year: 2021,
    length: 4.535,
    width: 1.900,
    height: 1.303,
    wheelbase: 2.450,
    frontTrack: 1.583,
    rearTrack: 1.600,
    bodyStyle: 'All-wheel drive high-performance flagship coupe',
    engine: '3.8L twin-turbo flat-six (650 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#3b82f6', // Shark Blue
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#71717a',
    caliperColorHex: '#eab308',
    cowlRatio: 0.28,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.58,
    tumblehome: 0.65,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 10,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 315
  },
  {
    id: 'chevrolet_corvette_c8_z06',
    category: 'sports_cars',
    make: 'Chevrolet',
    model: 'Corvette C8 Z06',
    generation: 'C8',
    year: 2023,
    length: 4.688,
    width: 2.025,
    height: 1.235,
    wheelbase: 2.722,
    frontTrack: 1.685,
    rearTrack: 1.678,
    bodyStyle: 'Mid-engine flat-plane crank supercar coupe',
    engine: '5.5L naturally aspirated LT6 flat-plane V8 (670 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#f59e0b', // Accelerate Yellow
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#18181b',
    caliperColorHex: '#f59e0b',
    cowlRatio: 0.22,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.60,
    tumblehome: 0.60,
    finCount: 5,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 5,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 275,
    tireWidthRearMm: 345
  },
  {
    id: 'nissan_gt_r_r35',
    category: 'sports_cars',
    make: 'Nissan',
    model: 'GT-R Nismo',
    generation: 'R35',
    year: 2024,
    length: 4.710,
    width: 1.895,
    height: 1.370,
    wheelbase: 2.780,
    frontTrack: 1.600,
    rearTrack: 1.600,
    bodyStyle: 'ATTESA E-TS all-wheel drive performance coupe',
    engine: '3.8L twin-turbo VR38DETT V6 (600 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#f8fafc', // Stealth Gray / White
    secondaryColorHex: '#dc2626', // Nismo Red striping
    wheelFinishHex: '#18181b',
    caliperColorHex: '#eab308',
    cowlRatio: 0.32,
    roofPeakRatio: -0.16,
    rearDeckRatio: -0.56,
    tumblehome: 0.68,
    finCount: 5,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 9,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 285
  },
  {
    id: 'toyota_gr_supra',
    category: 'sports_cars',
    make: 'Toyota',
    model: 'GR Supra',
    generation: 'A90',
    year: 2023,
    length: 4.379,
    width: 1.854,
    height: 1.292,
    wheelbase: 2.470,
    frontTrack: 1.594,
    rearTrack: 1.589,
    bodyStyle: 'Front-engine rear-wheel-drive sports coupe with double bubble roof',
    engine: '3.0L turbocharged inline-six (382 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#dc2626', // Renaissance Red
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#27272a',
    caliperColorHex: '#dc2626',
    cowlRatio: 0.35,
    roofPeakRatio: -0.16,
    rearDeckRatio: -0.55,
    tumblehome: 0.63,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 5,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 19,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 275
  },
  {
    id: 'bmw_m4_csl',
    category: 'sports_cars',
    make: 'BMW',
    model: 'M4 CSL',
    generation: 'G82',
    year: 2023,
    length: 4.794,
    width: 1.921,
    height: 1.386,
    wheelbase: 2.857,
    frontTrack: 1.623,
    rearTrack: 1.611,
    bodyStyle: 'Lightweight competition sports coupe with integrated ducktail',
    engine: '3.0L twin-turbo S58 inline-six (550 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#475569', // Frozen Brooklyn Grey
    secondaryColorHex: '#dc2626', // Red motorsport accents
    wheelFinishHex: '#18181b',
    caliperColorHex: '#dc2626',
    cowlRatio: 0.34,
    roofPeakRatio: -0.15,
    rearDeckRatio: -0.54,
    tumblehome: 0.67,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 275,
    tireWidthRearMm: 285
  },
  {
    id: 'mercedes_amg_gt_r',
    category: 'sports_cars',
    make: 'Mercedes-AMG',
    model: 'GT R',
    generation: 'C190',
    year: 2019,
    length: 4.551,
    width: 2.007,
    height: 1.284,
    wheelbase: 2.630,
    frontTrack: 1.687,
    rearTrack: 1.679,
    bodyStyle: 'Front mid-engine transaxle track sports car',
    engine: '4.0L twin-turbo V8 hot-inside-V (585 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#16a34a', // AMG Green Hell Magno
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#18181b',
    caliperColorHex: '#eab308',
    cowlRatio: 0.38,
    roofPeakRatio: -0.15,
    rearDeckRatio: -0.54,
    tumblehome: 0.62,
    finCount: 5,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: false,
    spokeCount: 10,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 275,
    tireWidthRearMm: 325
  },
  {
    id: 'audi_r8_v10_performance',
    category: 'sports_cars',
    make: 'Audi',
    model: 'R8 V10 Performance',
    generation: 'Type 4S',
    year: 2022,
    length: 4.429,
    width: 1.940,
    height: 1.240,
    wheelbase: 2.650,
    frontTrack: 1.645,
    rearTrack: 1.599,
    bodyStyle: 'Mid-engine quattro supercar with carbon sideblades',
    engine: '5.2L naturally aspirated FSI V10 (620 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#2563eb', // Ascari Blue
    secondaryColorHex: '#18181b', // Carbon sideblades
    wheelFinishHex: '#a1a1aa',
    caliperColorHex: '#dc2626',
    cowlRatio: 0.22,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.58,
    tumblehome: 0.62,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 5,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 305
  },
  {
    id: 'lexus_lfa',
    category: 'sports_cars',
    make: 'Lexus',
    model: 'LFA',
    generation: 'LFA Base',
    year: 2012,
    length: 4.505,
    width: 1.895,
    height: 1.220,
    wheelbase: 2.605,
    frontTrack: 1.580,
    rearTrack: 1.570,
    bodyStyle: 'CFRP carbon fiber front mid-engine V10 coupe',
    engine: '4.8L 72-deg naturally aspirated 1LR-GUE V10 (560 hp @ 9,000 rpm)',
    aeroType: 'active_wing',
    primaryColorHex: '#f8fafc', // Whitest White
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#52525b',
    caliperColorHex: '#eab308',
    cowlRatio: 0.36,
    roofPeakRatio: -0.16,
    rearDeckRatio: -0.55,
    tumblehome: 0.61,
    finCount: 3,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 265,
    tireWidthRearMm: 305
  },
  {
    id: 'ford_gt',
    category: 'sports_cars',
    make: 'Ford',
    model: 'GT',
    generation: 'Second Generation',
    year: 2017,
    length: 4.779,
    width: 2.003,
    height: 1.109,
    wheelbase: 2.710,
    frontTrack: 1.694,
    rearTrack: 1.674,
    bodyStyle: 'Carbon monocoque with flying buttress aerodynamic body',
    engine: '3.5L twin-turbo EcoBoost V6 (660 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#0284c7', // Liquid Blue
    secondaryColorHex: '#f8fafc', // White stripes
    wheelFinishHex: '#18181b',
    caliperColorHex: '#dc2626',
    cowlRatio: 0.20,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.62,
    tumblehome: 0.54,
    finCount: 6,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 325
  },

  // 31-40 LUXURY CARS
  {
    id: 'rolls_royce_spectre',
    category: 'luxury_cars',
    make: 'Rolls-Royce',
    model: 'Spectre',
    generation: 'RR25',
    year: 2024,
    length: 5.453,
    width: 2.080,
    height: 1.559,
    wheelbase: 3.210,
    frontTrack: 1.720,
    rearTrack: 1.700,
    bodyStyle: 'All-electric ultra-luxury fastback grand tourer',
    engine: 'Dual electric motors (584 hp)',
    aeroType: 'luxury_flush',
    primaryColorHex: '#475569', // Chartreuse / Imperial Jade
    secondaryColorHex: '#0f172a', // Black Diamond two-tone
    wheelFinishHex: '#e2e8f0', // Polished alloy
    caliperColorHex: '#0f172a',
    cowlRatio: 0.36,
    roofPeakRatio: -0.12,
    rearDeckRatio: -0.52,
    tumblehome: 0.72,
    finCount: 2,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 7,
    rimDiameterFrontIn: 23,
    rimDiameterRearIn: 23,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 295
  },
  {
    id: 'rolls_royce_wraith',
    category: 'luxury_cars',
    make: 'Rolls-Royce',
    model: 'Wraith',
    generation: 'Wraith Black Badge',
    year: 2021,
    length: 5.285,
    width: 1.947,
    height: 1.507,
    wheelbase: 3.112,
    frontTrack: 1.622,
    rearTrack: 1.660,
    bodyStyle: 'V12 twin-turbo fastback luxury coupe',
    engine: '6.6L twin-turbo V12 (624 hp)',
    aeroType: 'luxury_flush',
    primaryColorHex: '#09090b', // Diamond Black
    secondaryColorHex: '#38bdf8', // Mandarin pinstripe
    wheelFinishHex: '#18181b', // Carbon composite wheels
    caliperColorHex: '#38bdf8',
    cowlRatio: 0.36,
    roofPeakRatio: -0.13,
    rearDeckRatio: -0.52,
    tumblehome: 0.71,
    finCount: 2,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 5,
    rimDiameterFrontIn: 21,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 285
  },
  {
    id: 'bentley_continental_gt',
    category: 'luxury_cars',
    make: 'Bentley',
    model: 'Continental GT',
    generation: 'Third Gen',
    year: 2023,
    length: 4.850,
    width: 1.954,
    height: 1.405,
    wheelbase: 2.851,
    frontTrack: 1.672,
    rearTrack: 1.664,
    bodyStyle: 'W12 twin-turbo luxury grand tourer coupe',
    engine: '6.0L twin-turbo W12 (659 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#065f46', // British Racing Green
    secondaryColorHex: '#d1d5db',
    wheelFinishHex: '#e2e8f0',
    caliperColorHex: '#18181b',
    cowlRatio: 0.33,
    roofPeakRatio: -0.15,
    rearDeckRatio: -0.54,
    tumblehome: 0.68,
    finCount: 3,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: false,
    spokeCount: 10,
    rimDiameterFrontIn: 22,
    rimDiameterRearIn: 22,
    tireWidthFrontMm: 275,
    tireWidthRearMm: 315
  },
  {
    id: 'bentley_flying_spur',
    category: 'luxury_cars',
    make: 'Bentley',
    model: 'Flying Spur',
    generation: 'Third Gen',
    year: 2023,
    length: 5.316,
    width: 1.978,
    height: 1.484,
    wheelbase: 3.194,
    frontTrack: 1.669,
    rearTrack: 1.664,
    bodyStyle: 'Executive four-door luxury super-saloon',
    engine: '6.0L twin-turbo W12 (635 hp)',
    aeroType: 'luxury_flush',
    primaryColorHex: '#1e3a8a', // Sequin Blue
    secondaryColorHex: '#e2e8f0', // Chrome matrix grille
    wheelFinishHex: '#e2e8f0',
    caliperColorHex: '#18181b',
    cowlRatio: 0.35,
    roofPeakRatio: -0.12,
    rearDeckRatio: -0.50,
    tumblehome: 0.72,
    finCount: 2,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: false,
    spokeCount: 10,
    rimDiameterFrontIn: 22,
    rimDiameterRearIn: 22,
    tireWidthFrontMm: 275,
    tireWidthRearMm: 315
  },
  {
    id: 'mercedes_benz_s_class',
    category: 'luxury_cars',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    generation: 'W223',
    year: 2023,
    length: 5.289,
    width: 1.954,
    height: 1.503,
    wheelbase: 3.216,
    frontTrack: 1.655,
    rearTrack: 1.683,
    bodyStyle: 'Flagship luxury sedan with flush seamless design',
    engine: '4.0L twin-turbo V8 with EQ Boost (496 hp)',
    aeroType: 'luxury_flush',
    primaryColorHex: '#0f172a', // Obsidian Black
    secondaryColorHex: '#cbd5e1', // Chrome trim
    wheelFinishHex: '#94a3b8',
    caliperColorHex: '#475569',
    cowlRatio: 0.35,
    roofPeakRatio: -0.12,
    rearDeckRatio: -0.51,
    tumblehome: 0.73,
    finCount: 2,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 10,
    rimDiameterFrontIn: 21,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 285
  },
  {
    id: 'bmw_7_series',
    category: 'luxury_cars',
    make: 'BMW',
    model: '7 Series',
    generation: 'G70',
    year: 2024,
    length: 5.391,
    width: 1.950,
    height: 1.544,
    wheelbase: 3.215,
    frontTrack: 1.665,
    rearTrack: 1.685,
    bodyStyle: 'Monolithic luxury sedan with illuminated kidney grille',
    engine: '4.4L twin-turbo V8 mild-hybrid (536 hp)',
    aeroType: 'luxury_flush',
    primaryColorHex: '#1e293b', // Oxide Grey / Black Sapphire
    secondaryColorHex: '#64748b',
    wheelFinishHex: '#1e293b',
    caliperColorHex: '#2563eb',
    cowlRatio: 0.35,
    roofPeakRatio: -0.12,
    rearDeckRatio: -0.50,
    tumblehome: 0.74,
    finCount: 2,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 10,
    rimDiameterFrontIn: 21,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 285
  },
  {
    id: 'mercedes_maybach_s_class',
    category: 'luxury_cars',
    make: 'Mercedes-Maybach',
    model: 'S-Class',
    generation: 'Z223',
    year: 2024,
    length: 5.469,
    width: 1.921,
    height: 1.510,
    wheelbase: 3.396,
    frontTrack: 1.655,
    rearTrack: 1.683,
    bodyStyle: 'Extended wheelbase ultra-luxury limousine',
    engine: '6.0L twin-turbo V12 (621 hp)',
    aeroType: 'luxury_flush',
    primaryColorHex: '#831843', // Rubellite Red
    secondaryColorHex: '#d4af37', // Kalahari Gold two-tone
    wheelFinishHex: '#e2e8f0', // Classic dish wheels
    caliperColorHex: '#18181b',
    cowlRatio: 0.36,
    roofPeakRatio: -0.11,
    rearDeckRatio: -0.50,
    tumblehome: 0.74,
    finCount: 2,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 5,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 255,
    tireWidthRearMm: 285
  },
  {
    id: 'aston_martin_db12',
    category: 'luxury_cars',
    make: 'Aston Martin',
    model: 'DB12',
    generation: 'DB12',
    year: 2024,
    length: 4.725,
    width: 1.980,
    height: 1.295,
    wheelbase: 2.805,
    frontTrack: 1.665,
    rearTrack: 1.680,
    bodyStyle: 'Super Tourer high-performance luxury coupe',
    engine: '4.0L twin-turbo V8 (680 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#0f766e', // Iridescent Emerald
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#27272a',
    caliperColorHex: '#0f766e',
    cowlRatio: 0.35,
    roofPeakRatio: -0.15,
    rearDeckRatio: -0.54,
    tumblehome: 0.65,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 5,
    rimDiameterFrontIn: 21,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 275,
    tireWidthRearMm: 315
  },
  {
    id: 'maserati_mc20',
    category: 'luxury_cars',
    make: 'Maserati',
    model: 'MC20',
    generation: 'M240',
    year: 2022,
    length: 4.669,
    width: 1.965,
    height: 1.221,
    wheelbase: 2.700,
    frontTrack: 1.681,
    rearTrack: 1.649,
    bodyStyle: 'Italian mid-engine luxury carbon sports car with butterfly doors',
    engine: '3.0L Nettuno pre-chamber twin-turbo V6 (630 hp)',
    aeroType: 'decklid_lip',
    primaryColorHex: '#f8fafc', // Bianco Audace
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#18181b',
    caliperColorHex: '#2563eb',
    cowlRatio: 0.23,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.58,
    tumblehome: 0.60,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 7,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 305
  },
  {
    id: 'porsche_panamera_turbo',
    category: 'luxury_cars',
    make: 'Porsche',
    model: 'Panamera Turbo',
    generation: 'G3',
    year: 2024,
    length: 5.052,
    width: 1.937,
    height: 1.423,
    wheelbase: 2.950,
    frontTrack: 1.670,
    rearTrack: 1.650,
    bodyStyle: 'High-performance four-door sports saloon with active 3-stage spoiler',
    engine: '4.0L twin-turbo V8 E-Hybrid (680 hp)',
    aeroType: 'active_wing',
    primaryColorHex: '#475569', // Turbonite Metallic
    secondaryColorHex: '#0f172a',
    wheelFinishHex: '#334155',
    caliperColorHex: '#eab308',
    cowlRatio: 0.33,
    roofPeakRatio: -0.14,
    rearDeckRatio: -0.52,
    tumblehome: 0.69,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: false,
    spokeCount: 10,
    rimDiameterFrontIn: 21,
    rimDiameterRearIn: 21,
    tireWidthFrontMm: 275,
    tireWidthRearMm: 315
  },

  // 41-50 JDM, MUSCLE AND SPECIAL CARS
  {
    id: 'nissan_skyline_gt_r_r34',
    category: 'jdm_cars',
    make: 'Nissan',
    model: 'Skyline GT-R',
    generation: 'R34 V-Spec II',
    year: 2002,
    length: 4.600,
    width: 1.785,
    height: 1.360,
    wheelbase: 2.665,
    frontTrack: 1.480,
    rearTrack: 1.490,
    bodyStyle: 'Iconic all-wheel drive twin-turbo sports coupe',
    engine: '2.6L twin-turbo RB26DETT inline-six (280+ hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#1e3a8a', // Bayside Blue
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#d1d5db',
    caliperColorHex: '#eab308',
    cowlRatio: 0.32,
    roofPeakRatio: -0.15,
    rearDeckRatio: -0.54,
    tumblehome: 0.69,
    finCount: 3,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true, // NACA duct
    spokeCount: 6,
    rimDiameterFrontIn: 18,
    rimDiameterRearIn: 18,
    tireWidthFrontMm: 245,
    tireWidthRearMm: 245
  },
  {
    id: 'mazda_rx_7_fd',
    category: 'jdm_cars',
    make: 'Mazda',
    model: 'RX-7',
    generation: 'FD3S Spirit R',
    year: 2002,
    length: 4.285,
    width: 1.760,
    height: 1.230,
    wheelbase: 2.425,
    frontTrack: 1.460,
    rearTrack: 1.460,
    bodyStyle: 'Lightweight sequential twin-turbo rotary sports coupe',
    engine: '1.3L twin-rotor 13B-REW (280 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#94a3b8', // Titanium Gray Metallic
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#52525b',
    caliperColorHex: '#dc2626',
    cowlRatio: 0.33,
    roofPeakRatio: -0.16,
    rearDeckRatio: -0.55,
    tumblehome: 0.63,
    finCount: 3,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: false,
    spokeCount: 5,
    rimDiameterFrontIn: 17,
    rimDiameterRearIn: 17,
    tireWidthFrontMm: 235,
    tireWidthRearMm: 255
  },
  {
    id: 'honda_nsx',
    category: 'jdm_cars',
    make: 'Honda',
    model: 'NSX Type R',
    generation: 'NA2',
    year: 2002,
    length: 4.430,
    width: 1.810,
    height: 1.160,
    wheelbase: 2.530,
    frontTrack: 1.510,
    rearTrack: 1.530,
    bodyStyle: 'All-aluminum mid-engine VTEC sports car',
    engine: '3.2L naturally aspirated C32B DOHC VTEC V6 (290 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#f8fafc', // Championship White
    secondaryColorHex: '#18181b', // Carbon fiber spoiler & hood vent
    wheelFinishHex: '#f8fafc', // White wheels
    caliperColorHex: '#18181b',
    cowlRatio: 0.24,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.57,
    tumblehome: 0.61,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 7,
    rimDiameterFrontIn: 17,
    rimDiameterRearIn: 17,
    tireWidthFrontMm: 215,
    tireWidthRearMm: 255
  },
  {
    id: 'mitsubishi_lancer_evolution_ix',
    category: 'jdm_cars',
    make: 'Mitsubishi',
    model: 'Lancer Evolution IX',
    generation: 'CT9A MR',
    year: 2006,
    length: 4.490,
    width: 1.770,
    height: 1.450,
    wheelbase: 2.625,
    frontTrack: 1.515,
    rearTrack: 1.515,
    bodyStyle: 'All-wheel drive rally-bred sports saloon with Super AYC',
    engine: '2.0L turbocharged 4G63 MIVEC inline-four (286 hp)',
    aeroType: 'rally_wing',
    primaryColorHex: '#dc2626', // Rally Red
    secondaryColorHex: '#18181b',
    wheelFinishHex: '#52525b',
    caliperColorHex: '#eab308',
    cowlRatio: 0.32,
    roofPeakRatio: -0.14,
    rearDeckRatio: -0.52,
    tumblehome: 0.72,
    finCount: 3,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 5,
    rimDiameterFrontIn: 17,
    rimDiameterRearIn: 17,
    tireWidthFrontMm: 235,
    tireWidthRearMm: 235
  },
  {
    id: 'subaru_wrx_sti',
    category: 'jdm_cars',
    make: 'Subaru',
    model: 'Impreza WRX STI',
    generation: 'GD Hawkeye',
    year: 2006,
    length: 4.465,
    width: 1.740,
    height: 1.440,
    wheelbase: 2.540,
    frontTrack: 1.490,
    rearTrack: 1.495,
    bodyStyle: 'Symmetrical AWD rally weapon with DCCD & roof vane',
    engine: '2.5L turbocharged EJ257 boxer-four (300 hp)',
    aeroType: 'rally_wing',
    primaryColorHex: '#1d4ed8', // World Rally Blue
    secondaryColorHex: '#eab308', // Gold BBS wheels
    wheelFinishHex: '#eab308',
    caliperColorHex: '#eab308',
    cowlRatio: 0.32,
    roofPeakRatio: -0.14,
    rearDeckRatio: -0.52,
    tumblehome: 0.72,
    finCount: 3,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 17,
    rimDiameterRearIn: 17,
    tireWidthFrontMm: 225,
    tireWidthRearMm: 225
  },
  {
    id: 'dodge_challenger_srt_demon_170',
    category: 'muscle_cars',
    make: 'Dodge',
    model: 'Challenger SRT Demon 170',
    generation: 'LD',
    year: 2023,
    length: 5.016,
    width: 2.020,
    height: 1.459,
    wheelbase: 2.950,
    frontTrack: 1.670,
    rearTrack: 1.660,
    bodyStyle: 'Drag-strip ready supercharged factory muscle car',
    engine: '6.2L supercharged HEMI V8 (1025 hp on E85)',
    aeroType: 'drag_ducktail',
    primaryColorHex: '#7f1d1d', // Octane Red
    secondaryColorHex: '#18181b', // Satin black hood & roof
    wheelFinishHex: '#18181b',
    caliperColorHex: '#dc2626',
    cowlRatio: 0.37,
    roofPeakRatio: -0.14,
    rearDeckRatio: -0.51,
    tumblehome: 0.73,
    finCount: 2,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true, // Massive Air Grabber hood scoop
    spokeCount: 5,
    rimDiameterFrontIn: 18,
    rimDiameterRearIn: 17, // Staggered drag setup
    tireWidthFrontMm: 245,
    tireWidthRearMm: 315
  },
  {
    id: 'ford_mustang_shelby_gt500',
    category: 'muscle_cars',
    make: 'Ford',
    model: 'Mustang Shelby GT500',
    generation: 'S550',
    year: 2022,
    length: 4.831,
    width: 1.958,
    height: 1.380,
    wheelbase: 2.720,
    frontTrack: 1.650,
    rearTrack: 1.650,
    bodyStyle: 'Track-tuned supercharged American muscle car',
    engine: '5.2L supercharged Predator cross-plane V8 (760 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#0284c7', // Grabber Blue
    secondaryColorHex: '#f8fafc', // White Le Mans stripes
    wheelFinishHex: '#18181b',
    caliperColorHex: '#dc2626',
    cowlRatio: 0.35,
    roofPeakRatio: -0.15,
    rearDeckRatio: -0.53,
    tumblehome: 0.68,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: true,
    hasHoodScoop: true, // Massive louvered hood vent
    spokeCount: 7,
    rimDiameterFrontIn: 20,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 305,
    tireWidthRearMm: 315
  },
  {
    id: 'chevrolet_camaro_zl1',
    category: 'muscle_cars',
    make: 'Chevrolet',
    model: 'Camaro ZL1 1LE',
    generation: 'Sixth Generation',
    year: 2023,
    length: 4.812,
    width: 1.905,
    height: 1.330,
    wheelbase: 2.811,
    frontTrack: 1.610,
    rearTrack: 1.590,
    bodyStyle: 'Extreme track package supercharged muscle coupe',
    engine: '6.2L supercharged LT4 V8 (650 hp)',
    aeroType: 'swan_neck_gt',
    primaryColorHex: '#ea580c', // Vivid Orange Metallic
    secondaryColorHex: '#18181b', // Carbon fiber exposed weave
    wheelFinishHex: '#18181b',
    caliperColorHex: '#dc2626',
    cowlRatio: 0.35,
    roofPeakRatio: -0.15,
    rearDeckRatio: -0.53,
    tumblehome: 0.67,
    finCount: 4,
    hasRoofScoop: false,
    hasFenderVents: false,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 19,
    tireWidthFrontMm: 305,
    tireWidthRearMm: 325
  },
  {
    id: 'porsche_935',
    category: 'special_edition',
    make: 'Porsche',
    model: '935',
    generation: '991.2 Moby Dick',
    year: 2019,
    length: 4.865,
    width: 2.034,
    height: 1.359,
    wheelbase: 2.457,
    frontTrack: 1.670,
    rearTrack: 1.650,
    bodyStyle: 'Modern tribute to the 935/78 Moby Dick endurance racer',
    engine: '3.8L twin-turbo flat-six (700 hp)',
    aeroType: 'longtail_moby',
    primaryColorHex: '#f8fafc', // Classic Martini White
    secondaryColorHex: '#1e3a8a', // Martini Racing livery
    wheelFinishHex: '#dc2626', // Turbofan aerodynamic covers
    caliperColorHex: '#eab308',
    cowlRatio: 0.28,
    roofPeakRatio: -0.18,
    rearDeckRatio: -0.68,
    tumblehome: 0.64,
    finCount: 6,
    hasRoofScoop: true,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 5,
    rimDiameterFrontIn: 18,
    rimDiameterRearIn: 18,
    tireWidthFrontMm: 265,
    tireWidthRearMm: 345
  },
  {
    id: 'ferrari_fxx_k_evo',
    category: 'track_cars',
    make: 'Ferrari',
    model: 'FXX-K Evo',
    generation: 'FXX-K Programme',
    year: 2018,
    length: 4.900,
    width: 2.050,
    height: 1.116,
    wheelbase: 2.650,
    frontTrack: 1.660,
    rearTrack: 1.680,
    bodyStyle: 'Track-only experimental laboratory hybrid hypercar',
    engine: '6.3L V12 + F1 KERS (1050 hp)',
    aeroType: 'twin_fin_track',
    primaryColorHex: '#dc2626', // Rosso Corsa
    secondaryColorHex: '#ffffff', // White race livery
    wheelFinishHex: '#18181b',
    caliperColorHex: '#dc2626',
    cowlRatio: 0.21,
    roofPeakRatio: -0.17,
    rearDeckRatio: -0.64,
    tumblehome: 0.56,
    finCount: 8,
    hasRoofScoop: true,
    hasFenderVents: true,
    hasHoodScoop: true,
    spokeCount: 10,
    rimDiameterFrontIn: 19,
    rimDiameterRearIn: 20,
    tireWidthFrontMm: 285,
    tireWidthRearMm: 345
  }
];

function generateCrossSections(meta: VehicleRawMeta): LongitudinalCrossSection[] {
  const sections: LongitudinalCrossSection[] = [];
  const STATIONS_COUNT = 17;

  const halfL = meta.length * 0.5;
  const maxHw = meta.width * 0.5;
  const H = meta.height;

  // Front axle and rear axle locations
  const frontAxleZ = meta.wheelbase * 0.5;
  const rearAxleZ = -meta.wheelbase * 0.5;

  const cowlZ = frontAxleZ - meta.wheelbase * meta.cowlRatio;
  const roofPeakZ = meta.wheelbase * meta.roofPeakRatio;
  const rearDeckZ = rearAxleZ - meta.wheelbase * (meta.rearDeckRatio + 0.5);

  for (let i = 0; i < STATIONS_COUNT; i++) {
    const t = i / (STATIONS_COUNT - 1);
    // z runs from +halfL (front nose) to -halfL (rear tail)
    const z = halfL - t * meta.length;

    // Station width envelope
    let hwRatio = 1.0;
    if (z > cowlZ) {
      // Nose tapers forward
      const noseT = (z - cowlZ) / (halfL - cowlZ);
      hwRatio = 1.0 - 0.55 * Math.pow(noseT, 1.8);
    } else if (z < rearDeckZ) {
      // Rear tapers backward
      const tailT = (rearDeckZ - z) / (rearDeckZ - (-halfL));
      hwRatio = 1.0 - 0.25 * Math.pow(tailT, 1.4);
    } else {
      // Waist between cowl and rear deck (subtle coke-bottle pinch)
      const midT = (cowlZ - z) / (cowlZ - rearDeckZ);
      hwRatio = 0.94 + 0.06 * Math.sin(midT * Math.PI);
    }
    const half_width_m = Math.max(0.18, maxHw * hwRatio);

    // Station lower Y (ground clearance)
    let lower_y_m = 0.12;
    if (z > halfL - 0.3) {
      lower_y_m = 0.14 + 0.08 * ((z - (halfL - 0.3)) / 0.3); // Front nose approach angle
    } else if (z < -halfL + 0.4) {
      lower_y_m = 0.14 + 0.12 * (((-halfL + 0.4) - z) / 0.4); // Rear diffuser departure angle
    }

    // Shoulder and belt lines
    let shoulder_y_m = H * 0.52;
    let belt_y_m = H * 0.65;
    let upper_center_y_m = H * 0.70;

    if (z > cowlZ) {
      // Hood slopes down towards nose
      const hoodT = (z - cowlZ) / (halfL - cowlZ);
      upper_center_y_m = (H * 0.68) * (1 - 0.35 * Math.pow(hoodT, 1.3));
      belt_y_m = upper_center_y_m - 0.05;
      shoulder_y_m = belt_y_m - 0.12;
    } else if (z < rearDeckZ) {
      // Deck slopes down towards tail
      const deckT = (rearDeckZ - z) / (rearDeckZ - (-halfL));
      upper_center_y_m = (H * 0.66) * (1 - 0.25 * Math.pow(deckT, 1.2));
      belt_y_m = upper_center_y_m - 0.05;
      shoulder_y_m = belt_y_m - 0.14;
    }

    // Roof profile
    let roof_half_width_m = 0;
    let roof_crown_y_m = upper_center_y_m;

    if (z <= cowlZ && z >= rearDeckZ) {
      // In the cabin region
      const cabinT = (cowlZ - z) / (cowlZ - rearDeckZ);
      // Roof crown height curve
      const peakY = H * 0.985;
      roof_crown_y_m = upper_center_y_m + (peakY - upper_center_y_m) * Math.sin(cabinT * Math.PI);
      roof_half_width_m = half_width_m * meta.tumblehome * Math.sin(cabinT * Math.PI);
    }

    sections.push({
      z_m: Number(z.toFixed(4)),
      half_width_m: Number(half_width_m.toFixed(4)),
      lower_y_m: Number(lower_y_m.toFixed(4)),
      shoulder_y_m: Number(shoulder_y_m.toFixed(4)),
      belt_y_m: Number(belt_y_m.toFixed(4)),
      upper_center_y_m: Number(upper_center_y_m.toFixed(4)),
      roof_half_width_m: Number(roof_half_width_m.toFixed(4)),
      roof_crown_y_m: Number(roof_crown_y_m.toFixed(4))
    });
  }

  return sections;
}

function buildWheelSpec(meta: VehicleRawMeta, axle: 'front' | 'rear', side: 'left' | 'right'): WheelComponentSpec {
  const isFront = axle === 'front';
  const isLeft = side === 'left';

  const z = isFront ? meta.wheelbase * 0.5 : -meta.wheelbase * 0.5;
  const track = isFront ? meta.frontTrack : meta.rearTrack;
  const x = (track * 0.5) * (isLeft ? -1 : 1);

  const rimIn = isFront ? meta.rimDiameterFrontIn : meta.rimDiameterRearIn;
  const widthMm = isFront ? meta.tireWidthFrontMm : meta.tireWidthRearMm;
  const aspect = isFront ? 35 : 30;

  const sidewallMm = widthMm * (aspect / 100);
  const outerDiaMm = rimIn * 25.4 + 2 * sidewallMm;
  const radiusM = (outerDiaMm / 1000) * 0.5;
  const y = radiusM;

  return {
    id: `wheel_${axle}_${side}`,
    axle,
    side,
    center_m: { x: Number(x.toFixed(4)), y: Number(y.toFixed(4)), z: Number(z.toFixed(4)) },
    tire: {
      size: `${widthMm}/${aspect} R${rimIn}`,
      nominal_section_width_mm: widthMm,
      aspect_ratio: aspect,
      rim_diameter_in: rimIn,
      calculated_outer_diameter_mm: Number(outerDiaMm.toFixed(1)),
      calculated_radius_m: Number(radiusM.toFixed(4)),
      treadPattern: 'performance_tread'
    },
    rim: {
      size: `${(widthMm / 25.4).toFixed(1)}J x ${rimIn}`,
      width_m: Number((widthMm / 1000).toFixed(4)),
      diameter_m: Number(((rimIn * 25.4) / 1000).toFixed(4)),
      style: `OEM ${meta.make} Spoke Design`,
      spokeCount: meta.spokeCount,
      offset_mm: isFront ? 40 : 32
    },
    brakes: {
      discDiameter_m: isFront ? 0.42 : 0.39,
      caliperColor: meta.caliperColorHex,
      pistonCount: isFront ? 6 : 4
    },
    alignment: {
      camberDeg: isFront ? -1.8 : -1.5,
      toeDeg: 0.1
    }
  };
}

function buildVehicleComponents(meta: VehicleRawMeta): VehicleComponentDef[] {
  const halfL = meta.length * 0.5;
  const halfW = meta.width * 0.5;
  const H = meta.height;

  const comps: VehicleComponentDef[] = [
    // 1. Body Panels
    {
      id: 'front_bumper',
      name: 'Front Bumper Fascia',
      group: 'body_panels',
      transform: { position: [0, H * 0.35, halfL - 0.15], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.94, height: H * 0.45, length: 0.35, thickness: 0.03 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'bumper_sculpt',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true,
        ranges: {
          positionY: [-0.1, 0.1],
          positionZ: [-0.1, 0.1],
          width: [meta.width * 0.8, meta.width * 1.1]
        }
      }
    },
    {
      id: 'rear_bumper',
      name: 'Rear Bumper & Lower Fascia',
      group: 'body_panels',
      transform: { position: [0, H * 0.40, -halfL + 0.15], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.96, height: H * 0.48, length: 0.38, thickness: 0.03 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'bumper_sculpt',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'hood',
      name: 'Front Engine/Luggage Hood',
      group: 'body_panels',
      transform: { position: [0, H * 0.62, meta.length * 0.22], rotation: [-0.12, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.82, height: 0.05, length: meta.length * 0.32, thickness: 0.02 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'hood_panel',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'roof',
      name: 'Cabin Roof Panel',
      group: 'body_panels',
      transform: { position: [0, H * 0.96, -meta.length * 0.06], rotation: [0.02, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.68, height: 0.04, length: meta.length * 0.36, thickness: 0.02 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'roof_panel',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'front_left_fender',
      name: 'Front Left Fender Flare',
      group: 'body_panels',
      transform: { position: [-halfW * 0.92, H * 0.52, meta.wheelbase * 0.5], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.18, height: H * 0.48, length: 0.95, thickness: 0.02 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'fender_flare',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'front_right_fender',
      name: 'Front Right Fender Flare',
      group: 'body_panels',
      transform: { position: [halfW * 0.92, H * 0.52, meta.wheelbase * 0.5], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.18, height: H * 0.48, length: 0.95, thickness: 0.02 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'fender_flare',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'rear_left_quarter',
      name: 'Rear Left Quarter Panel & Hip',
      group: 'body_panels',
      transform: { position: [-halfW * 0.96, H * 0.56, -meta.wheelbase * 0.5], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.22, height: H * 0.54, length: 1.15, thickness: 0.02 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'quarter_panel',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'rear_right_quarter',
      name: 'Rear Right Quarter Panel & Hip',
      group: 'body_panels',
      transform: { position: [halfW * 0.96, H * 0.56, -meta.wheelbase * 0.5], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.22, height: H * 0.54, length: 1.15, thickness: 0.02 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'quarter_panel',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'front_left_door',
      name: 'Front Left Door Assembly',
      group: 'body_panels',
      transform: { position: [-halfW * 0.90, H * 0.52, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.16, height: H * 0.62, length: 1.10, thickness: 0.05 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'door_panel',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'front_right_door',
      name: 'Front Right Door Assembly',
      group: 'body_panels',
      transform: { position: [halfW * 0.90, H * 0.52, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.16, height: H * 0.62, length: 1.10, thickness: 0.05 },
      materialRef: 'body_paint',
      editable: true,
      geometryType: 'door_panel',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'side_skirts',
      name: 'Carbon Aerodynamic Side Skirts',
      group: 'body_panels',
      transform: { position: [0, 0.14, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.98, height: 0.08, length: meta.wheelbase * 0.92, thickness: 0.03 },
      materialRef: 'carbon_fiber',
      editable: true,
      geometryType: 'side_skirt_set',
      customizationOptions: {
        allowPosition: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'front_grille',
      name: 'Front Air Intake Grille',
      group: 'body_panels',
      transform: { position: [0, 0.28, halfL - 0.08], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.72, height: 0.28, length: 0.12, thickness: 0.02 },
      materialRef: 'carbon_fiber',
      editable: true,
      geometryType: 'intake_grille',
      customizationOptions: {
        allowScale: true,
        allowMaterial: true,
        allowColor: true
      }
    },

    // 2. Aerodynamics
    {
      id: 'front_splitter',
      name: 'Front Carbon Downforce Splitter',
      group: 'aerodynamics',
      transform: { position: [0, 0.12, halfL + 0.04], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.98, height: 0.04, length: 0.42, thickness: 0.02 },
      materialRef: 'carbon_fiber',
      editable: true,
      geometryType: 'front_splitter',
      customizationOptions: {
        allowPosition: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true,
        ranges: {
          positionZ: [-0.05, 0.12],
          width: [meta.width * 0.8, meta.width * 1.15]
        }
      }
    },
    {
      id: 'rear_diffuser',
      name: 'Rear Underbody Diffuser',
      group: 'aerodynamics',
      transform: { position: [0, 0.16, -halfL + 0.10], rotation: [0.12, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.88, height: 0.18, length: 0.65, thickness: 0.03 },
      materialRef: 'carbon_fiber',
      editable: true,
      geometryType: 'rear_diffuser',
      customizationOptions: {
        allowPosition: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true,
        specificOptions: { finCount: meta.finCount }
      }
    },
    {
      id: 'rear_wing',
      name: meta.aeroType === 'decklid_lip' || meta.aeroType === 'luxury_flush' ? 'Rear Ducktail Decklid Spoiler' : 'Rear Aerodynamic Wing Blade',
      group: 'aerodynamics',
      transform: {
        position: [0, meta.aeroType === 'swan_neck_gt' || meta.aeroType === 'massive_wing' ? H * 0.98 : H * 0.72, -halfL + 0.22],
        rotation: [-0.08, 0, 0],
        scale: [1, 1, 1]
      },
      dimensions: {
        width: meta.width * (meta.aeroType === 'massive_wing' ? 0.96 : 0.85),
        height: meta.aeroType === 'decklid_lip' ? 0.06 : 0.12,
        length: meta.aeroType === 'decklid_lip' ? 0.14 : 0.38,
        thickness: 0.025
      },
      materialRef: 'carbon_fiber',
      editable: true,
      geometryType: meta.aeroType === 'decklid_lip' ? 'decklid_lip' : 'airfoil_wing',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true,
        ranges: {
          positionY: [H * 0.65, H * 1.25],
          rotationX: [-0.25, 0.10],
          width: [meta.width * 0.6, meta.width * 1.1]
        }
      }
    },

    // 3. Lighting
    {
      id: 'headlights_left',
      name: 'Front Left Projector LED Headlamp',
      group: 'lighting',
      transform: { position: [-meta.frontTrack * 0.44, H * 0.54, halfL - 0.22], rotation: [0, 0.12, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.28, height: 0.14, length: 0.35, thickness: 0.05 },
      materialRef: 'emissive_headlight',
      editable: true,
      geometryType: 'headlight_assembly',
      customizationOptions: {
        allowColor: true,
        allowMaterial: true
      }
    },
    {
      id: 'headlights_right',
      name: 'Front Right Projector LED Headlamp',
      group: 'lighting',
      transform: { position: [meta.frontTrack * 0.44, H * 0.54, halfL - 0.22], rotation: [0, -0.12, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.28, height: 0.14, length: 0.35, thickness: 0.05 },
      materialRef: 'emissive_headlight',
      editable: true,
      geometryType: 'headlight_assembly',
      customizationOptions: {
        allowColor: true,
        allowMaterial: true
      }
    },
    {
      id: 'taillights_bar',
      name: 'Rear Full-Width Signature LED Light Bar',
      group: 'lighting',
      transform: { position: [0, H * 0.64, -halfL + 0.05], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.rearTrack * 0.94, height: 0.06, length: 0.08, thickness: 0.02 },
      materialRef: 'emissive_taillight',
      editable: true,
      geometryType: 'taillight_bar',
      customizationOptions: {
        allowColor: true,
        allowMaterial: true
      }
    },

    // 4. Windows and Glass
    {
      id: 'windshield',
      name: 'Acoustic Tinted Curved Windshield',
      group: 'windows',
      transform: { position: [0, H * 0.82, meta.length * 0.14], rotation: [-0.58, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.76, height: 0.65, length: 0.92, thickness: 0.012 },
      materialRef: 'glass',
      editable: true,
      geometryType: 'windshield_glass',
      customizationOptions: {
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'rear_glass',
      name: 'Rear Window / Engine Cover Glass',
      group: 'windows',
      transform: { position: [0, H * 0.80, -meta.length * 0.22], rotation: [0.52, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.72, height: 0.55, length: 0.85, thickness: 0.012 },
      materialRef: 'glass',
      editable: true,
      geometryType: 'rear_glass',
      customizationOptions: {
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'side_windows_left',
      name: 'Side Windows Left',
      group: 'windows',
      transform: { position: [-halfW * 0.78, H * 0.82, -meta.length * 0.02], rotation: [0, 0, 0.14], scale: [1, 1, 1] },
      dimensions: { width: 0.015, height: 0.38, length: 1.15, thickness: 0.008 },
      materialRef: 'glass',
      editable: true,
      geometryType: 'side_glass',
      customizationOptions: {
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'side_windows_right',
      name: 'Side Windows Right',
      group: 'windows',
      transform: { position: [halfW * 0.78, H * 0.82, -meta.length * 0.02], rotation: [0, 0, -0.14], scale: [1, 1, 1] },
      dimensions: { width: 0.015, height: 0.38, length: 1.15, thickness: 0.008 },
      materialRef: 'glass',
      editable: true,
      geometryType: 'side_glass',
      customizationOptions: {
        allowMaterial: true,
        allowColor: true
      }
    },

    // 5. Wheels & Suspension
    {
      id: 'wheel_front_left',
      name: 'Front Left Performance Wheel Assembly',
      group: 'wheels',
      transform: { position: [-meta.frontTrack * 0.5, 0.34, meta.wheelbase * 0.5], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.tireWidthFrontMm / 1000, height: 0.68, length: 0.68 },
      materialRef: 'wheel_alloy',
      editable: true,
      geometryType: 'wheel_assembly',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true,
        specificOptions: {
          rimDiameterIn: meta.rimDiameterFrontIn,
          tireWidthMm: meta.tireWidthFrontMm,
          spokeCount: meta.spokeCount,
          camberDeg: -1.8
        }
      }
    },
    {
      id: 'wheel_front_right',
      name: 'Front Right Performance Wheel Assembly',
      group: 'wheels',
      transform: { position: [meta.frontTrack * 0.5, 0.34, meta.wheelbase * 0.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.tireWidthFrontMm / 1000, height: 0.68, length: 0.68 },
      materialRef: 'wheel_alloy',
      editable: true,
      geometryType: 'wheel_assembly',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true,
        specificOptions: {
          rimDiameterIn: meta.rimDiameterFrontIn,
          tireWidthMm: meta.tireWidthFrontMm,
          spokeCount: meta.spokeCount,
          camberDeg: -1.8
        }
      }
    },
    {
      id: 'wheel_rear_left',
      name: 'Rear Left Performance Wheel Assembly',
      group: 'wheels',
      transform: { position: [-meta.rearTrack * 0.5, 0.36, -meta.wheelbase * 0.5], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.tireWidthRearMm / 1000, height: 0.72, length: 0.72 },
      materialRef: 'wheel_alloy',
      editable: true,
      geometryType: 'wheel_assembly',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true,
        specificOptions: {
          rimDiameterIn: meta.rimDiameterRearIn,
          tireWidthMm: meta.tireWidthRearMm,
          spokeCount: meta.spokeCount,
          camberDeg: -1.5
        }
      }
    },
    {
      id: 'wheel_rear_right',
      name: 'Rear Right Performance Wheel Assembly',
      group: 'wheels',
      transform: { position: [meta.rearTrack * 0.5, 0.36, -meta.wheelbase * 0.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.tireWidthRearMm / 1000, height: 0.72, length: 0.72 },
      materialRef: 'wheel_alloy',
      editable: true,
      geometryType: 'wheel_assembly',
      customizationOptions: {
        allowPosition: true,
        allowRotation: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true,
        specificOptions: {
          rimDiameterIn: meta.rimDiameterRearIn,
          tireWidthMm: meta.tireWidthRearMm,
          spokeCount: meta.spokeCount,
          camberDeg: -1.5
        }
      }
    },

    // 6. Exhaust
    {
      id: 'exhaust_tips',
      name: 'Sport Exhaust Quad Outlets',
      group: 'exhaust',
      transform: { position: [0, 0.24, -halfL + 0.02], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.52, height: 0.10, length: 0.18, thickness: 0.015 },
      materialRef: 'chrome',
      editable: true,
      geometryType: 'exhaust_pipes',
      customizationOptions: {
        allowPosition: true,
        allowScale: true,
        allowDimensions: true,
        allowMaterial: true,
        allowColor: true
      }
    },

    // 7. Interior
    {
      id: 'interior_dashboard',
      name: 'Digital Cockpit & Dashboard Assembly',
      group: 'interior',
      transform: { position: [0, H * 0.64, meta.length * 0.10], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.74, height: 0.38, length: 0.55 },
      materialRef: 'interior_leather',
      editable: true,
      geometryType: 'interior_dash',
      customizationOptions: {
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'interior_steering_wheel',
      name: 'Sport Alcantara Multifunction Steering Wheel',
      group: 'interior',
      transform: { position: [-0.38, H * 0.70, meta.length * 0.04], rotation: [-0.35, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: 0.36, height: 0.36, length: 0.08 },
      materialRef: 'carbon_fiber',
      editable: true,
      geometryType: 'steering_wheel',
      customizationOptions: {
        allowMaterial: true,
        allowColor: true
      }
    },
    {
      id: 'interior_seats',
      name: 'Carbon-backed Racing Bucket Seats (Pair)',
      group: 'interior',
      transform: { position: [0, H * 0.48, -meta.length * 0.06], rotation: [0, 0, 0], scale: [1, 1, 1] },
      dimensions: { width: meta.width * 0.68, height: 0.75, length: 0.65 },
      materialRef: 'interior_leather',
      editable: true,
      geometryType: 'bucket_seats',
      customizationOptions: {
        allowMaterial: true,
        allowColor: true
      }
    }
  ];

  return comps;
}

function buildMaterials(meta: VehicleRawMeta): MaterialDef[] {
  return [
    {
      id: 'body_paint',
      name: 'Primary Exterior Finish',
      type: 'paint_metallic',
      color: meta.primaryColorHex,
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08
    },
    {
      id: 'secondary_paint',
      name: 'Secondary Accent Finish',
      type: 'paint_gloss',
      color: meta.secondaryColorHex,
      metalness: 0.50,
      roughness: 0.25,
      clearcoat: 0.95,
      clearcoatRoughness: 0.10
    },
    {
      id: 'carbon_fiber',
      name: 'Autoclave Pre-preg Carbon Fiber',
      type: 'carbon_fiber',
      color: '#18181b',
      metalness: 0.35,
      roughness: 0.42
    },
    {
      id: 'forged_carbon',
      name: 'Chapped Forged Carbon Composite',
      type: 'forged_carbon',
      color: '#27272a',
      metalness: 0.25,
      roughness: 0.48
    },
    {
      id: 'glass',
      name: 'Acoustic Tinted High-Index Glass',
      type: 'glass',
      color: '#0f172a',
      metalness: 0.05,
      roughness: 0.05,
      transmission: 0.75,
      transparent: true
    },
    {
      id: 'wheel_alloy',
      name: 'Forged Monoblock Wheel Alloy',
      type: 'alloy',
      color: meta.wheelFinishHex,
      metalness: 0.88,
      roughness: 0.22
    },
    {
      id: 'brake_caliper',
      name: 'Brembo Racing Caliper Enamel',
      type: 'paint_gloss',
      color: meta.caliperColorHex,
      metalness: 0.45,
      roughness: 0.15
    },
    {
      id: 'chrome',
      name: 'Polished Mirror Chrome / Titanium',
      type: 'chrome',
      color: '#f8fafc',
      metalness: 0.98,
      roughness: 0.04
    },
    {
      id: 'rubber',
      name: 'Performance Tread Compound',
      type: 'rubber',
      color: '#18181b',
      metalness: 0.05,
      roughness: 0.85
    },
    {
      id: 'emissive_headlight',
      name: 'Ultra-Bright 6000K LED Projector',
      type: 'emissive_led',
      color: '#f8fafc',
      metalness: 0.10,
      roughness: 0.10,
      emissive: '#f8fafc',
      emissiveIntensity: 1.8
    },
    {
      id: 'emissive_taillight',
      name: 'Vibrant Rear Brake & Marker LED',
      type: 'emissive_led',
      color: '#dc2626',
      metalness: 0.10,
      roughness: 0.10,
      emissive: '#dc2626',
      emissiveIntensity: 2.0
    },
    {
      id: 'interior_leather',
      name: 'Hand-Stitched Semi-Aniline Leather',
      type: 'leather',
      color: '#18181b',
      metalness: 0.10,
      roughness: 0.65
    }
  ];
}

function generateVehicle(meta: VehicleRawMeta): VehicleSchema2 {
  const frontOverhang = (meta.length - meta.wheelbase) * 0.48;
  const rearOverhang = (meta.length - meta.wheelbase) * 0.52;

  const crossSections = generateCrossSections(meta);
  const components = buildVehicleComponents(meta);
  const materials = buildMaterials(meta);

  const wheels = {
    frontLeft: buildWheelSpec(meta, 'front', 'left'),
    frontRight: buildWheelSpec(meta, 'front', 'right'),
    rearLeft: buildWheelSpec(meta, 'rear', 'left'),
    rearRight: buildWheelSpec(meta, 'rear', 'right')
  };

  const factoryConfig: Record<string, any> = {};
  for (const c of components) {
    factoryConfig[c.id] = {
      transform: { ...c.transform },
      dimensions: c.dimensions ? { ...c.dimensions } : undefined,
      materialRef: c.materialRef,
      visible: true
    };
  }

  return {
    schemaVersion: '2.0',
    vehicle: {
      id: meta.id,
      manufacturer: meta.make,
      model: meta.model,
      generation: meta.generation,
      year: meta.year,
      category: meta.category,
      geometryClass: 'procedural',
      geometrySource: 'original_autoverse_parametric_design',
      units: 'meters',
      bodyStyle: meta.bodyStyle,
      engineDescription: meta.engine
    },
    dimensions: {
      length: meta.length,
      width: meta.width,
      height: meta.height,
      wheelbase: meta.wheelbase,
      frontTrack: meta.frontTrack,
      rearTrack: meta.rearTrack,
      frontOverhang: Number(frontOverhang.toFixed(3)),
      rearOverhang: Number(rearOverhang.toFixed(3)),
      groundClearance: 0.11
    },
    bodyGeometry: {
      crossSections,
      panels: [
        'front_bumper',
        'rear_bumper',
        'hood',
        'roof',
        'front_left_fender',
        'front_right_fender',
        'rear_left_quarter',
        'rear_right_quarter',
        'front_left_door',
        'front_right_door',
        'side_skirts'
      ]
    },
    components,
    wheels,
    materials,
    customization: {
      editableComponents: components.map(c => c.id),
      supportedTransforms: ['position', 'rotation', 'scale', 'dimensions', 'material', 'color', 'visibility'],
      factoryConfiguration: factoryConfig,
      presets: [
        {
          name: 'Factory OEM Stock',
          description: 'Factory stock original delivery specification',
          overrides: {}
        },
        {
          name: 'Club Sport Track Spec',
          description: 'Aggressive track setup with lowered stance, increased wing angle and carbon splitter',
          overrides: {
            rear_wing: {
              position: [0, (components.find(c => c.id === 'rear_wing')?.transform.position[1] ?? 1.1) + 0.08, -meta.length * 0.46],
              rotation: [-0.18, 0, 0]
            },
            front_splitter: {
              dimensions: { length: 0.52, width: meta.width * 1.05 }
            }
          }
        },
        {
          name: 'Stealth Carbon Edition',
          description: 'Satin carbon body panels with gloss forged composite accents',
          overrides: {
            hood: { materialRef: 'carbon_fiber' },
            roof: { materialRef: 'carbon_fiber' },
            rear_wing: { materialRef: 'forged_carbon' }
          }
        }
      ]
    },
    renderSettings: {
      ambientOcclusion: true,
      shadowCast: true,
      defaultPaintColor: meta.primaryColorHex
    },
    validation: {
      oemGeometryVerified: false,
      accuracyClass: 'D_APPROXIMATE',
      accuracyNotice: 'This file defines a dimension-anchored procedural parametric model. Local surface control points are visual modeling estimates and must not be represented as factory-exact CAD.',
      watertight: true,
      componentCount: components.length
    }
  };
}

async function run() {
  console.log(`Starting AutoVerse 3D complete library generation for ${VEHICLES_ROSTER.length} vehicles...`);

  const indexAssets: any[] = [];

  for (let i = 0; i < VEHICLES_ROSTER.length; i++) {
    const meta = VEHICLES_ROSTER[i];
    const vehicleData = generateVehicle(meta);

    const fileName = `${meta.id}.json`;
    const relPath = `${meta.category}/${fileName}`;

    // Write to vehicles/<category>/<fileName>
    const rootPath = path.resolve('vehicles', relPath);
    fs.mkdirSync(path.dirname(rootPath), { recursive: true });
    fs.writeFileSync(rootPath, JSON.stringify(vehicleData, null, 2), 'utf-8');

    // Write to public/vehicles/<category>/<fileName>
    const pubPath = path.resolve('public/vehicles', relPath);
    fs.mkdirSync(path.dirname(pubPath), { recursive: true });
    fs.writeFileSync(pubPath, JSON.stringify(vehicleData, null, 2), 'utf-8');

    indexAssets.push({
      asset_id: meta.id,
      file: relPath,
      category: meta.category,
      manufacturer: meta.make,
      model: meta.model,
      generation: meta.generation,
      year: meta.year,
      body_style: meta.bodyStyle,
      accuracy_class: 'D_APPROXIMATE',
      geometry_source: 'original_autoverse_parametric_design',
      dimensions: vehicleData.dimensions,
      componentCount: vehicleData.components.length
    });

    console.log(`[${i + 1}/50] Generated ${meta.make} ${meta.model} -> ${relPath} (${vehicleData.components.length} components)`);
  }

  const libraryIndex = {
    library_name: 'AutoVerse 3D — Complete 50 Vehicle Library (Schema 2.0)',
    schema_version: '2.0.0',
    asset_count: indexAssets.length,
    categories: [
      'supercars',
      'hypercars',
      'sports_cars',
      'luxury_cars',
      'track_cars',
      'jdm_cars',
      'muscle_cars',
      'concept_cars',
      'special_edition'
    ],
    important_accuracy_notice: 'All models are dimension-anchored procedural parametric representations for visualization and customization. OEM trademarks and names remain property of their respective holders.',
    coordinate_convention: 'Three.js right-handed: +X right, +Y up, +Z front',
    assets: indexAssets
  };

  fs.writeFileSync(path.resolve('vehicles/index.json'), JSON.stringify(libraryIndex, null, 2), 'utf-8');
  fs.writeFileSync(path.resolve('public/vehicles/index.json'), JSON.stringify(libraryIndex, null, 2), 'utf-8');

  console.log(`\nSuccessfully created all ${indexAssets.length} vehicle models and index.json!`);
}

run();

