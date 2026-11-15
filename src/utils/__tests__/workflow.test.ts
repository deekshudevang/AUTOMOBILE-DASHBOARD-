import { describe, it, expect } from 'vitest';
import { parseVehicleJson, serializeVehicleConfig, compareConfigs } from '../jsonParser';
import { joaat, toHex32 } from '../joaat';
import { resolveVehicleColor, rgbToHex, hexToRgb } from '../colorUtils';
import vehicleDatabaseRaw from '../../data/vehicleDatabase.json';
import manifestRaw from '../../../public/vehicle-assets/manifest.json';
import { CheraxVehicleConfig } from '../../types/vehicle';

describe('Phase 12 Complete Workflow & Resilience Validation', () => {
  // Test 1: Complete BMW Workflow & Round-Trip
  it('executes full BMW lifecycle: parse -> map -> customize -> export -> reimport -> verify', () => {
    // 1. Raw BMW JSON
    const bmwRaw = {
      format: "Cherax Entity",
      type: 1,
      model: 2709293299, // Sentinel GTS (BMW M3 G80)
      baseFlags: 1073808655,
      mods: {
        mod0: { index: 3, variation: false }, // Spoiler
        mod1: { index: 2, variation: false }, // Splitter
        mod4: { index: 4, variation: false }, // Quad Exhaust
        mod15: { index: 3, variation: false }, // Suspension Drop
        mod22: { index: 1, variation: false }  // Xenon Cyan
      },
      extras: { extra0: true, extra1: false },
      wheelType: 7, // High End
      wheelColor: 156,
      primaryColor: 50, // Metallic Racing Green
      secondaryColor: 0,
      pearlescentColor: 67,
      isPrimaryColorCustom: false,
      customPrimaryColor: { r: 0, g: 0, b: 0 },
      isSecondaryColorCustom: false,
      customSecondaryColor: { r: 0, g: 0, b: 0 },
      windowTint: 2,
      neonKits: {
        left: true,
        right: true,
        front: true,
        back: true,
        color: { r: 0, g: 240, b: 255 }
      },
      tyreSmokeColor: { r: 255, g: 255, b: 255 },
      interiorColor: 111,
      dashBoardColor: 111,
      plateText: "M3POWER ",
      plateTextIndex: 1,
      bulletproofTyres: true,
      driftTyres: true,
      _creatorSignature: "AutoverseEngine"
    };

    // 2. Parse & validate
    const parseResult = parseVehicleJson(JSON.stringify(bmwRaw));
    expect(parseResult.success).toBe(true);
    const parsed = parseResult.config!;
    expect(parsed.model).toBe(2709293299);

    // 3. Match asset in manifest
    const manifestEntry = manifestRaw.vehicles.find(v => v.modelHash === parsed.model);
    expect(manifestEntry).toBeDefined();
    expect(manifestEntry?.displayName).toContain('BMW M3');
    expect(manifestEntry?.assetPath).toBe('/vehicle-assets/cars/bmw/m3_g80.glb');

    // 4. Color verification
    const paint = resolveVehicleColor(parsed.isPrimaryColorCustom, parsed.customPrimaryColor, parsed.primaryColor);
    expect(paint.hex).toBe('#122E2B'); // Metallic Racing Green

    // 5. Apply modifications: change paint to custom Isle of Man Green, change plate text, add mod7
    const edited: CheraxVehicleConfig = {
      ...parsed,
      isPrimaryColorCustom: true,
      customPrimaryColor: { r: 26, g: 77, b: 46 }, // Isle of Man Green
      plateText: "G80COMP",
      mods: {
        ...parsed.mods,
        mod7: { index: 2, variation: false } // Vented Hood
      }
    };

    // 6. Export edited JSON
    const exportedJson = serializeVehicleConfig(edited, 2);
    expect(exportedJson).toContain('"plateText": "G80COMP"');
    expect(exportedJson).toContain('"_creatorSignature": "AutoverseEngine"'); // Preservation check

    // 7. Reimport and check consistency
    const reimported = parseVehicleJson(exportedJson);
    expect(reimported.success).toBe(true);
    expect(reimported.config?.plateText).toBe("G80COMP");
    expect(reimported.config?.isPrimaryColorCustom).toBe(true);
    expect(reimported.config?.customPrimaryColor).toEqual({ r: 26, g: 77, b: 46 });
    expect(reimported.config?.mods.mod7.index).toBe(2);
    expect(reimported.config?._creatorSignature).toBe("AutoverseEngine");
  });

  // Test 2: Invalid JSON handling
  it('gracefully handles malformed JSON without crashing', () => {
    const malformed = '{ "format": "Cherax Entity", "model": 12345, missing_bracket ';
    const res = parseVehicleJson(malformed);
    expect(res.success).toBe(false);
    expect(res.error).toContain('JSON Syntax Error');
  });

  // Test 3: Missing Required Model Property
  it('detects missing model property', () => {
    const missingModel = JSON.stringify({ format: "Cherax Entity", type: 1 });
    const res = parseVehicleJson(missingModel);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Missing required "model"');
  });

  // Test 4: Missing Optional Properties (Resilience)
  it('gracefully provides fallbacks when optional fields are omitted', () => {
    const barebones = JSON.stringify({
      format: "Cherax Entity",
      type: 1,
      model: 4080061290
    });
    const res = parseVehicleJson(barebones);
    expect(res.success).toBe(true);
    expect(res.config?.wheelType).toBe(0);
    expect(res.config?.plateText).toBe('AUTOVERSE');
    expect(res.config?.bulletproofTyres).toBeUndefined(); // Preserved as omitted
  });

  // Test 5: Unknown Model Identifier
  it('handles unknown vehicle identifier gracefully without fabrication', () => {
    const unknownHash = 999999999;
    const config = JSON.stringify({
      format: "Cherax Entity",
      type: 1,
      model: unknownHash,
      primaryColor: 0
    });
    const res = parseVehicleJson(config);
    expect(res.success).toBe(true);

    const asset = manifestRaw.vehicles.find(v => v.modelHash === unknownHash);
    expect(asset).toBeUndefined(); // Confirmed missing, engine renders diagnostic state!
  });

  // Test 6: Database Integrity Check (108 files, 74 unique models)
  it('verifies catalog database integrity across all 108 files', () => {
    expect(vehicleDatabaseRaw.totalFiles).toBe(108);
    expect(vehicleDatabaseRaw.totalModels).toBe(74);
    expect(vehicleDatabaseRaw.files.length).toBe(108);
    expect(vehicleDatabaseRaw.models.length).toBe(74);

    // Verify duplicate pair exists in catalog
    expect(vehicleDatabaseRaw.duplicateSets.length).toBeGreaterThanOrEqual(1);
    const dup = vehicleDatabaseRaw.duplicateSets[0];
    expect(dup.original).toBe('2F2FSUPRA_Retro_Shade.json');
    expect(dup.duplicate).toBe('lulli.json');
  });
});

