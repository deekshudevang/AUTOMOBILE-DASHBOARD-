import { create } from 'zustand';
import { CameraPreset } from '../types/vehicle';

interface ComparisonState {
  vehicleFiles: string[];
  viewportCount: 2 | 3 | 4;
  syncCameras: boolean;
  activePreset: CameraPreset;
  cameraTrigger: number;
  highlightDifferences: boolean;

  addVehicle: (fileName: string) => void;
  removeVehicle: (fileName: string) => void;
  setViewportCount: (count: 2 | 3 | 4) => void;
  toggleSyncCameras: () => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleHighlightDiffs: () => void;
  setSlotVehicle: (index: number, fileName: string) => void;
}

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  vehicleFiles: [
    '2011_Porsche_911GT2RS_997-2.json',
    '2015_LamborghiniHuracan_LP620-2.json'
  ],
  viewportCount: 2,
  syncCameras: true,
  activePreset: 'isometric',
  cameraTrigger: Date.now(),
  highlightDifferences: true,

  addVehicle: (fileName: string) => {
    set(state => {
      if (state.vehicleFiles.includes(fileName)) return {};
      if (state.vehicleFiles.length >= 4) {
        return { vehicleFiles: [...state.vehicleFiles.slice(1), fileName] };
      }
      return {
        vehicleFiles: [...state.vehicleFiles, fileName],
        viewportCount: Math.min(4, state.vehicleFiles.length + 1) as any
      };
    });
  },

  removeVehicle: (fileName: string) => {
    set(state => {
      if (state.vehicleFiles.length <= 2) return {};
      const filtered = state.vehicleFiles.filter(f => f !== fileName);
      return {
        vehicleFiles: filtered,
        viewportCount: Math.max(2, filtered.length) as any
      };
    });
  },

  setViewportCount: (count) => {
    set({ viewportCount: count });
  },

  toggleSyncCameras: () => {
    set(state => ({ syncCameras: !state.syncCameras }));
  },

  setCameraPreset: (preset) => {
    set({ activePreset: preset, cameraTrigger: Date.now() });
  },

  toggleHighlightDiffs: () => {
    set(state => ({ highlightDifferences: !state.highlightDifferences }));
  },

  setSlotVehicle: (index, fileName) => {
    set(state => {
      const copy = [...state.vehicleFiles];
      copy[index] = fileName;
      return { vehicleFiles: copy };
    });
  }
}));

