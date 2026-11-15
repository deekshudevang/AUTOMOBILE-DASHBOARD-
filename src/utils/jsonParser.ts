import { CheraxVehicleConfig } from '../types/vehicle';
import { joaat } from '@autoverse/gta-compat';

export interface ParseResult {
  success: boolean;
  format: 'Cherax Entity' | 'Generic Vehicle' | 'Parametric Vehicle' | 'Unknown';
  config?: CheraxVehicleConfig;
  error?: string;
  warnings: string[];
}

export function parseVehicleJson(jsonString: string): ParseResult {
  const warnings: string[] = [];
  try {
    const raw = JSON.parse(jsonString);

    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
      return {
        success: false,
        format: 'Unknown',
        error: 'JSON must be a valid root object',
        warnings
      };
    }

    // Detect format
    let format: 'Cherax Entity' | 'Generic Vehicle' | 'Parametric Vehicle' | 'Unknown' = 'Unknown';
    if (raw.schemaVersion === '2.0' || raw.asset_type === 'parametric_vehicle_geometry' || (raw.$schema && String(raw.$schema).includes('vehicle-parametric'))) {
      format = 'Parametric Vehicle';
      const modelHash = raw.model !== undefined
        ? Number(raw.model) >>> 0
        : joaat(raw.vehicle?.id || raw.asset_id || 'porsche_911_gt3_rs');
      
      // Parse color from renderSettings, materials, or default_paint
      let customRgb = { r: 139, g: 146, b: 154 }; // Default
      const paintColorHex = raw.renderSettings?.defaultPaintColor || raw.materials?.find?.((m: any) => m.id === 'body_paint')?.color || raw.materials?.default_paint?.color;
      if (paintColorHex && typeof paintColorHex === 'string' && paintColorHex.startsWith('#')) {
        const hex = paintColorHex.replace('#', '');
        if (hex.length === 6) {
          customRgb = {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
          };
        }
      }

      const config: CheraxVehicleConfig = {
        format: 'Cherax Entity',
        type: 1,
        model: modelHash,
        baseFlags: 1073808655,
        mods: {},
        extras: {},
        wheelType: 0,
        tyreSmokeColor: { r: 255, g: 255, b: 255 },
        neonKits: { left: false, right: false, front: false, back: false, color: { r: 0, g: 0, b: 0 } },
        primaryColor: 0,
        secondaryColor: 0,
        pearlescentColor: 0,
        isPrimaryColorCustom: true,
        customPrimaryColor: customRgb,
        isSecondaryColorCustom: true,
        customSecondaryColor: { r: 23, g: 25, b: 28 }, // Carbon Fiber
        windowTint: 3,
        wheelColor: 0,
        interiorColor: 0,
        dashBoardColor: 0,
        plateText: ((raw.vehicle?.trim || raw.vehicle?.model || 'SUPERCAR').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'AUTO').toUpperCase(),
        plateTextIndex: 0,
        bulletproofTyres: true,
        driftTyres: false,
        parametricSpec: raw
      };

      return {
        success: true,
        format,
        config,
        warnings
      };
    } else if (raw.format === 'Cherax Entity') {
      format = 'Cherax Entity';
    } else if (raw.model !== undefined || raw.mods !== undefined || raw.primaryColor !== undefined) {
      format = 'Generic Vehicle';
      warnings.push('Unrecognized format header; adapted as generic vehicle specification.');
    } else {
      return {
        success: false,
        format: 'Unknown',
        error: 'Invalid vehicle schema: missing "model" or "format" declaration.',
        warnings
      };
    }

    // Validate required fields
    if (raw.model === undefined) {
      return {
        success: false,
        format,
        error: 'Missing required "model" property in vehicle configuration.',
        warnings
      };
    }

    // Normalization with safe fallbacks while preserving original raw properties
    const config: CheraxVehicleConfig = {
      ...raw,
      format: raw.format || 'Cherax Entity',
      type: raw.type ?? 1,
      model: Number(raw.model) >>> 0,
      baseFlags: raw.baseFlags ?? 1073808655,
      mods: raw.mods || {},
      wheelType: raw.wheelType ?? 0,
      tyreSmokeColor: raw.tyreSmokeColor || { r: 255, g: 255, b: 255 },
      neonKits: raw.neonKits || { left: false, right: false, front: false, back: false, color: { r: 0, g: 0, b: 0 } },
      primaryColor: raw.primaryColor ?? 0,
      secondaryColor: raw.secondaryColor ?? 0,
      pearlescentColor: raw.pearlescentColor ?? 0,
      isPrimaryColorCustom: !!raw.isPrimaryColorCustom,
      customPrimaryColor: raw.customPrimaryColor || { r: 0, g: 0, b: 0 },
      isSecondaryColorCustom: !!raw.isSecondaryColorCustom,
      customSecondaryColor: raw.customSecondaryColor || { r: 0, g: 0, b: 0 },
      windowTint: raw.windowTint ?? 0,
      wheelColor: raw.wheelColor ?? 0,
      interiorColor: raw.interiorColor ?? 0,
      dashBoardColor: raw.dashBoardColor ?? 0,
      plateText: raw.plateText ? String(raw.plateText) : 'AUTOVERSE',
      plateTextIndex: raw.plateTextIndex ?? 0
    };

    if (raw.extras !== undefined) {
      config.extras = raw.extras;
    }
    if (raw.bulletproofTyres !== undefined) {
      config.bulletproofTyres = raw.bulletproofTyres;
    }
    if (raw.driftTyres !== undefined) {
      config.driftTyres = raw.driftTyres;
    }
    if (raw.attachments !== undefined) {
      config.attachments = raw.attachments;
    }

    return {
      success: true,
      format,
      config,
      warnings
    };
  } catch (err: any) {
    return {
      success: false,
      format: 'Unknown',
      error: `JSON Syntax Error: ${err.message}`,
      warnings
    };
  }
}

export function serializeVehicleConfig(config: CheraxVehicleConfig, indent: number = 2): string {
  // Serialize with clean formatting preserving all keys
  return JSON.stringify(config, null, indent);
}

export interface DiffEntry {
  path: string;
  leftValue: any;
  rightValue: any;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
}

export function compareConfigs(left: any, right: any, prefix: string = ''): DiffEntry[] {
  const diffs: DiffEntry[] = [];
  const allKeys = new Set([...Object.keys(left || {}), ...Object.keys(right || {})]);

  for (const key of allKeys) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    const lVal = left ? left[key] : undefined;
    const rVal = right ? right[key] : undefined;

    if (lVal === undefined && rVal !== undefined) {
      diffs.push({ path: currentPath, leftValue: undefined, rightValue: rVal, type: 'added' });
    } else if (lVal !== undefined && rVal === undefined) {
      diffs.push({ path: currentPath, leftValue: lVal, rightValue: undefined, type: 'removed' });
    } else if (typeof lVal === 'object' && lVal !== null && typeof rVal === 'object' && rVal !== null) {
      diffs.push(...compareConfigs(lVal, rVal, currentPath));
    } else if (lVal !== rVal) {
      diffs.push({ path: currentPath, leftValue: lVal, rightValue: rVal, type: 'modified' });
    }
  }

  return diffs;
}

