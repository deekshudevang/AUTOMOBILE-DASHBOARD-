import React, { useState } from 'react';
import {
  Palette,
  Check
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

interface MaterialPreset {
  id: string;
  name: string;
  category: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
}

const MATERIAL_PRESETS: MaterialPreset[] = [
  {
    id: 'mat_gt_silver',
    name: 'GT Silver Metallic',
    category: 'Metallic Paint',
    roughness: 0.18,
    metalness: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  },
  {
    id: 'mat_guards_red',
    name: 'Guards Red Gloss',
    category: 'Solid Gloss',
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03
  },
  {
    id: 'mat_shark_blue',
    name: 'Shark Blue Gloss',
    category: 'Solid Gloss',
    roughness: 0.14,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04
  },
  {
    id: 'mat_carbon_twill',
    name: 'Exposed 2x2 Twill Carbon Fiber',
    category: 'Composite',
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08
  },
  {
    id: 'mat_satin_black',
    name: 'Satin Stealth Black',
    category: 'Satin Wrap',
    roughness: 0.45,
    metalness: 0.35,
    clearcoat: 0.1,
    clearcoatRoughness: 0.4
  },
  {
    id: 'mat_anodized_gold',
    name: 'Neodyme Magnesium Gold',
    category: 'Forged Metal',
    roughness: 0.22,
    metalness: 0.95,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0
  }
];

export const MaterialStudioView: React.FC = () => {
  const { engineeringMode, setCustomPrimaryColor } = useVehicleStore();

  const [activePreset, setActivePreset] = useState<MaterialPreset>(MATERIAL_PRESETS[0]);
  const [roughness, setRoughness] = useState<number>(0.18);
  const [metalness, setMetalness] = useState<number>(0.85);
  const [clearcoat, setClearcoat] = useState<number>(1.0);
  const [clearcoatRoughness, setClearcoatRoughness] = useState<number>(0.05);

  const applyPreset = (preset: MaterialPreset) => {
    setActivePreset(preset);
    setRoughness(preset.roughness);
    setMetalness(preset.metalness);
    setClearcoat(preset.clearcoat);
    setClearcoatRoughness(preset.clearcoatRoughness);
  };

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Material & Finish Studio</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              AUTOMOTIVE PBR
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Physically-Based Rendering (PBR) multi-layer automotive coatings: basecoat, metallic flake, clearcoat, and carbon weave.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Presets Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-autoverse-muted">
              PBR Finish Presets
            </h2>

            <div className="space-y-2">
              {MATERIAL_PRESETS.map(preset => {
                const isSelected = activePreset.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`p-3 rounded cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-autoverse-elevated border-autoverse-cyan shadow-sm'
                        : 'bg-autoverse-surface border-autoverse-border hover:border-autoverse-borderLight'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-100">{preset.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-autoverse-cyan" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{preset.category}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PBR Parameter Sliders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-5">
            <h2 className="text-sm font-bold text-slate-100 border-b border-autoverse-border pb-3">
              Multi-Layer PBR Parameter Tuning
            </h2>

            {/* Roughness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Surface Microfacet Roughness</span>
                <span className="font-mono text-autoverse-cyan font-bold">{roughness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value={roughness}
                onChange={e => setRoughness(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.00 (Mirror Polish)</span>
                <span>0.50 (Satin Sheen)</span>
                <span>1.00 (Chalk Matte)</span>
              </div>
            </div>

            {/* Metalness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Metallic Conductor Weight</span>
                <span className="font-mono text-autoverse-cyan font-bold">{metalness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value={metalness}
                onChange={e => setMetalness(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.00 (Dielectric / Enamel)</span>
                <span>1.00 (Pure Conductive Metal)</span>
              </div>
            </div>

            {/* Clearcoat */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Clearcoat Polyurethane Layer Intensity</span>
                <span className="font-mono text-autoverse-cyan font-bold">{clearcoat.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value={clearcoat}
                onChange={e => setClearcoat(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.00 (Raw Surface)</span>
                <span>1.00 (High-Depth Automotive Clearcoat)</span>
              </div>
            </div>

            {/* Clearcoat Roughness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Clearcoat Top-Coat Roughness</span>
                <span className="font-mono text-autoverse-cyan font-bold">{clearcoatRoughness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value={clearcoatRoughness}
                onChange={e => setClearcoatRoughness(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Student Explanation */}
            {engineeringMode === 'student' && (
              <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-[11px] text-slate-300 space-y-1 mt-4">
                <p className="font-semibold text-autoverse-cyan">🎓 PBR Shader Mechanics</p>
                <p className="leading-relaxed">
                  Automotive paint utilizes a two-layer Cook-Torrance BRDF: a base metallic/dielectric pigmented layer, coated with an uncolored clearcoat specular layer with a refractive index (n &asymp; 1.5) reflecting light according to Fresnel’s law.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
