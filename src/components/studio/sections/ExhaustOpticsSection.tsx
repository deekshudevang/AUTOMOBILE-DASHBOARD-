import React, { useState } from 'react';
import { Volume2, VolumeX, Flame, Zap, Check, Gauge, Sparkles } from 'lucide-react';
import { useVehicleStore } from '../../../hooks/useVehicleStore';
import { playToggleClick } from '../../../utils/audioFeedback';

const EXHAUST_TIPS = [
  {
    id: 'burnt_titanium',
    name: 'Titanium Burnt Blue Dual',
    material: 'Grade 5 Titanium with Heat Anodization',
    weightDeltaKg: -6.4,
    hex: '#38BDF8'
  },
  {
    id: 'quad_black',
    name: 'Quad Ceramic Jet Black',
    material: 'Thermal Barrier Ceramic Coating',
    weightDeltaKg: -2.1,
    hex: '#18181B'
  },
  {
    id: 'center_inconel',
    name: 'Center Dual Inconel 625',
    material: 'F1-Grade Ultralight Inconel Alloy',
    weightDeltaKg: -9.8,
    hex: '#C5A059'
  },
  {
    id: 'chrome_dual',
    name: 'Polished Dual Chrome',
    material: 'Mirror Polished 304 Stainless',
    weightDeltaKg: 0.0,
    hex: '#E2E8F0'
  }
];

const DRL_COLORS = [
  {
    id: 'ice_blue',
    name: '6500K Modern Ice Blue',
    temp: '6500K',
    hex: '#BAE6FD',
    desc: 'Cutting-edge laser optic signature'
  },
  {
    id: 'yellow',
    name: '3000K Le Mans GT Yellow',
    temp: '3000K',
    hex: '#FEF08A',
    desc: 'FIA WEC GT3 endurance heritage'
  },
  {
    id: 'white',
    name: '5000K Pure Xenon White',
    temp: '5000K',
    hex: '#FFFFFF',
    desc: 'High-clarity clean daylight beam'
  }
];

export const ExhaustOpticsSection: React.FC = () => {
  const { componentOverrides, updateComponentOverride } = useVehicleStore();

  const currentTipId = componentOverrides['exhaust_tips']?.exhaustTipStyle || 'burnt_titanium';
  const isValvesOpen = componentOverrides['exhaust_tips']?.exhaustValvesOpen ?? true;
  const currentDrlId = componentOverrides['headlights']?.drlColorTemp || 'ice_blue';

  const [selectedTip, setSelectedTip] = useState(currentTipId);
  const [valvesOpen, setValvesOpen] = useState(isValvesOpen);
  const [selectedDrl, setSelectedDrl] = useState(currentDrlId);

  const handleSelectTip = (tipId: string) => {
    setSelectedTip(tipId as any);
    playToggleClick();
    updateComponentOverride(
      'exhaust_tips',
      {
        exhaustTipStyle: tipId as any,
        donorComponentId: `exhaust_${tipId}`,
        visible: true
      },
      true
    );
  };

  const handleToggleValves = () => {
    const next = !valvesOpen;
    setValvesOpen(next);
    playToggleClick();
    updateComponentOverride(
      'exhaust_tips',
      {
        exhaustValvesOpen: next
      },
      true
    );
  };

  const handleSelectDrl = (drlId: string) => {
    setSelectedDrl(drlId as any);
    playToggleClick();
    updateComponentOverride(
      'headlights',
      {
        drlColorTemp: drlId as any,
        contextSettings: { drlColor: drlId }
      },
      true
    );
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Active Exhaust Valve Bypass Control */}
      <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-gt-accent" />
            Active Exhaust Valves & Sound
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
              valvesOpen
                ? 'bg-red-950/60 text-gt-accent border-gt-accent/40 animate-pulse'
                : 'bg-zinc-800 text-zinc-400 border-white/10'
            }`}
          >
            {valvesOpen ? 'Track (Open)' : 'Street (Quiet)'}
          </span>
        </div>

        {/* Acoustic Telemetry Bar */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-zinc-500 block">ACOUSTIC OUTPUT</span>
            <span className="text-sm font-bold text-white tabular-nums">
              {valvesOpen ? '104 dB' : '74 dB'}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-zinc-500 block">BACKPRESSURE</span>
            <span
              className={`text-sm font-bold tabular-nums ${
                valvesOpen ? 'text-emerald-400' : 'text-zinc-400'
              }`}
            >
              {valvesOpen ? '-18% Flow' : 'Standard'}
            </span>
          </div>
        </div>

        {/* Big Valve Toggle Button */}
        <button
          onClick={handleToggleValves}
          className={`w-full py-2.5 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            valvesOpen
              ? 'bg-red-950/50 border-gt-accent text-white shadow-lg ring-1 ring-gt-accent'
              : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
          }`}
          aria-label={`Toggle active exhaust valves, currently ${valvesOpen ? 'Open' : 'Closed'}`}
        >
          {valvesOpen ? (
            <>
              <Volume2 className="w-4 h-4 text-gt-accent" />
              <span>Track Mode: Open Bypasses (Bespoke Overrun)</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-zinc-400" />
              <span>Street Mode: Valved Quiet (Euro 6d / EPA)</span>
            </>
          )}
        </button>
      </div>

      {/* Exhaust Tip Architectural Finishes */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Exhaust Tip System & Tailpipe Finish
        </span>
        <div className="space-y-1.5">
          {EXHAUST_TIPS.map(tip => {
            const isSelected = selectedTip === tip.id;
            return (
              <button
                key={tip.id}
                onClick={() => handleSelectTip(tip.id)}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/40 border-gt-accent text-white font-bold ring-1 ring-gt-accent'
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: tip.hex }}
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs truncate">{tip.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{tip.material}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-emerald-400">
                    {tip.weightDeltaKg !== 0 ? `${tip.weightDeltaKg} kg` : 'OEM'}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-gt-accent shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DRL & Optics Signature Selector */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block flex items-center justify-between">
          <span>DRL Headlight Signature Light</span>
          <Zap className="w-3.5 h-3.5 text-gt-info" />
        </span>
        <div className="grid grid-cols-3 gap-2">
          {DRL_COLORS.map(drl => {
            const isSelected = selectedDrl === drl.id;
            return (
              <button
                key={drl.id}
                onClick={() => handleSelectDrl(drl.id)}
                className={`p-2 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'border-gt-accent bg-white/10 ring-1 ring-gt-accent'
                    : 'border-white/5 hover:border-white/20 bg-black/40'
                }`}
                title={drl.name}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                  style={{ backgroundColor: drl.hex }}
                />
                <span className="text-[10px] font-bold text-white truncate w-full">
                  {drl.temp}
                </span>
                <span className="text-[9px] text-zinc-400 truncate w-full">
                  {drl.name.split(' ')[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
