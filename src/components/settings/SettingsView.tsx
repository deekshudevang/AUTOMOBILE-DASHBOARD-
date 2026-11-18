import React from 'react';
import {
  Cpu,
  Zap
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

export const SettingsView: React.FC = () => {
  const {
    graphicsQuality,
    setGraphicsQuality,
    showShadows,
    showGrid,
    toggleGrid,
    environmentPreset,
    setEnvironmentPreset
  } = useVehicleStore();

  return (
    <div className="h-full flex flex-col p-6 space-y-6 bg-autoverse-bg overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-autoverse-surface border border-autoverse-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-autoverse-elevated text-autoverse-cyan font-bold border border-autoverse-borderLight">
              GRAPHICS & HARDWARE PIPELINE
            </span>
            <span className="text-xs text-autoverse-muted">• WebGL 2.0 / Three.js</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">Performance & Studio Settings</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Configure PBR shader quality, shadows, tone mapping, and rendering parameters optimized for your GPU.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Render Quality Presets */}
        <div className="p-5 rounded-lg bg-autoverse-surface border border-autoverse-border space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <Zap className="w-4 h-4 text-autoverse-cyan" />
            <span>Graphics Quality Profile</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['low', 'medium', 'high', 'ultra'] as const).map(q => (
              <button
                key={q}
                onClick={() => setGraphicsQuality(q)}
                className={`p-3 rounded-lg border text-left capitalize transition-all ${
                  graphicsQuality === q
                    ? 'bg-autoverse-elevated border-autoverse-cyan text-autoverse-cyan font-bold'
                    : 'bg-autoverse-elevated/40 border-autoverse-border text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="text-xs font-semibold">{q}</div>
                <div className="text-[10px] text-autoverse-muted mt-0.5">
                  {q === 'low' && 'DPR 1.0, Soft Shadows Off'}
                  {q === 'medium' && 'DPR 1.25, 1024 Shadow Map'}
                  {q === 'high' && 'DPR 1.5, 2048 Shadow Map, PBR Clearcoat'}
                  {q === 'ultra' && 'DPR 2.0 Native, 4096 Shadow Map, Full ACES'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* GPU & Hardware Target Profile */}
        <div className="p-5 rounded-lg bg-autoverse-surface border border-autoverse-border space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <Cpu className="w-4 h-4 text-autoverse-cyan" />
            <span>Target Hardware Specification</span>
          </div>

          <div className="p-4 rounded-lg bg-autoverse-elevated border border-autoverse-border space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Target OS:</span>
              <span className="text-slate-200">Windows 11 (64-bit)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Target GPU:</span>
              <span className="text-autoverse-cyan font-bold">NVIDIA GeForce RTX 4060 (8GB VRAM)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Framerate Target:</span>
              <span className="text-autoverse-emerald font-bold">60.0 FPS Steady</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Color Space:</span>
              <span className="text-slate-200">ACES Filmic / Linear sRGB</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shader Model:</span>
              <span className="text-slate-200">PBR Roughness-Metalness + Clearcoat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

