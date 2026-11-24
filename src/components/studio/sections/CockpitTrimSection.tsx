import React, { useState } from 'react';
import { Layers, Check, Sparkles } from 'lucide-react';

const CABIN_MATERIALS = [
  { id: 'alcantara', name: 'Motorsport Alcantara', desc: 'Lightweight high-grip synthetic suede' },
  { id: 'nappa', name: 'Full-Grain Nappa Leather', desc: 'Hand-stitched semi-aniline hide' },
  { id: 'carbon_bucket', name: 'Exposed Carbon Bucket', desc: 'Ultra-rigid FIA homologated monocoque' }
];

const STITCHING_COLORS = [
  { id: 'guards_red', name: 'Guards Red', hex: '#DC2626' },
  { id: 'racing_yellow', name: 'Racing Yellow', hex: '#FACC15' },
  { id: 'acid_green', name: 'Acid Green', hex: '#84CC16' },
  { id: 'papaya', name: 'Papaya Orange', hex: '#F97316' },
  { id: 'arctic_silver', name: 'Arctic Silver', hex: '#E2E8F0' }
];

export const CockpitTrimSection: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState('alcantara');
  const [selectedStitching, setSelectedStitching] = useState('guards_red');

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
                onClick={() => setSelectedMaterial(mat.id)}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-950/40 border-gt-accent text-white font-bold ring-1 ring-gt-accent'
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="text-xs truncate">{mat.name}</div>
                  <div className="text-[10px] text-zinc-500">{mat.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-gt-accent shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contrast Stitching Palette */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Contrast Stitching & Seat Belts
        </span>
        <div className="flex items-center gap-2">
          {STITCHING_COLORS.map(stitch => {
            const isSelected = selectedStitching === stitch.id;
            return (
              <button
                key={stitch.id}
                onClick={() => setSelectedStitching(stitch.id)}
                className={`p-2 rounded-lg border flex flex-col items-center gap-1.5 transition-all flex-1 ${
                  isSelected
                    ? 'border-gt-accent bg-white/10 ring-1 ring-gt-accent'
                    : 'border-white/5 hover:border-white/20 bg-black/40'
                }`}
                title={stitch.name}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: stitch.hex }}
                />
                <span className="text-[9px] text-zinc-400 truncate w-full text-center">
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
