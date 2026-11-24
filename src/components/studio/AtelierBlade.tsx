import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  DoorOpen,
  Paintbrush,
  Disc,
  Wind,
  Layers,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { useUiStore } from '../../state/useUiStore';
import { BrandBadge } from '../ui/BrandBadge';
import { getManufacturerBrand } from '../../data/manufacturerBrands';
import { getVehicleTechnicalSpecs } from '../../data/vehicleTechnicalSpecs';
import { PaintStudioSection } from './sections/PaintStudioSection';
import { WheelStudioSection } from './sections/WheelStudioSection';
import { VehicleAccessSection } from './sections/VehicleAccessSection';
import { AeroPackageSection } from './sections/AeroPackageSection';
import { CockpitTrimSection } from './sections/CockpitTrimSection';
import { ExhaustOpticsSection } from './sections/ExhaustOpticsSection';

interface StudioTabDef {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const STUDIO_TABS: StudioTabDef[] = [
  { id: 'paint', label: 'Paint', icon: Paintbrush },
  { id: 'wheels', label: 'Wheels', icon: Disc },
  { id: 'aero', label: 'Aero', icon: Wind },
  { id: 'exhaust', label: 'Exhaust', icon: Volume2 },
  { id: 'cockpit', label: 'Cockpit', icon: Layers },
  { id: 'access', label: 'Access', icon: DoorOpen }
];

export const AtelierBlade: React.FC = () => {
  const {
    activeModel,
    activeFile
  } = useVehicleStore();

  const {
    isBladeCollapsed,
    toggleBladeCollapsed,
    activeStudioTab,
    setActiveStudioTab,
    isOrbitDragging,
    mobileSheetState,
    setMobileSheetState,
    cycleMobileSheetState
  } = useUiStore();

  const brand = getManufacturerBrand(activeModel?.manufacturer || 'Porsche');
  const specs = getVehicleTechnicalSpecs(activeFile || activeModel?.codeName || '');

  // Render tab navigation pills
  const renderTabNavigation = () => (
    <div className="flex items-center p-1.5 phone-landscape:p-1 border-b border-white/10 bg-black/40 gap-1 overflow-x-auto no-scrollbar shrink-0 text-xs font-mono">
      {STUDIO_TABS.map(tab => {
        const isActive = activeStudioTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveStudioTab(tab.id)}
            className={`flex-1 py-1.5 phone-landscape:py-1 px-2 phone-landscape:px-1.5 rounded-lg flex items-center justify-center gap-1.5 phone-landscape:gap-1 transition-all text-xs phone-landscape:text-[10px] cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-gt-accent text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-3.5 h-3.5 phone-landscape:w-3 phone-landscape:h-3 shrink-0" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  // Render active studio section content
  const renderTabContent = () => (
    <div className="flex-1 overflow-y-auto p-4 phone-landscape:p-2.5 space-y-4 phone-landscape:space-y-2.5">
      {activeStudioTab === 'paint' && <PaintStudioSection />}
      {activeStudioTab === 'wheels' && <WheelStudioSection />}
      {activeStudioTab === 'aero' && <AeroPackageSection />}
      {activeStudioTab === 'exhaust' && <ExhaustOpticsSection />}
      {activeStudioTab === 'cockpit' && <CockpitTrimSection />}
      {activeStudioTab === 'access' && <VehicleAccessSection />}
    </div>
  );

  return (
    <>
      {/* ============================================================ */}
      {/* 1. ATELIER BLADE (Desktop & Phone Landscape side drawer)    */}
      {/* ============================================================ */}
      <aside
        aria-label="Atelier Customization Blade"
        className={`hidden md:flex phone-landscape:flex desktop-blade-container absolute right-5 top-20 bottom-5 phone-landscape:right-2 phone-landscape:top-10 phone-landscape:bottom-2 z-20 transition-all duration-300 ease-in-out select-none ${
          isBladeCollapsed
            ? 'translate-x-[calc(100%-2.5rem)] phone-landscape:translate-x-[calc(100%-2rem)]'
            : 'translate-x-0'
        } ${
          isOrbitDragging ? 'opacity-15 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        {/* Collapse / Expand Toggle Spine */}
        <button
          onClick={toggleBladeCollapsed}
          className="w-10 phone-landscape:w-8 h-16 phone-landscape:h-12 self-center -mr-2 z-30 rounded-l-xl bg-gt-basalt/90 hover:bg-gt-graphite border-y border-l border-gt-border backdrop-blur-xl flex items-center justify-center text-zinc-400 hover:text-white shadow-xl transition-all cursor-pointer"
          title={isBladeCollapsed ? 'Expand Atelier Blade (])' : 'Collapse Atelier Blade ([)'}
          aria-label={isBladeCollapsed ? 'Expand Atelier Blade' : 'Collapse Atelier Blade'}
        >
          {isBladeCollapsed ? (
            <ChevronLeft className="w-5 h-5 phone-landscape:w-4 phone-landscape:h-4 text-gt-accent" />
          ) : (
            <ChevronRight className="w-5 h-5 phone-landscape:w-4 phone-landscape:h-4" />
          )}
        </button>

        {/* Main Glass Blade Body */}
        <div className="w-[380px] phone-landscape:w-[280px] h-full rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          {/* Top Header: Brand Heritage & Vehicle Identity */}
          <div className="p-4 phone-landscape:p-2.5 border-b border-white/10 bg-white/5 space-y-1.5 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <BrandBadge
                manufacturer={activeModel?.manufacturer || 'Porsche'}
                size="sm"
                showWordmark={true}
                showCountry={true}
              />

              <span className="text-[10px] phone-landscape:text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-gt-accent border border-white/10 font-bold uppercase">
                {specs.doorMechanism}
              </span>
            </div>

            <div>
              <h2 className="text-base phone-landscape:text-xs font-heading font-bold text-white truncate">
                {activeModel?.realWorldModel || activeModel?.displayName || activeFile}
              </h2>
              <p className="text-[11px] phone-landscape:text-[9px] font-mono text-zinc-400 truncate mt-0.5">
                {specs.powertrain} • {specs.powerHp} HP • {specs.topSpeedKmh} KM/H
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          {renderTabNavigation()}

          {/* Tab Content Stage */}
          {renderTabContent()}

          {/* Blade Bottom Footer Status */}
          <div className="p-3 phone-landscape:p-2 px-4 phone-landscape:px-2.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] phone-landscape:text-[9px] text-zinc-400 shrink-0 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Atelier Synchronized</span>
            </div>
            <span className="text-zinc-500">AutoVerse 3D</span>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MOBILE RESPONSIVE BOTTOM SHEET (Portrait mobile viewports) */}
      {/* Automatically hidden in phone landscape in favor of side blade */}
      {/* ============================================================ */}
      <aside
        aria-label="Mobile Atelier Sheet"
        className={`flex md:hidden phone-landscape:hidden mobile-sheet-container fixed inset-x-0 bottom-0 z-30 transition-all duration-300 ease-out select-none flex-col rounded-t-3xl bg-black/85 backdrop-blur-2xl border-t border-x border-white/15 shadow-2xl overflow-hidden ${
          mobileSheetState === 'collapsed'
            ? 'h-14'
            : mobileSheetState === 'half'
            ? 'h-[45vh]'
            : 'h-[85vh]'
        } ${
          isOrbitDragging ? 'opacity-20 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        {/* Grabber Handle & Mobile Header Capsule */}
        <div
          onClick={cycleMobileSheetState}
          className="p-3 px-4 border-b border-white/10 bg-white/5 flex items-center justify-between cursor-pointer select-none shrink-0"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-1 rounded-full bg-zinc-500/70 mr-1 shrink-0" />
            <BrandBadge
              manufacturer={activeModel?.manufacturer || 'Porsche'}
              size="sm"
              showWordmark={false}
            />
            <div className="overflow-hidden">
              <h2 className="text-xs font-heading font-bold text-white truncate">
                {activeModel?.realWorldModel || activeModel?.displayName || activeFile}
              </h2>
              <p className="text-[10px] font-mono text-zinc-400 truncate">
                {specs.powerHp} HP • {specs.doorMechanism}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              {mobileSheetState}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                cycleMobileSheetState();
              }}
              className="p-1 rounded text-zinc-400 hover:text-white"
              aria-label="Toggle mobile sheet height"
            >
              {mobileSheetState === 'expanded' ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gt-accent" />
              )}
            </button>
          </div>
        </div>

        {/* Content rendered when half or expanded */}
        {mobileSheetState !== 'collapsed' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderTabNavigation()}
            {renderTabContent()}
          </div>
        )}
      </aside>
    </>
  );
};
