import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  Car,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import libraryIndex from '../../../public/vehicles/index.json';
import { BrandBadge } from '../ui/BrandBadge';
import { getManufacturerBrand } from '../../data/manufacturerBrands';
import { getVehicleTechnicalSpecs } from '../../data/vehicleTechnicalSpecs';

interface VehicleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All 50 Vehicles' },
  { id: 'supercars', label: 'Supercars' },
  { id: 'hypercars', label: 'Hypercars' },
  { id: 'track_cars', label: 'Track Specials' },
  { id: 'sports_cars', label: 'Sports Cars' },
  { id: 'luxury_cars', label: 'Luxury GT' },
  { id: 'jdm_cars', label: 'JDM Performance' },
  { id: 'muscle_cars', label: 'Muscle' }
];

export const VehicleSelectionModal: React.FC<VehicleSelectionModalProps> = ({ isOpen, onClose }) => {
  const { activeFile, loadVehicleByFile } = useVehicleStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // All 50 vehicles from libraryIndex.assets
  const vehicles = useMemo(() => {
    return libraryIndex.assets.map(asset => {
      const specs = getVehicleTechnicalSpecs(asset.asset_id);
      return {
        ...asset,
        specs,
        doorMechanism: specs.doorMechanism
      };
    });
  }, []);

  const manufacturers = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => set.add(v.manufacturer));
    return ['all', ...Array.from(set).sort()];
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchSearch =
        search === '' ||
        v.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.asset_id.toLowerCase().includes(search.toLowerCase()) ||
        (v.body_style && v.body_style.toLowerCase().includes(search.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || v.category === selectedCategory;

      const matchManufacturer =
        selectedManufacturer === 'all' || v.manufacturer === selectedManufacturer;

      return matchSearch && matchCategory && matchManufacturer;
    });
  }, [vehicles, search, selectedCategory, selectedManufacturer]);

  if (!isOpen) return null;

  const handleSelectVehicle = (fileName: string) => {
    loadVehicleByFile(fileName);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-selector-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-5xl h-[86vh] bg-gt-basalt border border-gt-border rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gt-border bg-gt-graphite flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/80 flex items-center justify-center">
              <Car className="w-5 h-5 text-gt-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="vehicle-selector-title" className="text-base font-heading font-bold text-white">
                  Switch Active Supercar
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-gt-obsidian text-gt-accent border border-gt-border font-semibold">
                  {filteredVehicles.length} of {vehicles.length} Models
                </span>
              </div>
              <p className="text-xs text-gt-text-secondary mt-0.5">
                Full Schema 2.0 kinematic aperture models with OEM heritage colors and powertrain specifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Close modal (Esc)"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar: Search, Category Tabs, Manufacturer Dropdown */}
        <div className="p-4 border-b border-gt-border bg-gt-basalt space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by make, model, powertrain or body style..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gt-obsidian border border-gt-border focus:border-gt-accent focus:ring-1 focus:ring-gt-accent text-white placeholder-zinc-500 text-xs rounded-lg pl-9 pr-8 py-2 outline-none transition-colors"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Manufacturer Dropdown */}
            <div className="w-full sm:w-60 shrink-0">
              <select
                value={selectedManufacturer}
                onChange={e => setSelectedManufacturer(e.target.value)}
                className="w-full bg-gt-obsidian border border-gt-border focus:border-gt-accent text-zinc-200 text-xs rounded-lg px-3 py-2 outline-none transition-colors cursor-pointer"
              >
                <option value="all" className="bg-gt-basalt text-white">All Manufacturers ({manufacturers.length - 1})</option>
                {manufacturers.filter(m => m !== 'all').map(m => (
                  <option key={m} value={m} className="bg-gt-basalt text-white">{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-red-950/80 text-white border border-red-800 shadow-sm font-semibold'
                    : 'bg-gt-obsidian text-zinc-400 hover:text-zinc-200 border border-gt-border hover:border-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredVehicles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500 space-y-2">
              <Car className="w-10 h-10 stroke-[1.5] text-zinc-600" />
              <p className="text-sm font-medium text-zinc-400">No vehicles match your search criteria</p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedManufacturer('all'); }}
                className="text-xs text-gt-accent hover:underline font-mono"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredVehicles.map(veh => {
                const isCurrent = activeFile === veh.file || activeFile.endsWith(veh.file);
                const brand = getManufacturerBrand(veh.manufacturer);

                return (
                  <div
                    key={veh.asset_id}
                    onClick={() => handleSelectVehicle(veh.file)}
                    className={`group relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                      isCurrent
                        ? 'bg-[#0E1218] border-gt-accent shadow-lg shadow-red-950/20 ring-1 ring-gt-accent'
                        : 'bg-gt-obsidian border-gt-border hover:border-zinc-500 hover:bg-[#0E1218]'
                    }`}
                  >
                    {/* Top Heritage Accent Line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5"
                      style={{
                        background: `linear-gradient(90deg, ${brand.brandColor} 0%, transparent 100%)`,
                        opacity: isCurrent ? 1 : 0.6
                      }}
                    />

                    <div>
                      {/* Top Badges & Crest */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <BrandBadge
                          manufacturer={veh.manufacturer}
                          size="xs"
                          showWordmark={true}
                        />
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-gt-graphite border border-white/5">
                            {veh.doorMechanism}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-950/60 border border-red-800 px-1.5 py-0.5 rounded">
                              <Check className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Brand */}
                      <div className="mb-2">
                        <h3 className="text-sm font-heading font-bold text-white group-hover:text-red-400 transition-colors truncate">
                          {veh.model}
                        </h3>
                        <span className="text-[11px] font-mono text-zinc-400 block mt-0.5 truncate">
                          {veh.generation} • {veh.year || 2024} • {veh.specs.powertrain}
                        </span>
                      </div>

                      {/* Key Performance Indicators */}
                      <div className="grid grid-cols-3 gap-1.5 py-1.5 px-2 rounded-lg bg-black/40 border border-white/5 text-center text-xs font-mono my-2">
                        <div>
                          <span className="text-[9px] text-zinc-500 block">POWER</span>
                          <span className="text-white font-bold tabular-nums text-[11px]">{veh.specs.powerHp} HP</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">TOP SPD</span>
                          <span className="text-white font-bold tabular-nums text-[11px]">{veh.specs.topSpeedKmh} KMH</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">0-100</span>
                          <span className="text-white font-bold tabular-nums text-[11px]">{veh.specs.zeroToHundredS}s</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2 border-t border-gt-border flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-zinc-400">
                        {veh.category.replace(/_/g, ' ')}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectVehicle(veh.file);
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                          isCurrent
                            ? 'bg-gt-accent text-white font-bold shadow-sm'
                            : 'bg-gt-graphite text-zinc-300 group-hover:bg-gt-accent group-hover:text-white'
                        }`}
                      >
                        <span>{isCurrent ? 'Current' : 'Select'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 px-5 border-t border-gt-border bg-gt-graphite flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px]">All 50 vehicles verified Schema 2.0 with OEM geometry</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gt-obsidian hover:bg-zinc-800 text-zinc-200 border border-gt-border font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
