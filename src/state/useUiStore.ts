import { create } from 'zustand';

export type Workspace = 'atelier' | 'telemetry' | 'engineering';

export interface ToastMessage {
  id: string;
  type: 'info' | 'ok' | 'warn' | 'error';
  title: string;
  message?: string;
  durationMs?: number;
}

interface UiStoreState {
  // Primary Workspace
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;

  // Car Studio Atelier Blade
  isBladeCollapsed: boolean;
  setBladeCollapsed: (collapsed: boolean) => void;
  toggleBladeCollapsed: () => void;
  bladeWidth: number;
  setBladeWidth: (width: number) => void;
  activeStudioTab: string;
  setActiveStudioTab: (tab: string) => void;

  // Orbit & Camera Gesture State
  isOrbitDragging: boolean;
  setIsOrbitDragging: (dragging: boolean) => void;

  // Global Dialogs & Overlays
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  isShortcutHelpOpen: boolean;
  setShortcutHelpOpen: (open: boolean) => void;

  // Accessibility & Preferences
  uiSoundsEnabled: boolean;
  toggleUiSounds: () => void;
  reducedMotionOverride: boolean | null;
  setReducedMotionOverride: (override: boolean | null) => void;
  showEngineeringGrid: boolean;
  toggleEngineeringGrid: () => void;

  // Toast Notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Safe localStorage persistence helper
function loadStoredPreference<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const item = window.localStorage.getItem(`autoverse_ui_${key}`);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveStoredPreference<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`autoverse_ui_${key}`, JSON.stringify(value));
    }
  } catch {
    // Ignore storage quota or blocked storage errors gracefully
  }
}

export const useUiStore = create<UiStoreState>((set) => ({
  activeWorkspace: loadStoredPreference<Workspace>('active_workspace', 'atelier'),
  setActiveWorkspace: (ws) => {
    saveStoredPreference('active_workspace', ws);
    set({ activeWorkspace: ws });
  },

  isBladeCollapsed: loadStoredPreference<boolean>('blade_collapsed', false),
  setBladeCollapsed: (collapsed) => {
    saveStoredPreference('blade_collapsed', collapsed);
    set({ isBladeCollapsed: collapsed });
  },
  toggleBladeCollapsed: () =>
    set((state) => {
      const next = !state.isBladeCollapsed;
      saveStoredPreference('blade_collapsed', next);
      return { isBladeCollapsed: next };
    }),

  bladeWidth: loadStoredPreference<number>('blade_width', 360),
  setBladeWidth: (width) => {
    const clamped = Math.max(280, Math.min(width, 500));
    saveStoredPreference('blade_width', clamped);
    set({ bladeWidth: clamped });
  },

  activeStudioTab: loadStoredPreference<string>('active_studio_tab', 'exterior'),
  setActiveStudioTab: (tab) => {
    saveStoredPreference('active_studio_tab', tab);
    set({ activeStudioTab: tab });
  },

  isOrbitDragging: false,
  setIsOrbitDragging: (dragging) => set({ isOrbitDragging: dragging }),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  isShortcutHelpOpen: false,
  setShortcutHelpOpen: (open) => set({ isShortcutHelpOpen: open }),

  uiSoundsEnabled: loadStoredPreference<boolean>('ui_sounds', false),
  toggleUiSounds: () =>
    set((state) => {
      const next = !state.uiSoundsEnabled;
      saveStoredPreference('ui_sounds', next);
      return { uiSoundsEnabled: next };
    }),

  reducedMotionOverride: loadStoredPreference<boolean | null>('reduced_motion', null),
  setReducedMotionOverride: (override) => {
    saveStoredPreference('reduced_motion', override);
    set({ reducedMotionOverride: override });
  },

  showEngineeringGrid: loadStoredPreference<boolean>('show_grid', false),
  toggleEngineeringGrid: () =>
    set((state) => {
      const next = !state.showEngineeringGrid;
      saveStoredPreference('show_grid', next);
      return { showEngineeringGrid: next };
    }),

  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    if (toast.durationMs !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, toast.durationMs || 4000);
    }
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
