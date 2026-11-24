import React, { useState } from 'react';
import { Disc, Sliders, Check, Activity, Shield } from 'lucide-react';
import { useVehicleStore } from '../../../hooks/useVehicleStore';
import { TechnicalSlider } from '../../ui/TechnicalSlider';
import { playToggleClick } from '../../../utils/audioFeedback';

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

const TIRE_COMPOUNDS = [
  {
    id: 'cup2r',
    name: 'Michelin Pilot Sport Cup 2 R',
    category: 'Track Semi-Slick',
    treadwear: '140 TW',
    gripLevel: '1.65G',
    desc: 'Motorsport-derived compound for maximum dry apex velocity'
  },
  {
    id: 'trofeo',
    name: 'Pirelli P Zero Trofeo R',
    category: 'Extreme Circuit',
    treadwear: '60 TW',
    gripLevel: '1.70G',
    desc: 'Ultra-stiff carcass designed for sustained high lateral G'
  },
  {
    id: 'slick',
    name: 'Michelin Motorsport Slick',
    category: 'Competition Non-DOT',
    treadwear: 'Racing',
    gripLevel: '1.95G',
    desc: 'Pure bespoke racing slick for closed-circuit time attack'
  },
  {
    id: 'street',
    name: 'Michelin Pilot Sport 4S',
    category: 'Max Performance Radial',
    treadwear: '300 TW',
    gripLevel: '1.30G',
    desc: 'All-weather dual-compound road radial with wet evacuation'
  }
];

const FRONT_CORNERS = ['wheel_front_left', 'wheel_front_right', 'wheel_fl', 'wheel_fr'];
const REAR_CORNERS = ['wheel_rear_left', 'wheel_rear_right', 'wheel_rl', 'wheel_rr'];
const ALL_CORNERS = [...FRONT_CORNERS, ...REAR_CORNERS];

export const WheelStudioSection: React.FC = () => {
  const { componentOverrides, updateComponentOverride } = useVehicleStore();

  const flOverride = componentOverrides['wheel_fl'];
  const rlOverride = componentOverrides['wheel_rl'];

  const currentDiameter = flOverride?.wheelDiameterInches ?? 20;
  const currentSpacer = flOverride?.wheelSpacerMm ?? 0;
  const currentFrontCamber = flOverride?.wheelFrontCamberDeg ?? flOverride?.wheelCamberDeg ?? -1.8;
  const currentRearCamber = rlOverride?.wheelRearCamberDeg ?? rlOverride?.wheelCamberDeg ?? -2.2;
  const currentCompound = flOverride?.tireCompound ?? 'cup2r';
  const currentStyleId = flOverride?.donorComponentId;

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

  const handleUpdateFrontCamber = (val: number) => {
    FRONT_CORNERS.forEach(c => {
      updateComponentOverride(c, { wheelFrontCamberDeg: val, wheelCamberDeg: val }, false);
    });
    updateComponentOverride('wheel_fl', { wheelFrontCamberDeg: val, wheelCamberDeg: val }, true);
  };

  const handleUpdateRearCamber = (val: number) => {
    REAR_CORNERS.forEach(c => {
      updateComponentOverride(c, { wheelRearCamberDeg: val, wheelCamberDeg: val }, false);
    });
    updateComponentOverride('wheel_rl', { wheelRearCamberDeg: val, wheelCamberDeg: val }, true);
  };

  const handleSelectCompound = (compoundId: string) => {
    playToggleClick();
    ALL_CORNERS.forEach(c => {
      updateComponentOverride(c, { tireCompound: compoundId as any }, false);
    });
    updateComponentOverride('wheel_fl', { tireCompound: compoundId as any }, true);
  };

  const handleSelectStyle = (styleId: string) => {
    playToggleClick();
    ALL_CORNERS.forEach(c => {
      updateComponentOverride(c, { donorComponentId: styleId, visible: true }, false);
    });
    updateComponentOverride('wheel_fl', { donorComponentId: styleId, visible: true }, true);
  };

  // SVG Camber Tilt Rotation
  const camberTiltAngle = currentFrontCamber; // negative rotates top inward
  const rimRadiusSvg = 14 + (currentDiameter - 18) * 1.5;

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Visual Fitment & Camber Diagram */}
      <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Disc className="w-3.5 h-3.5 text-gt-accent" />
            Stance & Camber Kinematics
          </span>
          <span className="text-[10px] text-zinc-400">
            {currentDiameter}&quot; • +{currentSpacer}mm • {currentFrontCamber}° Camber
          </span>
        </div>

        {/* Technical Stance Crosshair Diagram */}
        <div className="relative h-24 bg-black/60 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 240 90" className="w-full h-full" fill="none">
            {/* Ground Plane */}
            <line x1="20" y1="80" x2="220" y2="80" stroke="#334155" strokeWidth="1.5" />
            <text x="35" y="86" fill="#64748B" fontSize="7" fontFamily="monospace">
              GROUND CONTACT
            </text>

            {/* Fender Lip Baseline */}
            <path d="M 40 18 Q 120 12 200 18" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="120" y="24" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">
              FENDER FLUSH LIP
            </text>

            {/* Tilted Wheel & Tire Group with Camber & Spacer */}
            <g
              transform={`translate(${currentSpacer * 0.6}, 0) rotate(${camberTiltAngle}, 120, 52)`}
              style={{ transition: 'transform 0.2s ease-out' }}
            >
              {/* Tire Profile */}
              <rect
                x="85"
                y="30"
                width="70"
                height="46"
                rx="5"
                fill="#18181B"
                stroke="#3F3F46"
                strokeWidth="1.8"
              />
              {/* Rim Outer Lip */}
              <circle
                cx="120"
                cy="53"
                r={rimRadiusSvg}
                fill="#27272A"
                stroke="#71717A"
                strokeWidth="1.4"
              />
              {/* Hub Center & Centerlock */}
              <circle cx="120" cy="53" r="5" fill="#D4D4D8" stroke="#EF4444" strokeWidth="1" />
              {/* Spoke Accent Lines */}
              <line x1="120" y1={53 - rimRadiusSvg + 2} x2="120" y2={53 + rimRadiusSvg - 2} stroke="#52525B" strokeWidth="1.2" />
              <line x1={120 - rimRadiusSvg + 2} y1="53" x2={120 + rimRadiusSvg - 2} y2="53" stroke="#52525B" strokeWidth="1.2" />
            </g>

            {/* Spacer Arrow indicator */}
            {currentSpacer > 0 && (
              <g>
                <line x1="165" y1="52" x2={165 + currentSpacer * 0.7} y2="52" stroke="#DC2626" strokeWidth="1.5" />
                <text x="175" y="66" fill="#DC2626" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  +{currentSpacer}mm
                </text>
              </g>
            )}

            {/* Camber Angle Indicator */}
            <text x="45" y="45" fill="#38BDF8" fontSize="8" fontFamily="monospace">
              FRONT: {currentFrontCamber}°
            </text>
            <text x="45" y="56" fill="#A855F7" fontSize="8" fontFamily="monospace">
              REAR: {currentRearCamber}°
            </text>
          </svg>
        </div>
      </div>

      {/* Precision Fitment & Stance Calibration Sliders */}
      <div className="space-y-3.5 p-3.5 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-gt-info" />
            Alignment & Track Geometry
          </span>
          <span className="text-[10px] text-zinc-400">Suspension Linkage</span>
        </div>

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
          max={30}
          step={2}
          value={currentSpacer}
          unit="mm"
          onChange={handleUpdateSpacer}
        />

        {/* Front Negative Camber Slider */}
        <TechnicalSlider
          label="Front Negative Camber"
          min={-4.5}
          max={-0.5}
          step={0.1}
          value={currentFrontCamber}
          unit="°"
          onChange={handleUpdateFrontCamber}
        />

        {/* Rear Negative Camber Slider */}
        <TechnicalSlider
          label="Rear Negative Camber"
          min={-4.5}
          max={-0.5}
          step={0.1}
          value={currentRearCamber}
          unit="°"
          onChange={handleUpdateRearCamber}
        />
      </div>

      {/* Tire Compound Selector */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block flex items-center justify-between">
          <span>Tire Compound & Tread Architecture</span>
          <Activity className="w-3.5 h-3.5 text-gt-ok" />
        </span>
        <div className="space-y-1.5">
          {TIRE_COMPOUNDS.map(compound => {
            const isSelected = currentCompound === compound.id;
            return (
              <button
                key={compound.id}
                onClick={() => handleSelectCompound(compound.id)}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/40 border-gt-accent text-white font-bold ring-1 ring-gt-accent'
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="text-xs truncate text-white">{compound.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{compound.desc}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    {compound.gripLevel}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 border border-white/10">
                    {compound.treadwear}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-gt-accent shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wheel Styles Selector */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Wheel Design Architecture
        </span>
        <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
          {WHEEL_STYLES.map(style => {
            const isSelected = currentStyleId === style.id;
            return (
              <button
                key={style.id}
                onClick={() => handleSelectStyle(style.id)}
                className={`w-full p-2 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
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

      {/* Rim Finish Swatches */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Rim Powder Coat Finish
        </span>
        <div className="flex items-center gap-2">
          {WHEEL_FINISHES.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFinish(f.id)}
              className={`p-1.5 rounded-lg border flex items-center gap-2 transition-all flex-1 justify-center cursor-pointer ${
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
