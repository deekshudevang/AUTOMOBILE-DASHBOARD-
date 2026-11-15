import { RGBColor } from '../types/vehicle';
import { getGTAColor } from '../data/gtaColorPalette';

export function rgbToHex(rgb: RGBColor): string {
  const r = Math.max(0, Math.min(255, Math.round(rgb.r))).toString(16).padStart(2, '0');
  const g = Math.max(0, Math.min(255, Math.round(rgb.g))).toString(16).padStart(2, '0');
  const b = Math.max(0, Math.min(255, Math.round(rgb.b))).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

export function hexToRgb(hex: string): RGBColor {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return { r: 255, g: 255, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function resolveVehicleColor(
  isCustom: boolean,
  customRgb: RGBColor,
  paletteId: number
): { hex: string; rgb: RGBColor; name: string; roughness: number; metalness: number; clearcoat: number } {
  if (isCustom && customRgb) {
    const hex = rgbToHex(customRgb);
    return {
      hex,
      rgb: customRgb,
      name: `Custom RGB (${customRgb.r}, ${customRgb.g}, ${customRgb.b})`,
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 0.95
    };
  }
  const palette = getGTAColor(paletteId);
  return {
    hex: palette.hex,
    rgb: hexToRgb(palette.hex),
    name: palette.name,
    roughness: palette.roughness,
    metalness: palette.metalness,
    clearcoat: palette.clearcoat
  };
}

export function getContrastTextColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  // YIQ formula
  const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}

