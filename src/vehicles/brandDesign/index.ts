export * from './types';
export * from './porsche';
export * from './lamborghini';
export * from './ferrari';
export * from './mclaren';
export * from './nissan';
export * from './bmw';
export * from './mercedes';
export * from './audi';
export * from './toyota';
export * from './ford';
export * from './chevrolet';
export * from './koenigsegg';
export * from './bugatti';
export * from './pagani';
export * from './astonMartin';
export * from './honda';
export * from './mazda';
export * from './dodge';
export * from './subaru';
export * from './mitsubishi';
export * from './lexus';
export * from './maserati';
export * from './bentley';
export * from './rollsRoyce';

import { BrandDesignLanguage } from './types';
import { porscheDesignLanguage } from './porsche';
import { lamborghiniDesignLanguage } from './lamborghini';
import { ferrariDesignLanguage } from './ferrari';
import { mclarenDesignLanguage } from './mclaren';
import { nissanDesignLanguage } from './nissan';
import { bmwDesignLanguage } from './bmw';
import { mercedesDesignLanguage } from './mercedes';
import { audiDesignLanguage } from './audi';
import { toyotaDesignLanguage } from './toyota';
import { fordDesignLanguage } from './ford';
import { chevroletDesignLanguage } from './chevrolet';
import { koenigseggDesignLanguage } from './koenigsegg';
import { bugattiDesignLanguage } from './bugatti';
import { paganiDesignLanguage } from './pagani';
import { astonMartinDesignLanguage } from './astonMartin';
import { hondaDesignLanguage } from './honda';
import { mazdaDesignLanguage } from './mazda';
import { dodgeDesignLanguage } from './dodge';
import { subaruDesignLanguage } from './subaru';
import { mitsubishiDesignLanguage } from './mitsubishi';
import { lexusDesignLanguage } from './lexus';
import { maseratiDesignLanguage } from './maserati';
import { bentleyDesignLanguage } from './bentley';
import { rollsRoyceDesignLanguage } from './rollsRoyce';

const BRAND_CATALOG: Record<string, BrandDesignLanguage> = {
  porsche: porscheDesignLanguage,
  lamborghini: lamborghiniDesignLanguage,
  ferrari: ferrariDesignLanguage,
  mclaren: mclarenDesignLanguage,
  nissan: nissanDesignLanguage,
  bmw: bmwDesignLanguage,
  mercedes: mercedesDesignLanguage,
  'mercedes-amg': mercedesDesignLanguage,
  'mercedes-benz': mercedesDesignLanguage,
  'mercedes-maybach': mercedesDesignLanguage,
  audi: audiDesignLanguage,
  toyota: toyotaDesignLanguage,
  ford: fordDesignLanguage,
  chevrolet: chevroletDesignLanguage,
  koenigsegg: koenigseggDesignLanguage,
  bugatti: bugattiDesignLanguage,
  pagani: paganiDesignLanguage,
  aston_martin: astonMartinDesignLanguage,
  'aston martin': astonMartinDesignLanguage,
  honda: hondaDesignLanguage,
  mazda: mazdaDesignLanguage,
  dodge: dodgeDesignLanguage,
  subaru: subaruDesignLanguage,
  mitsubishi: mitsubishiDesignLanguage,
  lexus: lexusDesignLanguage,
  maserati: maseratiDesignLanguage,
  bentley: bentleyDesignLanguage,
  rolls_royce: rollsRoyceDesignLanguage,
  'rolls-royce': rollsRoyceDesignLanguage,

  // GTA Lore Manufacturer Aliases
  pfister: porscheDesignLanguage,
  pegassi: lamborghiniDesignLanguage,
  grotti: ferrariDesignLanguage,
  progen: mclarenDesignLanguage,
  annis: nissanDesignLanguage,
  obey: audiDesignLanguage,
  ubermacht: bmwDesignLanguage,
  benefactor: mercedesDesignLanguage,
  karin: toyotaDesignLanguage,
  dinka: hondaDesignLanguage,
  dewbauchee: astonMartinDesignLanguage,
  overflod: koenigseggDesignLanguage,
  truffade: bugattiDesignLanguage,
  lampadati: maseratiDesignLanguage,
  bravado: dodgeDesignLanguage,
  declasse: chevroletDesignLanguage,
  invetero: chevroletDesignLanguage,
  vapid: fordDesignLanguage,
  enus: bentleyDesignLanguage,
  ocelot: astonMartinDesignLanguage
};

/**
 * Returns all unique brand design languages
 */
export function getAllBrandDesignLanguages(): BrandDesignLanguage[] {
  return [
    porscheDesignLanguage,
    lamborghiniDesignLanguage,
    ferrariDesignLanguage,
    mclarenDesignLanguage,
    nissanDesignLanguage,
    bmwDesignLanguage,
    mercedesDesignLanguage,
    audiDesignLanguage,
    toyotaDesignLanguage,
    fordDesignLanguage,
    chevroletDesignLanguage,
    koenigseggDesignLanguage,
    bugattiDesignLanguage,
    paganiDesignLanguage,
    astonMartinDesignLanguage,
    hondaDesignLanguage,
    mazdaDesignLanguage,
    dodgeDesignLanguage,
    subaruDesignLanguage,
    mitsubishiDesignLanguage,
    lexusDesignLanguage,
    maseratiDesignLanguage,
    bentleyDesignLanguage,
    rollsRoyceDesignLanguage
  ];
}

/**
 * Resolves the typed BrandDesignLanguage for a given vehicle or brand name,
 * applying model-specific overrides if applicable.
 */
export function getBrandDesignLanguage(brandOrId?: string, modelId?: string): BrandDesignLanguage {
  const query = `${brandOrId || ''} ${modelId || ''}`.toLowerCase();

  let matchedBrand: BrandDesignLanguage = porscheDesignLanguage; // Baseline

  for (const [key, lang] of Object.entries(BRAND_CATALOG)) {
    if (query.includes(key.toLowerCase())) {
      matchedBrand = lang;
      break;
    }
  }

  // Model-specific overrides
  if (modelId && matchedBrand.modelOverrides) {
    const normModelId = modelId.toLowerCase();
    for (const [pattern, patch] of Object.entries(matchedBrand.modelOverrides)) {
      if (normModelId.includes(pattern.toLowerCase())) {
        return {
          ...matchedBrand,
          ...patch,
          proportions: {
            ...matchedBrand.proportions,
            ...(patch.proportions || {})
          },
          silhouetteCurves: {
            ...matchedBrand.silhouetteCurves,
            ...(patch.silhouetteCurves || {})
          },
          materialPalette: {
            ...matchedBrand.materialPalette,
            ...(patch.materialPalette || {})
          }
        };
      }
    }
  }

  return matchedBrand;
}
