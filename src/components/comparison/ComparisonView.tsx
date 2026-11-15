import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Camera,
  Layers,
  Check,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { useComparisonStore } from '../../hooks/useComparisonStore';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { SceneCanvas } from '../3d/SceneCanvas';
import { CameraPreset } from '../../types/vehicle';
import { parseVehicleJson } from '../../utils/jsonParser';
import { toHex32 } from '../../utils/joaat';
import { resolveVehicleColor } from '../../utils/colorUtils';
import { WHEEL_TYPES, WINDOW_TINT_OPTIONS } from '../../data/wheelCatalog';

export const ComparisonView: React.FC = () => {
  const { allFiles, allModels, assetBindings } = useVehicleStore();
  const {
    vehicleFiles,
    viewportCount,
    setViewportCount,
    syncCameras,
    toggleSyncCameras,
    activePreset,
    setCameraPreset,
    setSlotVehicle
  } = useComparisonStore();

  const [loadedConfigs, setLoadedConfigs] = useState<Record<string, any>>({});

  // Fetch configs for all selected comparison vehicles
  useEffect(() => {
    vehicleFiles.slice(0, viewportCount).forEach(fileName => {
      if (!loadedConfigs[fileName]) {
        fetch(`/vehicles/${encodeURIComponent(fileName)}`)
          .then(r => r.json())
          .then(data => {
            setLoadedConfigs(prev => ({ ...prev, [fileName]: data }));
          })
          .catch(() => {});
      }
    });
  }, [vehicleFiles, viewportCount]);

  const activeVehicles = vehicleFiles.slice(0, viewportCount);

  return (
    <div className="h-full flex flex-col bg-autoverse-bg overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-autoverse-border bg-autoverse-surface flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-autoverse-elevated border border-autoverse-border text-autoverse-cyan">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Multi-Vehicle Comparison Studio</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-autoverse-elevated text-autoverse-cyan border border-autoverse-border">
                {viewportCount} Viewports
              </span>
            </h1>
            <p className="text-[11px] text-autoverse-muted">Synchronized 3D Studio Comparison</p>
          </div>
        </div>

        {/* Viewport Selectors & Controls */}
        <div className="flex items-center gap-3 text-xs">
          {/* Viewport Count Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-autoverse-elevated border border-autoverse-border">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setViewportCount(n as any)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  viewportCount === n ? 'bg-autoverse-cyan text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {n} Cars
              </button>
            ))}
          </div>

          {/* Camera Sync Toggle */}
          <button
            onClick={toggleSyncCameras}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              syncCameras
                ? 'bg-autoverse-elevated border-autoverse-cyan text-autoverse-cyan font-bold'
                : 'bg-autoverse-elevated border-autoverse-border text-slate-400'
            }`}
          >
            {syncCameras ? '● Synchronized Cameras' : '○ Independent Cameras'}
          </button>

          {/* Camera Angles */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-autoverse-elevated border border-autoverse-border">
            {(['isometric', 'front', 'rear', 'left', 'top'] as CameraPreset[]).map(p => (
              <button
                key={p}
                onClick={() => setCameraPreset(p)}
                className={`px-2 py-1 rounded text-[11px] font-medium capitalize transition-all ${
                  activePreset === p ? 'bg-autoverse-cyan text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Viewports Grid */}
      <div className={`flex-1 p-4 grid gap-4 overflow-hidden ${
        viewportCount === 2 ? 'grid-cols-1 md:grid-cols-2' : viewportCount === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 grid-rows-2'
      }`}>
        {activeVehicles.map((fileName, idx) => {
          const cfg = loadedConfigs[fileName];
          const fileInfo = allFiles.find(f => f.fileName === fileName);
          const modelMeta = fileInfo ? allModels.find(m => m.hash === fileInfo.modelHash) : null;
          const paint = cfg ? resolveVehicleColor(cfg.isPrimaryColorCustom, cfg.customPrimaryColor, cfg.primaryColor) : null;

          return (
            <div
              key={`${fileName}-${idx}`}
              className="relative rounded-lg border border-autoverse-border bg-[#0A0C10] overflow-hidden flex flex-col shadow-lg"
            >
              {/* Header inside viewport */}
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
                <select
                  value={fileName}
                  onChange={e => setSlotVehicle(idx, e.target.value)}
                  className="px-2.5 py-1 rounded bg-autoverse-surface/90 backdrop-blur-md border border-autoverse-border text-xs text-slate-200 font-semibold outline-none cursor-pointer max-w-[240px] truncate"
                >
                  {allFiles.map(f => (
                    <option key={f.fileName} value={f.fileName} className="bg-autoverse-surface text-slate-200">
                      {f.realWorldModel} ({f.fileName})
                    </option>
                  ))}
                </select>

                {paint && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-autoverse-surface/90 backdrop-blur-md border border-autoverse-border text-[11px]">
                    <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: paint.hex }} />
                    <span className="text-slate-200 font-mono font-bold truncate max-w-[80px]">{paint.name}</span>
                  </div>
                )}
              </div>

              {/* 3D Canvas */}
              <div className="flex-1 relative">
                {cfg ? (
                  <SceneCanvas
                    customConfig={cfg}
                    customModelMeta={modelMeta}
                    enableControls={!syncCameras}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    Loading specification...
                  </div>
                )}
              </div>

              {/* Mini Footer Specs */}
              <div className="p-2 border-t border-autoverse-border bg-autoverse-surface flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-autoverse-cyan">{modelMeta ? toHex32(modelMeta.hash) : '0x00'}</span>
                <span>Plate: <strong className="text-slate-200 font-mono">{cfg?.plateText || 'NONE'}</strong></span>
                <span>Wheel Type: {WHEEL_TYPES.find(w => w.id === cfg?.wheelType)?.name || 'Sport'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Side-by-Side Property Comparison Matrix */}
      <div className="h-44 border-t border-autoverse-border bg-autoverse-surface overflow-y-auto p-4 shrink-0">
        <h3 className="text-xs font-bold text-slate-200 mb-2 uppercase tracking-wide">
          Specification Comparison Matrix
        </h3>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-autoverse-border text-slate-400">
              <th className="py-1 px-3">Vehicle Spec</th>
              {activeVehicles.map((fn, i) => (
                <th key={i} className="py-1 px-3 font-mono text-autoverse-cyan">
                  Car #{i + 1} ({fn})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-autoverse-border/50 text-[11px]">
            <tr>
              <td className="py-1 px-3 font-medium text-slate-400">Vehicle Model</td>
              {activeVehicles.map((fn, i) => {
                const f = allFiles.find(x => x.fileName === fn);
                return <td key={i} className="py-1 px-3 font-semibold text-slate-200">{f?.realWorldModel}</td>;
              })}
            </tr>
            <tr>
              <td className="py-1 px-3 font-medium text-slate-400">Primary Paint</td>
              {activeVehicles.map((fn, i) => {
                const cfg = loadedConfigs[fn];
                if (!cfg) return <td key={i} className="py-1 px-3">-</td>;
                const p = resolveVehicleColor(cfg.isPrimaryColorCustom, cfg.customPrimaryColor, cfg.primaryColor);
                return (
                  <td key={i} className="py-1 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.hex }} />
                      <span className="font-mono">{p.hex}</span>
                    </div>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-1 px-3 font-medium text-slate-400">Wheel Category</td>
              {activeVehicles.map((fn, i) => {
                const cfg = loadedConfigs[fn];
                const w = WHEEL_TYPES.find(wt => wt.id === cfg?.wheelType);
                return <td key={i} className="py-1 px-3">{w?.name || 'Sport'}</td>;
              })}
            </tr>
            <tr>
              <td className="py-1 px-3 font-medium text-slate-400">Window Privacy Tint</td>
              {activeVehicles.map((fn, i) => {
                const cfg = loadedConfigs[fn];
                const t = WINDOW_TINT_OPTIONS.find(wt => wt.id === cfg?.windowTint);
                return <td key={i} className="py-1 px-3">{t?.name || 'None'}</td>;
              })}
            </tr>
            <tr>
              <td className="py-1 px-3 font-medium text-slate-400">License Plate</td>
              {activeVehicles.map((fn, i) => {
                const cfg = loadedConfigs[fn];
                return <td key={i} className="py-1 px-3 font-mono font-bold text-autoverse-cyan">{cfg?.plateText || 'NONE'}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

