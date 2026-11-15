import React, { useState, useMemo } from 'react';
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
  Maximize2
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { SceneCanvas } from '../3d/SceneCanvas';
import { CameraPreset, EnvironmentPreset } from '../../types/vehicle';
import { VehicleComponentDef, MaterialFinishType, VehicleSchema2 } from '@autoverse/shared-types';
import { EditableVehicleAssembler } from '@autoverse/vehicle-generation-engine';
import { VehicleExporter } from '@autoverse/vehicle-exporter';
import libraryIndex from '../../../public/vehicles/index.json';

const CAMERA_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'isometric', label: '3/4 Iso' },
  { id: 'front', label: 'Front' },
  { id: 'rear', label: 'Rear' },
  { id: 'left', label: 'Left Side' },
  { id: 'right', label: 'Right Side' },
  { id: 'top', label: 'Top View' },
  { id: 'wheel', label: 'Wheel Stance' },
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

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'supercars', label: 'Supercars' },
  { id: 'hypercars', label: 'Hypercars' },
  { id: 'sports_cars', label: 'Sports' },
  { id: 'luxury_cars', label: 'Luxury' },
  { id: 'track_cars', label: 'Track' },
  { id: 'jdm_cars', label: 'JDM' },
  { id: 'muscle_cars', label: 'Muscle' },
  { id: 'special_edition', label: 'Special' }
];

export const CustomizationPanel: React.FC = () => {
  const {
    activeConfig,
    activeModel,
    activeFile,
    loadVehicleByFile,
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
    history
  } = useVehicleStore();

  // Search & Filter state for left library panel
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExportingGlb, setIsExportingGlb] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // Filtered vehicles for left drawer
  const filteredAssets = useMemo(() => {
    return (libraryIndex.assets || []).filter(asset => {
      const matchCat = selectedCategory === 'all' || asset.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        `${asset.manufacturer} ${asset.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

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

  // Count modified components
  const modifiedCount = Object.keys(componentOverrides).length;

  return (
    <div className="w-full h-full flex flex-col bg-[#0A0C10] text-slate-100 font-sans overflow-hidden select-none">
      {/* Top Banner: Authenticity Watermark (Rule 6 compliant) */}
      <div className="h-8 bg-[#11141C] border-b border-[#1E2533] px-4 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
          <span className="font-mono text-[#00F0FF] font-semibold tracking-wider text-[11px]">
            AUTOVERSE 3D STUDIO — 50 VEHICLE PARAMETRIC LIBRARY
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono text-[10px]">
            {activeModel?.displayName || 'Vehicle'} ({activeModel?.category || 'Sport'})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-400/90 font-mono text-[10px] tracking-wide bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
            APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY
          </span>
        </div>
      </div>

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* ========================================================= */}
        {/* LEFT PANEL: 50 Vehicle Library & Component Hierarchy Tree */}
        {/* ========================================================= */}
        <aside className="w-80 h-full bg-[#0D1017] border-r border-[#1E2533] flex flex-col shrink-0 z-10">
          {/* Library Header */}
          <div className="p-3 border-b border-[#1E2533] space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#00F0FF]" />
                50 Vehicle Fleet
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

            {/* Category Filter Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] scrollbar-none">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-2 py-0.5 rounded shrink-0 whitespace-nowrap transition-colors ${
                    selectedCategory === tab.id
                      ? 'bg-[#00F0FF] text-black font-semibold'
                      : 'bg-[#161C28] text-slate-400 hover:text-slate-200 border border-[#1E2533]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Dropdown / Selector List */}
          <div className="max-h-40 overflow-y-auto border-b border-[#1E2533] divide-y divide-[#161C28] shrink-0">
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

          {/* Component Hierarchy Tree Header */}
          <div className="p-3 border-b border-[#1E2533] bg-[#11141C] flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
              Components Tree
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {schema2Spec?.components.length || 0} items
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
                  {/* Group Title Bar */}
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

                  {/* Components in Group */}
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

                            {/* Visibility & Lock Controls */}
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

        {/* ========================================================= */}
        {/* CENTER VIEWPORT: Three.js Interactive 3D Canvas Viewport */}
        {/* ========================================================= */}
        <main className="flex-1 h-full relative flex flex-col overflow-hidden">
          {/* Top Camera & Stage Presets Bar */}
          <div className="h-10 bg-[#0D1017]/90 backdrop-blur-md border-b border-[#1E2533] px-3 flex items-center justify-between text-xs z-10 shrink-0">
            {/* Camera Presets */}
            <div className="flex items-center gap-1 overflow-x-auto">
              <Camera className="w-3.5 h-3.5 text-[#00F0FF] mr-1 shrink-0" />
              {CAMERA_PRESETS.map(preset => (
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
              ))}
            </div>

            {/* View Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleWireframe}
                className={`p-1.5 rounded border transition-colors ${
                  isWireframe
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]'
                    : 'bg-[#161C28] text-slate-400 border-[#1E2533] hover:text-slate-200'
                }`}
                title="Toggle Wireframe"
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

          {/* 3D Scene Viewport */}
          <div className="flex-1 w-full h-full relative bg-[#0A0C10]">
            <SceneCanvas />

            {/* Active Selection Pill in Viewport */}
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

        {/* ========================================================= */}
        {/* RIGHT PANEL: Component Inspector & Parametric Controls    */}
        {/* ========================================================= */}
        <aside className="w-88 md:w-96 h-full bg-[#0D1017] border-l border-[#1E2533] flex flex-col shrink-0 z-10 overflow-y-auto">
          {/* Header */}
          <div className="p-3 border-b border-[#1E2533] bg-[#11141C] flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" />
              Component Inspector
            </span>
            {selectedComponent && (
              <button
                onClick={() => resetComponentOverride(selectedComponent.id)}
                className="text-[10px] font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[#1E2533]"
                title="Reset this component to factory specs"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Inspector Body */}
          <div className="p-4 space-y-5 text-xs">
            {!selectedComponent ? (
              /* If No Component Selected: Show Vehicle Specs Summary */
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-[#11141C] border border-[#1E2533] space-y-2">
                  <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                    Vehicle Overview
                  </div>
                  <div className="text-slate-400 text-xs">
                    Select any component from the hierarchy tree on the left, or click directly on any 3D body part in the viewport to adjust transforms, dimensions, materials, finishes, and aerodynamic settings.
                  </div>
                </div>

                {schema2Spec && (
                  <div className="p-3 rounded-lg bg-[#11141C] border border-[#1E2533] space-y-2 text-slate-300">
                    <div className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider">
                      Factory Specifications
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>Length: <span className="text-white">{schema2Spec.dimensions.length}m</span></div>
                      <div>Width: <span className="text-white">{schema2Spec.dimensions.width}m</span></div>
                      <div>Height: <span className="text-white">{schema2Spec.dimensions.height}m</span></div>
                      <div>Wheelbase: <span className="text-white">{schema2Spec.dimensions.wheelbase}m</span></div>
                      <div>Front Track: <span className="text-white">{schema2Spec.dimensions.frontTrack}m</span></div>
                      <div>Rear Track: <span className="text-white">{schema2Spec.dimensions.rearTrack}m</span></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Component Selected: Full Parametric Control Form */
              <div className="space-y-4">
                {/* Component Info Card */}
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

                {/* 1. Transform: Position Controls */}
                <div className="space-y-2 p-3 rounded bg-[#11141C]/60 border border-[#1E2533]">
                  <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Position (meters)</span>
                    <span className="text-[10px] font-mono text-slate-400">X / Y / Z</span>
                  </div>

                  {/* X Position */}
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
                        });
                      }}
                      className="w-full accent-[#00F0FF] cursor-pointer"
                    />
                  </div>

                  {/* Y Position */}
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
                        });
                      }}
                      className="w-full accent-[#00F0FF] cursor-pointer"
                    />
                  </div>

                  {/* Z Position */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Z (Longitudinal):</span>
                      <span className="font-mono text-slate-200">
                        {((activeOverride?.position?.[2] ?? selectedComponent.transform.position[2])).toFixed(3)}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-3.0}
                      max={3.0}
                      step={0.01}
                      value={activeOverride?.position?.[2] ?? selectedComponent.transform.position[2]}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        const cur = activeOverride?.position ?? selectedComponent.transform.position;
                        updateComponentOverride(selectedComponent.id, {
                          position: [cur[0], cur[1], val]
                        });
                      }}
                      className="w-full accent-[#00F0FF] cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. Transform: Rotation Controls */}
                <div className="space-y-2 p-3 rounded bg-[#11141C]/60 border border-[#1E2533]">
                  <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Rotation (Pitch / Yaw / Roll)</span>
                  </div>

                  {/* Rotation X */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Pitch (X):</span>
                      <span className="font-mono text-slate-200">
                        {Math.round(((activeOverride?.rotation?.[0] ?? selectedComponent.transform.rotation[0]) * 180) / Math.PI)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-45}
                      max={45}
                      step={1}
                      value={Math.round(((activeOverride?.rotation?.[0] ?? selectedComponent.transform.rotation[0]) * 180) / Math.PI)}
                      onChange={e => {
                        const deg = parseFloat(e.target.value);
                        const rad = (deg * Math.PI) / 180;
                        const cur = activeOverride?.rotation ?? selectedComponent.transform.rotation;
                        updateComponentOverride(selectedComponent.id, {
                          rotation: [rad, cur[1], cur[2]]
                        });
                      }}
                      className="w-full accent-[#00F0FF] cursor-pointer"
                    />
                  </div>

                  {/* Rotation Y */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Yaw (Y):</span>
                      <span className="font-mono text-slate-200">
                        {Math.round(((activeOverride?.rotation?.[1] ?? selectedComponent.transform.rotation[1]) * 180) / Math.PI)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-45}
                      max={45}
                      step={1}
                      value={Math.round(((activeOverride?.rotation?.[1] ?? selectedComponent.transform.rotation[1]) * 180) / Math.PI)}
                      onChange={e => {
                        const deg = parseFloat(e.target.value);
                        const rad = (deg * Math.PI) / 180;
                        const cur = activeOverride?.rotation ?? selectedComponent.transform.rotation;
                        updateComponentOverride(selectedComponent.id, {
                          rotation: [cur[0], rad, cur[2]]
                        });
                      }}
                      className="w-full accent-[#00F0FF] cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. Transform: Scale Controls */}
                <div className="space-y-2 p-3 rounded bg-[#11141C]/60 border border-[#1E2533]">
                  <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Uniform Scale</span>
                    <span className="font-mono text-[#00F0FF]">
                      {(activeOverride?.scale?.[0] ?? selectedComponent.transform.scale[0]).toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={1.8}
                    step={0.02}
                    value={activeOverride?.scale?.[0] ?? selectedComponent.transform.scale[0]}
                    onChange={e => {
                      const s = parseFloat(e.target.value);
                      updateComponentOverride(selectedComponent.id, {
                        scale: [s, s, s]
                      });
                    }}
                    className="w-full accent-[#00F0FF] cursor-pointer"
                  />
                </div>

                {/* 4. Material & Finish Selector */}
                <div className="space-y-2 p-3 rounded bg-[#11141C]/60 border border-[#1E2533]">
                  <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#00F0FF]" />
                    Material & Finish
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {FINISH_OPTIONS.map(opt => {
                      const isCurrent = activeOverride?.materialFinish === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => updateComponentOverride(selectedComponent.id, { materialFinish: opt.id })}
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

                  {/* Component Custom Color Picker */}
                  <div className="space-y-1.5 pt-2">
                    <div className="text-slate-400 text-[11px]">Color Palette:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_COLORS.map(color => (
                        <button
                          key={color.hex}
                          onClick={() => updateComponentOverride(selectedComponent.id, { customColorHex: color.hex })}
                          style={{ backgroundColor: color.hex }}
                          className="w-5 h-5 rounded-full border border-black/40 hover:scale-110 transition-transform"
                          title={color.name}
                        />
                      ))}
                      <input
                        type="color"
                        value={activeOverride?.customColorHex || '#00F0FF'}
                        onChange={e => updateComponentOverride(selectedComponent.id, { customColorHex: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        title="Custom Color"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Context-Specific Customizer Options */}
                {(selectedComponent.group === 'wheels' || selectedComponent.id.includes('wheel')) && (
                  <div className="space-y-2 p-3 rounded bg-[#11141C]/60 border border-[#00F0FF]/30">
                    <div className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                      <Disc className="w-3.5 h-3.5 text-[#00F0FF]" />
                      Wheel Stance & Alignment
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Camber Angle:</span>
                        <span className="font-mono text-slate-200">
                          {activeOverride?.contextSettings?.camberDeg ?? -3.5}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-7.0}
                        max={1.0}
                        step={0.2}
                        value={activeOverride?.contextSettings?.camberDeg ?? -3.5}
                        onChange={e => {
                          const camberDeg = parseFloat(e.target.value);
                          updateComponentOverride(selectedComponent.id, {
                            contextSettings: {
                              ...activeOverride?.contextSettings,
                              camberDeg
                            }
                          });
                        }}
                        className="w-full accent-[#00F0FF] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {(selectedComponent.id.includes('wing') || selectedComponent.id.includes('spoiler')) && (
                  <div className="space-y-2 p-3 rounded bg-[#11141C]/60 border border-[#00F0FF]/30">
                    <div className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-[#00F0FF]" />
                      Aerodynamic Wing Trims
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Angle of Attack (AoA):</span>
                        <span className="font-mono text-slate-200">
                          {activeOverride?.contextSettings?.aoaDeg ?? 12}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-5}
                        max={25}
                        step={1}
                        value={activeOverride?.contextSettings?.aoaDeg ?? 12}
                        onChange={e => {
                          const aoaDeg = parseFloat(e.target.value);
                          updateComponentOverride(selectedComponent.id, {
                            contextSettings: {
                              ...activeOverride?.contextSettings,
                              aoaDeg
                            }
                          });
                        }}
                        className="w-full accent-[#00F0FF] cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM ACTION BAR: Undo/Redo, Summary & Export Center     */}
      {/* ========================================================= */}
      <footer className="h-12 bg-[#0D1017] border-t border-[#1E2533] px-4 flex items-center justify-between text-xs shrink-0 z-20">
        {/* Left: Active Vehicle Summary */}
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-300 disabled:opacity-30 disabled:pointer-events-none border border-[#1E2533]"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-300 disabled:opacity-30 disabled:pointer-events-none border border-[#1E2533]"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          {/* Reset All Changes */}
          <button
            onClick={resetAllComponentOverrides}
            className="px-2.5 py-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-300 border border-[#1E2533] flex items-center gap-1.5"
            title="Reset All Component Customizations"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          {/* Save Configuration */}
          <button
            onClick={handleSaveConfig}
            className="px-3 py-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-200 border border-[#1E2533] flex items-center gap-1.5 font-medium"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5 text-slate-300" />}
            <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-200 border border-[#1E2533] flex items-center gap-1.5 font-medium"
            title="Export Schema 2.0 Vehicle JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Export JSON</span>
          </button>

          {/* Export GLB 3D Model */}
          <button
            onClick={handleExportGlb}
            disabled={isExportingGlb}
            className="px-3.5 py-1.5 rounded bg-[#00F0FF] hover:bg-[#00D4E0] text-black font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Export binary GLB 3D model for Blender, Unreal Engine, or WebGL"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>{isExportingGlb ? 'Exporting...' : 'Export GLB'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CustomizationPanel;
