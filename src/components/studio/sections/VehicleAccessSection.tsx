import React from 'react';
import { DoorOpen, RotateCcw, ShieldCheck } from 'lucide-react';
import { useVehicleStore } from '../../../hooks/useVehicleStore';
import { TechnicalSlider } from '../../ui/TechnicalSlider';
import { getVehicleTechnicalSpecs } from '../../../data/vehicleTechnicalSpecs';

export const VehicleAccessSection: React.FC = () => {
  const {
    activeFile,
    activeModel,
    openingState,
    setOpeningState,
    openAllApertures,
    closeAllApertures
  } = useVehicleStore();

  const specs = getVehicleTechnicalSpecs(activeFile || activeModel?.codeName || '');

  const areAperturesOpen = Boolean(
    (openingState?.doorFrontLeft || 0) > 0.05 ||
    (openingState?.doorFrontRight || 0) > 0.05 ||
    (openingState?.hood || 0) > 0.05 ||
    (openingState?.boot || 0) > 0.05
  );

  const handleUpdateAperture = (key: 'doorFrontLeft' | 'doorFrontRight' | 'hood' | 'boot', percentVal: number) => {
    setOpeningState({ [key]: percentVal / 100 });
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Mechanism Architecture Info */}
      <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-zinc-500 block uppercase">Kinematic Aperture Type</span>
          <span className="text-xs font-heading font-bold text-white">{specs.doorMechanism}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
          areAperturesOpen ? 'bg-amber-950/60 text-amber-300 border border-amber-800' : 'bg-black/40 text-zinc-400'
        }`}>
          {areAperturesOpen ? 'APERTURES OPEN' : 'ALL SEALED'}
        </span>
      </div>

      {/* Global Open/Close Everything Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={openAllApertures}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            areAperturesOpen
              ? 'bg-gt-accent text-white shadow-lg ring-1 ring-gt-accent'
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
          }`}
        >
          <span>OPEN EVERYTHING</span>
        </button>

        <button
          onClick={closeAllApertures}
          className="py-2 px-3 rounded-lg bg-black/40 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>CLOSE ALL</span>
        </button>
      </div>

      {/* Individual Aperture Precision Sliders */}
      <div className="space-y-4 p-3.5 rounded-xl bg-white/5 border border-white/5">
        <TechnicalSlider
          label="Driver Door"
          min={0}
          max={100}
          step={5}
          value={Math.round((openingState?.doorFrontLeft || 0) * 100)}
          unit="%"
          onChange={val => handleUpdateAperture('doorFrontLeft', val)}
        />

        <TechnicalSlider
          label="Passenger Door"
          min={0}
          max={100}
          step={5}
          value={Math.round((openingState?.doorFrontRight || 0) * 100)}
          unit="%"
          onChange={val => handleUpdateAperture('doorFrontRight', val)}
        />

        <TechnicalSlider
          label="Engine Bay / Clamshell"
          min={0}
          max={100}
          step={5}
          value={Math.round((openingState?.hood || 0) * 100)}
          unit="%"
          onChange={val => handleUpdateAperture('hood', val)}
        />

        <TechnicalSlider
          label="Luggage Boot"
          min={0}
          max={100}
          step={5}
          value={Math.round((openingState?.boot || 0) * 100)}
          unit="%"
          onChange={val => handleUpdateAperture('boot', val)}
        />
      </div>
    </div>
  );
};
