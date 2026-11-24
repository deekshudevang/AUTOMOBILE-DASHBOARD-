import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  DoorOpen,
  Paintbrush,
  Disc,
  Wind,
  Layers,
  Sparkles,
  Sliders,
  Check,
  RotateCcw
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { useUiStore } from '../../state/useUiStore';
import { BrandBadge } from '../ui/BrandBadge';
import { getManufacturerBrand } from '../../data/manufacturerBrands';
import { getVehicleTechnicalSpecs } from '../../data/vehicleTechnicalSpecs';

interface StudioTabDef {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const STUDIO_TABS: StudioTabDef[] = [
  { id: 'access', label: 'Access', icon: DoorOpen },
  { id: 'paint', label: 'Paint', icon: Paintbrush },
  { id: 'wheels', label: 'Wheels', icon: Disc },
  { id: 'aero', label: 'Aero', icon: Wind },
  { id: 'cockpit', label: 'Cockpit', icon: Layers }
];

export const AtelierBlade: React.FC = () => {
  const {
    activeModel,
    activeFile,
    openingState,
    openAllApertures,
    closeAllApertures
  } = useVehicleStore();

  const {
    isBladeCollapsed,
    toggleBladeCollapsed,
    activeStudioTab,
    setActiveStudioTab,
    isOrbitDragging
  } = useUiStore();

  const brand = getManufacturerBrand(activeModel?.manufacturer || 'Porsche');
  const specs = getVehicleTechnicalSpecs(activeFile || activeModel?.codeName || '');

  const areAperturesOpen = Boolean(
    (openingState?.doorFrontLeft || 0) > 0.05 ||
    (openingState?.doorFrontRight || 0) > 0.05 ||
    (openingState?.hood || 0) > 0.05 ||
    (openingState?.boot || 0) > 0.05
  );

  return (
    <aside
      aria-label="Atelier Customization Blade"
      className={`absolute right-5 top-20 bottom-5 z-20 flex transition-all duration-300 ease-in-out select-none ${
        isBladeCollapsed ? 'translate-x-[calc(100%-2.5rem)]' : 'translate-x-0'
      } ${
        isOrbitDragging ? 'opacity-15 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Collapse / Expand Toggle Spine */}
      <button
        onClick={toggleBladeCollapsed}
        className="w-10 h-16 self-center -mr-2 z-30 rounded-l-xl bg-gt-basalt/90 hover:bg-gt-graphite border-y border-l border-gt-border backdrop-blur-xl flex items-center justify-center text-zinc-400 hover:text-white shadow-xl transition-all cursor-pointer"
        title={isBladeCollapsed ? 'Expand Atelier Blade (])' : 'Collapse Atelier Blade ([)'}
        aria-label={isBladeCollapsed ? 'Expand Atelier Blade' : 'Collapse Atelier Blade'}
      >
        {isBladeCollapsed ? <ChevronLeft className="w-5 h-5 text-gt-accent" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Main Glass Blade Body */}
      <div className="w-[380px] h-full rounded-2xl bg-black/65 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header: Brand Heritage & Vehicle Identity */}
        <div className="p-4 border-b border-white/10 bg-white/5 space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <BrandBadge
              manufacturer={activeModel?.manufacturer || 'Porsche'}
              size="sm"
              showWordmark={true}
              showCountry={true}
            />

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-gt-accent border border-white/10 font-bold uppercase">
              {specs.doorMechanism}
            </span>
          </div>

          <div>
            <h2 className="text-base font-heading font-bold text-white truncate">
              {activeModel?.realWorldModel || activeModel?.displayName || activeFile}
            </h2>
            <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
              {specs.powertrain} • {specs.powerHp} HP • {specs.topSpeedKmh} KM/H
            </p>
          </div>
        </div>

        {/* Studio Workspace Category Navigation Tabs */}
        <div className="flex items-center p-1.5 border-b border-white/10 bg-black/40 gap-1 overflow-x-auto no-scrollbar shrink-0 text-xs font-mono">
          {STUDIO_TABS.map(tab => {
            const isActive = activeStudioTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveStudioTab(tab.id)}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs ${
                  isActive
                    ? 'bg-gt-accent text-white font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Stage */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
          {/* Quick Vehicle Kinematics Access (Always accessible or on Access tab) */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <DoorOpen className="w-3.5 h-3.5 text-gt-accent" />
                Kinematic Apertures
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                areAperturesOpen ? 'bg-amber-950/60 text-amber-300 border border-amber-800' : 'bg-black/40 text-zinc-400'
              }`}>
                {areAperturesOpen ? 'APERTURES OPEN' : 'SEALED'}
              </span>
            </div>

            {/* Global Open/Close Everything Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={openAllApertures}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  areAperturesOpen
                    ? 'bg-gt-accent text-white shadow-lg ring-1 ring-gt-accent'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                }`}
              >
                <span>OPEN EVERYTHING</span>
              </button>

              <button
                onClick={closeAllApertures}
                className="py-2 px-3 rounded-lg bg-black/40 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>CLOSE ALL</span>
              </button>
            </div>

            {/* Aperture Status Chips */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-400">Driver Door:</span>
                <span className={(openingState?.doorFrontLeft || 0) > 0 ? 'text-gt-accent font-bold' : 'text-zinc-500'}>
                  {Math.round((openingState?.doorFrontLeft || 0) * 100)}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-400">Passenger Door:</span>
                <span className={(openingState?.doorFrontRight || 0) > 0 ? 'text-gt-accent font-bold' : 'text-zinc-500'}>
                  {Math.round((openingState?.doorFrontRight || 0) * 100)}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-400">Engine Clamshell:</span>
                <span className={(openingState?.hood || 0) > 0 ? 'text-gt-accent font-bold' : 'text-zinc-500'}>
                  {Math.round((openingState?.hood || 0) * 100)}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-400">Luggage Boot:</span>
                <span className={(openingState?.boot || 0) > 0 ? 'text-gt-accent font-bold' : 'text-zinc-500'}>
                  {Math.round((openingState?.boot || 0) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Performance & Chassis Specs Telemetry */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-xs font-heading font-bold text-white uppercase tracking-wider block">
              Vehicle Chassis Telemetry
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Powertrain:</span>
                <span className="text-zinc-200 font-semibold">{specs.powertrain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Aero Downforce:</span>
                <span className="text-zinc-200 font-semibold">{specs.downforceKg} kg @ {specs.downforceSpeedKmh} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Drag Coefficient:</span>
                <span className="text-zinc-200 font-semibold">{specs.dragCoefficient} Cd</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Drivetrain:</span>
                <span className="text-gt-info font-semibold">{specs.drivetrain}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blade Bottom Footer Status */}
        <div className="p-3 px-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-zinc-400 shrink-0 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Atelier Stage Active</span>
          </div>
          <span className="text-zinc-500">AutoVerse 3D</span>
        </div>
      </div>
    </aside>
  );
};
