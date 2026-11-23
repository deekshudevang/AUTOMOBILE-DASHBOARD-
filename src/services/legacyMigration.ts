/**
 * AutoVerse Platform — Legacy LocalStorage Migration Service
 * Safely discovers, backs up, validates, and migrates legacy browser builds to backend PostgreSQL/SQLite.
 */

import { apiClient, CreateBuildPayload } from './apiClient';
import { CustomBuild } from '../hooks/useVehicleStore';

export interface MigrationSummary {
  discoveredCount: number;
  migratedCount: number;
  skippedCount: number;
  failedCount: number;
  errors: { buildId: string; error: string }[];
}

export class LegacyStorageMigrator {
  private static STORAGE_KEY = 'autoverse_custom_builds';

  /**
   * Discover any custom builds stored in browser localStorage.
   */
  public static discoverLocalBuilds(): CustomBuild[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(b => b && b.id && b.name);
      }
      return [];
    } catch (e) {
      console.warn('Failed to parse local builds during discovery:', e);
      return [];
    }
  }

  /**
   * Create a JSON backup string of all local builds.
   */
  public static createBackupJson(): string {
    const builds = this.discoverLocalBuilds();
    const backup = {
      format: 'autoverse_legacy_backup_v1',
      exportedAt: new Date().toISOString(),
      count: builds.length,
      builds
    };
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Download a backup copy of legacy local builds to the user's filesystem.
   */
  public static downloadBackupFile(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const jsonStr = this.createBackupJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `autoverse_local_builds_backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (e) {
      console.error('Failed to download local builds backup:', e);
      return false;
    }
  }

  /**
   * Migrate discovered local builds to the authoritative FastAPI backend database.
   */
  public static async migrateToServer(): Promise<MigrationSummary> {
    const localBuilds = this.discoverLocalBuilds();
    const summary: MigrationSummary = {
      discoveredCount: localBuilds.length,
      migratedCount: 0,
      skippedCount: 0,
      failedCount: 0,
      errors: []
    };

    if (localBuilds.length === 0) return summary;

    // Fetch existing server builds to detect duplicate names/files
    let existingServerBuilds: any[] = [];
    try {
      existingServerBuilds = await apiClient.listBuilds();
    } catch (e) {
      console.warn('Could not fetch existing server builds; proceeding with migration');
    }

    const serverBuildMap = new Set(
      existingServerBuilds.map(b => `${b.vehicle_id}_${b.name.trim().toLowerCase()}`)
    );

    for (const local of localBuilds) {
      const key = `${local.baseVehicleFile?.replace('.json', '')}_${local.name.trim().toLowerCase()}`;

      // Skip if identical vehicle + build name already exists on server
      if (serverBuildMap.has(key)) {
        summary.skippedCount++;
        continue;
      }

      const payload: CreateBuildPayload = {
        name: local.name,
        vehicle_id: local.baseVehicleFile?.replace('.json', '') || 'vehicle_custom',
        base_vehicle_file: local.baseVehicleFile || 'porsche_911_gt3_rs_992_2022.json',
        base_model_hash: local.baseModelHash || 0,
        configuration_json: JSON.stringify(local.componentOverrides || {}),
        primary_color: local.primaryColor,
        secondary_color: local.secondaryColor,
        custom_primary_color: local.customPrimaryColor ? JSON.stringify(local.customPrimaryColor) : undefined,
        custom_secondary_color: local.customSecondaryColor ? JSON.stringify(local.customSecondaryColor) : undefined,
        is_primary_color_custom: local.isPrimaryColorCustom || false,
        wheel_color: local.wheelColor,
        version: '2.0.0'
      };

      try {
        await apiClient.createBuild(payload);
        summary.migratedCount++;
        serverBuildMap.add(key);
      } catch (err: any) {
        summary.failedCount++;
        summary.errors.push({
          buildId: local.id,
          error: err.message || 'Unknown network/server error'
        });
      }
    }

    return summary;
  }

  /**
   * Safe cleanup of localStorage only after verified migration and user consent.
   */
  public static clearLocalBuilds(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
