import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Copy,
  Layers,
  Car,
  Check,
  Star
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { toHex32 } from '../../utils/joaat';
import { resolveVehicleColor } from '../../utils/colorUtils';

const CATEGORIES = [
  'All Categories',
  'Supercar',
  'Sports Car',
  'Tuner / Compact',
  'SUV / Offroad',
  'Muscle',
  'Special / Concept'
];

export const VehicleLibraryView: React.FC = () => {
  const { allFiles, allModels, assetBindings, loadVehicleByFile, setActiveView } = useVehicleStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Distinct manufacturers
  const manufacturers = useMemo(() => {
    const set = new Set<string>();
    allModels.forEach(m => set.add(m.manufacturer));
    return ['All', ...Array.from(set).sort()];
  }, [allModels]);

  const toggleFavorite = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(fileName)) next.delete(fileName);
      else next.add(fileName);
      return next;
    });
  };

  // Filtered files
  const filteredFiles = useMemo(() => {
    return allFiles.filter(veh => {
      // Search
      const matchSearch =
        searchTerm === '' ||
        veh.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.realWorldModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.plateText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.modelHash.toString().includes(searchTerm) ||
        toHex32(veh.modelHash).toLowerCase().includes(searchTerm.toLowerCase());

      // Category
      const matchCat =
        selectedCategory === 'All Categories' || veh.category === selectedCategory;

      // Manufacturer
      const matchMan =
        selectedManufacturer === 'All' || veh.manufacturer === selectedManufacturer;

      return matchSearch && matchCat && matchMan;
    });
  }, [allFiles, searchTerm, selectedCategory, selectedManufacturer]);

  const handleSelectVehicle = (fileName: string) => {
    loadVehicleByFile(fileName);
    setActiveView('studio');
  };

  return (
    <div className="h-full flex flex-col bg-autoverse-bg overflow-hidden">
      {/* Top Bar: Search and Filters */}
      <div className="p-5 border-b border-autoverse-border bg-autoverse-surface space-y-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-100">Vehicle Fleet Library</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-autoverse-elevated text-autoverse-cyan border border-autoverse-borderLight">
                {filteredFiles.length} / {allFiles.length} Specifications
              </span>
            </div>
            <p className="text-xs text-autoverse-muted mt-0.5">
              Explore 108 vehicle configurations across 74 unique automotive chassis
            </p>
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative w-64 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search model, BMW, Porsche, hash..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded bg-autoverse-elevated border border-autoverse-border focus:border-autoverse-cyan text-xs text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
              />
            </div>

            <div className="flex items-center p-0.5 rounded bg-autoverse-elevated border border-autoverse-border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-autoverse-overlay text-autoverse-cyan' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-autoverse-overlay text-autoverse-cyan' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters: Categories & Manufacturers */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-autoverse-border/40">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-autoverse-cyan text-slate-950 font-bold shadow-sm'
                    : 'bg-autoverse-elevated text-slate-400 hover:text-slate-200 hover:bg-autoverse-overlay border border-autoverse-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Manufacturer Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-autoverse-muted">Brand:</span>
            <select
              value={selectedManufacturer}
              onChange={e => setSelectedManufacturer(e.target.value)}
              className="px-2.5 py-1 rounded bg-autoverse-elevated border border-autoverse-border text-xs text-slate-200 outline-none cursor-pointer focus:border-autoverse-cyan"
            >
              {manufacturers.map(m => (
                <option key={m} value={m} className="bg-autoverse-surface text-slate-200">
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Vehicles Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredFiles.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <Car className="w-10 h-10 text-slate-600" />
            <p className="text-sm">No vehicles matched your search criteria.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All Categories'); setSelectedManufacturer('All'); }}
              className="text-xs text-autoverse-cyan hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map(veh => {
              const paint = resolveVehicleColor(veh.isPrimaryColorCustom, veh.customPrimaryColor, veh.primaryColor);
              const isBound = !!assetBindings[veh.modelHash];
              const isFav = favorites.has(veh.fileName);
              const isDuplicate = veh.fileName === '2F2FSUPRA_Retro_Shade.json' || veh.fileName === 'lulli.json';

              return (
                <div
                  key={veh.fileName}
                  onClick={() => handleSelectVehicle(veh.fileName)}
                  className="group relative p-4 rounded-lg bg-autoverse-surface border border-autoverse-border hover:border-autoverse-cyan/60 hover:bg-autoverse-elevated cursor-pointer transition-all duration-150 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Tags */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-autoverse-overlay text-slate-300">
                        {veh.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isDuplicate && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-autoverse-purple/10 text-autoverse-purple border border-autoverse-purple/30" title="Byte-for-byte duplicate config found">
                            DUP
                          </span>
                        )}
                        <button
                          onClick={e => toggleFavorite(veh.fileName, e)}
                          className="p-1 rounded text-slate-400 hover:text-autoverse-amber transition-colors"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-autoverse-amber text-autoverse-amber' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Paint Swatch & Identity */}
                    <div className="flex items-start gap-3">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0 mt-0.5 shadow-sm"
                        style={{ backgroundColor: paint.hex }}
                        title={`Paint: ${paint.name} (${paint.hex})`}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-autoverse-cyan transition-colors truncate">
                          {veh.realWorldModel}
                        </h3>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {veh.displayName}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="mt-3.5 pt-2.5 border-t border-autoverse-border/50 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Chassis Hash:</span>
                        <span className="font-mono text-autoverse-cyan">{toHex32(veh.modelHash)}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Plate Text:</span>
                        <span className="font-mono font-semibold text-slate-200">{veh.plateText || 'NONE'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Tuning Mods:</span>
                        <span className="font-mono text-slate-300">{veh.activeModsCount} active slots</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Status */}
                  <div className="mt-4 pt-2.5 border-t border-autoverse-border/60 flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isBound ? 'bg-autoverse-emerald/10 text-autoverse-emerald' : 'bg-autoverse-amber/10 text-autoverse-amber'
                    }`}>
                      {isBound ? '● 3D Mesh Mapped' : '○ Asset Unassigned'}
                    </span>
                    <span className="text-autoverse-cyan text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Load 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="rounded-lg bg-autoverse-surface border border-autoverse-border overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-autoverse-border bg-autoverse-elevated/80 text-slate-400 font-medium">
                  <th className="py-2.5 px-4">Vehicle Model</th>
                  <th className="py-2.5 px-4">Manufacturer</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Model Hash</th>
                  <th className="py-2.5 px-4">Paint Color</th>
                  <th className="py-2.5 px-4">Plate</th>
                  <th className="py-2.5 px-4">Asset Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-autoverse-border/60">
                {filteredFiles.map(veh => {
                  const paint = resolveVehicleColor(veh.isPrimaryColorCustom, veh.customPrimaryColor, veh.primaryColor);
                  const isBound = !!assetBindings[veh.modelHash];

                  return (
                    <tr
                      key={veh.fileName}
                      onClick={() => handleSelectVehicle(veh.fileName)}
                      className="hover:bg-autoverse-elevated cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-100">
                        {veh.realWorldModel}
                        <div className="text-[11px] text-slate-400 font-normal">{veh.fileName}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{veh.manufacturer}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-autoverse-overlay text-slate-300">
                          {veh.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-autoverse-cyan">{toHex32(veh.modelHash)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: paint.hex }}
                          />
                          <span className="text-slate-300 text-[11px] truncate max-w-[100px]">{paint.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-200">{veh.plateText || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isBound ? 'bg-autoverse-emerald/10 text-autoverse-emerald' : 'bg-autoverse-amber/10 text-autoverse-amber'
                        }`}>
                          {isBound ? 'Mapped' : 'Missing'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-xs text-autoverse-cyan hover:underline font-semibold">
                          Open in 3D
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

