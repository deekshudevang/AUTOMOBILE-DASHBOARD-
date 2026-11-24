import React, { useState } from 'react';
import { Wind, Gauge, ShieldAlert, Sparkles, Check, ChevronRight } from 'lucide-react';
import { useVehicleStore } from '../../../hooks/useVehicleStore';
import { TechnicalSlider } from '../../ui/TechnicalSlider';
import { getVehicleTechnicalSpecs } from '../../../data/vehicleTechnicalSpecs';
import { playToggleClick } from '../../../utils/audioFeedback';

export const AeroPackageSection: React.FC = () => {
  const { activeFile, activeModel, componentOverrides, updateComponentOverride } = useVehicleStore();
  const specs = getVehicleTechnicalSpecs(activeFile || activeModel?.codeName || '');

  const rearWingOverride = componentOverrides['wing_rear'];
  const splitterOverride = componentOverrides['splitter_front'];

  const [wingAngle, setWingAngle] = useState(rearWingOverride?.wingAngleDeg ?? 14);
  const [splitterExtension, setSplitterExtension] = useState(splitterOverride?.splitterExtensionMm ?? 18);
  const [divePlanesEnabled, setDivePlanesEnabled] = useState(splitterOverride?.divePlanesEnabled ?? true);
  const [drsActive, setDrsActive] = useState(false);

  // Computed aerodynamic telemetry
  const baseDownforceKg = specs.downforceKg || 420;
  const effectiveWingAngle = drsActive ? Math.max(0, wingAngle - 10) : wingAngle;
  const divePlaneBonus = divePlanesEnabled ? 35 : 0;

  const downforceFactor =
    1 + (effectiveWingAngle / 25) * 0.42 + (splitterExtension / 50) * 0.18 + (divePlaneBonus / baseDownforceKg);
  const computedDownforceKg = Math.round(baseDownforceKg * downforceFactor);
  const computedDownforceN = Math.round(computedDownforceKg * 9.80665);

  const baseDrag = specs.dragCoefficient || 0.33;
  const dragDeltaVal = ((effectiveWingAngle / 25) * 0.048 + (splitterExtension / 50) * 0.016 + (divePlanesEnabled ? 0.008 : 0));
  const dragDelta = dragDeltaVal.toFixed(3);
  const totalCd = (baseDrag + dragDeltaVal).toFixed(3);

  const frontBalance = Math.round(38 + (splitterExtension / 50) * 7 + (divePlanesEnabled ? 3 : 0));
  const rearBalance = 100 - frontBalance;

  // L/D Efficiency Ratio
  const liftToDragRatio = (computedDownforceKg / (dragDeltaVal * 1000 + 100)).toFixed(2);

  const handleUpdateWingAngle = (val: number) => {
    setWingAngle(val);
    updateComponentOverride('wing_rear', { wingAngleDeg: val }, true);
  };

  const handleUpdateSplitter = (val: number) => {
    setSplitterExtension(val);
    updateComponentOverride('splitter_front', { splitterExtensionMm: val }, true);
  };

  const handleToggleDivePlanes = () => {
    const next = !divePlanesEnabled;
    setDivePlanesEnabled(next);
    playToggleClick();
    updateComponentOverride('splitter_front', { divePlanesEnabled: next }, true);
  };

  const handleToggleDrs = () => {
    const next = !drsActive;
    setDrsActive(next);
    playToggleClick();
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Dynamic Aero Telemetry Readout */}
      <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-gt-info" />
            Aerodynamic Telemetry & Load
          </span>
          <span className="text-[10px] text-gt-info font-bold">
            @{specs.downforceSpeedKmh || 250} KM/H
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center pt-1">
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[8px] text-zinc-500 block uppercase">DOWNFORCE</span>
            <span className="text-xs font-bold text-white tabular-nums">
              {computedDownforceKg} kg
            </span>
            <span className="text-[8px] text-zinc-500 block">({computedDownforceN} N)</span>
          </div>

          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[8px] text-zinc-500 block uppercase">DRAG COEFF</span>
            <span className="text-xs font-bold text-amber-400 tabular-nums">
              {totalCd}
            </span>
            <span className="text-[8px] text-amber-500/80 block">+{dragDelta}</span>
          </div>

          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[8px] text-zinc-500 block uppercase">BALANCE</span>
            <span className="text-xs font-bold text-gt-info tabular-nums">
              {frontBalance}:{rearBalance}
            </span>
            <span className="text-[8px] text-zinc-500 block">F / R %</span>
          </div>

          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[8px] text-zinc-500 block uppercase">L/D RATIO</span>
            <span className="text-xs font-bold text-emerald-400 tabular-nums">
              {liftToDragRatio}
            </span>
            <span className="text-[8px] text-zinc-500 block">Efficiency</span>
          </div>
        </div>
      </div>

      {/* Aerodynamic Calibration Sliders */}
      <div className="space-y-4 p-3.5 rounded-xl bg-white/5 border border-white/5">
        <TechnicalSlider
          label="Rear Wing Angle of Attack (AoA)"
          min={0}
          max={25}
          step={1}
          value={wingAngle}
          unit="°"
          onChange={handleUpdateWingAngle}
        />

        <TechnicalSlider
          label="Front Splitter Extension"
          min={0}
          max={50}
          step={2}
          value={splitterExtension}
          unit="mm"
          onChange={handleUpdateSplitter}
        />
      </div>

      {/* Aerodynamic Modular Switches */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
          Aero Surface Actuation
        </span>

        {/* Dual Dive Planes Toggle */}
        <button
          onClick={handleToggleDivePlanes}
          className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
            divePlanesEnabled
              ? 'bg-red-950/40 border-gt-accent text-white font-bold ring-1 ring-gt-accent'
              : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          aria-label="Toggle dual front dive planes"
        >
          <div>
            <div className="text-xs text-white">Dual Carbon Dive Planes (Canards)</div>
            <div className="text-[10px] text-zinc-500">+35 kg Front Downforce at 250 km/h</div>
          </div>
          {divePlanesEnabled && <Check className="w-4 h-4 text-gt-accent shrink-0" />}
        </button>

        {/* Active DRS Mode Toggle */}
        <button
          onClick={handleToggleDrs}
          className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
            drsActive
              ? 'bg-blue-950/50 border-gt-info text-white font-bold ring-1 ring-gt-info'
              : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          aria-label="Toggle Drag Reduction System"
        >
          <div>
            <div className="text-xs text-white">Active DRS (Drag Reduction System)</div>
            <div className="text-[10px] text-zinc-500">
              {drsActive ? 'DRS Active — Wing Trim Flattened for V-Max' : 'DRS Standby — Maximum Apex Grip'}
            </div>
          </div>
          <span
            className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              drsActive ? 'bg-gt-info text-white' : 'bg-white/5 text-zinc-400'
            }`}
          >
            {drsActive ? 'OPEN' : 'CLOSED'}
          </span>
        </button>
      </div>

      <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-zinc-400 space-y-1">
        <div className="flex justify-between">
          <span>Venturi Underfloor Tunnel:</span>
          <span className="text-white font-bold">CARBON 3D DIFFUSER</span>
        </div>
        <div className="flex justify-between">
          <span>Strake Ground Clearance:</span>
          <span className="text-emerald-400 font-bold">18 mm FLUSH</span>
        </div>
      </div>
    </div>
  );
};
