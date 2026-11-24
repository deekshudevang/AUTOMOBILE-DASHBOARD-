import { create } from 'zustand';
import { CheraxVehicleConfig, VehicleModelMetadata, VehicleFileSummary, CameraPreset, EnvironmentPreset, RGBColor, VehicleAssetBinding } from '../types/vehicle';
import { ComponentOverride } from '@autoverse/shared-types';
import { VehicleOpeningState, DEFAULT_OPENING_STATE } from '@autoverse/vehicle-generation-engine';
import manifestRaw from '../../public/vehicle-assets/manifest.json';
import porscheGt3RsRaw from '../../public/vehicles/porsche_911_gt3_rs_992_2022.json';
import { parseVehicleJson } from '../utils/jsonParser';
import { parametricFiles, parametricModels, parametricBindings } from '../data/parametricCatalog';
import { apiClient, BackendSavedBuild } from '../services/apiClient';

export type PresentationMode = 'studio' | 'engineering' | 'showroom' | 'comparison';
export type EngineeringMode = 'student' | 'advanced';

export interface CustomBuild {
  id: string;
  name: string;
  baseVehicleFile: string;
  baseModelHash: number;
  createdAt: number;
  updatedAt: number;
  configVersion?: number;
  revisionId?: string;
  dirtyState?: boolean;
  syncError?: string;
  componentOverrides: Record<string, ComponentOverride>;
  primaryColor?: number;
  secondaryColor?: number;
  customPrimaryColor?: RGBColor;
  customSecondaryColor?: RGBColor;
  isPrimaryColorCustom?: boolean;
  wheelColor?: number;
}

export type ActiveView =
  | 'dashboard'
  | 'library'
  | 'projects'
  | 'studio'
  | 'componentLibrary'
  | 'componentEditor'
  | 'assembly'
  | 'cadDesigner'
  | 'geometryEditor'
  | 'materialStudio'
  | 'aeroStudio'
  | 'cfdLab'
  | 'meshGenerator'
  | 'dynamics'
  | 'results'
  | 'reports'
  | 'learning'
  | 'assetManager'
  | 'settings'
  | 'customizer'
  | 'comparison'
  | 'explorer'
  | 'history'
  | 'export';

interface VehicleStoreState {
  // Mode Selection: Student vs. Advanced
  engineeringMode: EngineeringMode;
  setEngineeringMode: (mode: EngineeringMode) => void;
  toggleEngineeringMode: () => void;

  // Database & Catalog
  allFiles: VehicleFileSummary[];
  allModels: VehicleModelMetadata[];
  activeFile: string;
  activeModel: VehicleModelMetadata | null;
  activeConfig: CheraxVehicleConfig;
  originalConfig: CheraxVehicleConfig;
  isDirty: boolean;

  // History & Undo/Redo
  history: CheraxVehicleConfig[];
  historyIndex: number;

  // Navigation & View
  activeView: ActiveView;
  presentationMode: PresentationMode;
  setPresentationMode: (mode: PresentationMode) => void;

  // 3D Scene Controls
  cameraPreset: CameraPreset;
  cameraTrigger: number;
  environmentPreset: EnvironmentPreset;
  isWireframe: boolean;
  useGeometryEngineV2: boolean;
  toggleGeometryEngineV2: () => void;
  showNormals: boolean;
  toggleShowNormals: () => void;
  isAutoRotate: boolean;
  showGrid: boolean;
  showShadows: boolean;
  showEngineSound: boolean;
  graphicsQuality: 'low' | 'medium' | 'high' | 'ultra';
  reducedMotion: boolean;
  toggleReducedMotion: () => void;

  // 3D Measurement Tool (Caliper)
  isMeasuring: boolean;
  setIsMeasuring: (measuring: boolean) => void;
  measurementPoints: { p1: [number, number, number] | null; p2: [number, number, number] | null };
  setMeasurementPoint: (point: [number, number, number]) => void;
  clearMeasurement: () => void;

  // Component Customization State (Schema 2.0)
  configName: string;
  setConfigName: (name: string) => void;
  selectedComponentId: string | null;
  componentOverrides: Record<string, ComponentOverride>;
  overrideHistory: Record<string, ComponentOverride>[];
  overrideHistoryIndex: number;
  selectComponent: (id: string | null) => void;
  updateComponentOverride: (componentId: string, override: Partial<ComponentOverride>, recordHistory?: boolean) => void;
  resetComponentOverride: (componentId: string) => void;
  resetAllComponentOverrides: () => void;
  toggleComponentVisibility: (componentId: string) => void;
  toggleComponentLock: (componentId: string) => void;

  // Vehicle Kinematic Opening State
  openingState: VehicleOpeningState;
  setOpeningState: (updater: Partial<VehicleOpeningState> | ((prev: VehicleOpeningState) => VehicleOpeningState)) => void;
  openAllApertures: () => void;
  closeAllApertures: () => void;

  // Custom Build Slots Persistence
  savedBuilds: CustomBuild[];
  saveCurrentBuild: (name?: string) => string;
  loadBuild: (buildId: string) => Promise<boolean>;
  deleteBuild: (buildId: string) => void;
  duplicateBuild: (buildId: string) => string;
  renameBuild: (buildId: string, newName: string) => void;
  exportBuildJson: (buildId?: string) => string;
  importBuildJson: (jsonString: string) => { success: boolean; buildId?: string; error?: string };

  // Backend & Persistence State (Phase 21)
  backendStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'CONNECTING';
  backendDetails: any;
  saveStatus: 'idle' | 'saving' | 'saved' | 'failed';
  refreshBackendHealth: () => Promise<void>;
  syncBuildsWithBackend: () => Promise<void>;

  // Asset Manager Bindings
  assetBindings: Record<number, VehicleAssetBinding>;

  // Actions
  loadVehicleByFile: (fileName: string) => Promise<boolean>;
  loadVehicleByModelHash: (hash: number) => void;
  importCustomJson: (jsonString: string, fileName?: string) => { success: boolean; error?: string };
  updateConfig: (updater: (prev: CheraxVehicleConfig) => CheraxVehicleConfig, recordHistory?: boolean) => void;
  undo: () => void;
  redo: () => void;
  resetConfig: () => void;

  // Quick Customizer Actions
  setPrimaryColorIndex: (index: number) => void;
  setCustomPrimaryColor: (rgb: RGBColor) => void;
  setSecondaryColorIndex: (index: number) => void;
  setCustomSecondaryColor: (rgb: RGBColor) => void;
  setWheelType: (type: number) => void;
  setWheelColor: (colorIndex: number) => void;
  setWindowTint: (tintIndex: number) => void;
  setNeonToggle: (position: 'left' | 'right' | 'front' | 'back', enabled: boolean) => void;
  setNeonColor: (rgb: RGBColor) => void;
  setModSlot: (slot: string, index: number) => void;
  setExtraToggle: (extraKey: string, enabled: boolean) => void;
  setPlateText: (text: string) => void;
  setPlateStyle: (index: number) => void;
  setBulletproofTyres: (enabled: boolean) => void;
  setDriftTyres: (enabled: boolean) => void;

  // UI & View Setters
  setActiveView: (view: VehicleStoreState['activeView']) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setEnvironmentPreset: (env: EnvironmentPreset) => void;
  toggleWireframe: () => void;
  toggleAutoRotate: () => void;
  toggleGrid: () => void;
  setGraphicsQuality: (quality: 'low' | 'medium' | 'high' | 'ultra') => void;
  registerAssetBinding: (binding: VehicleAssetBinding) => void;

  // Lazy Catalog Loading (Phase 22 Performance)
  isLegacyCatalogLoaded: boolean;
  loadLegacyGtaCatalog: () => Promise<void>;
}

// Prepare initial manifest bindings
const initialBindings: Record<number, VehicleAssetBinding> = {};
manifestRaw.vehicles.forEach((v: any) => {
  initialBindings[v.modelHash] = {
    modelHash: v.modelHash,
    assetPath: v.assetPath,
    assetFormat: v.assetFormat as any,
    assetName: v.displayName,
    materialBindings: v.materialNames
  };
});

// Porsche 911 GT3 RS (992, 2022) Parametric Specification Entry
const porscheGt3RsFile: VehicleFileSummary = {
  fileName: "porsche_911_gt3_rs_992_2022.json",
  modelHash: 706080074,
  modelCode: "comet_gt3rs",
  displayName: "Porsche 911 GT3 RS (992)",
  realWorldModel: "Porsche 911 GT3 RS (992, 2022)",
  manufacturer: "Porsche",
  category: "Supercar",
  plateText: "GT3 RS",
  plateTextIndex: 0,
  primaryColor: 0,
  secondaryColor: 0,
  isPrimaryColorCustom: true,
  customPrimaryColor: { r: 139, g: 146, b: 154 },
  isSecondaryColorCustom: true,
  customSecondaryColor: { r: 23, g: 25, b: 28 },
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

const porscheGt3RsModel: VehicleModelMetadata = {
  hash: 706080074,
  codeName: "comet_gt3rs",
  displayName: "Porsche 911 GT3 RS (992)",
  manufacturer: "Porsche",
  realWorldModel: "Porsche 911 GT3 RS (992, 2022)",
  category: "Supercar",
  configurations: [porscheGt3RsFile]
};

const porscheInitialConfig: CheraxVehicleConfig = {
  format: "Cherax Entity",
  type: 1,
  model: 706080074,
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
  customPrimaryColor: { r: 139, g: 146, b: 154 },
  isSecondaryColorCustom: true,
  customSecondaryColor: { r: 23, g: 25, b: 28 },
  windowTint: 3,
  wheelColor: 0,
  interiorColor: 0,
  dashBoardColor: 0,
  plateText: "GT3 RS",
  plateTextIndex: 0,
  bulletproofTyres: true,
  driftTyres: false,
  parametricSpec: porscheGt3RsRaw
};

initialBindings[706080074] = {
  modelHash: 706080074,
  assetPath: "parametric_generator",
  assetFormat: "json" as any,
  assetName: "Porsche 911 GT3 RS (992)",
  isCustomUpload: false,
  qualityClass: "CLASS_D_APPROXIMATE",
  parametricSpec: porscheGt3RsRaw
};

// Merge all 50 AutoVerse parametric vehicle library bindings
Object.assign(initialBindings, parametricBindings);

// Load default vehicle file
const defaultFile = porscheGt3RsFile;
const defaultModel = porscheGt3RsModel;
const initialFallbackConfig: CheraxVehicleConfig = porscheInitialConfig;

export const useVehicleStore = create<VehicleStoreState>((set, get) => ({
  engineeringMode: 'student',
  setEngineeringMode: (mode: EngineeringMode) => set({ engineeringMode: mode }),
  toggleEngineeringMode: () => set(state => ({ engineeringMode: state.engineeringMode === 'student' ? 'advanced' : 'student' })),

  allFiles: [porscheGt3RsFile, ...parametricFiles.filter(f => f.fileName !== 'porsche_911_gt3_rs_2022.json')],
  allModels: [porscheGt3RsModel, ...parametricModels.filter(m => m.hash !== 706080074)],
  isLegacyCatalogLoaded: false,
  loadLegacyGtaCatalog: async () => {
    if (get().isLegacyCatalogLoaded) return;
    try {
      const db = await import('../data/vehicleDatabase.json');
      const gtaFiles = (db.default?.files || (db as any).files) as VehicleFileSummary[];
      const gtaModels = (db.default?.models || (db as any).models) as VehicleModelMetadata[];
      set(state => ({
        isLegacyCatalogLoaded: true,
        allFiles: [...state.allFiles, ...gtaFiles],
        allModels: [...state.allModels, ...gtaModels]
      }));
    } catch (err) {
      console.warn('Failed to dynamically load legacy GTA vehicle database:', err);
    }
  },
  activeFile: defaultFile.fileName,
  activeModel: defaultModel as any,
  activeConfig: initialFallbackConfig,
  originalConfig: initialFallbackConfig,
  isDirty: false,

  history: [initialFallbackConfig],
  historyIndex: 0,

  activeView: 'studio',
  presentationMode: 'studio',
  setPresentationMode: (mode: PresentationMode) => {
    set(state => {
      // Showroom automatically enables slow turntable rotation and hides sidebars
      const isShowroom = mode === 'showroom';
      return {
        presentationMode: mode,
        isAutoRotate: isShowroom ? true : state.isAutoRotate
      };
    });
  },
  cameraPreset: 'isometric',
  cameraTrigger: Date.now(),
  environmentPreset: 'studio-dark',
  isWireframe: false,
  useGeometryEngineV2: true,
  toggleGeometryEngineV2: () => set(state => ({ useGeometryEngineV2: !state.useGeometryEngineV2 })),
  showNormals: false,
  toggleShowNormals: () => set(state => ({ showNormals: !state.showNormals })),
  isAutoRotate: false,
  showGrid: true,
  showShadows: true,
  showEngineSound: false,
  graphicsQuality: 'high',
  reducedMotion: false,
  toggleReducedMotion: () => set(state => ({ reducedMotion: !state.reducedMotion })),

  // 3D Measurement Tool (Caliper)
  isMeasuring: false,
  setIsMeasuring: (measuring: boolean) => set({ isMeasuring: measuring }),
  measurementPoints: { p1: null, p2: null },
  setMeasurementPoint: (point: [number, number, number]) => {
    set(state => {
      if (!state.measurementPoints.p1) {
        return { measurementPoints: { p1: point, p2: null } };
      }
      if (!state.measurementPoints.p2) {
        return { measurementPoints: { p1: state.measurementPoints.p1, p2: point } };
      }
      return { measurementPoints: { p1: point, p2: null } };
    });
  },
  clearMeasurement: () => set({ measurementPoints: { p1: null, p2: null } }),

  // Component Customization State (Schema 2.0)
  configName: 'Porsche 911 GT3 RS Specification',
  setConfigName: (name: string) => set({ configName: name }),
  selectedComponentId: null,
  componentOverrides: {},
  overrideHistory: [{}],
  overrideHistoryIndex: 0,

  selectComponent: (id: string | null) => {
    set({ selectedComponentId: id });
  },

  updateComponentOverride: (componentId: string, override: Partial<ComponentOverride>, recordHistory = true) => {
    set(state => {
      const existing = state.componentOverrides[componentId] || { componentId };
      const updated: ComponentOverride = {
        ...existing,
        ...override,
        componentId
      };
      const nextOverrides = {
        ...state.componentOverrides,
        [componentId]: updated
      };

      let nextHistory = state.overrideHistory;
      let nextIndex = state.overrideHistoryIndex;

      if (recordHistory) {
        nextHistory = state.overrideHistory.slice(0, state.overrideHistoryIndex + 1);
        nextHistory.push(nextOverrides);
        if (nextHistory.length > 50) nextHistory.shift();
        nextIndex = nextHistory.length - 1;
      }

      return {
        componentOverrides: nextOverrides,
        overrideHistory: nextHistory,
        overrideHistoryIndex: nextIndex,
        isDirty: true
      };
    });
  },

  resetComponentOverride: (componentId: string) => {
    set(state => {
      const rest = { ...state.componentOverrides };
      delete rest[componentId];
      const nextHistory = state.overrideHistory.slice(0, state.overrideHistoryIndex + 1);
      nextHistory.push(rest);
      return {
        componentOverrides: rest,
        overrideHistory: nextHistory,
        overrideHistoryIndex: nextHistory.length - 1,
        isDirty: Object.keys(rest).length > 0
      };
    });
  },

  resetAllComponentOverrides: () => {
    set({
      componentOverrides: {},
      overrideHistory: [{}],
      overrideHistoryIndex: 0,
      selectedComponentId: null,
      isDirty: false
    });
  },

  toggleComponentVisibility: (componentId: string) => {
    set(state => {
      const existing = state.componentOverrides[componentId] || { componentId };
      const currentVisible = existing.visible !== false;
      return {
        componentOverrides: {
          ...state.componentOverrides,
          [componentId]: {
            ...existing,
            visible: !currentVisible
          }
        },
        isDirty: true
      };
    });
  },

  toggleComponentLock: (componentId: string) => {
    set(state => {
      const existing = state.componentOverrides[componentId] || { componentId };
      const currentLocked = !!existing.locked;
      return {
        componentOverrides: {
          ...state.componentOverrides,
          [componentId]: {
            ...existing,
            locked: !currentLocked
          }
        }
      };
    });
  },

  // Vehicle Kinematic Opening State
  openingState: DEFAULT_OPENING_STATE,
  setOpeningState: (updater) => {
    set(state => {
      const next = typeof updater === 'function' ? updater(state.openingState) : { ...state.openingState, ...updater };
      return { openingState: next };
    });
  },
  openAllApertures: () => {
    const state = get();
    const rawSpec = (state.activeConfig?.parametricSpec || state.activeConfig) as any;
    const vehicleId = (rawSpec?.vehicle?.id || state.activeFile || '').toLowerCase();
    const is4Door =
      rawSpec?.kinematics?.opening?.doorCount === 4 ||
      rawSpec?.dimensions?.doors === 4 ||
      vehicleId.includes('evolution') ||
      vehicleId.includes('evo') ||
      vehicleId.includes('wrx') ||
      vehicleId.includes('sti') ||
      vehicleId.includes('s_class') ||
      vehicleId.includes('7_series') ||
      vehicleId.includes('flying_spur') ||
      vehicleId.includes('panamera');

    set({
      openingState: {
        doorFrontLeft: 1.0,
        doorFrontRight: 1.0,
        doorRearLeft: is4Door ? 1.0 : 0.0,
        doorRearRight: is4Door ? 1.0 : 0.0,
        hood: 1.0,
        boot: 1.0
      },
      cameraPreset: 'full_inspection',
      cameraTrigger: Date.now()
    });
  },
  closeAllApertures: () => {
    set({
      openingState: DEFAULT_OPENING_STATE,
      cameraPreset: 'isometric',
      cameraTrigger: Date.now()
    });
  },

  savedBuilds: (() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('autoverse_custom_builds');
        return stored ? JSON.parse(stored) : [];
      }
    } catch (e) {
      console.warn('Failed to parse autoverse_custom_builds from localStorage', e);
    }
    return [];
  })(),

  // Backend & Persistence State (Phase 21)
  backendStatus: 'CONNECTING',
  backendDetails: null,
  saveStatus: 'idle',

  refreshBackendHealth: async () => {
    try {
      const health = await apiClient.checkHealth();
      set({
        backendStatus: health.status,
        backendDetails: health.details
      });
    } catch {
      set({
        backendStatus: 'OFFLINE',
        backendDetails: null
      });
    }
  },

  syncBuildsWithBackend: async () => {
    try {
      const serverBuilds = await apiClient.listBuilds();
      if (!Array.isArray(serverBuilds)) return;

      const localMap = new Map(get().savedBuilds.map(b => [b.id, b]));
      const resolvedList: CustomBuild[] = [];

      // 1. Process server builds with conflict detection
      for (const sb of serverBuilds) {
        let overrides = {};
        try {
          overrides = JSON.parse(sb.configuration_json || '{}');
        } catch {
          overrides = {};
        }

        let customPrimary: RGBColor | undefined;
        let customSecondary: RGBColor | undefined;
        try {
          if (sb.custom_primary_color) customPrimary = JSON.parse(sb.custom_primary_color);
          if (sb.custom_secondary_color) customSecondary = JSON.parse(sb.custom_secondary_color);
        } catch {}

        const serverBuildObj: CustomBuild = {
          id: sb.id,
          name: sb.name,
          baseVehicleFile: sb.base_vehicle_file,
          baseModelHash: sb.base_model_hash,
          createdAt: new Date(sb.created_at).getTime(),
          updatedAt: new Date(sb.updated_at).getTime(),
          configVersion: sb.config_version || 1,
          revisionId: sb.revision_id || undefined,
          dirtyState: false,
          componentOverrides: overrides,
          primaryColor: sb.primary_color ?? undefined,
          secondaryColor: sb.secondary_color ?? undefined,
          customPrimaryColor: customPrimary,
          customSecondaryColor: customSecondary,
          isPrimaryColorCustom: sb.is_primary_color_custom,
          wheelColor: sb.wheel_color ?? undefined
        };

        const localMatch = localMap.get(sb.id);
        if (localMatch) {
          // Both exist: check versions and dirty state
          if (localMatch.dirtyState) {
            // Local has pending changes
            if ((sb.config_version || 1) > (localMatch.configVersion || 1)) {
              // Server was modified concurrently! Detect conflict and preserve local changes as a safe fork
              console.warn(`[Sync Conflict] Build ${sb.name} modified on server. Preserving local edits as fork.`);
              const forkedBuild: CustomBuild = {
                ...localMatch,
                id: `build_fork_${Date.now()}`,
                name: `${localMatch.name} (Local Fork)`,
                dirtyState: true,
                syncError: 'Conflict detected: Server had newer changes. Local edits preserved in this fork.'
              };
              resolvedList.push(serverBuildObj);
              resolvedList.push(forkedBuild);
            } else {
              // Local is ahead or at same version: push local update to server
              try {
                const updated = await apiClient.updateBuild(localMatch.id, {
                  name: localMatch.name,
                  configuration_json: JSON.stringify(localMatch.componentOverrides),
                  primary_color: localMatch.primaryColor,
                  secondary_color: localMatch.secondaryColor,
                  custom_primary_color: localMatch.customPrimaryColor ? JSON.stringify(localMatch.customPrimaryColor) : undefined,
                  custom_secondary_color: localMatch.customSecondaryColor ? JSON.stringify(localMatch.customSecondaryColor) : undefined,
                  is_primary_color_custom: localMatch.isPrimaryColorCustom,
                  wheel_color: localMatch.wheelColor,
                  expected_version: localMatch.configVersion
                });
                resolvedList.push({
                  ...localMatch,
                  configVersion: updated.config_version,
                  updatedAt: new Date(updated.updated_at).getTime(),
                  dirtyState: false,
                  syncError: undefined
                });
              } catch (err: any) {
                // If update rejected or network failed, keep local match with dirty flag
                resolvedList.push(localMatch);
              }
            }
          } else {
            // Local is clean: adopt the authoritative server version
            resolvedList.push(serverBuildObj);
          }
          localMap.delete(sb.id);
        } else {
          // New on server: add to local
          resolvedList.push(serverBuildObj);
        }
      }

      // 2. Add local-only builds (unsynced new builds)
      for (const [id, localBuild] of localMap.entries()) {
        // Attempt to upload unsynced builds to server
        if (localBuild.dirtyState || id.startsWith('build_')) {
          try {
            const created = await apiClient.createBuild({
              name: localBuild.name,
              vehicle_id: localBuild.baseVehicleFile?.replace('.json', '') || 'vehicle',
              base_vehicle_file: localBuild.baseVehicleFile,
              base_model_hash: localBuild.baseModelHash,
              configuration_json: JSON.stringify(localBuild.componentOverrides),
              primary_color: localBuild.primaryColor,
              secondary_color: localBuild.secondaryColor,
              custom_primary_color: localBuild.customPrimaryColor ? JSON.stringify(localBuild.customPrimaryColor) : undefined,
              custom_secondary_color: localBuild.customSecondaryColor ? JSON.stringify(localBuild.customSecondaryColor) : undefined,
              is_primary_color_custom: localBuild.isPrimaryColorCustom,
              wheel_color: localBuild.wheelColor,
              config_version: localBuild.configVersion || 1,
              version: '2.0.0'
            });
            resolvedList.push({
              ...localBuild,
              id: created.id,
              configVersion: created.config_version,
              dirtyState: false,
              syncError: undefined
            });
            continue;
          } catch (e) {
            // Failed: retain locally with dirtyState
          }
        }
        resolvedList.push(localBuild);
      }

      set({ savedBuilds: resolvedList });
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('autoverse_custom_builds', JSON.stringify(resolvedList));
        }
      } catch {}
    } catch (e) {
      console.warn('Could not sync builds with backend:', e);
    }
  },

  saveCurrentBuild: (name?: string) => {
    const state = get();
    const buildId = `build_${Date.now()}`;
    const buildName = name || state.configName || `${state.activeModel?.displayName || 'Vehicle'} Custom Build`;
    const newBuild: CustomBuild = {
      id: buildId,
      name: buildName,
      baseVehicleFile: state.activeFile,
      baseModelHash: state.activeConfig.model,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      configVersion: 1,
      dirtyState: true,
      componentOverrides: { ...state.componentOverrides },
      primaryColor: state.activeConfig.primaryColor,
      secondaryColor: state.activeConfig.secondaryColor,
      customPrimaryColor: state.activeConfig.customPrimaryColor,
      customSecondaryColor: state.activeConfig.customSecondaryColor,
      isPrimaryColorCustom: state.activeConfig.isPrimaryColorCustom,
      wheelColor: state.activeConfig.wheelColor
    };

    const nextBuilds = [newBuild, ...state.savedBuilds.filter(b => b.id !== buildId)];
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('autoverse_custom_builds', JSON.stringify(nextBuilds));
      }
    } catch (e) {
      console.error('Failed to save build to localStorage', e);
    }

    set({ savedBuilds: nextBuilds, configName: buildName, saveStatus: 'saving' });

    // Asynchronously synchronize with authoritative backend database
    apiClient.createBuild({
      name: buildName,
      vehicle_id: state.activeFile?.replace('.json', '') || 'vehicle',
      base_vehicle_file: state.activeFile,
      base_model_hash: state.activeConfig.model,
      configuration_json: JSON.stringify(state.componentOverrides),
      primary_color: state.activeConfig.primaryColor,
      secondary_color: state.activeConfig.secondaryColor,
      custom_primary_color: state.activeConfig.customPrimaryColor ? JSON.stringify(state.activeConfig.customPrimaryColor) : undefined,
      custom_secondary_color: state.activeConfig.customSecondaryColor ? JSON.stringify(state.activeConfig.customSecondaryColor) : undefined,
      is_primary_color_custom: state.activeConfig.isPrimaryColorCustom,
      wheel_color: state.activeConfig.wheelColor,
      config_version: 1,
      version: '2.0.0'
    }).then(serverBuild => {
      set({ saveStatus: 'saved' });
      if (serverBuild?.id && serverBuild.id !== buildId) {
        const synced = get().savedBuilds.map(b => b.id === buildId ? {
          ...b,
          id: serverBuild.id,
          configVersion: serverBuild.config_version,
          dirtyState: false,
          syncError: undefined
        } : b);
        set({ savedBuilds: synced });
      }
    }).catch(err => {
      console.warn('Backend save failed; preserved in local storage with dirty flag:', err);
      set({ saveStatus: 'failed' });
    });

    return buildId;
  },

  loadBuild: async (buildId: string) => {
    const state = get();
    const build = state.savedBuilds.find(b => b.id === buildId);
    if (!build) return false;

    if (state.activeFile !== build.baseVehicleFile) {
      await state.loadVehicleByFile(build.baseVehicleFile);
    }

    set({
      configName: build.name,
      componentOverrides: { ...build.componentOverrides },
      overrideHistory: [{ ...build.componentOverrides }],
      overrideHistoryIndex: 0,
      activeConfig: {
        ...get().activeConfig,
        primaryColor: build.primaryColor ?? get().activeConfig.primaryColor,
        secondaryColor: build.secondaryColor ?? get().activeConfig.secondaryColor,
        customPrimaryColor: build.customPrimaryColor || get().activeConfig.customPrimaryColor,
        customSecondaryColor: build.customSecondaryColor || get().activeConfig.customSecondaryColor,
        isPrimaryColorCustom: build.isPrimaryColorCustom ?? get().activeConfig.isPrimaryColorCustom,
        wheelColor: build.wheelColor ?? get().activeConfig.wheelColor
      },
      cameraTrigger: Date.now()
    });

    return true;
  },

  deleteBuild: (buildId: string) => {
    const next = get().savedBuilds.filter(b => b.id !== buildId);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('autoverse_custom_builds', JSON.stringify(next));
      }
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
    set({ savedBuilds: next });

    // Asynchronously delete on backend
    apiClient.deleteBuild(buildId).catch(err => {
      console.warn('Could not delete build on backend:', err);
    });
  },

  duplicateBuild: (buildId: string) => {
    const orig = get().savedBuilds.find(b => b.id === buildId);
    if (!orig) return '';
    const newId = `build_${Date.now()}`;
    const copy: CustomBuild = {
      ...orig,
      id: newId,
      name: `${orig.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const next = [copy, ...get().savedBuilds];
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('autoverse_custom_builds', JSON.stringify(next));
      }
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
    set({ savedBuilds: next });

    // Asynchronously duplicate on backend
    apiClient.duplicateBuild(buildId).then(serverDup => {
      if (serverDup?.id) {
        const synced = get().savedBuilds.map(b => b.id === newId ? { ...b, id: serverDup.id } : b);
        set({ savedBuilds: synced });
      }
    }).catch(err => {
      console.warn('Could not duplicate build on backend; kept locally:', err);
    });

    return newId;
  },

  renameBuild: (buildId: string, newName: string) => {
    const next = get().savedBuilds.map(b => b.id === buildId ? { ...b, name: newName, updatedAt: Date.now() } : b);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('autoverse_custom_builds', JSON.stringify(next));
      }
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
    set({ savedBuilds: next });
  },

  exportBuildJson: (buildId?: string) => {
    const state = get();
    let buildToExport: CustomBuild | undefined;
    if (buildId) {
      buildToExport = state.savedBuilds.find(b => b.id === buildId);
    }
    if (!buildToExport) {
      buildToExport = {
        id: `build_${Date.now()}`,
        name: state.configName || 'Custom Build',
        baseVehicleFile: state.activeFile,
        baseModelHash: state.activeConfig.model,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        componentOverrides: state.componentOverrides,
        primaryColor: state.activeConfig.primaryColor,
        secondaryColor: state.activeConfig.secondaryColor,
        customPrimaryColor: state.activeConfig.customPrimaryColor,
        customSecondaryColor: state.activeConfig.customSecondaryColor,
        isPrimaryColorCustom: state.activeConfig.isPrimaryColorCustom,
        wheelColor: state.activeConfig.wheelColor
      };
    }
    return JSON.stringify(buildToExport, null, 2);
  },

  importBuildJson: (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString) as CustomBuild;
      if (!parsed.componentOverrides || typeof parsed.componentOverrides !== 'object') {
        return { success: false, error: 'Invalid build file: missing componentOverrides dictionary' };
      }
      const buildId = parsed.id || `build_${Date.now()}`;
      const build: CustomBuild = {
        ...parsed,
        id: buildId,
        name: parsed.name || 'Imported Custom Build',
        updatedAt: Date.now()
      };
      const next = [build, ...get().savedBuilds.filter(b => b.id !== buildId)];
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('autoverse_custom_builds', JSON.stringify(next));
        }
      } catch (e) {
        console.error('Failed to save imported build to localStorage', e);
      }
      set({ savedBuilds: next });
      return { success: true, buildId };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Invalid JSON format' };
    }
  },

  assetBindings: initialBindings,

  loadVehicleByFile: async (fileName: string) => {
    try {
      if (fileName === 'porsche_911_gt3_rs_992_2022.json' || fileName === 'porsche_911_gt3_rs_2022.json') {
        set({
          activeFile: fileName,
          activeModel: porscheGt3RsModel,
          activeConfig: porscheInitialConfig,
          originalConfig: porscheInitialConfig,
          configName: 'Porsche 911 GT3 RS Specification',
          isDirty: false,
          history: [porscheInitialConfig],
          historyIndex: 0,
          selectedComponentId: null,
          componentOverrides: {},
          overrideHistory: [{}],
          overrideHistoryIndex: 0,
          openingState: DEFAULT_OPENING_STATE,
          cameraPreset: 'isometric',
          cameraTrigger: Date.now()
        });
        return true;
      }

      let fileInfo = get().allFiles.find(f =>
        f.fileName === fileName ||
        f.fileName.endsWith(`/${fileName}`) ||
        f.fileName.replace(/\.json$/, '') === fileName.replace(/\.json$/, '') ||
        f.fileName.split('/').pop() === fileName.split('/').pop() ||
        f.fileName.split('/').pop()?.replace(/\.json$/, '') === fileName.replace(/\.json$/, '')
      );

      // If not found in high-priority Schema 2.0 fleet, attempt lazy load of legacy GTA catalog
      if (!fileInfo && !get().isLegacyCatalogLoaded) {
        await get().loadLegacyGtaCatalog();
        fileInfo = get().allFiles.find(f =>
          f.fileName === fileName ||
          f.fileName.endsWith(`/${fileName}`) ||
          f.fileName.replace(/\.json$/, '') === fileName.replace(/\.json$/, '') ||
          f.fileName.split('/').pop() === fileName.split('/').pop() ||
          f.fileName.split('/').pop()?.replace(/\.json$/, '') === fileName.replace(/\.json$/, '')
        );
      }

      if (!fileInfo) return false;

      const modelInfo = get().allModels.find(m => m.hash === fileInfo.modelHash) || null;
      const binding = get().assetBindings[fileInfo.modelHash];

      let loadedConfig: CheraxVehicleConfig | null = null;

      // Try fetching from public/vehicles/ if window/fetch is available
      try {
        const filePath = fileInfo.fileName.split('/').map(segment => encodeURIComponent(segment)).join('/');
        const res = await fetch(`/vehicles/${filePath}`);
        if (res && res.ok) {
          const text = await res.text();
          const parsed = parseVehicleJson(text);
          if (parsed.success && parsed.config) {
            loadedConfig = parsed.config;
          }
        }
      } catch (err) {
        // Fetch failed or environment without web server
      }

      // In Node.js / testing environments, read directly from public/vehicles/ on disk
      if (!loadedConfig && typeof window === 'undefined') {
        try {
          const fsMod = 'fs';
          const pathMod = 'path';
          const fs = await import(/* @vite-ignore */ fsMod);
          const path = await import(/* @vite-ignore */ pathMod);
          const localPath = path.resolve(process.cwd(), 'public', 'vehicles', fileInfo.fileName);
          if (fs.existsSync(localPath)) {
            const raw = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
            loadedConfig = {
              format: "Cherax Entity",
              type: 1,
              model: fileInfo.modelHash,
              baseFlags: 1073808655,
              mods: {},
              extras: {},
              wheelType: fileInfo.wheelType ?? 0,
              tyreSmokeColor: fileInfo.tyreSmokeColor ?? { r: 255, g: 255, b: 255 },
              neonKits: fileInfo.neonKits ?? { left: false, right: false, front: false, back: false, color: { r: 0, g: 0, b: 0 } },
              primaryColor: fileInfo.primaryColor ?? 0,
              secondaryColor: fileInfo.secondaryColor ?? 0,
              pearlescentColor: fileInfo.pearlescentColor ?? 0,
              isPrimaryColorCustom: true,
              customPrimaryColor: fileInfo.customPrimaryColor ?? { r: 160, g: 30, b: 30 },
              isSecondaryColorCustom: true,
              customSecondaryColor: fileInfo.customSecondaryColor ?? { r: 25, g: 25, b: 25 },
              windowTint: fileInfo.windowTint ?? 1,
              wheelColor: fileInfo.wheelColor ?? 0,
              interiorColor: fileInfo.interiorColor ?? 0,
              dashBoardColor: fileInfo.dashBoardColor ?? 0,
              plateText: fileInfo.plateText ?? "AUTOVERSE",
              plateTextIndex: fileInfo.plateTextIndex ?? 0,
              bulletproofTyres: true,
              driftTyres: false,
              parametricSpec: raw
            };
          }
        } catch {
          // ignore
        }
      }

      if (!loadedConfig) {
        if (binding?.parametricSpec) {
          loadedConfig = {
            format: "Cherax Entity",
            type: 1,
            model: fileInfo.modelHash,
            baseFlags: 1073808655,
            mods: {},
            extras: {},
            wheelType: fileInfo.wheelType ?? 0,
            tyreSmokeColor: fileInfo.tyreSmokeColor ?? { r: 255, g: 255, b: 255 },
            neonKits: fileInfo.neonKits ?? { left: false, right: false, front: false, back: false, color: { r: 0, g: 0, b: 0 } },
            primaryColor: fileInfo.primaryColor ?? 0,
            secondaryColor: fileInfo.secondaryColor ?? 0,
            pearlescentColor: fileInfo.pearlescentColor ?? 0,
            isPrimaryColorCustom: true,
            customPrimaryColor: fileInfo.customPrimaryColor ?? { r: 160, g: 30, b: 30 },
            isSecondaryColorCustom: true,
            customSecondaryColor: fileInfo.customSecondaryColor ?? { r: 25, g: 25, b: 25 },
            windowTint: fileInfo.windowTint ?? 1,
            wheelColor: fileInfo.wheelColor ?? 0,
            interiorColor: fileInfo.interiorColor ?? 0,
            dashBoardColor: fileInfo.dashBoardColor ?? 0,
            plateText: fileInfo.plateText ?? "AUTOVERSE",
            plateTextIndex: fileInfo.plateTextIndex ?? 0,
            bulletproofTyres: true,
            driftTyres: false,
            parametricSpec: binding.parametricSpec
          };
        } else {
          loadedConfig = {
            format: "Cherax Entity",
            type: 1,
            model: fileInfo.modelHash,
            baseFlags: 1073808655,
            mods: {},
            wheelType: fileInfo.wheelType,
            tyreSmokeColor: fileInfo.tyreSmokeColor,
            neonKits: fileInfo.neonKits,
            primaryColor: fileInfo.primaryColor,
            secondaryColor: fileInfo.secondaryColor,
            pearlescentColor: fileInfo.pearlescentColor,
            isPrimaryColorCustom: fileInfo.isPrimaryColorCustom,
            customPrimaryColor: fileInfo.customPrimaryColor,
            isSecondaryColorCustom: fileInfo.isSecondaryColorCustom,
            customSecondaryColor: fileInfo.customSecondaryColor,
            windowTint: fileInfo.windowTint,
            wheelColor: fileInfo.wheelColor,
            interiorColor: fileInfo.interiorColor,
            dashBoardColor: fileInfo.dashBoardColor,
            plateText: fileInfo.plateText,
            plateTextIndex: fileInfo.plateTextIndex,
            bulletproofTyres: fileInfo.bulletproofTyres,
            driftTyres: fileInfo.driftTyres
          };
        }
      } else if (!loadedConfig.parametricSpec && binding?.parametricSpec) {
        loadedConfig.parametricSpec = binding.parametricSpec;
      }

      set({
        activeFile: fileInfo.fileName,
        activeModel: modelInfo,
        activeConfig: loadedConfig,
        originalConfig: loadedConfig,
        configName: `${modelInfo?.displayName || 'Vehicle'} Custom Config`,
        isDirty: false,
        history: [loadedConfig],
        historyIndex: 0,
        selectedComponentId: null,
        componentOverrides: {},
        overrideHistory: [{}],
        overrideHistoryIndex: 0,
        openingState: DEFAULT_OPENING_STATE,
        cameraPreset: 'isometric',
        cameraTrigger: Date.now()
      });
      return true;
    } catch (e) {
      console.error('Failed to load vehicle file:', e);
      return false;
    }
  },

  loadVehicleByModelHash: async (hash: number) => {
    let model = get().allModels.find(m => m.hash === hash);
    if (!model && !get().isLegacyCatalogLoaded) {
      await get().loadLegacyGtaCatalog();
      model = get().allModels.find(m => m.hash === hash);
    }
    if (!model || model.configurations.length === 0) return;
    await get().loadVehicleByFile(model.configurations[0].fileName);
  },

  importCustomJson: (jsonString: string, fileName: string = 'imported_custom.json') => {
    const parsed = parseVehicleJson(jsonString);
    if (!parsed.success || !parsed.config) {
      return { success: false, error: parsed.error || 'Failed to parse JSON' };
    }

    const cfg = parsed.config;
    const modelHash = cfg.model >>> 0;
    const existingModel = get().allModels.find(m => m.hash === modelHash);

    const syntheticFile: VehicleFileSummary = {
      fileName,
      modelHash,
      modelCode: existingModel ? existingModel.codeName : `custom_${modelHash}`,
      displayName: existingModel ? existingModel.displayName : fileName.replace('.json', ''),
      realWorldModel: existingModel ? existingModel.realWorldModel : 'User Imported Spec',
      manufacturer: existingModel ? existingModel.manufacturer : 'Custom',
      category: existingModel ? existingModel.category : 'Special / Concept',
      plateText: cfg.plateText || 'IMPORT',
      plateTextIndex: cfg.plateTextIndex ?? 0,
      primaryColor: cfg.primaryColor ?? 0,
      secondaryColor: cfg.secondaryColor ?? 0,
      isPrimaryColorCustom: !!cfg.isPrimaryColorCustom,
      customPrimaryColor: cfg.customPrimaryColor || { r: 0, g: 0, b: 0 },
      isSecondaryColorCustom: !!cfg.isSecondaryColorCustom,
      customSecondaryColor: cfg.customSecondaryColor || { r: 0, g: 0, b: 0 },
      pearlescentColor: cfg.pearlescentColor ?? 0,
      wheelType: cfg.wheelType ?? 0,
      wheelColor: cfg.wheelColor ?? 0,
      windowTint: cfg.windowTint ?? 0,
      bulletproofTyres: cfg.bulletproofTyres ?? false,
      driftTyres: cfg.driftTyres ?? false,
      neonKits: cfg.neonKits || { left: false, right: false, front: false, back: false, color: { r: 0, g: 0, b: 0 } },
      tyreSmokeColor: cfg.tyreSmokeColor || { r: 255, g: 255, b: 255 },
      interiorColor: cfg.interiorColor ?? 0,
      dashBoardColor: cfg.dashBoardColor ?? 0,
      hasExtras: !!cfg.extras,
      extrasCount: cfg.extras ? Object.values(cfg.extras).filter(Boolean).length : 0,
      modsCount: cfg.mods ? Object.keys(cfg.mods).length : 0,
      activeModsCount: cfg.mods ? Object.values(cfg.mods).filter(m => m.index > 0).length : 0,
      hasAttachments: !!(cfg.attachments && cfg.attachments.length > 0),
      attachmentsCount: cfg.attachments ? cfg.attachments.length : 0
    };

    if (cfg.parametricSpec?.vehicle) {
      const v = cfg.parametricSpec.vehicle;
      syntheticFile.displayName = `${v.manufacturer} ${v.model}`;
      syntheticFile.realWorldModel = `${v.manufacturer} ${v.model} ${v.generation || ''} ${v.trim || ''}`.trim();
      syntheticFile.manufacturer = v.manufacturer;
      syntheticFile.category = 'Supercar';
    }

    set(state => ({
      allFiles: [syntheticFile, ...state.allFiles],
      activeFile: fileName,
      activeModel: existingModel || {
        hash: modelHash,
        codeName: `custom_${modelHash}`,
        displayName: syntheticFile.displayName,
        manufacturer: syntheticFile.manufacturer,
        realWorldModel: syntheticFile.realWorldModel,
        category: (syntheticFile.category as any) || 'Special / Concept',
        configurations: [syntheticFile]
      },
      activeConfig: cfg,
      originalConfig: cfg,
      isDirty: false,
      history: [cfg],
      historyIndex: 0,
      selectedComponentId: null,
      componentOverrides: {},
      activeView: 'studio',
      cameraTrigger: Date.now()
    }));

    return { success: true };
  },

  updateConfig: (updater, recordHistory = true) => {
    set(state => {
      const nextConfig = updater(state.activeConfig);
      let nextHistory = state.history;
      let nextIndex = state.historyIndex;

      if (recordHistory) {
        nextHistory = state.history.slice(0, state.historyIndex + 1);
        nextHistory.push(nextConfig);
        if (nextHistory.length > 50) nextHistory.shift();
        nextIndex = nextHistory.length - 1;
      }

      return {
        activeConfig: nextConfig,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextIndex
      };
    });
  },

  undo: () => {
    set(state => {
      let nextCfg = state.activeConfig;
      let nextCfgIndex = state.historyIndex;
      if (state.historyIndex > 0) {
        nextCfgIndex = state.historyIndex - 1;
        nextCfg = state.history[nextCfgIndex];
      }

      let nextOverrides = state.componentOverrides;
      let nextOverrideIndex = state.overrideHistoryIndex;
      if (state.overrideHistoryIndex > 0) {
        nextOverrideIndex = state.overrideHistoryIndex - 1;
        nextOverrides = state.overrideHistory[nextOverrideIndex];
      }

      const hasHistory = nextCfgIndex > 0 || nextOverrideIndex > 0;
      return {
        activeConfig: nextCfg,
        historyIndex: nextCfgIndex,
        componentOverrides: nextOverrides,
        overrideHistoryIndex: nextOverrideIndex,
        isDirty: hasHistory
      };
    });
  },

  redo: () => {
    set(state => {
      let nextCfg = state.activeConfig;
      let nextCfgIndex = state.historyIndex;
      if (state.historyIndex < state.history.length - 1) {
        nextCfgIndex = state.historyIndex + 1;
        nextCfg = state.history[nextCfgIndex];
      }

      let nextOverrides = state.componentOverrides;
      let nextOverrideIndex = state.overrideHistoryIndex;
      if (state.overrideHistoryIndex < state.overrideHistory.length - 1) {
        nextOverrideIndex = state.overrideHistoryIndex + 1;
        nextOverrides = state.overrideHistory[nextOverrideIndex];
      }

      return {
        activeConfig: nextCfg,
        historyIndex: nextCfgIndex,
        componentOverrides: nextOverrides,
        overrideHistoryIndex: nextOverrideIndex,
        isDirty: true
      };
    });
  },

  resetConfig: () => {
    set(state => ({
      activeConfig: state.originalConfig,
      isDirty: false,
      history: [state.originalConfig],
      historyIndex: 0,
      selectedComponentId: null,
      componentOverrides: {},
      overrideHistory: [{}],
      overrideHistoryIndex: 0
    }));
  },

  setPrimaryColorIndex: (index: number) => {
    get().updateConfig(cfg => ({
      ...cfg,
      primaryColor: index,
      isPrimaryColorCustom: false
    }));
  },

  setCustomPrimaryColor: (rgb: RGBColor) => {
    get().updateConfig(cfg => ({
      ...cfg,
      customPrimaryColor: rgb,
      isPrimaryColorCustom: true
    }));
  },

  setSecondaryColorIndex: (index: number) => {
    get().updateConfig(cfg => ({
      ...cfg,
      secondaryColor: index,
      isSecondaryColorCustom: false
    }));
  },

  setCustomSecondaryColor: (rgb: RGBColor) => {
    get().updateConfig(cfg => ({
      ...cfg,
      customSecondaryColor: rgb,
      isSecondaryColorCustom: true
    }));
  },

  setWheelType: (type: number) => {
    get().updateConfig(cfg => ({
      ...cfg,
      wheelType: type
    }));
  },

  setWheelColor: (colorIndex: number) => {
    get().updateConfig(cfg => ({
      ...cfg,
      wheelColor: colorIndex
    }));
  },

  setWindowTint: (tintIndex: number) => {
    get().updateConfig(cfg => ({
      ...cfg,
      windowTint: tintIndex
    }));
  },

  setNeonToggle: (position, enabled) => {
    get().updateConfig(cfg => ({
      ...cfg,
      neonKits: {
        ...cfg.neonKits,
        [position]: enabled
      }
    }));
  },

  setNeonColor: (rgb: RGBColor) => {
    get().updateConfig(cfg => ({
      ...cfg,
      neonKits: {
        ...cfg.neonKits,
        color: rgb
      }
    }));
  },

  setModSlot: (slot: string, index: number) => {
    get().updateConfig(cfg => ({
      ...cfg,
      mods: {
        ...cfg.mods,
        [slot]: {
          ...(cfg.mods[slot] || { variation: false }),
          index
        }
      }
    }));
  },

  setExtraToggle: (extraKey: string, enabled: boolean) => {
    get().updateConfig(cfg => ({
      ...cfg,
      extras: {
        ...(cfg.extras || {}),
        [extraKey]: enabled
      }
    }));
  },

  setPlateText: (text: string) => {
    get().updateConfig(cfg => ({
      ...cfg,
      plateText: text.toUpperCase().slice(0, 8)
    }));
  },

  setPlateStyle: (index: number) => {
    get().updateConfig(cfg => ({
      ...cfg,
      plateTextIndex: index
    }));
  },

  setBulletproofTyres: (enabled: boolean) => {
    get().updateConfig(cfg => ({
      ...cfg,
      bulletproofTyres: enabled
    }));
  },

  setDriftTyres: (enabled: boolean) => {
    get().updateConfig(cfg => ({
      ...cfg,
      driftTyres: enabled
    }));
  },

  setActiveView: (view) => set({ activeView: view }),
  setCameraPreset: (preset) => set({ cameraPreset: preset, cameraTrigger: Date.now() }),
  setEnvironmentPreset: (env) => set({ environmentPreset: env }),
  toggleWireframe: () => set(s => ({ isWireframe: !s.isWireframe })),
  toggleAutoRotate: () => set(s => ({ isAutoRotate: !s.isAutoRotate })),
  toggleGrid: () => set(s => ({ showGrid: !s.showGrid })),
  setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),
  registerAssetBinding: (binding) => set(s => ({
    assetBindings: {
      ...s.assetBindings,
      [binding.modelHash]: binding
    }
  }))
}));

if (typeof window !== 'undefined') {
  (window as any).__autoverse_store = useVehicleStore;
}

