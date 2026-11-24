import React, { useState } from 'react';
import { Layers, Check, Sparkles, Shield, Disc } from 'lucide-react';
import { useVehicleStore } from '../../../hooks/useVehicleStore';
import { playToggleClick } from '../../../utils/audioFeedback';

const CABIN_MATERIALS = [
  {
    id: 'alcantara',
    name: 'Motorsport Alcantara',
    desc: 'Lightweight high-grip synthetic suede with laser perforation',
    weightDeltaKg: -4.2
  },
  {
    id: 'nappa',
    name: 'Semi-Aniline Nappa Leather',
    desc: 'Bespoke hand-crafted Italian leather with contrast piping',
    weightDeltaKg: 0.0
  },
  {
    id: 'carbon_bucket',
    name: 'Exposed Carbon Fiber Bucket',
    desc: 'Ultra-rigid FIA homologated carbon-aramid shell',
    weightDeltaKg: -11.8
  },
  {
    id: 'clubsport',
    name: 'Clubsport FIA Monocoque & Cage',
    desc: 'Full titanium roll-cage with 6-point Schroth harness',
    weightDeltaKg: +8.5
  }
];

const STITCHING_COLORS = [
  { id: 'guards_red', name: 'Guards Red', hex: '#DC2626' },
  { id: 'racing_yellow', name: 'Racing Yellow', hex: '#FACC15' },
  { id: 'acid_green', name: 'Acid Green', hex: '#84CC16' },
  { id: 'papaya', name: 'Papaya Orange', hex: '#F97316' },
  { id: 'arctic_silver', name: 'Arctic Silver', hex: '#E2E8F0' },
  { id: 'riviera_blue', name: 'Riviera Blue', hex: '#38BDF8' }
];

const INTERIOR_TRIMS = [
  {
    id: 'matte_carbon',
    name: 'Matte Twill Carbon Fiber',
    desc: 'Zero-reflection raw carbon surface for track focus'
  },
  {
    id: 'gloss_carbon',
    name: 'High-Resin Gloss Carbon',
    desc: 'Deep glossy weave with UV protective clearcoat'
  },
  {
    id: 'aluminum',
    name: 'Brushed Anodized Aluminum',
    desc: 'Precision CNC-machined aerospace alloy billet'
  }
];

export const CockpitTrimSection: React.FC = () => {
  const { componentOverrides, updateComponentOverride } = useVehicleStore();

  const cockpitOverride = componentOverrides['cockpit_interior'];
  const [selectedMaterial, setSelectedMaterial] = useState(cockpitOverride?.upholsteryTheme || 'alcantara');
  const [selectedStitching, setSelectedStitching] = useState(cockpitOverride?.stitchingColorHex || '#DC2626');
  const [selectedTrim, setSelectedTrim] = useState(cockpitOverride?.interiorTrim || 'matte_carbon');

  const handleSelectMaterial = (matId: string) => {
    setSelectedMaterial(matId as any);
    playToggleClick();
    updateComponentOverride(
      'cockpit_interior',
      {
        upholsteryTheme: matId as any,
        donorComponentId: `interior_${matId}`,
        visible: true
      },
      true
    );
  };

  const handleSelectStitching = (hex: string) => {
    setSelectedStitching(hex);
    playToggleClick();
    updateComponentOverride(
      'cockpit_interior',
      {
        stitchingColorHex: hex,
        contextSettings: { stitchingColor: hex }
      },
      true
    );
  };

  const handleSelectTrim = (trimId: string) => {
    setSelectedTrim(trimId as any);
    playToggleClick();
    updateComponentOverride(
      'cockpit_interior',
      {
        interiorTrim: trimId as any,
        contextSettings: { trim: trimId }
      },
      true
    );
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Cabin Material Architecture */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Interior Cabin Upholstery
        </span>
        <div className="space-y-1.5">
          {CABIN_MATERIALS.map(mat => {
            const isSelected = selectedMaterial === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => handleSelectMaterial(mat.id)}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/40 border-gt-accent text-white font-bold ring-1 ring-gt-accent'
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="text-xs truncate text-white">{mat.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{mat.desc}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-mono ${
                      mat.weightDeltaKg < 0
                        ? 'text-emerald-400'
                        : mat.weightDeltaKg > 0
                        ? 'text-amber-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {mat.weightDeltaKg !== 0
                      ? `${mat.weightDeltaKg > 0 ? '+' : ''}${mat.weightDeltaKg} kg`
                      : 'BASE'}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-gt-accent shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interior Trim Architecture */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Dashboard & Console Structural Trim
        </span>
        <div className="space-y-1.5">
          {INTERIOR_TRIMS.map(trim => {
            const isSelected = selectedTrim === trim.id;
            return (
              <button
                key={trim.id}
                onClick={() => handleSelectTrim(trim.id)}
                className={`w-full p-2 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/40 border-gt-accent text-white font-bold ring-1 ring-gt-accent'
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="text-xs text-white">{trim.name}</div>
                  <div className="text-[10px] text-zinc-500">{trim.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-gt-accent shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contrast Stitching & Seat Belts */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Contrast Stitching & Harness Belts
        </span>
        <div className="grid grid-cols-6 gap-1.5">
          {STITCHING_COLORS.map(stitch => {
            const isSelected = selectedStitching.toLowerCase() === stitch.hex.toLowerCase();
            return (
              <button
                key={stitch.id}
                onClick={() => handleSelectStitching(stitch.hex)}
                className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-gt-accent bg-white/10 ring-1 ring-gt-accent'
                    : 'border-white/5 hover:border-white/20 bg-black/40'
                }`}
                title={stitch.name}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: stitch.hex }}
                />
                <span className="text-[8px] text-zinc-400 truncate w-full text-center">
                  {stitch.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
