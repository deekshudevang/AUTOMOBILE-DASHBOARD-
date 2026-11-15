import {
  VehicleSpecification,
  CheraxVehicleConfig,
  NormalizedPaint,
  RGBColor
} from '@autoverse/shared-types';
import { toUnsigned32, toSigned32, toHex32, GTA_WINDOW_TINTS } from '@autoverse/gta-compat';

const KNOWN_CHERAX_FIELDS = new Set([
  'format', 'type', 'model', 'baseFlags', 'mods', 'extras', 'wheelType',
  'tyreSmokeColor', 'neonKits', 'primaryColor', 'secondaryColor',
  'pearlescentColor', 'isPrimaryColorCustom', 'customPrimaryColor',
  'isSecondaryColorCustom', 'customSecondaryColor', 'windowTint',
  'wheelColor', 'interiorColor', 'dashBoardColor', 'plateText',
  'plateTextIndex', 'bulletproofTyres', 'driftTyres', 'attachments'
]);

export function normalizeCheraxConfig(
  rawJson: CheraxVehicleConfig,
  sourceFilename: string = 'vehicle.json',
  rawBytesRef?: string
): VehicleSpecification {
  const modelHashUnsigned = toUnsigned32(rawJson.model);
  const modelHashSigned = toSigned32(rawJson.model);
  const modelHex = toHex32(modelHashUnsigned);

  // Extract unknown properties into lossless bag
  const losslessUnknownProps: Record<string, any> = {};
  for (const [key, value] of Object.entries(rawJson)) {
    if (!KNOWN_CHERAX_FIELDS.has(key)) {
      losslessUnknownProps[key] = value;
    }
  }

  // Preserve creator signature if present
  if (rawJson._creatorSignature) {
    losslessUnknownProps._creatorSignature = rawJson._creatorSignature;
  }

  // Paint normalization
  const primaryPaint: NormalizedPaint = {
    colorIndex: rawJson.primaryColor ?? 0,
    isCustom: !!rawJson.isPrimaryColorCustom,
    customRgb: rawJson.customPrimaryColor || { r: 0, g: 0, b: 0 },
    finish: 'metallic',
    pearlescentIndex: rawJson.pearlescentColor ?? 0
  };

  const secondaryPaint: NormalizedPaint = {
    colorIndex: rawJson.secondaryColor ?? 0,
    isCustom: !!rawJson.isSecondaryColorCustom,
    customRgb: rawJson.customSecondaryColor || { r: 0, g: 0, b: 0 },
    finish: 'metallic',
    pearlescentIndex: 0
  };

  // Glass tint
  const tintId = rawJson.windowTint ?? 0;
  const tintSpec = GTA_WINDOW_TINTS.find(t => t.id === tintId) || GTA_WINDOW_TINTS[0];

  return {
    id: `veh_${modelHashUnsigned}_${Date.now()}`,
    sourceFilename,
    sourceFormat: 'Cherax Entity',
    rawByteReferencePath: rawBytesRef,
    modelHashUnsigned,
    modelHashSigned,
    modelHex,
    baseFlags: rawJson.baseFlags ?? 1073808655,
    primaryPaint,
    secondaryPaint,
    wheels: {
      type: rawJson.wheelType ?? 0,
      colorIndex: rawJson.wheelColor ?? 0,
      driftTyres: !!rawJson.driftTyres,
      bulletproofTyres: !!rawJson.bulletproofTyres
    },
    lighting: {
      neonKits: rawJson.neonKits || { left: false, right: false, front: false, back: false, color: { r: 0, g: 0, b: 0 } },
      xenonHeadlightMod: rawJson.mods?.mod22?.index ?? 0
    },
    glass: {
      tintIndex: tintId,
      tintName: tintSpec.name,
      opacity: tintSpec.opacity
    },
    interior: {
      interiorColorIndex: rawJson.interiorColor ?? 0,
      dashboardColorIndex: rawJson.dashBoardColor ?? 0
    },
    licensePlate: {
      text: rawJson.plateText ? String(rawJson.plateText).trim() : 'AUTOVERSE',
      styleIndex: rawJson.plateTextIndex ?? 0,
      styleName: `Plate Style #${rawJson.plateTextIndex ?? 0}`
    },
    effects: {
      tyreSmokeRgb: rawJson.tyreSmokeColor || { r: 255, g: 255, b: 255 }
    },
    tuningMods: rawJson.mods || {},
    extras: rawJson.extras || {},
    attachments: rawJson.attachments || [],
    losslessUnknownProps
  };
}

export function denormalizeCheraxConfig(spec: VehicleSpecification): CheraxVehicleConfig {
  const result: CheraxVehicleConfig = {
    format: "Cherax Entity",
    type: 1,
    model: spec.modelHashUnsigned,
    baseFlags: spec.baseFlags,
    mods: spec.tuningMods,
    wheelType: spec.wheels.type,
    tyreSmokeColor: spec.effects.tyreSmokeRgb,
    neonKits: spec.lighting.neonKits,
    primaryColor: spec.primaryPaint.colorIndex,
    secondaryColor: spec.secondaryPaint.colorIndex,
    pearlescentColor: spec.primaryPaint.pearlescentIndex,
    isPrimaryColorCustom: spec.primaryPaint.isCustom,
    customPrimaryColor: spec.primaryPaint.customRgb,
    isSecondaryColorCustom: spec.secondaryPaint.isCustom,
    customSecondaryColor: spec.secondaryPaint.customRgb,
    windowTint: spec.glass.tintIndex,
    wheelColor: spec.wheels.colorIndex,
    interiorColor: spec.interior.interiorColorIndex,
    dashBoardColor: spec.interior.dashboardColorIndex,
    plateText: spec.licensePlate.text.padEnd(8, ' ').slice(0, 8),
    plateTextIndex: spec.licensePlate.styleIndex,
    ...spec.losslessUnknownProps
  };

  if (Object.keys(spec.extras).length > 0) {
    result.extras = spec.extras;
  }
  if (spec.wheels.bulletproofTyres !== undefined) {
    result.bulletproofTyres = spec.wheels.bulletproofTyres;
  }
  if (spec.wheels.driftTyres !== undefined) {
    result.driftTyres = spec.wheels.driftTyres;
  }
  if (spec.attachments && spec.attachments.length > 0) {
    result.attachments = spec.attachments;
  }

  return result;
}

