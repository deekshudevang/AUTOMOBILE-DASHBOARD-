import React, { useState } from 'react';
import { Disc, Sliders, Check } from 'lucide-react';
import { useVehicleStore } from '../../../hooks/useVehicleStore';
import { TechnicalSlider } from '../../ui/TechnicalSlider';

const WHEEL_STYLES = [
  { id: 'donor_svj_leirion_wheels', name: 'SVJ Leirion Y-Spoke', finish: 'Satin Black' },
  { id: 'donor_gt3rs_centerlock_wheels', name: 'GT3 RS Forged Centerlock', finish: 'Satin Indigo' },
  { id: 'donor_senna_ultralight_wheels', name: 'Senna Ultra-Light 9-Spoke', finish: 'Gloss Black' },
  { id: 'donor_amg_monoblock_wheels', name: 'AMG Monoblock Aerodisc', finish: 'Brushed Silver' },
  { id: 'donor_chiron_classique_wheels', name: 'Chiron Classique Diamond Cut', finish: 'Two-Tone' }
];

const WHEEL_FINISHES = [
  { id: 'gunmetal', name: 'Satin Gunmetal', hex: '#3A3E47' },
  { id: 'gloss_black', name: 'Gloss Jet Black', hex: '#111113' },
  { id: 'hyper_silver', name: 'Hyper Silver', hex: '#D6D9E0' },
  { id: 'satin_bronze', name: 'Satin Bronze', hex: '#826848' },
  { id: 'motorsport_gold', name: 'Motorsport Gold', hex: '#C5A059' }
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

export const WheelStudioSection: React.FC = () => {
  const { componentOverrides, updateComponentOverride } = useVehicleStore();

  const currentDiameter = componentOverrides['wheel_fl']?.wheelDiameterInches ?? 20;
  const currentSpacer = componentOverrides['wheel_fl']?.wheelSpacerMm ?? 0;
  const currentStyleId = componentOverrides['wheel_fl']?.donorComponentId;

  const [selectedFinish, setSelectedFinish] = useState('gunmetal');

  const handleUpdateDiameter = (val: number) => {
    ALL_CORNERS.forEach(c => {
      updateComponentOverride(c, { wheelDiameterInches: val }, false);
    });
    updateComponentOverride('wheel_fl', { wheelDiameterInches: val }, true);
  };

  const handleUpdateSpacer = (val: number) => {
    ALL_CORNERS.forEach(c => {
      updateComponentOverride(c, { wheelSpacerMm: val }, false);
    });
    updateComponentOverride('wheel_fl', { wheelSpacerMm: val }, true);
  };

  const handleSelectStyle = (styleId: string) => {
    ALL_CORNERS.forEach(c => {
      updateComponentOverride(c, { donorComponentId: styleId, visible: true }, false);
    });
    updateComponentOverride('wheel_fl', { donorComponentId: styleId, visible: true }, true);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Visual Fitment Diagram */}
      <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Disc className="w-3.5 h-3.5 text-gt-accent" />
            Fitment & Stance Calibration
          </span>
          <span className="text-[10px] text-zinc-400">
            {currentDiameter}&quot; • +{currentSpacer}mm Poke
          </span>
        </div>

        {/* Technical Stance Crosshair Diagram */}
        <div className="relative h-20 bg-black/60 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 240 80" className="w-full h-full" fill="none">
            {/* Fender Lip Baseline */}
            <path d="M 40 18 Q 120 12 200 18" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="120" y="24" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">
              FENDER FLUSH LIP
            </text>

            {/* Tire Profile */}
            <rect x="75" y="30" width="90" height="38" rx="4" fill="#18181B" stroke="#3F3F46" strokeWidth="1.5" />
            {/* Rim Lip */}
            <circle cx="120" cy="49" r="16" fill="#27272A" stroke="#71717A" strokeWidth="1.2" />
            {/* Hub Center */}
            <circle cx="120" cy="49" r="4" fill="#D4D4D8" />

            {/* Spacer Arrow indicator */}
            {currentSpacer > 0 && (
              <g>
                <line x1="165" y1="49" x2={165 + (currentSpacer * 0.7)} y2="49" stroke="#E53935" strokeWidth="1.5" />
                <text x="180" y="62" fill="#E53935" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  +{currentSpacer}mm
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Precision Sliders (Defect 16 Resolution) */}
      <div className="space-y-4 p-3.5 rounded-xl bg-white/5 border border-white/5">
        {/* Wheel Diameter Slider */}
        <TechnicalSlider
          label="Rim Diameter"
          min={18}
          max={22}
          step={1}
          value={currentDiameter}
          unit='"'
          onChange={handleUpdateDiameter}
        />

        {/* Wheel Spacer / Track Poke Slider */}
        <TechnicalSlider
          label="Offset Track Spacer"
          min={0}
          max={45}
          step={2}
          value={currentSpacer}
          unit="mm"
          onChange={handleUpdateSpacer}
        />
      </div>

      {/* Wheel Styles Selector */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Wheel Design Architecture
        </span>
        <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
          {WHEEL_STYLES.map(style => {
            const isSelected = currentStyleId === style.id;
            return (
              <button
                key={style.id}
                onClick={() => handleSelectStyle(style.id)}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-950/40 border-gt-accent text-white font-bold ring-1 ring-gt-accent'
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="text-xs truncate">{style.name}</div>
                  <div className="text-[10px] text-zinc-500">{style.finish}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-gt-accent shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish Swatches */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Rim Finish Coating
        </span>
        <div className="flex items-center gap-2">
          {WHEEL_FINISHES.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFinish(f.id)}
              className={`p-1.5 rounded-lg border flex items-center gap-2 transition-all flex-1 justify-center ${
                selectedFinish === f.id
                  ? 'border-gt-accent bg-white/10 ring-1 ring-gt-accent'
                  : 'border-white/5 hover:border-white/20 bg-black/40'
              }`}
              title={f.name}
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: f.hex }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
