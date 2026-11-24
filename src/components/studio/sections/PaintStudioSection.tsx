import React, { useState } from 'react';
import { Paintbrush, Sparkles, Pipette, Sliders } from 'lucide-react';
import { useVehicleStore } from '../../../hooks/useVehicleStore';
import { PaintSpeedformSwatch, PaintColorDef, PaintFinishType } from './PaintSpeedformSwatch';
import { resolveVehicleColor } from '../../../utils/colorUtils';

const OEM_SUPERCAR_PAINTS: PaintColorDef[] = [
  // Supercar Heritage Palette
  { name: 'Rosso Corsa', hex: '#D40000', brand: 'Ferrari', finish: 'gloss' },
  { name: 'Guards Red', hex: '#C60000', brand: 'Porsche', finish: 'gloss' },
  { name: 'Papaya Spark', hex: '#FF8000', brand: 'McLaren', finish: 'metallic' },
  { name: 'Racing Yellow', hex: '#F2C94C', brand: 'Porsche', finish: 'gloss' },
  { name: 'Giallo Orion', hex: '#E6B800', brand: 'Lamborghini', finish: 'metallic' },
  { name: 'French Racing Blue', hex: '#0B5ED7', brand: 'Bugatti', finish: 'gloss' },
  { name: 'British Racing Green', hex: '#004225', brand: 'Aston Martin', finish: 'metallic' },
  { name: 'Bayside Blue', hex: '#1040A0', brand: 'Nissan', finish: 'metallic' },
  { name: 'Isle of Man Green', hex: '#1E5631', brand: 'BMW', finish: 'metallic' },
  { name: 'Nardo Grey', hex: '#686D76', brand: 'Audi', finish: 'gloss' },
  { name: 'Chalk / Crayon', hex: '#B8B9B7', brand: 'Porsche', finish: 'gloss' },
  { name: 'Obsidian Black', hex: '#111215', brand: 'Mercedes-AMG', finish: 'metallic' },
  { name: 'Frozen Deep Grey', hex: '#373A40', brand: 'BMW', finish: 'matte' },
  { name: 'Satin Cashmere', hex: '#C9BBA8', brand: 'Lexus', finish: 'satin' },
  { name: 'Championship White', hex: '#F5F5F0', brand: 'Honda', finish: 'gloss' },
  { name: 'Soul Red Crystal', hex: '#990000', brand: 'Mazda', finish: 'metallic' },
  { name: 'Raw 45° Twill Carbon', hex: '#1A1A1A', brand: 'Bespoke', finish: 'carbon' },
  { name: 'Forged Marbled Carbon', hex: '#222222', brand: 'Bespoke', finish: 'carbon' }
];

const FINISH_FILTER_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Finishes' },
  { id: 'gloss', label: 'Gloss' },
  { id: 'metallic', label: 'Metallic' },
  { id: 'matte', label: 'Satin / Matte' },
  { id: 'carbon', label: 'Carbon Fiber' }
];

export const PaintStudioSection: React.FC = () => {
  const {
    activeConfig,
    setCustomPrimaryColor,
    setCustomSecondaryColor
  } = useVehicleStore();

  const [targetSlot, setTargetSlot] = useState<'primary' | 'secondary'>('primary');
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [customHexInput, setCustomHexInput] = useState<string>('');

  const currentPrimary = resolveVehicleColor(
    activeConfig.isPrimaryColorCustom,
    activeConfig.customPrimaryColor,
    activeConfig.primaryColor
  );

  const filteredPaints = OEM_SUPERCAR_PAINTS.filter(p => {
    if (selectedFinish === 'all') return true;
    if (selectedFinish === 'matte') return p.finish === 'matte' || p.finish === 'satin';
    return p.finish === selectedFinish;
  });

  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const handleApplyColor = (color: PaintColorDef) => {
    const rgb = hexToRgb(color.hex);
    if (targetSlot === 'primary') {
      setCustomPrimaryColor(rgb);
    } else {
      setCustomSecondaryColor(rgb);
    }
  };

  const handleApplyCustomHex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHexInput.match(/^#?[0-9A-Fa-f]{6}$/)) return;
    const cleanHex = customHexInput.startsWith('#') ? customHexInput : `#${customHexInput}`;
    const rgb = hexToRgb(cleanHex);
    if (targetSlot === 'primary') {
      setCustomPrimaryColor(rgb);
    } else {
      setCustomSecondaryColor(rgb);
    }
    setCustomHexInput('');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Target Slot Toggle: Body Shell vs Mirrors/Accents */}
      <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setTargetSlot('primary')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            targetSlot === 'primary'
              ? 'bg-gt-accent text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div
            className="w-3 h-3 rounded-full border border-white/30"
            style={{ backgroundColor: currentPrimary.hex }}
          />
          <span>Body Shell</span>
        </button>

        <button
          onClick={() => setTargetSlot('secondary')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            targetSlot === 'secondary'
              ? 'bg-gt-accent text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>Accents & Aero</span>
        </button>
      </div>

      {/* Finish Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        {FINISH_FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedFinish(tab.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all ${
              selectedFinish === tab.id
                ? 'bg-white/15 text-white border border-white/20 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3D Sculpted Speedform Swatches Grid (Defect 08 Resolution) */}
      <div className="grid grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
        {filteredPaints.map(color => {
          const isSelected =
            targetSlot === 'primary' &&
            currentPrimary.hex.toLowerCase() === color.hex.toLowerCase();

          return (
            <PaintSpeedformSwatch
              key={`${color.name}_${color.finish}`}
              color={color}
              isSelected={isSelected}
              onSelect={handleApplyColor}
            />
          );
        })}
      </div>

      {/* Bespoke Custom HEX / RGB Input */}
      <form onSubmit={handleApplyCustomHex} className="pt-2 border-t border-white/10 flex items-center gap-2">
        <div className="relative flex-1">
          <Pipette className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Custom HEX (e.g. #D40000)"
            value={customHexInput}
            onChange={e => setCustomHexInput(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gt-accent font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-gt-graphite hover:bg-zinc-700 text-white font-bold text-xs border border-white/10 transition-colors"
        >
          Apply
        </button>
      </form>
    </div>
  );
};
