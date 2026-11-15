import React, { useState } from 'react';
import {
  X,
  Sliders,
  Check,
  AlertTriangle,
  Info,
  Lock,
  Eye,
  Camera,
  Layers,
  Sparkles,
  Download,
  RotateCcw
} from 'lucide-react';
import { tokens } from '../../theme/tokens';

interface ComponentGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComponentGalleryModal: React.FC<ComponentGalleryModalProps> = ({ isOpen, onClose }) => {
  const [sliderValue, setSliderValue] = useState(12);
  const [toggleActive, setToggleActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'buttons' | 'sliders' | 'badges' | 'colors'>('buttons');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-4xl max-h-[85vh] bg-[#0D1017] border border-[#1E2533] rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Gallery Header */}
        <div className="h-12 px-5 bg-[#11141C] border-b border-[#1E2533] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
              AutoVerse 3D — Automotive Design System Gallery
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1E2533] transition-colors"
            title="Close Gallery"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="h-10 px-5 bg-[#0D1017] border-b border-[#1E2533] flex items-center gap-2 shrink-0 text-xs">
          {(['buttons', 'sliders', 'badges', 'colors'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#00F0FF] text-black font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161C28]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Gallery Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {activeTab === 'buttons' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Primary Action Buttons
                </h3>
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="px-3 py-1.5 rounded bg-[#00F0FF] hover:bg-[#00D4E0] text-black font-semibold flex items-center gap-1.5 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    <span>Primary Active</span>
                  </button>
                  <button disabled className="px-3 py-1.5 rounded bg-[#00F0FF]/30 text-black/50 font-semibold cursor-not-allowed flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Primary Disabled</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Secondary Surface Buttons
                </h3>
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="px-3 py-1.5 rounded bg-[#161C28] hover:bg-[#1E2533] text-slate-200 border border-[#1E2533] flex items-center gap-1.5 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Surface Secondary</span>
                  </button>
                  <button disabled className="px-3 py-1.5 rounded bg-[#161C28] text-slate-600 border border-[#1E2533]/50 cursor-not-allowed flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Secondary Disabled</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Touch-Compliant Icon Actions (Min 44x44px Target)
                </h3>
                <div className="flex gap-2 items-center">
                  <button className="w-11 h-11 rounded bg-[#161C28] hover:bg-[#1E2533] border border-[#1E2533] flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="Layers">
                    <Layers className="w-4 h-4" />
                  </button>
                  <button className="w-11 h-11 rounded bg-[#161C28] hover:bg-[#1E2533] border border-[#1E2533] flex items-center justify-center text-[#00F0FF] transition-colors" title="Lock">
                    <Lock className="w-4 h-4" />
                  </button>
                  <button className="w-11 h-11 rounded bg-[#161C28] hover:bg-[#1E2533] border border-[#1E2533] flex items-center justify-center text-slate-300 transition-colors" title="Eye">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sliders' && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Engineering Sliders with Tabular Numerals
              </h3>
              <div className="p-3 rounded bg-[#11141C] border border-[#1E2533] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Wing Angle of Attack (AoA):</span>
                  <span className="font-mono text-[#00F0FF] font-semibold">{sliderValue.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min={-5}
                  max={25}
                  step={0.5}
                  value={sliderValue}
                  onChange={e => setSliderValue(parseFloat(e.target.value))}
                  className="w-full accent-[#00F0FF] cursor-pointer"
                />
              </div>

              <div className="p-3 rounded bg-[#11141C] border border-[#1E2533] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Wheel Camber Angle:</span>
                  <span className="font-mono text-slate-200 font-semibold">-3.50°</span>
                </div>
                <input
                  type="range"
                  min={-7}
                  max={1}
                  step={0.1}
                  defaultValue={-3.5}
                  disabled
                  className="w-full accent-[#00F0FF] opacity-40 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 font-mono">Locked parameter</span>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Provenance & Status Badges
              </h3>
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-800/50 font-mono text-[10px]">
                  APPROXIMATE PROCEDURAL VEHICLE
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 font-mono text-[10px]">
                  VERIFIED OEM DATA
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-[#00F0FF] border border-cyan-800/50 font-mono text-[10px]">
                  SCHEMA 2.0 ASSET
                </span>
                <span className="px-2 py-0.5 rounded bg-[#161C28] text-slate-400 border border-[#1E2533] font-mono text-[10px]">
                  DERIVED BOUNDS
                </span>
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Theme Neutral Surfaces & High-Contrast Ramp
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono">
                <div className="p-3 rounded border border-[#1E2533] bg-[#0A0C10]">
                  <div className="text-slate-400">Canvas Base</div>
                  <div className="text-slate-200">#0A0C10</div>
                </div>
                <div className="p-3 rounded border border-[#1E2533] bg-[#11141C]">
                  <div className="text-slate-400">Surface 1</div>
                  <div className="text-slate-200">#11141C</div>
                </div>
                <div className="p-3 rounded border border-[#1E2533] bg-[#161C28]">
                  <div className="text-slate-400">Surface 2</div>
                  <div className="text-slate-200">#161C28</div>
                </div>
                <div className="p-3 rounded border border-[#1E2533] bg-[#1E2533]">
                  <div className="text-slate-400">Surface 3</div>
                  <div className="text-slate-200">#1E2533</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
