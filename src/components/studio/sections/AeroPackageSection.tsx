import React, { useState } from 'react';
import { Wind, Gauge, ShieldAlert } from 'lucide-react';
import { useVehicleStore } from '../../../hooks/useVehicleStore';
import { TechnicalSlider } from '../../ui/TechnicalSlider';
import { getVehicleTechnicalSpecs } from '../../../data/vehicleTechnicalSpecs';

export const AeroPackageSection: React.FC = () => {
  const { activeFile, activeModel } = useVehicleStore();
  const specs = getVehicleTechnicalSpecs(activeFile || activeModel?.codeName || '');

  const [wingAngle, setWingAngle] = useState(15);
  const [splitterExtension, setSplitterExtension] = useState(10);

  // Computed aerodynamic telemetry
  const baseDownforce = specs.downforceKg || 380;
  const downforceFactor = 1 + (wingAngle / 45) * 0.45 + (splitterExtension / 40) * 0.15;
  const computedDownforce = Math.round(baseDownforce * downforceFactor);
  const dragDelta = ((wingAngle / 45) * 0.045).toFixed(3);
  const frontBalance = Math.round(40 + (splitterExtension / 40) * 5);
  const rearBalance = 100 - frontBalance;

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Dynamic Aero Telemetry Readout */}
      <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-gt-info" />
            Downforce Telemetry
          </span>
          <span className="text-[10px] text-gt-info font-bold">
            @{specs.downforceSpeedKmh || 250} KM/H
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-zinc-500 block">TOTAL LOAD</span>
            <span className="text-sm font-bold text-white tabular-nums">{computedDownforce} kg</span>
          </div>
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-zinc-500 block">DRAG DELTA</span>
            <span className="text-sm font-bold text-amber-400 tabular-nums">+{dragDelta}</span>
          </div>
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-zinc-500 block">AERO BALANCE</span>
            <span className="text-sm font-bold text-gt-info tabular-nums">{frontBalance}/{rearBalance}</span>
          </div>
        </div>
      </div>

      {/* Aerodynamic Calibration Sliders */}
      <div className="space-y-4 p-3.5 rounded-xl bg-white/5 border border-white/5">
        <TechnicalSlider
          label="Rear Wing Angle of Attack"
          min={0}
          max={45}
          step={1}
          value={wingAngle}
          unit="°"
          onChange={setWingAngle}
        />

        <TechnicalSlider
          label="Front Splitter Extension"
          min={0}
          max={40}
          step={2}
          value={splitterExtension}
          unit="mm"
          onChange={setSplitterExtension}
        />
      </div>

      <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-zinc-400 space-y-1">
        <div className="flex justify-between">
          <span>Active DRS Wing Mode:</span>
          <span className="text-emerald-400 font-bold">AVAILABLE</span>
        </div>
        <div className="flex justify-between">
          <span>Ground Effect Venturi Diffuser:</span>
          <span className="text-white font-bold">CARBON 3D TUNNEL</span>
        </div>
      </div>
    </div>
  );
};
