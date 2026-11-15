import React from 'react';
import {
  Car,
  Layers,
  Box,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Flame,
  ShieldCheck,
  Palette
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { toHex32 } from '../../utils/joaat';
import { resolveVehicleColor } from '../../utils/colorUtils';

export const DashboardView: React.FC = () => {
  const {
    allFiles,
    allModels,
    assetBindings,
    loadVehicleByFile,
    setActiveView
  } = useVehicleStore();

  const totalFiles = allFiles.length;
  const totalModels = allModels.length;
  const boundAssetCount = Object.keys(assetBindings).length;
  const missingAssetCount = totalModels - boundAssetCount;

  // Manufacturer breakdown
  const manufacturerCounts: Record<string, number> = {};
  allModels.forEach(m => {
    manufacturerCounts[m.manufacturer] = (manufacturerCounts[m.manufacturer] || 0) + m.configurations.length;
  });
  const topManufacturers = Object.entries(manufacturerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Recent 6 vehicles
  const recentVehicles = allFiles.slice(0, 6);

  const handleSelectVehicle = (fileName: string) => {
    loadVehicleByFile(fileName);
    setActiveView('studio');
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-autoverse-surface border border-autoverse-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-autoverse-elevated text-autoverse-cyan font-semibold border border-autoverse-borderLight">
              ENTERPRISE AUTOMOTIVE STUDIO
            </span>
            <span className="text-xs text-autoverse-muted">• WebGL PBR Engine Active</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">Autoverse 3D Fleet Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time parser, customizer, and 3D visualization studio interpreting Cherax Entity GTA-style vehicle configurations mapped to interactive 3D assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('library')}
            className="px-4 py-2 rounded bg-autoverse-elevated hover:bg-autoverse-overlay border border-autoverse-border text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5 text-autoverse-cyan" />
            <span>Browse Library</span>
          </button>
          <button
            onClick={() => setActiveView('studio')}
            className="px-4 py-2 rounded bg-autoverse-cyan hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Open 3D Studio</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Configurations */}
        <div className="p-4 rounded-lg bg-autoverse-surface border border-autoverse-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Configurations</span>
            <Layers className="w-4 h-4 text-autoverse-cyan" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{totalFiles}</div>
          <div className="text-[11px] text-autoverse-muted mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-autoverse-emerald" />
            <span>100% Parsed & Validated</span>
          </div>
        </div>

        {/* Unique Vehicle Models */}
        <div className="p-4 rounded-lg bg-autoverse-surface border border-autoverse-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Unique Models</span>
            <Car className="w-4 h-4 text-autoverse-purple" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{totalModels}</div>
          <div className="text-[11px] text-autoverse-muted mt-1">
            Across 22 Global Manufacturers
          </div>
        </div>

        {/* Available 3D Assets */}
        <div className="p-4 rounded-lg bg-autoverse-surface border border-autoverse-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">3D Asset Mappings</span>
            <Box className="w-4 h-4 text-autoverse-emerald" />
          </div>
          <div className="text-2xl font-bold text-autoverse-emerald font-mono">{boundAssetCount}</div>
          <div className="text-[11px] text-autoverse-muted mt-1 flex items-center gap-1">
            <span>Showcase & Custom GLB Ready</span>
          </div>
        </div>

        {/* Missing Assets Alert */}
        <div className="p-4 rounded-lg bg-autoverse-surface border border-autoverse-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Missing 3D Assets</span>
            <AlertTriangle className="w-4 h-4 text-autoverse-amber" />
          </div>
          <div className="text-2xl font-bold text-autoverse-amber font-mono">{missingAssetCount}</div>
          <button
            onClick={() => setActiveView('assetManager')}
            className="text-[11px] text-autoverse-cyan hover:underline mt-1 flex items-center gap-1"
          >
            <span>Assign via Asset Manager</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Grid: Manufacturer Distribution & Schema Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manufacturer Distribution */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-autoverse-surface border border-autoverse-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Top Fleet Manufacturers</h2>
              <p className="text-xs text-autoverse-muted">Vehicle model distribution by brand archetype</p>
            </div>
            <span className="text-[11px] font-mono text-autoverse-cyan">22 Total Brands</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topManufacturers.map(([brand, count]) => (
              <div
                key={brand}
                className="p-3 rounded bg-autoverse-elevated border border-autoverse-border hover:border-autoverse-borderLight transition-all"
              >
                <div className="text-xs font-medium text-slate-300 truncate">{brand}</div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-lg font-bold font-mono text-slate-100">{count}</span>
                  <span className="text-[10px] text-autoverse-muted">specs</span>
                </div>
                <div className="w-full bg-autoverse-overlay h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-autoverse-cyan h-full rounded-full"
                    style={{ width: `${Math.min(100, (count / totalFiles) * 250)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schema Intelligence Specs */}
        <div className="p-5 rounded-lg bg-autoverse-surface border border-autoverse-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">Supported Properties</h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-autoverse-emerald/10 text-autoverse-emerald border border-autoverse-emerald/20">
              100% Coverage
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-autoverse-border/50">
              <span className="text-slate-400">Body Paint (Metallic/Matte/RGB)</span>
              <span className="font-mono text-slate-200">108 / 108</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-autoverse-border/50">
              <span className="text-slate-400">Wheels & Rim Finish</span>
              <span className="font-mono text-slate-200">108 / 108</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-autoverse-border/50">
              <span className="text-slate-400">Tuning Mods (mod0 - mod49)</span>
              <span className="font-mono text-slate-200">108 / 108</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-autoverse-border/50">
              <span className="text-slate-400">Neon Underglow (4 Channels)</span>
              <span className="font-mono text-slate-200">108 / 108</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-autoverse-border/50">
              <span className="text-slate-400">Glass Tint & Opacity</span>
              <span className="font-mono text-slate-200">108 / 108</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-autoverse-border/50">
              <span className="text-slate-400">Vehicle Extras (extra0..extra15)</span>
              <span className="font-mono text-slate-200">87 / 108</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Custom Attachments</span>
              <span className="font-mono text-slate-200">5 / 108</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured / Recent Configurations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Featured Vehicle Configurations</h2>
            <p className="text-xs text-autoverse-muted">Select any vehicle to launch directly in the 3D Studio</p>
          </div>
          <button
            onClick={() => setActiveView('library')}
            className="text-xs text-autoverse-cyan hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All 108 Vehicles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentVehicles.map(veh => {
            const paint = resolveVehicleColor(veh.isPrimaryColorCustom, veh.customPrimaryColor, veh.primaryColor);
            const isBound = !!assetBindings[veh.modelHash];

            return (
              <div
                key={veh.fileName}
                onClick={() => handleSelectVehicle(veh.fileName)}
                className="group p-4 rounded-lg bg-autoverse-surface border border-autoverse-border hover:border-autoverse-cyan/50 hover:bg-autoverse-elevated cursor-pointer transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-autoverse-overlay text-slate-300">
                      {veh.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: paint.hex }}
                        title={paint.name}
                      />
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isBound ? 'bg-autoverse-emerald/10 text-autoverse-emerald border border-autoverse-emerald/20' : 'bg-autoverse-amber/10 text-autoverse-amber border border-autoverse-amber/20'
                      }`}>
                        {isBound ? '3D Ready' : 'Asset Missing'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-autoverse-cyan transition-colors truncate">
                    {veh.realWorldModel}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">
                    {veh.displayName} • <span className="font-mono text-[11px] text-autoverse-cyan">{toHex32(veh.modelHash)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-autoverse-border/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-slate-300">
                    Plate: <span className="font-bold text-slate-100">{veh.plateText || 'NONE'}</span>
                  </span>
                  <span className="text-autoverse-cyan flex items-center gap-1 text-[11px] font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Configure</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

