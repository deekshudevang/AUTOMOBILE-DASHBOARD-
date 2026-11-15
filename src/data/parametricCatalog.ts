import { VehicleFileSummary, VehicleModelMetadata, VehicleAssetBinding } from '../types/vehicle';
import libraryIndex from '../../public/vehicles/index.json';
import { joaat } from '@autoverse/gta-compat';

export const parametricFiles: VehicleFileSummary[] = [];
export const parametricModels: VehicleModelMetadata[] = [];
export const parametricBindings: Record<number, VehicleAssetBinding> = {};

function mapCategory(cat: string): 'Supercar' | 'Sports Car' | 'Tuner / Compact' | 'Muscle' | 'SUV / Offroad' | 'Special / Concept' {
  switch (cat) {
    case 'supercars':
    case 'hypercars':
    case 'track_cars':
      return 'Supercar';
    case 'sports_cars':
      return 'Sports Car';
    case 'jdm_cars':
      return 'Tuner / Compact';
    case 'muscle_cars':
      return 'Muscle';
    default:
      return 'Special / Concept';
  }
}

for (const asset of libraryIndex.assets) {
  const hash = joaat(asset.asset_id);
  const displayName = `${asset.manufacturer} ${asset.model}`;
  const realWorldModel = `${asset.manufacturer} ${asset.model} (${asset.year || 2024})`;
  const category = mapCategory(asset.category);
  const plateText = (asset.model.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'AUTO').toUpperCase();

  const fileSummary: VehicleFileSummary = {
    fileName: asset.file,
    modelHash: hash,
    modelCode: asset.asset_id,
    displayName,
    realWorldModel,
    manufacturer: asset.manufacturer,
    category,
    plateText,
    plateTextIndex: 0,
    primaryColor: 0,
    secondaryColor: 0,
    isPrimaryColorCustom: true,
    customPrimaryColor: { r: 145, g: 152, b: 160 },
    isSecondaryColorCustom: true,
    customSecondaryColor: { r: 25, g: 27, b: 30 },
    pearlescentColor: 0,
    wheelType: 0,
    wheelColor: 0,
    windowTint: 3,
    bulletproofTyres: true,
    driftTyres: false,
    neonKits: { left: false, right: false, front: false, back: false, color: { r: 0, g: 0, b: 0 } },
    tyreSmokeColor: { r: 255, g: 255, b: 255 },
    interiorColor: 0,
    dashBoardColor: 0,
    hasExtras: false,
    extrasCount: 0,
    modsCount: 0,
    activeModsCount: 0,
    hasAttachments: false,
    attachmentsCount: 0
  };

  const modelMeta: VehicleModelMetadata = {
    hash,
    codeName: asset.asset_id,
    displayName,
    manufacturer: asset.manufacturer,
    realWorldModel,
    category,
    configurations: [fileSummary]
  };

  parametricFiles.push(fileSummary);
  parametricModels.push(modelMeta);

  parametricBindings[hash] = {
    modelHash: hash,
    assetPath: asset.file,
    assetFormat: 'json',
    assetName: displayName,
    isCustomUpload: false,
    qualityClass: 'CLASS_D_APPROXIMATE'
  };
}
