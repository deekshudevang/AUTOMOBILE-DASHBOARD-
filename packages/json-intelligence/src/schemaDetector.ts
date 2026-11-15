export type DetectedFormat = 'Cherax Entity' | 'FiveM XML' | 'Generic Vehicle' | 'Parametric Vehicle' | 'Unknown';

export interface SchemaDetectionResult {
  format: DetectedFormat;
  isXml: boolean;
  confidence: number;
  rootIdentifier?: string;
  detectedVersion?: string;
}

export function detectVehicleSchema(content: string): SchemaDetectionResult {
  const trimmed = content.trim();

  // XML Detection
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<CVehicleModelInfo') || trimmed.startsWith('<CHandlingDataMgr') || trimmed.startsWith('<CVehicleModelInfoVariation')) {
    let root = 'FiveM XML';
    if (trimmed.includes('<CVehicleModelInfoArgs')) root = 'vehicles.meta';
    else if (trimmed.includes('<CHandlingDataMgr')) root = 'handling.meta';
    else if (trimmed.includes('<CVehicleModelInfoVariation')) root = 'carvariations.meta';
    else if (trimmed.includes('<CVehicleColor')) root = 'carcols.meta';

    return {
      format: 'FiveM XML',
      isXml: true,
      confidence: 1.0,
      rootIdentifier: root
    };
  }

  // JSON Detection
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { format: 'Unknown', isXml: false, confidence: 0 };
    }

    if (parsed.schemaVersion === '2.0' || parsed.asset_type === 'parametric_vehicle_geometry' || (parsed.$schema && String(parsed.$schema).includes('vehicle-parametric'))) {
      return {
        format: 'Parametric Vehicle',
        isXml: false,
        confidence: 1.0,
        rootIdentifier: parsed.schemaVersion === '2.0' ? 'AutoVerse Schema 2.0 Vehicle Specification' : 'Parametric Vehicle Geometry Specification'
      };
    }

    if (parsed.format === 'Cherax Entity' && parsed.type === 1) {
      return {
        format: 'Cherax Entity',
        isXml: false,
        confidence: 1.0,
        rootIdentifier: 'Cherax Entity (Type 1: Vehicle)'
      };
    }

    if (parsed.format === 'Cherax Entity') {
      return {
        format: 'Cherax Entity',
        isXml: false,
        confidence: 0.9,
        rootIdentifier: `Cherax Entity (Type: ${parsed.type})`
      };
    }

    if (parsed.model !== undefined && (parsed.mods !== undefined || parsed.primaryColor !== undefined)) {
      return {
        format: 'Generic Vehicle',
        isXml: false,
        confidence: 0.8,
        rootIdentifier: 'Generic Automotive JSON'
      };
    }

    return { format: 'Unknown', isXml: false, confidence: 0.1 };
  } catch {
    return { format: 'Unknown', isXml: false, confidence: 0 };
  }
}

export class SchemaDetector {
  detect(content: string | object): SchemaDetectionResult {
    const str = typeof content === 'string' ? content : JSON.stringify(content);
    return detectVehicleSchema(str);
  }
}
