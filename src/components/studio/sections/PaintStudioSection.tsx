import React, { useState } from 'react';
import { Paintbrush, Sparkles, Pipette, Sliders, Disc, Shield } from 'lucide-react';
import { useVehicleStore } from '../../../hooks/useVehicleStore';
import { PaintSpeedformSwatch, PaintColorDef, PaintFinishType } from './PaintSpeedformSwatch';
import { resolveVehicleColor } from '../../../utils/colorUtils';
import { TechnicalSlider } from '../../ui/TechnicalSlider';

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

const CALIPER_PRESETS = [
  { name: 'Acid Green', hex: '#84CC16', brand: 'Porsche 918' },
  { name: 'Rosso Corsa', hex: '#DC2626', brand: 'Brembo Racing' },
  { name: 'Carbon Ceramic Gold', hex: '#EAB308', brand: 'PCCB Spec' },
  { name: 'Speed Yellow', hex: '#FACC15', brand: 'GT3 Spec' },
  { name: 'Racing Blue', hex: '#2563EB', brand: 'AMG Track' },
  { name: 'Satin Jet Black', hex: '#18181B', brand: 'Stealth' },
  { name: 'Billet Silver', hex: '#94A3B8', brand: 'Pure Alloy' }
];

const FINISH_FILTER_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Finishes' },
  { id: 'gloss', label: 'Gloss' },
  { id: 'metallic', label: 'Metallic' },
  { id: 'matte', label: 'Satin / Matte' },
  { id: 'carbon', label: 'Carbon Fiber' }
];

const ALL_CORNERS = [
  'wheel_front_left',
  'wheel_front_right',
  'wheel_rear_left',
  'wheel_rear_right',
  'wheel_fl',
  'wheel_fr',
  'wheel_rl',
  'wheel_rr'
];

type TargetZone = 'primary' | 'secondary' | 'roof_mirrors' | 'calipers';

export const PaintStudioSection: React.FC = () => {
  const {
    activeConfig,
    setCustomPrimaryColor,
    setCustomSecondaryColor,
    componentOverrides,
    updateComponentOverride
  } = useVehicleStore();

  const [targetSlot, setTargetSlot] = useState<TargetZone>('primary');
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [customHexInput, setCustomHexInput] = useState<string>('');

  // Physics coating parameters from body_shell override or defaults
  const bodyOverride = componentOverrides['body_shell'];
  const [clearcoatRoughness, setClearcoatRoughness] = useState(bodyOverride?.clearcoatRoughness ?? 0.15);
  const [metallicFlake, setMetallicFlake] = useState(bodyOverride?.metallicFlakeDensity ?? 40);
  const [clearcoatStrength, setClearcoatStrength] = useState(bodyOverride?.clearcoatStrength ?? 90);

  const currentPrimary = resolveVehicleColor(
    activeConfig.isPrimaryColorCustom,
    activeConfig.customPrimaryColor,
    activeConfig.primaryColor
  );

  const currentCaliperHex =
    componentOverrides['wheel_fl']?.caliperColorHex ||
    componentOverrides['wheel_fl']?.contextSettings?.caliperColor ||
    '#DC2626';

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
    } else if (targetSlot === 'secondary') {
      setCustomSecondaryColor(rgb);
    } else if (targetSlot === 'roof_mirrors') {
      updateComponentOverride('roof', { customColorHex: color.hex, visible: true }, false);
      updateComponentOverride('mirror_left', { customColorHex: color.hex, visible: true }, false);
      updateComponentOverride('mirror_right', { customColorHex: color.hex, visible: true }, true);
    } else if (targetSlot === 'calipers') {
      handleApplyCaliperColor(color.hex);
    }
  };

  const handleApplyCaliperColor = (hex: string) => {
    ALL_CORNERS.forEach(c => {
      updateComponentOverride(
        c,
        {
          caliperColorHex: hex,
          contextSettings: { caliperColor: hex }
        },
        false
      );
    });
    updateComponentOverride(
      'wheel_fl',
      {
        caliperColorHex: hex,
        contextSettings: { caliperColor: hex }
      },
      true
    );
  };

  const handleApplyCustomHex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHexInput.match(/^#?[0-9A-Fa-f]{6}$/)) return;
    const cleanHex = customHexInput.startsWith('#') ? customHexInput : `#${customHexInput}`;
    const rgb = hexToRgb(cleanHex);
    if (targetSlot === 'primary') {
      setCustomPrimaryColor(rgb);
    } else if (targetSlot === 'secondary') {
      setCustomSecondaryColor(rgb);
    } else if (targetSlot === 'roof_mirrors') {
      updateComponentOverride('roof', { customColorHex: cleanHex, visible: true }, false);
      updateComponentOverride('mirror_left', { customColorHex: cleanHex, visible: true }, false);
      updateComponentOverride('mirror_right', { customColorHex: cleanHex, visible: true }, true);
    } else if (targetSlot === 'calipers') {
      handleApplyCaliperColor(cleanHex);
    }
    setCustomHexInput('');
  };

  const handleUpdateClearcoatRoughness = (val: number) => {
    setClearcoatRoughness(val);
    updateComponentOverride('body_shell', { clearcoatRoughness: val }, true);
  };

  const handleUpdateMetallicFlake = (val: number) => {
    setMetallicFlake(val);
    updateComponentOverride('body_shell', { metallicFlakeDensity: val }, true);
  };

  const handleUpdateClearcoatStrength = (val: number) => {
    setClearcoatStrength(val);
    updateComponentOverride('body_shell', { clearcoatStrength: val }, true);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Target Zone Selector: 4 Discrete Multi-Zone Slots */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
          Paint Zone Target
        </span>
        <div className="grid grid-cols-2 gap-1.5 bg-black/50 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setTargetSlot('primary')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              targetSlot === 'primary'
                ? 'bg-gt-accent text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
              style={{ backgroundColor: currentPrimary.hex }}
            />
            <span className="truncate">Body Shell</span>
          </button>

          <button
            onClick={() => setTargetSlot('secondary')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              targetSlot === 'secondary'
                ? 'bg-gt-accent text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="truncate">Accents & Aero</span>
          </button>

          <button
            onClick={() => setTargetSlot('roof_mirrors')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              targetSlot === 'roof_mirrors'
                ? 'bg-gt-accent text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="truncate">Roof & Mirrors</span>
          </button>

          <button
            onClick={() => setTargetSlot('calipers')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              targetSlot === 'calipers'
                ? 'bg-gt-accent text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
              style={{ backgroundColor: currentCaliperHex }}
            />
            <span className="truncate">Brake Calipers</span>
          </button>
        </div>
      </div>

      {/* When Calipers is selected: Display Caliper Presets */}
      {targetSlot === 'calipers' ? (
        <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Disc className="w-3.5 h-3.5 text-gt-accent" />
              Brake Caliper Finishes
            </span>
            <span
              className="w-3 h-3 rounded-full border border-white/30"
              style={{ backgroundColor: currentCaliperHex }}
            />
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {CALIPER_PRESETS.map(c => {
              const isSelected = currentCaliperHex.toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  key={c.name}
                  onClick={() => handleApplyCaliperColor(c.hex)}
                  className={`w-full p-2 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-red-950/40 border-gt-accent text-white font-bold ring-1 ring-gt-accent'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs text-white">{c.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{c.brand}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Finish Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {FINISH_FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFinish(tab.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  selectedFinish === tab.id
                    ? 'bg-white/15 text-white border border-white/20 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3D Sculpted Speedform Swatches Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-h-52 overflow-y-auto pr-1">
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
        </>
      )}

      {/* Advanced Clearcoat & Flake Physics Sliders */}
      <div className="space-y-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-gt-info" />
            Clearcoat & Flake Physics
          </span>
          <span className="text-[10px] text-zinc-400">PBR Multi-Layer</span>
        </div>

        <TechnicalSlider
          label="Clearcoat Roughness"
          min={0.05}
          max={0.8}
          step={0.05}
          value={clearcoatRoughness}
          unit=""
          onChange={handleUpdateClearcoatRoughness}
        />

        <TechnicalSlider
          label="Metallic Flake Density"
          min={0}
          max={100}
          step={5}
          value={metallicFlake}
          unit="%"
          onChange={handleUpdateMetallicFlake}
        />

        <TechnicalSlider
          label="Clearcoat Reflection"
          min={0}
          max={100}
          step={5}
          value={clearcoatStrength}
          unit="%"
          onChange={handleUpdateClearcoatStrength}
        />
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
          className="px-3 py-1.5 rounded-lg bg-gt-graphite hover:bg-zinc-700 text-white font-bold text-xs border border-white/10 transition-colors cursor-pointer"
        >
          Apply
        </button>
      </form>
    </div>
  );
};
