import { describe, it, expect } from 'vitest';
import { joaat, toHex32 } from '../joaat';
import { rgbToHex, hexToRgb, resolveVehicleColor } from '../colorUtils';
import { parseVehicleJson, serializeVehicleConfig, compareConfigs } from '../jsonParser';

describe('Core Automotive Utilities', () => {
  it('calculates accurate Jenkins One-At-A-Time hashes', () => {
    expect(joaat('jester3')).toBe(4080061290);
    expect(joaat('cypher')).toBe(1755697647);
    expect(joaat('tenf')).toBe(3400983137);
    expect(joaat('italirsx')).toBe(3145241962);
    expect(joaat('deluxo')).toBe(1483171323);
    expect(toHex32(4080061290)).toBe('0xF330CB6A');
  });

  it('converts RGB and Hex precisely', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#FF0000');
    expect(rgbToHex({ r: 0, g: 240, b: 255 })).toBe('#00F0FF');
    expect(hexToRgb('#00F0FF')).toEqual({ r: 0, g: 240, b: 255 });
    expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('resolves vehicle paint color from custom vs palette index', () => {
    // Custom RGB
    const custom = resolveVehicleColor(true, { r: 255, g: 100, b: 50 }, 0);
    expect(custom.hex).toBe('#FF6432');

    // Palette Metallic Black (0)
    const black = resolveVehicleColor(false, { r: 0, g: 0, b: 0 }, 0);
    expect(black.hex).toBe('#0D1116');

    // Palette Metallic Red (27)
    const red = resolveVehicleColor(false, { r: 0, g: 0, b: 0 }, 27);
    expect(red.hex).toBe('#C00E1A');
  });

  it('parses Cherax Entity JSON and preserves unknown properties', () => {
    const raw = JSON.stringify({
      format: "Cherax Entity",
      type: 1,
      model: 1755697647,
      baseFlags: 1073808655,
      mods: { mod0: { index: 5, variation: false } },
      wheelType: 7,
      primaryColor: 27,
      customUnknownProp: "preserve_me_123"
    });

    const result = parseVehicleJson(raw);
    expect(result.success).toBe(true);
    expect(result.format).toBe('Cherax Entity');
    expect(result.config?.model).toBe(1755697647);
    expect(result.config?.primaryColor).toBe(27);
    expect((result.config as any).customUnknownProp).toBe("preserve_me_123");

    // Serialization round-trip
    const serialized = serializeVehicleConfig(result.config!);
    expect(serialized).toContain('"customUnknownProp": "preserve_me_123"');
  });

  it('detects differences between two vehicle configurations', () => {
    const configA = { model: 100, primaryColor: 1, plateText: "ALPHA" };
    const configB = { model: 100, primaryColor: 28, plateText: "BETA" };

    const diffs = compareConfigs(configA, configB);
    expect(diffs.length).toBe(2);
    expect(diffs.find(d => d.path === 'primaryColor')?.type).toBe('modified');
    expect(diffs.find(d => d.path === 'plateText')?.type).toBe('modified');
  });
});

