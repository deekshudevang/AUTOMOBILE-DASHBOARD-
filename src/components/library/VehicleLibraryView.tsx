import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  ArrowRight,
  Layers,
  Car,
  Star,
  ShieldCheck,
  Box,
  Eye,
  X,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { toHex32 } from '../../utils/joaat';
import { resolveVehicleColor } from '../../utils/colorUtils';
import { VehicleFileSummary } from '../../types/vehicle';

const CATEGORIES = [
  'All Categories',
  'Supercar',
  'Hypercar',
  'Sports Car',
  'Luxury Car',
  'JDM Performance',
  'Muscle',
  'Track Car',
  'Special / Concept'
];

export const VehicleLibraryView: React.FC = () => {
  const { allFiles, allModels, assetBindings, loadVehicleByFile, setActiveView } = useVehicleStore();

  const [fleetTab, setFleetTab] = useState<'schema2' | 'all'>('schema2');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');
  const [fidelityFilter, setFidelityFilter] = useState<'all' | 'verified' | 'procedural'>('all');
  const [sortBy, setSortBy] = useState<'model' | 'manufacturer' | 'category'>('model');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Modal inspection state
  const [inspectedVehicle, setInspectedVehicle] = useState<VehicleFileSummary | null>(null);

  const isSchema2Vehicle = (veh: VehicleFileSummary) => {
    return (
      veh.fileName.includes('/') ||
      veh.fileName.startsWith('porsche_911_gt3_rs') ||
      !!assetBindings[veh.modelHash]?.parametricSpec ||
      assetBindings[veh.modelHash]?.assetPath === 'parametric_generator' ||
      assetBindings[veh.modelHash]?.assetPath?.includes('.json')
    );
  };

  // Distinct manufacturers
  const manufacturers = useMemo(() => {
    const set = new Set<string>();
    const source = fleetTab === 'schema2' ? allFiles.filter(isSchema2Vehicle) : allFiles;
    source.forEach(m => set.add(m.manufacturer));
    return ['All', ...Array.from(set).sort()];
  }, [allFiles, fleetTab, assetBindings]);

  const toggleFavorite = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(fileName)) next.delete(fileName);
      else next.add(fileName);
      return next;
    });
  };

  // Filtered and sorted files
  const filteredFiles = useMemo(() => {
    const list = allFiles.filter(veh => {
      const matchFleet = fleetTab === 'all' || isSchema2Vehicle(veh);

      const matchSearch =
        searchTerm === '' ||
        veh.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.realWorldModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.plateText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.modelHash.toString().includes(searchTerm) ||
        toHex32(veh.modelHash).toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat =
        selectedCategory === 'All Categories' || veh.category === selectedCategory;

      const matchMan =
        selectedManufacturer === 'All' || veh.manufacturer === selectedManufacturer;

      const isBound = !!assetBindings[veh.modelHash];
      const matchFidelity =
        fidelityFilter === 'all' ||
        (fidelityFilter === 'verified' && isBound) ||
        (fidelityFilter === 'procedural' && !isBound);

      return matchFleet && matchSearch && matchCat && matchMan && matchFidelity;
    });

    list.sort((a, b) => {
      if (sortBy === 'model') return a.realWorldModel.localeCompare(b.realWorldModel);
      if (sortBy === 'manufacturer') return a.manufacturer.localeCompare(b.manufacturer);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

    return list;
  }, [allFiles, fleetTab, searchTerm, selectedCategory, selectedManufacturer, fidelityFilter, sortBy, assetBindings]);

  const handleLaunchVehicle = (fileName: string) => {
    loadVehicleByFile(fileName);
    setActiveView('studio');
  };

  return (
    <div className="h-full flex flex-col bg-autoverse-bg overflow-hidden text-slate-100">
      {/* Top Filter Bar */}
      <div className="p-5 border-b border-autoverse-border bg-autoverse-surface space-y-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-100">Vehicle Fleet Library</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-autoverse-elevated text-cyan-300 border border-autoverse-border">
                {filteredFiles.length} of {allFiles.length} Models
              </span>
            </div>
            <p className="text-xs text-autoverse-muted mt-0.5">
              Production sports car specifications, geometry models, and CAD reference chassis
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Fleet Tier Toggle */}
            <div className="flex items-center bg-autoverse-elevated rounded-lg border border-autoverse-border p-0.5 text-xs">
              <button
                onClick={() => setFleetTab('schema2')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  fleetTab === 'schema2'
                    ? 'bg-cyan-950/90 text-[#00F0FF] border border-cyan-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>AutoVerse 50 Fleet (Schema 2.0)</span>
              </button>
              <button
                onClick={() => setFleetTab('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  fleetTab === 'all'
                    ? 'bg-cyan-950/90 text-[#00F0FF] border border-cyan-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>All Catalog Files ({allFiles.length})</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-autoverse-elevated rounded border border-autoverse-border p-0.5 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-cyan-950/80 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-cyan-950/80 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex items-center lg:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by model, brand, hash (0x...), plate..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-autoverse-elevated border border-autoverse-border rounded pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Manufacturer Filter */}
          <select
            value={selectedManufacturer}
            onChange={e => setSelectedManufacturer(e.target.value)}
            className="bg-autoverse-elevated border border-autoverse-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {manufacturers.map(m => (
              <option key={m} value={m} className="bg-slate-900 text-slate-200">
                {m === 'All' ? 'All Manufacturers' : m}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-autoverse-elevated border border-autoverse-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">
                {c}
              </option>
            ))}
          </select>

          {/* Fidelity Filter */}
          <select
            value={fidelityFilter}
            onChange={e => setFidelityFilter(e.target.value as any)}
            className="bg-autoverse-elevated border border-autoverse-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="all" className="bg-slate-900 text-slate-200">All Geometries</option>
            <option value="verified" className="bg-slate-900 text-emerald-400">Verified 3D Assets</option>
            <option value="procedural" className="bg-slate-900 text-amber-400">Procedural CAD</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <Car className="w-12 h-12 text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-300">No matching vehicles found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Adjust your search keywords or clear active category/manufacturer filters.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All Categories'); setSelectedManufacturer('All'); setFidelityFilter('all'); }}
              className="px-3 py-1.5 rounded bg-autoverse-elevated border border-autoverse-border text-xs text-cyan-300 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map(veh => {
              const paint = resolveVehicleColor(veh.isPrimaryColorCustom, veh.customPrimaryColor, veh.primaryColor);
              const isBound = !!assetBindings[veh.modelHash];
              const isFav = favorites.has(veh.fileName);

              return (
                <div
                  key={veh.fileName}
                  className="group p-4 rounded bg-autoverse-surface border border-autoverse-border hover:border-cyan-800/80 hover:bg-autoverse-elevated/70 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Category & Status Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-autoverse-elevated text-slate-300">
                        {veh.category}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={e => toggleFavorite(veh.fileName, e)}
                          className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                          title="Favorite"
                          aria-label="Favorite"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>

                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: paint.hex }}
                          title={paint.name}
                        />
                      </div>
                    </div>

                    {/* Model Info */}
                    <h2 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                      {veh.realWorldModel}
                    </h2>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {veh.manufacturer} • <span className="font-mono text-[10px] text-autoverse-cyan">{toHex32(veh.modelHash)}</span>
                    </div>

                    {/* Geometry Provenance Badge */}
                    <div className="mt-2.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                        isBound
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                      }`}>
                        {isBound ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{isBound ? 'Verified 3D Asset' : 'Procedural CAD'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-autoverse-border/70 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setInspectedVehicle(veh)}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => handleLaunchVehicle(veh.fileName)}
                      className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 text-cyan-300 font-semibold flex items-center gap-1 text-[11px] transition-colors"
                    >
                      <span>Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="border border-autoverse-border rounded overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-autoverse-surface border-b border-autoverse-border text-slate-400 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Vehicle Model</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Color</th>
                  <th className="py-2.5 px-3">Geometry Status</th>
                  <th className="py-2.5 px-3">Model Hash</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-autoverse-border/50 bg-autoverse-bg">
                {filteredFiles.map(veh => {
                  const paint = resolveVehicleColor(veh.isPrimaryColorCustom, veh.customPrimaryColor, veh.primaryColor);
                  const isBound = !!assetBindings[veh.modelHash];

                  return (
                    <tr
                      key={veh.fileName}
                      className="hover:bg-autoverse-surface transition-colors"
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-200">{veh.realWorldModel}</td>
                      <td className="py-2.5 px-3 text-slate-300">{veh.manufacturer}</td>
                      <td className="py-2.5 px-3 text-slate-400">{veh.category}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: paint.hex }} />
                          <span className="text-[11px] text-slate-400">{paint.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isBound ? 'bg-emerald-950/60 text-emerald-300' : 'bg-amber-950/60 text-amber-300'
                        }`}>
                          {isBound ? 'Verified 3D' : 'Procedural'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-autoverse-cyan">{toHex32(veh.modelHash)}</td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        <button
                          onClick={() => setInspectedVehicle(veh)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => handleLaunchVehicle(veh.fileName)}
                          className="text-cyan-400 font-bold hover:underline"
                        >
                          Open Studio
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

      {/* Specification Inspector Modal */}
      {inspectedVehicle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-autoverse-surface border border-autoverse-border rounded max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-autoverse-border pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">{inspectedVehicle.realWorldModel}</h3>
                <span className="text-xs text-autoverse-muted">{inspectedVehicle.manufacturer} • {inspectedVehicle.category}</span>
              </div>
              <button
                onClick={() => setInspectedVehicle(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border space-y-1.5">
                <span className="text-slate-400 text-[11px] block uppercase">Chassis Geometry Telemetry</span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Overall Length:</span>
                  <span className="text-slate-200 font-bold">4,572 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Overall Width:</span>
                  <span className="text-slate-200 font-bold">1,900 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wheelbase:</span>
                  <span className="text-slate-200 font-bold">2,457 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ride Height / Clearance:</span>
                  <span className="text-slate-200 font-bold">100 mm</span>
                </div>
              </div>

              <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border space-y-1.5">
                <span className="text-slate-400 text-[11px] block uppercase">Asset & Model Identity</span>
                <div className="flex justify-between">
                  <span className="text-slate-400">JOAAT 32-bit Hash:</span>
                  <span className="text-autoverse-cyan font-bold">{toHex32(inspectedVehicle.modelHash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Plate:</span>
                  <span className="text-slate-200">{inspectedVehicle.plateText || 'NONE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Asset Binding:</span>
                  <span className={assetBindings[inspectedVehicle.modelHash] ? 'text-emerald-400' : 'text-amber-400'}>
                    {assetBindings[inspectedVehicle.modelHash] ? 'GLB Mesh Available' : 'Procedural Parametric Template'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-autoverse-border">
              <button
                onClick={() => setInspectedVehicle(null)}
                className="px-3 py-1.5 rounded bg-autoverse-elevated border border-autoverse-border text-xs text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const f = inspectedVehicle.fileName;
                  setInspectedVehicle(null);
                  handleLaunchVehicle(f);
                }}
                className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Open in 3D Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
