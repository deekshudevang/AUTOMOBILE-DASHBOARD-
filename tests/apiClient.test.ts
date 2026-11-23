import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient, ApiError } from '../src/services/apiClient';
import { LegacyStorageMigrator } from '../src/services/legacyMigration';
import { useVehicleStore, CustomBuild } from '../src/hooks/useVehicleStore';

const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true });
Object.defineProperty(globalThis, 'window', { value: { localStorage: storageMock }, writable: true });

describe('AutoVerse API Client & Frontend Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('correctly configures base URL and sanitizes trailing slashes', () => {
    apiClient.setBaseUrl('http://127.0.0.1:8000/');
    expect(apiClient.getBaseUrl()).toBe('http://127.0.0.1:8000');
  });

  it('handles offline backend gracefully when server is unreachable', async () => {
    // Point to non-existent port
    apiClient.setBaseUrl('http://127.0.0.1:59999');
    const health = await apiClient.checkHealth();
    expect(health.status).toBe('OFFLINE');
    expect(health.database_connected).toBe(false);
  });

  it('discovers and validates legacy local storage builds', () => {
    const mockBuilds: CustomBuild[] = [
      {
        id: 'build_test_1',
        name: 'Porsche Nurburgring Spec',
        baseVehicleFile: 'porsche_911_gt3_rs_992_2022.json',
        baseModelHash: 706080074,
        createdAt: 1700000000000,
        updatedAt: 1700000000000,
        componentOverrides: {
          front_splitter: {
            componentId: 'front_splitter_track',
            scale: [1, 1, 1]
          } as any
        }
      }
    ];

    localStorage.setItem('autoverse_custom_builds', JSON.stringify(mockBuilds));

    const discovered = LegacyStorageMigrator.discoverLocalBuilds();
    expect(discovered).toHaveLength(1);
    expect(discovered[0].name).toBe('Porsche Nurburgring Spec');

    const backupJson = LegacyStorageMigrator.createBackupJson();
    const parsedBackup = JSON.parse(backupJson);
    expect(parsedBackup.format).toBe('autoverse_legacy_backup_v1');
    expect(parsedBackup.count).toBe(1);
  });

  it('integrates backend persistence state into useVehicleStore', () => {
    const state = useVehicleStore.getState();
    expect(state.backendStatus).toBeDefined();
    expect(['ONLINE', 'DEGRADED', 'OFFLINE', 'CONNECTING']).toContain(state.backendStatus);
    expect(state.saveStatus).toBeDefined();
    expect(typeof state.refreshBackendHealth).toBe('function');
    expect(typeof state.syncBuildsWithBackend).toBe('function');
  });

  it('saves custom builds to local storage immediately while dispatching to backend', () => {
    const store = useVehicleStore.getState();
    const buildId = store.saveCurrentBuild('Integration Test Build');

    expect(buildId).toBeDefined();
    const stored = localStorage.getItem('autoverse_custom_builds');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.some((b: any) => b.id === buildId)).toBe(true);
  });

  it('safely handles sync conflict by preserving dirty local changes as a fork', async () => {
    // Mock server returning newer build (version 3) while local is version 1 with dirtyState
    const conflictBuild = {
      id: 'srv_build_conflict_123',
      name: 'Track Weapon GT3',
      base_vehicle_file: 'porsche_911_gt3_rs_992_2022.json',
      base_model_hash: 706080074,
      configuration_json: JSON.stringify({ rideHeight: -40 }),
      config_version: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    vi.spyOn(apiClient, 'listBuilds').mockResolvedValue([conflictBuild as any]);

    // Set local build at version 1 with pending un-synced dirty modifications
    useVehicleStore.setState({
      savedBuilds: [
        {
          id: 'srv_build_conflict_123',
          name: 'Track Weapon GT3',
          baseVehicleFile: 'porsche_911_gt3_rs_992_2022.json',
          baseModelHash: 706080074,
          createdAt: Date.now() - 10000,
          updatedAt: Date.now() - 10000,
          configVersion: 1,
          dirtyState: true,
          componentOverrides: { front_splitter: { scale: [1.1, 1.1, 1.1] } as any }
        }
      ]
    });

    await useVehicleStore.getState().syncBuildsWithBackend();

    const builds = useVehicleStore.getState().savedBuilds;
    // Should contain both: the newer server build AND the local fork
    expect(builds.length).toBe(2);
    expect(builds.some(b => b.id === 'srv_build_conflict_123' && b.configVersion === 3)).toBe(true);
    expect(builds.some(b => b.name.includes('(Local Fork)'))).toBe(true);
  });
});
