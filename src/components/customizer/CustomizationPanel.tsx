import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RotateCcw,
  Download,
  Save,
  Undo2,
  Redo2,
  Sliders,
  Box,
  Layers,
  Palette,
  Disc,
  Wind,
  ShieldCheck,
  Check,
  Car,
  Camera,
  Grid,
  Sparkles,
  Maximize2,
  Minimize2,
  Settings,
  AlertTriangle,
  Edit2,
  HelpCircle,
  Cpu,
  GitCompare,
  RotateCw
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { SceneCanvas } from '../3d/SceneCanvas';
import { CameraPreset, EnvironmentPreset } from '../../types/vehicle';
import { VehicleComponentDef, MaterialFinishType, VehicleSchema2 } from '@autoverse/shared-types';
import { EditableVehicleAssembler, WheelRuleValidator } from '@autoverse/vehicle-generation-engine';
import { VehicleExporter } from '@autoverse/vehicle-exporter';
import { ComponentGalleryModal } from '../gallery/ComponentGalleryModal';
import { EngineeringOverlay } from '../modes/EngineeringOverlay';
import { ShowroomOverlay } from '../modes/ShowroomOverlay';
import { ComparisonDiffPanel } from '../modes/ComparisonDiffPanel';
import libraryIndex from '../../../public/vehicles/index.json';

type ConfigCategory =
  | 'exterior'
  | 'paint'
  | 'wheels'
  | 'tyres'
  | 'brakes'
  | 'aero'
  | 'interior'
  | 'lighting'
  | 'advanced';

const CATEGORY_TABS: { id: ConfigCategory; label: string }[] = [
  { id: 'exterior', label: 'Exterior' },
  { id: 'paint', label: 'Paint' },
  { id: 'wheels', label: 'Wheels' },
  { id: 'tyres', label: 'Tyres' },
  { id: 'brakes', label: 'Brakes' },
  { id: 'aero', label: 'Aero' },
  { id: 'interior', label: 'Interior' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'advanced', label: 'Advanced' }
];

const CAMERA_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'isometric', label: '3/4 Iso' },
  { id: 'front', label: 'Front' },
  { id: 'rear', label: 'Rear' },
  { id: 'left', label: 'Left Side' },
  { id: 'right', label: 'Right Side' },
  { id: 'top', label: 'Top' },
  { id: 'wheel', label: 'Wheel Stance' },
  { id: 'wing', label: 'Rear Wing' },
  { id: 'interior', label: 'Cockpit' }
];

const ENV_PRESETS: { id: EnvironmentPreset; label: string }[] = [
  { id: 'studio-dark', label: 'Studio Dark' },
  { id: 'cyber-neon', label: 'Cyber Neon' },
  { id: 'showroom', label: 'Showroom' },
  { id: 'desert-dawn', label: 'Desert Dawn' },
  { id: 'sunset-boulevard', label: 'Sunset Blvd' }
];

const QUICK_COLORS = [
  { name: 'Racing Yellow', hex: '#FACC15' },
  { name: 'Rosso Corsa', hex: '#DC2626' },
  { name: 'Miami Blue', hex: '#0284C7' },
  { name: 'British Racing Green', hex: '#15803D' },
  { name: 'Frozen Silver', hex: '#E2E8F0' },
  { name: 'Stealth Satin Black', hex: '#18181B' },
  { name: 'Lava Orange', hex: '#EA580C' },
  { name: 'Signal Violet', hex: '#7C3AED' }
];

const FINISH_OPTIONS: { id: MaterialFinishType; label: string }[] = [
  { id: 'paint_metallic', label: 'Metallic' },
  { id: 'paint_gloss', label: 'Gloss' },
  { id: 'paint_matte', label: 'Matte' },
  { id: 'carbon_fiber', label: 'Carbon Fiber' },
  { id: 'forged_carbon', label: 'Forged Carbon' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'alloy', label: 'Alloy' },
  { id: 'glass', label: 'Glass' },
  { id: 'leather', label: 'Leather' }
];

export const CustomizationPanel: React.FC = () => {
  const {
    activeConfig,
    activeModel,
    activeFile,
    loadVehicleByFile,
    configName,
    setConfigName,
    selectedComponentId,
    selectComponent,
    componentOverrides,
    updateComponentOverride,
    resetComponentOverride,
    resetAllComponentOverrides,
    toggleComponentVisibility,
    toggleComponentLock,
    cameraPreset,
    setCameraPreset,
    environmentPreset,
    setEnvironmentPreset,
    isWireframe,
    toggleWireframe,
    isAutoRotate,
    toggleAutoRotate,
    showGrid,
    toggleGrid,
    undo,
    redo,
    historyIndex,
    history,
    overrideHistoryIndex,
    overrideHistory,
    presentationMode,
    setPresentationMode
  } = useVehicleStore();

  const containerRef = useRef<HTMLDivElement | null>(null);

  // UI state
  const [activeCategory, setActiveCategory] = useState<ConfigCategory>('exterior');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFleetTab, setSelectedFleetTab] = useState('all');
  const [isExportingGlb, setIsExportingGlb] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  // Expanded component groups state
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    body_panels: true,
    aerodynamics: true,
    lighting: false,
    windows: false,
    wheels: true,
    exhaust: false,
    interior: false
  });

  // Extract Schema 2.0 vehicle specification if active
  const schema2Spec = useMemo(() => {
    const raw = (activeConfig.parametricSpec || activeConfig) as any;
    if (raw?.schemaVersion === '2.0') {
      return raw as VehicleSchema2;
    }
    return null;
  }, [activeConfig.parametricSpec, activeConfig]);

  // Capability matrix evaluation for active vehicle (Rule: only show supported options)
  const capabilities = useMemo(() => {
    const isSchema2 = schema2Spec !== null;
    const comps = schema2Spec?.components || [];
    return {
      exterior: isSchema2 && comps.some(c => c.group === 'body_panels'),
      paint: true, // Universally supported across all vehicles
      wheels: isSchema2 && !!schema2Spec?.wheels,
      tyres: isSchema2 && !!schema2Spec?.wheels?.frontLeft?.tire,
      brakes: isSchema2 && !!schema2Spec?.wheels?.frontLeft?.brakes,
      aero: isSchema2 && comps.some(c => c.group === 'aerodynamics'),
      interior: isSchema2 && comps.some(c => c.group === 'interior'),
      lighting: isSchema2 && comps.some(c => c.group === 'lighting'),
      advanced: isSchema2 && !!schema2Spec?.dimensions,
    };
  }, [schema2Spec]);

  // Keyboard navigation & shortcuts (Ctrl+Z, Ctrl+Y, 1-8 presets)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'w' || e.key === 'W') {
        toggleWireframe();
      } else if (e.key === '1') setCameraPreset('isometric');
      else if (e.key === '2') setCameraPreset('front');
      else if (e.key === '3') setCameraPreset('rear');
      else if (e.key === '4') setCameraPreset('left');
      else if (e.key === '5') setCameraPreset('right');
      else if (e.key === '6') setCameraPreset('top');
      else if (e.key === '7') setCameraPreset('wheel');
      else if (e.key === '8' && capabilities.interior) setCameraPreset('interior');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, toggleWireframe, setCameraPreset, capabilities.interior]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Filtered vehicles for left drawer
  const filteredAssets = useMemo(() => {
    return (libraryIndex.assets || []).filter(asset => {
      const matchCat = selectedFleetTab === 'all' || asset.category === selectedFleetTab;
      const matchQuery =
        !searchQuery ||
        `${asset.manufacturer} ${asset.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedFleetTab, searchQuery]);

  // Group components by category
  const groupedComponents = useMemo(() => {
    if (!schema2Spec?.components) return {};
    const groups: Record<string, VehicleComponentDef[]> = {
      body_panels: [],
      aerodynamics: [],
      lighting: [],
      windows: [],
      wheels: [],
      exhaust: [],
      interior: []
    };
    for (const comp of schema2Spec.components) {
      if (groups[comp.group]) {
        groups[comp.group].push(comp);
      } else {
        groups.body_panels.push(comp);
      }
    }
    return groups;
  }, [schema2Spec]);

  // Wheel Fitment calculation using WheelRuleValidator
  const wheelFitmentReport = useMemo(() => {
    const frontSpec = schema2Spec?.wheels?.frontLeft;
    const baseline = {
      rimDiameterInches: frontSpec?.tire.rim_diameter_in || 20,
      nominalSectionWidthMm: frontSpec?.tire.nominal_section_width_mm || 265,
      aspectRatio: frontSpec?.tire.aspect_ratio || 35,
      rimWidthInches: frontSpec?.rim.width_m ? Math.round(frontSpec.rim.width_m * 39.37 * 10) / 10 : 9.5,
      offsetMm: frontSpec?.rim.offset_mm || 42
    };

    const wheelOverride = componentOverrides['wheel_fl'] || componentOverrides['wheel_front_left'];
    const proposed = {
      rimDiameterInches: wheelOverride?.contextSettings?.rimDiameterInches ?? baseline.rimDiameterInches,
      nominalSectionWidthMm: wheelOverride?.contextSettings?.nominalSectionWidthMm ?? baseline.nominalSectionWidthMm,
      aspectRatio: wheelOverride?.contextSettings?.aspectRatio ?? baseline.aspectRatio,
      rimWidthInches: wheelOverride?.contextSettings?.rimWidthInches ?? baseline.rimWidthInches,
      offsetMm: wheelOverride?.contextSettings?.offsetMm ?? baseline.offsetMm
    };

    return WheelRuleValidator.validateFitment(proposed, baseline);
  }, [schema2Spec, componentOverrides]);

  // Find currently selected component definition
  const selectedComponent = useMemo(() => {
    if (!selectedComponentId || !schema2Spec?.components) return null;
    return schema2Spec.components.find(c => c.id === selectedComponentId) || null;
  }, [selectedComponentId, schema2Spec]);

  const activeOverride = selectedComponentId ? componentOverrides[selectedComponentId] : undefined;

  // Toggle tree group
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Export modified vehicle to binary GLB
  const handleExportGlb = async () => {
    if (!schema2Spec) return;
    try {
      setIsExportingGlb(true);
      const scene = EditableVehicleAssembler.build(schema2Spec, {
        componentOverrides,
        wireframe: false
      });
      const buffer = await VehicleExporter.exportToGlb(scene);
      const blob = new Blob([buffer], { type: 'model/gltf-binary' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${schema2Spec.vehicle.id}_custom.glb`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export GLB:', e);
    } finally {
      setIsExportingGlb(false);
    }
  };

  // Export modified vehicle to JSON
  const handleExportJson = () => {
    if (!schema2Spec) return;
    const modifiedSpec = {
      ...schema2Spec,
      componentOverrides,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(modifiedSpec, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema2Spec.vehicle.id}_custom.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save changes locally
  const handleSaveConfig = () => {
    try {
      localStorage.setItem(`autoverse_override_${activeFile}`, JSON.stringify(componentOverrides));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  // Confirm and execute reset
  const handleConfirmReset = () => {
    resetAllComponentOverrides();
    setIsResetConfirmOpen(false);
  };

  const modifiedCount = Object.keys(componentOverrides).length;
  const canUndo = historyIndex > 0 || overrideHistoryIndex > 0;
  const canRedo = historyIndex < history.length - 1 || overrideHistoryIndex < overrideHistory.length - 1;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col bg-[#0A0C10] text-slate-100 font-sans overflow-hidden select-none"
    >
      {/* ========================================================= */}
      {/* 3.1 TOP BAR: Brand, Vehicle Selector, Actions & Shortcuts */}
      {/* ========================================================= */}
      <header className="h-12 bg-[#11141C] border-b border-[#1E2533] px-4 flex items-center justify-between text-xs shrink-0 z-30">
        {/* Brand & Vehicle Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono font-bold tracking-wider text-sm text-[#00F0FF]">
            <Car className="w-4 h-4 text-[#00F0FF]" />
            <span>AUTOVERSE 3D</span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Editable Configuration Name */}
          <div className="flex items-center gap-1.5">
            {isEditingName ? (
              <input
                type="text"
                value={configName}
                autoFocus
                onBlur={() => setIsEditingName(false)}
                onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)}
                onChange={e => setConfigName(e.target.value)}
                className="bg-[#161C28] border border-[#00F0FF] rounded px-2 py-0.5 text-xs text-white focus:outline-none"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-1.5 hover:text-[#00F0FF] text-slate-200 transition-colors"
                title="Click to edit configuration title"
              >
                <span className="font-semibold truncate max-w-xs">{configName}</span>
                <Edit2 className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Center: Presentation Mode Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0E1118] border border-[#1E2533]">
          <button
            onClick={() => setPresentationMode('studio')}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              presentationMode === 'studio'
                ? 'bg-[#00F0FF] text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Studio Mode: Clean aesthetic presentation with customizer studios"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio</span>
          </button>
          <button
            onClick={() => setPresentationMode('engineering')}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              presentationMode === 'engineering'
                ? 'bg-[#00F0FF] text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Engineering Mode: CAD HUD, 3D Caliper, hierarchy and dimensional validation"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Engineering</span>
          </button>
          <button
            onClick={() => setPresentationMode('showroom')}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              presentationMode === 'showroom'
                ? 'bg-[#00F0FF] text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Showroom Mode: Fullscreen 360 turntable auto-orbit with interaction pause"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Showroom</span>
          </button>
          <button
            onClick={() => setPresentationMode('comparison')}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              presentationMode === 'comparison'
                ? 'bg-[#00F0FF] text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Comparison Mode: A/B parameter delta table against factory OEM baseline"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Comparison</span>
          </button>
        </div>

        {/* Right Action Icons: Undo, Redo, Reset, Save, Fullscreen, Design Gallery */}
        <div className="flex items-center gap-2">
          {/* Undo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-300 disabled:opacity-30 disabled:pointer-events-none border border-[#1E2533] transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          {/* Redo */}
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-300 disabled:opacity-30 disabled:pointer-events-none border border-[#1E2533] transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          {/* Reset Configuration */}
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-2.5 py-1.5 rounded bg-[#161C28] hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 border border-[#1E2533] flex items-center gap-1.5 transition-colors"
            title="Reset to factory specification"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Save Configuration */}
          <button
            onClick={handleSaveConfig}
            className="px-3 py-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-200 border border-[#1E2533] flex items-center gap-1.5 font-medium transition-colors"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5 text-slate-300" />}
            <span>{saveSuccess ? 'Saved' : 'Save'}</span>
          </button>

          {/* Design System Gallery Modal */}
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="p-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-300 border border-[#1E2533] transition-colors"
            title="Open Automotive Design System Gallery"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-300 border border-[#1E2533] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN 3-ZONE WORKSPACE (Responsive Mobile Bottom-Sheet)     */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* ARIA Live Region for Accessibility Announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {`AutoVerse Configurator: Active Vehicle is ${activeModel?.realWorldModel || 'Vehicle'}. Current mode is ${presentationMode}.`}
        </div>

        {/* LEFT PANEL: 50 Vehicle Library & Component Hierarchy */}
        {presentationMode !== 'showroom' && (
          <aside className="hidden lg:flex w-72 lg:w-80 h-full bg-[#0D1017] border-r border-[#1E2533] flex-col shrink-0 z-10">
          <div className="p-3 border-b border-[#1E2533] space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#00F0FF]" />
                Fleet Library
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-[#161C28] px-1.5 py-0.5 rounded border border-[#1E2533]">
                {filteredAssets.length} / 50
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#161C28] border border-[#1E2533] rounded px-2.5 py-1.5 pl-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
          </div>

          {/* Vehicle Selector List */}
          <div className="max-h-44 overflow-y-auto border-b border-[#1E2533] divide-y divide-[#161C28] shrink-0">
            {filteredAssets.map(asset => {
              const isActive = activeFile === asset.file;
              return (
                <button
                  key={asset.asset_id}
                  onClick={() => loadVehicleByFile(asset.file)}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition-colors ${
                    isActive
                      ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-l-2 border-[#00F0FF]'
                      : 'text-slate-300 hover:bg-[#161C28]'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-semibold truncate">{asset.manufacturer} {asset.model}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{asset.category.replace('_', ' ')} · {asset.year || 2024}</div>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Component Hierarchy Header */}
          <div className="p-3 border-b border-[#1E2533] bg-[#11141C] flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
              Component Tree
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {schema2Spec?.components.length || 0} nodes
            </span>
          </div>

          {/* Collapsible Component Tree */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {Object.entries(groupedComponents).map(([groupKey, components]) => {
              if (components.length === 0) return null;
              const isExpanded = expandedGroups[groupKey] ?? false;
              const groupLabel = groupKey.replace('_', ' ').toUpperCase();

              return (
                <div key={groupKey} className="rounded border border-[#1E2533] overflow-hidden bg-[#11141C]/60">
                  <button
                    onClick={() => toggleGroup(groupKey)}
                    className="w-full px-2.5 py-1.5 flex items-center justify-between text-slate-300 hover:bg-[#161C28] text-xs font-medium"
                  >
                    <div className="flex items-center gap-1.5">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span className="capitalize">{groupLabel}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({components.length})
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-[#161C28]/80 bg-[#0D1017]">
                      {components.map(comp => {
                        const isSelected = selectedComponentId === comp.id;
                        const override = componentOverrides[comp.id];
                        const isModified = !!override && Object.keys(override).length > 1;
                        const isHidden = override?.visible === false;
                        const isLocked = !!override?.locked;

                        return (
                          <div
                            key={comp.id}
                            onClick={() => selectComponent(comp.id)}
                            className={`px-2.5 py-1.5 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-l-2 border-[#00F0FF]'
                                : 'text-slate-300 hover:bg-[#161C28]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {isModified && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shrink-0" title="Modified" />
                              )}
                              <span className="truncate">{comp.name}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => toggleComponentVisibility(comp.id)}
                                className={`p-1 rounded hover:bg-[#1E2533] ${
                                  isHidden ? 'text-slate-600' : 'text-slate-400 hover:text-slate-200'
                                }`}
                                title={isHidden ? 'Show component' : 'Hide component'}
                              >
                                {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                              <button
                                onClick={() => toggleComponentLock(comp.id)}
                                className={`p-1 rounded hover:bg-[#1E2533] ${
                                  isLocked ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                                }`}
                                title={isLocked ? 'Unlock component' : 'Lock component'}
                              >
                                {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
        )}

        {/* 3.2 CENTRAL HERO VIEWPORT: Three.js Interactive 3D Canvas */}
        <main className="flex-1 h-full relative flex flex-col overflow-hidden" role="main">
          {/* Top Camera Presets Toolbar */}
          <div className="h-10 bg-[#0D1017]/90 backdrop-blur-md border-b border-[#1E2533] px-3 flex items-center justify-between text-xs z-10 shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto">
              <Camera className="w-3.5 h-3.5 text-[#00F0FF] mr-1 shrink-0" />
              {CAMERA_PRESETS.map(preset => {
                if (preset.id === 'interior' && !capabilities.interior) return null;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setCameraPreset(preset.id)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors whitespace-nowrap ${
                      cameraPreset === preset.id
                        ? 'bg-[#1E2533] text-[#00F0FF] font-semibold border border-[#00F0FF]/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#161C28]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Viewport Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleWireframe}
                className={`p-1.5 rounded border transition-colors ${
                  isWireframe
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]'
                    : 'bg-[#161C28] text-slate-400 border-[#1E2533] hover:text-slate-200'
                }`}
                title="Toggle Wireframe (W)"
              >
                <Box className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleAutoRotate}
                className={`p-1.5 rounded border transition-colors ${
                  isAutoRotate
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]'
                    : 'bg-[#161C28] text-slate-400 border-[#1E2533] hover:text-slate-200'
                }`}
                title="Toggle Auto-Rotate"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleGrid}
                className={`p-1.5 rounded border transition-colors ${
                  showGrid
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]'
                    : 'bg-[#161C28] text-slate-400 border-[#1E2533] hover:text-slate-200'
                }`}
                title="Toggle Ground Grid"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3D Scene Canvas */}
          <div className="flex-1 w-full h-full relative bg-[#0A0C10]" role="region" aria-label="Interactive 3D Vehicle Viewport">
            <SceneCanvas />

            {/* Overlays for Presentation Modes */}
            {presentationMode === 'engineering' && <EngineeringOverlay />}
            {presentationMode === 'showroom' && <ShowroomOverlay />}
            {presentationMode === 'comparison' && <ComparisonDiffPanel />}

            {/* Selection pill */}
            {selectedComponent && (
              <div className="absolute top-3 left-3 bg-[#0D1017]/90 backdrop-blur-md border border-[#00F0FF]/60 px-3 py-1.5 rounded-lg shadow-xl text-xs flex items-center gap-2 z-10">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                <span className="font-semibold text-slate-200">{selectedComponent.name}</span>
                <span className="text-[10px] font-mono text-slate-400 capitalize">({selectedComponent.group})</span>
                <button
                  onClick={() => selectComponent(null)}
                  className="text-slate-400 hover:text-white ml-2 text-sm"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </main>

        {/* 3.3 RIGHT CONFIGURATION PANEL: Capability-Driven Categories & Inspector (Mobile Bottom Sheet) */}
        {presentationMode !== 'showroom' && (
          <aside className="w-full md:w-88 lg:w-96 h-1/2 md:h-full bg-[#0D1017] border-t md:border-t-0 md:border-l border-[#1E2533] flex flex-col shrink-0 z-10 overflow-hidden">
          {/* Category Tabs Header */}
          <div className="p-2 border-b border-[#1E2533] bg-[#11141C] flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activeCategory === tab.id
                    ? 'bg-[#00F0FF] text-black font-semibold'
                    : 'bg-[#161C28] text-slate-400 hover:text-slate-200 hover:bg-[#1E2533] border border-[#1E2533]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Configuration Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Rule 1.1 Non-negotiable 3: Capability Check */}
            {!capabilities[activeCategory] ? (
              <div className="p-4 rounded-lg bg-[#161C28]/80 border border-amber-900/40 text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Unavailable for this vehicle</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  This vehicle specification does not contain separable <strong>{activeCategory}</strong> components in its geometry hierarchy.
                </p>
                <div className="p-2 rounded bg-[#0D1017] border border-[#1E2533] font-mono text-[10px] text-slate-400">
                  Format: {schema2Spec ? 'Schema 2.0 (Component Limited)' : 'Cherax Entity (Monolithic Body)'}
                </div>
              </div>
            ) : selectedComponent ? (
              /* Component Selected Inspector */
              <div className="space-y-4">
                <div className="p-2.5 rounded bg-[#11141C] border border-[#1E2533] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{selectedComponent.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161C28] text-[#00F0FF] border border-[#1E2533]">
                      {selectedComponent.group}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    ID: {selectedComponent.id} · Type: {selectedComponent.geometryType}
                  </div>
                </div>

                {/* Transforms */}
                <div className="space-y-2 p-3 rounded bg-[#11141C]/60 border border-[#1E2533]">
                  <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Position (meters)</span>
                    <span className="text-[10px] font-mono text-slate-400">X / Y / Z</span>
                  </div>

                  {/* X Translation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">X (Lateral):</span>
                      <span className="font-mono text-slate-200">
                        {((activeOverride?.position?.[0] ?? selectedComponent.transform.position[0])).toFixed(3)}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-1.5}
                      max={1.5}
                      step={0.01}
                      value={activeOverride?.position?.[0] ?? selectedComponent.transform.position[0]}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        const cur = activeOverride?.position ?? selectedComponent.transform.position;
                        updateComponentOverride(selectedComponent.id, {
                          position: [val, cur[1], cur[2]]
                        }, false); // Coalesced live drag
                      }}
                      onMouseUp={e => {
                        const val = parseFloat((e.target as HTMLInputElement).value);
                        const cur = activeOverride?.position ?? selectedComponent.transform.position;
                        updateComponentOverride(selectedComponent.id, {
                          position: [val, cur[1], cur[2]]
                        }, true); // Commit history on release
                      }}
                      className="w-full accent-[#00F0FF] cursor-pointer"
                    />
                  </div>

                  {/* Y Translation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Y (Height):</span>
                      <span className="font-mono text-slate-200">
                        {((activeOverride?.position?.[1] ?? selectedComponent.transform.position[1])).toFixed(3)}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-0.5}
                      max={2.0}
                      step={0.01}
                      value={activeOverride?.position?.[1] ?? selectedComponent.transform.position[1]}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        const cur = activeOverride?.position ?? selectedComponent.transform.position;
                        updateComponentOverride(selectedComponent.id, {
                          position: [cur[0], val, cur[2]]
                        }, false);
                      }}
                      onMouseUp={e => {
                        const val = parseFloat((e.target as HTMLInputElement).value);
                        const cur = activeOverride?.position ?? selectedComponent.transform.position;
                        updateComponentOverride(selectedComponent.id, {
                          position: [cur[0], val, cur[2]]
                        }, true);
                      }}
                      className="w-full accent-[#00F0FF] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Materials & Finishes */}
                <div className="space-y-2 p-3 rounded bg-[#11141C]/60 border border-[#1E2533]">
                  <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#00F0FF]" />
                    Material Finish
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {FINISH_OPTIONS.map(opt => {
                      const isCurrent = activeOverride?.materialFinish === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => updateComponentOverride(selectedComponent.id, { materialFinish: opt.id }, true)}
                          className={`px-2 py-1.5 rounded text-[10px] font-medium transition-colors text-center ${
                            isCurrent
                              ? 'bg-[#00F0FF] text-black font-semibold'
                              : 'bg-[#161C28] text-slate-300 hover:bg-[#1E2533] border border-[#1E2533]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="text-slate-400 text-[11px]">Color Palette:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_COLORS.map(color => (
                        <button
                          key={color.hex}
                          onClick={() => updateComponentOverride(selectedComponent.id, { customColorHex: color.hex }, true)}
                          style={{ backgroundColor: color.hex }}
                          className="w-5 h-5 rounded-full border border-black/40 hover:scale-110 transition-transform"
                          title={color.name}
                        />
                      ))}
                      <input
                        type="color"
                        value={activeOverride?.customColorHex || '#00F0FF'}
                        onChange={e => updateComponentOverride(selectedComponent.id, { customColorHex: e.target.value }, true)}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        title="Custom Color"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Category Dedicated Studio Panes when no single component is selected */
              <div className="space-y-4">
                {activeCategory === 'paint' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-[#11141C] border border-[#1E2533] space-y-2">
                      <div className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#00F0FF]" />
                        Paint Studio
                      </div>
                      <p className="text-slate-400 text-xs">
                        Configure exterior body finishes with calibrated physical clearcoat and metallic flakes.
                      </p>
                    </div>

                    <div className="p-3 rounded bg-[#11141C]/60 border border-[#1E2533] space-y-2">
                      <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                        Automotive Finishes
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {FINISH_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              // Apply finish to body panels
                              const bodyComps = schema2Spec?.components.filter(c => c.group === 'body_panels') || [];
                              for (const comp of bodyComps) {
                                updateComponentOverride(comp.id, { materialFinish: opt.id }, false);
                              }
                              if (bodyComps.length > 0) {
                                updateComponentOverride(bodyComps[0].id, { materialFinish: opt.id }, true);
                              }
                            }}
                            className="px-2 py-1.5 rounded text-[10px] font-medium bg-[#161C28] text-slate-300 hover:bg-[#1E2533] hover:text-[#00F0FF] border border-[#1E2533] transition-colors text-center"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 space-y-1.5">
                        <div className="text-slate-400 text-[11px]">Heritage Color Swatches:</div>
                        <div className="flex flex-wrap gap-2">
                          {QUICK_COLORS.map(color => (
                            <button
                              key={color.hex}
                              onClick={() => {
                                const bodyComps = schema2Spec?.components.filter(c => c.group === 'body_panels') || [];
                                for (const comp of bodyComps) {
                                  updateComponentOverride(comp.id, { customColorHex: color.hex }, false);
                                }
                                if (bodyComps.length > 0) {
                                  updateComponentOverride(bodyComps[0].id, { customColorHex: color.hex }, true);
                                }
                              }}
                              style={{ backgroundColor: color.hex }}
                              className="w-6 h-6 rounded-full border border-black/40 hover:scale-110 transition-transform shadow"
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(activeCategory === 'wheels' || activeCategory === 'tyres') && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-[#11141C] border border-[#1E2533] space-y-2">
                      <div className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                        <Disc className="w-3.5 h-3.5 text-[#00F0FF]" />
                        Rule-Based Wheel & Tyre Studio
                      </div>
                      <p className="text-slate-400 text-xs">
                        Overall rolling diameter is constrained within ±3.0% of OEM specification.
                      </p>
                    </div>

                    {/* Fitment Validation Badge */}
                    {wheelFitmentReport && (
                      <div className={`p-3 rounded-lg border space-y-1.5 ${
                        wheelFitmentReport.isValid
                          ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                      }`}>
                        <div className="flex items-center justify-between font-mono font-bold text-xs">
                          <span>{wheelFitmentReport.isValid ? '✓ FITMENT VERIFIED' : '✗ FITMENT BLOCKED'}</span>
                          <span>{wheelFitmentReport.diameterDeviationPercent > 0 ? '+' : ''}{wheelFitmentReport.diameterDeviationPercent.toFixed(1)}%</span>
                        </div>
                        <div className="text-[11px] font-mono opacity-90">
                          Rolling Dia: {wheelFitmentReport.rollingDiameterMm}mm (OEM: {wheelFitmentReport.originalDiameterMm}mm)
                        </div>
                        {wheelFitmentReport.errors.map((err, i) => (
                          <div key={i} className="text-[10px] text-rose-400 font-sans">
                            • {err}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Wheel Stance Sliders */}
                    <div className="p-3 rounded bg-[#11141C]/60 border border-[#1E2533] space-y-3">
                      <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                        Wheel Stance & Camber
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Front Camber Angle:</span>
                          <span className="font-mono text-[#00F0FF]">
                            {componentOverrides['wheel_fl']?.contextSettings?.camberDeg ?? -3.5}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-7.0}
                          max={1.0}
                          step={0.1}
                          value={componentOverrides['wheel_fl']?.contextSettings?.camberDeg ?? -3.5}
                          onChange={e => {
                            const val = parseFloat(e.target.value);
                            updateComponentOverride('wheel_fl', { contextSettings: { camberDeg: val } }, false);
                            updateComponentOverride('wheel_fr', { contextSettings: { camberDeg: val } }, false);
                          }}
                          onMouseUp={e => {
                            const val = parseFloat((e.target as HTMLInputElement).value);
                            updateComponentOverride('wheel_fl', { contextSettings: { camberDeg: val } }, true);
                            updateComponentOverride('wheel_fr', { contextSettings: { camberDeg: val } }, true);
                          }}
                          className="w-full accent-[#00F0FF] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'brakes' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-[#11141C] border border-[#1E2533] space-y-2">
                      <div className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
                        Brake Assemblies & Calipers
                      </div>
                      <p className="text-slate-400 text-xs">
                        High-performance carbon-ceramic discs with multi-piston monoblock calipers.
                      </p>
                    </div>

                    <div className="p-3 rounded bg-[#11141C]/60 border border-[#1E2533] space-y-2">
                      <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                        Caliper Finishes
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Brembo Red', hex: '#DC2626' },
                          { name: 'Acid Green', hex: '#84CC16' },
                          { name: 'Carbon Gold', hex: '#EAB308' },
                          { name: 'Electric Cyan', hex: '#00F0FF' },
                          { name: 'Monochrome Silver', hex: '#E2E8F0' },
                          { name: 'Gloss Black', hex: '#18181B' }
                        ].map(c => (
                          <button
                            key={c.hex}
                            onClick={() => {
                              ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].forEach(id => {
                                updateComponentOverride(id, { contextSettings: { caliperColor: c.hex } }, false);
                              });
                              updateComponentOverride('wheel_fl', { contextSettings: { caliperColor: c.hex } }, true);
                            }}
                            style={{ backgroundColor: c.hex }}
                            className="w-7 h-7 rounded-full border border-black/50 hover:scale-110 transition-transform shadow"
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {(activeCategory === 'exterior' || activeCategory === 'aero') && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-[#11141C] border border-[#1E2533] space-y-2">
                      <div className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider">
                        {activeCategory === 'aero' ? 'Aerodynamics Kit' : 'Exterior Body Panels'}
                      </div>
                      <p className="text-slate-400 text-xs">
                        Select a component from below to adjust position, angle of attack, or finish:
                      </p>
                    </div>

                    <div className="divide-y divide-[#1E2533] rounded bg-[#11141C] border border-[#1E2533]">
                      {(schema2Spec?.components || [])
                        .filter(c => (activeCategory === 'aero' ? c.group === 'aerodynamics' : c.group === 'body_panels'))
                        .map(comp => (
                          <button
                            key={comp.id}
                            onClick={() => selectComponent(comp.id)}
                            className="w-full text-left p-2.5 flex items-center justify-between hover:bg-[#161C28] text-slate-300 transition-colors"
                          >
                            <span className="font-medium text-xs">{comp.name}</span>
                            <span className="text-[10px] font-mono text-slate-500">Edit →</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {activeCategory === 'interior' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-[#11141C] border border-[#1E2533] space-y-2">
                      <div className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider">
                        Cockpit & Interior Studio
                      </div>
                      <p className="text-slate-400 text-xs">
                        Custom upholstery, racing bucket seats, and dashboard trim.
                      </p>
                    </div>

                    <div className="divide-y divide-[#1E2533] rounded bg-[#11141C] border border-[#1E2533]">
                      {(schema2Spec?.components || [])
                        .filter(c => c.group === 'interior')
                        .map(comp => (
                          <button
                            key={comp.id}
                            onClick={() => selectComponent(comp.id)}
                            className="w-full text-left p-2.5 flex items-center justify-between hover:bg-[#161C28] text-slate-300 transition-colors"
                          >
                            <span className="font-medium text-xs">{comp.name}</span>
                            <span className="text-[10px] font-mono text-slate-500">Edit →</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
        )}
      </div>

      {/* ========================================================= */}
      {/* BOTTOM ACTION BAR                                         */}
      {/* ========================================================= */}
      {presentationMode !== 'showroom' && (
        <footer className="h-12 bg-[#0D1017] border-t border-[#1E2533] px-4 flex items-center justify-between text-xs shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200 truncate">
              {activeModel?.realWorldModel || 'AutoVerse Spec'}
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-slate-400 text-[11px]">
              {schema2Spec?.components.length || 0} Components
            </span>
            {modifiedCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] font-mono text-[10px] border border-[#00F0FF]/40">
                {modifiedCount} Modified
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-200 border border-[#1E2533] flex items-center gap-1.5 font-medium"
              title="Export Schema 2.0 Vehicle JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleExportGlb}
              disabled={isExportingGlb}
              className="px-3.5 py-1.5 rounded bg-[#00F0FF] hover:bg-[#00D4E0] text-black font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Export binary GLB 3D model"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>{isExportingGlb ? 'Exporting...' : 'Export GLB'}</span>
            </button>
          </div>
        </footer>
      )}

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#11141C] border border-[#1E2533] rounded-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-100 text-sm">Reset Configuration?</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Are you sure you want to revert all customized components back to factory specifications? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-300 border border-[#1E2533]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Component Gallery Modal */}
      <ComponentGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

export default CustomizationPanel;
