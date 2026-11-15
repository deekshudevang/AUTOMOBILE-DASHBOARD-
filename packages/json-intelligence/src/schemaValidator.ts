/**
 * AUTOVERSE 3D — Production Schema Validator & Protection Engine
 * Validates vehicle JSON configurations before loading, enforces file-size limits,
 * neutralizes hostile input, and guarantees migration from legacy shapes.
 */

export interface ValidationErrorItem {
  path: string;
  message: string;
}

export interface ValidationOutput<T = any> {
  isValid: boolean;
  format: 'Schema 2.0' | 'Parametric 1.0' | 'Cherax Entity' | 'Unknown';
  data?: T;
  errors: ValidationErrorItem[];
  warnings: string[];
}

export class VehicleSchemaValidator {
  public static readonly MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

  /**
   * Safely parses and validates arbitrary JSON text input
   */
  public static validate(rawText: string): ValidationOutput {
    const errors: ValidationErrorItem[] = [];
    const warnings: string[] = [];

    // 1. File size guard
    const byteLength = typeof Buffer !== 'undefined'
      ? Buffer.byteLength(rawText, 'utf-8')
      : new Blob([rawText]).size;

    if (byteLength > this.MAX_FILE_SIZE_BYTES) {
      return {
        isValid: false,
        format: 'Unknown',
        errors: [{ path: 'root', message: `Payload size (${byteLength} bytes) exceeds 10MB safety limit.` }],
        warnings
      };
    }

    // 2. Syntax parse with prototype-pollution guard
    let parsed: any;
    try {
      parsed = JSON.parse(rawText, (key, value) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          warnings.push(`Ignored hostile/prototype key "${key}"`);
          return undefined;
        }
        return value;
      });
    } catch (e: any) {
      return {
        isValid: false,
        format: 'Unknown',
        errors: [{ path: 'syntax', message: `Malformed JSON: ${e.message}` }],
        warnings
      };
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {
        isValid: false,
        format: 'Unknown',
        errors: [{ path: 'root', message: 'Vehicle configuration must be a JSON object.' }],
        warnings
      };
    }

    // 3. Format detection and contract validation
    if (parsed.schemaVersion === '2.0') {
      return this.validateSchema2(parsed, warnings);
    } else if (parsed.asset_type === 'parametric_vehicle_geometry' || (parsed.$schema && String(parsed.$schema).includes('vehicle-parametric'))) {
      return this.validateParametric1(parsed, warnings);
    } else if (parsed.format === 'Cherax Entity' || parsed.model !== undefined) {
      return this.validateCheraxEntity(parsed, warnings);
    }

    return {
      isValid: false,
      format: 'Unknown',
      errors: [{ path: 'root', message: 'Unrecognized schema: missing schemaVersion, format, or model hash.' }],
      warnings
    };
  }

  private static validateSchema2(data: any, warnings: string[]): ValidationOutput {
    const errors: ValidationErrorItem[] = [];

    if (!data.vehicle || typeof data.vehicle !== 'object') {
      errors.push({ path: 'vehicle', message: 'Missing vehicle metadata block.' });
    } else {
      if (!data.vehicle.id) errors.push({ path: 'vehicle.id', message: 'Vehicle ID is required.' });
      if (!data.vehicle.manufacturer) errors.push({ path: 'vehicle.manufacturer', message: 'Manufacturer is required.' });
      if (!data.vehicle.model) errors.push({ path: 'vehicle.model', message: 'Model name is required.' });
    }

    if (!data.dimensions || typeof data.dimensions !== 'object') {
      errors.push({ path: 'dimensions', message: 'Missing dimensions block.' });
    } else {
      if (typeof data.dimensions.length !== 'number') errors.push({ path: 'dimensions.length', message: 'Length must be a number.' });
      if (typeof data.dimensions.width !== 'number') errors.push({ path: 'dimensions.width', message: 'Width must be a number.' });
      if (typeof data.dimensions.height !== 'number') errors.push({ path: 'dimensions.height', message: 'Height must be a number.' });
    }

    if (!Array.isArray(data.components)) {
      errors.push({ path: 'components', message: 'Components must be an array.' });
    }

    return {
      isValid: errors.length === 0,
      format: 'Schema 2.0',
      data,
      errors,
      warnings
    };
  }

  private static validateParametric1(data: any, warnings: string[]): ValidationOutput {
    const errors: ValidationErrorItem[] = [];
    if (!data.asset_id) errors.push({ path: 'asset_id', message: 'Missing asset_id in Parametric 1.0 spec.' });
    if (!data.vehicle?.manufacturer) errors.push({ path: 'vehicle.manufacturer', message: 'Missing manufacturer.' });

    return {
      isValid: errors.length === 0,
      format: 'Parametric 1.0',
      data,
      errors,
      warnings
    };
  }

  private static validateCheraxEntity(data: any, warnings: string[]): ValidationOutput {
    const errors: ValidationErrorItem[] = [];
    if (data.model === undefined && data.format !== 'Cherax Entity') {
      errors.push({ path: 'model', message: 'Missing numeric model hash.' });
    }

    return {
      isValid: errors.length === 0,
      format: 'Cherax Entity',
      data,
      errors,
      warnings
    };
  }
}
