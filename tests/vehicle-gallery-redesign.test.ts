import { describe, it, expect } from 'vitest';
import { getManufacturerBrand, MANUFACTURER_BRANDS } from '../src/data/manufacturerBrands';
import { getVehicleTechnicalSpecs, FLEET_TECHNICAL_SPECS } from '../src/data/vehicleTechnicalSpecs';
import libraryIndex from '../public/vehicles/index.json';

describe('Phase 27.2: Vehicle Gallery & OEM Brand Identity', () => {
  describe('Manufacturer Brands Registry', () => {
    it('contains all 26 distinct fleet manufacturers with authentic brand colors', () => {
      const distinctMans = Array.from(new Set(libraryIndex.assets.map(a => a.manufacturer)));
      expect(distinctMans.length).toBeGreaterThanOrEqual(25);

      distinctMans.forEach(man => {
        const brand = getManufacturerBrand(man);
        expect(brand).toBeDefined();
        expect(brand.name).toBe(man);
        expect(brand.brandColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(brand.countryCode.length).toBe(2);
        expect(brand.heritageTagline).toBeTruthy();
      });
    });

    it('returns brand details for key supercar marques', () => {
      const ferrari = getManufacturerBrand('Ferrari');
      expect(ferrari.country).toBe('Italy');
      expect(ferrari.brandColor).toBe('#DC0000');
      expect(ferrari.badgeType).toBe('ferrari');

      const porsche = getManufacturerBrand('Porsche');
      expect(porsche.country).toBe('Germany');
      expect(porsche.brandColor).toBe('#C60000');
      expect(porsche.badgeType).toBe('porsche');

      const mclaren = getManufacturerBrand('McLaren');
      expect(mclaren.country).toBe('United Kingdom');
      expect(mclaren.brandColor).toBe('#FF8000');

      const bugatti = getManufacturerBrand('Bugatti');
      expect(bugatti.country).toBe('France');
      expect(bugatti.brandColor).toBe('#0B5ED7');

      const koenigsegg = getManufacturerBrand('Koenigsegg');
      expect(koenigsegg.country).toBe('Sweden');
    });

    it('handles unknown manufacturers gracefully with default fallback', () => {
      const fallback = getManufacturerBrand('UnknownMotorsport');
      expect(fallback.name).toBe('UnknownMotorsport');
      expect(fallback.country).toBe('Global');
      expect(fallback.brandColor).toBe('#E53935');
    });
  });

  describe('Fleet Technical Performance Specs', () => {
    it('resolves authentic telemetry for flagship hypercars and supercars', () => {
      const aventador = getVehicleTechnicalSpecs('supercars/lamborghini_aventador_svj.json');
      expect(aventador.powerHp).toBe(770);
      expect(aventador.topSpeedKmh).toBe(352);
      expect(aventador.doorMechanism).toBe('Scissor');
      expect(aventador.drivetrain).toBe('AWD');

      const porscheGt3Rs = getVehicleTechnicalSpecs('porsche_911_gt3_rs_2022.json');
      expect(porscheGt3Rs.powerHp).toBe(525);
      expect(porscheGt3Rs.weightKg).toBe(1450);
      expect(porscheGt3Rs.downforceKg).toBe(860);

      const chiron = getVehicleTechnicalSpecs('hypercars/bugatti_chiron_super_sport.json');
      expect(chiron.powerHp).toBe(1600);
      expect(chiron.topSpeedKmh).toBe(440);

      const jesko = getVehicleTechnicalSpecs('hypercars/koenigsegg_jesko_attack.json');
      expect(jesko.powerHp).toBe(1600);
      expect(jesko.doorMechanism).toBe('Synchro-Helix');

      const spectre = getVehicleTechnicalSpecs('luxury_cars/rolls_royce_spectre.json');
      expect(spectre.doorMechanism).toBe('Suicide Coach');
      expect(spectre.dragCoefficient).toBe(0.25);
    });

    it('classifies door mechanisms accurately across distinctive apertures', () => {
      const mclaren = getVehicleTechnicalSpecs('supercars/mclaren_720s.json');
      expect(mclaren.doorMechanism).toBe('Butterfly / Dihedral');

      const huayra = getVehicleTechnicalSpecs('hypercars/pagani_huayra_bc.json');
      expect(huayra.doorMechanism).toBe('Gullwing');
    });
  });

  describe('50 Asset Integrity & Dimensional Coverage', () => {
    it('verifies all 50 libraryIndex assets have dimensional blueprints', () => {
      expect(libraryIndex.assets.length).toBe(50);

      libraryIndex.assets.forEach(asset => {
        expect(asset.asset_id).toBeTruthy();
        expect(asset.file).toBeTruthy();
        expect(asset.category).toBeTruthy();
        expect(asset.dimensions).toBeDefined();
        expect(asset.dimensions.length).toBeGreaterThan(3.5);
        expect(asset.dimensions.width).toBeGreaterThan(1.5);
        expect(asset.dimensions.height).toBeGreaterThan(0.9);
        expect(asset.dimensions.wheelbase).toBeGreaterThan(2.0);
      });
    });
  });
});
