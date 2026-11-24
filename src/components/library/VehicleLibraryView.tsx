import React, { useState, useMemo } from 'react';
import {
  Search,
  Grid,
  List,
  ArrowRight,
  Car,
  Star,
  Eye,
  X,
  SlidersHorizontal,
  ShieldCheck,
  Wind,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { toHex32 } from '../../utils/joaat';
import { resolveVehicleColor } from '../../utils/colorUtils';
import { VehicleFileSummary } from '../../types/vehicle';
import { BrandBadge } from '../ui/BrandBadge';
import { VehicleCard } from './VehicleCard';
import { getManufacturerBrand } from '../../data/manufacturerBrands';
import { getVehicleTechnicalSpecs } from '../../data/vehicleTechnicalSpecs';
import libraryIndex from '../../../public/vehicles/index.json';

const FLEET_CATEGORIES = [
  { id: 'all', label: 'All 50 Supercars' },
  { id: 'Supercar', label: 'Supercars' },
  { id: 'Hypercar', label: 'Hypercars' },
  { id: 'Track Car', label: 'Track Specials' },
  { id: 'Sports Car', label: 'Sports Cars' },
  { id: 'Luxury Car', label: 'Luxury GT' },
  { id: 'JDM Performance', label: 'JDM Performance' },
  { id: 'Muscle', label: 'Muscle' },
  { id: 'Special / Concept', label: 'Concepts & Specials' }
];

export const VehicleLibraryView: React.FC = () => {
  const {
    allFiles,
    activeFile,
    assetBindings,
    loadVehicleByFile,
    setActiveView,
    isLegacyCatalogLoaded,
    loadLegacyGtaCatalog
  } = useVehicleStore();

  const [fleetScope, setFleetScope] = useState<'schema2' | 'all'>('schema2');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'power' | 'speed' | 'weight'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Technical Specification Inspector state
  const [inspectedVehicle, setInspectedVehicle] = useState<VehicleFileSummary | null>(null);

  // Map asset dimensions from libraryIndex
  const assetDimensionsMap = useMemo(() => {
    const map = new Map<string, any>();
    if (libraryIndex && libraryIndex.assets) {
      for (const asset of libraryIndex.assets) {
        if (asset.file) map.set(asset.file, asset.dimensions);
        if (asset.asset_id) map.set(asset.asset_id, asset.dimensions);
        const bareName = asset.file.split('/').pop()?.replace('.json', '');
        if (bareName) map.set(bareName, asset.dimensions);
      }
    }
    return map;
  }, []);

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
    const counts = new Map<string, number>();
    const source = fleetScope === 'schema2' ? allFiles.filter(isSchema2Vehicle) : allFiles;

    source.forEach(m => {
      counts.set(m.manufacturer, (counts.get(m.manufacturer) || 0) + 1);
    });

    const sorted = Array.from(counts.keys()).sort();
    return [
      { name: 'All', count: source.length },
      ...sorted.map(name => ({ name, count: counts.get(name) || 0 }))
    ];
  }, [allFiles, fleetScope, assetBindings]);

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
      const matchFleet = fleetScope === 'all' || isSchema2Vehicle(veh);

      const matchSearch =
        searchTerm === '' ||
        veh.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.realWorldModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.plateText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veh.modelHash.toString().includes(searchTerm) ||
        toHex32(veh.modelHash).toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat =
        selectedCategory === 'all' || veh.category === selectedCategory;

      const matchMan =
        selectedManufacturer === 'All' || veh.manufacturer === selectedManufacturer;

      return matchFleet && matchSearch && matchCat && matchMan;
    });

    list.sort((a, b) => {
      if (sortBy === 'power') {
        const specA = getVehicleTechnicalSpecs(a.fileName);
        const specB = getVehicleTechnicalSpecs(b.fileName);
        return specB.powerHp - specA.powerHp;
      }
      if (sortBy === 'speed') {
        const specA = getVehicleTechnicalSpecs(a.fileName);
        const specB = getVehicleTechnicalSpecs(b.fileName);
        return specB.topSpeedKmh - specA.topSpeedKmh;
      }
      if (sortBy === 'weight') {
        const specA = getVehicleTechnicalSpecs(a.fileName);
        const specB = getVehicleTechnicalSpecs(b.fileName);
        return specA.weightKg - specB.weightKg;
      }
      // default: model alphabetical
      return a.realWorldModel.localeCompare(b.realWorldModel);
    });

    return list;
  }, [allFiles, fleetScope, searchTerm, selectedCategory, selectedManufacturer, sortBy, assetBindings]);

  const handleLaunchVehicle = (fileName: string) => {
    loadVehicleByFile(fileName);
    setActiveView('studio');
  };

  const handleLaunchAero = (fileName: string) => {
    loadVehicleByFile(fileName);
    setActiveView('aeroStudio');
  };

  const handleLaunchCad = (fileName: string) => {
    loadVehicleByFile(fileName);
    setActiveView('cadDesigner');
  };

  // Current inspected specs
  const inspectedSpecs = useMemo(() => {
    if (!inspectedVehicle) return null;
    return getVehicleTechnicalSpecs(inspectedVehicle.fileName);
  }, [inspectedVehicle]);

  const inspectedDimensions = useMemo(() => {
    if (!inspectedVehicle) return null;
    return (
      assetDimensionsMap.get(inspectedVehicle.fileName) ||
      assetDimensionsMap.get(inspectedVehicle.modelCode) || {
        length: 4.6,
        width: 1.95,
        height: 1.2,
        wheelbase: 2.65,
        frontTrack: 1.68,
        rearTrack: 1.65,
        groundClearance: 0.11
      }
    );
  }, [inspectedVehicle, assetDimensionsMap]);

  return (
    <div className="h-full flex flex-col bg-gt-obsidian overflow-hidden text-gt-text-primary">
      {/* Top Filter & Command Bar */}
      <div className="p-4 sm:p-5 border-b border-gt-border bg-gt-basalt space-y-4 shrink-0 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/80 flex items-center justify-center">
                <Car className="w-4 h-4 text-gt-accent" />
              </div>
              <h1 className="text-xl font-heading font-bold tracking-wide text-white">
                Vehicle Fleet Paddock
              </h1>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-gt-graphite text-gt-accent border border-gt-border font-semibold">
                {filteredFiles.length} / {allFiles.length} Supercars
              </span>
            </div>
            <p className="text-xs text-gt-text-secondary mt-1 font-sans">
              Precision Schema 2.0 kinematic aperture chassis, manufacturer-verified aerodynamics, and CAD reference geometries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Fleet Tier Scope Switcher */}
            <div className="flex items-center bg-gt-obsidian rounded-lg border border-gt-border p-1 text-xs">
              <button
                onClick={() => setFleetScope('schema2')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  fleetScope === 'schema2'
                    ? 'bg-red-950/80 text-white border border-red-800 shadow-sm'
                    : 'text-gt-text-secondary hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-gt-accent" />
                <span>AutoVerse 50 Fleet</span>
              </button>
              <button
                onClick={() => {
                  setFleetScope('all');
                  if (!isLegacyCatalogLoaded) {
                    loadLegacyGtaCatalog();
                  }
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  fleetScope === 'all'
                    ? 'bg-red-950/80 text-white border border-red-800 shadow-sm'
                    : 'text-gt-text-secondary hover:text-white'
                }`}
              >
                <span>Full Catalog ({allFiles.length})</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-gt-obsidian rounded-lg border border-gt-border px-2.5 py-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="name" className="bg-gt-basalt text-white">Model Name</option>
                <option value="power" className="bg-gt-basalt text-white">Horsepower (Highest)</option>
                <option value="speed" className="bg-gt-basalt text-white">Top Speed (Fastest)</option>
                <option value="weight" className="bg-gt-basalt text-white">Weight (Lightest)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gt-obsidian rounded-lg border border-gt-border p-1 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-gt-graphite text-white shadow-sm' : 'text-zinc-500 hover:text-white'
                }`}
                title="Luxury Showroom Grid"
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-gt-graphite text-white shadow-sm' : 'text-zinc-500 hover:text-white'
                }`}
                title="Engineering Telemetry Table"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          {/* Real-time Search */}
          <div className="relative flex items-center md:col-span-5">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by model, brand, powertrain, chassis code..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gt-obsidian border border-gt-border rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gt-accent focus:ring-1 focus:ring-gt-accent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 text-zinc-500 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Manufacturer Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedManufacturer}
              onChange={e => setSelectedManufacturer(e.target.value)}
              className="w-full bg-gt-obsidian border border-gt-border rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-gt-accent font-medium cursor-pointer"
            >
              {manufacturers.map(m => (
                <option key={m.name} value={m.name} className="bg-gt-basalt text-white">
                  {m.name === 'All' ? `All Manufacturers (${m.count})` : `${m.name} (${m.count})`}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Clear indicator */}
          <div className="md:col-span-3 flex items-center justify-between gap-2 px-1">
            <span className="text-[11px] font-mono text-zinc-400">
              Showing {filteredFiles.length} models
            </span>
            {(searchTerm || selectedCategory !== 'all' || selectedManufacturer !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedManufacturer('All');
                }}
                className="text-[11px] text-gt-accent hover:underline font-mono"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {FLEET_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-red-950/80 text-white border border-red-800 shadow-sm font-semibold'
                    : 'bg-gt-obsidian text-zinc-400 hover:text-zinc-200 border border-gt-border hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
            <Car className="w-12 h-12 text-zinc-600 stroke-[1.5]" />
            <h3 className="text-base font-heading font-bold text-zinc-300">No vehicles match your search criteria</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              Try adjusting your keywords or clearing the active manufacturer and category filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedManufacturer('All');
              }}
              className="px-4 py-2 rounded-md bg-gt-graphite border border-gt-border text-xs text-white hover:border-gt-accent font-medium transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Luxury Showroom Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredFiles.map(veh => {
              const isCurrent = activeFile === veh.fileName || activeFile.endsWith(veh.fileName);
              const dims =
                assetDimensionsMap.get(veh.fileName) ||
                assetDimensionsMap.get(veh.modelCode);

              return (
                <VehicleCard
                  key={veh.fileName}
                  vehicle={veh}
                  dimensions={dims}
                  isCurrent={isCurrent}
                  isFavorite={favorites.has(veh.fileName)}
                  onToggleFavorite={toggleFavorite}
                  onInspect={setInspectedVehicle}
                  onLaunch={handleLaunchVehicle}
                />
              );
            })}
          </div>
        ) : (
          /* Engineering Telemetry Table (List View) */
          <div className="border border-gt-border rounded-xl overflow-hidden bg-gt-basalt shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-gt-graphite/80 border-b border-gt-border text-zinc-400 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Vehicle Model</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Powertrain</th>
                    <th className="py-3 px-4 text-center">Power</th>
                    <th className="py-3 px-4 text-center">Top Speed</th>
                    <th className="py-3 px-4 text-center">0-100</th>
                    <th className="py-3 px-4 text-center">Weight</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-gt-obsidian">
                  {filteredFiles.map(veh => {
                    const specs = getVehicleTechnicalSpecs(veh.fileName);
                    const isCurrent = activeFile === veh.fileName || activeFile.endsWith(veh.fileName);

                    return (
                      <tr
                        key={veh.fileName}
                        onClick={() => handleLaunchVehicle(veh.fileName)}
                        className={`hover:bg-white/5 transition-colors cursor-pointer ${
                          isCurrent ? 'bg-red-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          {isCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gt-accent" />
                          )}
                          <span className="truncate max-w-[220px]">{veh.realWorldModel || veh.displayName}</span>
                        </td>
                        <td className="py-3 px-4 text-zinc-300">
                          <BrandBadge manufacturer={veh.manufacturer} size="xs" showWordmark={true} />
                        </td>
                        <td className="py-3 px-4 text-zinc-400">{veh.category}</td>
                        <td className="py-3 px-4 text-zinc-300 text-[11px] truncate max-w-[180px]">{specs.powertrain}</td>
                        <td className="py-3 px-4 text-center font-bold text-white tabular-nums">{specs.powerHp} HP</td>
                        <td className="py-3 px-4 text-center font-bold text-white tabular-nums">{specs.topSpeedKmh} KMH</td>
                        <td className="py-3 px-4 text-center text-zinc-300 tabular-nums">{specs.zeroToHundredS}s</td>
                        <td className="py-3 px-4 text-center text-zinc-300 tabular-nums">{specs.weightKg} kg</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setInspectedVehicle(veh);
                            }}
                            className="px-2 py-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 text-[11px]"
                          >
                            Specs
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleLaunchVehicle(veh.fileName);
                            }}
                            className="px-2.5 py-1 rounded bg-gt-accent hover:bg-red-600 text-white font-bold text-[11px] transition-colors"
                          >
                            Atelier
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Technical Specification Inspector Modal */}
      {inspectedVehicle && inspectedSpecs && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-gt-basalt border border-gt-border rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gt-border pb-4">
              <div className="flex items-center gap-3">
                <BrandBadge manufacturer={inspectedVehicle.manufacturer} size="md" />
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">
                    {inspectedVehicle.realWorldModel}
                  </h3>
                  <p className="text-xs text-gt-text-secondary font-mono mt-0.5">
                    {inspectedVehicle.manufacturer} • {inspectedVehicle.category} • {toHex32(inspectedVehicle.modelHash)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectedVehicle(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Sections */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Powertrain & Telemetry */}
              <div className="p-4 rounded-xl bg-gt-obsidian border border-gt-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-gt-accent">
                    Powertrain & Performance Telemetry
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gt-graphite text-zinc-300 border border-white/10">
                    {inspectedSpecs.drivetrain}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
                  <div>
                    <span className="text-zinc-500 text-[10px] block">ENGINE CONFIG</span>
                    <span className="text-white font-medium">{inspectedSpecs.powertrain}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">POWER OUTPUT</span>
                    <span className="text-white font-bold tabular-nums">{inspectedSpecs.powerHp} HP</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">PEAK TORQUE</span>
                    <span className="text-white font-bold tabular-nums">{inspectedSpecs.torqueNm} Nm</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">ACCELERATION</span>
                    <span className="text-white font-bold tabular-nums">0-100: {inspectedSpecs.zeroToHundredS}s</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2 border-t border-white/5">
                  <div>
                    <span className="text-zinc-500 text-[10px] block">TOP VELOCITY</span>
                    <span className="text-white font-bold tabular-nums">{inspectedSpecs.topSpeedKmh} km/h</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">DRAG (CD)</span>
                    <span className="text-white font-bold tabular-nums">{inspectedSpecs.dragCoefficient}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">DOWNFORCE</span>
                    <span className="text-white font-bold tabular-nums">{inspectedSpecs.downforceKg} kg</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">CURB WEIGHT</span>
                    <span className="text-white font-bold tabular-nums">{inspectedSpecs.weightKg} kg</span>
                  </div>
                </div>
              </div>

              {/* Chassis Geometry */}
              {inspectedDimensions && (
                <div className="p-4 rounded-xl bg-gt-obsidian border border-gt-border space-y-2.5">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-gt-info block">
                    Chassis & Kinematics Blueprint
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">LENGTH</span>
                      <span className="text-white font-bold tabular-nums">{(inspectedDimensions.length * 1000).toFixed(0)} mm</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">WIDTH</span>
                      <span className="text-white font-bold tabular-nums">{(inspectedDimensions.width * 1000).toFixed(0)} mm</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">HEIGHT</span>
                      <span className="text-white font-bold tabular-nums">{(inspectedDimensions.height * 1000).toFixed(0)} mm</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">WHEELBASE</span>
                      <span className="text-white font-bold tabular-nums">{(inspectedDimensions.wheelbase * 1000).toFixed(0)} mm</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Door Aperture Mechanism:</span>
                    <span className="text-gt-accent font-bold">{inspectedSpecs.doorMechanism}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gt-border">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const f = inspectedVehicle.fileName;
                    setInspectedVehicle(null);
                    handleLaunchAero(f);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gt-graphite hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-gt-border"
                >
                  <Wind className="w-3.5 h-3.5 text-gt-info" />
                  <span>Wind Tunnel</span>
                </button>

                <button
                  onClick={() => {
                    const f = inspectedVehicle.fileName;
                    setInspectedVehicle(null);
                    handleLaunchCad(f);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gt-graphite hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-gt-border"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>CAD Wireframe</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectedVehicle(null)}
                  className="px-3 py-1.5 rounded-lg bg-gt-obsidian text-zinc-400 hover:text-white border border-gt-border text-xs"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    const f = inspectedVehicle.fileName;
                    setInspectedVehicle(null);
                    handleLaunchVehicle(f);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-gt-accent hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <span>Launch in 3D Atelier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
