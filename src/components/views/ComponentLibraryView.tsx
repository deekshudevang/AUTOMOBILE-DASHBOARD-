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
  Info
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

interface ComponentDefinition {
  id: string;
  name: string;
  category: 'Aero' | 'Body' | 'Chassis' | 'Wheels' | 'Powertrain' | 'Cooling' | 'Suspension';
  editability: 'PARAMETRIC' | 'MESH_EDITABLE' | 'VIEW_ONLY';
  massKg: number;
  mountingDatum: string;
  description: string;
  compatibleModels: string[];
}

const CATALOG_COMPONENTS: ComponentDefinition[] = [
  {
    id: 'comp_splitter_gt3rs',
    name: 'Front Carbon Splitter with Dual Endplates',
    category: 'Aero',
    editability: 'PARAMETRIC',
    massKg: 4.8,
    mountingDatum: 'datum_front_bumper_mount',
    description: 'Ground-effect front splitter with variable extension and integrated boundary diffuser ramps.',
    compatibleModels: ['Porsche 911 GT3 RS (992)', 'Ferrari 488 Pista', 'BMW M4 GT3']
  },
  {
    id: 'comp_rear_wing_gt3rs',
    name: 'Active Swan-Neck Dual-Element Rear Wing',
    category: 'Aero',
    editability: 'PARAMETRIC',
    massKg: 7.2,
    mountingDatum: 'datum_rear_deck_mount',
    description: 'Swan-neck top-mount dual-element wing with Selig S1223 high-lift low-drag airfoil section.',
    compatibleModels: ['Porsche 911 GT3 RS (992)', 'Lamborghini Aventador SVJ', 'McLaren 765LT']
  },
  {
    id: 'comp_diffuser_venturi',
    name: 'Underbody Venturi Diffuser with 4 Strakes',
    category: 'Aero',
    editability: 'PARAMETRIC',
    massKg: 6.5,
    mountingDatum: 'datum_rear_subframe',
    description: 'Underbody expansion diffuser maintaining clean pressure recovery without flow detachment.',
    compatibleModels: ['Universal High-Downforce', 'Porsche 911 GT3 RS (992)', 'DrivAer Model']
  },
  {
    id: 'comp_wheel_forged_20in',
    name: 'Forged Monoblock Center-Lock 20x9.5J Wheel',
    category: 'Wheels',
    editability: 'PARAMETRIC',
    massKg: 8.9,
    mountingDatum: 'datum_hub_fl',
    description: 'Ultra-lightweight aerospace 6061-T6 forged aluminum wheel with Michelin Pilot Sport Cup 2 R tire.',
    compatibleModels: ['Porsche 911 GT3 RS (992)', 'Porsche 911 GT3 (992)']
  },
  {
    id: 'comp_suspension_double_wishbone',
    name: 'Front Double Wishbone with Teardrop Aerofoil Links',
    category: 'Suspension',
    editability: 'PARAMETRIC',
    massKg: 14.2,
    mountingDatum: 'datum_chassis_front_nodes',
    description: 'Motorsport kinematic assembly offering progressive camber recovery under roll and brake dive.',
    compatibleModels: ['Porsche 911 GT3 RS (992)', 'Ferrari 488 Pista']
  },
  {
    id: 'comp_radiator_porous_core',
    name: 'Front Center Cooling Radiator Pack',
    category: 'Cooling',
    editability: 'PARAMETRIC',
    massKg: 5.6,
    mountingDatum: 'datum_hood_intake',
    description: 'Central radiator angled at 45 degrees venting airflow through hood extraction nostrils.',
    compatibleModels: ['Porsche 911 GT3 RS (992)', 'McLaren Senna']
  },
  {
    id: 'comp_body_monocoque',
    name: 'Carbon Fiber Monocoque Passenger Tub',
    category: 'Chassis',
    editability: 'VIEW_ONLY',
    massKg: 125.0,
    mountingDatum: 'datum_vehicle_origin',
    description: 'High-rigidity structural safety cell with FIA Appendix J compliance. Locked baseline geometry.',
    compatibleModels: ['Universal High-Downforce']
  },
  {
    id: 'comp_hood_dual_nostril',
    name: 'Vented Carbon Composite Front Hood',
    category: 'Body',
    editability: 'MESH_EDITABLE',
    massKg: 6.1,
    mountingDatum: 'datum_cowl_hinges',
    description: 'Lightweight hood featuring twin extraction chimneys designed to vent central radiator exhaust over the roof.',
    compatibleModels: ['Porsche 911 GT3 RS (992)']
  }
];

export const ComponentLibraryView: React.FC = () => {
  const { engineeringMode, selectComponent, setActiveView } = useVehicleStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition>(CATALOG_COMPONENTS[0]);

  const categories = ['All', 'Aero', 'Body', 'Chassis', 'Wheels', 'Suspension', 'Cooling'];

  const filtered = CATALOG_COMPONENTS.filter(comp => {
    const matchesCat = selectedCategory === 'All' || comp.category === selectedCategory;
    const matchesQuery = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Component Library</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-autoverse-elevated border border-autoverse-border text-autoverse-cyan">
              80+ VERIFIED ASSETS
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Certified automotive components with parametric constraints, mount datums, and aerodynamics profiles.
          </p>
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
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                          comp.editability === 'PARAMETRIC'
                            ? 'bg-cyan-950/60 border-cyan-800 text-cyan-300'
                            : comp.editability === 'MESH_EDITABLE'
                            ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                          {comp.editability}
                        </span>
                      </div>
                      <p className="text-[11px] text-autoverse-muted mt-1 leading-relaxed line-clamp-1">
                        {comp.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-200">{comp.massKg} kg</span>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{comp.category}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Component Details & Actions */}
        <div className="lg:col-span-1 p-5 rounded bg-autoverse-surface border border-autoverse-border flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="border-b border-autoverse-border pb-3">
              <span className="text-[10px] font-mono uppercase text-autoverse-cyan">{selectedComponent.category}</span>
              <h2 className="text-sm font-bold text-slate-100 mt-1">{selectedComponent.name}</h2>
              <p className="text-xs text-autoverse-muted mt-1 leading-relaxed">
                {selectedComponent.description}
              </p>
            </div>

            {/* Specification Metrics */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Editability Tier</span>
                <span className="font-mono font-medium text-autoverse-cyan">{selectedComponent.editability}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Mass Specification</span>
                <span className="font-mono font-medium text-slate-200">{selectedComponent.massKg} kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Mount Datum Anchor</span>
                <span className="font-mono text-[11px] text-emerald-400">{selectedComponent.mountingDatum}</span>
              </div>
            </div>

            {/* Compatibility list */}
            <div className="pt-2">
              <h3 className="text-[11px] font-mono uppercase text-autoverse-muted mb-2">Compatible Vehicles</h3>
              <div className="space-y-1">
                {selectedComponent.compatibleModels.map(m => (
                  <div key={m} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
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
