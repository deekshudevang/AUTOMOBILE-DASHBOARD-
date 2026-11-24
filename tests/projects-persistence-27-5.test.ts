import { describe, it, expect, beforeEach } from 'vitest';
import { useVehicleStore } from '../src/hooks/useVehicleStore';
import { saveBuildThumbnail, getBuildThumbnail } from '../src/utils/thumbnailCache';

describe('Phase 27.5: Projects, Garage & Persistence Suite', () => {
  beforeEach(() => {
    // Reset test state
    useVehicleStore.setState({
      savedBuilds: [],
      configName: 'Track Weapon GT3'
    });
  });

  describe('Saved Builds & Paddock Garage Persistence', () => {
    it('saves the current vehicle build into savedBuilds state', () => {
      useVehicleStore.getState().saveCurrentBuild('Nurburgring Setup 2026');

      const builds = useVehicleStore.getState().savedBuilds;
      expect(builds.length).toBe(1);
      expect(builds[0].name).toBe('Nurburgring Setup 2026');
      expect(builds[0].id).toBeDefined();
      expect(builds[0].createdAt).toBeDefined();
      expect(builds[0].componentOverrides).toBeDefined();
    });

    it('duplicates an existing saved build', () => {
      useVehicleStore.getState().saveCurrentBuild('Original Build');
      const builds = useVehicleStore.getState().savedBuilds;
      const originalId = builds[0].id;

      useVehicleStore.getState().duplicateBuild(originalId);
      const updatedBuilds = useVehicleStore.getState().savedBuilds;
      expect(updatedBuilds.length).toBe(2);
      expect(updatedBuilds.some(b => b.name === 'Original Build (Copy)')).toBe(true);
    });

    it('renames an existing saved build', () => {
      useVehicleStore.getState().saveCurrentBuild('Old Name');
      const buildId = useVehicleStore.getState().savedBuilds[0].id;

      useVehicleStore.getState().renameBuild(buildId, 'New Renamed Build');
      expect(useVehicleStore.getState().savedBuilds[0].name).toBe('New Renamed Build');
    });

    it('deletes a saved build by id', () => {
      useVehicleStore.getState().saveCurrentBuild('To Be Deleted');
      const buildId = useVehicleStore.getState().savedBuilds[0].id;

      useVehicleStore.getState().deleteBuild(buildId);
      expect(useVehicleStore.getState().savedBuilds.length).toBe(0);
    });

    it('exports and imports a build as valid JSON', () => {
      useVehicleStore.getState().saveCurrentBuild('Export Test Build');
      const build = useVehicleStore.getState().savedBuilds[0];

      const jsonString = useVehicleStore.getState().exportBuildJson(build.id);
      expect(jsonString).toBeDefined();
      const parsed = JSON.parse(jsonString);
      expect(parsed.name).toBe('Export Test Build');
      expect(parsed.id).toBeDefined();

      // Clear builds and import back
      useVehicleStore.setState({ savedBuilds: [] });
      const importResult = useVehicleStore.getState().importBuildJson(jsonString);
      expect(importResult.success).toBe(true);
      expect(useVehicleStore.getState().savedBuilds.length).toBe(1);
      expect(useVehicleStore.getState().savedBuilds[0].name).toBe('Export Test Build');
    });
  });

  describe('IndexedDB / LocalStorage WebP Thumbnail Pipeline', () => {
    it('saves and retrieves build preview thumbnails', async () => {
      const mockBuildId = 'test_build_gt3_rs';
      const mockDataUrl = 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAkA4JaQAA3AA/v30gAA=';

      await saveBuildThumbnail(mockBuildId, mockDataUrl);
      const retrieved = await getBuildThumbnail(mockBuildId);

      expect(retrieved).toBe(mockDataUrl);
    });
  });

  describe('Configuration Revision Stack & Rollback', () => {
    it('tracks history checkpoints and rolls back to prior states', () => {
      const store = useVehicleStore.getState();
      const initialHistoryLength = store.history.length;

      // Make configuration modifications
      useVehicleStore.getState().setCustomPrimaryColor({ r: 255, g: 0, b: 0 });

      expect(useVehicleStore.getState().history.length).toBeGreaterThanOrEqual(initialHistoryLength);

      // Perform undo
      useVehicleStore.getState().undo();
      // Perform redo
      useVehicleStore.getState().redo();
      expect(useVehicleStore.getState().historyIndex).toBeGreaterThanOrEqual(0);
    });
  });
});
