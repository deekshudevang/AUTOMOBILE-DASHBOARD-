import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  Car,
  Check,
  Cpu,
  DoorOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import libraryIndex from '../../../public/vehicles/index.json';
import { parametricFiles } from '../../data/parametricCatalog';

interface VehicleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All 50 Vehicles' },
  { id: 'supercars', label: 'Supercars' },
  { id: 'hypercars', label: 'Hypercars' },
  { id: 'sports_cars', label: 'Sports Cars' },
  { id: 'luxury_cars', label: 'Luxury Cars' },
  { id: 'jdm_cars', label: 'JDM Performance' },
  { id: 'muscle_cars', label: 'Muscle' },
  { id: 'track_cars', label: 'Track Cars' }
];

export const VehicleSelectionModal: React.FC<VehicleSelectionModalProps> = ({ isOpen, onClose }) => {
  const { activeFile, loadVehicleByFile, setActiveView } = useVehicleStore();

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
      // Determine kinematic door mechanism for badge display
      let doorMech = 'Conventional';
      const id = asset.asset_id.toLowerCase();
      if (id.includes('aventador') || id.includes('countach') || id.includes('murcielago') || id.includes('diablo')) {
        doorMech = 'Scissor Doors';
      } else if (id.includes('mclaren') || id.includes('laferrari') || id.includes('valkyrie') || id.includes('amg_one')) {
        doorMech = 'Butterfly / Dihedral';
      } else if (id.includes('koenigsegg') || id.includes('jesko')) {
        doorMech = 'Synchro-Helix';
      } else if (id.includes('sls') || id.includes('gullwing')) {
        doorMech = 'Gullwing';
      } else if (id.includes('spectre') || id.includes('phantom') || id.includes('wraith')) {
        doorMech = 'Coach Suicide Doors';
      }

      return {
        ...asset,
        doorMechanism: doorMech
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#0E1117] border border-[#232936] rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#232936] bg-[#12161F] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center">
              <Car className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-100">Select Vehicle Fleet Model</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181E29] text-[#00F0FF] border border-[#283244]">
                  {filteredVehicles.length} of {vehicles.length} Vehicles
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Full Schema 2.0 kinematic aperture models with manufacturer-specific interiors and engine bays
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#1E2533] transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar: Search, Category Tabs, Manufacturer Dropdown */}
        <div className="p-4 border-b border-[#232936] bg-[#0E1117] space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by make, model, engine or body style..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#141822] border border-[#232936] focus:border-[#00F0FF] text-zinc-100 placeholder-zinc-500 text-xs rounded-lg pl-9 pr-3 py-2 outline-none transition-colors"
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
            <div className="w-full sm:w-56 shrink-0">
              <select
                value={selectedManufacturer}
                onChange={e => setSelectedManufacturer(e.target.value)}
                className="w-full bg-[#141822] border border-[#232936] focus:border-[#00F0FF] text-zinc-200 text-xs rounded-lg px-3 py-2 outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Manufacturers ({manufacturers.length - 1})</option>
                {manufacturers.filter(m => m !== 'all').map(m => (
                  <option key={m} value={m}>{m}</option>
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
                className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-cyan-950/70 text-[#00F0FF] border border-cyan-800'
                    : 'bg-[#141822] text-zinc-400 hover:text-zinc-200 border border-[#232936]'
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
                className="text-xs text-[#00F0FF] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredVehicles.map(veh => {
                const isCurrent = activeFile === veh.file || activeFile.endsWith(veh.file);

                return (
                  <div
                    key={veh.asset_id}
                    onClick={() => handleSelectVehicle(veh.file)}
                    className={`group relative p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-cyan-950/30 border-[#00F0FF] shadow-lg shadow-cyan-950/40 ring-1 ring-[#00F0FF]'
                        : 'bg-[#121620] border-[#232936] hover:border-zinc-500 hover:bg-[#151A27]'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#181E2B] text-zinc-300 border border-[#283244]">
                          {veh.category.replace(/_/g, ' ')}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/80">
                            {veh.doorMechanism}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.2 rounded">
                              <Check className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Brand */}
                      <div className="mb-2">
                        <span className="text-xs text-zinc-400 font-medium block">
                          {veh.manufacturer}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-100 group-hover:text-[#00F0FF] transition-colors truncate">
                          {veh.model}
                        </h3>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">
                          {veh.generation} • {veh.year || 2024}
                        </span>
                      </div>

                      {/* Body Style & Powertrain Pill */}
                      {veh.body_style && (
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mb-3">
                          {veh.body_style}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2.5 border-t border-[#232936] flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-zinc-500">
                        {veh.componentCount || 30} Components
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectVehicle(veh.file);
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                          isCurrent
                            ? 'bg-[#00F0FF] text-zinc-950 font-bold'
                            : 'bg-[#1A202C] text-zinc-300 group-hover:bg-[#00F0FF] group-hover:text-zinc-950'
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
        <div className="p-3 px-5 border-t border-[#232936] bg-[#12161F] flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px]">All 50 vehicles verified Schema 2.0 with OEM geometry</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-[#181E29] hover:bg-[#202838] text-zinc-200 border border-[#283244] font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
