import { describe, it, expect } from 'vitest';
import { joaat, toUnsigned32, toSigned32, toHex32, VERIFIED_JOAAT_TEST_VECTORS } from '../packages/gta-compat/src';
import { detectVehicleSchema, normalizeCheraxConfig, denormalizeCheraxConfig, FiveMMetadataParser } from '../packages/json-intelligence/src';

describe('Package GTA-Compat & JSON-Intelligence Tests', () => {
  it('passes all official GTA V Joaat test vectors', () => {
    for (const vector of VERIFIED_JOAAT_TEST_VECTORS) {
      const uHash = joaat(vector.name);
      expect(uHash).toBe(vector.unsigned);
      expect(toSigned32(uHash)).toBe(vector.signed);
      expect(toHex32(uHash)).toBe(vector.hex);
    }
  });

  it('detects Cherax Entity and FiveM XML schemas accurately', () => {
    const cheraxSample = JSON.stringify({ format: "Cherax Entity", type: 1, model: 4080061290 });
    const res1 = detectVehicleSchema(cheraxSample);
    expect(res1.format).toBe('Cherax Entity');
    expect(res1.isXml).toBe(false);

    const fivemSample = `<?xml version="1.0" encoding="UTF-8"?>
    <CVehicleModelInfo__InitDataList>
      <InitDatas>
        <Item>
          <modelName>m3g80</modelName>
          <vehicleMakeName>BMW</vehicleMakeName>
        </Item>
      </InitDatas>
    </CVehicleModelInfo__InitDataList>`;
    const res2 = detectVehicleSchema(fivemSample);
    expect(res2.format).toBe('FiveM XML');
    expect(res2.isXml).toBe(true);

    const parser = new FiveMMetadataParser();
    const records = parser.parseVehiclesMeta(fivemSample);
    expect(records.length).toBe(1);
    expect(records[0].modelName).toBe('m3g80');
    expect(records[0].vehicleMakeName).toBe('BMW');
  });

  it('guarantees lossless unknown property preservation during normalization & denormalization', () => {
    const original = {
      format: "Cherax Entity",
      type: 1,
      model: 2709293299,
      baseFlags: 1073808655,
      mods: { mod0: { index: 2, variation: false } },
      wheelType: 8,
      tyreSmokeColor: { r: 255, g: 0, b: 0 },
      neonKits: { left: true, right: true, front: false, back: false, color: { r: 0, g: 240, b: 255 } },
      primaryColor: 50,
      secondaryColor: 0,
      pearlescentColor: 67,
      isPrimaryColorCustom: false,
      customPrimaryColor: { r: 0, g: 0, b: 0 },
      isSecondaryColorCustom: false,
      customSecondaryColor: { r: 0, g: 0, b: 0 },
      windowTint: 2,
      wheelColor: 156,
      interiorColor: 111,
      dashBoardColor: 111,
      plateText: "M3POWER ",
      plateTextIndex: 1,
      bulletproofTyres: true,
      driftTyres: true,
      _creatorSignature: "GallivanterBallerST",
      myCustomEngineFlag_123: "preserve_me_always"
    };

    const normalized = normalizeCheraxConfig(original as any, 'BMW M3.json');
    expect(normalized.modelHashUnsigned).toBe(2709293299);
    expect(normalized.losslessUnknownProps._creatorSignature).toBe("GallivanterBallerST");
    expect(normalized.losslessUnknownProps.myCustomEngineFlag_123).toBe("preserve_me_always");

    const denormalized = denormalizeCheraxConfig(normalized);
    expect(denormalized.model).toBe(2709293299);
    expect(denormalized._creatorSignature).toBe("GallivanterBallerST");
    expect((denormalized as any).myCustomEngineFlag_123).toBe("preserve_me_always");
  });
});

