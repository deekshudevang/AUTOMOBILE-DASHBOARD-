import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Shield,
  Box,
  Sliders,
  Eye,
  Check,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import {
  VehicleComponentCatalog,
  ModularComponentItem,
  CompatibilityValidationResult,
  VEHICLE_HUB_SPECS
} from '../../geometry/components/vehicleComponentCatalog';

export const ComponentLibraryView: React.FC = () => {
  const { engineeringMode, selectComponent, setActiveView, activeModel } = useVehicleStore();

  const [selectedVehicleTarget, setSelectedVehicleTarget] = useState<string>('porsche_911_gt3_rs_992');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const catalog = VehicleComponentCatalog.getAllComponents();
  const [selectedComponent, setSelectedComponent] = useState<ModularComponentItem>(catalog[0]);

  const targetVehicles = [
    { id: 'porsche_911_gt3_rs_992', label: 'Porsche 911 GT3 RS (992)' },
    { id: 'lamborghini_aventador_svj', label: 'Lamborghini Aventador SVJ' },
    { id: 'ferrari_488_pista', label: 'Ferrari 488 Pista' },
    { id: 'all', label: 'Universal Catalog' }
  ];

  const categories = ['All', 'Aero', 'Body', 'Wheels', 'Chassis', 'Suspension', 'Cooling'];

  const filtered = catalog.filter(comp => {
    const matchesVehicle = selectedVehicleTarget === 'all' ||
      comp.vehicleCompatibility.includes('all') ||
      comp.vehicleCompatibility.includes(selectedVehicleTarget);
    const matchesCat = selectedCategory === 'All' || comp.category === selectedCategory;
    const matchesQuery = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVehicle && matchesCat && matchesQuery;
  });

  const compatResult: CompatibilityValidationResult = VehicleComponentCatalog.checkCompatibility(
    selectedVehicleTarget,
    selectedComponent
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VALID':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            VALID FITMENT
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            TOLERANCE WARNING
          </span>
        );
      case 'CONFLICT':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-orange-950/60 border border-orange-800 text-orange-300">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            GEOMETRIC CONFLICT
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            MECHANICALLY BLOCKED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            UNKNOWN
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Component Library & Modular Ecosystem</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-autoverse-elevated border border-autoverse-border text-autoverse-cyan">
              48+ MODEL-SPECIFIC PARTS
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Genuine model-specific components, aerodynamic packages, wheel assemblies, and real-time kinematic compatibility checks.
          </p>
        </div>

        {/* Target Vehicle Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target Vehicle:</span>
          <select
            value={selectedVehicleTarget}
            onChange={e => setSelectedVehicleTarget(e.target.value)}
            className="bg-autoverse-surface border border-autoverse-border rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-autoverse-cyan font-mono"
          >
            {targetVehicles.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 overflow-hidden">
        {/* Left Column: List & Filter */}
        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search components by name, datum, or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-autoverse-surface border border-autoverse-border rounded pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-autoverse-cyan"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-autoverse-elevated text-autoverse-cyan font-semibold border border-autoverse-borderLight'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Components Grid */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.map(comp => {
              const isSelected = selectedComponent.id === comp.id;
              const check = VehicleComponentCatalog.checkCompatibility(selectedVehicleTarget, comp);
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp)}
                  className={`p-3.5 rounded cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-autoverse-elevated border-autoverse-cyan shadow-sm'
                      : 'bg-autoverse-surface border-autoverse-border hover:border-autoverse-borderLight'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-100">{comp.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-cyan-950/60 border-cyan-800 text-cyan-300">
                          {comp.category}
                        </span>
                        {comp.hubInterface && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-slate-800/60 border-slate-700 text-slate-300">
                            {comp.hubInterface}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-autoverse-muted mt-1 leading-relaxed line-clamp-1">
                        {comp.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-200">{comp.massKg} kg</span>
                      <div className="mt-1">
                        {check.status === 'VALID' && (
                          <span className="text-[10px] font-mono text-emerald-400">● VALID</span>
                        )}
                        {check.status === 'WARNING' && (
                          <span className="text-[10px] font-mono text-amber-400">▲ WARN</span>
                        )}
                        {check.status === 'CONFLICT' && (
                          <span className="text-[10px] font-mono text-orange-400">✕ CONFLICT</span>
                        )}
                        {check.status === 'BLOCKED' && (
                          <span className="text-[10px] font-mono text-rose-400">✕ BLOCKED</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Component Details & Compatibility Inspector */}
        <div className="lg:col-span-1 p-5 rounded bg-autoverse-surface border border-autoverse-border flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="border-b border-autoverse-border pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-autoverse-cyan">{selectedComponent.category}</span>
                {getStatusBadge(compatResult.status)}
              </div>
              <h2 className="text-sm font-bold text-slate-100 mt-1.5">{selectedComponent.name}</h2>
              <p className="text-xs text-autoverse-muted mt-1 leading-relaxed">
                {selectedComponent.description}
              </p>
            </div>

            {/* Specification Metrics */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Mass Specification</span>
                <span className="font-mono font-medium text-slate-200">{selectedComponent.massKg} kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Mount Datum Anchor</span>
                <span className="font-mono text-[11px] text-emerald-400">{selectedComponent.mountingDatum}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Provenance Class</span>
                <span className="font-mono text-[11px] text-autoverse-cyan">{selectedComponent.provenance}</span>
              </div>
              {selectedComponent.hubInterface && (
                <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                  <span className="text-slate-400">Hub / Spline Type</span>
                  <span className="font-mono text-[11px] text-slate-200">{selectedComponent.hubInterface}</span>
                </div>
              )}
              {selectedComponent.boltPattern && (
                <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                  <span className="text-slate-400">Bolt Pattern</span>
                  <span className="font-mono text-[11px] text-slate-300">{selectedComponent.boltPattern}</span>
                </div>
              )}
            </div>

            {/* Compatibility Analysis Card */}
            <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border space-y-2">
              <h3 className="text-[11px] font-mono uppercase text-autoverse-muted">Kinematic & Fitment Audit</h3>

              {compatResult.reasons.length > 0 && (
                <div className="space-y-1">
                  {compatResult.reasons.map((r, i) => (
                    <p key={i} className="text-[11px] text-rose-300 leading-snug">
                      {r}
                    </p>
                  ))}
                </div>
              )}

              {compatResult.warnings.length > 0 && (
                <div className="space-y-1">
                  {compatResult.warnings.map((w, i) => (
                    <p key={i} className="text-[11px] text-amber-300 leading-snug">
                      {w}
                    </p>
                  ))}
                </div>
              )}

              {compatResult.passed && compatResult.warnings.length === 0 && (
                <p className="text-[11px] text-emerald-300">
                  All kinematic clearances, bolt alignments, and dynamic travel envelopes fully verified. Certified for physical installation and CFD aerodynamic solving.
                </p>
              )}

              <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-autoverse-border">
                <div>
                  <span className="text-slate-500">Steering Clearance:</span>
                  <span className="ml-1 text-slate-200">{compatResult.kinematicChecks.steeringClearanceMm} mm</span>
                </div>
                <div>
                  <span className="text-slate-500">Suspension Travel:</span>
                  <span className="ml-1 text-slate-200">+{compatResult.kinematicChecks.suspensionTravelMm} mm</span>
                </div>
              </div>
            </div>

            {/* Compatibility whitelist */}
            <div className="pt-1">
              <h3 className="text-[11px] font-mono uppercase text-autoverse-muted mb-1.5">Official Platform Models</h3>
              <div className="space-y-1">
                {selectedComponent.vehicleCompatibility.map(m => (
                  <div key={m} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-[11px]">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-autoverse-border space-y-2">
            <button
              onClick={() => {
                selectComponent(selectedComponent.id);
                setActiveView('componentEditor');
              }}
              className="w-full py-2.5 rounded bg-autoverse-cyan hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Open in Parametric Editor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
